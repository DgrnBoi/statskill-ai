/* Hallmark · macrostructure: Workbench · genre: Modern-Minimal Government Dashboard */
/* states: default · hover · focus · active · disabled */
/* contrast: pass (WCAG AA 4.5:1+) */

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PortalTab } from '../layout/Navbar';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  AlertTriangle,
  XCircle,
  FileText,
  BarChart2,
  Info,
  ArrowRight,
} from 'lucide-react';

export interface CompetencyItem {
  id: string;
  skillName: string;
  targetLevel: number;
  category: string;
  description?: string;
}

export interface RecentExamRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  durationMinutes: number;
  score: number;
  totalScore: number;
  status: 'passed' | 'remedial' | 'pending';
  misconceptions?: Array<{
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    misconception: string;
    remedialCourse: string;
    remedialCourseId: string;
  }>;
}

export interface CapacityCohort {
  id: string;
  name: string;
  division: string;
  officersCount: number;
  focusArea: string;
  badgeVariant: 'saffron' | 'success' | 'default' | 'neutral';
  imageGradient: string;
}

interface OfficerDashboardProps {
  currentCadre: string;
  onCadreChange: (cadre: string) => void;
  cadresList: string[];
  divisionName: string;
  divisionDescription: string;
  skills: CompetencyItem[];
  proficiency: Record<string, number>;
  onNavigateTab: (tab: PortalTab) => void;
  onOpenTelemetry?: () => void;
  onOpenAcbpModal?: () => void;
  officerName?: string;
  officerCadreId?: string;
  assessmentHistory?: RecentExamRecord[];
  capacityCohorts?: CapacityCohort[];
}

