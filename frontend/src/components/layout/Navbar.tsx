import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  Cpu,
  Eye,
  Home,
  LayoutDashboard,
  LogOut,
  Shield,
  UserCheck,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { IndianFlag } from '../ui/IndianFlag';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

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
  onOpenAiModel?: () => void;
  canGoBack?: boolean;
  previousTabTitle?: string;
  onGoBack?: () => void;
}

const baseTabs = [
  { id: 'home' as const, label: 'Public Gateway', icon: Home },
  { id: 'overview' as const, label: 'Officer Dashboard', icon: LayoutDashboard },
  { id: 'dashboard' as const, label: 'Assessment Engine', icon: Cpu },
  { id: 'discover' as const, label: 'Discover (880+ Catalog)', icon: BookOpen },
  { id: 'competency' as const, label: 'FRAC Competency Profile', icon: Shield },
  { id: 'analytics' as const, label: 'MoSPI Analytics', icon: BarChart3 },
];

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
  onOpenAiModel,
  canGoBack = false,
  previousTabTitle,
  onGoBack,
}: NavbarProps) {
  const { adjustFontScale, fontScale, t, toggleLanguage } = useUiPreferences();
  const [emblemClicks, setEmblemClicks] = useState(0);
  const tabs = isAdminUnlocked || activeTab === 'admin'
    ? [...baseTabs, { id: 'admin' as const, label: 'Admin Command Center', icon: Building2 }]
    : baseTabs;

  const handleEmblemClick = () => {
    const clicks = emblemClicks + 1;
    if (clicks >= 3) {
      setEmblemClicks(0);
      onOpenSecretAdmin?.();
    } else {
      setEmblemClicks(clicks);
    }
  };

  return (
    <header className="portal-nav sticky top-0 bg-white border-b border-slate-200">
      <div className="border-t-[3px] border-[#ae540b]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleEmblemClick}
              aria-label="Government of India National Emblem"
              title="Government of India, MoSPI"
              className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-[#376481]"
            >
              <IndianFlag variant="circular" width={34} height={34} />
            </button>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-bold text-[#172b3a]">StatSkill AI</span>
                <span className="hidden rounded-sm bg-[#eaf0f5] px-1.5 py-0.5 text-[10px] font-semibold text-[#183b56] sm:inline">MoSPI learning workspace</span>
              </div>
              <p className="truncate text-xs text-[#617280]">Mission Karmayogi · Statistical capacity building</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={toggleLanguage} aria-label="Toggle language preference" className="hidden rounded-md px-2 py-1 text-xs font-semibold text-[#183b56] hover:bg-[#eaf0f5] sm:inline-flex">{t('languageToggle')}</button>
            <div className="hidden items-center rounded-md border border-slate-200 sm:flex" role="group" aria-label={`Text size ${Math.round(fontScale * 100)} percent`}>
              <button type="button" aria-label="Decrease text size" disabled={fontScale <= 0.9} onClick={() => adjustFontScale('decrease')} className="px-1.5 py-1 text-xs text-[#183b56] disabled:opacity-40">A−</button>
              <button type="button" aria-label="Reset text size" onClick={() => adjustFontScale('reset')} className="px-1.5 py-1 text-xs text-[#183b56]">A</button>
              <button type="button" aria-label="Increase text size" disabled={fontScale >= 1.4} onClick={() => adjustFontScale('increase')} className="px-1.5 py-1 text-xs text-[#183b56] disabled:opacity-40">A+</button>
            </div>
            {onOpenAiModel && (
              <button
                type="button"
                onClick={onOpenAiModel}
                aria-label="Open AI Engine & Inference Gateway Settings"
                title="AI Engine Gateway"
                className="nav-icon-button flex items-center gap-1 text-[#0B2E63] hover:bg-blue-50"
              >
                <Cpu className="h-4 w-4 text-[#0B2E63]" aria-hidden="true" />
              </button>
            )}
            <button type="button" onClick={onOpenAccessibility} aria-label="Open accessibility settings (Alt+A)" title="Accessibility (Alt+A)" className="nav-icon-button">
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
            {isLoggedIn ? (
              <button type="button" onClick={() => setIsLoggedIn(false)} className="nav-session" aria-label={`Log out ${officerName || 'officer'}`}>
                <span className="hidden max-w-[170px] truncate sm:block">{officerName || officerCadreId || 'Officer session'}</span>
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => onOpenLogin ? onOpenLogin() : setIsLoggedIn(true)} className="nav-session">
                <UserCheck className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('demoSignIn')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-3 md:px-6">
          <nav className="min-w-0 flex-1 overflow-x-auto py-1.5 scrollbar-none" aria-label="Portal navigation">
            <div className="flex w-max gap-1">
              {tabs.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    id={`nav-tab-${id}`}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setActiveTab(id)}
                    className={cn('portal-tab', active && 'portal-tab--active')}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {id === 'home' ? t('publicGateway') : id === 'overview' ? t('officerDashboard') : id === 'dashboard' ? t('assessmentEngine') : id === 'discover' ? t('discoverCatalog') : id === 'competency' ? t('competencyProfile') : id === 'analytics' ? t('analytics') : label}
                  </button>
                );
              })}
            </div>
          </nav>
          {canGoBack && onGoBack && (
            <button type="button" onClick={onGoBack} aria-label={`Back to ${previousTabTitle || 'Previous Menu'}`} className="portal-back">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">{previousTabTitle || 'Back'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
