// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdminCommandCenter } from '../components/admin/AdminCommandCenter';
import Dashboard from '../pages/Dashboard';

const originalFetch = globalThis.fetch;
const division = (id: string, code: string, name: string, score: number) => ({
  id, code, name, readinessScore: score, totalOfficers: 100,
  mandate: `${name} capacity mandate`, headquarters: 'New Delhi',
  domainScores: { 'Statistical Competencies': score, 'Technical Competencies': score - 2, 'Digital Governance': score - 4, 'Behavioural & Managerial': score + 1 },
  criticalBottlenecks: [`${code} priority gap`],
  priorityCourses: [{ courseId: `${id}-course`, title: `${code} learning module`, provider: 'NSSTA', targetOfficers: 25, duration: '4 Hours' }],
});

const adminPayload = {
  success: true,
  ministry: 'Ministry of Statistics and Programme Implementation (MoSPI)',
  totalCadreStrength: 3220,
  systemReadinessScore: 78.4,
  acbpComplianceScore: 84.2,
  divisions: [
    division('fod', 'FOD-NSSO', 'Field Operations Division (FOD), NSSO', 76.2),
    division('dpd', 'DPD-NSSO', 'Data Processing Division (DPD), NSSO', 81.5),
    division('nad', 'NAD-CSO', 'National Accounts Division (NAD), CSO', 84),
    division('diid', 'DIID-MoSPI', 'Data Informatics & Innovation Division (DIID)', 82.8),
  ],
  regionalCircles: [
    { circle: 'Northern Circle', headcount: 820, readiness: 81.2 },
    { circle: 'North-Eastern Circle', headcount: 360, readiness: 71.4 },
  ],
};

const dossierPayload = {
  success: true,
  dossier: {
    documentId: 'ACBP-DEMO-2026', ministry: adminPayload.ministry, authority: 'Prototype capacity planning service', generatedAt: '2026-09-06T00:00:00.000Z', fiscalYear: '2026-2027',
    executiveSummary: { totalStatisticalCadreTracked: 3220, overallSystemReadiness: '78.4%', acbpFulfillmentRate: '84.2%', status: 'Prototype data loaded' },
    divisionAllocations: [{ divisionName: 'Field Operations Division (FOD), NSSO', officersCovered: 100, readinessLevel: '76.2%', identifiedGaps: ['Sampling'], recommendedInterventions: [{ courseId: 'c1', title: 'Sampling module', provider: 'NSSTA', targetOfficers: 25, duration: '4 Hours' }] }],
    regionalBreakdown: [{ circle: 'Northern Circle', headcount: 820, readiness: '81.2%' }],
    mandates: ['Complete role-aligned learning.'],
  },
};

