import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import { CourseMatcherService, AssessmentAnswerSubmission } from '../src/services/recommendation/CourseMatcher';
import { CompetencyEngine } from '../src/services/CompetencyEngine';

describe('StatSkill AI - Zero-Mock Algorithmic Dynamism & Custom User Proof Suite', () => {
  let matcher: CourseMatcherService;
  let competencyEngine: CompetencyEngine;

  beforeAll(() => {
    process.env.JWT_SECRET = 'statskill_sih_secret_key_2026_test';
    matcher = new CourseMatcherService();
    competencyEngine = new CompetencyEngine();
  });

  describe('1. Dynamic Custom User Authentication & JWT Signing', () => {
    it('authenticates the 6th pre-configured officer (Dr. Vikram Seth - Deputy Director [Price Statistics])', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ officerId: 'deputy-director', method: 'parichay-id' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.expiresIn).toBe(28800);

      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET!) as any;
      expect(decoded.name).toBe('Dr. Vikram Seth');
      expect(decoded.designation).toBe('Deputy Director [Price Statistics] (ISS)');
      expect(decoded.division).toBe('Economic Statistics Division (ESD), MoSPI');
      expect(decoded.cadre).toBe('Indian Statistical Service (ISS)');
    });

    it('authenticates a completely arbitrary dynamic custom user without static pre-baking', async () => {
      const customOfficer = {
        parichayId: 'PARICHAY_9999_DYNAMIC',
        name: 'Dr. Aarav Deshmukh',
        email: 'aarav.deshmukh@custom-stats.gov.in',
        designation: 'Principal Agricultural Statistician (IASRI)',
        division: 'Agricultural Statistics & Remote Sensing Directorate',
        cadre: 'Indian Agricultural Research Service (ARS)',
      };

      const res = await request(app)
        .post('/api/auth/custom-login')
        .send({ officer: customOfficer, method: 'parichay-id' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET!) as any;
      expect(decoded.name).toBe('Dr. Aarav Deshmukh');
      expect(decoded.designation).toBe('Principal Agricultural Statistician (IASRI)');
      expect(decoded.division).toBe('Agricultural Statistics & Remote Sensing Directorate');
      expect(decoded.cadre).toBe('Indian Agricultural Research Service (ARS)');
      expect(decoded.authMethod).toBe('parichay-id');
    });

    it('rejects invalid custom login requests missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/custom-login')
        .send({ officer: { division: 'Some Division' } });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid officer profile/i);
    });
  });

  describe('2. Dynamic Scoring Formula & Non-Standard Question Counts', () => {
    it('calculates dynamic score for 7 questions with 3 correct (3/7 = 42.857% -> 43%, remedial)', async () => {
      const answers: AssessmentAnswerSubmission[] = [
        { questionText: 'Q1', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Price Statistics' },
        { questionText: 'Q2', selectedOption: 'B', correctAnswer: 'B', isCorrect: true, topic: 'Price Statistics' },
        { questionText: 'Q3', selectedOption: 'C', correctAnswer: 'C', isCorrect: true, topic: 'Price Statistics' },
        { questionText: 'Q4', selectedOption: 'A', correctAnswer: 'D', isCorrect: false, topic: 'Price Statistics' },
        { questionText: 'Q5', selectedOption: 'B', correctAnswer: 'D', isCorrect: false, topic: 'Price Statistics' },
        { questionText: 'Q6', selectedOption: 'C', correctAnswer: 'D', isCorrect: false, topic: 'Price Statistics' },
        { questionText: 'Q7', selectedOption: 'A', correctAnswer: 'B', isCorrect: false, topic: 'Price Statistics' },
      ];

      const result = await matcher.analyzeAssessmentResults('ESD_6120', 'Deputy Director [Price Statistics] (ISS)', answers, { 'Price Statistics': 3 });

      expect(result.scorePercentage).toBe(43); // Math.round(3/7 * 100) = 43
      expect(result.status).toBe('remedial');
      expect(result.score).toBe(60); // 3 * 20
      expect(result.totalScore).toBe(140); // 7 * 20
    });

    it('calculates dynamic score for 7 questions with 5 correct (5/7 = 71.428% -> 71%, passed)', async () => {
      const answers: AssessmentAnswerSubmission[] = [
        { questionText: 'Q1', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Index Theory' },
        { questionText: 'Q2', selectedOption: 'B', correctAnswer: 'B', isCorrect: true, topic: 'Index Theory' },
        { questionText: 'Q3', selectedOption: 'C', correctAnswer: 'C', isCorrect: true, topic: 'Index Theory' },
        { questionText: 'Q4', selectedOption: 'D', correctAnswer: 'D', isCorrect: true, topic: 'Index Theory' },
        { questionText: 'Q5', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, topic: 'Index Theory' },
        { questionText: 'Q6', selectedOption: 'B', correctAnswer: 'C', isCorrect: false, topic: 'Index Theory' },
        { questionText: 'Q7', selectedOption: 'A', correctAnswer: 'D', isCorrect: false, topic: 'Index Theory' },
      ];

      const result = await matcher.analyzeAssessmentResults('ESD_6120', 'Deputy Director [Price Statistics] (ISS)', answers, { 'Index Theory': 3 });

      expect(result.scorePercentage).toBe(71); // Math.round(5/7 * 100) = 71
      expect(result.status).toBe('passed');
      expect(result.score).toBe(100); // 5 * 20
      expect(result.totalScore).toBe(140); // 7 * 20
    });

    it('calculates dynamic score for 11 questions with 8 correct (8/11 = 72.727% -> 73%, passed)', async () => {
      const answers: AssessmentAnswerSubmission[] = Array.from({ length: 11 }, (_, i) => ({
        questionText: `Question ${i + 1}`,
        selectedOption: i < 8 ? 'A' : 'B',
        correctAnswer: 'A',
        isCorrect: i < 8,
        topic: 'Econometric Modeling',
      }));

      const result = await matcher.analyzeAssessmentResults('CUSTOM_001', 'Custom Role', answers, { 'Econometric Modeling': 3 });

      expect(result.scorePercentage).toBe(73); // Math.round(8/11 * 100) = 73
      expect(result.status).toBe('passed');
      expect(result.score).toBe(160); // 8 * 20
      expect(result.totalScore).toBe(220); // 11 * 20
    });
  });

  describe('3. Dynamic Competency Level Adjustments', () => {
    it('dynamically increments competency on correct answer and decrements on wrong answer', async () => {
      const initialProficiency = {
        'Price Statistics & Index Number Theory': 3,
        'High-Frequency Econometric Modeling': 4,
        'Official Dissemination & Data Governance': 2,
      };

      const answers: AssessmentAnswerSubmission[] = [
        {
          questionText: 'Price question',
          selectedOption: 'A',
          correctAnswer: 'A',
          isCorrect: true,
          topic: 'Price Statistics & Index Number Theory',
        },
        {
          questionText: 'Econometrics question',
          selectedOption: 'B',
          correctAnswer: 'A',
          isCorrect: false,
          topic: 'High-Frequency Econometric Modeling',
        },
      ];

      const result = await matcher.analyzeAssessmentResults('ESD_6120', 'Deputy Director', answers, initialProficiency);

      // Price Statistics was 3, answered correct -> should increment to 4
      expect(result.updatedProficiency['Price Statistics & Index Number Theory']).toBe(4);
      // Econometrics was 4, answered wrong -> should decrement to 3
      expect(result.updatedProficiency['High-Frequency Econometric Modeling']).toBe(3);
      // Data Governance was not tested -> remains unchanged at 2
      expect(result.updatedProficiency['Official Dissemination & Data Governance']).toBe(2);
    });

    it('enforces dynamic boundary clamping: level cannot exceed 5 and cannot drop below 1', async () => {
      const initialProficiency = {
        'Top Skill': 5,
        'Bottom Skill': 1,
      };

      const answers: AssessmentAnswerSubmission[] = [
        {
          questionText: 'Top skill question',
          selectedOption: 'A',
          correctAnswer: 'A',
          isCorrect: true,
          topic: 'Top Skill',
        },
        {
          questionText: 'Bottom skill question',
          selectedOption: 'B',
          correctAnswer: 'A',
          isCorrect: false,
          topic: 'Bottom Skill',
        },
      ];

      const result = await matcher.analyzeAssessmentResults('ESD_6120', 'Deputy Director', answers, initialProficiency);

      expect(result.updatedProficiency['Top Skill']).toBe(5); // clamped at max 5
      expect(result.updatedProficiency['Bottom Skill']).toBe(1); // clamped at min 1
    });
  });

  describe('4. Dynamic Distractor Misconception Extraction', () => {
    it('dynamically diagnoses custom distractor misconception objects passed in payload', async () => {
      const customMisconception = {
        misconception: 'Confusing Laspeyres base period weighting with Paasche current period weighting.',
        remedialSkill: 'Price Statistics & Index Number Theory',
        recommendedCourseId: 'nssta-price-01',
        recommendedCourseTitle: 'Price Statistics & Index Number Construction',
      };

      const answers: AssessmentAnswerSubmission[] = [
        {
          questionText: 'In compiling CPI, what distinguishes Laspeyres from Paasche index formula?',
          selectedOption: 'Paasche uses base year quantities as fixed weights',
          correctAnswer: 'Laspeyres uses base year quantities while Paasche uses current year quantities',
          isCorrect: false,
          topic: 'Price Statistics & Index Number Theory',
          distractorAnalysis: {
            'Paasche uses base year quantities as fixed weights': customMisconception,
          },
        },
      ];

      const result = await matcher.analyzeAssessmentResults('ESD_6120', 'Deputy Director', answers, {});

      expect(result.misconceptionsFound.length).toBe(1);
      expect(result.misconceptionsFound[0].misconception).toBe(customMisconception.misconception);
      expect(result.misconceptionsFound[0].remedialSkill).toBe(customMisconception.remedialSkill);
      expect(result.misconceptionsFound[0].remedialCourse).toBe(customMisconception.recommendedCourseTitle);
      expect(result.misconceptionsFound[0].remedialCourseId).toBe(customMisconception.recommendedCourseId);
    });
  });

  describe('5. Dynamic Multi-Factor Course Recommendation against 884-Course Catalog', () => {
    it('dynamically matches different topics to distinct, relevant authentic catalog courses', async () => {
      const priceResult = await matcher.recommendCourse('Price Statistics', 'CPI inflation index basket Paasche', 3);
      const samplingResult = await matcher.recommendCourse('Survey Design', 'First Stage Units circular systematic sampling', 2);
      const accountsResult = await matcher.recommendCourse('National Accounts', 'SNA GVA Gross Domestic Product deflator', 4);

      // Verify that all 3 return distinct courses matched by semantic query
      expect(priceResult.id).toBeDefined();
      expect(samplingResult.id).toBeDefined();
      expect(accountsResult.id).toBeDefined();

      expect(priceResult.id).not.toBe(samplingResult.id);
      expect(priceResult.id).not.toBe(accountsResult.id);

      // Verify rationale is dynamically populated with the query topic
      expect(priceResult.rationale).toContain('Price Statistics');
      expect(samplingResult.rationale).toContain('Survey Design');
      expect(accountsResult.rationale).toContain('National Accounts');
    });
  });

  describe('6. Dynamic 4-Tier ZPD Structured Learning Pathway Generation', () => {
    it('dynamically computes gaps, readiness, and tier distribution for Dr. Vikram Seth', async () => {
      const lowProficiency = {
        'Survey Design & Sampling': 1,
        'CAPI & Digital Field Enumeration': 2,
        'Data Privacy & DPDPA 2023': 2,
        'Public Ethics & Field Communication': 2,
      };

      const pathwayLow = await matcher.generatePersonalisedPathway('Deputy Director [Price Statistics] (ISS)', lowProficiency);

      expect(pathwayLow.cadre).toBe('Deputy Director [Price Statistics] (ISS)');
      expect(pathwayLow.division).toBe('Economic Statistics Division (ESD), MoSPI');
      expect(pathwayLow.tiers.length).toBe(4);
      expect(pathwayLow.identifiedGaps.length).toBeGreaterThan(0);
      expect(pathwayLow.totalEstimatedHours).toBeGreaterThan(0);

      // Check tier sequence
      expect(pathwayLow.tiers[0].tierNumber).toBe(1);
      expect(pathwayLow.tiers[1].tierNumber).toBe(2);
      expect(pathwayLow.tiers[2].tierNumber).toBe(3);
      expect(pathwayLow.tiers[3].tierNumber).toBe(4);

      // Verify course deduplication across tiers
      const allCourseIds = pathwayLow.tiers.flatMap((t) => t.courses.map((c) => c.id));
      const uniqueCourseIds = new Set(allCourseIds);
      expect(uniqueCourseIds.size).toBe(allCourseIds.length);

      // Compare readiness when proficiency increases
      const highProficiency = {
        'Survey Design & Sampling': 4,
        'CAPI & Digital Field Enumeration': 4,
        'Data Privacy & DPDPA 2023': 4,
        'Public Ethics & Field Communication': 4,
      };

      const pathwayHigh = await matcher.generatePersonalisedPathway('Deputy Director [Price Statistics] (ISS)', highProficiency);
      expect(pathwayHigh.overallReadiness).toBeGreaterThan(pathwayLow.overallReadiness);
      expect(pathwayHigh.identifiedGaps.length).toBeLessThan(pathwayLow.identifiedGaps.length);
    });

    it('dynamically generates 4-tier ZPD pathway for a completely novel/custom designation', async () => {
      const customDesignation = 'Senior Environmental Statistician (MOEFCC)';
      const customProficiency = {
        'Survey Design & Sampling': 2,
        'CAPI & Digital Field Enumeration': 2,
        'Data Privacy & DPDPA 2023': 3,
        'Public Ethics & Field Communication': 3,
      };

      const customPathway = await matcher.generatePersonalisedPathway(customDesignation, customProficiency);

      expect(customPathway.cadre).toBe(customDesignation);
      expect(customPathway.division).toBeDefined();
      expect(customPathway.tiers.length).toBe(4);
      expect(customPathway.tiers[0].courses.length).toBeGreaterThan(0);
      expect(customPathway.tiers[3].courses.length).toBeGreaterThan(0);
    });
  });

  describe('7. Dynamic MoSPI FRAC Matrix Competency Resolution', () => {
    it('retrieves FRAC competencies dynamically for the 6th officer (Deputy Director)', async () => {
      const competencies = await competencyEngine.getRequiredSkillsForRole('Deputy Director [Price Statistics] (ISS)');

      expect(competencies.length).toBeGreaterThan(0);
      const skillNames = competencies.map((c: any) => c.skillName);
      expect(skillNames).toContain('Price Statistics & Index Number Theory');
    });

    it('dynamically resolves competencies for an arbitrary non-listed role via fallback', async () => {
      const competencies = await competencyEngine.getRequiredSkillsForRole('Chief Statistical Strategist (NITI Aayog)');

      expect(competencies.length).toBeGreaterThan(0);
      expect(competencies[0].skillName).toBeDefined();
      expect(competencies[0].targetLevel).toBeDefined();
    });
  });
});
