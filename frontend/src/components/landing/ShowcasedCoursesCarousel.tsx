import React, { useRef } from 'react';
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
