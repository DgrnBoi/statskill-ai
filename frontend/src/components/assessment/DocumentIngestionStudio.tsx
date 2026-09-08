import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { apiUrl } from '../../lib/api';
import {
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Sliders,
  Eye,
  Hash,
  Activity,
  ArrowLeft,
} from 'lucide-react';

export interface DocumentInspectionData {
  fileName: string;
  characterCount: number;
  wordCount: number;
  estimatedPages: number;
  totalChunks: number;
  sections: Array<{ id: string; title: string; chunkCount: number }>;
  keywordDensity: Record<string, number>;
  previewSnippet: string;
  documentFingerprint?: string;
}

export interface DocumentIngestionStudioProps {
  file: File;
  onGenerate: (params: {
    chapter?: string;
    numQuestions: number;
    bloomLevel: string;
    difficulty: string;
  }) => void;
  onCancel: () => void;
  isGenerating: boolean;
  isAntiSpamLocked?: boolean;
}

export const DocumentIngestionStudio: React.FC<DocumentIngestionStudioProps> = ({
  file,
  onGenerate,
  onCancel,
  isGenerating,
  isAntiSpamLocked = false,
}) => {
  const [isInspecting, setIsInspecting] = useState(true);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<DocumentInspectionData | null>(null);

  // User configuration state
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [bloomLevel, setBloomLevel] = useState<string>('Application (L3)');
  const [difficulty, setDifficulty] = useState<string>('intermediate');

  useEffect(() => {
    let isMounted = true;
    setIsInspecting(true);
    setInspectionError(null);

    const formData = new FormData();
    formData.append('document', file);

    fetch(apiUrl('/api/quiz/inspect-document'), {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}: Failed to inspect document.`);
        }
        return res.json();
      })
      .then((data: DocumentInspectionData) => {
        if (isMounted) {
          setMetadata(data);
          setIsInspecting(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.error('[DocumentIngestionStudio] Inspection error:', err);
          setInspectionError(err.message || 'Failed to inspect document.');
          setIsInspecting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [file]);

  const handleGenerateClick = () => {
    onGenerate({
      chapter: selectedChapter === 'ALL' ? undefined : selectedChapter,
      numQuestions,
      bloomLevel,
      difficulty,
    });
  };

  return (
    <Card className="border-2 border-[#0B2E63]/30 bg-white overflow-hidden shadow-lg animate-fade-in font-body">
      {/* Studio Header */}
      <div className="bg-[#0B2E63] text-white p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="p-1.5 bg-white/10 rounded-md text-amber-300">
                <Sliders className="w-4 h-4" />
              </span>
              <Badge variant="neutral" className="bg-white/15 text-white border-white/20">
                Pre-Assessment Studio
              </Badge>
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                Grounded RAG Pipeline
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Document Ingestion & Blueprint Studio
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-2xl">
              Inspect structural chapters, statistical keyword density, and configure Bloom cognitive taxonomy before generating official assessment questions.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isGenerating}
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 text-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Change Document
          </Button>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Loading / Inspection state */}
        {isInspecting && (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0B2E63] shadow-xs">
              <RotateCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Analyzing Document Structure & Key Propositions...
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Parsing sections, computing keyword distributions, and formatting grounding windows from <span className="font-semibold text-slate-800">{file.name}</span>.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Tokenizing propositions and building BM25 index</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {!isInspecting && inspectionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-3" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold">Document Parsing Notice</h3>
                <p className="text-xs text-red-800 mt-0.5">{inspectionError}</p>
                <p className="text-xs text-slate-600 mt-2">
                  We will proceed with standard offline question bank fallbacks for this topic.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" size="sm" variant="outline" onClick={onCancel} className="text-xs">
                Upload Another File
              </Button>
              <Button type="button" size="sm" onClick={handleGenerateClick} className="text-xs bg-[#0B2E63] text-white">
                Proceed with Fallback Questions
              </Button>
            </div>
          </div>
        )}

        {/* Inspected Content & Controls */}
        {!isInspecting && metadata && (
          <div className="space-y-6 animate-fade-in">
            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 text-[#0B2E63]" />
                  Document Name
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1 truncate" title={metadata.fileName}>
                  {metadata.fileName}
                </p>
                <span className="text-[10px] text-slate-500">{metadata.estimatedPages} estimated pages</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <Hash className="w-3.5 h-3.5 text-[#0B2E63]" />
                  Word Count
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1 font-mono">
                  {metadata.wordCount.toLocaleString()} words
                </p>
                <span className="text-[10px] text-slate-500">{metadata.characterCount.toLocaleString()} chars</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <Layers className="w-3.5 h-3.5 text-[#0B2E63]" />
                  RAG Chunks
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1 font-mono">
                  {metadata.totalChunks} indexed chunks
                </p>
                <span className="text-[10px] text-slate-500">2000 char windows</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <Activity className="w-3.5 h-3.5 text-[#0B2E63]" />
                  Detected Sections
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1 font-mono">
                  {metadata.sections.length} chapters
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Structured</span>
              </div>
            </div>

            {/* Keyword Density & Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Statistical Keywords */}
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B2E63] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Statistical Keyword Density
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Object.keys(metadata.keywordDensity || {}).length} terms found
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(metadata.keywordDensity || {}).length > 0 ? (
                    Object.entries(metadata.keywordDensity).map(([kw, count]) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 rounded-md text-xs font-medium text-slate-800 shadow-2xs"
                      >
                        <span className="capitalize">{kw}</span>
                        <span className="px-1 py-0.2 rounded bg-[#0B2E63] text-white text-[10px] font-mono font-bold">
                          {count}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Standard statistical terminology detected across text passages.
                    </span>
                  )}
                </div>
              </div>

              {/* Text Preview Snippet */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Ingested Document Excerpt Preview
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Clean text snippet</span>
                </div>
                <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded border border-slate-200 line-clamp-3 leading-relaxed">
                  {metadata.previewSnippet || 'No text snippet available.'}
                </p>
              </div>
            </div>

            {/* Customization Controls Card */}
            <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0B2E63]" />
                Assessment Blueprint Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Chapter Target Selection */}
                <div>
                  <label htmlFor="chapter-select" className="text-xs font-bold text-slate-700 block mb-1.5">
                    Focus Chapter / Section:
                  </label>
                  <select
                    id="chapter-select"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E63] shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">Entire Document (Balanced Coverage)</option>
                    {metadata.sections.map((sec) => (
                      <option key={sec.id} value={sec.title}>
                        {sec.title} ({sec.chunkCount} {sec.chunkCount === 1 ? 'part' : 'parts'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bloom Cognitive Level */}
                <div>
                  <label htmlFor="bloom-select" className="text-xs font-bold text-slate-700 block mb-1.5">
                    Cognitive Level:
                  </label>
                  <select
                    id="bloom-select"
                    value={bloomLevel}
                    onChange={(e) => setBloomLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E63] shadow-2xs cursor-pointer"
                  >
                    <option value="Recall (L1)">Recall (L1) — Terms & Definitions</option>
                    <option value="Understanding (L2)">Understanding (L2) — Methodology Rules</option>
                    <option value="Application (L3)">Application (L3) — Field Computations</option>
                    <option value="Analysis (L4)">Analysis (L4) — Discrepancy & Audit</option>
                  </select>
                </div>

                {/* Question Count & Difficulty */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="count-select" className="text-xs font-bold text-slate-700 block mb-1.5">
                      Question Count:
                    </label>
                    <select
                      id="count-select"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E63] shadow-2xs cursor-pointer"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="diff-select" className="text-xs font-bold text-slate-700 block mb-1.5">
                      Benchmark:
                    </label>
                    <select
                      id="diff-select"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E63] shadow-2xs cursor-pointer"
                    >
                      <option value="foundational">Foundational</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Questions will be dynamically synthesized with verbatim source citations.
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    disabled={isGenerating}
                    className="w-full sm:w-auto text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateClick}
                    disabled={isGenerating || isAntiSpamLocked}
                    className="w-full sm:w-auto text-xs font-bold bg-[#0B2E63] hover:bg-[#123E82] text-white shadow-xs flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin text-white" />
                        <span>Synthesizing Exam Paper...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate Grounded Assessment</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
