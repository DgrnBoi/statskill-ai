// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssessmentAnalysisReport, QuestionAnswerRecord, AssessmentAnalysisData } from '../components/assessment/AssessmentAnalysisReport';

describe('Assessment Analysis Report & Anti-Hallucination AI Pod Test Suite', () => {
  const mockAnswers: QuestionAnswerRecord[] = [
    {
      questionNumber: 1,
      questionText: 'What is the primary sampling unit in NSS rural surveys?',
      topic: 'Survey Sampling',
      selectedOption: 'Census Village',
      correctAnswer: 'Census Village',
      isCorrect: true,
      explanation: 'Census villages are the standard First Stage Units (FSUs) in rural NSS rounds.',
    },
    {
      questionNumber: 2,
      questionText: 'Which index measures retail price inflation in India?',
      topic: 'Macro Indices',
      selectedOption: 'Consumer Price Index (CPI)',
      correctAnswer: 'Consumer Price Index (CPI)',
      isCorrect: true,
      explanation: 'CPI compiled by NSO measures retail price inflation.',
    },
    {
      questionNumber: 3,
      questionText: 'Which statutory body enforces DPDPA compliance?',
      topic: 'Digital Governance',
      selectedOption: 'Data Protection Board of India',
      correctAnswer: 'Data Protection Board of India',
      isCorrect: true,
      explanation: 'The DPBI is established under DPDPA 2023.',
    },
    {
      questionNumber: 4,
      questionText: 'What is the base year for the current All-India CPI series?',
      topic: 'Macro Indices',
      selectedOption: '2011-12',
      correctAnswer: '2012',
      isCorrect: false,
      explanation: 'The base year for CPI (Rural/Urban/Combined) is 2012=100.',
    },
    {
      questionNumber: 5,
      questionText: 'Which software is officially utilized for NSS microdata analysis?',
      topic: 'Statistical Computing',
      selectedOption: 'R and Python',
      correctAnswer: 'R and Python',
      isCorrect: true,
      explanation: 'MoSPI training modules leverage R and Python for microdata extraction.',
    },
  ];

  const mockAnalysisData: AssessmentAnalysisData = {
    score: 80,
    totalScore: 100,
    scorePercentage: 80,
    status: 'passed',
    evaluationMode: 'CLOUD_AI_VERIFIED',
    aiStrategicFeedback: {
      executiveSummary: 'We evaluated your assessment responses and confirmed that you demonstrate strong mastery across key operational domains for Junior Statistical Officer (JSO).',
      demonstratedStrengths: [
        'We confirmed strong proficiency in Survey Sampling under the Statistical Competencies pillar at Level 4.',
        'We confirmed strong proficiency in Digital Governance protocols under DPDPA 2023.',
      ],
      priorityGrowthAreas: [
        'We recommend targeted remediation in Macro Indices and CPI base year calculations.',
      ],
      actionPlan30Days: [
        'Complete the verified remedial course on Price Statistics & Index Theory.',
        'Participate in peer validation sessions with the FOD working group.',
        'Retake the 4-pillar diagnostic assessment to confirm benchmark advancement.',
      ],
    },
    pillarBreakdown: [
      {
        pillar: 'Statistical Competencies',
        skillName: 'Survey Design & Sampling Theory',
        previousLevel: 3,
        updatedLevel: 4,
        delta: 1,
        scorePercentage: 80,
        benchmarkLevel: 3,
      },
      {
        pillar: 'Technical Competencies',
        skillName: 'CAPI & Digital Field Enumeration',
        previousLevel: 3,
        updatedLevel: 4,
        delta: 1,
        scorePercentage: 80,
        benchmarkLevel: 4,
      },
      {
        pillar: 'Digital Governance',
        skillName: 'Data Privacy & DPDPA 2023',
        previousLevel: 2,
        updatedLevel: 3,
        delta: 1,
        scorePercentage: 60,
        benchmarkLevel: 2,
      },
      {
        pillar: 'Behavioural and Managerial',
        skillName: 'Public Ethics & Field Communication',
        previousLevel: 3,
        updatedLevel: 3,
        delta: 0,
        scorePercentage: 60,
        benchmarkLevel: 3,
      },
    ],
    recommendedCourses: [
      {
        id: 'nsso-sampling-201',
        title: 'Advanced Survey Sampling and Weight Imputation',
        provider: 'National Statistical Systems Training Academy (NSSTA)',
        link: 'https://igotkarmayogi.gov.in/app/toc/lex_auth_0138549281928374821/overview',
        domain: 'Statistical Competencies',
        duration: '4 hours',
        suitabilityScore: 95,
        rationale: 'We mapped this course to address your gap in Macro Indices.',
        isVerifiedCatalog: true,
      },
    ],
  };

  it('renders overall score (4/5), percentage (80%), time taken, and action buttons', () => {
    const onNavigateToPathway = vi.fn();
    const onRetakeQuiz = vi.fn();
    const onOpenTelemetry = vi.fn();

    render(
      <AssessmentAnalysisReport
        answers={mockAnswers}
        totalQuestions={5}
        timeTakenSeconds={74}
        paperSet="Set A"
        cadre="Junior Statistical Officer (JSO)"
        division="Field Operations Division (FOD), NSSO"
        analysisData={mockAnalysisData}
        onNavigateToPathway={onNavigateToPathway}
        onRetakeQuiz={onRetakeQuiz}
        onOpenTelemetry={onOpenTelemetry}
      />
    );

    // Verify Score & Percent
    expect(screen.getByText('4 / 5')).toBeDefined();
    expect(screen.getByText('80% Score')).toBeDefined();

    // Verify Time Taken (74s = 1m 14s)
    expect(screen.getByText('1m 14s / 2m 30s')).toBeDefined();

    // Verify Rating Title
    expect(screen.getAllByText('Strong assessment result').length).toBeGreaterThanOrEqual(1);

    // Verify Action buttons
    const pathwayBtn = screen.getByRole('button', { name: /View 4-Tier Learning Pathway/i });
    expect(pathwayBtn).toBeDefined();
    fireEvent.click(pathwayBtn);
    expect(onNavigateToPathway).toHaveBeenCalledTimes(1);

    const retakeBtn = screen.getByRole('button', { name: /Practice New Set/i });
    expect(retakeBtn).toBeDefined();
    fireEvent.click(retakeBtn);
    expect(onRetakeQuiz).toHaveBeenCalledTimes(1);

    const telemetryBtn = screen.getByRole('button', { name: /Inspect xAPI payload/i });
    expect(telemetryBtn).toBeDefined();
    fireEvent.click(telemetryBtn);
    expect(onOpenTelemetry).toHaveBeenCalledTimes(1);
  });

  it('renders AI Strategic Feedback Pod with Executive Summary, Strengths, Growth Areas, and Action Plan', () => {
    render(
      <AssessmentAnalysisReport
        answers={mockAnswers}
        totalQuestions={5}
        timeTakenSeconds={80}
        paperSet="Set B"
        cadre="Junior Statistical Officer (JSO)"
        division="Field Operations Division (FOD), NSSO"
        analysisData={mockAnalysisData}
        onNavigateToPathway={vi.fn()}
        onRetakeQuiz={vi.fn()}
        onOpenTelemetry={vi.fn()}
      />
    );

    expect(screen.getByText(/AI Strategic Diagnostic Analysis/i)).toBeDefined();
    expect(screen.getByText(/Anti-Hallucination Verified/i)).toBeDefined();
    expect(screen.getByText(/We evaluated your assessment responses and confirmed that you demonstrate strong mastery/i)).toBeDefined();
    expect(screen.getByText(/Demonstrated Strengths/i)).toBeDefined();
    expect(screen.getByText(/Priority Growth Areas/i)).toBeDefined();
    expect(screen.getByText(/30-Day Competency Advancement Plan/i)).toBeDefined();
  });

  it('renders 4-Pillar Dynamic Competency Breakdown with benchmarks and level updates', () => {
    render(
      <AssessmentAnalysisReport
        answers={mockAnswers}
        totalQuestions={5}
        timeTakenSeconds={80}
        paperSet="Set B"
        cadre="Junior Statistical Officer (JSO)"
        division="Field Operations Division (FOD), NSSO"
        analysisData={mockAnalysisData}
        onNavigateToPathway={vi.fn()}
        onRetakeQuiz={vi.fn()}
        onOpenTelemetry={vi.fn()}
      />
    );

    expect(screen.getByText(/4-Pillar Dynamic Competency Calibration/i)).toBeDefined();
    expect(screen.getByText('Survey Design & Sampling Theory')).toBeDefined();
    expect(screen.getByText('CAPI & Digital Field Enumeration')).toBeDefined();
    expect(screen.getByText('Data Privacy & DPDPA 2023')).toBeDefined();
    expect(screen.getByText('Public Ethics & Field Communication')).toBeDefined();
  });

  it('renders Verified iGOT Karmayogi Recommended Curriculum with genuine course IDs and links', () => {
    render(
      <AssessmentAnalysisReport
        answers={mockAnswers}
        totalQuestions={5}
        timeTakenSeconds={80}
        paperSet="Set B"
        cadre="Junior Statistical Officer (JSO)"
        division="Field Operations Division (FOD), NSSO"
        analysisData={mockAnalysisData}
        onNavigateToPathway={vi.fn()}
        onRetakeQuiz={vi.fn()}
        onOpenTelemetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Verified iGOT Karmayogi Recommended Curriculum/i)).toBeDefined();
    expect(screen.getByText('Advanced Survey Sampling and Weight Imputation')).toBeDefined();
    expect(screen.getByText(/Verified iGOT ID: nsso-sampling-201/i)).toBeDefined();
    expect(screen.getByText('95% Match')).toBeDefined();
  });
});
