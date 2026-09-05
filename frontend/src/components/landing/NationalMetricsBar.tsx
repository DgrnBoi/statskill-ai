import React from 'react';
import { Award, BadgeCheck, BookOpen, CheckCircle2, Users } from 'lucide-react';
import { CountUpNumber } from '../ui/CountUpNumber';

const METRICS = [
  { icon: Users, end: 17228635, label: 'Total Karmayogis Onboarded' },
  { icon: BookOpen, end: 6707, label: 'Total Courses Cataloged' },
  { icon: CheckCircle2, end: 152381557, label: 'Total Learning Completions' },
  { icon: BadgeCheck, end: 1640920, label: 'Monthly Active Learners' },
  { icon: Award, end: 212042, label: 'Certificates Issued Yesterday' },
];

export function NationalMetricsBar() {
  return (
    <section id="metrics" className="bg-[#0B2E63] text-white" aria-label="National live statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map(({ icon: Icon, end, label }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-2 px-3 py-4 text-center transition hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-amber-400 transition group-hover:bg-white/15">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-mono text-xl font-bold tabular-nums text-white md:text-2xl">
              <CountUpNumber end={end} duration={1800} />
            </span>
            <span className="text-xs leading-snug text-slate-300 text-pretty">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
