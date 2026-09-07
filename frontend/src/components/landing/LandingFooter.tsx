import React from 'react';
import { IndianFlag } from '../ui/IndianFlag';
import { InfoModalType } from './LandingInfoModal';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

export function LandingFooter({
  onOpenInfo,
}: {
  onOpenInfo?: (type: InfoModalType) => void;
}) {
  const { t } = useUiPreferences();

  const COLUMNS = [
    {
      heading: t('footerColQuickLinks'),
      items: [
        { label: t('footerAbout'), modalKey: 'about' as const },
        { label: t('footerNewsroom'), modalKey: 'newsroom' as const },
        { label: t('footerHelp'), modalKey: 'help' as const },
        { label: t('footerTenders'), modalKey: 'tenders' as const },
        { label: t('footerRti'), href: 'https://rti.gov.in' },
      ],
    },
    {
      heading: t('footerColCadres'),
      items: [
        { label: t('footerCareer'), modalKey: 'career' as const },
        { label: t('footerGazette'), modalKey: 'notifications' as const },
        { label: t('footerNssta'), href: 'https://mospi.gov.in/training' },
        { label: t('footerCapi'), href: 'https://mospi.gov.in/surveys' },
        { label: t('footerNodal'), href: 'https://mospi.gov.in/whos-who' },
      ],
    },
    {
      heading: t('footerColMission'),
      items: [
        { label: t('footerKarmayogi'), href: 'https://karmayogibharat.gov.in' },
        { label: t('footerMospi'), href: 'https://mospi.gov.in' },
        { label: t('footerCbc'), href: 'https://cbc.gov.in' },
        { label: t('footerDopt'), href: 'https://dopt.gov.in' },
        { label: t('footerPrivacy'), href: 'https://www.meity.gov.in/national-data-governance-framework-policy' },
      ],
    },
  ];

  return (
    <footer className="bg-[#081F42] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full overflow-hidden border border-amber-400">
                <IndianFlag variant="circular" width={40} height={40} />
              </span>
              <div className="leading-tight">
                <span className="block text-lg font-bold text-white">
                  StatSkill AI
                </span>
                <span className="block text-xs text-amber-400 font-mono">
                  {t('footerBrandTagline')}
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
              {t('footerDescription')}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {'modalKey' in item && item.modalKey && onOpenInfo ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (item.modalKey) onOpenInfo(item.modalKey);
                        }}
                        className="text-left text-sm text-slate-300 transition hover:text-amber-400 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href || '#'}
                        target={item.href?.startsWith('http') ? '_blank' : undefined}
                        rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-sm text-slate-300 transition hover:text-amber-400"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row">
          <p>{t('footerCopyright')}</p>
          <p>{t('footerA11yDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
