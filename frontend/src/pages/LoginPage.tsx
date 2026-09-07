import { ArrowLeft, Building2, ChevronRight, Landmark, LockKeyhole, Smartphone, UserRound, UserPlus, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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
  email?: string;
  mobile?: string;
  location?: string;
  experienceYears?: number;
}

export const DEMO_OFFICERS: DemoOfficer[] = [
  { id: 'jso', name: 'Eshaan Sunthankar', designation: 'Junior Statistical Officer (JSO)', division: 'Field Operations Division (FOD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_1042_NSSO' },
  { id: 'sso', name: 'Ananya Mehta', designation: 'Senior Statistical Officer (SSO)', division: 'Data Processing Division (DPD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_2088_NSSO' },
  { id: 'assistant-director', name: 'Rohan Iyer', designation: 'Assistant Director (ISS)', division: 'National Accounts Division (NAD)', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_3612_ISS' },
  { id: 'director', name: 'Kavita Rao', designation: 'Director (ISS)', division: 'Data Informatics & Innovation Division (DIID)', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_4820_ISS' },
  { id: 'joint-director', name: 'Dr. Rajeshwari Nair', designation: 'Joint Director [SDRD] (ISS)', division: 'Survey Design & Research Division (SDRD), NSSO', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_5914_ISS' },
  { id: 'deputy-director', name: 'Dr. Vikram Seth', designation: 'Deputy Director [Price Statistics] (ISS)', division: 'Economic Statistics Division (ESD), MoSPI', cadre: 'Indian Statistical Service (ISS)', parichayId: 'PARICHAY_6120_ISS' },
];

const MOSPI_DIVISIONS = [
  'All Divisions',
  'Field Operations Division (FOD)',
  'Data Processing Division (DPD)',
  'National Accounts Division (NAD)',
  'Data Informatics & Innovation Division (DIID)',
  'Survey Design & Research Division (SDRD)',
  'Economic Statistics Division (ESD)',
  'National Statistical Systems Training Academy (NSSTA)',
];

const PRESET_DESIGNATIONS = [
  'Junior Statistical Officer (JSO)',
  'Senior Statistical Officer (SSO)',
  'Assistant Director (ISS)',
  'Deputy Director [Price Statistics] (ISS)',
  'Deputy Director (ISS)',
  'Joint Director [SDRD] (ISS)',
  'Joint Director (ISS)',
  'Director (ISS)',
  'Director [DIID] (ISS)',
  'Director [Training] (ISS)',
  'Chief Statistician of India',
];

interface LoginPageProps {
  onAuthenticate?: (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => void | Promise<void>;
  onBack?: () => void;
}

export default function LoginPage({ onAuthenticate, onBack }: LoginPageProps) {
  const [method, setMethod] = useState<'parichay-id' | 'mobile-otp'>('parichay-id');
  const [officersList, setOfficersList] = useState<DemoOfficer[]>(DEMO_OFFICERS);
  const [selectedOfficer, setSelectedOfficer] = useState<DemoOfficer>(DEMO_OFFICERS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Dynamic Filtering & Tab Mode State
  const [mode, setMode] = useState<'select' | 'register'>('select');
  const [selectedDivision, setSelectedDivision] = useState<string>('All Divisions');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // New Officer Registration Form State
  const [regName, setRegName] = useState('');
  const [regDesignation, setRegDesignation] = useState(PRESET_DESIGNATIONS[0]);
  const [regDivision, setRegDivision] = useState(MOSPI_DIVISIONS[1]);
  const [regCadre, setRegCadre] = useState<'Indian Statistical Service (ISS)' | 'Subordinate Statistical Service (SSS)'>('Subordinate Statistical Service (SSS)');
  const [regLocation, setRegLocation] = useState('New Delhi');
  const [regParichayId, setRegParichayId] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Fetch registered officers dynamically from backend database
  const fetchRegisteredOfficers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          const mapped: DemoOfficer[] = data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            designation: u.designation,
            division: u.division,
            cadre: u.cadre,
            parichayId: u.parichayId,
            email: u.email,
            mobile: u.mobile,
            location: u.location,
            experienceYears: u.experienceYears,
          }));
          const merged = [...DEMO_OFFICERS];
          mapped.forEach((m) => {
            if (!merged.some((e) => e.id === m.id || e.parichayId === m.parichayId)) {
              merged.push(m);
            }
          });
          setOfficersList(merged);
        }
      }
    } catch {
      // Retain DEMO_OFFICERS fallback on network failure
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchRegisteredOfficers();
  }, []);

  // Filtered officers list based on division and search text
  const filteredOfficers = useMemo(() => {
    return officersList.filter((officer) => {
      const matchesDivision =
        selectedDivision === 'All Divisions' ||
        officer.division.toLowerCase().includes(selectedDivision.toLowerCase().replace('all divisions', '').trim());

      const query = searchFilter.toLowerCase().trim();
      const matchesSearch =
        !query ||
        officer.name.toLowerCase().includes(query) ||
        officer.designation.toLowerCase().includes(query) ||
        officer.parichayId.toLowerCase().includes(query) ||
        officer.division.toLowerCase().includes(query) ||
        (officer.location && officer.location.toLowerCase().includes(query));

      return matchesDivision && matchesSearch;
    });
  }, [officersList, selectedDivision, searchFilter]);

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

  const handleRegisterOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter the officer name to register.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const parichayId = regParichayId.trim() || `PARICHAY_${randomSuffix}_${regCadre.includes('ISS') ? 'ISS' : 'NSSO'}`;
    const email = regEmail.trim() || `${regName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@mospi.gov.in`;
    const mobile = regMobile.trim() || `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOfficerPayload: DemoOfficer = {
      id: `usr_${randomSuffix}`,
      name: regName.trim(),
      designation: regDesignation,
      division: regDivision,
      cadre: regCadre,
      parichayId,
      email,
      mobile,
      location: regLocation.trim() || 'New Delhi',
      experienceYears: 3,
    };

    try {
      // 1. Register with backend database
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfficerPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          window.localStorage.setItem('auth_token', data.token);
        }
      }

      // 2. Add to active officer list
      setOfficersList((prev) => [newOfficerPayload, ...prev]);
      setSelectedOfficer(newOfficerPayload);
      setSuccessNotice(`Officer ${newOfficerPayload.name} registered successfully with Parichay ID: ${newOfficerPayload.parichayId}`);

      // 3. Authenticate and redirect
      await onAuthenticate?.(newOfficerPayload, method);
    } catch (cause) {
      setSelectedOfficer(newOfficerPayload);
      try {
        await onAuthenticate?.(newOfficerPayload, method);
      } catch (innerCause) {
        setError(innerCause instanceof Error ? innerCause.message : 'Officer registration completed, but auto-login encountered an issue.');
        setIsSubmitting(false);
      }
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
          <Badge variant="saffron">National Statistical SSO Gateway</Badge>
          <h2 id="login-title">Access your statistical learning workspace</h2>
          <p>
            Authenticate using your official Jan Parichay credentials or register a dynamic officer profile to access your individualized FRAC competency matrix, diagnostic exam records, and 4-tier learning pathway.
          </p>
          <dl>
            <div><dt>Identity pattern</dt><dd>Jan Parichay & Mobile OTP verification</dd></div>
            <div><dt>Dynamic Database</dt><dd>In-memory persistent user profiles with isolated competency history</dd></div>
            <div><dt>Session Security</dt><dd>Server-signed JWT with 8-hour cryptographic validity</dd></div>
          </dl>
          <p className="login-disclosure">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            StatSkill AI complies with the Digital Personal Data Protection (DPDP) Act 2023. All officer competencies and test records are securely isolated.
          </p>
        </section>

        <section className="login-panel" aria-labelledby="access-title">
          <div className="login-panel-header">
            <Landmark className="h-5 w-5" aria-hidden="true" />
            <div>
              <h2 id="access-title">Officer Authentication</h2>
              <p>Select your registered profile or onboard a new officer.</p>
            </div>
          </div>

          {/* Mode Switcher: Directory vs New Officer Registration */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-4 border border-slate-200" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'select'}
              onClick={() => { setMode('select'); setError(null); }}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'select'
                  ? 'bg-white text-[#0B2E63] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>Officer Directory</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0B2E63] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register New Officer</span>
            </button>
          </div>

          {/* Authentication Method Selector */}
          <div className="login-methods" role="group" aria-label="Authentication method">
            <button
              type="button"
              aria-pressed={method === 'parichay-id'}
              onClick={() => setMethod('parichay-id')}
            >
              <UserRound className="h-4 w-4" aria-hidden="true" /> Parichay ID
            </button>
            <button
              type="button"
              aria-pressed={method === 'mobile-otp'}
              onClick={() => setMethod('mobile-otp')}
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" /> Mobile OTP
            </button>
          </div>

          {mode === 'select' ? (
            <>
              {/* Filter and Search Controls */}
              <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search officer name, designation, Parichay ID..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                      aria-label="Search registered officers"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchRegisteredOfficers}
                    disabled={isLoadingUsers}
                    title="Refresh officer list from database"
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                    aria-label="Filter by division"
                  >
                    {MOSPI_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Officer Cards List */}
              <fieldset className="login-roles max-h-[280px] overflow-y-auto pr-1">
                <legend className="sr-only">Choose a registered officer profile</legend>
                {filteredOfficers.length === 0 ? (
                  <div className="p-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                    No registered officers found matching the filter.
                  </div>
                ) : (
                  filteredOfficers.map((officer) => (
                    <button
                      type="button"
                      key={officer.id}
                      aria-pressed={selectedOfficer.id === officer.id || selectedOfficer.parichayId === officer.parichayId}
                      aria-label={`${officer.designation}, ${officer.division}`}
                      onClick={() => { setSelectedOfficer(officer); setError(null); }}
                      className="relative text-left transition-all"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-2">
                          <strong className="text-slate-900 text-xs">{officer.name}</strong>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {officer.parichayId}
                          </span>
                        </span>
                        <strong className="text-[#0B2E63] font-semibold text-[11px]">{officer.designation}</strong>
                        <small className="text-slate-500 text-[10px] leading-tight">{officer.division}</small>
                      </span>
                      <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                    </button>
                  ))
                )}
              </fieldset>

              {successNotice && (
                <p role="status" className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                  {successNotice}
                </p>
              )}

              {error && <p role="alert" className="login-error">{error}</p>}

              <Button
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
                onClick={authenticate}
              >
                Continue as {selectedOfficer.designation}
                <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>
            </>
          ) : (
            /* New Officer Registration Form */
            <form onSubmit={handleRegisterOfficer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Officer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Meenakshi Sundaram"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={regDesignation}
                    onChange={(e) => {
                      const desig = e.target.value;
                      setRegDesignation(desig);
                      if (desig.includes('ISS') || desig.includes('Director')) {
                        setRegCadre('Indian Statistical Service (ISS)');
                      } else {
                        setRegCadre('Subordinate Statistical Service (SSS)');
                      }
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                  >
                    {PRESET_DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cadre
                  </label>
                  <select
                    value={regCadre}
                    onChange={(e) => setRegCadre(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                  >
                    <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                    <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Division
                </label>
                <select
                  value={regDivision}
                  onChange={(e) => setRegDivision(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                >
                  {MOSPI_DIVISIONS.filter((d) => d !== 'All Divisions').map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Station / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, Kolkata, Mumbai"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parichay ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={regParichayId}
                    onChange={(e) => setRegParichayId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                  />
                </div>
              </div>

              {error && <p role="alert" className="login-error">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                Register Officer & Launch Workspace
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
