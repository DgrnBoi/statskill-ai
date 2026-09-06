// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OfficerDashboard, RecentExamRecord } from '../components/dashboard/OfficerDashboard';

const skills = [
  { id: 'skill-1', skillName: 'Survey Design & Sampling', targetLevel: 4, category: 'Statistical Competencies' },
  { id: 'skill-2', skillName: 'CAPI & Digital Field Enumeration', targetLevel: 4, category: 'Technical Competencies' },
  { id: 'skill-3', skillName: 'Data Privacy & DPDPA 2023', targetLevel: 3, category: 'Digital Governance' },
  { id: 'skill-4', skillName: 'Public Ethics & Field Communication', targetLevel: 3, category: 'Behavioural and Managerial' },
];

const proficiency = {
  'Survey Design & Sampling': 4,
  'CAPI & Digital Field Enumeration': 2,
  'Data Privacy & DPDPA 2023': 3,
  'Public Ethics & Field Communication': 3,
};

const baseProps = {
  currentCadre: 'Junior Statistical Officer (JSO)',
  onCadreChange: vi.fn(),
  cadresList: ['Junior Statistical Officer (JSO)', 'Senior Statistical Officer (SSO)'],
  divisionName: 'Field Operations Division (FOD), NSSO',
  divisionDescription: 'Frontline statistical investigator responsible for survey enumeration.',
  skills,
  proficiency,
  onNavigateTab: vi.fn(),
  officerName: 'Eshaan Sunthankar',
  officerCadreId: 'JSO_1042',
};

const history: RecentExamRecord[] = [
  { id: 'a1', title: 'Sampling diagnostic', category: 'Statistical Competencies', date: '05.09.2026', durationMinutes: 12, score: 4, totalScore: 5, status: 'passed' },
  {
    id: 'a2', title: 'Privacy diagnostic', category: 'Digital Governance', date: '06.09.2026', durationMinutes: 18, score: 3, totalScore: 5, status: 'remedial',
    misconceptions: [{ question: 'Which control applies?', chosenAnswer: 'None', correctAnswer: 'Data minimisation', misconception: 'The privacy control was overlooked.', remedialCourse: 'Privacy foundations', remedialCourseId: 'privacy-1' }],
  },
];

describe('OfficerDashboard', () => {
  it('renders the signed-in officer, cadre and division', () => {
    render(<OfficerDashboard {...baseProps} />);
    expect(screen.getByRole('heading', { name: /Officer Competency & Diagnostic Hub/i })).toBeDefined();
    expect(screen.getByText('Eshaan Sunthankar')).toBeDefined();
    expect(screen.getByText(/Junior Statistical Officer.*Field Operations Division/i)).toBeDefined();
    expect(screen.getByText(/ID: JSO_1042/i)).toBeDefined();
  });

  it('derives proficiency from the supplied competency keys', () => {
    render(<OfficerDashboard {...baseProps} assessmentHistory={history} />);
    expect(screen.getByText(/Average assessed level/i)).toBeDefined();
    expect(screen.getByText(/Priority gap: CAPI & Digital Field Enumeration/i)).toBeDefined();
    expect(screen.getByLabelText(/Survey Design & Sampling: level 4 of target 4/i)).toBeDefined();
    expect(screen.getByText('70%')).toBeDefined();
  });

  it('does not substitute sample results or cohorts when none exist', () => {
    render(<OfficerDashboard {...baseProps} proficiency={{}} />);
    expect(screen.getByText(/No diagnostic results yet/i)).toBeDefined();
    expect(screen.getByText(/No cohort recommendations/i)).toBeDefined();
    expect(screen.getByText(/No assessments recorded/i)).toBeDefined();
  });

  it('renders backend-supplied cohort recommendations', () => {
    render(<OfficerDashboard {...baseProps} capacityCohorts={[{ id: 'c1', name: 'Nowcasting taskforce', division: 'DIID', officersCount: 22, focusArea: 'Machine learning', badgeVariant: 'success', imageGradient: '' }]} />);
    expect(screen.getByText('Nowcasting taskforce')).toBeDefined();
    expect(screen.getByText(/Machine learning · 22 officers/i)).toBeDefined();
  });

  it('renders persisted history and opens the misconception dialog', () => {
    render(<OfficerDashboard {...baseProps} assessmentHistory={history} />);
    expect(screen.getByText('Sampling diagnostic')).toBeDefined();
    expect(screen.getByText('4 / 5')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Inspect 1 gap/i }));
    expect(screen.getByRole('dialog', { name: /Privacy diagnostic/i })).toBeDefined();
    expect(screen.getByText(/Identified misconception/i)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Close inspector/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the ACBP dossier action', () => {
    const onOpenAcbpModal = vi.fn();
    render(<OfficerDashboard {...baseProps} assessmentHistory={history} onOpenAcbpModal={onOpenAcbpModal} />);
    fireEvent.click(screen.getByRole('button', { name: /Generate officer ACBP dossier/i }));
    expect(onOpenAcbpModal).toHaveBeenCalledOnce();
  });

  it('navigates to the assessment engine', () => {
    const onNavigateTab = vi.fn();
    render(<OfficerDashboard {...baseProps} onNavigateTab={onNavigateTab} />);
    fireEvent.click(screen.getByRole('button', { name: /Take diagnostic exam/i }));
    expect(onNavigateTab).toHaveBeenCalledWith('dashboard');
  });
});
