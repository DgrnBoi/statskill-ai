import { Building2, ChevronRight, Landmark, LockKeyhole, Smartphone, UserRound } from 'lucide-react';
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
}

export default function LoginPage({ onAuthenticate }: LoginPageProps) {
  const [method, setMethod] = useState<'parichay-id' | 'mobile-otp'>('parichay-id');
  const [selectedOfficer, setSelectedOfficer] = useState(DEMO_OFFICERS[0]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b-4 border-amber-500 bg-primary-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3.5">
            <IndianFlag variant="circular" width={42} height={42} className="shadow-sm" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">Government of India</p>
              <h1 className="text-base font-bold">MeriPehchan · Jan Parichay</h1>
            </div>
          </div>
          <span className="hidden text-xs text-blue-100 sm:block">National Single Sign-On</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <Badge variant="saffron" className="w-fit">MoSPI secure service</Badge>
          <h2 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-primary-900 sm:text-5xl">Sign in to your StatSkill workspace.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">A secure learning workspace for India’s official statistical system, built around your cadre, division and competency path.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['National SSO', 'No MoSPI password stored'],
              ['Role aware', 'Cadre-specific learning'],
              ['Edge ready', 'Works in low-connectivity offices'],
            ].map(([title, detail]) => <div key={title} className="border-l-2 border-amber-500 pl-3"><p className="text-sm font-bold text-primary-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>)}
          </div>
        </div>

        <Card className="overflow-hidden shadow-xl shadow-slate-300/40">
          <div className="bg-primary-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3"><Landmark className="h-6 w-6 text-amber-300" /><div><h3 className="font-bold">Access via Jan Parichay</h3><p className="mt-0.5 text-xs text-blue-100">Use your National SSO identity to continue.</p></div></div>
          </div>
          <CardContent className="p-6 sm:p-7">
            <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
              <button aria-pressed={method === 'parichay-id'} onClick={() => setMethod('parichay-id')} className={`rounded-md px-3 py-2 text-sm font-bold transition ${method === 'parichay-id' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500'}`}><UserRound className="mr-1.5 inline h-4 w-4" />Parichay ID</button>
              <button aria-pressed={method === 'mobile-otp'} onClick={() => setMethod('mobile-otp')} className={`rounded-md px-3 py-2 text-sm font-bold transition ${method === 'mobile-otp' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500'}`}><Smartphone className="mr-1.5 inline h-4 w-4" />Mobile OTP</button>
            </div>
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
              <LockKeyhole className="mr-2 inline h-4 w-4 text-primary-700" />{method === 'parichay-id' ? 'Authenticate with your verified Parichay ID.' : 'A one-time password will be sent to your registered mobile number.'}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between"><label className="text-sm font-bold text-slate-800">Pitch demo: choose an officer</label><Badge variant="neutral">1-click access</Badge></div>
              <div className="mt-3 grid gap-2">
                {DEMO_OFFICERS.map((officer) => <button aria-pressed={selectedOfficer.id === officer.id} key={officer.id} onClick={() => setSelectedOfficer(officer)} className={`rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${selectedOfficer.id === officer.id ? 'border-primary-700 bg-primary-50 ring-1 ring-primary-700' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-primary-900">{officer.designation}</p><p className="mt-0.5 text-xs text-slate-600">{officer.division}</p></div><Building2 className="h-4 w-4 shrink-0 text-slate-400" /></div>
                </button>)}
              </div>
            </div>
            <Button variant="saffron" size="lg" className="mt-6 w-full" onClick={() => onAuthenticate?.(selectedOfficer, method)}>Continue as {selectedOfficer.designation}<ChevronRight className="h-4 w-4" /></Button>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">StatSkill AI does not store civil-service passwords. Identity verification is handled by Jan Parichay.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
