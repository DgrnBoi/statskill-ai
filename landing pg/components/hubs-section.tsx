'use client'

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
