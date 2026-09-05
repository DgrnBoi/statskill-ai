# Python Builder Script for StatSkill AI Landing Page
import os

BASE_DIR = r"C:\Users\Eshaan Sunthankar\Documents\SIH\statskill-ai\landing pg"
COMPONENTS_DIR = os.path.join(BASE_DIR, "components")

FILES = {}

# 1. components/info-modal.tsx
FILES["components/info-modal.tsx"] = """'use client'

import React from 'react'
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  Newspaper,
  Phone,
  Shield,
  Sparkles,
} from 'lucide-react'
import { ModalShell } from './modal-shell'

export type InfoModalType =
  | 'about'
  | 'newsroom'
  | 'career'
  | 'tenders'
  | 'notifications'
  | 'help'
  | null

interface InfoModalProps {
  type: InfoModalType
  onClose: () => void
  onLaunchPortal?: () => void
}

export function InfoModal({ type, onClose, onLaunchPortal }: InfoModalProps) {
  if (!type) return null

  const modalConfig: Record<
    NonNullable<InfoModalType>,
    {
      title: string
      subtitle: string
      icon: React.ComponentType<{ className?: string }>
      content: React.ReactNode
    }
  > = {
    about: {
      title: 'About StatSkill AI & MoSPI Mandate',
      subtitle: 'National Statistical Systems Training Academy (NSSTA) Sovereign Node',
      icon: Building2,
      content: (
        <div className="space-y-4 text-sm text-neutral-700">
          <div className="rounded-xl border border-navy/20 bg-navy-100 p-4">
            <h4 className="font-display font-bold text-navy flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-gold" />
              Sovereign Capacity Building Mission
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-800">
              StatSkill AI is the specialized artificial intelligence and competency diagnostic
              engine created under Mission Karmayogi (NPCSCB) for the Ministry of Statistics and
              Programme Implementation (MoSPI), Government of India.
            </p>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
              Key Strategic Objectives
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald mt-0.5" />
                <span>
                  <strong>Rule to Role Transition:</strong> Shift training from generic tenure-based
                  courses to precision role-aligned FRAC competencies for ISS, SSS, and State DES cadres.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald mt-0.5" />
                <span>
                  <strong>AI-Powered Diagnostics:</strong> Dynamic adaptive assessment engine with
                  automated offline question set cycling (Sets A, B, C, D) and anti-spam verification.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald mt-0.5" />
                <span>
                  <strong>CAPI &amp; Digital Field Standards:</strong> Continuous skill upgrading for Computer
                  Assisted Personal Interviewing (CAPI) enumerators and supervisory inspectors across NSSO.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-muted p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald mt-0.5" />
                <span>
                  <strong>xAPI Telemetry &amp; Governance:</strong> Real-time competency auditing complying
                  with the Digital Personal Data Protection (DPDP) Act 2023.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-3.5 text-xs">
            <p className="font-semibold text-navy">Headquarters &amp; Institutional Partners:</p>
            <p className="mt-1 text-muted-foreground">
              National Statistical Systems Training Academy (NSSTA), Plot No. 22, Knowledge Park-II,
              Greater Noida, Uttar Pradesh 201310. In technical collaboration with the Capacity Building
              Commission (CBC) and Karmayogi Bharat.
            </p>
          </div>
        </div>
      ),
    },

    newsroom: {
      title: 'MoSPI & Statistical Newsroom',
      subtitle: 'Official Press Releases, Survey Updates & Gazette Notifications',
      icon: Newspaper,
      content: (
        <div className="space-y-3.5 text-sm">
          {[
            {
              date: 'September 04, 2026',
              tag: 'Survey Release',
              title: 'MoSPI Releases Periodic Labour Force Survey (PLFS) Annual Report 2025-26',
              summary:
                'Key labour market indicators across rural and urban India showing positive trends in female workforce participation and formalisation.',
            },
            {
              date: 'August 28, 2026',
              tag: 'Capacity Building',
              title: 'NSSTA Launches 12 New Specialized E-Learning Modules on SUT Balancing',
              summary:
                'National Accounts Division collaborates with NSSTA to roll out comprehensive training on Supply-Use Tables and GDP deflators on StatSkill AI.',
            },
            {
              date: 'August 15, 2026',
              tag: 'Milestone',
              title: 'StatSkill AI Platform Surpasses 5,000 Verified Cadre Assessments',
              summary:
                'Statistical officers across 36 States/UTs successfully benchmarked their domain proficiencies against the revised FRAC framework.',
            },
            {
              date: 'August 02, 2026',
              tag: 'Data Innovation',
              title: 'DIID MoSPI Implements Real-Time CAPI Paradata Quality Telemetry',
              summary:
                'Automated telemetry protocols reduce field enumeration outliers by 42% across nationwide sample survey clusters.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-border bg-card p-3.5 transition hover:border-navy/40 hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded bg-navy-100 px-2 py-0.5 font-semibold text-navy">
                  {item.tag}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
              </div>
              <h4 className="mt-2 font-display text-sm font-semibold text-navy group-hover:text-navy-500">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      ),
    },

    career: {
      title: 'Statistical Cadre Career Pathways',
      subtitle: 'Indian Statistical Service (ISS), Subordinate Statistical Service (SSS) & Technical Analysts',
      icon: Briefcase,
      content: (
        <div className="space-y-4 text-sm text-neutral-700">
          <p className="text-xs leading-relaxed">
            Explore career advancement opportunities, promotional competency pathways, and lateral
            deputations across India\\'s statistical system.
          </p>

          <div className="space-y-3">
            {[
              {
                cadre: 'Indian Statistical Service (ISS)',
                grades: 'JTS / STS / JAG / SAG / HAG',
                selection: 'UPSC Indian Statistical Service Examination (Annual)',
                competencies: 'Advanced Econometrics, Macroeconomic Aggregates, Policy Formulation',
              },
              {
                cadre: 'Subordinate Statistical Service (SSS)',
                grades: 'Junior Statistical Officer (JSO) & Senior Statistical Officer (SSO)',
                selection: 'Staff Selection Commission (SSC CGL Tier-II Statistics)',
                competencies: 'CAPI Field Protocols, NSS Sampling, Data Processing in R/Python',
              },
              {
                cadre: 'Data Informatics & Innovation Division (DIID)',
                grades: 'Young Professionals, Data Analysts, AI/ML Specialists',
                selection: 'Direct MoSPI Competitive Merit Selection',
                competencies: 'Big Data Architecture, Web Scraping, Microdata Anonymisation',
              },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/60 p-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-navy text-sm">{c.cadre}</h4>
                  <span className="text-[11px] font-mono font-medium text-saffron bg-saffron-light/80 px-2 py-0.5 rounded">
                    {c.grades}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-neutral-800">
                  <strong>Entry Gateway:</strong> {c.selection}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <strong>Core FRAC Competencies:</strong> {c.competencies}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-navy/20 bg-navy-100 p-3 flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-semibold text-navy">Annual Capacity Building Plan (ACBP 2026-27)</p>
              <p className="text-muted-foreground">Take the baseline diagnostic to unlock cadre promotion credits.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onLaunchPortal) onLaunchPortal()
              }}
              className="shrink-0 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700 transition"
            >
              Take Assessment
            </button>
          </div>
        </div>
      ),
    },

    tenders: {
      title: 'Active MoSPI Tenders & Procurement',
      subtitle: 'Central Public Procurement Portal (CPPP) & GeM Notices',
      icon: FileText,
      content: (
        <div className="space-y-3.5 text-sm">
          {[
            {
              id: 'MoSPI/DIID/2026/RFP-08',
              title: 'Supply and Maintenance of High-Security CAPI Tablet Terminals with Biometric 2FA',
              value: '₹ 14.80 Crore',
              closing: 'September 28, 2026 (15:00 IST)',
              status: 'Active · Bid Submission Open',
            },
            {
              id: 'NSSTA/EST-2026/EOI-04',
              title: 'Empanelment of Academic Institutions for Specialized Masterclasses in Machine Learning for Official Statistics',
              value: '₹ 2.40 Crore',
              closing: 'October 12, 2026 (17:00 IST)',
              status: 'Active · EOI Under Review',
            },
            {
              id: 'MoSPI/NAD/2026/CONS-02',
              title: 'Consultancy Services for Satellite Accounts Integration & Environmental Economic Accounting (SEEA)',
              value: '₹ 3.15 Crore',
              closing: 'October 05, 2026 (14:00 IST)',
              status: 'Active · Technical Evaluation',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-semibold text-navy">{t.id}</span>
                <span className="rounded-full bg-emerald/10 px-2 py-0.5 font-medium text-emerald text-[11px]">
                  {t.status}
                </span>
              </div>
              <h4 className="font-display font-semibold text-neutral-900 text-sm">{t.title}</h4>
              <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border">
                <span>Estimated Value: <strong className="text-navy">{t.value}</strong></span>
                <span className="font-mono text-[11px]">Due: {t.closing}</span>
              </div>
            </div>
          ))}
          <p className="text-center text-[11px] text-muted-foreground pt-1">
            For tender document downloads and digital bidding, visit{' '}
            <a
              href="https://eprocure.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-saffron font-medium hover:underline inline-flex items-center gap-0.5"
            >
              eprocure.gov.in <ExternalLink className="h-3 w-3 inline" />
            </a>
          </p>
        </div>
      ),
    },

    notifications: {
      title: 'Gazette Notifications & Circulars',
      subtitle: 'Official Administrative Circulars, ACBP Directives & Examination Schedules',
      icon: Bell,
      content: (
        <div className="space-y-3 text-sm">
          {[
            {
              num: 'No. 12016/04/2026-ISS',
              date: '02 Sep 2026',
              title: 'Mandatory Completion of 40 Hours Annual Capacity Building on StatSkill AI for ISS Officers',
              type: 'Office Memorandum',
            },
            {
              num: 'No. A-32013/02/2026-SSS',
              date: '27 Aug 2026',
              title: 'Schedule for 79th Round NSS Orientation & CAPI Practical Workshops at NSSTA Greater Noida',
              type: 'Training Circular',
            },
            {
              num: 'No. C-18018/01/2026-DIID',
              date: '19 Aug 2026',
              title: 'Updated Cybersecurity Protocols & Data Handling Guidelines for Unit Level Survey Microdata',
              type: 'Advisory Note',
            },
            {
              num: 'No. 11024/09/2026-NSSTA',
              date: '10 Aug 2026',
              title: 'Calendar of National & International Training Programmes for Q3/Q4 FY 2026-27',
              type: 'Gazette Notice',
            },
          ].map((n, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card p-3 text-xs space-y-1 hover:border-navy/30 transition"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-muted-foreground">{n.num}</span>
                <span className="font-medium text-saffron bg-saffron-light/60 px-2 py-0.2 rounded">
                  {n.type}
                </span>
              </div>
              <h4 className="font-display font-semibold text-navy text-sm leading-snug">{n.title}</h4>
              <p className="text-[11px] text-muted-foreground">Issued on: {n.date}</p>
            </div>
          ))}
        </div>
      ),
    },

    help: {
      title: 'StatSkill Support & Help Centre',
      subtitle: '24x7 Sovereign Technical Assistance, Jan Parichay SSO Support & CAPI Field Helpdesk',
      icon: HelpCircle,
      content: (
        <div className="space-y-4 text-sm text-neutral-700">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-navy/20 bg-navy-100 p-3.5">
              <div className="flex items-center gap-2 text-navy font-semibold text-xs">
                <Phone className="h-4 w-4 text-saffron" />
                <span>Toll-Free National Helpline</span>
              </div>
              <p className="mt-1 font-mono text-base font-bold text-navy">1800-11-2026</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Mon–Sat, 09:00 to 18:00 IST</p>
            </div>

            <div className="rounded-xl border border-navy/20 bg-navy-100 p-3.5">
              <div className="flex items-center gap-2 text-navy font-semibold text-xs">
                <Mail className="h-4 w-4 text-saffron" />
                <span>Nodal Support Email</span>
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-navy break-all">
                support-statskill@mospi.gov.in
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Average response under 4 hours</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h5 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
              Frequently Asked Support Topics
            </h5>
            <div className="space-y-2 text-xs">
              <details className="group rounded-lg bg-muted p-2.5 cursor-pointer">
                <summary className="font-semibold text-navy list-none flex items-center justify-between">
                  How do I connect my Jan Parichay Single Sign-On (SSO)?
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-muted-foreground leading-relaxed pl-1">
                  Click 'Log In' in the top navigation bar, select 'Continue with Jan Parichay',
                  and input your official @gov.in or @nic.in credentials or Aadhaar-linked OTP.
                </p>
              </details>

              <details className="group rounded-lg bg-muted p-2.5 cursor-pointer">
                <summary className="font-semibold text-navy list-none flex items-center justify-between">
                  How are diagnostic test results reflected in my eHRMS profile?
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-muted-foreground leading-relaxed pl-1">
                  Upon completing a validated domain assessment, your competency score is cryptographically
                  signed and pushed via the secure MoSPI API to your electronic Service Book (e-HRMS 2.0).
                </p>
              </details>

              <details className="group rounded-lg bg-muted p-2.5 cursor-pointer">
                <summary className="font-semibold text-navy list-none flex items-center justify-between">
                  What should I do if an offline question set fails to load?
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-muted-foreground leading-relaxed pl-1">
                  The StatSkill AI engine includes an offline question bank (Sets A, B, C, D). Click the
                  'Reshuffle Question Paper' button in the assessment view to cycle paper sets.
                </p>
              </details>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onLaunchPortal) onLaunchPortal()
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-saffron px-4 py-2 text-xs font-bold text-slate-deep hover:brightness-105 transition shadow-xs cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Launch StatSkill AI Interactive Help Assistant
            </button>
          </div>
        </div>
      ),
    },
  }

  const current = modalConfig[type]
  const Icon = current.icon

  return (
    <ModalShell
      open={Boolean(type)}
      onClose={onClose}
      title={current.title}
      subtitle={current.subtitle}
      labelledBy={`info-modal-${type}`}
    >
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-100 text-navy">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display font-semibold text-navy text-sm">{current.title}</p>
          <p className="text-xs text-muted-foreground">{current.subtitle}</p>
        </div>
      </div>
      {current.content}
    </ModalShell>
  )
}
"""

