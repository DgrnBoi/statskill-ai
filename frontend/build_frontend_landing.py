# Python Generator for Unified StatSkill AI Landing Page & Portal
import os

BASE = r"C:\Users\Eshaan Sunthankar\Documents\SIH\statskill-ai\frontend\src"

FILES = {}

# 1. LandingInfoModal.tsx
FILES["components/landing/LandingInfoModal.tsx"] = """import React from 'react';
import {
  Building2,
  Newspaper,
  Briefcase,
  FileText,
  Bell,
  HelpCircle,
  X,
  Shield,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type InfoModalType =
  | 'about'
  | 'newsroom'
  | 'career'
  | 'tenders'
  | 'notifications'
  | 'help'
  | null;

interface LandingInfoModalProps {
  type: InfoModalType;
  onClose: () => void;
  onLaunchPortal?: () => void;
}

export function LandingInfoModal({ type, onClose, onLaunchPortal }: LandingInfoModalProps) {
  if (!type) return null;

  const modalConfig: Record<
    NonNullable<InfoModalType>,
    {
      title: string;
      subtitle: string;
      icon: React.ComponentType<{ className?: string }>;
      content: React.ReactNode;
    }
  > = {
    about: {
      title: 'About StatSkill AI & MoSPI Mandate',
      subtitle: 'National Statistical Systems Training Academy (NSSTA) Sovereign Node',
      icon: Building2,
      content: (
        <div className="space-y-4 text-sm text-slate-700">
          <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-4">
            <h4 className="font-bold text-[#0B2E63] flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-amber-500" />
              Sovereign Capacity Building Mission
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-800">
              StatSkill AI is the specialized artificial intelligence and competency diagnostic
              engine created under Mission Karmayogi (NPCSCB) for the Ministry of Statistics and
              Programme Implementation (MoSPI), Government of India.
            </p>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B2E63]">
              Key Strategic Objectives
            </h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 rounded-lg bg-slate-100 p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Rule to Role Transition:</strong> Shift training from generic tenure-based
                  courses to precision role-aligned FRAC competencies for ISS, SSS, and State DES cadres.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-slate-100 p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>AI-Powered Diagnostics:</strong> Dynamic adaptive assessment engine with
                  automated offline question set cycling (Sets A, B, C, D) and anti-spam verification.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-slate-100 p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>CAPI &amp; Digital Field Standards:</strong> Continuous skill upgrading for Computer
                  Assisted Personal Interviewing (CAPI) enumerators and supervisory inspectors across NSSO.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-slate-100 p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>xAPI Telemetry &amp; Governance:</strong> Real-time competency auditing complying
                  with the Digital Personal Data Protection (DPDP) Act 2023.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs shadow-2xs">
            <p className="font-semibold text-[#0B2E63]">Headquarters &amp; Institutional Partners:</p>
            <p className="mt-1 text-slate-500">
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
              className="group rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-[#0B2E63]/40 hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded bg-[#0B2E63]/10 px-2 py-0.5 font-semibold text-[#0B2E63]">
                  {item.tag}
                </span>
                <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
              </div>
              <h4 className="mt-2 font-semibold text-[#0B2E63] group-hover:text-[#1A56A0]">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.summary}</p>
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
        <div className="space-y-4 text-sm text-slate-700">
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
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0B2E63] text-sm">{c.cadre}</h4>
                  <span className="text-[11px] font-mono font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {c.grades}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-800">
                  <strong>Entry Gateway:</strong> {c.selection}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <strong>Core FRAC Competencies:</strong> {c.competencies}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-3 flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-semibold text-[#0B2E63]">Annual Capacity Building Plan (ACBP 2026-27)</p>
              <p className="text-slate-500">Take the baseline diagnostic to unlock cadre promotion credits.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onLaunchPortal) onLaunchPortal();
              }}
              className="shrink-0 rounded-lg bg-[#0B2E63] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#123E82] transition cursor-pointer"
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
              className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-semibold text-[#0B2E63]">{t.id}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 text-[11px]">
                  {t.status}
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">{t.title}</h4>
              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100">
                <span>Estimated Value: <strong className="text-[#0B2E63]">{t.value}</strong></span>
                <span className="font-mono text-[11px]">Due: {t.closing}</span>
              </div>
            </div>
          ))}
          <p className="text-center text-[11px] text-slate-500 pt-1">
            For tender document downloads and digital bidding, visit{' '}
            <a
              href="https://eprocure.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 font-medium hover:underline inline-flex items-center gap-0.5"
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
              className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-1 hover:border-[#0B2E63]/30 transition"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500">{n.num}</span>
                <span className="font-medium text-amber-800 bg-amber-100 px-2 py-0.2 rounded">
                  {n.type}
                </span>
              </div>
              <h4 className="font-semibold text-[#0B2E63] text-sm leading-snug">{n.title}</h4>
              <p className="text-[11px] text-slate-500">Issued on: {n.date}</p>
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
        <div className="space-y-4 text-sm text-slate-700">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-3.5">
              <div className="flex items-center gap-2 text-[#0B2E63] font-semibold text-xs">
                <Phone className="h-4 w-4 text-amber-600" />
                <span>Toll-Free National Helpline</span>
              </div>
              <p className="mt-1 font-mono text-base font-bold text-[#0B2E63]">1800-11-2026</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Mon–Sat, 09:00 to 18:00 IST</p>
            </div>

            <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-3.5">
              <div className="flex items-center gap-2 text-[#0B2E63] font-semibold text-xs">
                <Mail className="h-4 w-4 text-amber-600" />
                <span>Nodal Support Email</span>
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-[#0B2E63] break-all">
                support-statskill@mospi.gov.in
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Average response under 4 hours</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0B2E63]">
              Frequently Asked Support Topics
            </h5>
            <div className="space-y-2 text-xs">
              <details className="group rounded-lg bg-slate-50 p-2.5 cursor-pointer">
                <summary className="font-semibold text-[#0B2E63] list-none flex items-center justify-between">
                  How do I connect my Jan Parichay Single Sign-On (SSO)?
                  <ChevronRight className="h-4 w-4 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                  Click 'Log In' in the top navigation bar, select 'Continue with Jan Parichay',
                  and input your official @gov.in or @nic.in credentials or Aadhaar-linked OTP.
                </p>
              </details>

              <details className="group rounded-lg bg-slate-50 p-2.5 cursor-pointer">
                <summary className="font-semibold text-[#0B2E63] list-none flex items-center justify-between">
                  How are diagnostic test results reflected in my eHRMS profile?
                  <ChevronRight className="h-4 w-4 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                  Upon completing a validated domain assessment, your competency score is cryptographically
                  signed and pushed via the secure MoSPI API to your electronic Service Book (e-HRMS 2.0).
                </p>
              </details>

              <details className="group rounded-lg bg-slate-50 p-2.5 cursor-pointer">
                <summary className="font-semibold text-[#0B2E63] list-none flex items-center justify-between">
                  What should I do if an offline question set fails to load?
                  <ChevronRight className="h-4 w-4 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-1">
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
                onClose();
                if (onLaunchPortal) onLaunchPortal();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-amber-400 transition shadow-xs cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-slate-900" />
              Launch StatSkill AI Interactive Help Assistant
            </button>
          </div>
        </div>
      ),
    },
  };

  const current = modalConfig[type];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`info-modal-${type}`}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#0B2E63] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-400">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 id={`info-modal-${type}`} className="text-lg font-bold text-white">
                {current.title}
              </h2>
              <p className="text-xs text-slate-200">{current.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-white/80 transition hover:bg-white/10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto p-6 bg-slate-50/50">{current.content}</div>
      </div>
    </div>
  );
}
"""

