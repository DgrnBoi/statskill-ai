// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssessmentAnalysisReport, QuestionAnswerRecord } from '../components/assessment/AssessmentAnalysisReport';

describe('Assessment Analysis Report & Timer Stoppage', () => {
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

  it('renders overall score (4/5), percentage (80%), time taken, and itemized breakdown', () => {
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
});