# 2. components/site-header.tsx
FILES["components/site-header.tsx"] = """'use client'

import { useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Type,
  Volume2,
  X,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react'
import { AshokaChakra, LotusMark } from './emblems'
import type { InfoModalType } from './info-modal'

type HeaderProps = {
  onOpenLogin: () => void
  onOpenAdmin: () => void
  onOpenA11y: () => void
  onOpenInfo: (type: InfoModalType) => void
  fontScale: number
  setFontScale: (updater: (v: number) => number) => void
}

const NAV_ITEMS: { label: string; modalKey: NonNullable<InfoModalType> }[] = [
  { label: 'About Us', modalKey: 'about' },
  { label: 'Newsroom', modalKey: 'newsroom' },
  { label: 'Career', modalKey: 'career' },
  { label: 'Tenders', modalKey: 'tenders' },
  { label: 'Notifications', modalKey: 'notifications' },
  { label: 'Help Centre', modalKey: 'help' },
]

export function SiteHeader({
  onOpenLogin,
  onOpenAdmin,
  onOpenA11y,
  onOpenInfo,
  fontScale,
  setFontScale,
}: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN')
  const [mobileOpen, setMobileOpen] = useState(false)
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleEmblemTap() {
    tapCount.current += 1
    if (tapTimer.current) clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0
    }, 700)
    if (tapCount.current >= 3) {
      tapCount.current = 0
      onOpenAdmin()
    }
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top ministerial micro-bar */}
      <div className="bg-navy text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] md:text-xs">
          <button
            type="button"
            onClick={handleEmblemTap}
            className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
            title="Government of India • Click 3 times for Admin Gateway"
          >
            <AshokaChakra className="h-5 w-5 shrink-0 text-gold" />
            <span className="leading-tight">
              <span className="font-semibold text-amber-300">भारत सरकार</span>
              <span className="mx-1 text-white/40">|</span>
              Government of India
              <span className="hidden text-white/70 sm:inline">
                {' '}
                — Ministry of Statistics and Programme Implementation (MoSPI)
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className="rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Skip to Main Content
            </a>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'EN' ? 'HI' : 'EN'))}
              className="rounded-sm px-1.5 py-0.5 font-medium transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
            >
              {lang === 'EN' ? 'English / हिंदी' : 'हिंदी / English'}
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-1" aria-label="Adjust text size">
              <button
                type="button"
                onClick={() => setFontScale((v) => Math.max(0.9, +(v - 0.1).toFixed(2)))}
                className="h-5 w-5 rounded-sm text-[10px] font-bold transition hover:bg-white/10 cursor-pointer"
                title="Decrease text size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontScale(() => 1)}
                className="h-5 w-5 rounded-sm text-xs font-bold transition hover:bg-white/10 cursor-pointer"
                title="Reset text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale((v) => Math.min(1.4, +(v + 0.1).toFixed(2)))}
                className="h-5 w-5 rounded-sm text-sm font-bold transition hover:bg-white/10 cursor-pointer"
                title="Increase text size"
              >
                A+
              </button>
            </div>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenA11y}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
              title="Screen reader & accessibility settings (Ctrl+U / Alt+A)"
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden md:inline">Screen Reader Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tricolor divider accent */}
      <div
        className="h-[3px] w-full"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
        }}
      />

      {/* Main navbar */}
      <div className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold shadow-xs transition group-hover:scale-105">
              <LotusMark className="h-7 w-7" />
            </span>
            <span className="leading-tight">
              <span className="flex items-center gap-2">
                <span className="block font-display text-lg font-bold text-navy">
                  StatSkill AI
                </span>
                <span className="rounded bg-navy-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-navy border border-navy/20">
                  MoSPI Sovereign Node
                </span>
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय · NSSTA Capacity Hub
              </span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map(({ label, modalKey }) => (
              <button
                key={label}
                type="button"
                onClick={() => onOpenInfo(modalKey)}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-navy-100 hover:text-navy cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white sm:block cursor-pointer"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-md bg-saffron px-4 py-2 text-sm font-semibold text-slate-deep shadow-xs transition hover:brightness-105 cursor-pointer"
            >
              Register
            </button>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="animate-pulse-badge hidden items-center gap-1.5 rounded-full bg-navy-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 md:flex shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              Launch StatSkill Portal
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-md border border-border text-navy lg:hidden cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            className="border-t border-border bg-card px-4 py-3 lg:hidden shadow-lg"
            aria-label="Mobile"
          >
            <ul className="flex flex-col space-y-1">
              {NAV_ITEMS.map(({ label, modalKey }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenInfo(modalKey)
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-navy-100 hover:text-navy cursor-pointer"
                  >
                    <span>{label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
                  </button>
                </li>
              ))}
              <li className="mt-3 flex gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    onOpenLogin()
                  }}
                  className="flex-1 rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy"
                >
                  Log In
                </button>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy-500 px-4 py-2 text-sm font-semibold text-white shadow-xs"
                >
                  <Sparkles className="h-4 w-4 text-gold" /> Launch Portal
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
"""

