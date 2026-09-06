import React from 'react';
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
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

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
  const dialogRef = useDialogAccessibility(Boolean(type), onClose);
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
      subtitle: 'Smart India Hackathon prototype for statistical capacity building',
      icon: Building2,
      content: (
        <div className="space-y-4 text-sm text-slate-700">
          <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-4">
            <h4 className="font-bold text-[#0B2E63] flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-amber-500" />
              Sovereign Capacity Building Mission
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-800">
              StatSkill AI is a Smart India Hackathon prototype exploring an artificial-intelligence
              competency diagnostic workflow for statistical officers. It is designed around Mission
              Karmayogi and MoSPI training use cases; it is not an official government deployment.
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
                  <strong>xAPI Telemetry &amp; Governance:</strong> A prototype xAPI statement workflow for
                  future learning-record integration, designed with data-minimisation in mind.
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
      title: 'Prototype Newsroom',
      subtitle: 'Illustrative cards for a future verified announcements feed',
      icon: Newspaper,
      content: (
        <div className="space-y-3.5 text-sm">
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            These sample stories demonstrate the proposed newsroom layout. They are not official
            MoSPI announcements; verify current releases on the ministry website.
          </p>
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
                  Sample · {item.tag}
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
      title: 'Prototype Procurement Directory',
      subtitle: 'Illustrative tender cards with a link to the official procurement portal',
      icon: FileText,
      content: (
        <div className="space-y-3.5 text-sm">
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            The entries below are interface samples, not active tenders. Use the official CPPP portal
            for current notices, documents, deadlines, and eligibility rules.
          </p>
          {[
            {
              id: 'MoSPI/DIID/2026/RFP-08',
              title: 'Supply and Maintenance of High-Security CAPI Tablet Terminals with Biometric 2FA',
              value: '₹ 14.80 Crore',
              closing: 'September 28, 2026 (15:00 IST)',
              status: 'Illustrative only',
            },
            {
              id: 'NSSTA/EST-2026/EOI-04',
              title: 'Empanelment of Academic Institutions for Specialized Masterclasses in Machine Learning for Official Statistics',
              value: '₹ 2.40 Crore',
              closing: 'October 12, 2026 (17:00 IST)',
              status: 'Illustrative only',
            },
            {
              id: 'MoSPI/NAD/2026/CONS-02',
              title: 'Consultancy Services for Satellite Accounts Integration & Environmental Economic Accounting (SEEA)',
              value: '₹ 3.15 Crore',
              closing: 'October 05, 2026 (14:00 IST)',
              status: 'Illustrative only',
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
      title: 'Prototype Circulars Directory',
      subtitle: 'Illustrative notification cards for the proposed portal',
      icon: Bell,
      content: (
        <div className="space-y-3 text-sm">
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            These reference cards are sample content for the SIH prototype and are not gazette notices
            or official administrative directions.
          </p>
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
      subtitle: 'Prototype guidance for assessment, catalog, sign-in, and offline use',
      icon: HelpCircle,
      content: (
        <div className="space-y-4 text-sm text-slate-700">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-3.5">
              <div className="flex items-center gap-2 text-[#0B2E63] font-semibold text-xs">
                <Phone className="h-4 w-4 text-amber-600" />
                <span>Prototype support status</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#0B2E63]">No live helpline connected</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Use the in-app guide during this demo.</p>
            </div>

            <div className="rounded-xl border border-[#0B2E63]/20 bg-[#0B2E63]/5 p-3.5">
              <div className="flex items-center gap-2 text-[#0B2E63] font-semibold text-xs">
                <Mail className="h-4 w-4 text-amber-600" />
                <span>Support mailbox</span>
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-[#0B2E63] break-all">
                Not configured
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">No messages are sent by this prototype.</p>
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
                  Click 'Log In' and choose one of the four demo officer profiles. The prototype
                  requests a signed session token from its own backend; it does not connect to Jan
                  Parichay or ask for real government credentials.
                </p>
              </details>

              <details className="group rounded-lg bg-slate-50 p-2.5 cursor-pointer">
                <summary className="font-semibold text-[#0B2E63] list-none flex items-center justify-between">
                  How are diagnostic test results reflected in my eHRMS profile?
                  <ChevronRight className="h-4 w-4 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-slate-600 leading-relaxed pl-1">
                  It is not connected to e-HRMS. Completed assessment summaries are saved in this
                  browser so the dashboard can preserve progress across refreshes.
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
      ref={dialogRef}
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
