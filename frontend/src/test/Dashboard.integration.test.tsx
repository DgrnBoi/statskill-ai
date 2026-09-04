import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

vi.mock('../utils/detectPerformance', () => ({
  assessDeviceCapability: vi.fn().mockResolvedValue('POTATO_DEVICE'),
}));

// Mock scrollIntoView which is absent in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.alert = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

const mockQuestions = [
  {
    id: 'eval-1',
    topic: 'Official Survey Design & Multi-Stage Sampling',
    question: 'What is the primary sampling unit (PSU) typically used in rural NSSO socio-economic surveys?',
    options: [
      'Census Village',
      'Gram Panchayat',
      'District Subdivision',
      'Individual Household',
    ],
    correctAnswer: 'Census Village',
    sourceCitation: 'NSSO Survey Design Manual Vol. 78',
    explanation: 'In rural areas, the 2011 Census village serves as the First Stage Unit (FSU) or Primary Sampling Unit (PSU).',
  },
  {
    id: 'eval-2',
    topic: 'Digital Governance & Data Privacy',
    question: 'Under the Digital Personal Data Protection Act (DPDPA) 2023, MoSPI acts primarily in which role?',
    options: [
      'Data Processor Only',
      'Data Fiduciary',
      'Data Principal',
      'Consent Manager Only',
    ],
    correctAnswer: 'Data Fiduciary',
    sourceCitation: 'DPDPA 2023 Section 2(i)',
    explanation: 'Any government ministry determining the purpose and means of personal data processing is classified as a Data Fiduciary.',
  },
];

const mockCourses = [
  {
    title: 'Sampling Techniques in Official Statistics',
    domain: 'Statistical Competencies',
    duration: '6 Hours',
    targetLevel: 3,
    description: 'Comprehensive guide to multistage stratified sampling in NSSO surveys.',
  },
  {
    title: 'Python for Microdata Processing',
    domain: 'Technical Competencies',
    duration: '8 Hours',
    targetLevel: 4,
    description: 'Automated data validation and cleaning pipelines for large-scale survey datasets.',
  },
  {
    title: 'DPDPA 2023 Compliance for Statistical Officers',
    domain: 'Digital Governance',
    duration: '4 Hours',
    targetLevel: 2,
    description: 'Understanding digital personal data protection protocols and consent frameworks.',
  },
  {
    title: 'Strategic Communication & Field Leadership',
    domain: 'Behavioural and Managerial Competencies',
    duration: '5 Hours',
    targetLevel: 3,
    description: 'Interpersonal protocols and non-response mitigation for field investigators.',
  },
];

const mockTelemetryStatement = {
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
    id: 'https://statskill.mospi.gov.in/assessments/sampling-theory-01',
    definition: {
      name: {
        'en-US': 'Survey Design Evaluation',
      },
      type: 'http://adlnet.gov/expapi/activities/assessment',
    },
  },
  result: {
    score: {
      scaled: 1.0,
      raw: 100,
      min: 0,
      max: 100,
    },
    success: true,
  },
  timestamp: '2026-09-04T12:00:00.000Z',
};

const createMockFetch = () => {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.includes('/api/courses/search')) {
      const parsedUrl = new URL(url);
      const q = (parsedUrl.searchParams.get('q') || '').toLowerCase();
      const domain = parsedUrl.searchParams.get('domain');

      let filtered = [...mockCourses];
      if (domain && domain !== 'All') {
        filtered = filtered.filter((c) => c.domain === domain);
      }
      if (q) {
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, courses: filtered }),
      } as Response);
    }

    if (url.includes('/api/quiz/generate-async')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, jobId: 'mock-job-101' }),
      } as Response);
    }

    if (url.includes('/api/quiz/status/mock-job-101')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'complete',
            result: {
              setLetter: 'A',
              questions: mockQuestions,
            },
          }),
      } as Response);
    }

    if (url.includes('/api/telemetry/quiz')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            statement: mockTelemetryStatement,
          }),
      } as Response);
    }

    if (url.includes('/api/recommend/course')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            recommendation: {
              title: 'Remedial Sampling Course',
              provider: 'NSSTA',
              duration: '3 Hours',
              link: 'https://igotkarmayogi.gov.in',
            },
          }),
      } as Response);
    }

    return Promise.reject(new Error(`Unhandled fetch endpoint: ${url}`));
  });
};

