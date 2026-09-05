// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminCommandCenter } from '../components/admin/AdminCommandCenter';
import Dashboard from '../pages/Dashboard';

describe('Pillar 5: Admin Command Center & ACBP Dossier', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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
    expect(await screen.findByText(/Field Operations Division \(FOD\), NSSO/i)).toBeDefined();
    expect(await screen.findByText(/Data Processing Division \(DPD\), NSSO/i)).toBeDefined();
    expect(await screen.findByText(/National Accounts Division \(NAD\), CSO/i)).toBeDefined();
    expect(await screen.findByText(/Data Informatics & Innovation Division \(DIID\)/i)).toBeDefined();

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
    expect(screen.getByText(/National Accounts Division \(NAD\), CSO/i)).toBeDefined();
    expect(screen.queryByText(/Field Operations Division \(FOD\), NSSO/i)).toBeNull();

    // Click back on 'All MoSPI Divisions'
    const allBtn = screen.getByRole('button', { name: /All MoSPI Divisions/i });
    fireEvent.click(allBtn);

    expect(screen.getByText(/Field Operations Division \(FOD\), NSSO/i)).toBeDefined();
    expect(screen.getByText(/National Accounts Division \(NAD\), CSO/i)).toBeDefined();
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
    expect(screen.getByText(/Sovereign Edge-AI Assessment Generator/i)).toBeDefined();

    // Click secret HQ Gateway in footer
    const hqGatewayBtn = screen.getByRole('button', { name: /HQ Gateway/i });
    fireEvent.click(hqGatewayBtn);

    // Secret Gateway modal opens
    expect(screen.getByRole('dialog', { name: /MoSPI Sovereign Gateway/i })).toBeDefined();

    // Enter clearance passcode
    const pinInput = screen.getByLabelText(/Ministerial Clearance Passcode/i);
    const authBtn = screen.getByRole('button', { name: /Authenticate Clearance/i });

    fireEvent.change(pinInput, { target: { value: 'MOSPI2026' } });
    fireEvent.click(authBtn);

    expect(screen.getByText(/Ministerial Clearance Verified/i)).toBeDefined();

    // Advance timer for unlock transition inside act
    act(() => {
      vi.runAllTimers();
    });

    // Admin Command Center is now active
    expect(screen.getByText(/MoSPI Cadre Capacity & Readiness Command Center/i)).toBeDefined();
    vi.useRealTimers();
  });
});