# 3. components/hero-section.tsx
FILES["components/hero-section.tsx"] = """'use client'

import { useState } from 'react'
import { BookOpen, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import { SOCIAL_LINKS as SOCIALS } from './social-icons'

export function HeroSection() {
  const [activeDot, setActiveDot] = useState(0)

  return (
    <section id="hero" className="relative overflow-hidden bg-parchment">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,46,99,0.06) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-100 px-3 py-1 text-xs font-semibold text-navy">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            National Statistical Systems Training Academy (NSSTA) · Mission Karmayogi
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-navy text-balance md:text-5xl lg:text-6xl">
            StatSkill AI
          </h1>
          <p className="mt-2 text-xl font-semibold text-saffron">
            Sovereign Capacity Building for India's Statistical Cadres
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700 text-pretty">
            Empowering officers of the Indian Statistical Service (ISS), Subordinate Statistical Service (SSS),
            and State DES with AI-driven, FRAC-aligned diagnostic assessments and role-based continuous learning.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-navy-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-700 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-gold" />
              Launch Diagnostic Assessment
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 rounded-md border border-navy/25 bg-card px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy-100"
            >
              <BookOpen className="h-4 w-4" />
              Browse 880+ MoSPI Courses
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Official Channels
            </span>
            <div className="flex gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white/90 transition hover:bg-navy-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — celebratory milestone card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-navy-700 p-8 text-white shadow-xl">
            {/* confetti */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {[
                ['8%', '12%', 'var(--gold)'],
                ['22%', '80%', 'var(--saffron)'],
                ['70%', '18%', 'var(--emerald)'],
                ['85%', '70%', 'var(--gold)'],
                ['45%', '90%', 'var(--saffron)'],
                ['12%', '55%', 'var(--emerald)'],
              ].map(([top, left, color], i) => (
                <span
                  key={i}
                  className="absolute h-2 w-2 rounded-[2px]"
                  style={{
                    top,
                    left,
                    backgroundColor: color,
                    transform: `rotate(${i * 40}deg)`,
                    opacity: 0.9,
                  }}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-navy-500/50 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/40">
                <Sparkles className="h-3.5 w-3.5" /> MoSPI &amp; National Cadre Milestone
              </span>
              <p className="mt-6 font-mono text-5xl md:text-6xl font-bold leading-none tracking-tight tabular-nums">
                1.7 Crore
                <span className="text-gold">+</span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90">
                Civil Servants Onboarded Nationally • <strong>5,200+ Statistical Officers &amp; Enumerators</strong> Active Across 36 States/UTs.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur-xs">
                  <p className="font-mono text-base font-bold text-gold">94.2%</p>
                  <p className="text-white/70 text-[11px]">NSS CAPI Proficiency</p>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur-xs">
                  <p className="font-mono text-base font-bold text-emerald-300">36 States/UTs</p>
                  <p className="text-white/70 text-[11px]">State DES Integration</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    type="button"
                    aria-label={`Slide ${dot + 1}`}
                    onClick={() => setActiveDot(dot)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeDot === dot ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"""

