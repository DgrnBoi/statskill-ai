import { QuestionItem, DistractorDiagnostic } from './AntiCopyEngine';
import { DocumentChunker } from './DocumentChunker';

export class LocalQuestionExtractor {
  /**
   * Dynamically extracts authentic, non-hardcoded multiple choice questions
   * directly from the uploaded document text using structural and semantic heuristics.
   */
  public static extractQuestionsFromDocument(
    rawText: string,
    courseTitle: string = 'Uploaded Statistical Manual',
    targetCount: number = 5,
    difficulty: string = 'intermediate'
  ): QuestionItem[] {
    const cleanedText = DocumentChunker.cleanText(rawText);
    if (!cleanedText || cleanedText.length < 50) {
      return [];
    }

    const sentences = this.extractSentences(cleanedText);
    const candidateQuestions: QuestionItem[] = [];

    // Strategy 1: Definition & Conceptual Term Extraction
    const definitionQuestions = this.extractDefinitionQuestions(sentences, cleanedText, courseTitle, difficulty);
    candidateQuestions.push(...definitionQuestions);

    // Strategy 2: Methodology & Statutory Rule Extraction
    const methodologyQuestions = this.extractMethodologyQuestions(sentences, cleanedText, courseTitle, difficulty);
    candidateQuestions.push(...methodologyQuestions);

    // Strategy 3: Formula & Estimation Pattern Extraction
    const formulaQuestions = this.extractFormulaQuestions(sentences, cleanedText, courseTitle, difficulty);
    candidateQuestions.push(...formulaQuestions);

    // Strategy 4: Factual Context & Numerical Benchmark Extraction
    if (candidateQuestions.length < targetCount) {
      const factualQuestions = this.extractFactualQuestions(sentences, cleanedText, courseTitle, difficulty);
      candidateQuestions.push(...factualQuestions);
    }

    // Deduplicate questions by question text stem
    const seenStems = new Set<string>();
    const uniqueQuestions: QuestionItem[] = [];

    for (const q of candidateQuestions) {
      const stem = q.question.toLowerCase().trim();
      if (!seenStems.has(stem) && q.options.length === 4) {
        seenStems.add(stem);
        uniqueQuestions.push(q);
      }
      if (uniqueQuestions.length >= targetCount) break;
    }

    if (uniqueQuestions.length < targetCount) {
      this.extractSentenceFallbackQuestions(sentences, uniqueQuestions, targetCount, courseTitle, seenStems);
    }

    return uniqueQuestions;
  }
  public static isMeaningfulSentence(s: string): boolean {
    if (!s || s.length < 15 || s.length > 350) return false;
    if (s.startsWith('--') || s.toLowerCase().startsWith('page')) return false;

    const lower = s.toLowerCase();
    // Exclude emails, web links, and phone numbers
    if (lower.includes('@') || lower.includes('gmail') || lower.includes('email')) return false;
    if (lower.includes('http://') || lower.includes('https://') || lower.includes('www.') || lower.includes('linkedin.com') || lower.includes('github.com')) return false;
    if (/\b\d{10}\b/.test(s) || /\+91/.test(s) || lower.includes('mobile') || lower.includes('phone') || lower.includes('linkedin')) return false;

    // Must contain at least 4 real words
    const words = s.split(/\s+/).filter(w => w.length > 1);
    if (words.length < 4) return false;

    return true;
  }

  // Fallback: If still under targetCount, generate sentence comprehension questions from available sentences
  private static extractSentenceFallbackQuestions(
    sentences: string[],
    uniqueQuestions: QuestionItem[],
    targetCount: number,
    courseTitle: string,
    seenStems: Set<string>
  ): void {
    if (uniqueQuestions.length >= targetCount || sentences.length === 0) return;

    const stemTemplates = [
      `Which of the following details or technical specifications is directly confirmed by the uploaded document?`,
      `According to the uploaded reference document, which core responsibility or operational principle is established?`,
      `Based on the uploaded document text, which achievement or project requirement is explicitly verified?`,
      `Which of the following statements is directly supported by the uploaded reference material?`,
      `According to the document text, which key requirement or skill area is explicitly established?`
    ];

    for (let i = 0; i < sentences.length && uniqueQuestions.length < targetCount; i++) {
      const sentence = sentences[i];
      if (!this.isMeaningfulSentence(sentence)) continue;

      const stem = stemTemplates[uniqueQuestions.length % stemTemplates.length];
      const stemKey = `${stem}-${sentence.slice(0, 20)}`.toLowerCase();

      if (seenStems.has(stemKey)) continue;
      seenStems.add(stemKey);

      const otherSentences = sentences.filter((_, idx) => idx !== i && this.isMeaningfulSentence(sentences[idx]));
      const distractors = this.buildDistractors(sentence, otherSentences, 'Document Concept');
      const options = this.shuffle([sentence.slice(0, 140), ...distractors.slice(0, 3)]);

      const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
      for (const opt of distractors.slice(0, 3)) {
        distractorAnalysis[opt] = {
          misconception: `Selecting an unverified statement or alternative clause from another section of the document.`,
          remedialSkill: courseTitle,
          recommendedCourseId: 'document-review-mastery',
          recommendedCourseTitle: courseTitle
        };
      }

      uniqueQuestions.push({
        id: `loc-extracted-${Date.now()}-${uniqueQuestions.length + 1}`,
        courseId: courseTitle,
        topic: 'Document Key Concepts',
        bloomLevel: 'Understanding',
        question: stem,
        options,
        correctAnswer: sentence.slice(0, 140),
        explanation: `Verified excerpt from uploaded document: "${sentence.slice(0, 120)}"`,
        sourceCitation: `Uploaded Document Excerpt`,
        distractorAnalysis
      });
    }
  }