describe('StatSkill AI - Dashboard Integration Test Suite', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = createMockFetch();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  // Helper function to generate quiz via question bank
  const triggerAssessmentPaper = async () => {
    const practiceBtn = screen.getByRole('button', {
      name: /Practice from Verified Question Bank/i,
    });
    fireEvent.click(practiceBtn);
    // Advance timers for the 1500ms polling interval in Dashboard.tsx
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
  };

  it('TC_INT_001: Navigation tab switching toggles between all 4 views', async () => {
    render(<Dashboard />);

    // 1. Initial view: Assessment Engine
    expect(
      screen.getByText(/Sovereign Edge-AI Assessment Generator/i)
    ).toBeDefined();

    // 2. Switch to Discover tab
    const discoverTabBtn = screen.getByRole('button', {
      name: /Discover \(880\+ Catalog\)/i,
    });
    fireEvent.click(discoverTabBtn);
    expect(
      await screen.findByText(/Government of India Course Discovery/i)
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText(/Search 880\+ official courses/i)
    ).toBeDefined();

    // 3. Switch to Competency Profile tab
    const competencyTabBtn = screen.getByRole('button', {
      name: /FRAC Competency Profile/i,
    });
    fireEvent.click(competencyTabBtn);
    expect(
      screen.getByText(/Officer Competency Profile/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Assigned Division: Field Operations Division \(FOD\), NSSO/i)
    ).toBeDefined();

    // 4. Switch to Analytics tab
    const analyticsTabBtn = screen.getByRole('button', {
      name: /MoSPI Analytics/i,
    });
    fireEvent.click(analyticsTabBtn);
    expect(
      screen.getByText(/MoSPI Division Competency Analytics/i)
    ).toBeDefined();
    expect(screen.getByText(/Assessments Logged/i)).toBeDefined();

    // Return to Assessment Engine tab
    const assessmentTabBtn = screen.getByRole('button', {
      name: /Assessment Engine/i,
    });
    fireEvent.click(assessmentTabBtn);
    expect(
      screen.getByText(/Sovereign Edge-AI Assessment Generator/i)
    ).toBeDefined();
  });

  it('TC_INT_002: Cadre designation switcher updates division name and competency benchmark levels', async () => {
    render(<Dashboard />);
    await act(async () => {
      await Promise.resolve();
    });

    // Navigate to Competency tab
    const competencyTabBtn = screen.getByRole('button', {
      name: /FRAC Competency Profile/i,
    });
    fireEvent.click(competencyTabBtn);

    // Initial Cadre: Junior Statistical Officer (JSO)
    expect(
      screen.getByText(/Assigned Division: Field Operations Division \(FOD\), NSSO/i)
    ).toBeDefined();
    expect(screen.getByText('Survey Design & Sampling')).toBeDefined();
    expect(screen.getAllByText('Benchmark: Level 3').length).toBe(2);

    // Switch to Senior Statistical Officer (SSO)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, {
      target: { value: 'Senior Statistical Officer (SSO)' },
    });

    expect(
      screen.getByText(/Assigned Division: Data Processing Division \(DPD\), NSSO/i)
    ).toBeDefined();
    expect(screen.getByText('Survey Design & Sampling Weights')).toBeDefined();
    expect(screen.getByText('Statistical Data Analytics (R & Python)')).toBeDefined();
    expect(screen.getAllByText('Benchmark: Level 4').length).toBeGreaterThan(0);

    // Switch to Assistant Director (ISS)
    fireEvent.change(select, {
      target: { value: 'Assistant Director (ISS)' },
    });
    expect(
      screen.getByText(/Assigned Division: National Accounts Division \(NAD\)/i)
    ).toBeDefined();
    expect(screen.getByText('National Accounts & Macro Indices')).toBeDefined();
  });

  it('TC_INT_003: Offline Question Bank assessment triggers and renders questions', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });

    render(<Dashboard />);

    const practiceBtn = screen.getByRole('button', {
      name: /Practice from Verified Question Bank/i,
    });
    fireEvent.click(practiceBtn);

    // Polling triggers after 1500ms
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByText('Official Assessment Paper')).toBeDefined();
    expect(screen.getByText('Paper: Set A')).toBeDefined();
    expect(
      screen.getByText(
        'What is the primary sampling unit (PSU) typically used in rural NSSO socio-economic surveys?'
      )
    ).toBeDefined();
    expect(screen.getByText('Census Village')).toBeDefined();
    expect(screen.getByText('Reshuffle (3 left)')).toBeDefined();

    vi.useRealTimers();
  });

  it('TC_INT_004: Reshuffle button cycles paper sets from Set A -> Set B -> Set C -> Set D', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });

    render(<Dashboard />);
    await triggerAssessmentPaper();

    expect(screen.getByText('Paper: Set A')).toBeDefined();

    // 1st Reshuffle: Set A -> Set B
    const reshuffleBtn = screen.getByRole('button', { name: /Reshuffle/i });
    fireEvent.click(reshuffleBtn);
    expect(screen.getByText('Paper: Set B')).toBeDefined();
    expect(screen.getByText('Reshuffle (2 left)')).toBeDefined();

    // 2nd Reshuffle: Set B -> Set C
    fireEvent.click(reshuffleBtn);
    expect(screen.getByText('Paper: Set C')).toBeDefined();
    expect(screen.getByText('Reshuffle (1 left)')).toBeDefined();

    // 3rd Reshuffle: Set C -> Set D
    fireEvent.click(reshuffleBtn);
    expect(screen.getByText('Paper: Set D')).toBeDefined();
    expect(screen.getByText('Reshuffle (0 left)')).toBeDefined();

    vi.useRealTimers();
  });

  it('TC_INT_005: Reshuffle button is disabled after 3 attempts with rate limit title', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });

    render(<Dashboard />);
    await triggerAssessmentPaper();

    const reshuffleBtn = screen.getByRole('button', { name: /Reshuffle/i });
    // Exhaust 3 reshuffles
    fireEvent.click(reshuffleBtn);
    fireEvent.click(reshuffleBtn);
    fireEvent.click(reshuffleBtn);

    // Verify rate limit enforcement
    expect(screen.getByText('Reshuffle (0 left)')).toBeDefined();
    expect((reshuffleBtn as HTMLButtonElement).disabled).toBe(true);
    expect(reshuffleBtn.hasAttribute('disabled')).toBe(true);
    expect(reshuffleBtn.getAttribute('title')).toBe(
      'Maximum 3 reshuffles allowed per session'
    );

    // Further clicks should not alter the set
    fireEvent.click(reshuffleBtn);
    expect(screen.getByText('Paper: Set D')).toBeDefined();
    expect(screen.getByText('Reshuffle (0 left)')).toBeDefined();

    vi.useRealTimers();
  });

  it('TC_INT_006: Answering an assessment question triggers feedback and updates proficiency', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });

    render(<Dashboard />);
    await triggerAssessmentPaper();

    // Find and select the correct option "Census Village"
    const correctOptionBtn = screen.getByRole('button', {
      name: /Census Village/i,
    });
    await act(async () => {
      fireEvent.click(correctOptionBtn);
      await Promise.resolve();
    });

    // Verify immediate affirmative feedback appears
    expect(
      screen.getByText(
        /Correct! Your FRAC competency level in this domain has been updated\./i
      )
    ).toBeDefined();

    // Verify citation from MoSPI standard
    expect(
      screen.getByText(/NSSO Survey Design Manual Vol\. 78/i)
    ).toBeDefined();

    // Switch to MoSPI Analytics tab and verify an assessment was captured
    const analyticsTabBtn = screen.getByRole('button', {
      name: /MoSPI Analytics/i,
    });
    fireEvent.click(analyticsTabBtn);

    // Assessments Logged count should now be 1
    const assessmentCountElem = screen.getByText('1');
    expect(assessmentCountElem).toBeDefined();

    vi.useRealTimers();
  });

  it('TC_INT_007: Telemetry drawer trigger button opens the slide-out inspector', async () => {
    render(<Dashboard />);
    await act(async () => {
      await Promise.resolve();
    });

    // Inspector starts closed
    expect(
      screen.queryByText(/xAPI \/ CMI-5 Statement Inspector/i)
    ).toBeNull();

    // Click telemetry launcher button in header
    const telemetryBtn = screen.getByRole('button', {
      name: /iGOT LRS Telemetry/i,
    });
    fireEvent.click(telemetryBtn);

    // Verify inspector drawer is open with core connection metadata
    expect(
      screen.getByText(/xAPI \/ CMI-5 Statement Inspector/i)
    ).toBeDefined();
    expect(
      screen.getByText(/igotkarmayogi\.gov\.in\/lrs\/v1\/statements/i)
    ).toBeDefined();
    expect(
      screen.getByText(/ADL xAPI v1\.0\.3 \(CMI-5\)/i)
    ).toBeDefined();
  });

  it('TC_INT_008: Telemetry drawer displays live actor, verb, and score data, and closes via close button and backdrop click', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });

    render(<Dashboard />);
    await triggerAssessmentPaper();

    // Answer question to dispatch live telemetry statement
    const correctOptionBtn = screen.getByRole('button', {
      name: /Census Village/i,
    });
    await act(async () => {
      fireEvent.click(correctOptionBtn);
      await vi.advanceTimersByTimeAsync(100);
    });

    // Open telemetry drawer
    const telemetryBtn = screen.getByRole('button', {
      name: /iGOT LRS Telemetry/i,
    });
    fireEvent.click(telemetryBtn);

    // 1. Verify telemetry statement displays custom actor, verb, and score
    expect(screen.getAllByText(/Senior Investigator Sharma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/100%/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Statement Breakdown/i)).toBeDefined();

    // 2. Verify closing via "Close Inspector" button
    const closeBtn = screen.getByRole('button', {
      name: /Close Inspector/i,
    });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText(/xAPI \/ CMI-5 Statement Inspector/i)
    ).toBeNull();

    // 3. Re-open and verify closing via backdrop click
    fireEvent.click(telemetryBtn);
    expect(
      screen.getByText(/xAPI \/ CMI-5 Statement Inspector/i)
    ).toBeDefined();

    // Backdrop has fixed inset-0 and bg-slate-900/60
    const backdrop = document.querySelector('.bg-slate-900\\/60');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);

    expect(
      screen.queryByText(/xAPI \/ CMI-5 Statement Inspector/i)
    ).toBeNull();

    vi.useRealTimers();
  });

  it('TC_INT_009: Course discovery search bar updates query and filters course catalog', async () => {
    render(<Dashboard />);

    // Navigate to Discover tab
    const discoverTabBtn = screen.getByRole('button', {
      name: /Discover \(880\+ Catalog\)/i,
    });
    fireEvent.click(discoverTabBtn);

    // Verify initial course list loads
    expect(
      await screen.findByText('Sampling Techniques in Official Statistics')
    ).toBeDefined();
    expect(screen.getByText('Python for Microdata Processing')).toBeDefined();

    // Search for "Python"
    const searchInput = screen.getByPlaceholderText(
      /Search 880\+ official courses/i
    );
    fireEvent.change(searchInput, { target: { value: 'Python' } });

    // Expect search input value updated
    expect((searchInput as HTMLInputElement).value).toBe('Python');

    // Only Python course should remain visible
    await waitFor(() => {
      expect(screen.getByText('Python for Microdata Processing')).toBeDefined();
      expect(
        screen.queryByText('Sampling Techniques in Official Statistics')
      ).toBeNull();
    });
  });

  it('TC_INT_010: Domain category filter pills filter course cards by domain', async () => {
    render(<Dashboard />);

    // Navigate to Discover tab
    const discoverTabBtn = screen.getByRole('button', {
      name: /Discover \(880\+ Catalog\)/i,
    });
    fireEvent.click(discoverTabBtn);

    // Wait for courses to be loaded
    expect(
      await screen.findByText('Sampling Techniques in Official Statistics')
    ).toBeDefined();

    // Click "Digital Governance" filter pill
    const digitalGovPill = screen.getByRole('button', {
      name: 'Digital Governance',
    });
    fireEvent.click(digitalGovPill);

    // Verify filter is active and course is filtered
    await waitFor(() => {
      expect(
        screen.getByText('DPDPA 2023 Compliance for Statistical Officers')
      ).toBeDefined();
      expect(
        screen.queryByText('Sampling Techniques in Official Statistics')
      ).toBeNull();
      expect(
        screen.queryByText('Python for Microdata Processing')
      ).toBeNull();
    });
  });
});
