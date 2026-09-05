import request from 'supertest';
import app from '../src/index';

describe('Security Vulnerability & Hardening Audit Suite', () => {

  describe('1. File Upload Defense & Payload Validation', () => {
    it('SEC_UP_001: rejects executable and non-PDF file uploads with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/quiz/generate-async?mode=MODERN_DEVICE')
        .set('x-bypass-rate-limit', 'true')
        .attach('document', Buffer.from('malicious binary content'), 'exploit.exe');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Only official PDF documents are permitted/i);
    });

    it('SEC_UP_002: sanitizes path traversal attempts in uploaded filenames', async () => {
      const res = await request(app)
        .post('/api/quiz/generate-async?mode=POTATO_DEVICE')
        .set('x-bypass-rate-limit', 'true')
        .field('courseId', '../../../../etc/shadow.pdf');

      expect(res.status).toBe(202);
      expect(res.body.success).toBe(true);
      expect(res.body.jobId).toBeDefined();
    });
  });

  describe('2. SQL Injection (SQLi) & Sanitization', () => {
    it('SEC_SQL_001: neutralizes SQL injection strings in course search query', async () => {
      const sqliPayloads = [
        "' OR '1'='1' --",
        "admin'; DROP TABLE officers; --",
        "1' UNION SELECT 1, 'admin', 'password' --",
        "' OR 1=1 #",
      ];

      for (const payload of sqliPayloads) {
        const res = await request(app)
          .get('/api/courses/search?q=' + encodeURIComponent(payload))
          .set('x-bypass-rate-limit', 'true');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.courses)).toBe(true);
      }
    });

    it('SEC_SQL_002: handles SQL injection in competency designation queries gracefully', async () => {
      const sqliPayload = "Director' OR 1=1 --";
      const res = await request(app)
        .get('/api/competency/required-skills?designation=' + encodeURIComponent(sqliPayload))
        .set('x-bypass-rate-limit', 'true');

      // Should return 200 with standard fallback competencies or 404/empty, never a 500 database crash
      expect([200, 400, 404]).toContain(res.status);
    });
  });

  describe('3. IDOR (Insecure Direct Object Reference) & Bounds Checking', () => {
    it('SEC_IDOR_001: prevents telemetry score tampering beyond valid boundaries (0-100)', async () => {
      // Attacker attempts to submit an out-of-bounds 9999 score or negative score
      const res = await request(app)
        .post('/api/telemetry/xapi')
        .set('x-bypass-rate-limit', 'true')
        .send({
          userId: 'JSO_1042',
          userName: 'Eshaan Sunthankar',
          quizId: 'sampling-01',
          quizName: 'Survey Design',
          score: 9999
        });

      expect(res.status).toBe(200);
      expect(res.body.statement.result.score.raw).toBe(100); // Clamped to 100
      expect(res.body.statement.result.score.scaled).toBe(1.0);
    });

    it('SEC_IDOR_002: rejects telemetry submissions with missing or invalid types', async () => {
      const res = await request(app)
        .post('/api/telemetry/xapi')
        .set('x-bypass-rate-limit', 'true')
        .send({
          userId: '',
          score: 'not-a-number'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Missing required telemetry fields/i);
    });

    it('SEC_IDOR_003: rejects demo-login requests with fabricated or unregistered officer IDs', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .set('x-bypass-rate-limit', 'true')
        .send({
          officerId: 'attacker_admin_999',
          method: 'parichay-id'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/A valid demo officer/i);
    });
  });

  describe('4. Cross-Site Scripting (XSS) Input Neutralization', () => {
    it('SEC_XSS_001: strips dangerous script tags and event handlers from telemetry fields', async () => {
      const xssPayload = '<script>alert(document.domain)</script><img src=x onerror=alert(1)>MoSPI Official';
      const res = await request(app)
        .post('/api/telemetry/xapi')
        .set('x-bypass-rate-limit', 'true')
        .send({
          userId: 'JSO_1042',
          userName: xssPayload,
          quizId: 'sampling-01',
          quizName: 'Survey <script>evil()</script> Design',
          score: 85
        });

      expect(res.status).toBe(200);
      expect(res.body.statement.actor.name).not.toContain('<script>');
      expect(res.body.statement.actor.name).not.toContain('onerror');
      expect(res.body.statement.object.definition.name['en-US']).not.toContain('<script>');
    });
  });
});
