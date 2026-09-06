import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SiteLanguage = 'en' | 'hi';

const LANGUAGE_STORAGE_KEY = 'statskill_site_language';
const FONT_SCALE_STORAGE_KEY = 'statskill_site_font_scale';
const MIN_FONT_SCALE = 0.9;
const MAX_FONT_SCALE = 1.4;

const translations = {
  en: {
    languageToggle: 'English / हिंदी',
    governmentOfIndia: 'Government of India',
    accessibility: 'Accessibility',
    register: 'Register',
    login: 'Log in (SSO)',
    launchPortal: 'Launch portal',
    about: 'About us',
    newsroom: 'Newsroom',
    career: 'Career',
    tenders: 'Tenders',
    notifications: 'Notifications',
    helpCentre: 'Help centre',
    heroEyebrow: "For India's statistical services",
    heroTitle: 'Build the skills your role calls for.',
    heroDescription: 'Assess your statistical competencies, understand the gaps, and find learning that fits your work.',
    heroContext: 'Role-aligned diagnostics and continuous learning for Indian Statistical Service, Subordinate Statistical Service, and State DES officers.',
    startAssessment: 'Start an assessment',
    exploreCourses: 'Explore courses',
    learningPath: 'Your learning path',
    learningPathTitle: 'From assessment to progress',
    assessCompetencies: 'Assess your competencies',
    assessCompetenciesDescription: 'Choose your cadre and complete a diagnostic in a relevant statistical domain.',
    findLearning: 'Find the right learning',
    findLearningDescription: 'Explore government courses matched to your role and competency gaps.',
    seeProgress: 'See your progress',
    seeProgressDescription: 'Review assessment results and proficiency across your learning domains.',
    publicGateway: 'Public Gateway',
    officerDashboard: 'Officer Dashboard',
    assessmentEngine: 'Assessment Engine',
    discoverCatalog: 'Discover (880+ Catalog)',
    competencyProfile: 'FRAC Competency Profile',
    analytics: 'MoSPI Analytics',
    demoSignIn: 'Demo sign in',
  },
  hi: {
    languageToggle: 'हिंदी / English',
    governmentOfIndia: 'भारत सरकार',
    accessibility: 'सुगम्यता',
    register: 'पंजीकरण',
    login: 'लॉग इन (SSO)',
    launchPortal: 'पोर्टल खोलें',
    about: 'हमारे बारे में',
    newsroom: 'समाचार कक्ष',
    career: 'करियर',
    tenders: 'निविदाएँ',
    notifications: 'सूचनाएँ',
    helpCentre: 'सहायता केंद्र',
    heroEyebrow: 'भारत की सांख्यिकीय सेवाओं के लिए',
    heroTitle: 'अपनी भूमिका के लिए आवश्यक कौशल विकसित करें',
    heroDescription: 'अपनी सांख्यिकीय दक्षताओं का आकलन करें, अंतर समझें और अपने कार्य के अनुरूप सीखने के अवसर खोजें।',
    heroContext: 'भारतीय सांख्यिकी सेवा, अधीनस्थ सांख्यिकी सेवा और राज्य DES अधिकारियों के लिए भूमिका-अनुरूप निदान और सतत अधिगम।',
    startAssessment: 'आकलन शुरू करें',
    exploreCourses: 'पाठ्यक्रम देखें',
    learningPath: 'आपका सीखने का पथ',
    learningPathTitle: 'आकलन से प्रगति तक',
    assessCompetencies: 'अपनी दक्षताओं का आकलन करें',
    assessCompetenciesDescription: 'अपना संवर्ग चुनें और प्रासंगिक सांख्यिकीय क्षेत्र में निदान पूरा करें।',
    findLearning: 'सही सीखने का अवसर खोजें',
    findLearningDescription: 'अपनी भूमिका और दक्षता-अंतर के अनुरूप सरकारी पाठ्यक्रम देखें।',
    seeProgress: 'अपनी प्रगति देखें',
    seeProgressDescription: 'अपने सीखने के क्षेत्रों में आकलन परिणाम और दक्षता की समीक्षा करें।',
    publicGateway: 'सार्वजनिक प्रवेश द्वार',
    officerDashboard: 'अधिकारी डैशबोर्ड',
    assessmentEngine: 'आकलन इंजन',
    discoverCatalog: 'पाठ्यक्रम खोजें (880+)',
    competencyProfile: 'FRAC दक्षता प्रोफ़ाइल',
    analytics: 'MoSPI विश्लेषण',
    demoSignIn: 'डेमो साइन इन',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface UiPreferencesValue {
  language: SiteLanguage;
  toggleLanguage: () => void;
  fontScale: number;
  adjustFontScale: (change: 'increase' | 'decrease' | 'reset') => void;
  t: (key: TranslationKey) => string;
}

const defaultValue: UiPreferencesValue = {
  language: 'en',
  toggleLanguage: () => undefined,
  fontScale: 1,
  adjustFontScale: () => undefined,
  t: (key) => translations.en[key],
};

const UiPreferencesContext = createContext<UiPreferencesValue>(defaultValue);

function readLanguage(): SiteLanguage {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'hi' ? 'hi' : 'en';
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

export function UiPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(readLanguage);
  const [fontScale, setFontScale] = useState(readFontScale);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The language still applies for this session if storage is unavailable.
    }
  }, [language]);

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
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'hi' : 'en'),
    fontScale,
    adjustFontScale: (change) => setFontScale((current) => {
      if (change === 'reset') return 1;
      const delta = change === 'increase' ? 0.1 : -0.1;
      return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, Number((current + delta).toFixed(2))));
    }),
    t: (key) => translations[language][key],
  }), [fontScale, language]);

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
}

export function useUiPreferences() {
  return useContext(UiPreferencesContext);
}
