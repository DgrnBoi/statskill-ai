import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

vi.mock('../utils/detectPerformance', () => ({
  assessDeviceCapability: vi.fn().mockResolvedValue('POTATO_DEVICE'),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.alert = vi.fn();

const mockQuestions = [
  {
    id: 'eval-1',
    topic: 'Survey Design & Sampling',
    question: 'In a multi-stage stratified survey design adopted by NSSO, what does FSU represent?',
    options: [
      'First Stage Unit',
      'Final Sampling Unit',
      'Fundamental Survey Unit',
      'Field Supervisor Unit',
    ],
    correctAnswer: 'First Stage Unit',
    sourceCitation: 'NSSO Survey Design Manual Vol. 78',
    explanation: 'First Stage Units (FSUs) are the primary sampling units selected in the first stage of sampling.',
  },
];

describe('StatSkill AI - 5 MoSPI Officers Multi-Persona Dashboard Verification Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/courses/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, courses: [] }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      });
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('Person 1 [FOD]: Rajesh Sharma (JSO) renders FOD cadre and identity', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'jso',
          name: 'Rajesh Sharma',
          designation: 'Junior Statistical Officer (JSO)',
          division: 'Field Operations Division (FOD), NSSO',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_1042_NSSO',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Rajesh Sharma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Field Operations Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Junior Statistical Officer/i).length).toBeGreaterThan(0);
  });

  it('Person 2 [DPD]: Ananya Mehta (SSO) displays DPD division and cadre identity', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'sso',
          name: 'Ananya Mehta',
          designation: 'Senior Statistical Officer (SSO)',
          division: 'Data Processing Division (DPD), NSSO',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_2088_NSSO',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Ananya Mehta/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Processing Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Senior Statistical Officer/i).length).toBeGreaterThan(0);
  });



  it('renders assessed competency progress when officer completes diagnostic history', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'jso',
          name: 'Rajesh Sharma',
          designation: 'Junior Statistical Officer (JSO)',
          division: 'Field Operations Division (FOD), NSSO',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_1042_NSSO',
        },
      })
    );

    window.localStorage.setItem(
      'statskill_officer_progress_v1',
      JSON.stringify({
        'Junior Statistical Officer (JSO)': {
          assessmentsTaken: 1,
          proficiency: {
            'Survey Design & Sampling': 4,
            'CAPI & Digital Field Enumeration': 3,
            'Field Inspection & Quality Scrutiny': 3,
            'Statistical Standards & Classification': 3,
          },
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Rajesh Sharma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Field Operations Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Survey Design & Sampling').length).toBeGreaterThan(0);
  });
});
