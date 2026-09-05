/* Hallmark · macrostructure: Split Diptych / Workbench · genre: modern-minimal */
/* states: default · hover · focus · active · disabled */
/* contrast: pass (WCAG AA 4.5:1+) */

import { Building2, ChevronRight, Landmark, LockKeyhole, Smartphone, UserRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { IndianFlag } from '../components/ui/IndianFlag';

export interface DemoOfficer {
  id: string;
  name: string;
  designation: string;
  division: string;
  cadre: string;
  parichayId: string;
}

export const DEMO_OFFICERS: DemoOfficer[] = [
  { id: 'jso', name: 'Eshaan Sunthankar', designation: 'Junior Statistical Officer (JSO)', division: 'Field Operations Division (FOD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_1042_NSSO' },
  { id: 'sso', name: 'Ananya Mehta', designation: 'Senior Statistical Officer (SSO)', division: 'Data Processing Division (DPD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_2088_NSSO' },
  { id: 'assistant-director', name: 'Rohan Iyer', designation: 'Assistant Director (ISS)', division: 'National Accounts Division (NAD)', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_3612_ISS' },
  { id: 'director', name: 'Kavita Rao', designation: 'Director (ISS)', division: 'Data Informatics & Innovation Division (DIID)', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_4820_ISS' },
];

interface LoginPageProps {
  onAuthenticate?: (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => void;
  onBack?: () => void;
}

export default function LoginPage({ onAuthenticate, onBack }: LoginPageProps) {
  const [method, setMethod] = useState<'parichay-id' | 'mobile-otp'>('parichay-id');
  const [selectedOfficer, setSelectedOfficer] = useState(DEMO_OFFICERS[0]);

  return (
    <main className="min-h-screen bg-[#F5F6F8] text-slate-900 font-body">
      <header className="border-b-[3px] border-[#D96B07] bg-[#0B2E63] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <IndianFlag variant="circular" width={42} height={42} className="shadow-xs" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 font-mono">Government of India</p>
              <h1 className="text-base font-bold text-white font-display">MeriPehchan · Jan Parichay</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-blue-100/80 sm:block font-mono">National Single Sign-On</span>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to StatSkill Portal"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A56A0] bg-[#123E82] px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-[#1A56A0] hover:text-white cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Portal
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14 items-center">
        <div className="flex flex-col justify-center">
          <Badge variant="saffron" className="w-fit">MoSPI Secure Gateway</Badge>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-[#0B2E63] sm:text-4xl font-display">
            Sign in to your StatSkill workspace.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700">
            Access the sovereign capability building environment for India’s official statistical system, mapped directly to your cadre profile and FRAC competency benchmarks.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['National SSO', 'Zero password storage in portal'],
              ['Cadre Aware', 'Tailored to SSS & ISS officers'],
              ['Edge Ready', 'Reliable in remote field stations'],
            ].map(([title, detail]) => (
              <div key={title} className="border-l-2 border-[#D96B07] pl-3 py-1 bg-white/60 rounded-r-lg border-y border-r border-slate-200/60 shadow-xs">
                <p className="text-xs font-bold text-[#0B2E63] font-display">{title}</p>
                <p className="mt-0.5 text-[11px] leading-normal text-slate-600 font-body">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2.5 text-xs text-slate-600 bg-emerald-50 border border-emerald-200/90 rounded-lg p-3 max-w-md">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Compliant with National Data Governance Framework & MoSPI IT Security Policy 2026.</span>
          </div>
        </div>

        <Card className="overflow-hidden shadow-lg border border-slate-200/90 bg-white">
          <div className="bg-[#0B2E63] px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-amber-300">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-display text-base">Access via Jan Parichay</h3>
                <p className="mt-0.5 text-xs text-blue-100/90">Use your National Single Sign-On credentials to proceed.</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-7">
            <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                aria-pressed={method === 'parichay-id'}
                onClick={() => setMethod('parichay-id')}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  method === 'parichay-id'
                    ? 'bg-white text-[#0B2E63] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserRound className="mr-1.5 inline h-3.5 w-3.5" />
                Parichay ID
              </button>
              <button
                type="button"
                aria-pressed={method === 'mobile-otp'}
                onClick={() => setMethod('mobile-otp')}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  method === 'mobile-otp'
                    ? 'bg-white text-[#0B2E63] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="mr-1.5 inline h-3.5 w-3.5" />
                Mobile OTP
              </button>
            </div>

            <div className="mt-5 rounded-lg border border-blue-200/70 bg-blue-50/70 p-3.5 text-xs text-slate-800 flex items-start gap-2">
              <LockKeyhole className="h-4 w-4 text-[#0B2E63] shrink-0 mt-0.5" />
              <span>
                {method === 'parichay-id'
                  ? 'Authenticate securely using your verified civil-service Parichay ID.'
                  : 'A one-time verification passcode will be transmitted to your registered mobile number.'}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide font-display">
                  Select Officer Role
                </label>
                <Badge variant="neutral">1-Click Fast SSO</Badge>
              </div>

              <div className="mt-3 grid gap-2">
                {DEMO_OFFICERS.map((officer) => (
                  <button
                    type="button"
                    aria-pressed={selectedOfficer.id === officer.id}
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    className={`rounded-lg border p-3 text-left transition-all cursor-pointer active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      selectedOfficer.id === officer.id
                        ? 'border-[#0B2E63] bg-[#0B2E63]/5 ring-1 ring-[#0B2E63]'
                        : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#0B2E63] font-display">{officer.designation}</p>
                        <p className="mt-0.5 text-[11px] text-slate-600 font-body">{officer.division}</p>
                      </div>
                      <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="saffron"
              size="lg"
              className="mt-6 w-full"
              onClick={() => onAuthenticate?.(selectedOfficer, method)}
            >
              Continue as {selectedOfficer.designation}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            <p className="mt-4 text-center text-[11px] leading-normal text-slate-500 font-body">
              StatSkill AI does not store civil-service credentials. Identity verification is managed by National Jan Parichay SSO.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

