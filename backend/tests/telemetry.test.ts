import request from 'supertest';
import app from '../src/index';

describe('Telemetry xAPI Integration', () => {
  it('TC_IGOT_003: Transmit xAPI standardized string statement to sync endpoint', async () => {
    const res = await request(app)
      .post('/api/telemetry/xapi')
      .send({
        userId: "Official_1042",
        quizId: "stats-101",
        score: 85
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.statement).toBeDefined();
    expect(res.body.statement.actor.name).toBe("MoSPI Official");
    expect(res.body.statement.verb.id).toBe("http://adlnet.gov/expapi/verbs/completed");
    expect(res.body.statement.result.score.raw).toBe(85);
  });
});
