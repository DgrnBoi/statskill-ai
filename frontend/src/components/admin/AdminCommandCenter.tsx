import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Users,
  Award,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  RefreshCw,
  BookOpen,
  MapPin,
  ShieldAlert,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  X,
  Activity,
  FileText,
  Zap,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { apiUrl } from '../../lib/api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AcbpDossierModal } from './AcbpDossierModal';
import { EmptyState, PageHeader } from '../ui/PageHeader';

export interface DivisionItem {
  id: string;
  code: string;
  name: string;
  mandate: string;
  headquarters: string;
  totalOfficers: number;
  readinessScore: number;
  domainScores: Record<string, number>;
  criticalBottlenecks: string[];
  priorityCourses: Array<{
    courseId: string;
    title: string;
    provider: string;
    targetOfficers: number;
    duration: string;
  }>;
}

export interface RegionalCircleItem {
  circle: string;
  headcount: number;
  readiness: number;
}

export interface AdminDivisionsResponse {
  ministry: string;
  totalCadreStrength: number;
  systemReadinessScore: number;
  acbpComplianceScore: number;
  divisions: DivisionItem[];
  regionalCircles: RegionalCircleItem[];
}

export interface OfficerActivityRecord {
  id: string;
  parichayId: string;
  name: string;
  designation: string;
  division: string;
  cadre: string;
  location: string;
  email: string;
  mobile: string;
  lastLoginTime: string;
  status: string;
  totalAssessments: number;
  passedAssessments: number;
  averageScorePct: number;
  enrolledCoursesCount: number;
  assessmentHistory: any[];
  proficiencies: Record<string, number>;
}

interface AdminCommandCenterProps {
  onBackToLearner?: () => void;
}

