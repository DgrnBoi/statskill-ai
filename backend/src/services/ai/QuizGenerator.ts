import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export class QuizGeneratorService {
  constructor() {}

  async generateFromPdf(filePath: string, numQuestions: number, difficulty: string, mode: string = 'CLOUD_RAG', courseId: string = 'default_course') {
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || "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";
    
    // In Edge Mock mode, return mock instantly
    if (mode === 'POTATO_DEVICE') {
      return {
        questions: [
          {
            question: "What is the primary purpose of stratification in survey design?",
            options: ["To increase sample size", "To reduce sampling variance", "To eliminate non-sampling errors", "To simplify data collection"],
            correctAnswer: "To reduce sampling variance",
            explanation: "Stratification groups similar units together, which reduces the overall variance of the estimates.",
            sourceCitation: "Module 1: Survey Design"
          },
          {
            question: "In a two-stage stratified design, what does FSU stand for?",
            options: ["Final Sampling Unit", "First Stage Unit", "Fundamental Survey Unit", "Field Supervisor Unit"],
            correctAnswer: "First Stage Unit",
            explanation: "FSU refers to the First Stage Unit selected in a multi-stage sampling design, such as a village or urban block.",
            sourceCitation: "Module 1: Survey Design"
          }
        ]
      };
    }

    // 1. Check Local SQLite/JSON Database Cache FIRST
    const bankPath = path.join(__dirname, '../../data/question_bank.json');
    if (fs.existsSync(bankPath)) {
      try {
        const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
        const courseQuestions = bank.filter((q: any) => q.courseId === courseId);
        
        // If we already have enough generated questions in the DB for this PDF, serve from DB!
        if (courseQuestions.length >= numQuestions) {
          console.log(`[Cache Hit] Serving ${numQuestions} questions from local DB for course: ${courseId}`);
          const shuffled = courseQuestions.sort(() => 0.5 - Math.random());
          return { questions: shuffled.slice(0, numQuestions) };
        }
      } catch (err) {
        console.error("DB Read Error", err);
      }
    }

    // 2. Not enough in cache? Parse PDF and hit LLM
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text;

    fs.unlinkSync(filePath); // Clean up temp file

    if (!textContent || textContent.trim().length === 0) {
      throw new Error("Could not extract text from the PDF.");
    }

    const truncatedText = textContent.substring(0, 5000); 

    const systemPrompt = `You are an expert examiner for the Indian Government. Generate ${numQuestions} multiple choice questions based on the text provided. 
The difficulty should be ${difficulty}.
Return ONLY a raw valid JSON object with the following schema:
{
  "questions": [
    {
      "question": "The question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact string of the correct option",
      "explanation": "Why this is correct based on the text",
      "sourceCitation": "Short reference to the topic"
    }
  ]
}`;

    try {
      console.log(`[Cloud RAG] Cache miss. Routing prompt to Groq API...`);
      
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
            { role: "user", content: `Text:\n${truncatedText}` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const generatedText = data.choices[0].message.content;
      const parsedQuiz = JSON.parse(generatedText);

      // 3. Save new questions to the Database Cache
      parsedQuiz.questions.forEach((q: any) => {
        q.courseId = courseId; // Tag with metadata
      });
      
      let bank: any[] = [];
      if (fs.existsSync(bankPath)) {
        bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
      }
      // Ensure the data directory exists
      if (!fs.existsSync(path.join(__dirname, '../../data'))) {
        fs.mkdirSync(path.join(__dirname, '../../data'), { recursive: true });
      }
      bank = [...bank, ...parsedQuiz.questions];
      fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
      console.log(`[Cache Write] Saved ${parsedQuiz.questions.length} new questions to DB for ${courseId}`);

      return parsedQuiz;
    } catch (error: any) {
      console.error("[Guardrail] AI Error:", error);
      throw new Error(`The AI failed to process the document: ${error.message}`);
    }
  }
}
