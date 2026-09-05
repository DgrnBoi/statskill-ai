import React from 'react';
import { cn } from '../../lib/utils';
import { UserCheck, BookOpen, BarChart3, LayoutDashboard, Award } from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';

interface NavbarProps {
  activeTab: 'dashboard' | 'discover' | 'competency' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'discover' | 'competency' | 'analytics') => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  onOpenLogin?: () => void;
  officerName?: string;
  officerCadreId?: string;
}

export function Navbar({
  activeTab,
  setActiveTab,
  isLoggedIn,
  setIsLoggedIn,
  onOpenLogin,
  officerName,
  officerCadreId,
}: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Assessment Engine', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover (880+ Catalog)', icon: BookOpen },
    { id: 'competency', label: 'FRAC Competency Profile', icon: Award },
    { id: 'analytics', label: 'MoSPI Analytics', icon: BarChart3 },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Official Government Top Brand Bar */}
      <div className="bg-primary-900 text-white px-4 md:px-10 py-3 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-amber-400/80 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0">
              <IndianFlag variant="circular" width={40} height={40} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  Government of India • MoSPI / DIID
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-primary-100 text-[11px] font-medium tracking-wide">
                  Mission Karmayogi
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                StatSkill AI
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-800 text-primary-100 border border-primary-700">
                  NSSTA Sovereign Node
                </span>
              </h1>
            </div>
          </div>

          {/* Jan Parichay SSO Authentication Badge / Button */}
          <div className="flex items-center gap-3">
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
                className="bg-primary-800 hover:bg-primary-700 text-amber-300 hover:text-amber-200 border border-amber-400/60 px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Login via Jan Parichay (SSO)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                aria-label={`Log out of authenticated session for ${officerName || 'MoSPI Officer'}`}
                className="bg-emerald-800 text-emerald-100 border border-emerald-500 px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                {officerName ? `${officerName} (${officerCadreId || 'Authenticated'})` : 'Officer Authenticated: JSO_1042'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle National Tricolour Accent Line */}
      <div
        className="h-1 w-full"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
        }}
      />

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none" aria-label="Portal Navigation">
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
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-1',
                  isActive
                    ? 'bg-primary-50 text-primary-900 border border-primary-200 shadow-xs'
                    : 'text-slate-700 hover:text-primary-900 hover:bg-slate-50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-primary-900' : 'text-slate-500')} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
