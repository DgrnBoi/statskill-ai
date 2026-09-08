import { ArrowLeft, Building2, ChevronRight, Landmark, LockKeyhole, Smartphone, UserRound, UserPlus, Search, ShieldCheck, RefreshCw, Sparkles, Trash2, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { IndianFlag } from '../components/ui/IndianFlag';
import { useUiPreferences } from '../contexts/UiPreferencesContext';
import { apiUrl } from '../lib/api';

import { DemoOfficer, DEMO_OFFICERS, SAMPLE_DEMO_OFFICERS } from '../data/demoOfficers';
export type { DemoOfficer };
export { DEMO_OFFICERS };

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
  'Agricultural Statistics Specialist',
  'Price Statistics & CPI Modeler',
  'National Accounts & Macro Modeler',
  'GIS & Spatial Survey Officer',
  'Demographic & Social Statistics Officer',
  'Custom Role / Other Designation...',
];

interface LoginPageProps {
  onAuthenticate?: (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => void | Promise<void>;
  onBack?: () => void;
}

export default function LoginPage({ onAuthenticate, onBack }: LoginPageProps) {
  const { t } = useUiPreferences();
  const [method, setMethod] = useState<'parichay-id' | 'mobile-otp'>('parichay-id');
  const [officersList, setOfficersList] = useState<DemoOfficer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<DemoOfficer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Dynamic Filtering & Tab Mode State (select | quick | register)
  const [mode, setMode] = useState<'select' | 'quick' | 'register'>('select');
  const [selectedDivision, setSelectedDivision] = useState<string>('All Divisions');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // Quick Role Access Form State
  const [quickRole, setQuickRole] = useState(PRESET_DESIGNATIONS[0]);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [quickName, setQuickName] = useState('');

  // New Officer Registration Form State
  const [regName, setRegName] = useState('');
  const [regDesignation, setRegDesignation] = useState(PRESET_DESIGNATIONS[0]);
  const [regDivision, setRegDivision] = useState(MOSPI_DIVISIONS[1]);
  const [regCadre, setRegCadre] = useState<'Indian Statistical Service (ISS)' | 'Subordinate Statistical Service (SSS)'>('Subordinate Statistical Service (SSS)');
  const [regLocation, setRegLocation] = useState('New Delhi');
  const [regParichayId, setRegParichayId] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleRemoveOfficer = (officerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    fetch(apiUrl(`/api/auth/user/${officerId}`), { method: 'DELETE' }).catch(() => {});
    setOfficersList((prev) => {
      const updated = prev.filter((o) => o.id !== officerId);
      if (selectedOfficer?.id === officerId) {
        setSelectedOfficer(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const handleClearAllUsers = () => {
    fetch(apiUrl('/api/auth/users'), { method: 'DELETE' }).catch(() => {});
    setOfficersList([]);
    setSelectedOfficer(null);
    setSuccessNotice('All user profiles cleared successfully. Register a new officer or select a profile to log in.');
  };

  const handleLoadDemoProfiles = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch(apiUrl('/api/auth/seed-demo'), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users) && data.users.length > 0) {
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
          setOfficersList(mapped);
          setSelectedOfficer(mapped.length > 0 ? mapped[0] : null);
          setSuccessNotice('Loaded sample MoSPI cadre profiles into directory.');
          return;
        }
      }
    } catch {
      // Fallback below
    } finally {
      setIsLoadingUsers(false);
    }
    setOfficersList(SAMPLE_DEMO_OFFICERS);
    setSelectedOfficer(SAMPLE_DEMO_OFFICERS[0]);
    setSuccessNotice('Loaded sample MoSPI cadre profiles into directory.');
  };

  // Fetch registered officers dynamically from backend database
  const fetchRegisteredOfficers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch(apiUrl('/api/auth/users'));
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
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
          const initialTwo = mapped.slice(0, 2);
          const finalOfficers = initialTwo.length > 0 ? initialTwo : SAMPLE_DEMO_OFFICERS;
          setOfficersList(finalOfficers);
          setSelectedOfficer((prev) => (prev && finalOfficers.some((m) => m.id === prev.id) ? prev : (finalOfficers.length > 0 ? finalOfficers[0] : null)));
        }
      }
    } catch {
      // Retain current state on network failure
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

  const handleQuickRoleStart = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const activeDesignation = isCustomRole ? (customRoleInput.trim() || 'Statistical Officer') : quickRole;
    if (isCustomRole && !customRoleInput.trim()) {
      setError(t('loginErrorCustomRole'));
      setIsSubmitting(false);
      return;
    }

    const activeName = quickName.trim() || `Officer (${activeDesignation})`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const isIss = activeDesignation.toLowerCase().includes('iss') || activeDesignation.toLowerCase().includes('director');
    const cadre = isIss ? 'Indian Statistical Service (ISS)' : 'Subordinate Statistical Service (SSS)';
    const parichayId = `PARICHAY_${randomSuffix}_${isIss ? 'ISS' : 'NSSO'}`;

    const quickOfficer: DemoOfficer = {
      id: `dyn_${randomSuffix}`,
      name: activeName,
      designation: activeDesignation,
      division: 'Official Statistics Division, MoSPI',
      cadre,
      parichayId,
      email: `${activeName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@mospi.gov.in`,
      mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      location: 'New Delhi',
      experienceYears: activeDesignation.toLowerCase().includes('director') ? 8 : 4,
    };

    try {
      const res = await fetch(apiUrl('/api/auth/custom-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officer: quickOfficer, method }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          window.localStorage.setItem('auth_token', data.token);
        }
      }

      setSelectedOfficer(quickOfficer);
      await onAuthenticate?.(quickOfficer, method);
    } catch (cause) {
      setSelectedOfficer(quickOfficer);
      try {
        await onAuthenticate?.(quickOfficer, method);
      } catch (innerCause) {
        setError(innerCause instanceof Error ? innerCause.message : t('loginErrorQuick'));
        setIsSubmitting(false);
      }
    }
  };

  const authenticate = async () => {
    if (!selectedOfficer) {
      setError('Please select or register an officer profile before logging in.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onAuthenticate?.(selectedOfficer, method);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('loginErrorDemo'));
      setIsSubmitting(false);
    }
  };

  const handleRegisterOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError(t('loginErrorName'));
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
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfficerPayload),
      });

      let registeredOfficer = newOfficerPayload;
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          window.localStorage.setItem('auth_token', data.token);
        }
        if (data.officer) {
          registeredOfficer = data.officer;
        }
      }

      // 2. Set selected officer and notice (do not pollute directory listing with extra cards)
      setSelectedOfficer(registeredOfficer);
      setSuccessNotice(`Officer ${registeredOfficer.name} registered successfully with Parichay ID: ${registeredOfficer.parichayId}`);

      // 3. Authenticate and redirect directly to active workspace
      await onAuthenticate?.(registeredOfficer, method);
    } catch (cause) {
      setSelectedOfficer(newOfficerPayload);
      try {
        await onAuthenticate?.(newOfficerPayload, method);
      } catch (innerCause) {
        setError(innerCause instanceof Error ? innerCause.message : t('loginErrorRegister'));
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
              <p>{t('governmentOfIndia')}</p>
              <h1>{t('loginPortalTitle')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new Event('popstate'));
              }}
              aria-label="Open HQ Admin Control Center"
              className="text-xs font-bold border-amber-500/40 text-amber-900 bg-amber-50/80 hover:bg-amber-100 cursor-pointer"
            >
              <Building2 className="h-4 w-4 mr-1 text-amber-700" aria-hidden="true" />
              HQ Admin Dashboard
            </Button>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} aria-label={t('backToPortal')}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t('backToPortal')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-title">
          <Badge variant="saffron">{t('loginBadgeSso')}</Badge>
          <h2 id="login-title">{t('loginTitle')}</h2>
          <p>{t('loginDescription')}</p>
          <dl>
            <div><dt>{t('loginMetaIdentity')}</dt><dd>{t('loginMetaIdentityValue')}</dd></div>
            <div><dt>{t('loginMetaDatabase')}</dt><dd>{t('loginMetaDatabaseValue')}</dd></div>
            <div><dt>{t('loginMetaSecurity')}</dt><dd>{t('loginMetaSecurityValue')}</dd></div>
          </dl>
          <p className="login-disclosure">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {t('loginDpdpNotice')}
          </p>
        </section>

        <section className="login-panel" aria-labelledby="access-title">
          <div className="login-panel-header">
            <Landmark className="h-5 w-5" aria-hidden="true" />
            <div>
              <h2 id="access-title">{t('loginAuthTitle')}</h2>
              <p>{t('loginAuthSubtitle')}</p>
            </div>
          </div>

          {/* Mode Switcher: Directory vs Full Registration */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5 border border-slate-200 shadow-inner" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'select'}
              onClick={() => { setMode('select'); setError(null); }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'select'
                  ? 'bg-[#0B2E63] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UserRound className="h-3.5 w-3.5" />
              <span>{t('loginTabDirectory')}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#0B2E63] text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{t('loginTabRegister')}</span>
            </button>
          </div>

          {/* Sovereign Authentication Badge */}
          <div className="flex items-center justify-between p-2.5 mb-4 bg-gradient-to-r from-[#0B2E63]/10 to-amber-500/10 border border-[#0B2E63]/20 rounded-lg text-xs font-bold text-[#0B2E63]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Jan Parichay SSO Authentication</span>
            </span>
            <Badge variant="saffron" className="text-[10px] uppercase font-extrabold px-2 py-0.5">Govt Verified</Badge>
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
                      placeholder={t('loginSearchPlaceholder')}
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
                  <button
                    type="button"
                    onClick={handleClearAllUsers}
                    title="Clear all officer profiles"
                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
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
              <fieldset className="login-roles max-h-[260px] overflow-y-auto pr-1">
                <legend className="sr-only">Choose a registered officer profile</legend>
                {filteredOfficers.length === 0 ? (
                  <div className="p-4 text-center bg-slate-50/90 border border-dashed border-slate-300 rounded-xl space-y-2.5 my-1 font-body">
                    <div className="text-slate-800 text-xs font-bold font-display flex items-center justify-center gap-1.5">
                      <UserRound className="w-4 h-4 text-slate-500" />
                      <span>0 Registered Officers in Directory</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-xs mx-auto">
                      No profiles currently exist. Register a new officer profile or load sample demo profiles dynamically.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setMode('register'); setError(null); }}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0B2E63] text-white hover:bg-[#082147] transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register New Officer</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadDemoProfiles}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Load Sample Demo Officers</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredOfficers.map((officer) => {
                    const isSelected = selectedOfficer?.id === officer.id || selectedOfficer?.parichayId === officer.parichayId;
                    return (
                      <button
                        type="button"
                        key={officer.id}
                        aria-pressed={isSelected}
                        aria-label={`${officer.name}, ${officer.designation}, ${officer.division}`}
                        onClick={() => { setSelectedOfficer(officer); setError(null); }}
                        className={`relative text-left transition-all p-3 rounded-lg border flex items-center justify-between cursor-pointer mb-2 w-full ${
                          isSelected
                            ? 'border-[#0B2E63] bg-blue-50/70 ring-2 ring-[#0B2E63]/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-2">
                            <strong className="text-slate-900 text-xs font-bold">{officer.name}</strong>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                              {officer.parichayId}
                            </span>
                          </span>
                          <strong className="text-[#0B2E63] font-semibold text-[11px]">{officer.designation}</strong>
                          <small className="text-slate-500 text-[10px] leading-tight">{officer.division}</small>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label={`Log in as ${officer.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOfficer(officer);
                              setError(null);
                              authenticate();
                            }}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                              isSelected ? 'bg-[#0B2E63] text-white hover:bg-[#082147]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <LockKeyhole className="w-3 h-3 text-amber-400" />
                            {isSelected ? 'LOG IN NOW' : 'Select'}
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label={`Remove ${officer.name}`}
                            onClick={(e) => handleRemoveOfficer(officer.id, e)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRemoveOfficer(officer.id, e as any); }}
                            title={`Remove ${officer.name}`}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </fieldset>

              {successNotice && (
                <p role="status" className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium mt-2">
                  {successNotice}
                </p>
              )}

              {error && <p role="alert" className="login-error mt-2">{error}</p>}

              <Button
                variant="primary"
                size="lg"
                disabled={!selectedOfficer || isSubmitting}
                isLoading={isSubmitting}
                className={`w-full mt-3 font-black shadow-lg text-white py-3.5 text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 border ${
                  !selectedOfficer
                    ? 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-65'
                    : 'bg-[#0B2E63] hover:bg-[#082147] cursor-pointer border-blue-400/30'
                }`}
                onClick={authenticate}
              >
                <LockKeyhole className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span>
                  {selectedOfficer
                    ? `LOG IN TO WORKSPACE (${selectedOfficer.name})`
                    : 'NO OFFICER SELECTED (REGISTER OR SELECT PROFILE)'}
                </span>
                <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>
            </>
          ) : (
            /* New Officer Registration Form */
            <form onSubmit={handleRegisterOfficer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('loginFullName')} <span className="text-red-500">*</span>
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
                    {t('loginDesignation')} <span className="text-red-500">*</span>
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
                    {t('loginCadre')}
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
                  {t('loginDivision')}
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
                    {t('loginLocation')}
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
                    {t('loginParichayId')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('loginParichayPlaceholder')}
                    value={regParichayId}
                    onChange={(e) => setRegParichayId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0B2E63]"
                  />
                </div>
              </div>

              {error && <p role="alert" className="login-error mt-1">{error}</p>}

              <Button
                type="submit"
                variant="saffron"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-3 font-extrabold shadow-md text-white py-3.5 bg-[#D97706] hover:bg-[#B45309] cursor-pointer text-sm tracking-wide rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>REGISTER & LOG IN TO WORKSPACE ({regName.trim() || 'NEW OFFICER'})</span>
                <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => { setMode('select'); setError(null); }}
                  className="text-xs text-[#0B2E63] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Already have an officer account? Return to Directory Login</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
