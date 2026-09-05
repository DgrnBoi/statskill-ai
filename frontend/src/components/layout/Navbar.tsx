/* Hallmark · macrostructure: Workbench · nav: N6 Masthead + N5 Floating Pill */
/* states: default · hover · focus · active · disabled */
/* contrast: pass (WCAG AA 4.5:1+) */

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  UserCheck,
  BookOpen,
  BarChart3,
  LayoutDashboard,
  Award,
  Building2,
  Shield,
  Cpu,
  Eye,
  Bot,
  ArrowLeft,
  Lock,
  Unlock,
  Home
} from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';

export type PortalTab = 'home' | 'overview' | 'dashboard' | 'discover' | 'competency' | 'analytics' | 'admin';

interface NavbarProps {
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  onOpenLogin?: () => void;
  officerName?: string;
  officerCadreId?: string;
  isAdminUnlocked?: boolean;
  onOpenSecretAdmin?: () => void;
  onOpenAccessibility?: () => void;
  onOpenSahayak?: () => void;
  canGoBack?: boolean;
  previousTabTitle?: string;
  onGoBack?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  isLoggedIn,
  setIsLoggedIn,
  onOpenLogin,
  officerName,
  officerCadreId,
  isAdminUnlocked = false,
  onOpenSecretAdmin,
  onOpenAccessibility,
  onOpenSahayak,
  canGoBack = false,
  previousTabTitle,
  onGoBack,
}: NavbarProps) {
  const [emblemClicks, setEmblemClicks] = useState(0);

  const handleEmblemClick = () => {
    const nextCount = emblemClicks + 1;
    setEmblemClicks(nextCount);
    if (nextCount >= 3) {
      setEmblemClicks(0);
      if (onOpenSecretAdmin) {
        onOpenSecretAdmin();
      }
    }
  };

  interface TabItem {
    id: PortalTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isSpecial?: boolean;
  }

  // Regular public tabs
  const tabs: TabItem[] = [
    { id: 'home', label: 'Public Gateway', icon: Home },
    { id: 'overview', label: 'Officer Dashboard', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Assessment Engine', icon: Cpu },
    { id: 'discover', label: 'Discover (880+ Catalog)', icon: BookOpen },
    { id: 'competency', label: 'FRAC Competency Profile', icon: Award },
    { id: 'analytics', label: 'MoSPI Analytics', icon: BarChart3 },
  ];

  // If secret admin is unlocked or active, append the Admin tab
  if (isAdminUnlocked || activeTab === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin Command Center', icon: Building2, isSpecial: true });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Official Government Masthead Bar */}
      <div className="bg-[#0B2E63] text-white px-4 md:px-10 py-3 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Masthead Left Branding */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <button
              type="button"
              onClick={handleEmblemClick}
              title="Government of India • MoSPI Sovereign Node (Click 3 times for HQ Admin Gateway)"
              aria-label="Government of India National Emblem"
              className="w-10 h-10 rounded-full bg-white/10 border border-amber-400/90 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0 cursor-pointer hover:border-amber-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <IndianFlag variant="circular" width={40} height={40} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-semibold text-[11px] uppercase tracking-wider font-mono">
                  Government of India • MoSPI / DIID
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-200 text-[11px] font-medium tracking-wide">
                  Mission Karmayogi
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 font-display">
                StatSkill AI
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#123E82] text-slate-100 border border-[#1A56A0] font-mono">
                  NSSTA Sovereign Node
                </span>
              </h1>
            </div>
          </div>

          {/* Masthead Right Controls */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            {/* AI Assistant Quick Trigger */}
            <button
              type="button"
              onClick={onOpenSahayak}
              aria-label="Open Karmayogi Sahayak AI Guide (Alt+H)"
              className="bg-[#123E82] hover:bg-[#1A56A0] text-amber-300 border border-amber-400/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Karmayogi Sahayak AI Guide (Alt+H)"
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Guide</span>
            </button>

            {/* Accessibility Quick Trigger */}
            <button
              type="button"
              onClick={onOpenAccessibility}
              aria-label="Open Accessibility & Display Settings (Alt+A)"
              className="bg-[#123E82] hover:bg-[#1A56A0] text-slate-200 hover:text-white border border-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              title="Accessibility & Keyboard Shortcuts (Alt+A)"
            >
              <Eye className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Accessibility</span>
            </button>

            {/* Admin Clearance Active Badge (if unlocked) */}
            {isAdminUnlocked && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold font-mono">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>HQ Clearance Active</span>
              </div>
            )}

            {/* Jan Parichay SSO Authentication Button */}
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenLogin) {
                    onOpenLogin();
                  } else {
                    setIsLoggedIn(true);
                  }
                }}
                aria-label="Login via Jan Parichay Single Sign-On"
                className="bg-[#123E82] hover:bg-[#1A56A0] text-amber-300 hover:text-amber-200 border border-amber-400/60 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Login (SSO)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                aria-label={`Log out of authenticated session for ${officerName || 'MoSPI Officer'}`}
                className="bg-[#155C33] text-emerald-100 border border-emerald-400/60 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                {officerName ? `${officerName} (${officerCadreId || 'Auth'})` : 'Officer: JSO_1042'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* National Tricolour Divider Line */}
      <div
        className="h-[3px] w-full"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
        }}
      />

      {/* Navigation Tab Bar & Optional Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Portal Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-tab-${tab.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63] focus-visible:ring-offset-1 active:translate-y-[1px]',
                  isActive
                    ? 'bg-[#0B2E63]/10 text-[#0B2E63] font-semibold border border-[#0B2E63]/25 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#0B2E63]' : 'text-slate-500')} aria-hidden="true" />
                {tab.label}
                {tab.isSpecial && (
                  <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300 font-mono">
                    HQ
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Back to Previous Menu Button */}
        {canGoBack && onGoBack && (
          <div className="flex items-center self-end sm:self-center py-2 sm:py-0">
            <button
              type="button"
              onClick={onGoBack}
              aria-label={`Back to ${previousTabTitle || 'Previous Menu'}`}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0B2E63]" />
              <span>Back to {previousTabTitle || 'Previous Menu'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
