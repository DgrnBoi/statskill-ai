import React, { useState } from 'react';
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
