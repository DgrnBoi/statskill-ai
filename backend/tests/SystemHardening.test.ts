import request from 'supertest';
import app from '../src/index';
import fs from 'fs';
import path from 'path';
import { resolveDataPath } from '../src/utils/dataPath';
import { extractCleanJson } from '../src/services/ai/AIEvaluationService';

describe('System Hardening & Production Quality Test Suite', () => {

  describe('1. Production Compiled Data Asset Verification', () => {
    it('TC_HARDEN_001: Verifies all 8 core JSON data assets are present in resolved data directory', () => {
      const requiredFiles = [
        'courses_catalog.json',
        'mospi_frac_matrix.json',
        'question_bank.json',
        'course_clusters_progression.json',
        'mospi_divisions.json',
        'amrit_gyaan_kosh.json',
        'nssta_tpac_catalog.json',
      ];

      for (const fileName of requiredFiles) {
        const filePath = resolveDataPath(fileName);
        expect(fs.existsSync(filePath)).toBe(true);
        const stats = fs.statSync(filePath);
        expect(stats.size).toBeGreaterThan(100);
      }
    });

    it('TC_HARDEN_002: Verifies course catalog contains exactly 884 courses', () => {
      const filePath = resolveDataPath('courses_catalog.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const courses = Array.isArray(data) ? data : data.courses;
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBe(884);
    });

    it('TC_HARDEN_003: Verifies FRAC matrix covers all 4 statistical cadres', () => {
      const filePath = resolveDataPath('mospi_frac_matrix.json');
      const matrix = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      expect(matrix).toHaveProperty('cadres');
      expect(Array.isArray(matrix.cadres)).toBe(true);
      const cadreIds = matrix.cadres.map((c: any) => c.id);
      expect(cadreIds).toContain('jso');
      expect(cadreIds).toContain('sso');
      expect(cadreIds).toContain('assistant_director');
      expect(cadreIds).toContain('director');
    });
  });

  describe('2. Security & Request Validation (Zod & Auth)', () => {
    it('TC_HARDEN_004: Rejects registration request with invalid schema (Zod validation)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          name: 'A',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid request payload|Validation failed/i);
    });

    it('TC_HARDEN_005: Protects profile update route against unauthenticated requests', async () => {
      const res = await request(app)
        .put('/api/auth/profile/user_9999')
        .send({ name: 'Hacker Name' });

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Authentication required/i);
    });
  });

  describe('3. Robust AI Response Parsing & Recovery', () => {
    it('TC_HARDEN_006: Recovers cleanly from markdown-wrapped AI JSON responses', () => {
      const markdownJson = `\`\`\`json
{
  "score": 85,
  "feedback": "Strong understanding of survey sampling methodology."
}
\`\`\``;

      const parsed = extractCleanJson(markdownJson);
      expect(parsed).toEqual({
        score: 85,
        feedback: "Strong understanding of survey sampling methodology."
      });
    });

    it('TC_HARDEN_007: Recovers cleanly from conversational prefix before JSON block', () => {
      const dirtyAiOutput = `Here is your requested evaluation report in JSON format:
{
  "score": 92,
  "feedback": "Excellent statistical domain knowledge."
}`;

      const parsed = extractCleanJson(dirtyAiOutput);
      expect(parsed.score).toBe(92);
    });
  });

  describe('4. Backend Endpoint Integration & Search Accuracy', () => {
    it('TC_HARDEN_008: GET /api/courses/search returns relevant results for "sampling"', async () => {
      const res = await request(app).get('/api/courses/search?q=sampling');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.courses)).toBe(true);
      expect(res.body.courses.length).toBeGreaterThan(0);
    });

    it('TC_HARDEN_009: POST /api/auth/demo-login returns authenticated user token and profile', async () => {
      const res = await request(app)
        .post('/api/auth/demo-login')
        .send({ officerId: 'jso' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.officer).toBeDefined();
      expect(res.body.officer.cadre).toBe('Subordinate Statistical Service (SSS)');
    });
  });
});
