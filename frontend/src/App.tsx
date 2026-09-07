import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DemoOfficer } from './pages/LoginPage';
import { AccessibilityModal, AccessibilitySettings, DEFAULT_ACCESSIBILITY_SETTINGS } from './components/ui/AccessibilityModal';
import { KarmayogiSahayakModal } from './components/ui/KarmayogiSahayakModal';
import { SecretAdminGatewayModal } from './components/admin/SecretAdminGatewayModal';
import { OfflineStatusBar } from './components/ui/OfflineStatusBar';
import { OnboardingModal, hasCompletedOnboarding } from './components/ui/OnboardingModal';
import { UiPreferencesProvider, useUiPreferences } from './contexts/UiPreferencesContext';
import { AppRouteState, navigateTo, parseRoute, PortalTab } from './lib/routing';

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
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    try { return window.sessionStorage.getItem('statskill_admin_unlocked') === 'true'; } catch { return false; }
  });

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

  useEffect(() => {
    if (route.tab !== 'admin' || isAdminUnlocked) return;
    navigateTo({ tab: 'home', locale: language, replace: true });
    setRoute({ locale: language, isLogin: false, tab: 'home', isUnknown: false });
  }, [isAdminUnlocked, language, route.tab]);

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
    const response = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId: officer.id, method }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.token) {
      throw new Error(data?.error || t('demoAuthUnavailable'));
    }
    window.localStorage.setItem('auth_token', data.token);

    try {
      window.localStorage.setItem('statskill_demo_login', JSON.stringify({ officer, method }));
    } catch {}
    navigateTo({ tab: 'overview', locale: language });
    setRoute({ locale: language, isLogin: false, tab: 'overview', isUnknown: false });
  }, [language, t]);

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

        {!route.isLogin && route.tab === 'home' && (
          <>
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
          </>
        )}
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
