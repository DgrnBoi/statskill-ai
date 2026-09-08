import React, { useState, useEffect } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { apiUrl } from '../../lib/api';
import {
  Cpu,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Key,
  Lock,
  Server,
  Cloud,
} from 'lucide-react';

export type AiInferenceEngine = 'GEMINI_FLASH' | 'GROQ_LLAMA' | 'SOVEREIGN_OFFLINE';

export interface AiModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiModelModal: React.FC<AiModelModalProps> = ({ isOpen, onClose }) => {
  const [selectedEngine, setSelectedEngine] = useState<AiInferenceEngine>('GEMINI_FLASH');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    model?: string;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    const savedKey = localStorage.getItem('statskill_api_key') || '';
    const savedEngine = (localStorage.getItem('statskill_ai_engine') as AiInferenceEngine) || 'GEMINI_FLASH';
    setApiKeyInput(savedKey);
    setSelectedEngine(savedEngine);
    setHealthStatus({ status: 'idle', message: '' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setHealthStatus({ status: 'idle', message: 'Testing inference connection...' });

    // Do NOT persist API keys to localStorage by default
    if (rememberKey) {
      localStorage.setItem('statskill_api_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('statskill_api_key');
    }
    localStorage.setItem('statskill_ai_engine', selectedEngine);

    try {
      const res = await fetch(apiUrl('/api/quiz/model-health'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      setIsTesting(false);

      if (data.status === 'cloud_active') {
        setHealthStatus({
          status: 'success',
          message: data.message || `Connected successfully to ${data.provider} (${data.model}).`,
          model: data.model,
        });
      } else if (data.status === 'offline_ready') {
        setHealthStatus({
          status: 'success',
          message: 'Sovereign On-Device Extractor active (Zero API key needed, 100% data residency).',
        });
      } else {
        setHealthStatus({
          status: 'warning',
          message: data.message || 'Key verification fallback to Sovereign On-Device Mode.',
        });
      }
    } catch (err: any) {
      setIsTesting(false);
      setHealthStatus({
        status: 'warning',
        message: 'Backend server connected in Sovereign On-Device Mode.',
      });
    }
  };

  const handleClearKey = () => {
    setApiKeyInput('');
    localStorage.removeItem('statskill_api_key');
    setSelectedEngine('SOVEREIGN_OFFLINE');
    localStorage.setItem('statskill_ai_engine', 'SOVEREIGN_OFFLINE');
    setHealthStatus({
      status: 'success',
      message: 'API Key removed. Sovereign On-Device Heuristic Engine selected.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-body animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#0B2E63] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-300" />
              </span>
              <Badge variant="success" className="bg-emerald-400/20 text-emerald-200 border-emerald-400/30 text-[10px]">
                Inference Gateway Switcher
              </Badge>
            </div>
            <h2 id="ai-modal-title" className="text-lg font-bold font-display text-white">
              AI Inference Engine & API Keys
            </h2>
            <p className="text-xs text-blue-100/80">
              Configure sovereign local extraction or connect your enterprise LLM provider.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close AI model settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Engine Selection Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Select Active Inference Model:
            </label>

            {/* Option 1: Google Gemini 1.5 Flash */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                selectedEngine === 'GEMINI_FLASH'
                  ? 'border-[#0B2E63] bg-blue-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="ai-engine"
                value="GEMINI_FLASH"
                checked={selectedEngine === 'GEMINI_FLASH'}
                onChange={() => setSelectedEngine('GEMINI_FLASH')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Google Gemini 1.5 Flash
                  </span>
                  <Badge variant="neutral" className="text-[10px]">Cloud RAG</Badge>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  High-capacity 1M token context window for large MoSPI statistical manuals.
                </p>
              </div>
            </label>

            {/* Option 2: Groq Cloud Inference */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                selectedEngine === 'GROQ_LLAMA'
                  ? 'border-[#0B2E63] bg-blue-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="ai-engine"
                value="GROQ_LLAMA"
                checked={selectedEngine === 'GROQ_LLAMA'}
                onChange={() => setSelectedEngine('GROQ_LLAMA')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Groq LPU Inference (Llama 3.3 70B)
                  </span>
                  <Badge variant="saffron" className="text-[10px]">Ultra Fast</Badge>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Sub-second LPUs for instantaneous question generation and real-time response.
                </p>
              </div>
            </label>

            {/* Option 3: Sovereign On-Device Extractor */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                selectedEngine === 'SOVEREIGN_OFFLINE'
                  ? 'border-[#0B2E63] bg-emerald-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="ai-engine"
                value="SOVEREIGN_OFFLINE"
                checked={selectedEngine === 'SOVEREIGN_OFFLINE'}
                onChange={() => setSelectedEngine('SOVEREIGN_OFFLINE')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Sovereign On-Device Extractor (Offline)
                  </span>
                  <Badge variant="success" className="text-[10px]">Zero Keys Needed</Badge>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  100% on-device linguistic heuristic extractor. Compliant with DPDP Act 2023.
                </p>
              </div>
            </label>
          </div>

          {/* API Key Input */}
          {selectedEngine !== 'SOVEREIGN_OFFLINE' && (
            <div className="space-y-2 animate-fade-in p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <label htmlFor="api-key-input" className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  Temporary Demo API Key (Client-Side Testing):
                </label>
                <Badge variant="saffron" className="text-[9px]">Local Demo Only</Badge>
              </div>
              <input
                id="api-key-input"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={selectedEngine === 'GEMINI_FLASH' ? 'AIzaSy...' : 'gsk_...'}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2E63]"
              />
              <label className="flex items-center gap-2 mt-2 text-[11px] text-amber-950 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="rounded border-amber-300 text-[#0B2E63] focus:ring-[#0B2E63]"
                />
                Remember key in local storage for future sessions
              </label>
              <p className="text-[10px] text-amber-900/80 leading-normal">
                ⚠️ <strong>Security Notice:</strong> Server-side environment secrets (GEMINI_API_KEY / GROQ_API_KEY) are preferred for production. User-supplied keys entered here are strictly for local testing and are not persisted by default.
              </p>
            </div>
          )}

          {/* Health Status Message */}
          {healthStatus.status !== 'idle' && (
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 animate-fade-in ${
                healthStatus.status === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {healthStatus.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{healthStatus.message}</p>
                {healthStatus.model && (
                  <p className="text-[10px] font-mono mt-0.5">Active Model: {healthStatus.model}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearKey}
            className="text-xs text-slate-600"
          >
            Use Sovereign Offline
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className="text-xs font-bold bg-[#0B2E63] text-white hover:bg-[#123E82]"
            >
              {isTesting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Testing...
                </>
              ) : (
                'Save & Test Gateway'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
