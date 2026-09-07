import fs from 'fs';
import path from 'path';
import { DocumentChunker } from '../src/services/ai/DocumentChunker';
import { LocalQuestionExtractor } from '../src/services/ai/LocalQuestionExtractor';
import { QuizGeneratorService } from '../src/services/ai/QuizGenerator';

describe('RAG Optimization & DocumentChunker Test Suite', () => {
  const sampleStatisticalManual = `
-- Page 1 of 45 --
CHAPTER 1: INTRODUCTION AND OBJECTIVES
The National Statistical Office (NSO) conducts nationwide sample surveys to generate reliable estimates of macroeconomic and socio-economic indicators.
Under the 78th Round, the focus is on multi-stage strati-
fication and domestic tourism expenditure.

Chapter 2: SAMPLING DESIGN AND ESTIMATION PROCEDURE
A stratified multi-stage design was adopted for the survey.
First Stage Units refers to the census villages in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector.
Ultimate Stage Units is defined as households in both rural and urban sectors selected for complete enumeration.

Section 2.1: Allocation of Strata and Selection of FSUs
As per Section 2.1 Guidelines, the total sample size of FSUs was allocated to the States and UTs in proportion to their population as per Census 2011.
Within each district of a State/UT, two basic strata were formed: rural stratum and urban stratum.
Selection of FSUs was done using Probability Proportional to Size with Replacement (PPSWR) where size is the population.

Section 2.2: Multipliers and Sampling Weights
Let Y_hijk be the value of characteristic for k-th household of j-th sample FSU in i-th sub-stratum of h-th stratum.
The estimation formula for the aggregate of characteristic Y is given by applying the inverse probability design weights and non-response multiplier factors.
In the presence of non-response or non-sampling errors, adjustment factors must be calculated.
`;

  describe('DocumentChunker Text Normalization & Cleaning', () => {
    it('normalizes hyphenated line breaks and strips page numbers', () => {
      const raw = `Page 1 of 50\nMulti-stage strati-\nfication is critical for sur-\nvey estimation.\n-- 2 --`;
      const cleaned = DocumentChunker.cleanText(raw);

      expect(cleaned).toContain('stratification');
      expect(cleaned).toContain('survey estimation');
      expect(cleaned).not.toContain('Page 1 of 50');
      expect(cleaned).not.toContain('-- 2 --');
    });

    it('removes control characters cleanly', () => {
      const dirty = 'Sampling\x00Methodology\x08and\x1FDesign';
      const cleaned = DocumentChunker.cleanText(dirty);
      expect(cleaned).toBe('SamplingMethodologyandDesign');
    });
  });

  describe('Semantic Heading-Aware Chunking', () => {
    it('detects Chapter and Section headings to partition chunks', () => {
      const chunks = DocumentChunker.chunkDocument(sampleStatisticalManual, 1000, 100);
      expect(chunks.length).toBeGreaterThanOrEqual(2);

      const titles = chunks.map(c => c.sectionTitle);
      const hasHeading = titles.some(t => t.toLowerCase().includes('chapter') || t.toLowerCase().includes('section') || t.toLowerCase().includes('sampling'));
      expect(hasHeading).toBe(true);
    });

    it('preserves sentence and paragraph integrity across boundaries', () => {
      const chunks = DocumentChunker.chunkDocument(sampleStatisticalManual, 800, 150);
      for (const chunk of chunks) {
        expect(chunk.text.length).toBeGreaterThan(0);
        expect(chunk.charEnd).toBeGreaterThan(chunk.charStart);
      }
    });
  });

  describe('BM25 & Domain Relevance Ranking', () => {
    it('ranks chunks with target keywords higher than generic chunks', () => {
      const chunks = DocumentChunker.chunkDocument(sampleStatisticalManual, 500, 50);
      const ranked = DocumentChunker.rankAndSelectChunks(chunks, 'Sampling Weights and Multipliers', 5000);

      expect(ranked.length).toBeGreaterThan(0);
      const matchingChunk = ranked.find(c => c.text.includes('Multipliers and Sampling Weights') || c.text.includes('inverse probability'));
      expect(matchingChunk).toBeDefined();
    });

    it('formats selected chunks into structured XML prompt tags', () => {
      const chunks = DocumentChunker.chunkDocument(sampleStatisticalManual, 1000, 100);
      const selected = DocumentChunker.rankAndSelectChunks(chunks, 'Sampling Design', 5000);
      const formatted = DocumentChunker.formatChunksForPrompt(selected);

      expect(formatted).toContain('<section_chunk index="1"');
      expect(formatted).toContain('</section_chunk>');
    });
  });

  describe('LocalQuestionExtractor Dynamic Document Synthesis', () => {
    it('extracts non-hardcoded questions directly from definitions and rules in uploaded document', () => {
      const questions = LocalQuestionExtractor.extractQuestionsFromDocument(
        sampleStatisticalManual,
        'NSS 78th Round Manual',
        4,
        'intermediate'
      );

      expect(questions.length).toBeGreaterThanOrEqual(2);
      for (const q of questions) {
        expect(q.options.length).toBe(4);
        expect(q.options).toContain(q.correctAnswer);
        expect(q.sourceCitation).toContain('Uploaded Document');
        expect(q.distractorAnalysis).toBeDefined();
      }

      // Verify that at least one question specifically tested terms from the text
      const hasCustomTerm = questions.some(q => 
        q.question.includes('First Stage Units') || 
        q.question.includes('Ultimate Stage Units') || 
        q.question.includes('Section 2.1') ||
        q.question.includes('estimation')
      );
      expect(hasCustomTerm).toBe(true);
    });
  });

  describe('QuizGenerator RAG & Offline Failover Pipeline', () => {
    const quizService = new QuizGeneratorService();
    const tempTestDocPath = path.join(__dirname, 'temp_test_doc.txt');

    beforeAll(() => {
      fs.writeFileSync(tempTestDocPath, sampleStatisticalManual, 'utf8');
    });

    afterAll(() => {
      if (fs.existsSync(tempTestDocPath)) {
        try { fs.unlinkSync(tempTestDocPath); } catch (_) {}
      }
    });

    it('dynamically generates questions from an uploaded document without API keys', async () => {
      const result = await quizService.generateFromPdf(
        tempTestDocPath,
        3,
        'intermediate',
        'OFFLINE',
        'NSS 78th Round Manual'
      );

      expect(result).toBeDefined();
      expect(result.questions.length).toBeGreaterThanOrEqual(2);
      expect(result.setLetter).toMatch(/^[A-D]$/);
      expect(result.antiCopyCode).toBeDefined();
    });

    it('serves from local verified bank when no file is uploaded', async () => {
      const result = await quizService.generateFromPdf(
        undefined,
        5,
        'intermediate',
        'EDGE_OFFLINE',
        'Survey Design and Stratification'
      );

      expect(result).toBeDefined();
      expect(result.mode).toBe('EDGE_OFFLINE');
      expect(result.questions.length).toBe(5);
      expect(result.setLetter).toMatch(/^[A-D]$/);
      expect(result.antiCopyCode).toBeDefined();

      for (const q of result.questions) {
        expect(q.options.length).toBe(4);
        expect(q.options).toContain(q.correctAnswer);
        expect(q.bloomLevel).toBeDefined();
      }
    });
  });
});
