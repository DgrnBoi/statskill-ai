import React from 'react';
import {
  Award,
  Building2,
  Layers,
  Trophy,
  Users2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CountUpNumber } from '../ui/CountUpNumber';

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
            <CountUpNumber end={total} duration={1500} />
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