# 2. LandingHeader.tsx
FILES["components/landing/LandingHeader.tsx"] = """import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Volume2,
  X,
  Sparkles,
  Bot,
  Eye,
  Shield,
  UserCheck,
} from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';
import { InfoModalType } from './LandingInfoModal';

interface LandingHeaderProps {
  onOpenLogin: () => void;
  onOpenSecretAdmin: () => void;
  onOpenAccessibility: () => void;
  onOpenSahayak: () => void;
  onOpenInfo: (type: InfoModalType) => void;
  onLaunchPortal: () => void;
  fontScale?: number;
  setFontScale?: (updater: (v: number) => number) => void;
}

const NAV_ITEMS: { label: string; modalKey: NonNullable<InfoModalType> }[] = [
  { label: 'About Us', modalKey: 'about' },
  { label: 'Newsroom', modalKey: 'newsroom' },
  { label: 'Career', modalKey: 'career' },
  { label: 'Tenders', modalKey: 'tenders' },
  { label: 'Notifications', modalKey: 'notifications' },
  { label: 'Help Centre', modalKey: 'help' },
];

export function LandingHeader({
  onOpenLogin,
  onOpenSecretAdmin,
  onOpenAccessibility,
  onOpenSahayak,
  onOpenInfo,
  onLaunchPortal,
  fontScale = 1,
  setFontScale,
}: LandingHeaderProps) {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [mobileOpen, setMobileOpen] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEmblemTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 700);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      onOpenSecretAdmin();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top ministerial micro-bar */}
      <div className="bg-[#0B2E63] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] md:text-xs">
          <button
            type="button"
            onClick={handleEmblemTap}
            className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            title="Government of India • Click 3 times for Admin Gateway"
          >
            <span className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-amber-400/80">
              <IndianFlag variant="circular" width={20} height={20} />
            </span>
            <span className="leading-tight">
              <span className="font-semibold text-amber-300">भारत सरकार</span>
              <span className="mx-1 text-white/40">|</span>
              Government of India
              <span className="hidden text-slate-200 sm:inline">
                {' '}
                — Ministry of Statistics and Programme Implementation (MoSPI)
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'EN' ? 'HI' : 'EN'))}
              className="rounded-sm px-1.5 py-0.5 font-medium transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            >
              {lang === 'EN' ? 'English / हिंदी' : 'हिंदी / English'}
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            {setFontScale && (
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
            )}
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenAccessibility}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              title="Screen reader & accessibility settings (Ctrl+U / Alt+A)"
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden md:inline">Accessibility Console</span>
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenSahayak}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-amber-300 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              title="StatSkill Sahayak AI Guide (Alt+H)"
            >
              <Bot className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">AI Guide</span>
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
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleEmblemTap}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#0B2E63] text-amber-400 shadow-xs border border-amber-400/80 cursor-pointer"
              title="MoSPI Sovereign Node"
            >
              <IndianFlag variant="circular" width={38} height={38} />
            </button>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="block font-bold text-lg text-[#0B2E63]">
                  StatSkill AI
                </span>
                <span className="rounded bg-[#123E82] px-1.5 py-0.2 text-[10px] font-mono font-semibold text-slate-100 border border-[#1A56A0]">
                  MoSPI Sovereign Node
                </span>
              </div>
              <span className="block text-[11px] font-medium tracking-wide text-slate-500">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय · Mission Karmayogi
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map(({ label, modalKey }) => (
              <button
                key={label}
                type="button"
                onClick={() => onOpenInfo(modalKey)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#0B2E63]/10 hover:text-[#0B2E63] cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden rounded-md border border-[#0B2E63] px-3.5 py-2 text-xs font-semibold text-[#0B2E63] transition hover:bg-[#0B2E63] hover:text-white sm:flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Log In (SSO)
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-xs transition hover:bg-amber-400 cursor-pointer"
            >
              Register
            </button>
            <button
              type="button"
              onClick={onLaunchPortal}
              className="hidden items-center gap-1.5 rounded-full bg-[#1A56A0] hover:bg-[#123E82] px-4 py-2 text-xs font-bold text-white transition md:flex shadow-xs cursor-pointer active:translate-y-[1px]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Launch StatSkill Portal
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-[#0B2E63] lg:hidden cursor-pointer"
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
            className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden shadow-lg"
            aria-label="Mobile"
          >
            <ul className="flex flex-col space-y-1">
              {NAV_ITEMS.map(({ label, modalKey }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenInfo(modalKey);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-[#0B2E63]/10 hover:text-[#0B2E63] cursor-pointer"
                  >
                    <span>{label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                  </button>
                </li>
              ))}
              <li className="mt-3 flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenLogin();
                  }}
                  className="flex-1 rounded-md border border-[#0B2E63] px-4 py-2 text-xs font-semibold text-[#0B2E63]"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onLaunchPortal();
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A56A0] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Launch Portal
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
"""

