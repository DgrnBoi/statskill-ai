import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, type SiteLanguage, type TranslationKey } from '../i18n/translations';
import { buildPath, parseRoute } from '../lib/routing';

export type { SiteLanguage, TranslationKey };

const LANGUAGE_STORAGE_KEY = 'statskill_site_language';
const FONT_SCALE_STORAGE_KEY = 'statskill_site_font_scale';
const MIN_FONT_SCALE = 0.9;
const MAX_FONT_SCALE = 1.4;

interface UiPreferencesValue {
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  toggleLanguage: () => void;
  fontScale: number;
  adjustFontScale: (change: 'increase' | 'decrease' | 'reset') => void;
  t: (key: TranslationKey) => string;
}

const defaultValue: UiPreferencesValue = {
  language: 'en',
  setLanguage: () => undefined,
  toggleLanguage: () => undefined,
  fontScale: 1,
  adjustFontScale: () => undefined,
  t: (key) => translations.en[key],
};

const UiPreferencesContext = createContext<UiPreferencesValue>(defaultValue);

function readLanguage(): SiteLanguage {
  try {
    const fromUrl = parseRoute(window.location.pathname).locale;
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'hi' || stored === 'en') return stored;
    return fromUrl;
  } catch {
    return 'en';
  }
}

function readFontScale(): number {
  try {
    const savedScale = Number(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY));
    if (Number.isFinite(savedScale) && savedScale >= MIN_FONT_SCALE && savedScale <= MAX_FONT_SCALE) {
      return savedScale;
    }
  } catch {
    // Fall back to the default scale when browser storage is unavailable.
  }
  return 1;
}

function syncLanguageToUrl(lang: SiteLanguage) {
  const route = parseRoute(window.location.pathname);
  const newPath = buildPath({ tab: route.isLogin ? 'home' : route.tab, locale: lang, isLogin: route.isLogin });
  if (window.location.pathname !== newPath) {
    window.history.replaceState({}, '', newPath);
  }
}

export function UiPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>(readLanguage);
  const [fontScale, setFontScale] = useState(readFontScale);

  const setLanguage = useCallback((lang: SiteLanguage) => {
    setLanguageState(lang);
    syncLanguageToUrl(lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The language still applies for this session if storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname);
      setLanguageState(route.locale);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = fontScale === 1 ? '' : `${Math.round(fontScale * 100)}%`;
    try {
      window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScale));
    } catch {
      // The selected scale still applies for this session if storage is unavailable.
    }
  }, [fontScale]);

  const value = useMemo<UiPreferencesValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'en' ? 'hi' : 'en'),
    fontScale,
    adjustFontScale: (change) => setFontScale((current) => {
      if (change === 'reset') return 1;
      const delta = change === 'increase' ? 0.1 : -0.1;
      return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, Number((current + delta).toFixed(2))));
    }),
    t: (key) => translations[language][key],
  }), [fontScale, language, setLanguage]);

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
}

export function useUiPreferences() {
  return useContext(UiPreferencesContext);
}
