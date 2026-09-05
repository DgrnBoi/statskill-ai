'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X, ExternalLink } from 'lucide-react'
import { LotusMark } from './emblems'

const JUMP_CHIPS = [
  { label: 'Live Statistics', href: '#metrics' },
  { label: 'Cadre Analytics', href: '#analytics' },
  { label: 'Showcased Courses', href: '#courses' },
  { label: 'StatSkill Hubs', href: '#hubs' },
]

type Message = { from: 'bot' | 'user'; text: string }

export function AiAssistant({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (updater: (v: boolean) => boolean) => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: 'Namaste! I am StatSkill Sahayak, your MoSPI AI Guide. Ask me anything about NSS rounds, CAPI field verification, SUT balancing, FRAC competencies, or NSSTA courses.',
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function jumpTo(href: string, label: string) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMessages((m) => [
      ...m,
      { from: 'user', text: `Take me to ${label}` },
      { from: 'bot', text: `Navigating to ${label}. Let me know if you need specific course modules or diagnostic tests.` },
    ])
  }

  function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const lower = text.toLowerCase()
    let reply = 'Thank you for your query. Use the quick navigation chips below or enter the StatSkill Portal to take your diagnostic assessment.'

    if (lower.includes('capi') || lower.includes('field') || lower.includes('enumerator')) {
      reply = 'CAPI (Computer Assisted Personal Interviewing) protocols cover field data collection, automated validation checks, and paradata quality monitoring. Explore the FOD-NSSO course in Showcased Courses!'
    } else if (lower.includes('r') || lower.includes('nss') || lower.includes('unit level') || lower.includes('microdata')) {
      reply = 'The NSSTA course "Handling of Unit Level Data of NSS and its Analysis using R" is available in the Showcased Courses section (8h 30m).'
    } else if (lower.includes('sut') || lower.includes('gdp') || lower.includes('national accounts')) {
      reply = 'Supply-Use Tables (SUT) balancing and GDP deflators are curated under National Accounts Division (NAD-CSO). You can test your macro accounts proficiency in the portal.'
    } else if (lower.includes('login') || lower.includes('sso') || lower.includes('parichay')) {
      reply = 'You can sign in using your official @gov.in / @nic.in credentials via Jan Parichay SSO by clicking the Log In button in the header.'
    } else if (lower.includes('test') || lower.includes('assessment') || lower.includes('offline') || lower.includes('paper')) {
      reply = 'The StatSkill AI engine includes an offline question bank cycling across Sets A, B, C, and D with anti-spam security. Click "Launch StatSkill Portal" to take your test!'
    }

    setMessages((m) => [
      ...m,
      { from: 'user', text },
      { from: 'bot', text: reply },
    ])
    setInput('')
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 bg-navy px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-gold">
              <LotusMark className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">StatSkill Sahayak</p>
              <p className="flex items-center gap-1 text-[11px] text-white/70 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> MoSPI AI Guide · Alt + H
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(() => false)}
              aria-label="Close assistant"
              className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-72 flex-col gap-3 overflow-y-auto bg-parchment px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'rounded-br-sm bg-navy-500 text-white'
                      : 'rounded-bl-sm bg-card text-neutral-800 ring-1 ring-border shadow-2xs'
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-card px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {JUMP_CHIPS.map((chip) => (
                <button
                  key={chip.href}
                  type="button"
                  onClick={() => jumpTo(chip.href, chip.label)}
                  className="rounded-full border border-navy/20 bg-navy-100 px-3 py-1 text-xs font-medium text-navy transition hover:bg-navy hover:text-white cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <form onSubmit={send} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask StatSkill Sahayak…"
                className="flex-1 rounded-full border border-input bg-card px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron text-slate-deep transition hover:brightness-105 cursor-pointer shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open StatSkill Sahayak AI assistant"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-xl ring-2 ring-gold/40 transition hover:bg-navy-700 cursor-pointer"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <span className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="absolute -right-2 -top-2 h-3.5 w-3.5 text-gold" />
          </span>
        )}
      </button>
    </>
  )
}
