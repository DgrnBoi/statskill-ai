import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';

describe('MoSPI 5-Cadre End-to-End Persona Verification Suite', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-signing-secret';
  });

  const FIVE_OFFICERS = [
    {
      id: 'jso',
      name: 'Eshaan Sunthankar',
      designation: 'Junior Statistical Officer (JSO)',
      division: 'Field Operations Division (FOD), NSSO',
      cadre: 'Subordinate Statistical Service (SSS)',
      parichayId: 'PARICHAY_1042_NSSO',
      examCourseId: 'Survey Design and Stratification',
      benchmarkLevel: 3,
    },
    {
      id: 'sso',
      name: 'Ananya Mehta',
      designation: 'Senior Statistical Officer (SSO)',
      division: 'Data Processing Division (DPD), NSSO',
      cadre: 'Subordinate Statistical Service (SSS)',
      parichayId: 'PARICHAY_2088_NSSO',
      examCourseId: 'Survey Design and Stratification',
      benchmarkLevel: 4,
    },
    {
      id: 'assistant-director',
      name: 'Rohan Iyer',
      designation: 'Assistant Director (ISS)',
      division: 'National Accounts Division (NAD)',
      cadre: 'Indian Statistical Service (ISS)',
      parichayId: 'PARICHAY_3612_ISS',
      examCourseId: 'National Accounts Statistics',
      benchmarkLevel: 4,
    },
    {
      id: 'director',
      name: 'Kavita Rao',
      designation: 'Director (ISS)',
      division: 'Data Informatics & Innovation Division (DIID)',
      cadre: 'Indian Statistical Service (ISS)',
      parichayId: 'PARICHAY_4820_ISS',
      examCourseId: 'Data Privacy and DPDPA Compliance',
      benchmarkLevel: 5,
    },
    {
      id: 'joint-director',
      name: 'Dr. Rajeshwari Nair',
      designation: 'Joint Director [SDRD] (ISS)',
      division: 'Survey Design & Research Division (SDRD), NSSO',
      cadre: 'Indian Statistical Service (ISS)',
      parichayId: 'PARICHAY_5914_ISS',
      examCourseId: 'Survey Design & Sampling Theory',
      benchmarkLevel: 5,
    },
  ];

  describe('Step 1: Jan Parichay Authentication for all 5 Persons', () => {
    it.each(FIVE_OFFICERS)(
      'authenticates  () and issues valid JWT claims',
      async (officer) => {
        const response = await request(app)
          .post('/api/auth/demo-login')
          .send({ officerId: officer.id, method: 'parichay-id' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.expiresIn).toBe(28800);

        const decoded = jwt.verify(response.body.token, 'test-signing-secret') as any;
        expect(decoded.parichayId).toBe(officer.parichayId);
        expect(decoded.name).toBe(officer.name);
        expect(decoded.designation).toBe(officer.designation);
        expect(decoded.division).toBe(officer.division);
        expect(decoded.cadre).toBe(officer.cadre);
      }
    );
  });

  describe('Step 2: Competency Mapping & FRAC Matrix for all 5 Cadres', () => {
    it.each(FIVE_OFFICERS)(
      'retrieves verified competency requirements for ',
      async (officer) => {
        const response = await request(app)
          .get('/api/competency')
          .query({ designation: officer.designation });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(2);

        response.body.forEach((comp: any) => {
          expect(comp.skillName).toBeDefined();
          expect(comp.targetLevel).toBeGreaterThanOrEqual(1);
          expect(comp.category).toBeDefined();
        });
      }
    );
  });

  describe('Step 3: Taking Diagnostic Assessment for all 5 Persons and Verifying Analysis', () => {
    it('Officer 1 [FOD]: Eshaan Sunthankar completes assessment, receives misconception remediation & updated proficiency', async () => {
      const answers = [
        {
          questionText: 'In a multi-stage stratified survey design adopted by NSSO, what does FSU represent?',
          selectedOption: 'Final Sampling Unit',
          correctAnswer: 'First Stage Unit',
          isCorrect: false,
          topic: 'Survey Design & Sampling',
          distractorAnalysis: {
            'Final Sampling Unit': {
              misconception: 'Confusing the initial First Stage Unit (FSU) with the Ultimate Stage Sampling Unit (USU/household).',
              remedialSkill: 'Survey Design & Sampling',
              recommendedCourseId: 'nsso-sampling-201',
              recommendedCourseTitle: 'Planning & Designing Large-Scale Sample Surveys',
            },
          },
        },
        {
          questionText: 'What is the primary statistical objective of creating homogeneous strata prior to sampling?',
          selectedOption: 'To minimize intra-stratum variance and reduce standard error',
          correctAnswer: 'To minimize intra-stratum variance and reduce standard error',
          isCorrect: true,
          topic: 'Survey Design & Sampling',
        },
        {
          questionText: 'In survey data processing, what does a multiplier signify?',
          selectedOption: 'The reciprocal of its probability of selection',
          correctAnswer: 'The reciprocal of its probability of selection',
          isCorrect: true,
          topic: 'Survey Design & Sampling',
        },
        {
          questionText: 'Which CAPI field protocol is required for GPS geotagging?',
          selectedOption: 'Record coordinates at the First Stage Unit boundary',
          correctAnswer: 'Record coordinates at the First Stage Unit boundary',
          isCorrect: true,
          topic: 'CAPI & Digital Field Enumeration',
        },
        {
          questionText: 'Under DPDPA 2023, what is required before collecting household PII?',
          selectedOption: 'Verifiable notice and informant consent',
          correctAnswer: 'Verifiable notice and informant consent',
          isCorrect: true,
          topic: 'Data Privacy & DPDPA 2023',
        },
      ];

      const initialProficiency = {
        'Survey Design & Sampling': 3,
        'CAPI & Digital Field Enumeration': 3,
        'Data Privacy & DPDPA 2023': 2,
      };

      const res = await request(app)
        .post('/api/recommend/analyze-assessment')
        .send({
          officerId: 'PARICHAY_1042_NSSO',
          cadre: 'Junior Statistical Officer (JSO)',
          answers,
          proficiencies: initialProficiency,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const { analysis } = res.body;

      expect(analysis.scorePercentage).toBe(80);
      expect(analysis.status).toBe('passed');
      expect(analysis.misconceptionsFound.length).toBe(1);
      expect(analysis.misconceptionsFound[0].misconception).toContain('Ultimate Stage Sampling Unit');
      expect(analysis.misconceptionsFound[0].remedialCourse).toBe('Planning & Designing Large-Scale Sample Surveys');
      expect(analysis.recommendedCourses.length).toBeGreaterThanOrEqual(1);
      expect(analysis.updatedProficiency['CAPI & Digital Field Enumeration']).toBe(4);
    });

    it('Officer 2 [DPD]: Ananya Mehta completes assessment, triggers remedial status with multiple targeted gap modules', async () => {
      const answers = [
        {
          questionText: 'In survey data processing, what does a multiplier (inflation factor) signify?',
          selectedOption: 'The square root of the stratum sample variance',
          correctAnswer: 'The reciprocal of its probability of selection',
          isCorrect: false,
          topic: 'Survey Design & Sampling Weights',
          distractorAnalysis: {
            'The square root of the stratum sample variance': {
              misconception: 'Confusing multiplier expansion factors with standard error and variance metrics.',
              remedialSkill: 'Survey Design & Sampling Weights',
              recommendedCourseId: 'nsso-sampling-201',
              recommendedCourseTitle: 'Planning & Designing Large-Scale Sample Surveys',
            },
          },
        },
        {
          questionText: 'What is the primary method for identifying outlier household expenditures?',
          selectedOption: 'Arbitrary manual deletion of top 5% values',
          correctAnswer: 'Interquartile range (IQR) and studentized residual scrutiny',
          isCorrect: false,
          topic: 'Statistical Data Analytics (R & Python)',
          distractorAnalysis: {
            'Arbitrary manual deletion of top 5% values': {
              misconception: 'Manual ad-hoc truncation induces severe downward bias in consumption aggregates.',
              remedialSkill: 'Statistical Data Analytics (R & Python)',
              recommendedCourseId: 'r-microdata-301',
              recommendedCourseTitle: 'Automated Microdata Cleaning & Anonymization Pipelines',
            },
          },
        },
        {
          questionText: 'Under DPDPA 2023, what anonymization technique is applied to public microdata files?',
          selectedOption: 'k-anonymity and top-coding of sensitive variables',
          correctAnswer: 'k-anonymity and top-coding of sensitive variables',
          isCorrect: true,
          topic: 'Cyber Security & Data Fiduciary',
        },
        {
          questionText: 'What is the function of the second-stage multiplier in 2-stage sampling?',
          selectedOption: 'Expands household sample to stratum sub-population aggregate',
          correctAnswer: 'Expands household sample to stratum sub-population aggregate',
          isCorrect: true,
          topic: 'Survey Design & Sampling Weights',
        },
        {
          questionText: 'How are missing values imputed in NSS consumer expenditure rounds?',
          selectedOption: 'Hot-deck imputation from donor records in the same sub-stratum',
          correctAnswer: 'Hot-deck imputation from donor records in the same sub-stratum',
          isCorrect: true,
          topic: 'Statistical Data Analytics (R & Python)',
        },
      ];

      const res = await request(app)
        .post('/api/recommend/analyze-assessment')
        .send({
          officerId: 'PARICHAY_2088_NSSO',
          cadre: 'Senior Statistical Officer (SSO)',
          answers,
          proficiencies: { 'Survey Design & Sampling Weights': 3, 'Statistical Data Analytics (R & Python)': 3 },
        });

      expect(res.status).toBe(200);
      const { analysis } = res.body;

      expect(analysis.scorePercentage).toBe(60);
      expect(analysis.status).toBe('remedial');
      expect(analysis.misconceptionsFound.length).toBe(2);
      expect(analysis.recommendedCourses.length).toBeGreaterThanOrEqual(1);
    });

    it('Officer 3 [NAD]: Rohan Iyer completes assessment with 100% score and advances mastery', async () => {
      const answers = [
        {
          questionText: 'In national accounting, what is Gross Value Added (GVA) at basic prices equal to?',
          selectedOption: 'Gross Output at basic prices minus Intermediate Consumption at purchasers prices',
          correctAnswer: 'Gross Output at basic prices minus Intermediate Consumption at purchasers prices',
          isCorrect: true,
          topic: 'National Accounts & Macro Indices',
        },
        {
          questionText: 'Which deflator is utilized to derive real Gross Domestic Product from nominal GDP?',
          selectedOption: 'Implicit GDP Deflator based on Supply-Use Table pricing',
          correctAnswer: 'Implicit GDP Deflator based on Supply-Use Table pricing',
          isCorrect: true,
          topic: 'National Accounts & Macro Indices',
        },
        {
          questionText: 'What is the purpose of seasonal adjustment using X-13ARIMA-SEATS on CPI indices?',
          selectedOption: 'To isolate underlying trend-cycle movements from predictable seasonal variations',
          correctAnswer: 'To isolate underlying trend-cycle movements from predictable seasonal variations',
          isCorrect: true,
          topic: 'Time Series & Seasonal Adjustment',
        },
        {
          questionText: 'How are Supply and Use Tables (SUT) balanced under the SNA 2008 framework?',
          selectedOption: 'By reconciling commodity flows such that total supply equals total use for each product',
          correctAnswer: 'By reconciling commodity flows such that total supply equals total use for each product',
          isCorrect: true,
          topic: 'National Accounts & Macro Indices',
        },
        {
          questionText: 'Under the National Data Governance Framework, how are inter-ministerial statistical APIs published?',
          selectedOption: 'Through standardized open API schemas on the National Data & Analytics Platform (NDAP)',
          correctAnswer: 'Through standardized open API schemas on the National Data & Analytics Platform (NDAP)',
          isCorrect: true,
          topic: 'National Data Governance Framework',
        },
      ];

      const res = await request(app)
        .post('/api/recommend/analyze-assessment')
        .send({
          officerId: 'PARICHAY_3612_ISS',
          cadre: 'Assistant Director (ISS)',
          answers,
          proficiencies: { 'National Accounts & Macro Indices': 3, 'Time Series & Seasonal Adjustment': 3 },
        });

      expect(res.status).toBe(200);
      const { analysis } = res.body;

      expect(analysis.scorePercentage).toBe(100);
      expect(analysis.status).toBe('passed');
      expect(analysis.misconceptionsFound.length).toBe(0);
      expect(analysis.updatedProficiency['National Accounts & Macro Indices']).toBeGreaterThanOrEqual(4);
      expect(analysis.updatedProficiency['Time Series & Seasonal Adjustment']).toBeGreaterThanOrEqual(4);
    });

    it('Officer 4 [DIID]: Kavita Rao completes enterprise data governance assessment with live telemetry', async () => {
      const answers = [
        {
          questionText: 'What is the role of a Data Protection Officer (DPO) under DPDPA 2023 for Significant Data Fiduciaries?',
          selectedOption: 'To serve as the point of contact for grievance redressal and ensure statutory compliance',
          correctAnswer: 'To serve as the point of contact for grievance redressal and ensure statutory compliance',
          isCorrect: true,
          topic: 'Digital Personal Data Protection & Sovereign Clouds',
        },
        {
          questionText: 'Under DPDPA 2023, what is the maximum penalty for significant failure to prevent personal data breach?',
          selectedOption: 'Up to Rs. 250 Crores per breach instance adjudicated by the Data Protection Board',
          correctAnswer: 'Up to Rs. 250 Crores per breach instance adjudicated by the Data Protection Board',
          isCorrect: true,
          topic: 'Digital Personal Data Protection & Sovereign Clouds',
        },
        {
          questionText: 'How is satellite imagery integrated into official agricultural statistics nowcasting?',
          selectedOption: 'Using deep learning semantic segmentation models on Sentinel-2 multispectral bands',
          correctAnswer: 'Using deep learning semantic segmentation models on Sentinel-2 multispectral bands',
          isCorrect: true,
          topic: 'Big Data, Cloud & AI/ML Architecture',
        },
        {
          questionText: 'What is the required standard for transmitting xAPI learning telemetry statements to national LRS?',
          selectedOption: 'ADL xAPI v1.0.3 formatted JSON-LD over TLS with cryptographic timestamp',
          correctAnswer: 'ADL xAPI v1.0.3 formatted JSON-LD over TLS with cryptographic timestamp',
          isCorrect: true,
          topic: 'Official Statistics Architecture',
        },
        {
          questionText: 'When may biometric informant data be transferred outside India under DPDPA 2023?',
          selectedOption: 'Anytime without government notification',
          correctAnswer: 'Only to notified jurisdictions and subject to negative list restrictions',
          isCorrect: false,
          topic: 'Digital Personal Data Protection & Sovereign Clouds',
          distractorAnalysis: {
            'Anytime without government notification': {
              misconception: 'Ignoring central government cross-border transfer blacklists and sovereign data protection restrictions.',
              remedialSkill: 'Digital Personal Data Protection & Sovereign Clouds',
              recommendedCourseId: 'dpdpa-gov-401',
              recommendedCourseTitle: 'DPDPA 2023 Compliance for Statistical Officers',
            },
          },
        },
      ];

      const res = await request(app)
        .post('/api/recommend/analyze-assessment')
        .send({
          officerId: 'PARICHAY_4820_ISS',
          cadre: 'Director (ISS)',
          answers,
          proficiencies: { 'Digital Personal Data Protection & Sovereign Clouds': 4, 'Big Data, Cloud & AI/ML Architecture': 4 },
        });

      expect(res.status).toBe(200);
      const { analysis } = res.body;

      expect(analysis.scorePercentage).toBe(80);
      expect(analysis.status).toBe('passed');
      expect(analysis.misconceptionsFound.length).toBe(1);
      expect(analysis.misconceptionsFound[0].remedialCourse).toBe('DPDPA 2023 Compliance for Statistical Officers');
    });

    it('Officer 5 [SDRD]: Dr. Rajeshwari Nair completes advanced sampling methodology assessment and reaches Level 5 benchmark', async () => {
      const answers = [
        {
          questionText: 'In multi-stage stratified survey sampling for NSS rounds, under what condition does Neyman Optimal Allocation allocate more sample units to a stratum?',
          selectedOption: 'When the stratum has a larger population and higher intra-stratum standard deviation',
          correctAnswer: 'When the stratum has a larger population and higher intra-stratum standard deviation',
          isCorrect: true,
          topic: 'Survey Design & Sampling Theory',
        },
        {
          questionText: 'Why is the Jackknife / Linearization replication method preferred over simple random sampling variance formulas in NSS multi-stage designs?',
          selectedOption: 'Because complex clustering and unequal selection probabilities violate SRS independence assumptions',
          correctAnswer: 'Because complex clustering and unequal selection probabilities violate SRS independence assumptions',
          isCorrect: true,
          topic: 'Non-Sampling Error & Variance Estimation',
        },
        {
          questionText: 'What is the primary objective of cognitive pre-testing during NSS questionnaire design?',
          selectedOption: 'To identify construct ambiguity, recall burden, and comprehension difficulties among respondents',
          correctAnswer: 'To identify construct ambiguity, recall burden, and comprehension difficulties among respondents',
          isCorrect: true,
          topic: 'Questionnaire & Instrument Design',
        },
        {
          questionText: 'How is Small Area Estimation (SAE) utilized to produce district-level poverty estimates?',
          selectedOption: 'By combining NSS survey data with Census administrative data via empirical Bayes Fay-Herriot area-level models',
          correctAnswer: 'By combining NSS survey data with Census administrative data via empirical Bayes Fay-Herriot area-level models',
          isCorrect: true,
          topic: 'Survey Design & Sampling Theory',
        },
        {
          questionText: 'In the Total Survey Error (TSE) paradigm, which component accounts for non-sampling error due to faulty frames?',
          selectedOption: 'Coverage error arising from omissions, duplications, or out-of-date frame units',
          correctAnswer: 'Coverage error arising from omissions, duplications, or out-of-date frame units',
          isCorrect: true,
          topic: 'Non-Sampling Error & Variance Estimation',
        },
      ];

      const res = await request(app)
        .post('/api/recommend/analyze-assessment')
        .send({
          officerId: 'PARICHAY_5914_ISS',
          cadre: 'Joint Director [SDRD] (ISS)',
          answers,
          proficiencies: {
            'Survey Design & Sampling Theory': 4,
            'Non-Sampling Error & Variance Estimation': 4,
            'Questionnaire & Instrument Design': 4,
          },
        });

      expect(res.status).toBe(200);
      const { analysis } = res.body;

      expect(analysis.scorePercentage).toBe(100);
      expect(analysis.status).toBe('passed');
      expect(analysis.misconceptionsFound.length).toBe(0);
      expect(analysis.updatedProficiency['Survey Design & Sampling Theory']).toBe(5);
      expect(analysis.updatedProficiency['Non-Sampling Error & Variance Estimation']).toBe(5);
    });
  });

  describe('Step 4: Zone of Proximal Development (ZPD) 4-Tier Pathway Generation for all 5 Cadres', () => {
    it.each(FIVE_OFFICERS)(
      'generates structured 4-tier learning pathways for ',
      async (officer) => {
        const res = await request(app)
          .post('/api/recommend/pathway')
          .send({
            designation: officer.designation,
            proficiencies: {
              'Survey Design & Sampling': 2,
              'CAPI & Digital Field Enumeration': 3,
            },
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        const { pathway } = res.body;

        expect(pathway.cadre).toBe(officer.designation);
        expect(pathway.division).toBe(officer.division);
        expect(pathway.overallReadiness).toBeGreaterThanOrEqual(0);
        expect(pathway.overallReadiness).toBeLessThanOrEqual(100);
        expect(pathway.totalEstimatedHours).toBeGreaterThan(0);
        expect(pathway.tiers.length).toBe(4);
        expect(pathway.milestones.length).toBe(3);
      }
    );
  });

  describe('Step 5: xAPI Telemetry Statement Logging for all 5 Officers', () => {
    it.each(FIVE_OFFICERS)(
      'successfully submits valid xAPI v1.0.3 statement for $name',
      async (officer) => {
        const payload = {
          userId: officer.parichayId,
          userName: officer.name,
          quizId: officer.id + '-eval',
          quizName: officer.division + ' Diagnostic Assessment',
          score: 90,
        };

        const res = await request(app)
          .post('/api/telemetry/submit')
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.statement).toBeDefined();
        expect(res.body.statement.actor.name).toBe(officer.name);
        expect(res.body.statement.actor.account.name).toBe(officer.parichayId);
        expect(res.body.statement.result.score.raw).toBe(90);
      }
    );
  });
});
