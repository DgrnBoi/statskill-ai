'use client'

import { useState } from 'react'
import { KeyRound, Lock, ShieldAlert } from 'lucide-react'
import { ModalShell } from './modal-shell'

const ADMIN_PIN = 'MOSPI2026'

export function AdminModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'granted'>('idle')

  function handleClose() {
    setPin('')
    setStatus('idle')
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(pin === ADMIN_PIN ? 'granted' : 'error')
  }

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Ministerial Access Gateway"
      subtitle="Restricted · ACBP Capacity Building Dossier"
      labelledBy="admin-title"
    >
      {status === 'granted' ? (
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald/10 text-emerald">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-navy">
            Access Granted
          </h3>
          <p className="mt-2 text-sm text-neutral-700">
            Welcome, Administrator. Loading the Annual Capacity Building Plan (ACBP)
            dossier and MDO reporting console…
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {['Enrolments', 'Completions', 'Certificates'].map((label) => (
              <div key={label} className="rounded-lg bg-muted p-3">
                <p className="font-mono text-sm font-bold text-navy">•••</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-3 rounded-lg border border-saffron/40 bg-saffron-light/60 p-3 text-xs text-neutral-700">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
            <p>
              This gateway is reserved for authorised MDO and ministry
              administrators. All access attempts are logged.
            </p>
          </div>

          <label
            htmlFor="admin-pin"
            className="mb-1.5 mt-5 block text-sm font-medium text-navy"
          >
            Ministerial PIN
          </label>
          <div className="flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <input
              id="admin-pin"
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                setStatus('idle')
              }}
              placeholder="Enter secure PIN"
              className="w-full bg-transparent py-2.5 font-mono text-sm tracking-widest outline-none"
              autoComplete="off"
            />
          </div>

          {status === 'error' && (
            <p className="mt-2 text-xs font-medium text-destructive">
              Invalid PIN. Access denied. This attempt has been recorded.
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Authenticate
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Hint for demo: the PIN is{' '}
            <span className="font-mono font-semibold text-navy">MOSPI2026</span>
          </p>
        </form>
      )}
    </ModalShell>
  )
}
