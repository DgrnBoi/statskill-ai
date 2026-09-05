'use client'

import { useState } from 'react'
import { BookOpen, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import { SOCIAL_LINKS as SOCIALS } from './social-icons'

export function HeroSection() {
  const [activeDot, setActiveDot] = useState(0)

  return (
    <section id="hero" className="relative overflow-hidden bg-parchment">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,46,99,0.06) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-100 px-3 py-1 text-xs font-semibold text-navy">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            National Statistical Systems Training Academy (NSSTA) · Mission Karmayogi
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-navy text-balance md:text-5xl lg:text-6xl">
            StatSkill AI
          </h1>
          <p className="mt-2 text-xl font-semibold text-saffron">
            Sovereign Capacity Building for India's Statistical Cadres
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700 text-pretty">
            Empowering officers of the Indian Statistical Service (ISS), Subordinate Statistical Service (SSS),
            and State DES with AI-driven, FRAC-aligned diagnostic assessments and role-based continuous learning.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-navy-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-700 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-gold" />
              Launch Diagnostic Assessment
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 rounded-md border border-navy/25 bg-card px-5 py-3 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy-100"
            >
              <BookOpen className="h-4 w-4" />
              Browse 880+ MoSPI Courses
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Official Channels
            </span>
            <div className="flex gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white/90 transition hover:bg-navy-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — celebratory milestone card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-navy-700 p-8 text-white shadow-xl">
            {/* confetti */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {[
                ['8%', '12%', 'var(--gold)'],
                ['22%', '80%', 'var(--saffron)'],
                ['70%', '18%', 'var(--emerald)'],
                ['85%', '70%', 'var(--gold)'],
                ['45%', '90%', 'var(--saffron)'],
                ['12%', '55%', 'var(--emerald)'],
              ].map(([top, left, color], i) => (
                <span
                  key={i}
                  className="absolute h-2 w-2 rounded-[2px]"
                  style={{
                    top,
                    left,
                    backgroundColor: color,
                    transform: `rotate(${i * 40}deg)`,
                    opacity: 0.9,
                  }}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-navy-500/50 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/40">
                <Sparkles className="h-3.5 w-3.5" /> MoSPI &amp; National Cadre Milestone
              </span>
              <p className="mt-6 font-mono text-5xl md:text-6xl font-bold leading-none tracking-tight tabular-nums">
                1.7 Crore
                <span className="text-gold">+</span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90">
                Civil Servants Onboarded Nationally • <strong>5,200+ Statistical Officers &amp; Enumerators</strong> Active Across 36 States/UTs.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur-xs">
                  <p className="font-mono text-base font-bold text-gold">94.2%</p>
                  <p className="text-white/70 text-[11px]">NSS CAPI Proficiency</p>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur-xs">
                  <p className="font-mono text-base font-bold text-emerald-300">36 States/UTs</p>
                  <p className="text-white/70 text-[11px]">State DES Integration</p>
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
                      activeDot === dot ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