  /**
   * Helper: Splits text into meaningful complete sentences or structured document clauses
   */
  private static extractSentences(text: string): string[] {
    return text
      .split(/(?<=[.?!])\s+(?=[A-Z0-9])|\n+|\r\n+|[•|\-]/)
      .map(s => s.trim().replace(/\s+/g, ' '))
      .filter(s => this.isMeaningfulSentence(s));
  }

  /**
   * Strategy 1: Definition questions (e.g. "X is defined as Y", "X refers to Y")
   */
  private static extractDefinitionQuestions(
    sentences: string[],
    fullDoc: string,
    courseTitle: string,
    difficulty: string
  ): QuestionItem[] {
    const pattern = /\b([A-Z][A-Za-z0-9\s/-]{2,35})\s+(?:is defined as|refers to|means|is described as|represents)\s+([^.\n;]{20,200})/i;
    const questions: QuestionItem[] = [];
    const poolOfDefinitions: { term: string; definition: string }[] = [];

    // Collect all definitions in document for high-quality contextual distractors
    for (const s of sentences) {
      const match = pattern.exec(s);
      if (match && match[1] && match[2]) {
        const term = match[1].trim();
        const definition = match[2].trim().replace(/^[,\s]+/, '');
        if (term.length > 2 && definition.length > 15) {
          poolOfDefinitions.push({ term, definition });
        }
      }
    }

    for (let i = 0; i < poolOfDefinitions.length; i++) {
      const item = poolOfDefinitions[i];
      const correctAnswer = item.definition;

      // Extract distractors from other definitions in the document
      const otherDefs = poolOfDefinitions
        .filter((_, idx) => idx !== i)
        .map(p => p.definition);

      const distractors = this.buildDistractors(correctAnswer, otherDefs, item.term);
      const options = [correctAnswer, ...distractors.slice(0, 3)];

      // Build diagnostic distractor metadata
      const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
      for (const opt of distractors.slice(0, 3)) {
        distractorAnalysis[opt] = {
          misconception: `Confusing the definition of "${item.term}" with related statistical concepts in the manual.`,
          remedialSkill: courseTitle,
          recommendedCourseId: 'document-review-mastery',
          recommendedCourseTitle: courseTitle
        };
      }

      questions.push({
        id: `qb-doc-def-${Date.now()}-${i + 1}`,
        courseId: courseTitle,
        topic: item.term,
        bloomLevel: difficulty === 'hard' ? 'Analysis' : 'Recall',
        question: `According to the uploaded document, what is the operational definition or purpose of "${item.term}"?`,
        options: this.shuffle(options),
        correctAnswer,
        explanation: `The uploaded manual specifies: "${item.term} refers to ${item.definition}".`,
        sourceCitation: `Uploaded Document: Section on ${item.term}`,
        distractorAnalysis
      });
    }

    return questions;
  }

  /**
   * Strategy 2: Methodology & Procedural rules (e.g. "Under Section X, Y is adopted")
   */
  private static extractMethodologyQuestions(
    sentences: string[],
    fullDoc: string,
    courseTitle: string,
    difficulty: string
  ): QuestionItem[] {
    const pattern = /(?:Under|In accordance with|As per|For the purpose of)\s+([A-Z][A-Za-z0-9\s/.-]{2,35}),\s+([^.\n]{30,220})/i;
    const questions: QuestionItem[] = [];

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const match = pattern.exec(s);
      if (match && match[1] && match[2]) {
        const authorityOrSection = match[1].trim();
        const ruleStatement = match[2].trim();

        const correctAnswer = ruleStatement;
        const alternativeClauses = sentences
          .filter((_, idx) => idx !== i && !sentences[idx].includes(authorityOrSection))
          .map(other => other.replace(/^[^,]+,\s*/, '').slice(0, 140));

        const distractors = this.buildDistractors(correctAnswer, alternativeClauses, authorityOrSection);
        const options = [correctAnswer, ...distractors.slice(0, 3)];

        const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
        for (const opt of distractors.slice(0, 3)) {
          distractorAnalysis[opt] = {
            misconception: `Misattributing procedural guidelines under "${authorityOrSection}".`,
            remedialSkill: courseTitle,
            recommendedCourseId: 'document-review-mastery',
            recommendedCourseTitle: courseTitle
          };
        }

        questions.push({
          id: `qb-doc-meth-${Date.now()}-${i + 1}`,
          courseId: courseTitle,
          topic: authorityOrSection,
          bloomLevel: 'Understanding',
          question: `Based on the provisions for "${authorityOrSection}" in the document, which procedural requirement is explicitly stated?`,
          options: this.shuffle(options),
          correctAnswer,
          explanation: `The document explicitly states: "${s}".`,
          sourceCitation: `Uploaded Document: Rule under ${authorityOrSection}`,
          distractorAnalysis
        });
      }
    }

