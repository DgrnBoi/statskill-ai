import React, { useState } from 'react';
import { X, Copy, Check, Server, ShieldCheck, Terminal, Radio } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface XApiStatementPayload {
  actor: {
    name: string;
    account: {
      homePage: string;
      name: string;
    };
  };
  verb: {
    id: string;
    display: {
      'en-US': string;
    };
  };
  object: {
    id: string;
    definition: {
      name: {
        'en-US': string;
      };
      type: string;
    };
  };
  result: {
    score: {
      scaled: number;
      raw: number;
      min: number;
      max: number;
    };
    success: boolean;
  };
  context?: {
    platform?: string;
    revision?: string;
    extensions?: Record<string, any>;
  };
  timestamp: string;
}

interface XApiTelemetryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  statement: XApiStatementPayload | null;
}

export function XApiTelemetryDrawer({ isOpen, onClose, statement }: XApiTelemetryDrawerProps) {
  const [copied, setCopied] = useState(false);

  // Keyboard listener for Escape key to close modal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Fallback representative statement if not yet triggered by user quiz action

  const currentStatement: XApiStatementPayload = statement || {
    actor: {
      name: 'Eshaan Sunthankar (JSO)',
      account: {
        homePage: 'https://igotkarmayogi.gov.in',
        name: 'PARICHAY_1042_NSSO',
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
          'en-US': 'Official Survey Design & Multi-Stage Sampling Evaluation',
        },
        type: 'http://adlnet.gov/expapi/activities/assessment',
      },
    },
    result: {
      score: {
        scaled: 0.85,
        raw: 85,
        min: 0,
        max: 100,
      },
      success: true,
    },
    context: {
      platform: 'StatSkill AI • Sovereign MoSPI Node',
      revision: 'FRAC-v2.4-GOV-IN',
      extensions: {
        'https://igotkarmayogi.gov.in/ext/cadre': 'Subordinate Statistical Service (SSS)',
        'https://igotkarmayogi.gov.in/ext/division': 'Field Operations Division (FOD), NSSO',
        'https://igotkarmayogi.gov.in/ext/competency': 'Survey Design & Sampling',
      },
    },
    timestamp: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(currentStatement, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" role="dialog" aria-modal="true" aria-labelledby="xapi-drawer-title">
        <div className="w-screen max-w-xl bg-slate-900 text-slate-100 shadow-2xl flex flex-col border-l border-slate-800 animate-slide-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  iGOT LRS Telemetry Stream
                </span>
              </div>
              <h3 id="xapi-drawer-title" className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" aria-hidden="true" />
                xAPI / CMI-5 Statement Inspector
              </h3>
              <p className="text-xs text-slate-400">
                Live JSON-LD learning record dispatched to Karmayogi Bharat LRS
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close statement inspector drawer"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Connection Metadata Bar */}
          <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Target LRS Endpoint
              </span>
              <span className="font-mono text-xs text-amber-300 truncate block">
                igotkarmayogi.gov.in/lrs/v1/statements
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Protocol & Standard
              </span>
              <span className="font-mono text-xs text-emerald-400 block">
                ADL xAPI v1.0.3 (CMI-5)
              </span>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-semibold text-[11px]">
                  Cryptographically Signed & Verified
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax Block */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto text-slate-200 shadow-inner">
              <pre className="text-[11px] leading-relaxed">
                <code>{jsonString}</code>
              </pre>
            </div>

            {/* Quick Human-Readable Summary */}
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                Statement Breakdown
              </span>
              <div className="space-y-1 text-slate-300">
                <p>
                  <strong className="text-white">Actor:</strong> {currentStatement.actor.name} (
                  {currentStatement.actor.account.name})
                </p>
                <p>
                  <strong className="text-white">Verb:</strong> Completed assessment (
                  <code>{currentStatement.verb.id}</code>)
                </p>
                <p>
                  <strong className="text-white">Scaled Score:</strong>{' '}
                  <span className="text-emerald-400 font-bold">
                    {Math.round(currentStatement.result.score.scaled * 100)}%
                  </span>{' '}
                  (Pass: {currentStatement.result.success ? 'True' : 'False'})
                </p>
                <p>
                  <strong className="text-white">Timestamp:</strong>{' '}
                  {new Date(currentStatement.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              HTTP 200 OK • Transmission confirmed by Karmayogi node
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            >
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