# 4. components/analytics-section.tsx
FILES["components/analytics-section.tsx"] = """import {
  ArrowRight,
  Award,
  Building2,
  Layers,
  Trophy,
  Users2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

/* ---------------- Competency donut ---------------- */

const COMPETENCIES = [
  { label: 'Domain (NSS, SUT, CPI, Sampling)', value: 1290, color: 'var(--navy-500)' },
  { label: 'Functional (CAPI, R, Python, SQL)', value: 3113, color: 'var(--saffron)' },
  { label: 'Behavioural (Governance, Ethics)', value: 1140, color: 'var(--emerald)' },
]

function CompetencyDonut() {
  const total = COMPETENCIES.reduce((s, c) => s + c.value, 0)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--neutral-200, #e2e2e2)"
            strokeWidth="16"
            opacity="0.4"
          />
          {COMPETENCIES.map((c) => {
            const length = (c.value / total) * circumference
            const dash = `${length} ${circumference - length}`
            const el = (
              <circle
                key={c.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={c.color}
                strokeWidth="16"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += length
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex rotate-0 flex-col items-center justify-center">
          <span className="font-mono text-xl font-bold tabular-nums text-navy">
            {total.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Competencies
          </span>
        </div>
      </div>
      <ul className="space-y-2 text-xs flex-1">
        {COMPETENCIES.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-[2px] shrink-0"
              style={{ backgroundColor: c.color }}
            />
            <span className="text-neutral-700 leading-tight">{c.label}</span>
            <span className="ml-auto font-mono font-semibold tabular-nums text-navy">
              {c.value.toLocaleString('en-IN')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------- shared card ---------------- */

function AnalyticsCard({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ${className}`}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-100 text-navy">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h3 className="font-display text-base font-semibold text-navy">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="font-mono text-lg font-bold tabular-nums text-navy">{value}</p>
      <p className="mt-0.5 text-xs leading-snug text-muted-foreground text-pretty">
        {label}
      </p>
    </div>
  )
}

/* ---------------- participation bars ---------------- */

const TIERS = [
  { tier: 'Group A (ISS Officers & Directors)', onboarded: 96, completed: 92 },
  { tier: 'Group B (SSS - Senior & Junior Statistical Officers)', onboarded: 91, completed: 88 },
  { tier: 'Group C, D & Field CAPI Enumerators', onboarded: 84, completed: 79 },
]

/* ---------------- MoSPI Cadre Leaderboard ---------------- */

const LEADERBOARD = [
  { rank: 1, name: 'Field Operations Division (FOD-NSSO)', score: '94% Competency Index', color: 'var(--gold)' },
  { rank: 2, name: 'Data Processing Division (DPD-NSSO)', score: '91% Competency Index', color: '#9ca3af' },
  { rank: 3, name: 'National Accounts Division (NAD-CSO)', score: '88% Competency Index', color: '#b45309' },
  { rank: 4, name: 'Data Informatics & Innovation (DIID-MoSPI)', score: '86% Competency Index', color: 'var(--navy-500)' },
  { rank: 5, name: 'State Directorates of Economics & Statistics (DES)', score: '82% Competency Index', color: 'var(--emerald)' },
]

/* ---------------- statistical priorities ---------------- */

const ASPIRATIONS = [
  { label: 'Real-Time CAPI Survey Telemetry & Field Quality', completions: '3,38,80,712', pct: 95 },
  { label: 'AI-Assisted SUT Balancing & GDP Deflators', completions: '1,50,86,052', pct: 78 },
  { label: 'Microdata Anonymisation & DPDP Act 2023 Compliance', completions: '1,10,49,297', pct: 64 },
]

/* ---------------- state participation grid (abstract, non-geographic) ---------------- */

const STATE_GRID = [
  94, 91, 88, 86, 92, 85, 89, 78, 82, 95, 87, 81, 90, 84, 88, 79, 93, 85, 87, 91,
  83, 89, 92, 86, 80, 88, 84, 90,
]

function heatColor(v: number) {
  if (v >= 90) return 'var(--navy)'
  if (v >= 85) return 'var(--navy-500)'
  if (v >= 80) return '#6f9dd1'
  return 'var(--navy-100)'
}

export function AnalyticsSection() {
  return (
    <section id="analytics" className="bg-parchment-2/60">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-saffron">
            National Capacity &amp; Cadre Analytics
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy text-balance">
            Rule-to-Role &amp; Democratised Statistical Learning
          </h2>
          <p className="mt-3 text-neutral-700 text-pretty">
            Live intelligence on Annual Capacity Building Plans (ACBP), FRAC competency distribution, and
            division-wise progress across MoSPI and 36 State DES.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Rule to Role */}
          <AnalyticsCard
            title="Rule to Role Based Learning (MoSPI ACBP)"
            icon={Layers}
            className="lg:col-span-2"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-3">
                <StatTile value="1,434" label="Union CBPs" />
                <StatTile value="2,609" label="State CBPs" />
                <StatTile value="43,45,664" label="Employees with CBPs" />
                <StatTile value="1,23,74,227" label="Role-Relevant Completions" />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Competency Distribution
                </p>
                <CompetencyDonut />
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    ['Basic', '3,757'],
                    ['Intermediate', '1,034'],
                    ['Advanced', '42'],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-border px-2 py-2 text-center"
                    >
                      <p className="font-mono text-sm font-bold tabular-nums text-navy">
                        {value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnalyticsCard>

          {/* Democratised participation */}
          <AnalyticsCard title="Democratised Cadre Participation" icon={Users2}>
            <p className="mb-4 text-xs text-muted-foreground">
              Onboarding vs Completion by statistical service tier
            </p>
            <ul className="space-y-5">
              {TIERS.map((t) => (
                <li key={t.tier}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900">{t.tier}</span>
                  </div>
                  <div className="space-y-1.5">
                    <Bar label="Onboarded" pct={t.onboarded} color="var(--navy-500)" />
                    <Bar label="Completed" pct={t.completed} color="var(--emerald)" />
                  </div>
                </li>
              ))}
            </ul>
          </AnalyticsCard>

          {/* Ranking + state grid */}
          <AnalyticsCard title="MoSPI Divisions &amp; Directorates Ranking" icon={Trophy}>
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                State &amp; UT participation intensity (36 States/UTs)
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {STATE_GRID.map((v, i) => (
                  <span
                    key={i}
                    className="aspect-square rounded-[3px]"
                    style={{ backgroundColor: heatColor(v) }}
                    title={`${v}% active`}
                  />
                ))}
              </div>
            </div>
            <ul className="space-y-2">
              {LEADERBOARD.map((l) => (
                <li
                  key={l.rank}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2"
                >
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{l.name}</p>
                    <p className="text-[10px] text-muted-foreground">{l.score}</p>
                  </div>
                  <Award
                    className="ml-auto h-4 w-4 shrink-0"
                    style={{ color: l.color }}
                  />
                </li>
              ))}
            </ul>
          </AnalyticsCard>

          {/* Aspirations */}
          <AnalyticsCard
            title="Shared Statistical Priorities (Mission Karmayogi)"
            icon={Building2}
            className="lg:col-span-2"
          >
            <ul className="space-y-5">
              {ASPIRATIONS.map((a) => (
                <li key={a.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-neutral-900">
                      {a.label}
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums text-navy">
                      {a.completions}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        completions
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-navy-500 to-saffron"
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </AnalyticsCard>
        </div>

        {/* eHRMS banner */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-navy p-6 text-white sm:flex-row sm:items-center shadow-lg">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">
                Right Officer for the Right Statistical Role
              </p>
              <p className="text-sm text-white/70">
                Automated competency telemetry syncing with e-HRMS 2.0 electronic service books for transparent promotions.
              </p>
            </div>
          </div>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-saffron px-4 py-2.5 text-sm font-semibold text-slate-deep transition hover:brightness-105 shadow-xs"
          >
            Explore eHRMS Integration
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-xs font-semibold tabular-nums text-navy">
        {pct}%
      </span>
    </div>
  )
}
"""