    return questions;
  }

  /**
   * Strategy 3: Formula & Estimation Questions
   */
  private static extractFormulaQuestions(
    sentences: string[],
    fullDoc: string,
    courseTitle: string,
    difficulty: string
  ): QuestionItem[] {
    const pattern = /\b(?:formula|estimation|calculation|allocation|multiplier|weight)\b[^.\n]{5,50}\b(?:is|is given by|calculated as|expressed as)\s+([^.\n]{20,200})/i;
    const questions: QuestionItem[] = [];

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const match = pattern.exec(s);
      if (match && match[1]) {
        const formulaExplanation = match[1].trim();
        const correctAnswer = formulaExplanation;

        const otherSentences = sentences
          .filter((_, idx) => idx !== i)
          .map(st => st.slice(0, 130));

        const distractors = this.buildDistractors(correctAnswer, otherSentences, 'Formula');
        const options = [correctAnswer, ...distractors.slice(0, 3)];

        const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
        for (const opt of distractors.slice(0, 3)) {
          distractorAnalysis[opt] = {
            misconception: `Incorrect estimation formulation or index calculation logic.`,
            remedialSkill: courseTitle,
            recommendedCourseId: 'document-review-mastery',
            recommendedCourseTitle: courseTitle
          };
        }

        questions.push({
          id: `qb-doc-form-${Date.now()}-${i + 1}`,
          courseId: courseTitle,
          topic: 'Estimation & Formulae',
          bloomLevel: 'Application',
          question: `Regarding calculation and estimation methodology in the uploaded manual, which of the following is correct?`,
          options: this.shuffle(options),
          correctAnswer,
          explanation: `Document reference: "${s}".`,
          sourceCitation: `Uploaded Document: Formula / Estimation Section`,
          distractorAnalysis
        });
      }
    }

    return questions;
  }

  /**
   * Strategy 4: Factual Context Questions
   */
  private static extractFactualQuestions(
    sentences: string[],
    fullDoc: string,
    courseTitle: string,
    difficulty: string
  ): QuestionItem[] {
    const questions: QuestionItem[] = [];
    // Accept all clean sentences from the document without restrictive keyword filtering
    const cleanSentences = sentences.filter(s => s.length >= 35 && s.length <= 250);

    for (let i = 0; i < Math.min(cleanSentences.length, 10); i++) {
      const sentence = cleanSentences[i];
      const correctAnswer = sentence;

      const otherSentences = cleanSentences
        .filter((_, idx) => idx !== i)
        .slice(0, 3);

      if (otherSentences.length < 3) continue;

      const distractors = otherSentences.map(os => os.slice(0, 140));
      const options = [correctAnswer.slice(0, 140), ...distractors];

      const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
      for (const opt of distractors) {
        distractorAnalysis[opt] = {
          misconception: `Selecting an alternative statement from another section of the uploaded document.`,
          remedialSkill: courseTitle,
          recommendedCourseId: 'document-review-mastery',
          recommendedCourseTitle: courseTitle
        };
      }

      questions.push({
        id: `qb-doc-fact-${Date.now()}-${i + 1}`,
        courseId: courseTitle,
        topic: 'Document Concepts & Principles',
        bloomLevel: 'Understanding',
        question: `Which of the following statements is directly confirmed by the uploaded document?`,
        options: this.shuffle(options),
        correctAnswer: correctAnswer.slice(0, 140),
        explanation: `Direct excerpt from the uploaded document: "${sentence}".`,
        sourceCitation: `Uploaded Document: Section ${i + 1}`,
        distractorAnalysis
      });
    }

    return questions;
  }

  /**
   * Constructs exactly 3 plausible distractors from other clauses or contextual permutations
   */
  private static buildDistractors(correct: string, candidates: string[], term: string): string[] {
    const unique = new Set<string>();

    for (const c of candidates) {
      const clean = c.trim();
      if (clean && clean !== correct && !unique.has(clean)) {
        unique.add(clean.slice(0, 140));
      }
      if (unique.size >= 3) break;
    }

    // Fallback synthetic distractors derived dynamically from document context (never hardcoded survey jargon)
    const fallbacks = [
      `Not specified or explicitly recorded in the uploaded reference document.`,
      `Optional secondary specification requiring external verification for ${term.slice(0, 30)}.`,
      `Deprecated guideline superseded by updated reference document protocols.`
    ];

    for (const fb of fallbacks) {
      if (unique.size >= 3) break;
      if (fb !== correct) {
        unique.add(fb);
      }
    }

    return Array.from(unique).slice(0, 3);
  }

  /**
   * Helper: Shuffle array
   */
  private static shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
