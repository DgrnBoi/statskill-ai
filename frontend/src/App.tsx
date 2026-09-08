import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoOfficer } from './pages/LoginPage';
import { AccessibilityModal, AccessibilitySettings, DEFAULT_ACCESSIBILITY_SETTINGS } from './components/ui/AccessibilityModal';
import { KarmayogiSahayakModal } from './components/ui/KarmayogiSahayakModal';
import { SecretAdminGatewayModal } from './components/admin/SecretAdminGatewayModal';
import { OfflineStatusBar } from './components/ui/OfflineStatusBar';
import { OnboardingModal, hasCompletedOnboarding } from './components/ui/OnboardingModal';
import { PwaInstallPrompt } from './components/ui/PwaInstallPrompt';
import { UiPreferencesProvider, useUiPreferences } from './contexts/UiPreferencesContext';
import { AppRouteState, navigateTo, parseRoute, PortalTab } from './lib/routing';
import { apiUrl } from './lib/api';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

function AppContent() {
  const { language, t } = useUiPreferences();
  const [route, setRoute] = useState<AppRouteState>(() => parseRoute(window.location.pathname));
  const [initialCourseTopic, setInitialCourseTopic] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasCompletedOnboarding() && parseRoute(window.location.pathname).tab === 'home' && !parseRoute(window.location.pathname).isLogin);

  const [isSahayakOpen, setIsSahayakOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(true);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = window.localStorage.getItem('statskill_accessibility');
      if (saved) return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const updateAccessibilitySettings = useCallback((newPartial: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        window.localStorage.setItem('statskill_accessibility', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetAccessibilitySettings = useCallback(() => {
    setAccessibilitySettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    try {
      window.localStorage.setItem('statskill_accessibility', JSON.stringify(DEFAULT_ACCESSIBILITY_SETTINGS));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.classList.remove('a11y-contrast-dark', 'a11y-contrast-invert', 'a11y-contrast-light');
    if (accessibilitySettings.contrastMode === 'dark' || (accessibilitySettings.highContrast && accessibilitySettings.contrastMode === 'normal')) {
      root.classList.add('a11y-contrast-dark');
    } else if (accessibilitySettings.contrastMode === 'invert') {
      root.classList.add('a11y-contrast-invert');
    }

    root.classList.remove('a11y-sat-low', 'a11y-sat-high', 'a11y-sat-mono');
    if (accessibilitySettings.saturation && accessibilitySettings.saturation !== 'normal') {
      root.classList.add(`a11y-sat-${accessibilitySettings.saturation}`);
    }

    if (accessibilitySettings.highlightLinks) {
      root.classList.add('a11y-highlight-links');
    } else {
      root.classList.remove('a11y-highlight-links');
    }

    root.classList.remove('a11y-spacing-light', 'a11y-spacing-moderate', 'a11y-spacing-heavy');
    if (accessibilitySettings.textSpacing && accessibilitySettings.textSpacing !== 'normal') {
      root.classList.add(`a11y-spacing-${accessibilitySettings.textSpacing}`);
    }

    if (accessibilitySettings.pauseAnimations || accessibilitySettings.reducedMotion) {
      root.classList.add('a11y-pause-animations');
    } else {
      root.classList.remove('a11y-pause-animations');
    }

    if (accessibilitySettings.hideImages) {
      root.classList.add('a11y-hide-images');
    } else {
      root.classList.remove('a11y-hide-images');
    }

    if (accessibilitySettings.dyslexiaFriendly) {
      root.classList.add('a11y-dyslexic');
    } else {
      root.classList.remove('a11y-dyslexic');
    }

    root.classList.remove('a11y-cursor-black', 'a11y-cursor-white');
    if (accessibilitySettings.cursorMode && accessibilitySettings.cursorMode !== 'normal') {
      root.classList.add(`a11y-cursor-${accessibilitySettings.cursorMode}`);
    }

    root.classList.remove('a11y-lh-18', 'a11y-lh-22');
    if (accessibilitySettings.lineHeight === 'medium') {
      root.classList.add('a11y-lh-18');
    } else if (accessibilitySettings.lineHeight === 'relaxed') {
      root.classList.add('a11y-lh-22');
    }

    root.classList.remove('a11y-align-left', 'a11y-align-center', 'a11y-align-justify');
    if (accessibilitySettings.textAlign && accessibilitySettings.textAlign !== 'normal') {
      root.classList.add(`a11y-align-${accessibilitySettings.textAlign}`);
    }

    const scale = accessibilitySettings.biggerText || accessibilitySettings.textScale;
    if (scale === 'medium' || scale === 'large') {
      root.style.fontSize = '112.5%';
    } else if (scale === 'xlarge') {
      root.style.fontSize = '125%';
    } else {
      root.style.fontSize = '';
    }
  }, [accessibilitySettings]);

  const syncRouteFromUrl = useCallback(() => {
    const parsed = parseRoute(window.location.pathname);
    if (parsed.isUnknown) {
      navigateTo({ tab: 'home', locale: parsed.locale, replace: true });
      setRoute({ ...parsed, isUnknown: false, tab: 'home' });
      return;
    }
    setRoute(parsed);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, [syncRouteFromUrl]);



  const handleTabChange = useCallback((newTab: PortalTab) => {
    navigateTo({ tab: newTab, locale: language });
    setRoute({ locale: language, isLogin: false, tab: newTab, isUnknown: false });
  }, [language]);

  const handleOpenLogin = useCallback(() => {
    navigateTo({ tab: 'home', locale: language, isLogin: true });
    setRoute({ locale: language, isLogin: true, tab: 'dashboard', isUnknown: false });
  }, [language]);

  const handleBackFromLogin = useCallback(() => {
    navigateTo({ tab: 'home', locale: language });
    setRoute({ locale: language, isLogin: false, tab: 'home', isUnknown: false });
  }, [language]);

  const handleDemoLogin = useCallback(async (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => {
    try {
      const response = await fetch(apiUrl('/api/auth/demo-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: officer.id, method }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.token) {
        window.localStorage.setItem('auth_token', data.token);
      }
    } catch {}

    try {
      window.localStorage.setItem('statskill_demo_login', JSON.stringify({ officer, method }));
    } catch {}

    navigateTo({ tab: 'overview', locale: language });
    setRoute({ locale: language, isLogin: false, tab: 'overview', isUnknown: false });
  }, [language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretAdminOpen(true);
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAccessibilityOpen((prev) => !prev);
      }
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setIsSahayakOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSahayakOpen(false);
        setIsAccessibilityOpen(false);
        setIsSecretAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-slate-50">
        <a href="#main-content" className="skip-link">{t('skipToMain')}</a>
        <OfflineStatusBar />
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('loadingModule')}</p>
            </div>
          }
        >
          {route.isLogin ? (
            <LoginPage
              onAuthenticate={handleDemoLogin}
              onBack={handleBackFromLogin}
            />
          ) : route.tab === 'home' ? (
            <LandingPage
              onLaunchAssessment={(courseTopic) => {
                if (courseTopic) {
                  setInitialCourseTopic(courseTopic);
                }
                handleTabChange('dashboard');
              }}
              onExploreCourses={() => handleTabChange('discover')}
              onOpenDashboard={() => handleTabChange('overview')}
              onOpenLogin={handleOpenLogin}
              onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
              onOpenAccessibility={() => setIsAccessibilityOpen(true)}
              onOpenSahayak={() => setIsSahayakOpen(true)}
            />
          ) : (
            <Dashboard
              activeTab={route.tab}
              onTabChange={handleTabChange}
              onOpenLogin={handleOpenLogin}
              initialCourseTopic={initialCourseTopic}
            />
          )}
        </Suspense>

        {showOnboarding && route.tab === 'home' && !route.isLogin && (
          <OnboardingModal
            onDismiss={() => setShowOnboarding(false)}
            onGetStarted={() => {
              setShowOnboarding(false);
              handleTabChange('dashboard');
            }}
            onSignIn={() => {
              setShowOnboarding(false);
              handleOpenLogin();
            }}
          />
        )}

        <AccessibilityModal
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
          settings={accessibilitySettings}
          onUpdateSettings={updateAccessibilitySettings}
          onResetSettings={resetAccessibilitySettings}
        />

        <KarmayogiSahayakModal
          isOpen={isSahayakOpen}
          onClose={() => setIsSahayakOpen(false)}
          onNavigateTab={(tab) => {
            handleTabChange(tab);
          }}
          onOpenLogin={handleOpenLogin}
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
        />

        <SecretAdminGatewayModal
          isOpen={isSecretAdminOpen}
          onClose={() => setIsSecretAdminOpen(false)}
          onUnlockAdmin={() => {
            setIsAdminUnlocked(true);
            try { window.sessionStorage.setItem('statskill_admin_unlocked', 'true'); } catch {}
            handleTabChange('admin');
          }}
        />

        <PwaInstallPrompt />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <UiPreferencesProvider>
      <AppContent />
    </UiPreferencesProvider>
  );
}

export default App;
