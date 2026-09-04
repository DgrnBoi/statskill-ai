import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { XApiTelemetryDrawer, XApiStatementPayload } from '../components/ui/XApiTelemetryDrawer';

describe('XApiTelemetryDrawer Component', () => {
  it('TC_FE_001: does not render anything when isOpen is false', () => {
    const { container } = render(
      <XApiTelemetryDrawer isOpen={false} onClose={() => {}} statement={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('TC_FE_002: renders LRS stream title, protocol standard, and LRS target when isOpen is true', () => {
    render(
      <XApiTelemetryDrawer isOpen={true} onClose={() => {}} statement={null} />
    );

    expect(screen.getByText(/xAPI \/ CMI-5 Statement Inspector/i)).toBeDefined();
    expect(screen.getByText(/ADL xAPI v1.0.3 \(CMI-5\)/i)).toBeDefined();
    expect(screen.getByText(/igotkarmayogi.gov.in\/lrs\/v1\/statements/i)).toBeDefined();
    expect(screen.getByText(/Statement Breakdown/i)).toBeDefined();
  });

  it('TC_FE_003: triggers onClose callback when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <XApiTelemetryDrawer isOpen={true} onClose={handleClose} statement={null} />
    );

    const closeBtn = screen.getByRole('button', { name: /Close Inspector/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('TC_FE_004: accurately renders custom statement payload', () => {
    const customStatement: XApiStatementPayload = {
      actor: {
        name: 'Senior Investigator Sharma',
        account: {
          homePage: 'https://igotkarmayogi.gov.in',
          name: 'SSO_9981',
        },
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/completed',
        display: {
          'en-US': 'completed',
        },
      },
      object: {
        id: 'https://statskill.mospi.gov.in/assessments/cpi-index-02',
        definition: {
          name: {
            'en-US': 'Consumer Price Index Methodology Assessment',
          },
          type: 'http://adlnet.gov/expapi/activities/assessment',
        },
      },
      result: {
        score: {
          scaled: 0.95,
          raw: 95,
          min: 0,
          max: 100,
        },
        success: true,
      },
      timestamp: '2026-09-04T12:00:00.000Z',
    };

    render(
      <XApiTelemetryDrawer isOpen={true} onClose={() => {}} statement={customStatement} />
    );

    expect(screen.getAllByText(/Senior Investigator Sharma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/95%/i).length).toBeGreaterThan(0);
  });
});
