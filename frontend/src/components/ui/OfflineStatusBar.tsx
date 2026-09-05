import React, { useState, useEffect } from 'react';
import { WifiOff, Download, CheckCircle2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function OfflineStatusBar() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [justReconnected, setJustReconnected] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  if (isDismissed) return null;

  if (!isOnline) {
    return (
      <aside
        aria-live="assertive"
        aria-label="Network Status Alert"
        className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 shadow-md border-b border-amber-600 animate-fade-in"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-900/20 rounded-full">
              <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
            </span>
            <span>
              <strong>Offline Field Mode Active:</strong> Running from local device cache. Assessment engine and offline question bank are 100% operational.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss offline alert"
            className="text-slate-950 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  if (justReconnected) {
    return (
      <aside
        aria-live="polite"
        aria-label="Connection Restored Alert"
        className="sticky top-0 z-50 bg-emerald-700 text-white px-4 py-2 shadow-md border-b border-emerald-800 animate-fade-in"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Connection Restored - Offline learning telemetry synced with sovereign node.</span>
          </div>
          <button
            type="button"
            onClick={() => setJustReconnected(false)}
            aria-label="Dismiss notification"
            className="text-emerald-200 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  if (installPrompt && !isInstalled) {
    return (
      <aside
        aria-live="polite"
        aria-label="Install PWA Prompt"
        className="bg-[#081F42] text-white border-b border-[#1A56A0] px-4 py-2"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">
              Install <strong>StatSkill AI</strong> on your mobile or CAPI tablet for offline field survey practice.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-md text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition active:translate-y-[1px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              Install App
            </button>
            <button
              type="button"
              onClick={() => setInstallPrompt(null)}
              aria-label="Dismiss install banner"
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