# 3. LandingHero.tsx
FILES["components/landing/LandingHero.tsx"] = """import React, { useState } from 'react';
import { BookOpen, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface LandingHeroProps {
  onLaunchAssessment: () => void;
  onExploreCourses: () => void;
}

export function LandingHero({ onLaunchAssessment, onExploreCourses }: LandingHeroProps) {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF8F5]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,46,99,0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0B2E63]/20 bg-[#0B2E63]/10 px-3 py-1 text-xs font-semibold text-[#0B2E63]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            National Statistical Systems Training Academy (NSSTA) · Mission Karmayogi
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#0B2E63] md:text-5xl lg:text-6xl">
            StatSkill AI
          </h1>
          <p className="mt-2 text-xl font-bold text-amber-600">
            Sovereign Capacity Building for India's Statistical Cadres
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-700">
            Empowering officers of the Indian Statistical Service (ISS), Subordinate Statistical Service (SSS),
            and State DES with AI-driven, FRAC-aligned diagnostic assessments and role-based continuous learning.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onLaunchAssessment}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B2E63] hover:bg-[#123E82] px-5 py-3 text-sm font-bold text-white shadow-md transition cursor-pointer active:translate-y-[1px]"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              Launch Diagnostic Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreCourses}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0B2E63]/30 bg-white px-5 py-3 text-sm font-bold text-[#0B2E63] transition hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <BookOpen className="h-4 w-4" />
              Browse 880+ MoSPI Courses
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FRAC Dictionary Aligned</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Offline Sets A, B, C, D</span>
            </div>
            <span>•</span>
            <span>xAPI Telemetry Verified</span>
          </div>
        </div>

        {/* Right column — celebratory milestone card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123E82] to-[#0B2E63] p-8 text-white shadow-2xl border border-white/10">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#1A56A0]/60 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/40">
                <Sparkles className="h-3.5 w-3.5" /> MoSPI &amp; National Cadre Milestone
              </span>
              <p className="mt-6 font-mono text-5xl md:text-6xl font-bold leading-none tracking-tight text-white tabular-nums">
                1.7 Crore
                <span className="text-amber-400">+</span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200">
                Civil Servants Onboarded Nationally • <strong>5,200+ Statistical Officers &amp; Enumerators</strong> Active Across 36 States/UTs.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/10">
                  <p className="font-mono text-lg font-bold text-amber-300">94.2%</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">NSS CAPI Proficiency</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/10">
                  <p className="font-mono text-lg font-bold text-emerald-300">36 States/UTs</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">State DES Integration</p>
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
                      activeDot === dot ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"""

