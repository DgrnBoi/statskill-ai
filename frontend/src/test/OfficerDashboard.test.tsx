// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfficerDashboard } from '../components/dashboard/OfficerDashboard';

describe('OfficerDashboard Component', () => {
  const mockSkills = [
    { id: 'skill-1', skillName: 'Survey Design & Sampling', targetLevel: 4, category: 'Statistical Competencies', description: 'Sample design' },
    { id: 'skill-2', skillName: 'CAPI & Digital Field Enumeration', targetLevel: 4, category: 'Technical Competencies', description: 'CAPI tablets' },
    { id: 'skill-3', skillName: 'Data Privacy & DPDPA 2023', targetLevel: 3, category: 'Digital Governance', description: 'Data protection' },
    { id: 'skill-4', skillName: 'Public Ethics & Field Communication', targetLevel: 3, category: 'Behavioural and Managerial', description: 'Ethics' },
  ];

  const mockProficiency = {
    'skill-1': 4,
    'skill-2': 2,
    'skill-3': 3,
    'skill-4': 3,
  };

  const mockCadres = [
    'Junior Statistical Officer (JSO)',
    'Senior Statistical Officer (SSO)',
    'Assistant Director (ISS)',
    'Director [DIID] (ISS)',
  ];

  it('renders Officer Header with cadre designation and division', () => {
    render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator responsible for survey enumeration."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
        officerName="Eshaan Sunthankar"
        officerCadreId="JSO_1042"
      />
    );

    expect(screen.getByText(/Officer Competency & Diagnostic Hub/i)).toBeDefined();
    expect(screen.getAllByText(/Junior Statistical Officer \(JSO\)/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Field Operations Division \(FOD\), NSSO/i)).toBeDefined();
    expect(screen.getByText(/ID: JSO_1042/i)).toBeDefined();
  });

  it('renders Learning Progress Overview with stats and SVG spider radar chart', () => {
    const { container } = render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
      />
    );

    expect(screen.getByText(/Learning Progress Overview/i)).toBeDefined();
    expect(screen.getByText(/Avg Diagnostic Score/i)).toBeDefined();
    expect(screen.getByText(/84.8%/i)).toBeDefined();
    expect(screen.getByText(/88% of Annual ACBP Goal/i)).toBeDefined();

    // Verify SVG radar chart presence
    const svgRadar = container.querySelector('svg');
    expect(svgRadar).toBeDefined();
    expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0);
  });

  it('renders Capacity Cohorts and MoSPI working groups', () => {
    render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
      />
    );

    expect(screen.getByText(/Capacity Cohorts/i)).toBeDefined();
    expect(screen.getByText(/NSSO 79th Round Household Survey/i)).toBeDefined();
    expect(screen.getByText(/National Accounts SNA 2008 Working Group/i)).toBeDefined();
    expect(screen.getByText(/Explore All 12 MoSPI Cohorts/i)).toBeDefined();
  });

  it('renders Recent Diagnostic Assessments table and opens Misconception Diagnostic modal', () => {
    render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
      />
    );

    expect(screen.getByText(/Recent Diagnostic Assessments & Mistake Analysis/i)).toBeDefined();
    expect(screen.getByText(/Survey Design & Sampling Multipliers/i)).toBeDefined();
    expect(screen.getByText(/CAPI & Digital Field Enumeration/i)).toBeDefined();

    // Click "Inspect 2 Gaps" button for CAPI exam
    const inspectBtn = screen.getByRole('button', { name: /Inspect 2 Gaps/i });
    expect(inspectBtn).toBeDefined();

    fireEvent.click(inspectBtn);

    // Modal should open
    expect(screen.getByText(/Cognitive Misconception Analysis/i)).toBeDefined();
    expect(screen.getAllByText(/Selected Distractor:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Statutory Correct Answer:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Identified Conceptual Misconception:/i).length).toBeGreaterThan(0);

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close Inspector/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Cognitive Misconception Analysis/i)).toBeNull();
  });

  it('renders Division Benchmarks and triggers ACBP dossier creation', () => {
    const onOpenAcbp = vi.fn();
    render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
        onOpenAcbpModal={onOpenAcbp}
      />
    );

    expect(screen.getByText(/Division Benchmarks/i)).toBeDefined();
    expect(screen.getAllByText(/Field Operations Division/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Data Processing Division \(DPD\)/i)).toBeDefined();

    const generateBtn = screen.getByRole('button', { name: /Generate Officer ACBP Dossier/i });
    fireEvent.click(generateBtn);
    expect(onOpenAcbp).toHaveBeenCalled();
  });

  it('triggers onNavigateTab when Take Diagnostic Exam button is clicked', () => {
    const onNavigateTab = vi.fn();
    render(
      <OfficerDashboard
        currentCadre="Junior Statistical Officer (JSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Field Operations Division (FOD), NSSO"
        divisionDescription="Frontline statistical investigator."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={onNavigateTab}
      />
    );

    const takeExamBtn = screen.getByRole('button', { name: /Take Diagnostic Exam/i });
    fireEvent.click(takeExamBtn);
    expect(onNavigateTab).toHaveBeenCalledWith('dashboard');
  });

  it('renders custom dynamic assessmentHistory prop records and score badges', () => {
    const customHistory = [
      {
        id: 'dyn-01',
        title: 'Consumer Price Index (CPI) Seasonal Adjustment',
        category: 'Statistical Competencies',
        date: '05.09.2026',
        durationMinutes: 12,
        score: 95,
        totalScore: 100,
        status: 'passed' as const,
        misconceptions: [],
      },
      {
        id: 'dyn-02',
        title: 'Microdata Anonymization & Consent Scrutiny',
        category: 'Digital Governance',
        date: '05.09.2026',
        durationMinutes: 20,
        score: 60,
        totalScore: 100,
        status: 'remedial' as const,
        misconceptions: [
          {
            question: 'What is the required k-anonymity threshold for unit records?',
            chosenAnswer: 'k = 1',
            correctAnswer: 'k >= 5 with differential privacy noise.',
            misconception: 'Underestimating deanonymization risk.',
            remedialCourse: 'Unit-Level Microdata Privacy & Anonymization',
            remedialCourseId: 'priv-401',
          },
        ],
      },
    ];

    render(
      <OfficerDashboard
        currentCadre="Senior Statistical Officer (SSO)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Data Processing Division (DPD), NSSO"
        divisionDescription="Supervisory statistical officer."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
        assessmentHistory={customHistory}
      />
    );

    expect(screen.getByText(/Consumer Price Index \(CPI\) Seasonal Adjustment/i)).toBeDefined();
    expect(screen.getByText(/Microdata Anonymization & Consent Scrutiny/i)).toBeDefined();
    expect(screen.getByText(/95 \/ 100/i)).toBeDefined();
    expect(screen.getByText(/60 \/ 100/i)).toBeDefined();
    expect(screen.getByText(/Remedial Required/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Inspect 1 Gap/i })).toBeDefined();
  });

  it('renders custom dynamic capacityCohorts prop ranked by identified gaps', () => {
    const customCohorts = [
      {
        id: 'cohort-custom-1',
        name: 'High-Frequency Nowcasting Taskforce',
        division: 'DIID · Modernization',
        officersCount: 22,
        focusArea: 'Machine Learning & High-Performance Compute',
        badgeVariant: 'success' as const,
        imageGradient: 'from-emerald-700 to-teal-950',
      },
    ];

    render(
      <OfficerDashboard
        currentCadre="Director [DIID] (ISS)"
        onCadreChange={vi.fn()}
        cadresList={mockCadres}
        divisionName="Data Informatics & Innovation Division (DIID)"
        divisionDescription="Apex leadership officer."
        skills={mockSkills}
        proficiency={mockProficiency}
        onNavigateTab={vi.fn()}
        capacityCohorts={customCohorts}
      />
    );

    expect(screen.getByText(/High-Frequency Nowcasting Taskforce/i)).toBeDefined();
    expect(screen.getByText(/Machine Learning & High-Performance Compute/i)).toBeDefined();
    expect(screen.getByText('22')).toBeDefined();
  });
});

