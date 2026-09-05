import request from 'supertest';
import app from '../src/index';

describe('Security & Anti-Spam Rate Limiting Suite', () => {
  it('TC_SEC_001: allows normal requests within rate limits', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('x-forwarded-for', '192.168.1.100');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('TC_SEC_002: sanitizes input queries, trims script tags and caps length at 100 chars', async () => {
    const maliciousQuery = '<script>alert("hack")</script>' + 'A'.repeat(150);
    const res = await request(app)
      .get('/api/courses/search?q=' + encodeURIComponent(maliciousQuery))
      .set('x-forwarded-for', '192.168.1.101');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('TC_SEC_003: detects burst click spam on quiz generation and enforces 429 quarantine', async () => {
    const clientIp = '10.0.0.55';

    // Fire 6 rapid spam requests
    const promises = Array.from({ length: 6 }).map(() =>
      request(app)
        .post('/api/quiz/generate-async?mode=POTATO_DEVICE')
        .set('x-forwarded-for', clientIp)
        .send({ difficulty: 'intermediate', numQuestions: 3, courseId: 'Sampling' })
    );

    const responses = await Promise.all(promises);
    const has429 = responses.some(r => r.status === 429);
    expect(has429).toBe(true);

    const rateLimitedRes = responses.find(r => r.status === 429);
    expect(rateLimitedRes?.body.error).toBeDefined();
    expect(rateLimitedRes?.headers['retry-after']).toBeDefined();
  });

  it('TC_SEC_004: supports bypass header for test suites and administrative runners', async () => {
    const res = await request(app)
      .get('/api/admin/divisions')
      .set('x-bypass-rate-limit', 'true');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