# 4. NationalMetricsBar.tsx
FILES["components/landing/NationalMetricsBar.tsx"] = """import React from 'react';
import { Award, BadgeCheck, BookOpen, CheckCircle2, Users } from 'lucide-react';

const METRICS = [
  { icon: Users, value: '1,72,28,635', label: 'Total Karmayogis Onboarded' },
  { icon: BookOpen, value: '6,707', label: 'Total Courses Cataloged' },
  { icon: CheckCircle2, value: '15,23,81,557', label: 'Total Learning Completions' },
  { icon: BadgeCheck, value: '16,40,920', label: 'Monthly Active Learners' },
  { icon: Award, value: '2,12,042', label: 'Certificates Issued Yesterday' },
];

export function NationalMetricsBar() {
  return (
    <section id="metrics" className="bg-[#0B2E63] text-white" aria-label="National live statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-2 px-3 py-4 text-center transition hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-amber-400 transition group-hover:bg-white/15">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-mono text-xl font-bold tabular-nums text-white md:text-2xl">
              {value}
            </span>
            <span className="text-xs leading-snug text-slate-300 text-pretty">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
"""

# 5. RuleToRoleAnalytics.tsx
FILES["components/landing/RuleToRoleAnalytics.tsx"] = """import React from 'react';
import {
  Award,
  Building2,
  Layers,
  Trophy,
  Users2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const COMPETENCIES = [
  { label: 'Domain (NSS, SUT, CPI, Sampling)', value: 1290, color: '#1A56A0' },
  { label: 'Functional (CAPI, R, Python, SQL)', value: 3113, color: '#D97706' },
  { label: 'Behavioural (Governance, Ethics)', value: 1140, color: '#059669' },
];

function CompetencyDonut() {
  const total = COMPETENCIES.reduce((s, c) => s + c.value, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            opacity="0.6"
          />
          {COMPETENCIES.map((c) => {
            const length = (c.value / total) * circumference;
            const dash = `${length} ${circumference - length}`;
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
            );
            offset += length;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex rotate-0 flex-col items-center justify-center">
          <span className="font-mono text-xl font-bold tabular-nums text-[#0B2E63]">
            {total.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Competencies
          </span>
        </div>
      </div>
      <ul className="space-y-2 text-xs flex-1">
        {COMPETENCIES.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-xs shrink-0"
              style={{ backgroundColor: c.color }}
            />
            <span className="text-slate-700 leading-tight">{c.label}</span>
            <span className="ml-auto font-mono font-semibold tabular-nums text-[#0B2E63]">
              {c.value.toLocaleString('en-IN')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TIERS = [
  { tier: 'Group A (ISS Officers & Directors)', onboarded: 96, completed: 92 },
  { tier: 'Group B (SSS - Senior & Junior Statistical Officers)', onboarded: 91, completed: 88 },
  { tier: 'Group C, D & Field CAPI Enumerators', onboarded: 84, completed: 79 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Field Operations Division (FOD-NSSO)', score: '94% Competency Index', color: '#C9A227' },
  { rank: 2, name: 'Data Processing Division (DPD-NSSO)', score: '91% Competency Index', color: '#94a3b8' },
  { rank: 3, name: 'National Accounts Division (NAD-CSO)', score: '88% Competency Index', color: '#b45309' },
  { rank: 4, name: 'Data Informatics & Innovation (DIID-MoSPI)', score: '86% Competency Index', color: '#1A56A0' },
  { rank: 5, name: 'State Directorates of Economics & Statistics (DES)', score: '82% Competency Index', color: '#059669' },
];

const ASPIRATIONS = [
  { label: 'Real-Time CAPI Survey Telemetry & Field Quality', completions: '3,38,80,712', pct: 95 },
  { label: 'AI-Assisted SUT Balancing & GDP Deflators', completions: '1,50,86,052', pct: 78 },
  { label: 'Microdata Anonymisation & DPDP Act 2023 Compliance', completions: '1,10,49,297', pct: 64 },
];

const STATE_GRID = [
  94, 91, 88, 86, 92, 85, 89, 78, 82, 95, 87, 81, 90, 84, 88, 79, 93, 85, 87, 91,
  83, 89, 92, 86, 80, 88, 84, 90,
];

function heatColor(v: number) {
  if (v >= 90) return '#0B2E63';
  if (v >= 85) return '#1A56A0';
  if (v >= 80) return '#60a5fa';
  return '#e2e8f0';
}

export function RuleToRoleAnalytics({ onOpenDashboard }: { onOpenDashboard?: () => void }) {
  return (
    <section id="analytics" className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            National Capacity &amp; Cadre Analytics
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#0B2E63]">
            Rule-to-Role &amp; Democratised Statistical Learning
          </h2>
          <p className="mt-3 text-slate-600">
            Live intelligence on Annual Capacity Building Plans (ACBP), FRAC competency distribution, and
            division-wise progress across MoSPI and 36 State DES.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Rule to Role */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0B2E63]/10 text-[#0B2E63]">
                <Layers className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#0B2E63]">Rule to Role Based Learning (MoSPI ACBP)</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="font-mono text-lg font-bold text-[#0B2E63]">1,434</p>
                  <p className="text-xs text-slate-500">Union CBPs</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="font-mono text-lg font-bold text-[#0B2E63]">2,609</p>
                  <p className="text-xs text-slate-500">State CBPs</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="font-mono text-lg font-bold text-[#0B2E63]">43,45,664</p>
                  <p className="text-xs text-slate-500">Employees with CBPs</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="font-mono text-lg font-bold text-[#0B2E63]">1,23,74,227</p>
                  <p className="text-xs text-slate-500">Role Completions</p>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Competency Distribution
                </p>
                <CompetencyDonut />
              </div>
            </div>
          </div>

          {/* Democratised participation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0B2E63]/10 text-[#0B2E63]">
                <Users2 className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#0B2E63]">Democratised Participation</h3>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Onboarding vs Completion by statistical service tier
            </p>
            <ul className="space-y-4">
              {TIERS.map((t) => (
                <li key={t.tier} className="space-y-1">
                  <span className="text-xs font-semibold text-slate-900 block">{t.tier}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="w-16">Onboarded</span>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A56A0] rounded-full" style={{ width: `${t.onboarded}%` }} />
                      </div>
                      <span className="font-mono font-semibold text-[#0B2E63]">{t.onboarded}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="w-16">Completed</span>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${t.completed}%` }} />
                      </div>
                      <span className="font-mono font-semibold text-emerald-700">{t.completed}%</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ranking + state grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0B2E63]/10 text-[#0B2E63]">
                <Trophy className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#0B2E63]">MoSPI Divisions Ranking</h3>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              36 States &amp; UTs Intensity Grid
            </p>
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {STATE_GRID.map((v, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-xs"
                  style={{ backgroundColor: heatColor(v) }}
                  title={`${v}% active`}
                />
              ))}
            </div>
            <ul className="space-y-2">
              {LEADERBOARD.map((l) => (
                <li
                  key={l.rank}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5"
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{l.name}</p>
                    <p className="text-[10px] text-slate-500">{l.score}</p>
                  </div>
                  <Award
                    className="ml-auto h-3.5 w-3.5 shrink-0"
                    style={{ color: l.color }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Aspirations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0B2E63]/10 text-[#0B2E63]">
                <Building2 className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-[#0B2E63]">Shared Statistical Priorities</h3>
            </div>
            <ul className="space-y-4">
              {ASPIRATIONS.map((a) => (
                <li key={a.label} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-900">{a.label}</span>
                    <span className="font-mono font-bold text-[#0B2E63]">
                      {a.completions} <span className="text-slate-400 font-normal">completions</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1A56A0] to-amber-500"
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* eHRMS banner */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#0B2E63] p-6 text-white sm:flex-row sm:items-center shadow-lg">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold">Right Officer for the Right Statistical Role</p>
              <p className="text-sm text-slate-200">
                Automated competency telemetry syncing with e-HRMS 2.0 electronic service books.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-amber-400 shadow-xs cursor-pointer"
          >
            Explore eHRMS Integration
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
"""