describe('Pillar 5: Admin Command Center & ACBP Dossier', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/admin/divisions')) return Promise.resolve({ ok: true, json: () => Promise.resolve(adminPayload) } as Response);
      if (url.includes('/api/admin/acbp-dossier')) return Promise.resolve({ ok: true, json: () => Promise.resolve(dossierPayload) } as Response);
      return Promise.reject(new Error(`Unhandled test request: ${url}`));
    });
  });

  afterEach(() => { globalThis.fetch = originalFetch; });

  it('renders MoSPI Administrative macro metrics and division cards correctly', async () => {
    const onBackToLearner = vi.fn();

    render(<AdminCommandCenter onBackToLearner={onBackToLearner} />);

    // Verify macro KPI cards
    expect(await screen.findByText(/Total Cadre Strength/i)).toBeDefined();
    const cadreElements = await screen.findAllByText(/3,220/);
    expect(cadreElements.length).toBeGreaterThan(0);
    expect(await screen.findByText(/System Readiness/i)).toBeDefined();
    expect(await screen.findByText(/78.4%/)).toBeDefined();
    expect(await screen.findByText(/ACBP Compliance/i)).toBeDefined();
    expect(await screen.findByText(/84.2%/)).toBeDefined();
    expect(await screen.findByText(/Active Bottlenecks/i)).toBeDefined();

    // Verify division listings
    expect(await screen.findByRole('heading', { name: /^Field Operations Division \(FOD\), NSSO$/i })).toBeDefined();
    expect(await screen.findByRole('heading', { name: /^Data Processing Division \(DPD\), NSSO$/i })).toBeDefined();
    expect(await screen.findByRole('heading', { name: /^National Accounts Division \(NAD\), CSO$/i })).toBeDefined();
    expect(await screen.findByRole('heading', { name: /^Data Informatics & Innovation Division \(DIID\)$/i })).toBeDefined();

    // Verify regional circle breakdown
    expect(await screen.findByText(/Regional Circles Cadre Distribution/i)).toBeDefined();
    expect(await screen.findByText(/Northern Circle/i)).toBeDefined();
    expect(await screen.findByText(/North-Eastern Circle/i)).toBeDefined();

    // Test back button
    const backBtn = await screen.findByRole('button', { name: /Back to Officer Assessment View/i });
    fireEvent.click(backBtn);
    expect(onBackToLearner).toHaveBeenCalledTimes(1);
  });

  it('filters divisions when division filter pills are clicked', async () => {
    render(<AdminCommandCenter />);

    // Wait for data to load and click on NAD filter pill
    const nadBtn = await screen.findByRole('button', { name: /NAD-CSO/i });
    fireEvent.click(nadBtn);

    // NAD should be present, FOD should be hidden
    expect(screen.getByRole('heading', { name: /^National Accounts Division \(NAD\), CSO$/i })).toBeDefined();
    expect(screen.queryByRole('heading', { name: /^Field Operations Division \(FOD\), NSSO$/i })).toBeNull();

    // Click back on 'All MoSPI Divisions'
    const allBtn = screen.getByRole('button', { name: /All MoSPI Divisions/i });
    fireEvent.click(allBtn);

    expect(screen.getByRole('heading', { name: /^Field Operations Division \(FOD\), NSSO$/i })).toBeDefined();
    expect(screen.getByRole('heading', { name: /^National Accounts Division \(NAD\), CSO$/i })).toBeDefined();
  });

  it('opens and closes the CBC ACBP Dossier Modal with official allocations', async () => {
    render(<AdminCommandCenter />);

    // Open modal
    const generateBtn = await screen.findByRole('button', { name: /Generate CBC ACBP Dossier/i });
    fireEvent.click(generateBtn);

    // Verify modal elements
    expect(await screen.findByText(/MoSPI Annual Capacity Building Plan 2026-2027/i)).toBeDefined();
    expect(await screen.findByText(/Executive Competency Summary/i)).toBeDefined();
    expect(await screen.findByText(/Division-Wise Capacity Building Allocations/i)).toBeDefined();
    expect(await screen.findByText(/Print \/ Save PDF/i)).toBeDefined();
    expect(await screen.findByText(/Copy CBC JSON/i)).toBeDefined();

    // Close modal
    const closeBtn = await screen.findByRole('button', { name: /Close ACBP Dossier/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/MoSPI Annual Capacity Building Plan 2026-2027/i)).toBeNull();
    });
  });

  it('unlocks HQ Admin Command Center via Secret Gateway PIN authentication', async () => {
    vi.useFakeTimers();
    render(<Dashboard />);

    // Initial view should show Assessment Generator
    expect(screen.getByText(/Competency assessment generator/i)).toBeDefined();

    // Click secret HQ Gateway in footer
    const hqGatewayBtn = screen.getByRole('button', { name: /HQ Gateway/i });
    fireEvent.click(hqGatewayBtn);

    // Secret Gateway modal opens
    expect(screen.getByRole('dialog', { name: /Demo Admin Gateway/i })).toBeDefined();

    // Enter clearance passcode
    const pinInput = screen.getByLabelText(/Demo admin access key/i);
    const authBtn = screen.getByRole('button', { name: /Open admin preview/i });

    fireEvent.change(pinInput, { target: { value: 'MOSPI2026' } });
    fireEvent.click(authBtn);

    expect(screen.getByText(/Demo key accepted/i)).toBeDefined();

    // Advance timer for unlock transition inside act
    act(() => {
      vi.runAllTimers();
    });

    // Admin Command Center is now active
    expect(screen.getByText(/MoSPI Cadre Capacity & Officer Telemetry Control Center/i)).toBeDefined();
    vi.useRealTimers();
  });
});
