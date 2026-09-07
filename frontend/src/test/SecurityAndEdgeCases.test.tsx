// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentIngestionStudio } from '../components/assessment/DocumentIngestionStudio';
import { CourseCatalog } from '../components/catalog/CourseCatalog';
import { AssessmentAnalysisReport } from '../components/assessment/AssessmentAnalysisReport';

describe('Frontend Red-Team & Edge-Case Protection Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects image files and displays clear security guidance in DocumentIngestionStudio', async () => {
    const mockImageFile = new File(['fake-png-binary'], 'hacker_avatar.png', {
      type: 'image/png',
    });

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'Invalid file format. Only official PDF/text documents are permitted.',
          }),
      })
    );

    render(
      <DocumentIngestionStudio
        file={mockImageFile}
        onGenerate={vi.fn()}
        onCancel={vi.fn()}
        isGenerating={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Only official PDF\/text documents are permitted/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upload Another File/i })).toBeInTheDocument();
    });
  });

  it('safely handles XSS injections in course search inputs without DOM execution', () => {
    const onSearchMock = vi.fn();
    const maliciousQuery = '<script>alert(1)</script>';

    render(
      <CourseCatalog
        courses={[]}
        searchQuery={maliciousQuery}
        onSearchQueryChange={onSearchMock}
        selectedDomain="All"
        onDomainChange={vi.fn()}
        courseError={null}
        isActionLocked={false}
        onSelectCourse={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search by course/i);
    expect(searchInput).toHaveValue(maliciousQuery);
    expect(document.querySelector('script:not([type])')).toBeNull();
  });

  it('safely renders XSS strings in assessment question and explanation without unescaped HTML injection', () => {
    const maliciousAnswerRecord = {
      questionNumber: 1,
      questionText: 'What is the sampling fraction? <img src=x onerror=alert(1)>',
      topic: 'Survey Sampling <script>evil()</script>',
      selectedOption: 'f = n / N <svg onload=alert(2)>',
      correctAnswer: 'f = n / N',
      isCorrect: true,
      explanation: 'Sampling fraction explanation with <iframe src="evil.com"></iframe> tag.',
      sourceCitation: 'NSS Manual <b onmouseover=alert(3)>Chapter 1</b>',
    };

    render(
      <AssessmentAnalysisReport
        answers={[maliciousAnswerRecord]}
        totalQuestions={1}
        timeTakenSeconds={45}
        paperSet="Set A"
        cadre="Junior Statistical Officer (JSO)"
        division="Field Operations Division (FOD)"
        onNavigateToPathway={vi.fn()}
        onRetakeQuiz={vi.fn()}
        onOpenTelemetry={vi.fn()}
        onOpenCertificate={vi.fn()}
      />
    );

    expect(screen.getByText(/What is the sampling fraction\?/i)).toBeInTheDocument();
    expect(document.querySelector('iframe[src="evil.com"]')).toBeNull();
  });
});
