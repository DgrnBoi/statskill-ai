import React, { useState } from 'react';
import { ArrowRight, BookOpen, Cpu, Globe, Sparkles, UserCheck, X } from 'lucide-react';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';
import { Button } from './Button';

const ONBOARDING_KEY = 'statskill_onboarding_complete';

interface OnboardingModalProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onDismiss: () => void;
}

export function hasCompletedOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markOnboardingComplete() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {
    // Session-only completion if storage unavailable.
  }
}

export function OnboardingModal({ onGetStarted, onSignIn, onDismiss }: OnboardingModalProps) {
  const { language, setLanguage, t } = useUiPreferences();
  const [step, setStep] = useState(0);
  const dialogRef = useDialogAccessibility(true, () => finish(true));

  const finish = (skipped = false) => {
    markOnboardingComplete();
    onDismiss();
    if (!skipped && step === 2) {
      onGetStarted();
    }
  };

  const steps = [
    {
      icon: Sparkles,
      title: t('onboardingWelcomeTitle'),
      description: t('onboardingWelcomeDesc'),
    },
    {
      icon: Globe,
      title: t('onboardingLanguageTitle'),
      description: t('onboardingLanguageDesc'),
    },
    {
      icon: BookOpen,
      title: t('onboardingFeaturesTitle'),
      description: null,
      features: [
        t('onboardingFeature1'),
        t('onboardingFeature2'),
        t('onboardingFeature3'),
        t('onboardingFeature4'),
      ],
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${i === step ? 'bg-[#0B2E63]' : i < step ? 'bg-amber-400' : 'bg-slate-200'}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => finish(true)}
            aria-label={t('onboardingSkip')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2E63]/10 text-[#0B2E63]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="onboarding-title" className="text-lg font-bold text-slate-900">{current.title}</h2>
          {current.description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.description}</p>
          )}

          {step === 1 && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${language === 'en' ? 'border-[#0B2E63] bg-[#0B2E63]/5 text-[#0B2E63]' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
              >
                {t('onboardingEnglish')}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${language === 'hi' ? 'border-[#0B2E63] bg-[#0B2E63]/5 text-[#0B2E63]' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
              >
                {t('onboardingHindi')}
              </button>
            </div>
          )}

          {step === 2 && current.features && (
            <ul className="mt-4 space-y-2.5">
              {current.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-4">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
              {t('onboardingBack')}
            </Button>
          ) : (
            <button type="button" onClick={() => finish(true)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
              {t('onboardingSkip')}
            </button>
          )}

          <div className="flex gap-2">
            {step === 2 && (
              <Button variant="outline" size="sm" onClick={() => { markOnboardingComplete(); onDismiss(); onSignIn(); }}>
                <UserCheck className="h-4 w-4" aria-hidden="true" />
                {t('onboardingSignIn')}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                if (step < 2) {
                  setStep((s) => s + 1);
                } else {
                  markOnboardingComplete();
                  onDismiss();
                  onGetStarted();
                }
              }}
            >
              {step < 2 ? t('onboardingNext') : t('onboardingGetStarted')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