# 5. components/courses-section.tsx
FILES["components/courses-section.tsx"] = """'use client'

import { useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Play, Sparkles, BookOpen, Layers, Database, Cpu, TrendingUp, Shield } from 'lucide-react'

type Course = {
  title: string
  provider: string
  duration: string
  domain: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  gradient: string
  icon: React.ComponentType<{ className?: string }>
}

const COURSES: Course[] = [
  {
    title: 'Handling of Unit Level Data of NSS and its Analysis using R',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    duration: '8h 30m',
    domain: 'NSS Microdata & R',
    level: 'Advanced',
    gradient: 'from-blue-900 via-indigo-900 to-navy',
    icon: Database,
  },
  {
    title: 'NSSO Multistage Stratified Sampling & Survey Weighting',
    provider: 'Survey Design and Research Division (SDRD-NSSO)',
    duration: '4h 15m',
    domain: 'Sampling & Estimation',
    level: 'Intermediate',
    gradient: 'from-emerald-900 via-teal-900 to-navy',
    icon: Layers,
  },
  {
    title: 'CAPI Digital Field Data Collection & Paradata Validation',
    provider: 'Field Operations Division (FOD-NSSO)',
    duration: '3h 45m',
    domain: 'Field CAPI Operations',
    level: 'Basic',
    gradient: 'from-amber-900 via-yellow-900 to-navy',
    icon: Cpu,
  },
  {
    title: 'National Accounts: Supply-Use Tables (SUT) & GDP Deflators',
    provider: 'National Accounts Division (NAD-CSO)',
    duration: '6h 20m',
    domain: 'Macroeconomic Accounts',
    level: 'Advanced',
    gradient: 'from-purple-900 via-indigo-950 to-navy',
    icon: TrendingUp,
  },
  {
    title: 'Consumer Price Index (CPI) Geometric Mean & Web Scraping',
    provider: 'Social Statistics Division (SSD-MoSPI)',
    duration: '3h 10m',
    domain: 'Price Statistics & Inflation',
    level: 'Intermediate',
    gradient: 'from-cyan-900 via-sky-950 to-navy',
    icon: BookOpen,
  },
  {
    title: 'Digital Data Governance & Microdata Anonymisation Protocols',
    provider: 'Data Informatics & Innovation Division (DIID-MoSPI)',
    duration: '5h 00m',
    domain: 'DPDP Act & Governance',
    level: 'Advanced',
    gradient: 'from-slate-900 via-blue-950 to-navy',
    icon: Shield,
  },
]

export function CoursesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8 * direction
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section id="courses" className="bg-parchment">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-saffron">
              Curated for the Statistical Cadre
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy">
              Showcased Official MoSPI &amp; NSSTA Courses
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              FRAC-aligned e-learning modules designed for Indian Statistical Service &amp; SSS officers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 text-sm font-semibold text-navy hover:text-navy-500 sm:flex"
            >
              Explore all 880+ Catalog
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous courses"
                className="grid h-10 w-10 place-items-center rounded-full border border-navy/25 bg-card text-navy transition hover:bg-navy hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next courses"
                className="grid h-10 w-10 place-items-center rounded-full border border-navy/25 bg-card text-navy transition hover:bg-navy hover:text-white cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {COURSES.map((course) => {
            const Icon = course.icon
            return (
              <article
                key={course.title}
                className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(11,46,99,0.12)] sm:w-[320px]"
              >
                {/* Custom Card Banner Cover */}
                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${course.gradient} p-4 flex flex-col justify-between text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {course.level}
                    </span>
                    <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-slate-deep font-mono">
                      NSSTA Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-xs text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-mono font-medium text-white/80">{course.domain}</p>
                      <p className="text-xs font-bold text-white tracking-wide">MoSPI Cadre Specialization</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-saffron" />
                    {course.duration}
                    <span className="mx-1 text-border">•</span>
                    <span className="text-[11px] font-mono font-medium text-navy">{course.domain}</span>
                  </p>
                  <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] font-display text-[14px] font-bold leading-snug text-navy group-hover:text-navy-500 transition">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                    {course.provider}
                  </p>
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-navy/20 bg-navy-100 px-3 py-2 text-xs font-semibold text-navy transition group-hover:bg-navy group-hover:text-white"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Start Diagnostic Assessment
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
"""

