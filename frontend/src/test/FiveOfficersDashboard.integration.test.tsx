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

  it('Person 1 [FOD]: Eshaan Sunthankar (JSO) renders FOD cadre and identity', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'jso',
          name: 'Eshaan Sunthankar',
          designation: 'Junior Statistical Officer (JSO)',
          division: 'Field Operations Division (FOD), NSSO',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_1042_NSSO',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Eshaan Sunthankar/i).length).toBeGreaterThan(0);
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

  it('Person 3 [NAD]: Rohan Iyer (Assistant Director) displays National Accounts & Macroeconomics track', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'assistant-director',
          name: 'Rohan Iyer',
          designation: 'Assistant Director (ISS)',
          division: 'National Accounts Division (NAD)',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_3612_ISS',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Rohan Iyer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/National Accounts Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Assistant Director/i).length).toBeGreaterThan(0);
  });

  it('Person 4 [DIID]: Kavita Rao (Director) displays Data Informatics & AI Architecture track', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'director',
          name: 'Kavita Rao',
          designation: 'Director [DIID] (ISS)',
          division: 'Data Informatics & Innovation Division (DIID)',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_4820_ISS',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Kavita Rao/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Informatics & Innovation Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Director/i).length).toBeGreaterThan(0);
  });

  it('Person 5 [SDRD]: Dr. Rajeshwari Nair (Joint Director) displays Survey Design & Research Division track', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'joint-director',
          name: 'Dr. Rajeshwari Nair',
          designation: 'Joint Director [SDRD] (ISS)',
          division: 'Survey Design & Research Division (SDRD), NSSO',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_5914_ISS',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Dr. Rajeshwari Nair/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Survey Design & Research Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Joint Director/i).length).toBeGreaterThan(0);
  });

  it('renders assessed competency progress when officer completes diagnostic history', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        officer: {
          id: 'joint-director',
          name: 'Dr. Rajeshwari Nair',
          designation: 'Joint Director [SDRD] (ISS)',
          division: 'Survey Design & Research Division (SDRD), NSSO',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_5914_ISS',
        },
      })
    );

    window.localStorage.setItem(
      'statskill_officer_progress_v1',
      JSON.stringify({
        'Joint Director [SDRD] (ISS)': {
          assessmentsTaken: 1,
          proficiency: {
            'Survey Design & Sampling Theory': 5,
            'Questionnaire & Instrument Design': 4,
            'Non-Sampling Error & Variance Estimation': 5,
            'Methodological Research & Policy Direction': 5,
          },
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Dr. Rajeshwari Nair/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Survey Design & Research Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Survey Design & Sampling Theory').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Questionnaire & Instrument Design').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Non-Sampling Error & Variance Estimation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Methodological Research & Policy Direction').length).toBeGreaterThan(0);
  });
});
