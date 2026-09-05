'use client'

import { useState } from 'react'
import { ShieldCheck, Smartphone, Sparkles, ExternalLink } from 'lucide-react'
import { ModalShell } from './modal-shell'

export function LoginModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [identifier, setIdentifier] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  function reset() {
    setIdentifier('')
    setOtpSent(false)
    setOtp(['', '', '', '', '', ''])
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Jan Parichay Single Sign-On"
      subtitle="Government of India Sovereign Identity Gateway"
      labelledBy="login-title"
    >
      <a
        href="http://localhost:5173"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-navy bg-navy-100 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white cursor-pointer shadow-xs"
      >
        <ShieldCheck className="h-4 w-4 text-emerald" />
        Continue with Jan Parichay (SSO)
        <ExternalLink className="h-3.5 w-3.5 ml-1" />
      </a>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or verify with registered mobile / email OTP
        <span className="h-px flex-1 bg-border" />
      </div>

      {!otpSent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (identifier.trim()) setOtpSent(true)
          }}
        >
          <label
            htmlFor="login-id"
            className="mb-1.5 block text-sm font-medium text-navy"
          >
            Official Email (@gov.in / @nic.in) or Mobile
          </label>
          <div className="flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <input
              id="login-id"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. jso.sharma@mospi.gov.in or 98XXXXXX10"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-saffron px-4 py-2.5 text-sm font-semibold text-slate-deep transition hover:brightness-105 cursor-pointer shadow-xs"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4 text-sm text-neutral-700">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-navy">{identifier}</span>.
          </p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="h-12 w-full rounded-md border border-input bg-card text-center font-mono text-lg font-bold text-navy outline-none focus:ring-2 focus:ring-ring"
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            Verify &amp; Enter StatSkill Portal
          </a>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="mt-3 w-full text-center text-xs font-medium text-navy-500 hover:underline cursor-pointer"
          >
            Change mobile / email
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        New to StatSkill AI?{' '}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-saffron hover:underline"
        >
          Register your MoSPI cadre profile
        </a>
      </p>
    </ModalShell>
  )
}
