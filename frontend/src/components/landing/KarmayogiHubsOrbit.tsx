import React from 'react';
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