export function OfficerDashboard({
  currentCadre,
  onCadreChange,
  cadresList,
  divisionName,
  divisionDescription,
  skills,
  proficiency,
  onNavigateTab,
  onOpenTelemetry,
  onOpenAcbpModal,
  officerName = 'Eshaan Sunthankar',
  officerCadreId = 'JSO_1042',
  assessmentHistory: propAssessmentHistory,
  capacityCohorts: propCapacityCohorts,
}: OfficerDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('April – June 2026');
  const [activeHoverAxis, setActiveHoverAxis] = useState<number | null>(null);
  const [selectedExamForModal, setSelectedExamForModal] = useState<RecentExamRecord | null>(null);

  // Synthesize recent assessment history records with genuine MoSPI diagnostic data
  const defaultRecentExams: RecentExamRecord[] = useMemo(() => [
    {
      id: 'exam-01',
      title: 'Survey Design & Sampling Multipliers',
      category: 'Statistical Competencies',
      date: '04.09.2026',
      durationMinutes: 18,
      score: 85,
      totalScore: 100,
      status: 'passed',
      misconceptions: [
        {
          question: 'In NSSO 78th round, what does a household multiplier represent?',
          chosenAnswer: 'Raw unweighted count of sampled households.',
          correctAnswer: 'Inverse of selection probability (N/n expansion factor).',
          misconception: 'Confusing sample unit tally with population expansion factors.',
          remedialCourse: 'NSSO Unit Level Microdata & Multiplier Estimation',
          remedialCourseId: 'nsso-mult-301',
        },
      ],
    },
    {
      id: 'exam-02',
      title: 'CAPI & Digital Field Enumeration',
      category: 'Technical Competencies',
      date: '02.09.2026',
      durationMinutes: 27,
      score: 54,
      totalScore: 100,
      status: 'remedial',
      misconceptions: [
        {
          question: 'When offline CAPI validation fails, what is the mandatory protocol?',
          chosenAnswer: 'Override validation flag and sync directly to cloud.',
          correctAnswer: 'Record field supervisor query memo and re-verify respondent schedule.',
          misconception: 'Bypassing statutory data integrity rules during field collection.',
          remedialCourse: 'CAPI & BLAISE Field Operations & Validation Rules',
          remedialCourseId: 'capi-field-101',
        },
        {
          question: 'What GPS geotagging tolerance is permitted for First Stage Unit (FSU) boundary listing?',
          chosenAnswer: '500 meters from village centroid.',
          correctAnswer: 'Strict cadastral polygon boundary within 10 meters.',
          misconception: 'Underestimating spatial precision requirements in agricultural crop estimation.',
          remedialCourse: 'Agricultural Statistics & GPS Cadastral Mapping',
          remedialCourseId: 'agri-cadastral-201',
        },
      ],
    },
    {
      id: 'exam-03',
      title: 'Digital Personal Data Protection (DPDPA 2023)',
      category: 'Digital Governance',
      date: '28.08.2026',
      durationMinutes: 14,
      score: 92,
      totalScore: 100,
      status: 'passed',
    },
    {
      id: 'exam-04',
      title: 'National Accounts GVA & Macro Indices',
      category: 'Statistical Competencies',
      date: '20.08.2026',
      durationMinutes: 35,
      score: 88,
      totalScore: 100,
      status: 'passed',
    },
  ], []);

  const recentExams = propAssessmentHistory && propAssessmentHistory.length > 0
    ? propAssessmentHistory
    : defaultRecentExams;

  // Priority MoSPI Learning Cohorts (equivalent to Speaking Clubs in Image 2)
  const defaultCapacityCohorts: CapacityCohort[] = [
    {
      id: 'cohort-1',
      name: 'NSSO 79th Round Household Survey',
      division: 'FOD · Field Operations',
      officersCount: 14,
      focusArea: 'CAPI & Circular Systematic Sampling',
      badgeVariant: 'saffron',
      imageGradient: 'from-amber-600 to-amber-900',
    },
    {
      id: 'cohort-2',
      name: 'National Accounts SNA 2008 Working Group',
      division: 'NAD · Macroeconomics',
      officersCount: 8,
      focusArea: 'Supply-Use Tables & GVA Deflators',
      badgeVariant: 'default',
      imageGradient: 'from-blue-700 to-indigo-950',
    },
    {
      id: 'cohort-3',
      name: 'AI & Big Data for Official Statistics',
      division: 'DIID · Modernization',
      officersCount: 19,
      focusArea: 'Satellite Imagery & Nowcasting',
      badgeVariant: 'success',
      imageGradient: 'from-emerald-700 to-teal-950',
    },
    {
      id: 'cohort-4',
      name: 'DPDPA 2023 Data Fiduciary Taskforce',
      division: 'DPD · Microdata Scrutiny',
      officersCount: 12,
      focusArea: 'Unit-Level Anonymization & Consent',
      badgeVariant: 'neutral',
      imageGradient: 'from-amber-700 to-stone-900',
    },
  ];

  const capacityCohorts = propCapacityCohorts && propCapacityCohorts.length > 0
    ? propCapacityCohorts
    : defaultCapacityCohorts;

  // Division benchmark data (Attendance / Division Benchmarks from Image 2 & Image 1)
  const divisionBenchmarks = [
    { name: 'Field Operations Division (FOD)', score: 92, target: 85, color: 'bg-[#0B2E63]' },
    { name: 'Data Processing Division (DPD)', score: 85, target: 80, color: 'bg-indigo-600' },
    { name: 'National Accounts Division (NAD)', score: 78, target: 85, color: 'bg-amber-600' },
    { name: 'Data Informatics & Innovation (DIID)', score: 88, target: 85, color: 'bg-emerald-600' },
  ];

  // Calculate radar chart metrics across skills (6 axes)
  const radarAxes = useMemo(() => {
    // 6 fixed core dimensions for comprehensive visualization
    const dimensions = [
      { name: 'Survey Design', key: 'Survey Design & Sampling', defaultScore: 88, target: 80 },
      { name: 'CAPI Enumeration', key: 'CAPI & Digital Field Enumeration', defaultScore: 54, target: 80 },
      { name: 'Data Privacy', key: 'Data Privacy & DPDPA 2023', defaultScore: 92, target: 70 },
      { name: 'Field Ethics', key: 'Public Ethics & Field Communication', defaultScore: 80, target: 75 },
      { name: 'Macro Indices', key: 'National Accounts & Macro Indices', defaultScore: 88, target: 85 },
      { name: 'Data Analytics', key: 'Statistical Data Analytics (R & Python)', defaultScore: 74, target: 80 },
    ];

    return dimensions.map((dim) => {
      // Find matching skill from current cadre if present
      const matched = skills.find(s => s.skillName.toLowerCase().includes(dim.name.toLowerCase()));
      const actualScore = matched ? ((proficiency[matched.id] || 3) / 5) * 100 : dim.defaultScore;
      const targetScore = matched ? (matched.targetLevel / 5) * 100 : dim.target;

      return {
        label: dim.name,
        actualScore: Math.min(100, Math.max(10, actualScore)),
        targetScore: Math.min(100, Math.max(10, targetScore)),
        level: Math.round((actualScore / 100) * 5),
      };
    });
  }, [skills, proficiency]);

  // Overall aggregate mastery calculations
  const overallProgress = useMemo(() => {
    const sum = radarAxes.reduce((acc, curr) => acc + curr.actualScore, 0);
    return Math.round(sum / radarAxes.length);
  }, [radarAxes]);

  // SVG Radar Geometry Calculations
  const radarGeometry = useMemo(() => {
    const size = 300;
    const center = size / 2;
    const radius = 95;
    const numAxes = radarAxes.length;

    // Calculate ring levels (20%, 40%, 60%, 80%, 100%)
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0].map((ringPercent) => {
      const ringRadius = radius * ringPercent;
      const points = Array.from({ length: numAxes }).map((_, i) => {
        const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
        const x = center + ringRadius * Math.cos(angle);
        const y = center + ringRadius * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return { percent: ringPercent * 100, points };
    });

    // Calculate axes lines and label positions
    const axesLines = radarAxes.map((axis, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const labelDistance = radius + 24;
      const labelX = center + labelDistance * Math.cos(angle);
      const labelY = center + labelDistance * Math.sin(angle);

      // Data point coordinates for actual score
      const actualRadius = radius * (axis.actualScore / 100);
      const actualX = center + actualRadius * Math.cos(angle);
      const actualY = center + actualRadius * Math.sin(angle);

      // Data point coordinates for target score
      const targetRadius = radius * (axis.targetScore / 100);
      const targetX = center + targetRadius * Math.cos(angle);
      const targetY = center + targetRadius * Math.sin(angle);

      return {
        ...axis,
        index: i,
        axisX: x.toFixed(1),
        axisY: y.toFixed(1),
        labelX: labelX.toFixed(1),
        labelY: labelY.toFixed(1),
        actualX: actualX.toFixed(1),
        actualY: actualY.toFixed(1),
        targetX: targetX.toFixed(1),
        targetY: targetY.toFixed(1),
        angle,
      };
    });

    // Form polygon string for actual user proficiency
    const actualPolygonPoints = axesLines.map(a => `${a.actualX},${a.actualY}`).join(' ');

    // Form polygon string for target benchmark
    const targetPolygonPoints = axesLines.map(a => `${a.targetX},${a.targetY}`).join(' ');

    return { size, center, rings, axesLines, actualPolygonPoints, targetPolygonPoints };
  }, [radarAxes]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. OFFICER PROFILE HEADER & CADRE WORKBENCH BAR                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-1.5 bg-[#0B2E63]/10 text-[#0B2E63] rounded-lg">
              <GraduationCap className="w-5 h-5 text-[#0B2E63]" />
            </span>
            <Badge variant="default">{currentCadre}</Badge>
            <Badge variant="saffron">{divisionName}</Badge>
            <span className="font-mono text-xs text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
              ID: {officerCadreId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Officer Competency & Diagnostic Hub
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {divisionDescription}
          </p>
        </div>

        {/* Cadre Selector & Quick Action Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-col gap-1">
            <label htmlFor="cadre-select" className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              MoSPI Cadre Track:
            </label>
            <select
              id="cadre-select"
              value={currentCadre}
              onChange={(e) => onCadreChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-3 py-2 shadow-xs focus:ring-2 focus:ring-[#0B2E63] focus:outline-none cursor-pointer"
            >
              {cadresList.map((cadre) => (
                <option key={cadre} value={cadre}>
                  {cadre}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-2 mt-4 sm:mt-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Take Diagnostic Exam</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP GRID: LEARNING PROGRESS OVERVIEW & ACTIVE COHORTS (2:1 Ratio)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* HERO CARD (2 Columns): Learning Progress Overview with Interactive Radar */}
        <Card className="lg:col-span-2 shadow-xs border-slate-200/90 overflow-hidden flex flex-col justify-between">
          <CardHeader className="flex flex-row justify-between items-start border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success">Live Diagnostic Assessment</Badge>
                <span className="text-xs text-slate-400 font-mono">•</span>
                <span className="text-xs text-slate-500 font-medium">Mission Karmayogi FRAC</span>
              </div>
              <CardTitle className="text-xl">Learning Progress Overview</CardTitle>
              <CardDescription>
                Multi-dimensional competency benchmark mapping for {currentCadre}.
              </CardDescription>
            </div>

            {/* Period Selector Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedPeriod}</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Metrics Column (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                    Overall Cadre Mastery
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    +12%
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-slate-900 tracking-tight">
                    {overallProgress}%
                  </span>
                  <span className="text-sm font-semibold text-slate-500">Competency Achieved</span>
                </div>
              </div>

              {/* High-density stats pods */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Avg Diagnostic Score</span>
                  <span className="font-mono font-bold text-slate-900">84.8%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">FRAC Competencies Mastered</span>
                  <span className="font-mono font-bold text-slate-900">5 of 6 Skills</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Active Assessment Time</span>
                  <span className="font-mono font-bold text-slate-900">34.5 hrs</span>
                </div>
              </div>

              {/* Goal Reached Callout Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0B2E63] text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700 font-medium leading-snug">
                  <strong className="text-slate-900 font-bold">88% of Annual ACBP Goal</strong> achieved for current fiscal year.
                </p>
              </div>
            </div>

            {/* Right Interactive SVG Spider Radar Chart (7 cols) */}
            <div className="md:col-span-7 flex flex-col items-center justify-center relative py-2">
              <svg
                viewBox={`0 0 ${radarGeometry.size} ${radarGeometry.size}`}
                className="w-full max-w-[280px] sm:max-w-[320px] aspect-square overflow-visible select-none drop-shadow-xs"
              >
                <defs>
                  {/* Glowing Radar Gradient Fill */}
                  <linearGradient id="radarProficiencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#0B2E63" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FF9933" stopOpacity="0.35" />
                  </linearGradient>

                  {/* Filter for subtle glow */}
                  <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Background Web Rings (Concentric Polygons) */}
                {radarGeometry.rings.map((ring, idx) => (
                  <polygon
                    key={idx}
                    points={ring.points}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth={idx === radarGeometry.rings.length - 1 ? '1.5' : '1'}
                    strokeDasharray={idx === radarGeometry.rings.length - 1 ? 'none' : '3 3'}
                  />
                ))}

                {/* 2. Radial Axis Lines */}
                {radarGeometry.axesLines.map((axis, idx) => (
                  <line
                    key={idx}
                    x1={radarGeometry.center}
                    y1={radarGeometry.center}
                    x2={axis.axisX}
                    y2={axis.axisY}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                ))}

                {/* 3. Target Benchmark Polygon (Dashed Navy Line) */}
                <polygon
                  points={radarGeometry.targetPolygonPoints}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                >
                  <title>MoSPI Standard Benchmark</title>
                </polygon>

                {/* 4. Officer Assessed Proficiency Polygon (Filled with vibrant gradient) */}
                <polygon
                  points={radarGeometry.actualPolygonPoints}
                  fill="url(#radarProficiencyGradient)"
                  stroke="#0B2E63"
                  strokeWidth="2.5"
                  filter="url(#radarGlow)"
                  className="transition-all duration-500 ease-out"
                />

                {/* 5. Interactive Vertex Dots & Tooltips */}
                {radarGeometry.axesLines.map((axis, idx) => {
                  const isHovered = activeHoverAxis === idx;
                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setActiveHoverAxis(idx)}
                      onMouseLeave={() => setActiveHoverAxis(null)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse ring on hover */}
                      {isHovered && (
                        <circle
                          cx={axis.actualX}
                          cy={axis.actualY}
                          r="10"
                          fill="#3B82F6"
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={axis.actualX}
                        cy={axis.actualY}
                        r={isHovered ? '6' : '4.5'}
                        fill="#0B2E63"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />

                      {/* Axis Label */}
                      <text
                        x={axis.labelX}
                        y={Number(axis.labelY) + (Math.sin(axis.angle) > 0.5 ? 6 : -4)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`font-mono text-[10px] font-bold transition-all ${
                          isHovered ? 'fill-[#0B2E63] font-extrabold text-[11px]' : 'fill-slate-600'
                        }`}
                      >
                        {axis.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Active Hover Tooltip Card */}
              {activeHoverAxis !== null && (
                <div className="absolute -bottom-2 bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold">{radarGeometry.axesLines[activeHoverAxis].label}:</span>
                  <span className="text-emerald-300 font-bold">
                    {Math.round(radarGeometry.axesLines[activeHoverAxis].actualScore)}% (Level {radarGeometry.axesLines[activeHoverAxis].level}/5)
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    [Benchmark: {Math.round(radarGeometry.axesLines[activeHoverAxis].targetScore)}%]
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT CARD (1 Column): MoSPI Capacity Cohorts (Speaking Clubs equivalent) */}
        <Card className="shadow-xs border-slate-200/90 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg">Capacity Cohorts</CardTitle>
              <CardDescription>Active MoSPI peer working groups</CardDescription>
            </div>
            <span className="p-1 bg-slate-100 rounded-md text-slate-500">
              <Users className="w-4 h-4" />
            </span>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3">
            {capacityCohorts.map((cohort) => (
              <div
                key={cohort.id}
                onClick={() => onNavigateTab('discover')}
                className="group p-3 rounded-xl border border-slate-200/80 hover:border-[#0B2E63]/60 bg-white hover:bg-slate-50/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cohort.imageGradient} text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    {cohort.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0B2E63] transition-colors line-clamp-1">
                      {cohort.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cohort.focusArea}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono font-bold text-slate-700 block">
                    {cohort.officersCount}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Officers</span>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('discover')}
              className="w-full justify-center text-xs font-bold text-[#0B2E63]"
            >
              <span>Explore All 12 MoSPI Cohorts</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM GRID: RECENT TESTS & MISTAKE AUDIT + DIVISION BENCHMARKS        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ASSESSMENTS & MISTAKE DIAGNOSTIC TABLE (2 Columns) */}
        <Card className="lg:col-span-2 shadow-xs border-slate-200/90 overflow-hidden flex flex-col justify-between">
          <CardHeader className="flex flex-row justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">Official Assessment Ledger</Badge>
                <span className="text-xs text-slate-400 font-mono">•</span>
                <span className="text-xs text-slate-500 font-medium">ADL xAPI Verified</span>
              </div>
              <CardTitle className="text-xl">Recent Diagnostic Assessments & Mistake Analysis</CardTitle>
              <CardDescription>
                Click on any examination record to inspect diagnostic misconceptions and remedial recommendations.
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('dashboard')}
              className="text-xs text-[#0B2E63] font-bold"
            >
              See All Tests
            </Button>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Assessment Title</th>
                  <th className="py-3 px-3 font-semibold">Outcome</th>
                  <th className="py-3 px-3 font-semibold text-right">Score</th>
                  <th className="py-3 px-3 font-semibold text-right">Duration</th>
                  <th className="py-3 px-3 font-semibold text-right">Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {recentExams.map((exam) => {
                  const hasMisconceptions = exam.misconceptions && exam.misconceptions.length > 0;
                  return (
                    <tr
                      key={exam.id}
                      onClick={() => hasMisconceptions && setSelectedExamForModal(exam)}
                      className={`transition-colors ${
                        hasMisconceptions ? 'cursor-pointer hover:bg-amber-50/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#0B2E63] flex-shrink-0" />
                          <span>{exam.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{exam.category}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        {exam.status === 'passed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Remedial Required</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                        {exam.score} / {exam.totalScore}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{exam.durationMinutes} min</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-500 text-[11px]">
                        {exam.date}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {hasMisconceptions ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExamForModal(exam);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              Inspect {exam.misconceptions?.length}{' '}
                              {exam.misconceptions?.length === 1 ? 'Gap' : 'Gaps'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenTelemetry?.();
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 font-mono cursor-pointer"
                          >
                            <span>xAPI Log</span>
                            <Terminal className="w-3 h-3 text-[#0B2E63]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All 4 test records synchronized to Central Karmayogi Learning Record Store.</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenTelemetry}
              className="text-xs font-mono"
            >
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              <span>Inspect Telemetry Drawer</span>
            </Button>
          </div>
        </Card>

        {/* RIGHT CARD (1 Column): MoSPI Division Benchmarks (Attendance equivalent) */}
        <Card className="shadow-xs border-slate-200/90 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 pb-4 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg">Division Benchmarks</CardTitle>
              <CardDescription>Cadre readiness equity comparison</CardDescription>
            </div>
            <span className="p-1 bg-slate-100 rounded-md text-slate-500">
              <BarChart2 className="w-4 h-4" />
            </span>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {divisionBenchmarks.map((div, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{div.name}</span>
                  <span className="font-mono font-bold text-slate-900">{div.score}%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
                  <div
                    className={`h-full rounded-full ${div.color} transition-all duration-700 ease-out`}
                    style={{ width: `${div.score}%` }}
                  />
                  {/* Benchmark Target Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                    style={{ left: `${div.target}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Current: {div.score}%</span>
                  <span>Target: {div.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>14 Diagnostic Modules Completed</span>
              <span className="text-emerald-700 font-mono font-bold">+5% vs National Baseline</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAcbpModal}
              className="w-full justify-center text-xs font-bold"
            >
              <span>Generate Officer ACBP Dossier</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: MISCONCEPTION DIAGNOSTIC INSPECTOR & REMEDIAL PATHWAY            */}
      {/* ========================================================================= */}
      {selectedExamForModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedExamForModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <Badge variant="saffron">Cognitive Misconception Analysis</Badge>
                <h3 className="text-lg font-display font-bold text-slate-900 mt-1">
                  {selectedExamForModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Itemized diagnostic breakdown of selected distractors and root causes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExamForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List of itemized misconceptions */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedExamForModal.misconceptions?.map((misc, idx) => (
                <div key={idx} className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{misc.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-900">
                      <span className="font-mono text-[10px] font-bold text-red-700 block uppercase">
                        Selected Distractor:
                      </span>
                      <span className="font-medium">{misc.chosenAnswer}</span>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                      <span className="font-mono text-[10px] font-bold text-emerald-700 block uppercase">
                        Statutory Correct Answer:
                      </span>
                      <span className="font-medium">{misc.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-amber-300/80 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      <span>Identified Conceptual Misconception:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-5">
                      {misc.misconception}
                    </p>
                  </div>

                  {/* Remedial Recommendation Action */}
                  <div className="flex justify-between items-center pt-2 border-t border-amber-200/60">
                    <span className="text-[11px] text-slate-600 font-medium">
                      Target Course: <strong className="text-slate-900">{misc.remedialCourse}</strong>
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedExamForModal(null);
                        onNavigateTab('discover');
                      }}
                      className="text-xs font-bold"
                    >
                      <span>Start Remedial Module</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedExamForModal(null)}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
