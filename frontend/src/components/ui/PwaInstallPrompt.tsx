import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (PWA installed)
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
        setIsInstalled(true);
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div 
      role="region" 
      aria-label="PWA Installation Prompt"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0B2E63] text-white p-4 rounded-xl shadow-2xl border border-amber-400/30 backdrop-blur-md animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-lg shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              Install StatSkill AI
              <span className="text-[10px] uppercase font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">MoSPI PWA</span>
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Install the sovereign statistical capacity workbench for offline access and instant loading.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Close install prompt"
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
      </div>
    </div>
  );
};
