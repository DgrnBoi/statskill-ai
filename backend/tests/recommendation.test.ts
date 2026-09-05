import request from 'supertest';
import app from '../src/index';

describe('Pillar 2: Personalized Recommendation Engine & 4-Tier ZPD Pathways', () => {
  it('TC_REC_001: Returns targeted authentic course recommendation for a single topic deficit', async () => {
    const res = await request(app)
      .post('/api/recommend/course')
      .send({
        gapTopic: 'Survey Sampling',
        gapDescription: 'Failed First Stage Unit (FSU) selection and stratification',
        assessedLevel: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.recommendation).toBeDefined();
    expect(res.body.recommendation.title).toBeDefined();
    expect(res.body.recommendation.link).toContain('http');
    expect(res.body.recommendation.rationale).toContain('Recommended because the officer demonstrated a gap');
  });

  it('TC_REC_002: Rejects invalid empty request for single course recommendation', async () => {
    const res = await request(app)
      .post('/api/recommend/course')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('TC_REC_003: Generates 4-tier structured learning pathway for Junior Statistical Officer (JSO)', async () => {
    const res = await request(app)
      .post('/api/recommend/pathway')
      .send({
        designation: 'Junior Statistical Officer (JSO)',
        proficiencies: {
          'Survey Design & Sampling': 1,
          'CAPI & Digital Field Enumeration': 2,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const pathway = res.body.pathway;
    expect(pathway.cadre).toBe('Junior Statistical Officer (JSO)');
    expect(pathway.division).toContain('Field Operations Division');
    expect(pathway.tiers).toHaveLength(4);
    expect(pathway.tiers[0].tierNumber).toBe(1);
    expect(pathway.tiers[0].tierName).toContain('Tier 1: Foundation');
    expect(pathway.tiers[1].tierNumber).toBe(2);
    expect(pathway.tiers[1].tierName).toContain('Tier 2: Operational');
    expect(pathway.tiers[2].tierNumber).toBe(3);
    expect(pathway.tiers[2].tierName).toContain('Tier 3: Core Cadre Benchmark');
    expect(pathway.tiers[3].tierNumber).toBe(4);
    expect(pathway.tiers[3].tierName).toContain('Tier 4: Strategic');
    for (const tier of pathway.tiers) {
      expect(tier.courses.length).toBeGreaterThan(0);
      tier.courses.forEach((course: any) => {
        expect(course.title).toBeTruthy();
        expect(course.link).toMatch(/^https?:\/\//);
        expect(course.rationale).toBeTruthy();
      });
    }
    expect(pathway.milestones.length).toBe(3);
    expect(pathway.totalEstimatedHours).toBeGreaterThan(0);
  });

  it('TC_REC_004: Generates 4-tier structured pathway for Director [DIID] (ISS)', async () => {
    const res = await request(app)
      .post('/api/recommend/pathway')
      .send({
        designation: 'Director [DIID] (ISS)',
        proficiencies: {
          'Official Statistics Architecture': 4,
          'Big Data, Cloud & AI/ML Architecture': 3,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pathway.cadre).toBe('Director [DIID] (ISS)');
    expect(res.body.pathway.division).toContain('Data Informatics & Innovation Division');
    expect(res.body.pathway.tiers).toHaveLength(4);
  });

  it('TC_REC_005: Supports GET /api/recommend/pathway preview endpoint', async () => {
    const res = await request(app).get('/api/recommend/pathway?cadre=Senior Statistical Officer (SSO)');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pathway.cadre).toBe('Senior Statistical Officer (SSO)');
  });

  it('TC_REC_006: Returns mapped progression clusters and cluster course chains', async () => {
    const res = await request(app).get('/api/recommend/clusters');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalMapped).toBeGreaterThanOrEqual(200);
    expect(res.body.clusters.length).toBeGreaterThanOrEqual(8);

    const clusterRes = await request(app).get('/api/recommend/clusters/gem_procurement');
    expect(clusterRes.status).toBe(200);
    expect(clusterRes.body.success).toBe(true);
    expect(clusterRes.body.cluster.clusterName).toContain('GeM & Public Procurement');
    expect(clusterRes.body.courses.length).toBeGreaterThanOrEqual(7);
  });

  it('TC_REC_007: Fetches specific course progression graph node with prerequisites and next steps', async () => {
    const res = await request(app).get('/api/recommend/progression/do_113957853015203840187');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progression.title).toContain('Intermediate Level 1 Course for Buyers');
    expect(res.body.progression.prerequisites).toContain('do_1139274381103841281141');
    expect(res.body.progression.nextProgression).toContain('do_1139960098158100481107');
  });

  it('TC_REC_008: Evaluates assessment answers, detects misconceptions, updates proficiency, and suggests remedial courses & cohorts', async () => {
    const res = await request(app)
      .post('/api/recommend/analyze-assessment')
      .send({
        officerId: 'JSO_1042',
        cadre: 'Junior Statistical Officer (JSO)',
        answers: [
          {
            questionText: 'In a multi-stage stratified survey design adopted by NSSO, what does FSU represent?',
            selectedOption: 'First Stage Unit',
            correctAnswer: 'First Stage Unit',
            isCorrect: true,
            topic: 'Survey Design & Sampling',
          },
          {
            questionText: 'In survey data processing, what does a multiplier represent?',
            selectedOption: 'The square root of the stratum sample variance',
            correctAnswer: 'The reciprocal of its probability of selection',
            isCorrect: false,
            topic: 'Survey Design & Sampling',
            distractorAnalysis: {
              'The square root of the stratum sample variance': {
                misconception: 'Confusing multiplier expansion factors with standard error and variance metrics.',
                remedialSkill: 'Survey Design & Sampling',
                recommendedCourseId: 'nsso-sampling-201',
                recommendedCourseTitle: 'Planning & Designing Large-Scale Sample Surveys',
              },
            },
          },
        ],
        proficiencies: {
          'Survey Design & Sampling': 3,
          'CAPI & Digital Field Enumeration': 2,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const { analysis } = res.body;
    expect(analysis.officerId).toBe('JSO_1042');
    expect(analysis.scorePercentage).toBe(50);
    expect(analysis.status).toBe('remedial');
    expect(analysis.misconceptionsFound).toHaveLength(1);
    expect(analysis.misconceptionsFound[0].misconception).toContain('Confusing multiplier expansion factors');
    expect(analysis.misconceptionsFound[0].remedialCourse).toContain('Planning & Designing Large-Scale Sample Surveys');
    expect(analysis.recommendedCohorts.length).toBe(4);
    expect(analysis.updatedProficiency).toBeDefined();
  });
});