# 6. ShowcasedCoursesCarousel.tsx
FILES["components/landing/ShowcasedCoursesCarousel.tsx"] = """import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Play, BookOpen, Layers, Database, Cpu, TrendingUp, Shield } from 'lucide-react';

type Course = {
  title: string;
  provider: string;
  duration: string;
  domain: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
};

const COURSES: Course[] = [
  {
    title: 'Handling of Unit Level Data of NSS and its Analysis using R',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    duration: '8h 30m',
    domain: 'NSS Microdata & R',
    level: 'Advanced',
    gradient: 'from-blue-900 via-indigo-900 to-[#0B2E63]',
    icon: Database,
  },
  {
    title: 'NSSO Multistage Stratified Sampling & Survey Weighting',
    provider: 'Survey Design and Research Division (SDRD-NSSO)',
    duration: '4h 15m',
    domain: 'Sampling & Estimation',
    level: 'Intermediate',
    gradient: 'from-emerald-900 via-teal-900 to-[#0B2E63]',
    icon: Layers,
  },
  {
    title: 'CAPI Digital Field Data Collection & Paradata Validation',
    provider: 'Field Operations Division (FOD-NSSO)',
    duration: '3h 45m',
    domain: 'Field CAPI Operations',
    level: 'Basic',
    gradient: 'from-amber-900 via-yellow-900 to-[#0B2E63]',
    icon: Cpu,
  },
  {
    title: 'National Accounts: Supply-Use Tables (SUT) & GDP Deflators',
    provider: 'National Accounts Division (NAD-CSO)',
    duration: '6h 20m',
    domain: 'Macroeconomic Accounts',
    level: 'Advanced',
    gradient: 'from-purple-900 via-indigo-950 to-[#0B2E63]',
    icon: TrendingUp,
  },
  {
    title: 'Consumer Price Index (CPI) Geometric Mean & Web Scraping',
    provider: 'Social Statistics Division (SSD-MoSPI)',
    duration: '3h 10m',
    domain: 'Price Statistics & Inflation',
    level: 'Intermediate',
    gradient: 'from-cyan-900 via-sky-950 to-[#0B2E63]',
    icon: BookOpen,
  },
  {
    title: 'Digital Data Governance & Microdata Anonymisation Protocols',
    provider: 'Data Informatics & Innovation Division (DIID-MoSPI)',
    duration: '5h 00m',
    domain: 'DPDP Act & Governance',
    level: 'Advanced',
    gradient: 'from-slate-900 via-blue-950 to-[#0B2E63]',
    icon: Shield,
  },
];

export function ShowcasedCoursesCarousel({
  onSelectCourse,
  onExploreAll,
}: {
  onSelectCourse: (courseTitle: string) => void;
  onExploreAll: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section id="courses" className="bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Curated for the Statistical Cadre
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0B2E63]">
              Showcased Official MoSPI &amp; NSSTA Courses
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              FRAC-aligned e-learning modules designed for Indian Statistical Service &amp; SSS officers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExploreAll}
              className="hidden items-center gap-1 text-sm font-semibold text-[#0B2E63] hover:text-[#1A56A0] sm:flex cursor-pointer"
            >
              Explore all 880+ Catalog
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous courses"
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-[#0B2E63] transition hover:bg-[#0B2E63] hover:text-white cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next courses"
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-[#0B2E63] transition hover:bg-[#0B2E63] hover:text-white cursor-pointer shadow-2xs"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-none"
        >
          {COURSES.map((course) => {
            const Icon = course.icon;
            return (
              <article
                key={course.title}
                className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-lg sm:w-[320px]"
              >
                {/* Custom Card Banner Cover */}
                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${course.gradient} p-4 flex flex-col justify-between text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {course.level}
                    </span>
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900 font-mono">
                      NSSTA Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur-xs text-amber-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-mono font-medium text-slate-200">{course.domain}</p>
                      <p className="text-xs font-bold text-white tracking-wide">MoSPI Cadre Specialization</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-4">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    {course.duration}
                    <span className="mx-1 text-slate-300">•</span>
                    <span className="text-[11px] font-mono font-medium text-[#0B2E63]">{course.domain}</span>
                  </p>
                  <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[14px] font-bold leading-snug text-[#0B2E63] group-hover:text-[#1A56A0] transition">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                    {course.provider}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.title)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#0B2E63]/20 bg-[#0B2E63]/5 px-3 py-2 text-xs font-bold text-[#0B2E63] transition group-hover:bg-[#0B2E63] group-hover:text-white cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Start Diagnostic Assessment
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
"""

