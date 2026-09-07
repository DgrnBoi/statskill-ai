import request from 'supertest';
import app from '../src/index';

describe('MoSPI Capacity Building & Admin Routes', () => {
  it('TC_ADMIN_001: GET /api/admin/divisions returns 200 with all 5 MoSPI divisions', async () => {
    const res = await request(app).get('/api/admin/divisions');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCadreStrength).toBe(3220);
    expect(res.body.systemReadinessScore).toBeGreaterThan(70);
    expect(Array.isArray(res.body.divisions)).toBe(true);
    expect(res.body.divisions.length).toBe(5);

    const divisionCodes = res.body.divisions.map((d: any) => d.code);
    expect(divisionCodes).toContain('FOD-NSSO');
    expect(divisionCodes).toContain('DPD-NSSO');
    expect(divisionCodes).toContain('NAD-CSO');
    expect(divisionCodes).toContain('DIID');
    expect(divisionCodes).toContain('SDRD-NSSO');
  });

  it('TC_ADMIN_002: GET /api/admin/divisions includes regional circles with headcounts', async () => {
    const res = await request(app).get('/api/admin/divisions');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.regionalCircles)).toBe(true);
    expect(res.body.regionalCircles.length).toBe(5);

    const totalRegionalHeadcount = res.body.regionalCircles.reduce((sum: number, c: any) => sum + c.headcount, 0);
    expect(totalRegionalHeadcount).toBe(3220);
  });

  it('TC_ADMIN_003: GET /api/admin/acbp-dossier synthesizes official ACBP Dossier for CBC audit', async () => {
    const res = await request(app).get('/api/admin/acbp-dossier');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dossier).toBeDefined();
    expect(res.body.dossier.documentId).toMatch(/^ACBP-MoSPI-2026-\d{4}$/);
    expect(res.body.dossier.fiscalYear).toBe('2026-2027');
    expect(res.body.dossier.executiveSummary.totalStatisticalCadreTracked).toBe(3220);
    expect(res.body.dossier.divisionAllocations.length).toBe(5);
    expect(res.body.dossier.statutoryCompliance.dpdpa2023).toBeDefined();
  });
});
