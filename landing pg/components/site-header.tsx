'use client'

import { useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Type,
  Volume2,
  X,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react'
import { AshokaChakra, LotusMark } from './emblems'
import type { InfoModalType } from './info-modal'

type HeaderProps = {
  onOpenLogin: () => void
  onOpenAdmin: () => void
  onOpenA11y: () => void
  onOpenInfo: (type: InfoModalType) => void
  fontScale: number
  setFontScale: (updater: (v: number) => number) => void
}

const NAV_ITEMS: { label: string; modalKey: NonNullable<InfoModalType> }[] = [
  { label: 'About Us', modalKey: 'about' },
  { label: 'Newsroom', modalKey: 'newsroom' },
  { label: 'Career', modalKey: 'career' },
  { label: 'Tenders', modalKey: 'tenders' },
  { label: 'Notifications', modalKey: 'notifications' },
  { label: 'Help Centre', modalKey: 'help' },
]

export function SiteHeader({
  onOpenLogin,
  onOpenAdmin,
  onOpenA11y,
  onOpenInfo,
  fontScale,
  setFontScale,
}: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN')
  const [mobileOpen, setMobileOpen] = useState(false)
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleEmblemTap() {
    tapCount.current += 1
    if (tapTimer.current) clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0
    }, 700)
    if (tapCount.current >= 3) {
      tapCount.current = 0
      onOpenAdmin()
    }
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top ministerial micro-bar */}
      <div className="bg-navy text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] md:text-xs">
          <button
            type="button"
            onClick={handleEmblemTap}
            className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-left transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
            title="Government of India • Click 3 times for Admin Gateway"
          >
            <AshokaChakra className="h-5 w-5 shrink-0 text-gold" />
            <span className="leading-tight">
              <span className="font-semibold text-amber-300">भारत सरकार</span>
              <span className="mx-1 text-white/40">|</span>
              Government of India
              <span className="hidden text-white/70 sm:inline">
                {' '}
                — Ministry of Statistics and Programme Implementation (MoSPI)
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className="rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Skip to Main Content
            </a>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'EN' ? 'HI' : 'EN'))}
              className="rounded-sm px-1.5 py-0.5 font-medium transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
            >
              {lang === 'EN' ? 'English / हिंदी' : 'हिंदी / English'}
            </button>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-1" aria-label="Adjust text size">
              <button
                type="button"
                onClick={() => setFontScale((v) => Math.max(0.9, +(v - 0.1).toFixed(2)))}
                className="h-5 w-5 rounded-sm text-[10px] font-bold transition hover:bg-white/10 cursor-pointer"
                title="Decrease text size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontScale(() => 1)}
                className="h-5 w-5 rounded-sm text-xs font-bold transition hover:bg-white/10 cursor-pointer"
                title="Reset text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale((v) => Math.min(1.4, +(v + 0.1).toFixed(2)))}
                className="h-5 w-5 rounded-sm text-sm font-bold transition hover:bg-white/10 cursor-pointer"
                title="Increase text size"
              >
                A+
              </button>
            </div>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <button
              type="button"
              onClick={onOpenA11y}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
              title="Screen reader & accessibility settings (Ctrl+U / Alt+A)"
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden md:inline">Screen Reader Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tricolor divider accent */}
      <div
        className="h-[3px] w-full"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
        }}
      />

      {/* Main navbar */}
      <div className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold shadow-xs transition group-hover:scale-105">
              <LotusMark className="h-7 w-7" />
            </span>
            <span className="leading-tight">
              <span className="flex items-center gap-2">
                <span className="block font-display text-lg font-bold text-navy">
                  StatSkill AI
                </span>
                <span className="rounded bg-navy-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-navy border border-navy/20">
                  MoSPI Sovereign Node
                </span>
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-muted-foreground">
                सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय · NSSTA Capacity Hub
              </span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map(({ label, modalKey }) => (
              <button
                key={label}
                type="button"
                onClick={() => onOpenInfo(modalKey)}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-navy-100 hover:text-navy cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white sm:block cursor-pointer"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-md bg-saffron px-4 py-2 text-sm font-semibold text-slate-deep shadow-xs transition hover:brightness-105 cursor-pointer"
            >
              Register
            </button>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="animate-pulse-badge hidden items-center gap-1.5 rounded-full bg-navy-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 md:flex shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              Launch StatSkill Portal
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-md border border-border text-navy lg:hidden cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            className="border-t border-border bg-card px-4 py-3 lg:hidden shadow-lg"
            aria-label="Mobile"
          >
            <ul className="flex flex-col space-y-1">
              {NAV_ITEMS.map(({ label, modalKey }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenInfo(modalKey)
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-navy-100 hover:text-navy cursor-pointer"
                  >
                    <span>{label}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
                  </button>
                </li>
              ))}
              <li className="mt-3 flex gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    onOpenLogin()
                  }}
                  className="flex-1 rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy"
                >
                  Log In
                </button>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy-500 px-4 py-2 text-sm font-semibold text-white shadow-xs"
                >
                  <Sparkles className="h-4 w-4 text-gold" /> Launch Portal
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
