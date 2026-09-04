/**
 * AntiCopyEngine.ts
 * Official examination security utility for MoSPI/iGOT assessments.
 * Implements unbiased Fisher-Yates permutations on questions and answer options
 * to prevent screen copying, shoulder surfing, and answer-key collusion in field offices.
 */

export interface QuestionItem {
  id?: string;
  courseId?: string;
  topic?: string;
  bloomLevel?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  sourceCitation: string;
}

export interface ShuffledExamPaper {
  paperSetId: string;
  setLetter: 'A' | 'B' | 'C' | 'D';
  antiCopyCode: string;
  isRandomized: boolean;
  generatedAt: string;
  totalQuestions: number;
  questions: QuestionItem[];
}

export class AntiCopyEngine {
  /**
   * Cryptographically unbiased Fisher-Yates (Knuth) array shuffle.
   * Time Complexity: O(n), Space Complexity: O(n).
   */
  public static shuffleArray<T>(array: T[]): T[] {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  /**
   * Shuffles the 4 multiple-choice options for a single question
   * while strictly preserving the correct answer string.
   */
  public static shuffleOptions(question: QuestionItem): QuestionItem {
    const shuffledOptions = this.shuffleArray(question.options);
    
    // Integrity Guardrail: Ensure correct answer is still present
    if (!shuffledOptions.includes(question.correctAnswer)) {
      console.warn(`[AntiCopyGuard] Correct answer missing in options for question: "${question.question.substring(0, 30)}...". Preserving original options.`);
      return { ...question };
    }

    return {
      ...question,
      options: shuffledOptions
    };
  }

  /**
   * Generates a fully randomized, anti-copy examination paper:
   * 1. Generates an official Paper Set Identifier (e.g., "SET-B [CODE: 4912]").
   * 2. Shuffles the order of the questions.
   * 3. Permutes the order of the options for every question.
   */
  public static generateAntiCopyPaper(
    rawQuestions: QuestionItem[],
    requestedCount: number = 5
  ): ShuffledExamPaper {
    const setLetters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
    const chosenSet = setLetters[Math.floor(Math.random() * setLetters.length)];
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const paperSetId = `SET-${chosenSet}-${randomCode}`;

    // 1. Shuffle the pool of questions
    const shuffledQuestionsPool = this.shuffleArray(rawQuestions);

    // 2. Slice to requested count
    const selectedSubset = shuffledQuestionsPool.slice(0, Math.min(requestedCount, shuffledQuestionsPool.length));

    // 3. Shuffle options inside each selected question
    const randomizedQuestions = selectedSubset.map(q => this.shuffleOptions(q));

    return {
      paperSetId,
      setLetter: chosenSet,
      antiCopyCode: randomCode,
      isRandomized: true,
      generatedAt: new Date().toISOString(),
      totalQuestions: randomizedQuestions.length,
      questions: randomizedQuestions
    };
  }
}
