import type { SiteLanguage } from '../i18n/translations';

export type PortalTab = 'home' | 'overview' | 'dashboard' | 'discover' | 'competency' | 'analytics' | 'admin';

export interface AppRouteState {
  locale: SiteLanguage;
  isLogin: boolean;
  tab: PortalTab;
  isUnknown: boolean;
}

const TAB_PATHS: Record<Exclude<PortalTab, 'home'>, string> = {
  overview: '/overview',
  dashboard: '/dashboard',
  discover: '/discover',
  competency: '/competency',
  analytics: '/analytics',
  admin: '/admin',
};

const PATH_TO_TAB: Record<string, PortalTab> = {
  '/': 'home',
  '/home': 'home',
  '/overview': 'overview',
  '/dashboard': 'dashboard',
  '/assessment': 'dashboard',
  '/discover': 'discover',
  '/competency': 'competency',
  '/analytics': 'analytics',
  '/admin': 'admin',
};

function stripLocalePrefix(pathname: string): { locale: SiteLanguage; path: string } {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const lower = normalized.toLowerCase();

  if (lower === '/hi' || lower.startsWith('/hi/')) {
    const stripped = lower.slice(3) || '/';
    return { locale: 'hi', path: stripped };
  }

  return { locale: 'en', path: lower };
}

export function parseRoute(pathname: string): AppRouteState {
  const { locale, path } = stripLocalePrefix(pathname);

  if (path === '/login') {
    return { locale, isLogin: true, tab: 'dashboard', isUnknown: false };
  }

  const tab = PATH_TO_TAB[path];
  if (tab) {
    return { locale, isLogin: false, tab, isUnknown: false };
  }

  return { locale, isLogin: false, tab: 'home', isUnknown: true };
}

export function buildPath(options: {
  tab: PortalTab;
  locale: SiteLanguage;
  isLogin?: boolean;
}): string {
  const { tab, locale, isLogin = false } = options;
  const prefix = locale === 'hi' ? '/hi' : '';

  if (isLogin) {
    return `${prefix}/login`;
  }

  if (tab === 'home') {
    return prefix || '/';
  }

  const tabPath = TAB_PATHS[tab];
  return `${prefix}${tabPath}`;
}

export function navigateTo(
  options: {
    tab: PortalTab;
    locale: SiteLanguage;
    isLogin?: boolean;
    replace?: boolean;
  },
): string {
  const path = buildPath(options);
  const current = window.location.pathname;

  if (current !== path) {
    if (options.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
  }

  return path;
}
