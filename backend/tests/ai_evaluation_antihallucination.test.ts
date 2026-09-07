import { AIEvaluationService } from '../src/services/ai/AIEvaluationService';
import { CourseMatcherService } from '../src/services/recommendation/CourseMatcher';
import fs from 'fs';
import path from 'path';

describe('AIEvaluationService - Anti-Hallucination & Math Verification Suite', () => {
  let aiService: AIEvaluationService;
  let courseMatcher: CourseMatcherService;
  let authenticCatalog: any[];

  beforeAll(() => {
    aiService = new AIEvaluationService();
    courseMatcher = new CourseMatcherService();
    const catalogPath = path.join(__dirname, '../src/data/courses_catalog.json');
    authenticCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  });

  describe('1. Anti-Hallucination Course Catalog Snapping', () => {
    it('TC_AH_001: Guarantees every returned course exists in authentic 884-course catalog', () => {
      const fakeQuery = 'hallucinated-fake-quantum-ai-course-999';
      const snappedCourse = aiService.findVerifiedCourse(fakeQuery, 'Survey Design & Sampling');

      expect(snappedCourse).toBeDefined();
      expect(snappedCourse.id).toBeDefined();
      expect(snappedCourse.title).toBeDefined();
      expect(snappedCourse.link).toBeDefined();

      // Check if snapped course exists in authentic catalog
      const existsInCatalog = authenticCatalog.some(c => c.id === snappedCourse.id || c.title === snappedCourse.title);
      expect(existsInCatalog).toBe(true);
    });

    it('TC_AH_002: Snaps unknown distractor recommendation IDs to verified catalog courses', async () => {
      const answers = [
        {
          questionText: 'Which sampling technique is most appropriate for skewed economic data?',
          selectedOption: 'Simple Random Sampling without Replacement',
          correctAnswer: 'Probability Proportional to Size (PPS)',
          isCorrect: false,
          topic: 'Survey Design & Sampling Theory',
          distractorAnalysis: {
            'Simple Random Sampling without Replacement': {
              misconception: 'SRS fails to account for unequal establishment size distributions.',
              remedialSkill: 'Survey Design & Sampling Theory',
              recommendedCourseTitle: 'Non-Existent Imaginary Course Title',
              recommendedCourseId: 'hallucinated-id-88888',
            },
          },
        },
      ];

      const result = await aiService.evaluateAssessment('OFFICER_TEST', 'Junior Statistical Officer (JSO)', answers, {});

      expect(result.recommendedCourses.length).toBeGreaterThan(0);
      for (const rec of result.recommendedCourses) {
        expect(rec.isVerifiedCatalog).toBe(true);
        const inCatalog = authenticCatalog.some(c => c.id === rec.id || c.title === rec.title);
        expect(inCatalog).toBe(true);
      }
    });
  });

  describe('2. Deterministic Mathematical Scoring & Level Clamping', () => {
    it('TC_AH_003: Computes exact percentage score deterministically without hallucination', async () => {
      const answers = [
        { questionText: 'Q1', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Survey Design' },
        { questionText: 'Q2', selectedOption: 'B', correctAnswer: 'A', isCorrect: false, topic: 'Survey Design' },
        { questionText: 'Q3', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Data Processing' },
        { questionText: 'Q4', selectedOption: 'B', correctAnswer: 'A', isCorrect: false, topic: 'Data Privacy' },
        { questionText: 'Q5', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Leadership' },
      ];

      const result = await aiService.evaluateAssessment('JSO_MATH_TEST', 'Junior Statistical Officer (JSO)', answers, {
        'Survey Design & Sampling Theory': 3,
        'Data Processing & Microdata Scrutiny': 3,
        'Data Privacy & DPDPA 2023 Compliance': 3,
        'Public Administration & Statistical Leadership': 3,
      });

      // 3 of 5 correct => 60% exactly
      expect(result.scorePercentage).toBe(60);
      expect(result.score).toBe(60);
      expect(result.totalScore).toBe(100);
      expect(result.status).toBe('remedial');
    });

    it('TC_AH_004: Clamps proficiency levels strictly within 1 and 5 bounds', async () => {
      // Test upper clamp at level 5
      const answersUpper = [
        { questionText: 'Q1', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Survey Design & Sampling Theory' },
      ];
      const resultUpper = await aiService.evaluateAssessment('MAX_USER', 'Director (ISS)', answersUpper, {
        'Survey Design & Sampling Theory': 5,
      });
      expect(resultUpper.updatedProficiency['Survey Design & Sampling Theory']).toBe(5);

      // Test lower clamp at level 1
      const answersLower = [
        { questionText: 'Q1', selectedOption: 'B', correctAnswer: 'A', isCorrect: false, topic: 'Survey Design & Sampling Theory' },
      ];
      const resultLower = await aiService.evaluateAssessment('MIN_USER', 'Junior Statistical Officer (JSO)', answersLower, {
        'Survey Design & Sampling Theory': 1,
      });
      expect(resultLower.updatedProficiency['Survey Design & Sampling Theory']).toBe(1);
    });
  });

  describe('3. Dynamic 4-Pillar Competency Radar Coverage', () => {
    it('TC_AH_005: Generates comprehensive 4-pillar breakdown with benchmark and deltas', async () => {
      const answers = [
        { questionText: 'Q1', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Survey Design & Sampling Theory' },
      ];

      const result = await aiService.evaluateAssessment('OFFICER_4P', 'Senior Statistical Officer (SSO)', answers, {});

      expect(result.pillarBreakdown).toBeDefined();
      expect(result.pillarBreakdown.length).toBe(4);

      const pillars = result.pillarBreakdown.map(p => p.pillar);
      expect(pillars).toContain('Statistical Competencies');
      expect(pillars).toContain('Technical Competencies');
      expect(pillars).toContain('Digital Governance');
      expect(pillars.some(p => p.includes('Behavioural and Managerial'))).toBe(true);

      for (const p of result.pillarBreakdown) {
        expect(p.updatedLevel).toBeGreaterThanOrEqual(1);
        expect(p.updatedLevel).toBeLessThanOrEqual(5);
        expect(p.benchmarkLevel).toBeGreaterThanOrEqual(1);
        expect(p.benchmarkLevel).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('4. Sovereign Offline Fallback & Copywriting Rule Adherence', () => {
    it('TC_AH_006: Produces structured AI strategic feedback complying with copywriting rules', async () => {
      const answers = [
        {
          questionText: 'Q1',
          selectedOption: 'A',
          correctAnswer: 'A',
          isCorrect: true,
          topic: 'Survey Design & Sampling Theory',
        },
        {
          questionText: 'Q2',
          selectedOption: 'B',
          correctAnswer: 'A',
          isCorrect: false,
          topic: 'Data Privacy & DPDPA 2023 Compliance',
        },
      ];

      const result = await aiService.evaluateAssessment('OFFICER_FEEDBACK', 'Junior Statistical Officer (JSO)', answers, {});

      expect(result.aiStrategicFeedback).toBeDefined();
      expect(result.aiStrategicFeedback.executiveSummary).toBeDefined();
      expect(result.aiStrategicFeedback.demonstratedStrengths.length).toBeGreaterThan(0);
      expect(result.aiStrategicFeedback.priorityGrowthAreas.length).toBeGreaterThan(0);
      expect(result.aiStrategicFeedback.actionPlan30Days.length).toBe(3);

      // Verify copywriting rule: Must use perspective of "We" and complete sentences
      expect(result.aiStrategicFeedback.executiveSummary.startsWith('We')).toBe(true);
      for (const str of result.aiStrategicFeedback.demonstratedStrengths) {
        expect(str.startsWith('We')).toBe(true);
        expect(str.endsWith('.')).toBe(true);
      }
      for (const area of result.aiStrategicFeedback.priorityGrowthAreas) {
        expect(area.startsWith('We')).toBe(true);
        expect(area.endsWith('.')).toBe(true);
      }
    });
  });

  describe('5. End-to-End Integration through CourseMatcherService', () => {
    it('TC_AH_007: CourseMatcherService delegates assessment evaluation seamlessly', async () => {
      const answers = [
        {
          questionText: 'Which index formula satisfies the time reversal test?',
          selectedOption: "Fisher's Ideal Index",
          correctAnswer: "Fisher's Ideal Index",
          isCorrect: true,
          topic: 'Price Statistics & Index Number Theory',
        },
      ];

      const evaluation = await courseMatcher.analyzeAssessmentResults(
        'ESD_PRICE_OFFICER',
        'Deputy Director [Price Statistics] (ISS)',
        answers as any,
        { 'Price Statistics & Index Number Theory': 4 }
      );

      expect(evaluation.officerId).toBe('ESD_PRICE_OFFICER');
      expect(evaluation.cadre).toBe('Deputy Director [Price Statistics] (ISS)');
      expect(evaluation.scorePercentage).toBe(100);
      expect(evaluation.status).toBe('passed');
      expect(evaluation.updatedProficiency['Price Statistics & Index Number Theory']).toBe(5);
      expect(evaluation.aiStrategicFeedback).toBeDefined();
      expect(evaluation.pillarBreakdown.length).toBe(4);
    });
  });
});
