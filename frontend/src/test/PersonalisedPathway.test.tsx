// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonalisedPathway } from '../components/recommendation/PersonalisedPathway';

describe('Pillar 2: Personalised 4-Tier Learning Pathway Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all 4 ZPD progressive tiers and milestone headers', async () => {
    // Mock the backend pathway endpoint
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        pathway: {
          cadre: 'Junior Statistical Officer (JSO)',
          division: 'Field Operations Division (FOD), NSSO',
          overallReadiness: 78,
          totalEstimatedHours: 18,
          identifiedGaps: [
            { skillName: 'Survey Design & Sampling', category: 'Statistical Competencies', currentLevel: 2, targetLevel: 3, gap: 1 },
          ],
          tiers: [
            {
              tierNumber: 1,
              tierName: 'Tier 1: Foundation & Prerequisite',
              targetLevel: 'Level 1–2 (Baseline Remediation)',
              description: 'Core statistical principles and ethics.',
              courses: [
                {
                  id: 'c-1',
                  title: 'Foundations of Statistical Sampling',
                  provider: 'MoSPI Training Unit',
                  duration: '4 Hours',
                  durationHours: 4,
                  domain: 'Statistical Competencies',
                  level: 2,
                  link: 'https://igotkarmayogi.gov.in/app/toc/c-1/overview',
                  tier: 1,
                  tierName: 'Tier 1',
                  rationale: 'Assigned as foundational prerequisite to solidify baseline principles.',
                },
              ],
            },
            {
              tierNumber: 2,
              tierName: 'Tier 2: Operational Reinforcement',
              targetLevel: 'Level 3 (Working Proficiency)',
              description: 'Field data scrubbing and CAPI protocols.',
              courses: [
                {
                  id: 'c-2',
                  title: 'CAPI Field Enumeration Standards',
                  provider: 'NSSTA',
                  duration: '3 Hours',
                  durationHours: 3,
                  domain: 'Technical Competencies',
                  level: 3,
                  link: 'https://igotkarmayogi.gov.in/app/toc/c-2/overview',
                  tier: 2,
                  tierName: 'Tier 2',
                  rationale: 'Targeted operational reinforcement to bridge practical deficits.',
                },
              ],
            },
            {
              tierNumber: 3,
              tierName: 'Tier 3: Core Cadre Benchmark',
              targetLevel: 'Level 4 (Cadre Standard)',
              description: 'Official curriculum for JSO cadre accreditation.',
              courses: [
                {
                  id: 'c-3',
                  title: 'Official Statistics Verification Protocols',
                  provider: 'MoSPI Training Unit',
                  duration: '5 Hours',
                  durationHours: 5,
                  domain: 'Statistical Competencies',
                  level: 4,
                  link: 'https://igotkarmayogi.gov.in/app/toc/c-3/overview',
                  tier: 3,
                  tierName: 'Tier 3',
                  rationale: 'Mandated curriculum to achieve Cadre Benchmark level.',
                },
              ],
            },
            {
              tierNumber: 4,
              tierName: 'Tier 4: Strategic Leadership & Policy',
              targetLevel: 'Level 5 (Advanced Leadership)',
              description: 'AI/ML nowcasting and sovereign data protection.',
              courses: [
                {
                  id: 'c-4',
                  title: 'AI/ML Integration in Statistical Systems',
                  provider: 'DIID',
                  duration: '6 Hours',
                  durationHours: 6,
                  domain: 'Technical Competencies',
                  level: 5,
                  link: 'https://igotkarmayogi.gov.in/app/toc/c-4/overview',
                  tier: 4,
                  tierName: 'Tier 4',
                  rationale: 'Strategic leadership extension module.',
                },
              ],
            },
          ],
          milestones: [
            { id: 'ms-1', title: 'Milestone 1: Baseline Remediation', timeline: 'Weeks 1–3', description: 'Complete Tier 1 foundations', targetCompetency: 'Foundations' },
            { id: 'ms-2', title: 'Milestone 2: Operational Mastery', timeline: 'Weeks 4–8', description: 'Complete Tier 2 & 3 modules', targetCompetency: 'Survey Execution' },
            { id: 'ms-3', title: 'Milestone 3: Apex Accreditation', timeline: 'Weeks 9–12', description: 'Pass post-training evaluation', targetCompetency: 'Policy Formulation' },
          ],
        },
      }),
    });

    render(
      <PersonalisedPathway
        designation="Junior Statistical Officer (JSO)"
        proficiencies={{ 'Survey Design & Sampling': 2 }}
        assessmentsTaken={1}
      />
    );

    // Wait for the pathway to load
    await waitFor(() => {
      expect(screen.getByText(/4-Tier Prescriptive Learning Roadmap/i)).toBeDefined();
    });

    // Check Metrics KPIs
    expect(screen.getByText('78%')).toBeDefined();
    expect(screen.getByText('18h')).toBeDefined();

    // Check all 4 Tiers rendered
    expect(screen.getByText(/Tier 1: Foundation & Prerequisite/i)).toBeDefined();
    expect(screen.getByText(/Tier 2: Operational Reinforcement/i)).toBeDefined();
    expect(screen.getByText(/Tier 3: Core Cadre Benchmark/i)).toBeDefined();
    expect(screen.getByText(/Tier 4: Strategic Leadership & Policy/i)).toBeDefined();

    // Check Milestones
    expect(screen.getByText(/Milestone 1: Baseline Remediation/i)).toBeDefined();
    expect(screen.getByText(/Milestone 2: Operational Mastery/i)).toBeDefined();
    expect(screen.getByText(/Milestone 3: Apex Accreditation/i)).toBeDefined();

    // Check Courses and Enrollment Buttons
    expect(screen.getByText('Foundations of Statistical Sampling')).toBeDefined();
    expect(screen.getByText('CAPI Field Enumeration Standards')).toBeDefined();
    expect(screen.getByText('Official Statistics Verification Protocols')).toBeDefined();
    expect(screen.getByText('AI/ML Integration in Statistical Systems')).toBeDefined();

    const enrollButtons = screen.getAllByText(/Enroll on iGOT/i);
    expect(enrollButtons.length).toBe(4);
  });

  it('renders fallback curriculum gracefully if backend network fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <PersonalisedPathway
        designation="Senior Statistical Officer (SSO)"
        proficiencies={{}}
        assessmentsTaken={1}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/4-Tier Prescriptive Learning Roadmap/i)).toBeDefined();
    });

    // Verify fallback tiers are present
    expect(screen.getByText(/Tier 1: Foundation & Prerequisite/i)).toBeDefined();
    expect(screen.getByText(/Tier 2: Operational Reinforcement/i)).toBeDefined();
  });

  it('renders empty state card when assessmentsTaken is 0', () => {
    const handleNavigateTab = vi.fn();
    render(
      <PersonalisedPathway
        designation="Junior Statistical Officer (JSO)"
        proficiencies={{}}
        assessmentsTaken={0}
        onNavigateTab={handleNavigateTab}
      />
    );

    expect(screen.getByText('No Diagnostic Baseline Established')).toBeDefined();
    expect(screen.getByText(/Complete your initial diagnostic assessment/i)).toBeDefined();
    const startButton = screen.getByText('Start First Assessment');
    expect(startButton).toBeDefined();

    startButton.click();
    expect(handleNavigateTab).toHaveBeenCalledWith('dashboard');
  });
});
