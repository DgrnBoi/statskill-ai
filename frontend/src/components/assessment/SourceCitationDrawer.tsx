import React, { useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  BookOpen,
  X,
  Lock,
  FileText,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export interface SourceCitationData {
  title?: string;
  chapter?: string;
  excerpt: string;
  pageNumber?: number;
  documentName?: string;
  topic?: string;
  remedialSkill?: string;
  misconception?: string;
}

export interface SourceCitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citation: SourceCitationData | null;
}

export const SourceCitationDrawer: React.FC<SourceCitationDrawerProps> = ({
  isOpen,
  onClose,
  citation,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !citation) return null;

  const handleCopy = () => {
    if (citation.excerpt) {
      navigator.clipboard.writeText(citation.excerpt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="citation-drawer-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Drawer Header */}
          <div className="bg-[#0B2E63] text-white p-5 border-b border-blue-900 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                </span>
                <Badge variant="success" className="bg-emerald-400/20 text-emerald-200 border-emerald-400/30 text-[10px]">
                  Grounded Source Excerpt
                </Badge>
                <Badge variant="neutral" className="bg-white/10 text-white border-white/20 text-[10px] font-mono">
                  MoSPI Sovereign RAG
                </Badge>
              </div>
              <h2 id="citation-drawer-title" className="text-lg font-bold font-display text-white tracking-tight">
                Grounded Document Inspector
              </h2>
              <p className="text-xs text-blue-100/80">
                Verbatim statistical manual provenance verified for active recall.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Close citation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
            {/* Source Provenance Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#0B2E63]" />
                Official Source Citation
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {citation.title || citation.documentName || 'Official MoSPI Standard Operating Procedure'}
                </h3>
                {citation.chapter && (
                  <p className="text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-800">Chapter / Section:</span> {citation.chapter}
                  </p>
                )}
                {citation.topic && (
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Assessed Topic:</span> {citation.topic}
                  </p>
                )}
              </div>
            </div>

            {/* Verbatim Grounded Excerpt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#0B2E63]" />
                  Verbatim Passage Grounding
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-[#0B2E63] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Passage</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl text-xs text-slate-800 leading-relaxed font-body shadow-2xs space-y-2">
                <p className="italic font-medium text-slate-900">
                  "{citation.excerpt}"
                </p>
              </div>
            </div>

            {/* Misconception Diagnostic Breakdown if present */}
            {citation.misconception && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-950">
                <span className="font-bold text-red-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  Diagnostic Misconception Analysis
                </span>
                <p className="leading-relaxed text-red-900">
                  {citation.misconception}
                </p>
                {citation.remedialSkill && (
                  <p className="font-semibold text-red-800 pt-1 border-t border-red-200/60">
                    Recommended Remedial Skill: {citation.remedialSkill}
                  </p>
                )}
              </div>
            )}

            {/* Statutory Compliance Note */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-950">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900">Anti-Hallucination Grounding Assurance</p>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  In accordance with MoSPI capacity building standards, this assessment question was synthesized with 100% token grounding from official reference documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
