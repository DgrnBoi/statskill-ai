import request from 'supertest';
import app from '../src/index';

describe('Telemetry xAPI Integration', () => {
  it('TC_IGOT_003: Transmit xAPI standardized statement via /api/telemetry/xapi', async () => {
    const res = await request(app)
      .post('/api/telemetry/xapi')
      .send({
        userId: 'Official_1042',
        quizId: 'stats-101',
        score: 85,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.statement).toBeDefined();
    expect(res.body.statement.actor.name).toBe('MoSPI Official');
    expect(res.body.statement.actor.account.homePage).toBe('https://igotkarmayogi.gov.in');
    expect(res.body.statement.verb.id).toBe('http://adlnet.gov/expapi/verbs/completed');
    expect(res.body.statement.result.score.raw).toBe(85);
    expect(res.body.statement.result.score.scaled).toBe(0.85);
    expect(res.body.statement.result.success).toBe(true);
  });

  it('TC_IGOT_004: Transmit xAPI standardized statement via /api/telemetry/quiz alias', async () => {
    const res = await request(app)
      .post('/api/telemetry/quiz')
      .send({
        userId: 'JSO_1042',
        userName: 'Eshaan Sunthankar',
        quizId: 'sampling-01',
        quizName: 'Survey Design & Sampling',
        score: 100,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.statement.actor.name).toBe('Eshaan Sunthankar');
    expect(res.body.statement.actor.account.name).toBe('JSO_1042');
    expect(res.body.statement.object.definition.name['en-US']).toBe('Survey Design & Sampling');
    expect(res.body.statement.result.score.scaled).toBe(1.0);
    expect(res.body.statement.result.success).toBe(true);
  });

  it('TC_IGOT_005: Reject requests missing required fields', async () => {
    // Missing score
    const res1 = await request(app)
      .post('/api/telemetry/quiz')
      .send({
        userId: 'JSO_1042',
        quizId: 'sampling-01',
      });
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBe('Missing required telemetry fields.');

    // Missing userId
    const res2 = await request(app)
      .post('/api/telemetry/quiz')
      .send({
        quizId: 'sampling-01',
        score: 50,
      });
    expect(res2.status).toBe(400);

    // Missing quizId
    const res3 = await request(app)
      .post('/api/telemetry/quiz')
      .send({
        userId: 'JSO_1042',
        score: 50,
      });
    expect(res3.status).toBe(400);
  });

  it('TC_IGOT_006: Correctly evaluate failing threshold (score < 60%)', async () => {
    const res = await request(app)
      .post('/api/telemetry/quiz')
      .send({
        userId: 'JSO_1042',
        quizId: 'sampling-01',
        score: 40,
      });

    expect(res.status).toBe(200);
    expect(res.body.statement.result.score.scaled).toBe(0.4);
    expect(res.body.statement.result.success).toBe(false);
  });
});
