import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Volume2,
  X,
  Sparkles,
  Bot,
  Eye,
  Shield,
  UserCheck,
} from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';
import { InfoModalType } from './LandingInfoModal';

interface LandingHeaderProps {
  onOpenLogin: () => void;
  onOpenSecretAdmin: () => void;
  onOpenAccessibility: () => void;
  onOpenSahayak: () => void;
  onOpenInfo: (type: InfoModalType) => void;
  onLaunchPortal: () => void;
  fontScale?: number;
  setFontScale?: (updater: (v: number) => number) => void;
}

const NAV_ITEMS: { label: string; modalKey: NonNullable<InfoModalType> }[] = [
  { label: 'About Us', modalKey: 'about' },
  { label: 'Newsroom', modalKey: 'newsroom' },
  { label: 'Career', modalKey: 'career' },
  { label: 'Tenders', modalKey: 'tenders' },
  { label: 'Notifications', modalKey: 'notifications' },
  { label: 'Help Centre', modalKey: 'help' },
];

export function LandingHeader({
  onOpenLogin,
  onOpenSecretAdmin,
  onOpenAccessibility,
  onOpenSahayak,
  onOpenInfo,
  onLaunchPortal,
  fontScale = 1,
  setFontScale,
}: LandingHeaderProps) {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [mobileOpen, setMobileOpen] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmblemTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 700);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      onOpenSecretAdmin();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top ministerial micro-bar */}
      <div className="bg-[#0B2E63] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] md:text-xs">
          <button
            type="button"
            onClick={handleEmblemTap}
            className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            title="Government of India • Click 3 times for Admin Gateway"
          >
            <span className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-amber-400/80">
              <IndianFlag variant="circular" width={20} height={20} />
            </span>
            <span className="leading-tight">
              <span className="font-semibold text-amber-300">भारत सरकार</span>
              <span className="mx-1 text-white/40">|</span>
              Government of India
              <span className="hidden text-slate-200 sm:inline">
                {' '}
                — Ministry of Statistics and Programme Implementation (MoSPI)
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'EN' ? 'HI' : 'EN'))}
              className="rounded-sm px-1.5 py-0.5 font-medium transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            >
              {lang === 'EN' ? 'English / हिंदी' : 'हिंदी / English'}
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            {setFontScale && (
              <div className="flex items-center gap-1" aria-label="Adjust text size">
                <button
                  type="button"
                  onClick={() => setFontScale((v) => Math.max(0.9, +(v - 0.1).toFixed(2)))}
                  className="h-5 w-5 rounded-sm text-[10px] font-bold transition hover:bg-white/10 cursor-pointer"
                  title="Decrease text size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale(() => 1)}
                  className="h-5 w-5 rounded-sm text-xs font-bold transition hover:bg-white/10 cursor-pointer"
                  title="Reset text size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale((v) => Math.min(1.4, +(v + 0.1).toFixed(2)))}
                  className="h-5 w-5 rounded-sm text-sm font-bold transition hover:bg-white/10 cursor-pointer"
                  title="Increase text size"
                >
                  A+
                </button>
              </div>
            )}
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              title="Screen reader & accessibility settings (Ctrl+U / Alt+A)"
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden md:inline">Accessibility Console</span>
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenSahayak}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-amber-300 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              title="StatSkill Sahayak AI Guide (Alt+H)"
            >
              <Bot className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">AI Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tricolor divider accent */}
      <div
        className="h-[3px] w-full"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
        }}
      />

      {/* Main navbar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleEmblemTap}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#0B2E63] text-amber-400 shadow-xs border border-amber-400/80 cursor-pointer"
              title="MoSPI Sovereign Node"
            >
              <IndianFlag variant="circular" width={38} height={38} />
            </button>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="block font-bold text-lg text-[#0B2E63]">
                  StatSkill AI
                </span>
                <span className="rounded bg-[#123E82] px-1.5 py-0.2 text-[10px] font-mono font-semibold text-slate-100 border border-[#1A56A0]">
                  MoSPI Sovereign Node
                </span>
              </div>
              <span className="block text-[11px] font-medium tracking-wide text-slate-500">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय · Mission Karmayogi
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map(({ label, modalKey }) => (
              <button
                key={label}
                type="button"
                onClick={() => onOpenInfo(modalKey)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#0B2E63]/10 hover:text-[#0B2E63] cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden rounded-md border border-[#0B2E63] px-3.5 py-2 text-xs font-semibold text-[#0B2E63] transition hover:bg-[#0B2E63] hover:text-white sm:flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Log In (SSO)
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-xs transition hover:bg-amber-400 cursor-pointer"
            >
              Register
            </button>
            <button
              type="button"
              onClick={onLaunchPortal}
              className="hidden items-center gap-1.5 rounded-full bg-[#1A56A0] hover:bg-[#123E82] px-4 py-2 text-xs font-bold text-white transition md:flex shadow-xs cursor-pointer active:translate-y-[1px]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Launch StatSkill Portal
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-[#0B2E63] lg:hidden cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden shadow-lg"
            aria-label="Mobile"
          >
            <ul className="flex flex-col space-y-1">
              {NAV_ITEMS.map(({ label, modalKey }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenInfo(modalKey);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-[#0B2E63]/10 hover:text-[#0B2E63] cursor-pointer"
                  >
                    <span>{label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                  </button>
                </li>
              ))}
              <li className="mt-3 flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenLogin();
                  }}
                  className="flex-1 rounded-md border border-[#0B2E63] px-4 py-2 text-xs font-semibold text-[#0B2E63]"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onLaunchPortal();
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A56A0] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Launch Portal
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
