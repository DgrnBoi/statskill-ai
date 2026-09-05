import { Award, BadgeCheck, BookOpen, CheckCircle2, Users } from 'lucide-react'

const METRICS = [
  { icon: Users, value: '1,72,28,635', label: 'Total Karmayogis Onboarded' },
  { icon: BookOpen, value: '6,707', label: 'Total Courses Cataloged' },
  { icon: CheckCircle2, value: '15,23,81,557', label: 'Total Learning Completions' },
  { icon: BadgeCheck, value: '16,40,920', label: 'Monthly Active Users' },
  { icon: Award, value: '2,12,042', label: 'Certificates Issued Yesterday' },
]

export function MetricsBar() {
  return (
    <section id="metrics" className="bg-navy" aria-label="National live statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group flex flex-col items-center gap-2 px-3 py-4 text-center transition hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-gold transition group-hover:bg-white/15">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-mono text-xl font-bold tabular-nums text-white md:text-2xl">
              {value}
            </span>
            <span className="text-xs leading-snug text-white/70 text-pretty">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
