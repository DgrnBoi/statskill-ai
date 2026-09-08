import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRoutes from '../src/routes/authRoutes';
import recommendRoutes from '../src/routes/recommendRoutes';
import { userDb } from '../src/db/UserDatabase';
import { QuizGeneratorService } from '../src/services/ai/QuizGenerator';

const app = express();
app.use(express.json());
process.env.JWT_SECRET = 'mospi_test_secret_key_2026';
app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes);

describe('StatSkill AI - Multi-User Database, Distinct Courses & Dynamic Authentication Suite', () => {
  const quizService = new QuizGeneratorService();

  beforeEach(() => {
    userDb.clearAllUsers();
    userDb.seedSampleUsers();
  });

  describe('1. UserDatabase CRUD & Multi-User Isolation', () => {
    it('seeds initial MoSPI officers across operational divisions when requested', () => {
      const users = userDb.getAllUsers();
      expect(users.length).toBeGreaterThanOrEqual(4);

      const divisions = users.map((u) => u.division);
      expect(divisions.some((d) => d.includes('Field Operations Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('Data Processing Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('National Accounts Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('Data Informatics & Innovation Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('Survey Design & Research Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('Economic Statistics Division'))).toBe(true);
      expect(divisions.some((d) => d.includes('National Statistical Systems Training Academy'))).toBe(true);
    });

    it('filters users dynamically by division, cadre, and search string', () => {
      const fodOfficers = userDb.getAllUsers({ division: 'Field Operations Division' });
      expect(fodOfficers.length).toBeGreaterThanOrEqual(1);
      fodOfficers.forEach((o) => expect(o.division).toContain('Field Operations Division'));

      const issOfficers = userDb.getAllUsers({ cadre: 'Indian Statistical Service' });
      expect(issOfficers.length).toBeGreaterThanOrEqual(1);
      issOfficers.forEach((o) => expect(o.cadre).toContain('Indian Statistical Service'));

      const searchResult = userDb.getAllUsers({ search: 'Vikram' });
      expect(searchResult.length).toBe(1);
      expect(searchResult[0].name).toBe('Dr. Vikram Seth');
      expect(searchResult[0].parichayId).toBe('PARICHAY_6120_ISS');
    });

    it('registers a completely new dynamic officer with isolated record in DB', () => {
      const newOfficer = userDb.registerUser({
        name: 'Dr. Suresh Ranganathan',
        designation: 'Joint Director [Price Statistics] (ISS)',
        division: 'Economic Statistics Division (ESD), MoSPI',
        cadre: 'Indian Statistical Service (ISS)',
        location: 'Chennai',
        parichayId: 'PARICHAY_9988_ISS',
        email: 'suresh.ranganathan@mospi.gov.in',
        mobile: '9840123456',
        experienceYears: 10,
      });

      expect(newOfficer.id).toBeDefined();
      expect(newOfficer.name).toBe('Dr. Suresh Ranganathan');
      expect(newOfficer.parichayId).toBe('PARICHAY_9988_ISS');

      const foundByParichay = userDb.getUserByParichayId('PARICHAY_9988_ISS');
      expect(foundByParichay).toBeDefined();
      expect(foundByParichay?.email).toBe('suresh.ranganathan@mospi.gov.in');

      const foundByMobile = userDb.getUserByMobile('9840123456');
      expect(foundByMobile).toBeDefined();
      expect(foundByMobile?.name).toBe('Dr. Suresh Ranganathan');
    });

    it('records an assessment strictly in the target user history without mutating other users', () => {
      const userA = userDb.getUserById('usr_1042')!;
      const userB = userDb.getUserById('usr_2088')!;

      const initialCountA = userA.assessmentHistory.length;
      const initialCountB = userB.assessmentHistory.length;

      userDb.recordAssessment('usr_1042', {
        id: 'eval-test-01',
        courseId: 'Survey Design',
        courseTitle: 'Multistage Stratified Sampling',
        category: 'Statistical Competencies',
        score: 100,
        totalScore: 100,
        scorePercentage: 100,
        status: 'passed',
        durationMinutes: 10,
        date: '2026-09-07',
      });

      const updatedUserA = userDb.getUserById('usr_1042')!;
      const updatedUserB = userDb.getUserById('usr_2088')!;

      expect(updatedUserA.assessmentHistory.length).toBe(initialCountA + 1);
      expect(updatedUserA.assessmentHistory[0].score).toBe(100);
      expect(updatedUserB.assessmentHistory.length).toBe(initialCountB);
    });
  });

  describe('2. Course Distinction & Non-Generic Questions', () => {
    it('generates distinct, domain-specific questions for 6 different MoSPI courses', async () => {
      const courses = [
        'Survey Design and Stratification',
        'Consumer Price Index (CPI) Methodology',
        'National Accounts Statistics',
        'Data Privacy and DPDPA Compliance',
        'CAPI & Digital Field Enumeration',
        'Big Data, Cloud & AI/ML Architecture',
      ];

      const papers = await Promise.all(
        courses.map((c) => quizService.generateFromPdf(undefined, 5, 'intermediate', 'POTATO_DEVICE', c))
      );

      // Verify all papers generated 5 questions
      papers.forEach((p, idx) => {
        expect(p.questions.length).toBe(5);
        expect(p.questions[0].courseId?.toLowerCase()).toContain(courses[idx].slice(0, 10).toLowerCase());
      });

      // Verify question texts are completely distinct between all 6 courses
      const questionSets = papers.map((p) => new Set(p.questions.map((q) => q.question)));
      for (let i = 0; i < questionSets.length; i++) {
        for (let j = i + 1; j < questionSets.length; j++) {
          const overlap = [...questionSets[i]].filter((q) => questionSets[j].has(q));
          expect(overlap.length).toBe(0);
        }
      }

      // Course 1 (Survey Design) contains sampling terminology
      expect(papers[0].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('sampling') || text.includes('fsu') || text.includes('multiplier') || text.includes('strata');
      })).toBe(true);

      // Course 2 (CPI) contains price index terminology
      expect(papers[1].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('cpi') || text.includes('geometric mean') || text.includes('price') || text.includes('inflation') || text.includes('laspeyres');
      })).toBe(true);

      // Course 3 (National Accounts) contains macroeconomic terminology
      expect(papers[2].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('sna') || text.includes('gdp') || text.includes('supply-use') || text.includes('gva') || text.includes('deflation');
      })).toBe(true);

      // Course 4 (DPDPA) contains data protection terminology
      expect(papers[3].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('dpdpa') || text.includes('fiduciary') || text.includes('consent') || text.includes('data') || text.includes('privacy');
      })).toBe(true);

      // Course 5 (CAPI) contains digital fieldwork terminology
      expect(papers[4].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('capi') || text.includes('paradata') || text.includes('gps') || text.includes('field') || text.includes('tablet');
      })).toBe(true);

      // Course 6 (Big Data Nowcasting) contains AI and modern data architecture
      expect(papers[5].questions.some((q) => {
        const text = q.question.toLowerCase();
        return text.includes('satellite') || text.includes('nowcasting') || text.includes('data') || text.includes('random forest') || text.includes('spatial');
      })).toBe(true);
    });
  });

  describe('3. Dynamic Authentication API Endpoints', () => {
    it('GET /api/auth/users returns full list of registered officers', async () => {
      const res = await request(app).get('/api/auth/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(12);
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('POST /api/auth/register creates a dynamic officer and returns valid JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Nitin Gadkari',
          designation: 'Director (ISS)',
          division: 'National Accounts Division (NAD)',
          cadre: 'Indian Statistical Service (ISS)',
          location: 'New Delhi',
          parichayId: 'PARICHAY_7777_ISS',
          email: 'nitin.gadkari@mospi.gov.in',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.officer.name).toBe('Nitin Gadkari');

      // Verify token is verifiable
      const decoded: any = jwt.verify(res.body.token, 'mospi_test_secret_key_2026');
      expect(decoded.parichayId).toBe('PARICHAY_7777_ISS');
      expect(decoded.designation).toBe('Director (ISS)');
    });

    it('POST /api/auth/login authenticates via Parichay ID or Mobile', async () => {
      const resParichay = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'PARICHAY_6120_ISS', method: 'parichay-id' });

      expect(resParichay.status).toBe(200);
      expect(resParichay.body.officer.name).toBe('Dr. Vikram Seth');

      const resMobile = await request(app)
        .post('/api/auth/login')
        .send({ identifier: '9876543215', method: 'mobile-otp' });

      expect(resMobile.status).toBe(200);
      expect(resMobile.body.officer.name).toBe('Dr. Vikram Seth');
    });
  });

  describe('4. Multi-User Diagnostic Assessment & Individualized Progression', () => {
    it('processes assessments for 5 distinct officers and updates individualized competencies', async () => {
      // 5 Officers across different cadres taking their respective exams
      const testCases = [
        {
          officerId: 'PARICHAY_1042_NSSO',
          cadre: 'Junior Statistical Officer (JSO)',
          answers: [
            { questionText: 'FSU Definition in NSSO', topic: 'Survey Design & Sampling', selectedOption: 'A', correctAnswer: 'A', isCorrect: true },
            { questionText: 'Multiplier calculation', topic: 'Survey Design & Sampling', selectedOption: 'B', correctAnswer: 'B', isCorrect: true },
          ],
          initialProficiency: { 'Survey Design & Sampling': 3 },
          expectedStatus: 'passed',
        },
        {
          officerId: 'PARICHAY_6120_ISS',
          cadre: 'Deputy Director [Price Statistics] (ISS)',
          answers: [
            { questionText: 'CPI Geometric Mean Formula', topic: 'Price Statistics & Index Number Theory', selectedOption: 'A', correctAnswer: 'A', isCorrect: true },
            { questionText: 'Web scraping price index', topic: 'High-Frequency Econometric Modeling', selectedOption: 'C', correctAnswer: 'C', isCorrect: true },
          ],
          initialProficiency: { 'Price Statistics & Index Number Theory': 4 },
          expectedStatus: 'passed',
        },
        {
          officerId: 'PARICHAY_3612_ISS',
          cadre: 'Assistant Director (ISS)',
          answers: [
            { questionText: 'SUT Double Deflation', topic: 'National Accounts & Macro Indices', selectedOption: 'Wrong Option', correctAnswer: 'Deflate output with output index', isCorrect: false },
          ],
          initialProficiency: { 'National Accounts & Macro Indices': 4 },
          expectedStatus: 'remedial',
        },
        {
          officerId: 'PARICHAY_2088_NSSO',
          cadre: 'Senior Statistical Officer (SSO)',
          answers: [
            { questionText: 'DPDPA Fiduciary duties', topic: 'Data Privacy & DPDPA 2023', selectedOption: 'A', correctAnswer: 'A', isCorrect: true },
          ],
          initialProficiency: { 'Data Privacy & DPDPA 2023': 3 },
          expectedStatus: 'passed',
        },
        {
          officerId: 'PARICHAY_4820_ISS',
          cadre: 'Director [DIID] (ISS)',
          answers: [
            { questionText: 'High-performance nowcasting architecture', topic: 'Big Data, Cloud & AI/ML Architecture', selectedOption: 'A', correctAnswer: 'A', isCorrect: true },
          ],
          initialProficiency: { 'Big Data, Cloud & AI/ML Architecture': 4 },
          expectedStatus: 'passed',
        },
      ];

      for (const tc of testCases) {
        const res = await request(app)
          .post('/api/recommend/analyze-assessment')
          .send({
            officerId: tc.officerId,
            cadre: tc.cadre,
            answers: tc.answers,
            proficiencies: tc.initialProficiency,
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.analysis.status).toBe(tc.expectedStatus);

        // Verify userDb was updated with assessment record and new proficiency
        const user = userDb.getUserByParichayId(tc.officerId);
        expect(user).toBeDefined();
        expect(user?.assessmentHistory.length).toBeGreaterThan(0);
      }

      // Check that Officer 1 and Officer 3 have completely isolated records
      const user1 = userDb.getUserByParichayId('PARICHAY_1042_NSSO')!;
      const user3 = userDb.getUserByParichayId('PARICHAY_3612_ISS')!;

      expect(user1.assessmentHistory[0].status).toBe('passed');
      expect(user3.assessmentHistory[0].status).toBe('remedial');
      expect(user3.assessmentHistory[0].misconceptions?.length).toBe(1);
      expect(user1.assessmentHistory[0].misconceptions?.length).toBe(0);
    });
  });
});
