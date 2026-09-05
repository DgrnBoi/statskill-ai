/* Hallmark · macrostructure: Secret Gateway Modal · nav: Protected HQ Administration */
/* states: locked · evaluating · unlocked · error lockout */
/* contrast: pass (WCAG AA 4.5:1+) */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  X,
  AlertCircle,
  CheckCircle2,
  Building2,
  Terminal,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SecretAdminGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAdmin: () => void;
}

export function SecretAdminGatewayModal({
  isOpen,
  onClose,
  onUnlockAdmin,
}: SecretAdminGatewayModalProps) {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setErrorMessage(null);
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcode.trim().toUpperCase();

    if (clean === 'MOSPI2026' || clean === '1042' || clean === 'ADMIN') {
      setIsSuccess(true);
      setErrorMessage(null);
      setTimeout(() => {
        onUnlockAdmin();
        onClose();
      }, 700);
    } else {
      setErrorMessage('Invalid ministerial PIN. Authorized codes: MOSPI2026 or 1042.');
      setPasscode('');
    }
  };

  const handleFillDemoKey = () => {
    setPasscode('MOSPI2026');
    setIsSuccess(true);
    setErrorMessage(null);
    setTimeout(() => {
      onUnlockAdmin();
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-admin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col font-body text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071F44] to-[#0B2E63] p-6 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="secret-admin-title" className="font-bold text-base font-display text-white">
                  MoSPI Sovereign Gateway
                </h3>
                <Badge variant="destructive" className="text-[10px] font-mono">RESTRICTED</Badge>
              </div>
              <p className="text-xs text-amber-300/80 mt-0.5 font-mono">HQ Administrative Clearance Required</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close secret gateway modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter the ministerial authorization clearance passcode to unlock the <strong className="text-amber-300">MoSPI HQ Admin Command Center</strong>, division allocations, and ACBP fiscal dossier.
          </p>

          <div className="space-y-2">
            <label htmlFor="admin-pin-input" className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Ministerial Clearance Passcode:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                ref={inputRef}
                id="admin-pin-input"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter PIN (e.g. MOSPI2026)..."
                aria-label="Ministerial Clearance Passcode"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div role="alert" className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl flex items-center gap-2 text-xs text-red-200 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div role="alert" className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl flex items-center gap-2 text-xs text-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              <span className="font-bold">Ministerial Clearance Verified. Unlocking HQ Command Center...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={!passcode.trim()}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Unlock className="w-4 h-4" />
              Authenticate Clearance
            </button>

            <button
              type="button"
              onClick={handleFillDemoKey}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Use Sovereign Demo Clearance Key (MOSPI2026)
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Secret Entrance: <strong className="text-amber-400">Ctrl+Shift+A</strong></span>
          <span>MoSPI DIID Node</span>
        </div>
      </div>
    </div>
  );
}
