// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentIngestionStudio } from '../components/assessment/DocumentIngestionStudio';

describe('Phase 1 & 2: Document Ingestion Studio Component', () => {
  const mockFile = new File(['Sample MoSPI text content for testing'], 'NSS_Sample_Manual.pdf', {
    type: 'application/pdf',
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/quiz/inspect-document')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              fileName: 'NSS_Sample_Manual.pdf',
              characterCount: 14500,
              wordCount: 2350,
              estimatedPages: 7,
              totalChunks: 8,
              sections: [
                { id: 'sec-1', title: 'Chapter 1: Multiplier & Weights', chunkCount: 3 },
                { id: 'sec-2', title: 'Chapter 2: DPDPA & Data Governance', chunkCount: 5 },
              ],
              keywordDensity: {
                sampling: 14,
                multiplier: 8,
                fsu: 6,
              },
              previewSnippet: 'Chapter 1: Sampling Design and Estimation Procedure for NSS surveys.',
            }),
        });
      }
      return Promise.reject(new Error('Unhandled mock endpoint'));
    });
  });

  it('renders pre-assessment studio and displays parsed document statistics', async () => {
    render(
      <DocumentIngestionStudio
        file={mockFile}
        onGenerate={vi.fn()}
        onCancel={vi.fn()}
        isGenerating={false}
      />
    );

    // Initial loading indicator
    expect(screen.getByText(/Analyzing Document Structure/i)).toBeInTheDocument();

    // After inspection completes
    await waitFor(() => {
      expect(screen.getByText(/Document Ingestion & Blueprint Studio/i)).toBeInTheDocument();
      expect(screen.getByText('NSS_Sample_Manual.pdf')).toBeInTheDocument();
      expect(screen.getByText(/2,350 words/i)).toBeInTheDocument();
    });
  });

  it('allows customizing Bloom cognitive taxonomy and triggers generation callback', async () => {
    const onGenerateMock = vi.fn();
    render(
      <DocumentIngestionStudio
        file={mockFile}
        onGenerate={onGenerateMock}
        onCancel={vi.fn()}
        isGenerating={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Grounded Assessment/i })).toBeInTheDocument();
    });

    // Change chapter selection
    const chapterSelect = screen.getByLabelText(/Focus Chapter \/ Section:/i);
    fireEvent.change(chapterSelect, { target: { value: 'Chapter 1: Multiplier & Weights' } });

    // Click Generate
    const generateBtn = screen.getByRole('button', { name: /Generate Grounded Assessment/i });
    fireEvent.click(generateBtn);

    expect(onGenerateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        chapter: 'Chapter 1: Multiplier & Weights',
        numQuestions: 5,
      })
    );
  });
});
