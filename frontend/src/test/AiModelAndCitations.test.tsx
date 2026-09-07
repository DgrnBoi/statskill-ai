// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SourceCitationDrawer } from '../components/assessment/SourceCitationDrawer';
import { AiModelModal } from '../components/ui/AiModelModal';
import { AssessmentCertificateModal } from '../components/assessment/AssessmentCertificateModal';

describe('Phase 2 & 4: AI Model Gateway, Source Citations & Assessment Certificate', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders SourceCitationDrawer with verbatim grounded passage and copies text', async () => {
    const onCloseMock = vi.fn();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(
      <SourceCitationDrawer
        isOpen={true}
        onClose={onCloseMock}
        citation={{
          title: 'NSS 78th Round Instruction Manual',
          chapter: 'Chapter 1: Sampling Design',
          excerpt: 'The first stage units (FSU) are the census villages in the rural sector.',
          topic: 'Survey Sampling',
          misconception: 'Selected answer confused FSUs with SSUs in stratified multi-stage designs.',
          remedialSkill: 'Multi-Stage Sampling Hierarchies',
        }}
      />
    );

    expect(screen.getByText('Grounded Document Inspector')).toBeInTheDocument();
    expect(screen.getByText(/The first stage units \(FSU\) are the census villages/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 1: Sampling Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostic Misconception Analysis/i)).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /Copy Passage/i });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'The first stage units (FSU) are the census villages in the rural sector.'
    );
  });

  it('renders AiModelModal allowing switching between Gemini, Groq, and Sovereign Offline', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'offline_ready',
            mode: 'SOVEREIGN_ON_DEVICE',
            message: 'Sovereign On-Device Extractor active (Zero API key needed, 100% data residency).',
          }),
      })
    );

    render(<AiModelModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('AI Inference Engine & API Keys')).toBeInTheDocument();
    expect(screen.getByText(/Google Gemini 1.5 Flash/i)).toBeInTheDocument();
    expect(screen.getByText(/Groq LPU Inference/i)).toBeInTheDocument();
    expect(screen.getByText(/Sovereign On-Device Extractor/i)).toBeInTheDocument();

    // Select Sovereign mode
    const sovereignRadio = screen.getByDisplayValue('SOVEREIGN_OFFLINE');
    fireEvent.click(sovereignRadio);

    const testBtn = screen.getByRole('button', { name: /Save & Test Gateway/i });
    fireEvent.click(testBtn);

    await waitFor(() => {
      expect(screen.getByText(/Sovereign On-Device Extractor active/i)).toBeInTheDocument();
    });
  });

  it('renders AssessmentCertificateModal with official MoSPI emblem and print layout', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <AssessmentCertificateModal
        isOpen={true}
        onClose={vi.fn()}
        officerName="Shri Rajesh Kumar, ISS"
        cadre="Assistant Director (ISS)"
        division="National Accounts Division (NAD)"
        scorePercentage={90}
        paperSet="Set B"
        timeTakenSeconds={112}
        assessmentTopic="Macroeconomic Indicators & GVA"
      />
    );

    expect(screen.getByText('Competency Assessment Dossier')).toBeInTheDocument();
    expect(screen.getByText('Shri Rajesh Kumar, ISS')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('Set B')).toBeInTheDocument();
    expect(screen.getByText(/1m 52s/i)).toBeInTheDocument();

    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF/i });
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();
  });
});