# 7. KarmayogiHubsOrbit.tsx
FILES["components/landing/KarmayogiHubsOrbit.tsx"] = """import React from 'react';
import {
  Briefcase,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  Network,
  Play,
  Target,
} from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';

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
];

export function KarmayogiHubsOrbit({ onLaunchAssessment }: { onLaunchAssessment?: () => void }) {
  return (
    <section id="hubs" className="bg-[#0B2E63] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            One Ecosystem, Six Gateways
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            StatSkill AI &amp; Karmayogi Hubs
          </h2>
          <p className="mt-3 text-slate-200">
            A connected capacity-building ecosystem orbiting a single learner
            identity — from first statistical diagnostic to national policy leadership.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {HUBS.map((hub) => {
                const Icon = hub.icon;
                return (
                  <li
                    key={hub.name}
                    className="flex gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{hub.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                        {hub.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Video guide card */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="group relative aspect-video overflow-hidden rounded-xl bg-[#123E82] flex items-center justify-center">
              <button
                type="button"
                onClick={onLaunchAssessment}
                aria-label="Play registration guide video"
                className="grid h-16 w-16 place-items-center rounded-full bg-amber-500 text-slate-900 shadow-lg transition group-hover:scale-110 cursor-pointer"
              >
                <Play className="ml-1 h-7 w-7 fill-current" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full overflow-hidden border border-amber-400">
                  <IndianFlag variant="circular" width={24} height={24} />
                </span>
                <span className="text-xs font-medium text-white/90">
                  StatSkill AI · MoSPI Sovereign Node
                </span>
              </div>
            </div>
            <h3 className="mt-5 text-lg font-bold text-white">
              How to Take Your Baseline Competency Assessment on StatSkill AI?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              A step-by-step video walkthrough covering Jan Parichay SSO, cadre selection (JSO/SSO/ISS/Analyst),
              offline paper sets, and eHRMS credit syncing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
"""