# 6. components/hubs-section.tsx
FILES["components/hubs-section.tsx"] = """'use client'

import {
  Briefcase,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  Network,
  Play,
  Target,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { LotusMark } from './emblems'

const HUBS = [
  {
    name: 'Career Hub',
    icon: Briefcase,
    desc: 'Discover civil service career pathways aligned with statistical aspirations and ISS/SSS promotions.',
  },
  {
    name: 'Learn Hub',
    icon: GraduationCap,
    desc: 'Access 880+ authenticated e-learning courses across statistical theory and software tools.',
  },
  {
    name: 'Competency Hub',
    icon: Target,
    desc: 'Map your profile against the FRAC competency dictionary and automated spider radar benchmarks.',
  },
  {
    name: 'Discussion Hub',
    icon: MessageSquare,
    desc: 'Peer knowledge forums for MoSPI investigators, supervisors, and data analysts.',
  },
  {
    name: 'Events Hub',
    icon: CalendarDays,
    desc: 'NSSTA webinars, residential workshops, and physical training schedules in Greater Noida.',
  },
  {
    name: 'Network Hub',
    icon: Network,
    desc: 'Connect across central ministries and 36 State Directorates of Economics & Statistics.',
  },
]

export function HubsSection() {
  return (
    <section id="hubs" className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            One Ecosystem, Six Gateways
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-balance">
            StatSkill AI &amp; Karmayogi Hubs
          </h2>
          <p className="mt-3 text-white/70 text-pretty">
            A connected capacity-building ecosystem orbiting a single learner
            identity — from first statistical diagnostic to national policy leadership.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          {/* Orbit + hub grid */}
          <div>
            {/* Decorative orbit */}
            <div
              className="relative mx-auto hidden aspect-square w-full max-w-[380px] sm:block"
              aria-hidden="true"
            >
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-16 rounded-full border border-white/10" />
              {/* center */}
              <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-700 text-gold shadow-lg ring-1 ring-gold/30">
                <LotusMark className="h-14 w-14" />
              </div>
              {/* rotating ring of nodes */}
              <div
                className="absolute inset-0"
                style={{ animation: 'k-orbit 40s linear infinite' }}
              >
                {HUBS.map((hub, i) => {
                  const angle = (360 / HUBS.length) * i - 90
                  const rad = (angle * Math.PI) / 180
                  const r = 44
                  const x = 50 + r * Math.cos(rad)
                  const y = 50 + r * Math.sin(rad)
                  const Icon = hub.icon
                  return (
                    <div
                      key={hub.name}
                      className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div
                        className="grid h-full w-full place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur"
                        style={{ animation: 'k-orbit-reverse 40s linear infinite' }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Content grid (accessible, always visible) */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {HUBS.map((hub) => {
                const Icon = hub.icon
                return (
                  <li
                    key={hub.name}
                    className="flex gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold">{hub.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                        {hub.desc}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Video guide card */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="group relative aspect-video overflow-hidden rounded-xl bg-navy-700">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, rgba(201,162,39,0.4), transparent 60%)',
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Play registration guide video"
                  className="grid h-16 w-16 place-items-center rounded-full bg-gold text-slate-deep shadow-lg transition group-hover:scale-110"
                >
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </a>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-gold ring-1 ring-gold/30">
                  <LotusMark className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-white/80">
                  StatSkill AI · MoSPI Sovereign Node
                </span>
              </div>
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">
              How to Take Your Baseline Competency Assessment on StatSkill AI?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              A step-by-step video walkthrough covering Jan Parichay SSO, cadre selection (JSO/SSO/ISS/Analyst),
              offline paper sets, and eHRMS credit syncing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
"""

