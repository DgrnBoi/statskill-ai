'use client'

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
            deputations across India\'s statistical system.
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
