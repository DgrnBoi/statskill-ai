'use client'

import { LotusMark } from './emblems'
import { SOCIAL_LINKS as SOCIALS } from './social-icons'
import type { InfoModalType } from './info-modal'

export function SiteFooter({
  onOpenInfo,
}: {
  onOpenInfo?: (type: InfoModalType) => void
}) {
  const COLUMNS = [
    {
      heading: 'Quick Links',
      items: [
        { label: 'About StatSkill AI', modalKey: 'about' as const },
        { label: 'MoSPI Newsroom', modalKey: 'newsroom' as const },
        { label: 'Help Centre & Helpline', modalKey: 'help' as const },
        { label: 'Active Tenders (CPPP)', modalKey: 'tenders' as const },
        { label: 'Right to Information (RTI)', href: '#' },
      ],
    },
    {
      heading: 'Statistical Cadres',
      items: [
        { label: 'ISS & SSS Career Pathways', modalKey: 'career' as const },
        { label: 'Gazette Notifications', modalKey: 'notifications' as const },
        { label: 'NSSTA Training Calendar', href: '#' },
        { label: 'CAPI Field Protocols', href: '#' },
        { label: 'Nodal Officers Directory', href: '#' },
      ],
    },
    {
      heading: 'The Mission',
      items: [
        { label: 'Mission Karmayogi (NPCSCB)', href: 'https://karmayogibharat.gov.in' },
        { label: 'Ministry of Statistics (MoSPI)', href: 'https://mospi.gov.in' },
        { label: 'Capacity Building Commission', href: 'https://cbc.gov.in' },
        { label: 'Department of Personnel & Training', href: 'https://dopt.gov.in' },
        { label: 'Privacy & Data Governance Policy', href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-slate-deep text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-gold">
                <LotusMark className="h-7 w-7" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold text-white">
                  StatSkill AI
                </span>
                <span className="block text-xs text-amber-300 font-mono">
                  MoSPI Sovereign Node · Mission Karmayogi
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              The sovereign capacity-building node for India's Official Statistical System — empowering
              civil servants for a Viksit Bharat with precision AI diagnostics and role-aligned FRAC competencies.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-gold hover:text-slate-deep"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {'modalKey' in item && onOpenInfo ? (
                      <button
                        type="button"
                        onClick={() => onOpenInfo(item.modalKey)}
                        className="text-left text-sm text-white/60 transition hover:text-gold cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target={item.href?.startsWith('http') ? '_blank' : undefined}
                        rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-sm text-white/60 transition hover:text-gold"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; Copyright 2026-2027 StatSkill AI • Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
          </p>
          <p>Compliant with GIGW 3.0 &amp; WCAG 2.2 AAA Accessibility Standards</p>
        </div>
      </div>
    </footer>
  )
}