# 7. components/site-footer.tsx
FILES["components/site-footer.tsx"] = """'use client'

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
"""

# 8. components/login-modal.tsx
FILES["components/login-modal.tsx"] = """'use client'

import { useState } from 'react'
import { ShieldCheck, Smartphone, Sparkles, ExternalLink } from 'lucide-react'
import { ModalShell } from './modal-shell'

export function LoginModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [identifier, setIdentifier] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  function reset() {
    setIdentifier('')
    setOtpSent(false)
    setOtp(['', '', '', '', '', ''])
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Jan Parichay Single Sign-On"
      subtitle="Government of India Sovereign Identity Gateway"
      labelledBy="login-title"
    >
      <a
        href="http://localhost:5173"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-navy bg-navy-100 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white cursor-pointer shadow-xs"
      >
        <ShieldCheck className="h-4 w-4 text-emerald" />
        Continue with Jan Parichay (SSO)
        <ExternalLink className="h-3.5 w-3.5 ml-1" />
      </a>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or verify with registered mobile / email OTP
        <span className="h-px flex-1 bg-border" />
      </div>

      {!otpSent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (identifier.trim()) setOtpSent(true)
          }}
        >
          <label
            htmlFor="login-id"
            className="mb-1.5 block text-sm font-medium text-navy"
          >
            Official Email (@gov.in / @nic.in) or Mobile
          </label>
          <div className="flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <input
              id="login-id"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. jso.sharma@mospi.gov.in or 98XXXXXX10"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-saffron px-4 py-2.5 text-sm font-semibold text-slate-deep transition hover:brightness-105 cursor-pointer shadow-xs"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4 text-sm text-neutral-700">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-navy">{identifier}</span>.
          </p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="h-12 w-full rounded-md border border-input bg-card text-center font-mono text-lg font-bold text-navy outline-none focus:ring-2 focus:ring-ring"
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            Verify &amp; Enter StatSkill Portal
          </a>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="mt-3 w-full text-center text-xs font-medium text-navy-500 hover:underline cursor-pointer"
          >
            Change mobile / email
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        New to StatSkill AI?{' '}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-saffron hover:underline"
        >
          Register your MoSPI cadre profile
        </a>
      </p>
    </ModalShell>
  )
}
"""

