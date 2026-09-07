import { ArrowLeft, Building2, ChevronRight, Landmark, LockKeyhole, Smartphone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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
  { id: 'joint-director', name: 'Dr. Rajeshwari Nair', designation: 'Joint Director [SDRD] (ISS)', division: 'Survey Design & Research Division (SDRD), NSSO', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_5914_ISS' },
  { id: 'deputy-director', name: 'Dr. Vikram Seth', designation: 'Deputy Director [Price Statistics] (ISS)', division: 'Economic Statistics Division (ESD), MoSPI', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_6120_ISS' },
];

interface LoginPageProps {
  onAuthenticate?: (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => void | Promise<void>;
  onBack?: () => void;
}

export default function LoginPage({ onAuthenticate, onBack }: LoginPageProps) {
  const [method, setMethod] = useState<'parichay-id' | 'mobile-otp'>('parichay-id');
  const [selectedOfficer, setSelectedOfficer] = useState(DEMO_OFFICERS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onAuthenticate?.(selectedOfficer, method);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Demo sign-in failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="login-page">
      <header className="login-masthead">
        <div className="login-masthead-inner">
          <div className="flex min-w-0 items-center gap-3">
            <IndianFlag variant="circular" width={38} height={38} />
            <div className="min-w-0">
              <p>Government of India</p>
              <h1>MeriPehchan · Jan Parichay</h1>
            </div>
          </div>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to StatSkill Portal">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to portal
            </Button>
          )}
        </div>
      </header>

      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-title">
          <Badge variant="saffron">SIH demonstration</Badge>
          <h2 id="login-title">Access your statistical learning workspace</h2>
          <p>Choose a MoSPI role to preview its FRAC competency profile, diagnostic history, and learning pathway.</p>
          <dl>
            <div><dt>Identity pattern</dt><dd>Jan Parichay style handoff</dd></div>
            <div><dt>Credential storage</dt><dd>No passwords stored in this app</dd></div>
            <div><dt>Demo session</dt><dd>Server-signed JWT, valid for 8 hours</dd></div>
          </dl>
          <p className="login-disclosure"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> This prototype demonstrates the intended national SSO flow. It is not connected to the production Jan Parichay service.</p>
        </section>

        <section className="login-panel" aria-labelledby="access-title">
          <div className="login-panel-header">
            <Landmark className="h-5 w-5" aria-hidden="true" />
            <div><h2 id="access-title">Demo access</h2><p>Select the sign-in route and officer profile.</p></div>
          </div>

          <div className="login-methods" role="group" aria-label="Authentication method">
            <button type="button" aria-pressed={method === 'parichay-id'} onClick={() => setMethod('parichay-id')}>
              <UserRound className="h-4 w-4" aria-hidden="true" /> Parichay ID
            </button>
            <button type="button" aria-pressed={method === 'mobile-otp'} onClick={() => setMethod('mobile-otp')}>
              <Smartphone className="h-4 w-4" aria-hidden="true" /> Mobile OTP
            </button>
          </div>

          <fieldset className="login-roles">
            <legend>Choose a demo officer</legend>
            {DEMO_OFFICERS.map((officer) => (
              <button
                type="button"
                key={officer.id}
                aria-pressed={selectedOfficer.id === officer.id}
                aria-label={`${officer.designation}, ${officer.division}`}
                onClick={() => setSelectedOfficer(officer)}
              >
                <span><strong>{officer.designation}</strong><small>{officer.division}</small></span>
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </fieldset>

          {error && <p role="alert" className="login-error">{error}</p>}
          <Button variant="primary" size="lg" isLoading={isSubmitting} className="w-full" onClick={authenticate}>
            Continue as {selectedOfficer.designation} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </section>
      </div>
    </main>
  );
}
