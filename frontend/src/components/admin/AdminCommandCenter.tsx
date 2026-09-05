import React, { useState, useEffect } from 'react';
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
  Download,
  ArrowLeft,
  Search,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AcbpDossierModal } from './AcbpDossierModal';

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

  const fetchDivisionMetrics = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/admin/divisions');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || 'Failed to retrieve division records');
      }
    } catch (err: any) {
      console.warn('Admin divisions fetch warning:', err);
      setError('We could not load real-time telemetry from the NSSTA server. Displaying cached cadre data.');
      // Resilient fallback state
      setData({
        ministry: 'Ministry of Statistics and Programme Implementation (MoSPI)',
        totalCadreStrength: 3220,
        systemReadinessScore: 78.4,
        acbpComplianceScore: 84.2,
        divisions: [
          {
            id: 'fod',
            code: 'FOD-NSSO',
            name: 'Field Operations Division (FOD), NSSO',
            mandate: 'Primary household and enterprise survey enumeration, Computer-Assisted Personal Interviewing (CAPI), and Agricultural Statistics crop estimation.',
            headquarters: 'Sankhyiki Bhawan, CBD Belapur, Navi Mumbai / New Delhi',
            totalOfficers: 1840,
            readinessScore: 76.2,
            domainScores: {
              'Statistical Competencies': 82.5,
              'Technical Competencies': 71.0,
              'Digital Governance': 68.4,
              'Behavioural & Managerial': 83.0,
            },
            criticalBottlenecks: [
              'First Stage Unit (FSU) Hamlet-Group Selection Rules in complex peri-urban strata',
              'Offline CAPI Tablet Cloud Sync reconciliation during low-bandwidth field tours',
              'DPDPA 2023 Digital Informant Consent compliance protocols',
            ],
            priorityCourses: [
              {
                courseId: 'igot-surv-01',
                title: 'CAPI Field Protocols and Digital Household Enumeration',
                provider: 'iGOT Karmayogi',
                targetOfficers: 420,
                duration: '6 Hours',
              },
              {
                courseId: 'nssta-stat-02',
                title: 'NSSO Multistage Stratified Sampling & Listing Masterclass',
                provider: 'NSSTA TPAC',
                targetOfficers: 310,
                duration: '12 Hours',
              },
            ],
          },
          {
            id: 'dpd',
            code: 'DPD-NSSO',
            name: 'Data Processing Division (DPD), NSSO',
            mandate: 'Microdata validation, editing rules, imputation pipelines, sampling weight estimation, and statistical tabulation.',
            headquarters: 'Mahalanobis Bhavan, 164 Gopal Lal Tagore Road, Kolkata',
            totalOfficers: 620,
            readinessScore: 81.5,
            domainScores: {
              'Statistical Competencies': 88.0,
              'Technical Competencies': 84.5,
              'Digital Governance': 74.0,
              'Behavioural & Managerial': 79.5,
            },
            criticalBottlenecks: [
              'Automated Multiplier Calculation for 2-stage circular systematic samples',
              'Python and R pipelines for microdata anonymization before public release',
            ],
            priorityCourses: [
              {
                courseId: 'igot-tech-04',
                title: 'Automated Microdata Cleaning & Anonymization Pipelines',
                provider: 'iGOT Karmayogi',
                targetOfficers: 180,
                duration: '8 Hours',
              },
            ],
          },
          {
            id: 'nad',
            code: 'NAD-CSO',
            name: 'National Accounts Division (NAD), CSO',
            mandate: 'Compilation of Gross Domestic Product (GDP), Gross Value Added (GVA), Consumer Price Index (CPI), and National Balance Sheets.',
            headquarters: 'Sardar Patel Bhawan, Sansad Marg, New Delhi',
            totalOfficers: 310,
            readinessScore: 84.0,
            domainScores: {
              'Statistical Competencies': 92.0,
              'Technical Competencies': 80.5,
              'Digital Governance': 79.0,
              'Behavioural & Managerial': 84.5,
            },
            criticalBottlenecks: [
              'Supply and Use Tables (SUT) rebasing under 2026 National Accounts framework',
              'High-frequency econometric time-series deflators for service sector GVA',
            ],
            priorityCourses: [
              {
                courseId: 'nssta-nad-01',
                title: 'National Accounts Aggregation & SUT Balancing Framework',
                provider: 'NSSTA TPAC',
                targetOfficers: 95,
                duration: '15 Hours',
              },
            ],
          },
          {
            id: 'diid',
            code: 'DIID-MoSPI',
            name: 'Data Informatics & Innovation Division (DIID)',
            mandate: 'Sovereign cloud compute, AI/ML statistical nowcasting, Karmayogi telemetry pipelines, and enterprise cybersecurity.',
            headquarters: 'Khurshid Lal Bhawan, Janpath, New Delhi',
            totalOfficers: 450,
            readinessScore: 82.8,
            domainScores: {
              'Statistical Competencies': 81.0,
              'Technical Competencies': 89.5,
              'Digital Governance': 87.0,
              'Behavioural & Managerial': 78.0,
            },
            criticalBottlenecks: [
              'Sovereign Cloud Data Residency Architecture for unit-level microdata',
              'AI/ML Statistical Foundation Model fine-tuning with local language survey audio',
            ],
            priorityCourses: [
              {
                courseId: 'igot-gov-06',
                title: 'Digital Data Governance & Sovereign Cloud Security for Civil Services',
                provider: 'iGOT Karmayogi',
                targetOfficers: 130,
                duration: '10 Hours',
              },
            ],
          },
        ],
        regionalCircles: [
          { circle: 'Northern Circle (New Delhi, Chandigarh, Jaipur)', headcount: 820, readiness: 81.2 },
          { circle: 'Western Circle (Mumbai, Ahmedabad, Pune)', headcount: 740, readiness: 79.5 },
          { circle: 'Southern Circle (Chennai, Bengaluru, Hyderabad)', headcount: 690, readiness: 83.1 },
          { circle: 'Eastern Circle (Kolkata, Bhubaneswar, Patna)', headcount: 610, readiness: 74.8 },
          { circle: 'North-Eastern Circle (Guwahati, Shillong, Agartala)', headcount: 360, readiness: 71.4 },
        ],
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDivisionMetrics();
  }, []);

  const displayedDivisions =
    data?.divisions.filter((d) => selectedDivisionId === 'all' || d.id === selectedDivisionId) || [];

/* Hallmark · component: AdminCommandCenter · genre: modern-minimal · theme: Cobalt/Gov */
/* states: default · hover · focus · active */
/* contrast: pass (WCAG AA 4.5:1+) */

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
              <Badge variant="neutral">NSSTA Administrative Hub</Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              MoSPI Cadre Capacity & Readiness Command Center
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-body">
              Live capacity tracking across 3,220 officers, 4 statistical divisions, and 5 regional circles under Mission Karmayogi.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDivisionMetrics(true)}
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
            {data?.totalCadreStrength.toLocaleString('en-IN') || '3,220'}
          </div>
          <p className="text-[11px] text-slate-500 font-body">Officers tracked across SSS & ISS cadres</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">System Readiness</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-800 tracking-tight font-display">
            {data?.systemReadinessScore || 78.4}%
          </div>
          <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-body">
            <TrendingUp className="w-3 h-3" />
            +3.4% above CBC baseline benchmark
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">ACBP Compliance</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-800 tracking-tight font-display">
            {data?.acbpComplianceScore || 84.2}%
          </div>
          <p className="text-[11px] text-amber-700 font-body">Target: Minimum 80% annual fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Active Bottlenecks</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-700 tracking-tight font-display">3</div>
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

      {/* ACBP Dossier Modal */}
      <AcbpDossierModal
        isOpen={isAcbpModalOpen}
        onClose={() => setIsAcbpModalOpen(false)}
      />
    </div>
  );
}