# 9. components/ai-assistant.tsx
FILES["components/ai-assistant.tsx"] = """'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X, ExternalLink } from 'lucide-react'
import { LotusMark } from './emblems'

const JUMP_CHIPS = [
  { label: 'Live Statistics', href: '#metrics' },
  { label: 'Cadre Analytics', href: '#analytics' },
  { label: 'Showcased Courses', href: '#courses' },
  { label: 'StatSkill Hubs', href: '#hubs' },
]

type Message = { from: 'bot' | 'user'; text: string }

export function AiAssistant({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (updater: (v: boolean) => boolean) => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: 'Namaste! I am StatSkill Sahayak, your MoSPI AI Guide. Ask me anything about NSS rounds, CAPI field verification, SUT balancing, FRAC competencies, or NSSTA courses.',
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function jumpTo(href: string, label: string) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMessages((m) => [
      ...m,
      { from: 'user', text: `Take me to ${label}` },
      { from: 'bot', text: `Navigating to ${label}. Let me know if you need specific course modules or diagnostic tests.` },
    ])
  }

  function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const lower = text.toLowerCase()
    let reply = 'Thank you for your query. Use the quick navigation chips below or enter the StatSkill Portal to take your diagnostic assessment.'

    if (lower.includes('capi') || lower.includes('field') || lower.includes('enumerator')) {
      reply = 'CAPI (Computer Assisted Personal Interviewing) protocols cover field data collection, automated validation checks, and paradata quality monitoring. Explore the FOD-NSSO course in Showcased Courses!'
    } else if (lower.includes('r') || lower.includes('nss') || lower.includes('unit level') || lower.includes('microdata')) {
      reply = 'The NSSTA course \"Handling of Unit Level Data of NSS and its Analysis using R\" is available in the Showcased Courses section (8h 30m).'
    } else if (lower.includes('sut') || lower.includes('gdp') || lower.includes('national accounts')) {
      reply = 'Supply-Use Tables (SUT) balancing and GDP deflators are curated under National Accounts Division (NAD-CSO). You can test your macro accounts proficiency in the portal.'
    } else if (lower.includes('login') || lower.includes('sso') || lower.includes('parichay')) {
      reply = 'You can sign in using your official @gov.in / @nic.in credentials via Jan Parichay SSO by clicking the Log In button in the header.'
    } else if (lower.includes('test') || lower.includes('assessment') || lower.includes('offline') || lower.includes('paper')) {
      reply = 'The StatSkill AI engine includes an offline question bank cycling across Sets A, B, C, and D with anti-spam security. Click \"Launch StatSkill Portal\" to take your test!'
    }

    setMessages((m) => [
      ...m,
      { from: 'user', text },
      { from: 'bot', text: reply },
    ])
    setInput('')
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 bg-navy px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-gold">
              <LotusMark className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">StatSkill Sahayak</p>
              <p className="flex items-center gap-1 text-[11px] text-white/70 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> MoSPI AI Guide · Alt + H
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(() => false)}
              aria-label="Close assistant"
              className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-72 flex-col gap-3 overflow-y-auto bg-parchment px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'rounded-br-sm bg-navy-500 text-white'
                      : 'rounded-bl-sm bg-card text-neutral-800 ring-1 ring-border shadow-2xs'
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-card px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {JUMP_CHIPS.map((chip) => (
                <button
                  key={chip.href}
                  type="button"
                  onClick={() => jumpTo(chip.href, chip.label)}
                  className="rounded-full border border-navy/20 bg-navy-100 px-3 py-1 text-xs font-medium text-navy transition hover:bg-navy hover:text-white cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <form onSubmit={send} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask StatSkill Sahayak…"
                className="flex-1 rounded-full border border-input bg-card px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron text-slate-deep transition hover:brightness-105 cursor-pointer shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open StatSkill Sahayak AI assistant"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-xl ring-2 ring-gold/40 transition hover:bg-navy-700 cursor-pointer"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <span className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="absolute -right-2 -top-2 h-3.5 w-3.5 text-gold" />
          </span>
        )}
      </button>
    </>
  )
}
"""

# 10. components/site-shell.tsx
FILES["components/site-shell.tsx"] = """'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AccessibilityConsole,
  type A11yFlag,
  A11Y_TILES,
} from './accessibility-console'
import { AdminModal } from './admin-modal'
import { AiAssistant } from './ai-assistant'
import { AnalyticsSection } from './analytics-section'
import { CoursesSection } from './courses-section'
import { HeroSection } from './hero-section'
import { HubsSection } from './hubs-section'
import { LoginModal } from './login-modal'
import { MetricsBar } from './metrics-bar'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { InfoModal, type InfoModalType } from './info-modal'

const FLAG_CLASS: Record<A11yFlag, string> = {
  'low-saturation': 'a11y-low-saturation',
  'high-contrast': 'a11y-high-contrast',
  'highlight-links': 'a11y-highlight-links',
  'bigger-text': 'a11y-bigger-text',
  'text-spacing': 'a11y-text-spacing',
  'pause-animations': 'a11y-pause-animations',
  'hide-images': 'a11y-hide-images',
  dyslexia: 'a11y-dyslexia',
  'big-cursor': 'a11y-big-cursor',
  tooltips: 'a11y-tooltips',
  'line-height': 'a11y-line-height',
  'text-align': 'a11y-text-left',
}

const INITIAL_FLAGS = Object.fromEntries(
  A11Y_TILES.map((t) => [t.key, false]),
) as Record<A11yFlag, boolean>

export function SiteShell() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [a11yOpen, setA11yOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null)
  const [flags, setFlags] = useState<Record<A11yFlag, boolean>>(INITIAL_FLAGS)
  const [fontScale, setFontScale] = useState(1)

  // apply accessibility classes to <html>
  useEffect(() => {
    const root = document.documentElement
    ;(Object.keys(FLAG_CLASS) as A11yFlag[]).forEach((flag) => {
      root.classList.toggle(FLAG_CLASS[flag], flags[flag])
    })
  }, [flags])

  // apply font scale to <html>
  useEffect(() => {
    document.documentElement.style.fontSize =
      fontScale === 1 ? '' : `${Math.round(fontScale * 100)}%`
  }, [fontScale])

  // global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      if (e.ctrlKey && e.shiftKey && key === 'a') {
        e.preventDefault()
        setAdminOpen(true)
        return
      }
      if ((e.ctrlKey && key === 'u') || (e.altKey && key === 'a')) {
        e.preventDefault()
        setA11yOpen((o) => !o)
        return
      }
      if (e.altKey && key === 'h') {
        e.preventDefault()
        setAssistantOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleFlag = useCallback((flag: A11yFlag) => {
    setFlags((f) => ({ ...f, [flag]: !f[flag] }))
  }, [])

  const resetFlags = useCallback(() => {
    setFlags(INITIAL_FLAGS)
    setFontScale(1)
  }, [])

  return (
    <>
      <SiteHeader
        onOpenLogin={() => setLoginOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenA11y={() => setA11yOpen(true)}
        onOpenInfo={(type) => setInfoModalType(type)}
        fontScale={fontScale}
        setFontScale={setFontScale}
      />
      <main>
        <HeroSection />
        <MetricsBar />
        <AnalyticsSection />
        <CoursesSection />
        <HubsSection />
      </main>
      <SiteFooter onOpenInfo={(type) => setInfoModalType(type)} />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onLaunchPortal={() => {
          window.open('http://localhost:5173', '_blank')
        }}
      />
      <AccessibilityConsole
        open={a11yOpen}
        onClose={() => setA11yOpen(false)}
        flags={flags}
        onToggle={toggleFlag}
        onReset={resetFlags}
      />
      <AiAssistant open={assistantOpen} setOpen={setAssistantOpen} />
    </>
  )
}
"""

def build():
    print(f"Starting build of {len(FILES)} components in {BASE_DIR}...")
    for rel_path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  [OK] Successfully wrote {rel_path} ({len(content)} bytes)")
    print("All components generated successfully!")

if __name__ == "__main__":
    build()