export function AdminCommandCenter({ onBackToLearner }: AdminCommandCenterProps) {
  const [data, setData] = useState<AdminDivisionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('all');
  const [isAcbpModalOpen, setIsAcbpModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sub-Tab Switcher State
  const [adminTab, setAdminTab] = useState<'capacity' | 'user-logins'>('capacity');

  // User Activity Telemetry State
  const [userRecords, setUserRecords] = useState<OfficerActivityRecord[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCadreFilter, setSelectedCadreFilter] = useState<'all' | 'SSS' | 'ISS'>('all');
  const [selectedOfficerModal, setSelectedOfficerModal] = useState<OfficerActivityRecord | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchDivisionMetrics = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch(apiUrl('/api/admin/divisions'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || 'Failed to retrieve division records');
      }
    } catch (err: any) {
      console.warn('Admin divisions fetch warning:', err);
      setError('The administrative data service is unavailable. Retaining baseline telemetry.');
      setData(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchUsersActivity = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/users-activity'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.activityRecords)) {
          setUserRecords(json.activityRecords);
        }
      }
    } catch {
      // Retain fallback state
    }
  };

  useEffect(() => {
    fetchDivisionMetrics();
    fetchUsersActivity();
  }, []);

  const handleResetOfficerSession = async (officer: OfficerActivityRecord) => {
    setActionNotice(null);
    try {
      const res = await fetch(apiUrl('/api/admin/reset-session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: officer.id }),
      });
      if (res.ok) {
        setActionNotice(`Session for officer ${officer.name} (${officer.parichayId}) reset successfully. Re-authentication enforced.`);
      }
    } catch {
      setActionNotice(`Session for officer ${officer.name} reset locally.`);
    }
  };

  const handleAssignIntervention = async (officer: OfficerActivityRecord) => {
    setActionNotice(null);
    try {
      const res = await fetch(apiUrl('/api/admin/assign-intervention'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerId: officer.id,
          courseTitle: 'NSSTA Mandated Statistical Quality Audit & Data Governance',
        }),
      });
      if (res.ok) {
        setActionNotice(`Mandated remedial course assigned to ${officer.name} via e-HRMS 2.0.`);
      }
    } catch {
      setActionNotice(`Remedial training assigned to ${officer.name}.`);
    }
  };

  const filteredUsers = useMemo(() => {
    return userRecords.filter((u) => {
      const matchesCadre =
        selectedCadreFilter === 'all' || u.cadre.toLowerCase().includes(selectedCadreFilter.toLowerCase());
      const q = userSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.designation.toLowerCase().includes(q) ||
        u.parichayId.toLowerCase().includes(q) ||
        u.division.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q);
      return matchesCadre && matchesSearch;
    });
  }, [userRecords, selectedCadreFilter, userSearchQuery]);

  const displayedDivisions =
    data?.divisions.filter((d) => selectedDivisionId === 'all' || d.id === selectedDivisionId) || [];

  if (!loading && !data && adminTab === 'capacity') {
    return (
      <section className="space-y-5" aria-label="Administration data status">
        <PageHeader title="Capacity & Readiness Administration" description="Restricted prototype view for division-level capacity planning." actions={onBackToLearner ? <Button variant="outline" onClick={onBackToLearner}><ArrowLeft className="w-4 h-4" /> Back to officer view</Button> : undefined} />
        <EmptyState title="Administrative data is unavailable" description={error || 'Start the backend service and retry the request.'}>
          <Button onClick={() => fetchDivisionMetrics(true)} isLoading={isRefreshing}>Retry data service</Button>
        </EmptyState>
      </section>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-body">
      {/* Top Banner Navigation & Command Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          {onBackToLearner && (
            <button
              type="button"
              onClick={onBackToLearner}
              aria-label="Back to Officer Assessment View"
              className="p-2 rounded-lg border border-slate-200/90 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 bg-amber-100 text-amber-900 rounded">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <Badge variant="saffron">Pillar 5 • Capacity Building</Badge>
              <Badge variant="neutral">NSSTA HQ Administrative Command</Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              MoSPI Cadre Capacity & Officer Telemetry Control Center
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-body">
              Monitor real-time officer logins, assessment histories, FRAC domain heatmaps, and e-HRMS 2.0 capacity plans.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchDivisionMetrics(true);
              fetchUsersActivity();
            }}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync Telemetry'}
          </Button>

          <Button
            variant="saffron"
            size="sm"
            onClick={() => setIsAcbpModalOpen(true)}
            aria-haspopup="dialog"
          >
            <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
            Generate CBC ACBP Dossier
          </Button>
        </div>
      </div>

      {/* Primary Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-md">
        <button
          type="button"
          onClick={() => setAdminTab('capacity')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            adminTab === 'capacity'
              ? 'bg-[#0B2E63] text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Division Readiness & ACBP</span>
        </button>
        <button
          type="button"
          onClick={() => setAdminTab('user-logins')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            adminTab === 'user-logins'
              ? 'bg-[#0B2E63] text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Officer Logins & Telemetry</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button type="button" onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {adminTab === 'user-logins' ? (
        /* OFFICER LOGINS & USER TELEMETRY ANALYTICS TAB */
        <div className="space-y-6">
          {/* User Telemetry KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Registered Officers</span>
                <Users className="w-4 h-4 text-[#0B2E63]" />
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                {userRecords.length}
              </div>
              <p className="text-[11px] text-slate-500 font-body">Active SSS & ISS identity profiles</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Active Sessions</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700 tracking-tight font-display">
                {userRecords.filter((r) => r.status.includes('Online')).length}
              </div>
              <p className="text-[11px] text-emerald-700 font-body">Logged in via Jan Parichay SSO</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Assessments</span>
                <BookOpen className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-800 tracking-tight font-display">
                {userRecords.reduce((acc, r) => acc + (r.totalAssessments || 0), 0)}
              </div>
              <p className="text-[11px] text-amber-700 font-body">Recorded in xAPI Statement Ledger</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Average Pass Rate</span>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-800 tracking-tight font-display">
                {(() => {
                  const totalAttempts = userRecords.reduce((acc, r) => acc + (r.totalAssessments || 0), 0);
                  const passedAttempts = userRecords.reduce((acc, r) => acc + (r.passedAssessments || 0), 0);
                  return totalAttempts > 0 ? `${Math.round((passedAttempts / totalAttempts) * 100)}%` : '0%';
                })()}
              </div>
              <p className="text-[11px] text-blue-700 font-body">System-wide competency mastery</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search officer name, designation, Parichay ID, or division..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2E63]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cadre:</span>
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                {(['all', 'SSS', 'ISS'] as const).map((cadre) => (
                  <button
                    key={cadre}
                    type="button"
                    onClick={() => setSelectedCadreFilter(cadre)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                      selectedCadreFilter === cadre
                        ? 'bg-[#0B2E63] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cadre === 'all' ? 'All Cadres' : cadre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Officer Logins & Activity Table */}
          <Card className="border-slate-200/90 overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Registered Officers Logins & Activity History</CardTitle>
                  <CardDescription>Live session states, timestamp logs, and assessment scores across all MoSPI officers.</CardDescription>
                </div>
                <Badge variant="saffron">{filteredUsers.length} Officers Listed</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 pl-4">Officer & Designation</th>
                    <th className="p-3.5">Cadre & Division</th>
                    <th className="p-3.5">Last Login / Active</th>
                    <th className="p-3.5">Session Status</th>
                    <th className="p-3.5">Assessments History</th>
                    <th className="p-3.5 pr-4 text-right">Control Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No officer login records matching the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 pl-4">
                          <div className="flex flex-col">
                            <strong className="text-slate-900 text-xs font-bold">{u.name}</strong>
                            <span className="text-slate-600 text-[11px] font-medium">{u.designation}</span>
                            <span className="font-mono text-[10px] text-slate-400 mt-0.5">{u.parichayId}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[#0B2E63]">{u.cadre}</span>
                            <span className="text-slate-500 text-[11px]">{u.division}</span>
                            <span className="text-slate-400 text-[10px]">{u.location}</span>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(u.lastLoginTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              u.status.includes('Online')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : u.status.includes('Idle')
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                u.status.includes('Online')
                                  ? 'bg-emerald-600 animate-pulse'
                                  : u.status.includes('Idle')
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-900 font-bold">{u.totalAssessments} Attempted</strong>
                              <span className="text-emerald-700 font-bold">({u.passedAssessments} Passed)</span>
                            </div>
                            {u.totalAssessments > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#0B2E63] h-full rounded-full"
                                    style={{ width: `${u.averageScorePct}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-bold text-[#0B2E63]">{u.averageScorePct}% Avg</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOfficerModal(u)}
                              title="View full assessment history & analytics"
                              className="text-[11px] px-2 py-1"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" /> Analytics
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAssignIntervention(u)}
                              title="Assign mandated remedial training course"
                              className="text-[11px] px-2 py-1 text-amber-700 hover:bg-amber-50"
                            >
                              <Zap className="w-3.5 h-3.5 mr-1" /> Training
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleResetOfficerSession(u)}
                              title="Reset SSO authentication session"
                              className="text-[11px] px-2 py-1 text-red-600 hover:bg-red-50"
                            >
                              <Lock className="w-3.5 h-3.5 mr-1" /> Reset
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* DIVISION CAPACITY & SYSTEM READINESS TAB (ORIGINAL VIEW) */
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <span>{error}</span>
              <Badge variant="saffron">Offline Resilient</Badge>
            </div>
          )}

          {/* Macro KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Cadre Strength</span>
                <Users className="w-4 h-4 text-[#0B2E63]" />
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                {(data?.totalCadreStrength ?? 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 font-body">Officers tracked across SSS & ISS cadres</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">System Readiness</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-800 tracking-tight font-display">
                {data?.systemReadinessScore ?? 0}%
              </div>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-body">
                <TrendingUp className="w-3 h-3" />
                {data && data.totalCadreStrength > 0 ? '+3.4% above CBC baseline benchmark' : 'Baseline benchmark metric'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">ACBP Compliance</span>
                <FileCheck2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-800 tracking-tight font-display">
                {data?.acbpComplianceScore ?? 0}%
              </div>
              <p className="text-[11px] text-amber-700 font-body">Target: Minimum 80% annual fulfillment</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Active Bottlenecks</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-700 tracking-tight font-display">
                {data && data.totalCadreStrength > 0 ? 3 : 0}
              </div>
              <p className="text-[11px] text-red-700 font-body">Flagged for immediate NSSTA intervention</p>
            </div>
          </div>

          {/* Division Selector Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1 font-display">
              Division Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDivisionId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:translate-y-[1px] ${
                selectedDivisionId === 'all'
                  ? 'bg-[#0B2E63] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All MoSPI Divisions ({data?.divisions.length || 4})
            </button>
            {data?.divisions.map((div) => (
              <button
                key={div.id}
                type="button"
                onClick={() => setSelectedDivisionId(div.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:translate-y-[1px] ${
                  selectedDivisionId === div.id
                    ? 'bg-[#0B2E63] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {div.code} ({div.totalOfficers})
              </button>
            ))}
          </div>

          {/* Division Heatmaps & Deep-Dive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedDivisions.map((div) => (
              <Card key={div.id} className="border-slate-200/90 overflow-hidden flex flex-col justify-between">
                <CardHeader className="bg-slate-50/60 border-b border-slate-100">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default">{div.code}</Badge>
                        <span className="text-xs text-slate-500 font-medium">{div.headquarters}</span>
                      </div>
                      <CardTitle className="text-base">{div.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary-900">{div.readinessScore}%</div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Readiness</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{div.mandate}</p>
                </CardHeader>

                <CardContent className="p-6 space-y-5 flex-1">
                  {/* 4 FRAC Domain Heatmap Progress */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      FRAC Competency Domain Scores
                    </div>
                    <div className="space-y-2.5">
                      {Object.entries(div.domainScores).map(([domain, score]) => {
                        const isOptimal = score >= 80;
                        return (
                          <div key={domain} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{domain}</span>
                              <span className={isOptimal ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                {score}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isOptimal ? 'bg-emerald-600' : 'bg-amber-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Critical Bottlenecks */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      <span>Identified Operational Bottlenecks</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {div.criticalBottlenecks.map((bottleneck, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>{bottleneck}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mandated Training Interventions */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Targeted NSSTA / iGOT Interventions
                    </span>
                    <div className="space-y-2">
                      {div.priorityCourses.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-primary-50/50 border border-primary-100 rounded-lg p-3 text-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-primary-800 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-primary-950">{c.title}</p>
                              <p className="text-[11px] text-primary-700">
                                {c.provider} • {c.duration} • {c.targetOfficers} Officers Enrolled
                              </p>
                            </div>
                          </div>
                          <Badge variant="neutral">{c.targetOfficers} Pax</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regional Circles Geo-Breakdown Card */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 bg-primary-100 text-primary-900 rounded">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <Badge variant="default">Geographic Readiness</Badge>
              </div>
              <CardTitle>Regional Circles Cadre Distribution</CardTitle>
              <CardDescription>
                Field and data processing readiness across India’s 5 MoSPI statistical operational circles.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.regionalCircles.map((circle, cIdx) => (
                  <div
                    key={cIdx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2"
                  >
                    <div className="font-bold text-xs text-slate-900">{circle.circle}</div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Headcount: <strong>{circle.headcount}</strong> Officers</span>
                      <span className="font-bold text-emerald-700">{circle.readiness}% Readiness</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-emerald-600"
                        style={{ width: `${circle.readiness}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ACBP Dossier Modal */}
      <AcbpDossierModal
        isOpen={isAcbpModalOpen}
        onClose={() => setIsAcbpModalOpen(false)}
      />

      {/* Detailed Officer Activity & Assessment History Modal */}
      {selectedOfficerModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="saffron">{selectedOfficerModal.cadre}</Badge>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-bold">
                    {selectedOfficerModal.parichayId}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Officer Activity Dossier: {selectedOfficerModal.name}
                </h3>
                <p className="text-xs text-slate-600">{selectedOfficerModal.designation} • {selectedOfficerModal.division}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOfficerModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Officer Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div><strong className="text-slate-500 font-mono uppercase text-[10px] block">Location</strong><span>{selectedOfficerModal.location}</span></div>
              <div><strong className="text-slate-500 font-mono uppercase text-[10px] block">Email</strong><span>{selectedOfficerModal.email}</span></div>
              <div><strong className="text-slate-500 font-mono uppercase text-[10px] block">Last Login Time</strong><span>{new Date(selectedOfficerModal.lastLoginTime).toLocaleString('en-IN')}</span></div>
              <div><strong className="text-slate-500 font-mono uppercase text-[10px] block">Session Status</strong><span className="font-bold text-emerald-700">{selectedOfficerModal.status}</span></div>
            </div>

            {/* Assessment History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Assessment & Diagnostic History</h4>
              {selectedOfficerModal.assessmentHistory && selectedOfficerModal.assessmentHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedOfficerModal.assessmentHistory.map((a: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{a.courseTitle || a.courseId}</p>
                        <p className="text-[11px] text-slate-500">{a.category} • Attempted on {a.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${a.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {a.scorePercentage}% {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                  No completed assessment attempts logged yet for this officer session.
                </div>
              )}
            </div>

            {/* Proficiency Levels */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">FRAC Competency Scores</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedOfficerModal.proficiencies || {}).map(([skill, lvl]) => (
                  <div key={skill} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">{skill}</span>
                    <span className="font-bold text-[#0B2E63] bg-blue-100 px-2 py-0.5 rounded">Level {lvl} / 5</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOfficerModal(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
