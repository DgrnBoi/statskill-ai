import {
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
