'use client'

import { useEffect } from 'react'
import {
  AlignLeft,
  Contrast,
  Droplet,
  EyeOff,
  Link2,
  MousePointer2,
  PauseCircle,
  RotateCcw,
  Rows3,
  Spline,
  Type,
  X,
} from 'lucide-react'

export type A11yFlag =
  | 'low-saturation'
  | 'high-contrast'
  | 'highlight-links'
  | 'bigger-text'
  | 'text-spacing'
  | 'pause-animations'
  | 'hide-images'
  | 'dyslexia'
  | 'big-cursor'
  | 'tooltips'
  | 'line-height'
  | 'text-align'

export const A11Y_TILES: {
  key: A11yFlag
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: 'low-saturation', label: 'Low Saturation', icon: Droplet },
  { key: 'high-contrast', label: 'Contrast +', icon: Contrast },
  { key: 'highlight-links', label: 'Highlight Links', icon: Link2 },
  { key: 'bigger-text', label: 'Bigger Text', icon: Type },
  { key: 'text-spacing', label: 'Text Spacing', icon: Spline },
  { key: 'pause-animations', label: 'Pause Animations', icon: PauseCircle },
  { key: 'hide-images', label: 'Hide Images', icon: EyeOff },
  { key: 'dyslexia', label: 'Dyslexia Friendly', icon: Type },
  { key: 'big-cursor', label: 'Oversized Cursor', icon: MousePointer2 },
  { key: 'tooltips', label: 'Tooltips', icon: Rows3 },
  { key: 'line-height', label: 'Line Height', icon: Rows3 },
  { key: 'text-align', label: 'Text Align', icon: AlignLeft },
]

export function AccessibilityConsole({
  open,
  onClose,
  flags,
  onToggle,
  onReset,
}: {
  open: boolean
  onClose: () => void
  flags: Record<A11yFlag, boolean>
  onToggle: (flag: A11yFlag) => void
  onReset: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close accessibility console"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-deep/40"
        />
      )}
      <aside
        aria-label="Accessibility console"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[90vw] flex-col bg-card shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border bg-navy px-5 py-4 text-white">
          <div>
            <h2 className="font-display text-base font-semibold">
              Accessibility Console
            </h2>
            <p className="text-[11px] text-white/60">CTRL + U · Alt + A</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-y-auto p-4">
          {A11Y_TILES.map(({ key, label, icon: Icon }) => {
            const active = flags[key]
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(key)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-medium transition ${
                  active
                    ? 'border-navy bg-navy-100 text-navy ring-1 ring-navy'
                    : 'border-border bg-card text-neutral-700 hover:border-navy/40 hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            )
          })}
        </div>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-saffron px-4 py-2.5 text-sm font-semibold text-slate-deep transition hover:brightness-105"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Settings
          </button>
        </div>
      </aside>
    </>
  )
}
