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

    return uniqueQuestions;
  }

  /**
   * Helper: Splits text into meaningful complete sentences
   */
  private static extractSentences(text: string): string[] {
    return text
      .split(/(?<=[.?!])\s+(?=[A-Z0-9])|\n\n+/)
      .map(s => s.trim())
      .filter(s => s.length >= 35 && s.length <= 350 && !s.startsWith('--') && !s.toLowerCase().startsWith('page'));
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
    const statisticalSentences = sentences.filter(s => 
      /\b(sample|survey|stratum|strata|fsu|ssu|household|cpi|gdp|gva|index|nss|mospi|asi|plfs|rate|percentage|ratio)\b/i.test(s)
    );

    for (let i = 0; i < Math.min(statisticalSentences.length, 6); i++) {
      const sentence = statisticalSentences[i];
      const correctAnswer = sentence;

      const otherStatistical = statisticalSentences
        .filter((_, idx) => idx !== i)
        .slice(0, 3);

      if (otherStatistical.length < 3) continue;

      const distractors = otherStatistical.map(os => os.slice(0, 140));
      const options = [correctAnswer.slice(0, 140), ...distractors];

      const distractorAnalysis: Record<string, DistractorDiagnostic> = {};
      for (const opt of distractors) {
        distractorAnalysis[opt] = {
          misconception: `Selecting an unrelated statistical statement from another part of the manual.`,
          remedialSkill: courseTitle,
          recommendedCourseId: 'document-review-mastery',
          recommendedCourseTitle: courseTitle
        };
      }

      questions.push({
        id: `qb-doc-fact-${Date.now()}-${i + 1}`,
        courseId: courseTitle,
        topic: 'Document Findings & Standards',
        bloomLevel: 'Understanding',
        question: `Which of the following statements is directly confirmed by the uploaded training document?`,
        options: this.shuffle(options),
        correctAnswer: correctAnswer.slice(0, 140),
        explanation: `Direct quote from the uploaded text: "${sentence}".`,
        sourceCitation: `Uploaded Document: Body Section`,
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

    // Fallback synthetic distractors if the document is concise
    const fallbacks = [
      `Applies only when variance thresholds exceed statutory limits for ${term}.`,
      `Computed using unweighted arithmetic aggregations without non-response adjustments.`,
      `Deprecated methodology superseded by legacy census baseline procedures.`
    ];

    for (const fb of fallbacks) {
      if (unique.size >= 3) break;
      unique.add(fb);
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