# 8. LandingFooter.tsx
FILES["components/landing/LandingFooter.tsx"] = """import React from 'react';
import { IndianFlag } from '../ui/IndianFlag';
import { InfoModalType } from './LandingInfoModal';

export function LandingFooter({
  onOpenInfo,
}: {
  onOpenInfo?: (type: InfoModalType) => void;
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
                  MoSPI Sovereign Node · Mission Karmayogi
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
              The sovereign capacity-building node for India's Official Statistical System — empowering
              civil servants for a Viksit Bharat with precision AI diagnostics and role-aligned FRAC competencies.
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
                    {'modalKey' in item && onOpenInfo ? (
                      <button
                        type="button"
                        onClick={() => onOpenInfo(item.modalKey)}
                        className="text-left text-sm text-slate-300 transition hover:text-amber-400 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
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
          <p>
            &copy; Copyright 2026-2027 StatSkill AI • Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
          </p>
          <p>Compliant with GIGW 3.0 &amp; WCAG 2.2 AAA Accessibility Standards</p>
        </div>
      </div>
    </footer>
  );
}
"""

# 9. LandingPage.tsx
FILES["pages/LandingPage.tsx"] = """import React, { useState } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingHero } from '../components/landing/LandingHero';
import { NationalMetricsBar } from '../components/landing/NationalMetricsBar';
import { RuleToRoleAnalytics } from '../components/landing/RuleToRoleAnalytics';
import { ShowcasedCoursesCarousel } from '../components/landing/ShowcasedCoursesCarousel';
import { KarmayogiHubsOrbit } from '../components/landing/KarmayogiHubsOrbit';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingInfoModal, InfoModalType } from '../components/landing/LandingInfoModal';

interface LandingPageProps {
  onLaunchAssessment: (courseTopic?: string) => void;
  onExploreCourses: () => void;
  onOpenDashboard: () => void;
  onOpenLogin: () => void;
  onOpenSecretAdmin: () => void;
  onOpenAccessibility: () => void;
  onOpenSahayak: () => void;
}

export function LandingPage({
  onLaunchAssessment,
  onExploreCourses,
  onOpenDashboard,
  onOpenLogin,
  onOpenSecretAdmin,
  onOpenAccessibility,
  onOpenSahayak,
}: LandingPageProps) {
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [fontScale, setFontScale] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col" style={{ fontSize: fontScale === 1 ? undefined : `${Math.round(fontScale * 100)}%` }}>
      <LandingHeader
        onOpenLogin={onOpenLogin}
        onOpenSecretAdmin={onOpenSecretAdmin}
        onOpenAccessibility={onOpenAccessibility}
        onOpenSahayak={onOpenSahayak}
        onOpenInfo={(type) => setInfoModalType(type)}
        onLaunchPortal={() => onLaunchAssessment()}
        fontScale={fontScale}
        setFontScale={setFontScale}
      />

      <main className="flex-1">
        <LandingHero
          onLaunchAssessment={() => onLaunchAssessment()}
          onExploreCourses={onExploreCourses}
        />
        <NationalMetricsBar />
        <RuleToRoleAnalytics onOpenDashboard={onOpenDashboard} />
        <ShowcasedCoursesCarousel
          onSelectCourse={(title) => onLaunchAssessment(title)}
          onExploreAll={onExploreCourses}
        />
        <KarmayogiHubsOrbit onLaunchAssessment={() => onLaunchAssessment()} />
      </main>

      <LandingFooter onOpenInfo={(type) => setInfoModalType(type)} />

      <LandingInfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onLaunchPortal={() => {
          setInfoModalType(null);
          onLaunchAssessment();
        }}
      />
    </div>
  );
}

export default LandingPage;
"""

