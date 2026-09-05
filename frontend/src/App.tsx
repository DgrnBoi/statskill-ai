import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoginPage, { DemoOfficer } from './pages/LoginPage';
import { PortalTab } from './components/layout/Navbar';
import { AccessibilityModal, AccessibilitySettings, DEFAULT_ACCESSIBILITY_SETTINGS } from './components/ui/AccessibilityModal';
import { KarmayogiSahayakModal } from './components/ui/KarmayogiSahayakModal';
import { SecretAdminGatewayModal } from './components/admin/SecretAdminGatewayModal';

interface AppRouteState {
  isLogin: boolean;
  tab: PortalTab;
}

function parseRoute(pathname: string): AppRouteState {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (normalized === '/login') {
    return { isLogin: true, tab: 'dashboard' };
  }
  if (normalized === '/' || normalized === '/home') {
    return { isLogin: false, tab: 'home' };
  }
  if (normalized === '/overview') {
    return { isLogin: false, tab: 'overview' };
  }
  if (normalized === '/assessment' || normalized === '/dashboard') {
    return { isLogin: false, tab: 'dashboard' };
  }
  if (normalized === '/admin') {
    return { isLogin: false, tab: 'admin' };
  }
  if (normalized === '/discover') {
    return { isLogin: false, tab: 'discover' };
  }
  if (normalized === '/competency') {
    return { isLogin: false, tab: 'competency' };
  }
  if (normalized === '/analytics') {
    return { isLogin: false, tab: 'analytics' };
  }
  return { isLogin: false, tab: 'home' };
}

function App() {
  const [route, setRoute] = useState<AppRouteState>(() => parseRoute(window.location.pathname));
  const [initialCourseTopic, setInitialCourseTopic] = useState<string | null>(null);

  // Modals for Public Gateway mode
  const [isSahayakOpen, setIsSahayakOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);

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
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = useCallback((newTab: PortalTab) => {
    const path = newTab === 'home' ? '/' : `/${newTab}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute({ isLogin: false, tab: newTab });
  }, []);

  const handleOpenLogin = useCallback(() => {
    if (window.location.pathname !== '/login') {
      window.history.pushState({}, '', '/login');
    }
    setRoute((prev) => ({ ...prev, isLogin: true }));
  }, []);

  const handleBackFromLogin = useCallback(() => {
    window.history.pushState({}, '', '/');
    setRoute({ isLogin: false, tab: 'home' });
  }, []);

  const handleDemoLogin = useCallback((officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => {
    try {
      window.localStorage.setItem('statskill_demo_login', JSON.stringify({ officer, method }));
    } catch {}
    window.history.pushState({}, '', '/overview');
    setRoute({ isLogin: false, tab: 'overview' });
  }, []);

  // Global keyboard shortcuts (Alt+A for accessibility, Alt+H for sahayak, Ctrl+Shift+A for secret admin)
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

        {/* Global Modals active on Public Gateway Landing Page */}
        {route.tab === 'home' && !route.isLogin && (
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
                handleTabChange('admin');
              }}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
