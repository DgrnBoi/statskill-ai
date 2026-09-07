import request from 'supertest';
import app from '../src/index';

describe('Phase 3: Amrit Gyaan Kosh (National Statistical Knowledge Hub)', () => {
  it('GET /api/knowledge returns list of official MoSPI circulars and manuals', async () => {
    const res = await request(app).get('/api/knowledge');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);

    const firstCircular = res.body[0];
    expect(firstCircular).toHaveProperty('id');
    expect(firstCircular).toHaveProperty('title');
    expect(firstCircular).toHaveProperty('division');
    expect(firstCircular).toHaveProperty('docNumber');
    expect(firstCircular).toHaveProperty('topics');
    expect(Array.isArray(firstCircular.topics)).toBe(true);
  });

  it('GET /api/knowledge/:id returns full circular text for NSS 78th round', async () => {
    const res = await request(app).get('/api/knowledge/cir-nss-78');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('cir-nss-78');
    expect(res.body.title).toContain('NSS 78th Round');
    expect(res.body.sampleContent).toContain('Sampling Design');
  });

  it('GET /api/knowledge/:id returns 404 for nonexistent circular ID', async () => {
    const res = await request(app).get('/api/knowledge/cir-nonexistent-999');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });

  it('POST /api/quiz/model-health returns offline sovereign status when no key is supplied', async () => {
    const res = await request(app)
      .post('/api/quiz/model-health')
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('offline_ready');
    expect(res.body.mode).toBe('SOVEREIGN_ON_DEVICE');
  });
});