FILES["components/ui/OfflineStatusBar.tsx"] = """import React, { useState, useEffect } from 'react';
import { WifiOff, Download, CheckCircle2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function OfflineStatusBar() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [justReconnected, setJustReconnected] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  if (isDismissed) return null;

  if (!isOnline) {
    return (
      <aside
        aria-live="assertive"
        aria-label="Network Status Alert"
        className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 shadow-md border-b border-amber-600 animate-fade-in"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-900/20 rounded-full">
              <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
            </span>
            <span>
              <strong>Offline Field Mode Active:</strong> Running from local device cache. Assessment engine and offline question bank are 100% operational.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss offline alert"
            className="text-slate-950 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  if (justReconnected) {
    return (
      <aside
        aria-live="polite"
        aria-label="Connection Restored Alert"
        className="sticky top-0 z-50 bg-emerald-700 text-white px-4 py-2 shadow-md border-b border-emerald-800 animate-fade-in"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Connection Restored - Offline learning telemetry synced with sovereign node.</span>
          </div>
          <button
            type="button"
            onClick={() => setJustReconnected(false)}
            aria-label="Dismiss notification"
            className="text-emerald-200 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  if (installPrompt && !isInstalled) {
    return (
      <aside
        aria-live="polite"
        aria-label="Install PWA Prompt"
        className="bg-[#081F42] text-white border-b border-[#1A56A0] px-4 py-2"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200">
              Install <strong>StatSkill AI</strong> on your mobile or CAPI tablet for offline field survey practice.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-md text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition active:translate-y-[1px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              Install App
            </button>
            <button
              type="button"
              onClick={() => setInstallPrompt(null)}
              aria-label="Dismiss install banner"
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
"""

def build():
    print(f"Generating {len(FILES)} unified landing page files...")
    for rel_path, content in FILES.items():
        full_path = os.path.join(BASE, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  [OK] Wrote {rel_path} ({len(content)} bytes)")
    print("All unified landing files created successfully!")

if __name__ == "__main__":
    build()


