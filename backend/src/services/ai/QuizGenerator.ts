import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { AntiCopyEngine, QuestionItem, ShuffledExamPaper } from './AntiCopyEngine';

export interface QuizResult extends ShuffledExamPaper {
  mode: 'CLOUD_RAG' | 'EDGE_OFFLINE';
  sourceDocument: string;
}

export class QuizGeneratorService {
  private bankPath: string;

  constructor() {
    this.bankPath = path.join(__dirname, '../../data/question_bank.json');
  }

  /**
   * Helper: Read local Question Bank safely
   */
  private getLocalBank(): QuestionItem[] {
    try {
      if (fs.existsSync(this.bankPath)) {
        return JSON.parse(fs.readFileSync(this.bankPath, 'utf8'));
      }
    } catch (err) {
      console.error("[QuestionBank] Error reading question_bank.json:", err);
    }
    return [];
  }

  /**
   * Helper: Save questions to the local Question Bank
   */
  private saveToBank(newQuestions: QuestionItem[]) {
    try {
      const dataDir = path.dirname(this.bankPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const existingBank = this.getLocalBank();
      const existingQuestions = new Set(existingBank.map(q => q.question.toLowerCase().trim()));

      const toAdd = newQuestions.filter(q => !existingQuestions.has(q.question.toLowerCase().trim()));

      if (toAdd.length > 0) {
        const updated = [...existingBank, ...toAdd];
        fs.writeFileSync(this.bankPath, JSON.stringify(updated, null, 2));
        console.log(`[QuestionBank] Successfully cached ${toAdd.length} fresh questions. Total bank size: ${updated.length}`);
      }
    } catch (err) {
      console.error("[QuestionBank] Error saving to question_bank.json:", err);
    }
  }

  /**
   * Generates or retrieves an examination paper.
   * - In Offline / Potato Mode: Pulls from the local Question Bank and runs through AntiCopyEngine.
   * - In Cloud RAG Mode: Parses the PDF, calls the LLM, enriches the local bank, and shuffles with AntiCopyEngine.
   */
  async generateFromPdf(
    filePath?: string,
    numQuestions: number = 3,
    difficulty: string = 'intermediate',
    mode: string = 'CLOUD_RAG',
    courseId: string = 'Survey Design and Stratification'
  ): Promise<QuizResult> {
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "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";
    const isPotatoOrOffline = mode === 'POTATO_DEVICE' || mode === 'OFFLINE';

    // -------------------------------------------------------------
    // PATHWAY 1: OFFLINE / POTATO / LOW-NETWORK MODE
    // -------------------------------------------------------------
    if (isPotatoOrOffline || !filePath) {
      console.log(`[AntiCopyEngine] Generating offline exam from local Question Bank for: ${courseId}`);
      const bank = this.getLocalBank();

      // Filter by course/topic if matching questions exist, otherwise use full bank
      let pool = bank.filter(q => q.courseId && q.courseId.toLowerCase().includes(courseId.toLowerCase()));
      if (pool.length < numQuestions) {
        pool = bank; // Fallback to entire verified pool
      }

      // Generate randomized Anti-Copy Paper (Shuffled questions + Shuffled options)
      const antiCopyPaper = AntiCopyEngine.generateAntiCopyPaper(pool, numQuestions);

      return {
        ...antiCopyPaper,
        mode: 'EDGE_OFFLINE',
        sourceDocument: courseId
      };
    }

    // -------------------------------------------------------------
    // PATHWAY 2: ONLINE / CLOUD RAG GENERATION
    // -------------------------------------------------------------
    try {
      // 1. Check local bank first for exact course match to conserve tokens
      const bank = this.getLocalBank();
      const existingForCourse = bank.filter(q => q.courseId === courseId);
      
      if (existingForCourse.length >= numQuestions) {
        console.log(`[Cache Hit] Serving ${numQuestions} questions from local DB with anti-copy randomization for: ${courseId}`);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); // Cleanup temp upload
        
        const antiCopyPaper = AntiCopyEngine.generateAntiCopyPaper(existingForCourse, numQuestions);
        return {
          ...antiCopyPaper,
          mode: 'CLOUD_RAG',
          sourceDocument: courseId
        };
      }

      // 2. Cache miss -> Parse PDF text
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const textContent = pdfData.text;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Cleanup temp file
      }

      if (!textContent || textContent.trim().length === 0) {
        throw new Error("Could not extract readable text from the uploaded PDF.");
      }

      // Expand context window to 10,000 characters for deeper analysis
      const extractedSnippet = textContent.substring(0, 10000);

      const systemPrompt = `You are a senior psychometrician and examiner for the Indian Official Statistical System (MoSPI / NSSTA).
Generate exactly ${numQuestions} rigorous, non-trivial multiple-choice questions based ONLY on the provided training text.
Difficulty level: ${difficulty}.

Requirements:
1. Every question must have exactly 4 plausible options.
2. Distractors must reflect authentic statistical misconceptions.
3. The correct answer must be unambiguous and directly verifiable in the text.
4. Provide a clear pedagogical explanation and specific source citation.

Output MUST be a valid JSON object matching this exact schema:
{
  "questions": [
    {
      "question": "Clear question stem?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact string of correct option",
      "explanation": "Detailed explanation why this option is correct based on the text.",
      "sourceCitation": "Section or paragraph reference"
    }
  ]
}`;

      console.log(`[Cloud RAG] Routing document snippet (${extractedSnippet.length} chars) to Groq API...`);
      
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Training Document Text:\n${extractedSnippet}` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const generatedContent = JSON.parse(data.choices[0].message.content);
      const generatedQuestions: QuestionItem[] = generatedContent.questions || [];

      // Tag new questions with courseId
      generatedQuestions.forEach((q, idx) => {
        q.id = `qb-ai-${Date.now()}-${idx + 1}`;
        q.courseId = courseId;
        q.bloomLevel = difficulty === 'hard' ? 'Analysis' : difficulty === 'easy' ? 'Recall' : 'Application';
      });

      // 3. Incrementally enrich the local Question Bank for future offline use!
      this.saveToBank(generatedQuestions);

      // 4. Pass the newly formulated questions through the Anti-Copy Shuffler
      const antiCopyPaper = AntiCopyEngine.generateAntiCopyPaper(generatedQuestions, numQuestions);

      return {
        ...antiCopyPaper,
        mode: 'CLOUD_RAG',
        sourceDocument: courseId
      };

    } catch (error: any) {
      console.error("[QuizGenerator Error]:", error);
      // Failover Gracefully to the local Question Bank if cloud LLM fails
      console.log("[Failover] Cloud RAG failed. Falling back to local verified Question Bank...");
      const bank = this.getLocalBank();
      const antiCopyPaper = AntiCopyEngine.generateAntiCopyPaper(bank, numQuestions);
      return {
        ...antiCopyPaper,
        mode: 'EDGE_OFFLINE',
        sourceDocument: courseId + ' (Local Failover)'
      };
    }
  }
}
