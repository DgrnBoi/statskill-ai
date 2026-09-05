'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AccessibilityConsole,
  type A11yFlag,
  A11Y_TILES,
} from './accessibility-console'
import { AdminModal } from './admin-modal'
import { AiAssistant } from './ai-assistant'
import { AnalyticsSection } from './analytics-section'
import { CoursesSection } from './courses-section'
import { HeroSection } from './hero-section'
import { HubsSection } from './hubs-section'
import { LoginModal } from './login-modal'
import { MetricsBar } from './metrics-bar'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { InfoModal, type InfoModalType } from './info-modal'

const FLAG_CLASS: Record<A11yFlag, string> = {
  'low-saturation': 'a11y-low-saturation',
  'high-contrast': 'a11y-high-contrast',
  'highlight-links': 'a11y-highlight-links',
  'bigger-text': 'a11y-bigger-text',
  'text-spacing': 'a11y-text-spacing',
  'pause-animations': 'a11y-pause-animations',
  'hide-images': 'a11y-hide-images',
  dyslexia: 'a11y-dyslexia',
  'big-cursor': 'a11y-big-cursor',
  tooltips: 'a11y-tooltips',
  'line-height': 'a11y-line-height',
  'text-align': 'a11y-text-left',
}

const INITIAL_FLAGS = Object.fromEntries(
  A11Y_TILES.map((t) => [t.key, false]),
) as Record<A11yFlag, boolean>

export function SiteShell() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [a11yOpen, setA11yOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null)
  const [flags, setFlags] = useState<Record<A11yFlag, boolean>>(INITIAL_FLAGS)
  const [fontScale, setFontScale] = useState(1)

  // apply accessibility classes to <html>
  useEffect(() => {
    const root = document.documentElement
    ;(Object.keys(FLAG_CLASS) as A11yFlag[]).forEach((flag) => {
      root.classList.toggle(FLAG_CLASS[flag], flags[flag])
    })
  }, [flags])

  // apply font scale to <html>
  useEffect(() => {
    document.documentElement.style.fontSize =
      fontScale === 1 ? '' : `${Math.round(fontScale * 100)}%`
  }, [fontScale])

  // global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      if (e.ctrlKey && e.shiftKey && key === 'a') {
        e.preventDefault()
        setAdminOpen(true)
        return
      }
      if ((e.ctrlKey && key === 'u') || (e.altKey && key === 'a')) {
        e.preventDefault()
        setA11yOpen((o) => !o)
        return
      }
      if (e.altKey && key === 'h') {
        e.preventDefault()
        setAssistantOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleFlag = useCallback((flag: A11yFlag) => {
    setFlags((f) => ({ ...f, [flag]: !f[flag] }))
  }, [])

  const resetFlags = useCallback(() => {
    setFlags(INITIAL_FLAGS)
    setFontScale(1)
  }, [])

  return (
    <>
      <SiteHeader
        onOpenLogin={() => setLoginOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenA11y={() => setA11yOpen(true)}
        onOpenInfo={(type) => setInfoModalType(type)}
        fontScale={fontScale}
        setFontScale={setFontScale}
      />
      <main>
        <HeroSection />
        <MetricsBar />
        <AnalyticsSection />
        <CoursesSection />
        <HubsSection />
      </main>
      <SiteFooter onOpenInfo={(type) => setInfoModalType(type)} />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onLaunchPortal={() => {
          window.open('http://localhost:5173', '_blank')
        }}
      />
      <AccessibilityConsole
        open={a11yOpen}
        onClose={() => setA11yOpen(false)}
        flags={flags}
        onToggle={toggleFlag}
        onReset={resetFlags}
      />
      <AiAssistant open={assistantOpen} setOpen={setAssistantOpen} />
    </>
  )
}
