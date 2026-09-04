import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { assessDeviceCapability, DeviceCapability } from '../utils/detectPerformance';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { XApiTelemetryDrawer, XApiStatementPayload } from '../components/ui/XApiTelemetryDrawer';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Search,
  ExternalLink,
  BookOpen,
  Award,
  BarChart3,
  Sparkles,
  Cpu,
  Layers,
  GraduationCap,
  Clock,
  ChevronRight,
  TrendingUp,
  Terminal,
} from 'lucide-react';

export interface Competency {
  id: string;
  skillName: string;
  targetLevel: number;
  category: string;
  description?: string;
}

export interface QuizQuestionItem {
  id?: string;
  courseId?: string;
  topic?: string;
  bloomLevel?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  sourceCitation?: string;
}

export interface CourseItem {
  id?: string;
  title: string;
  domain?: string;
  provider?: string;
  duration?: string;
  durationHours?: number;
  level?: number;
  targetLevel?: number;
  description?: string;
  tags?: string[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  provider: string;
  duration: string;
  link: string;
  keywords?: string[];
}

const MOSPI_CADRES_DATA: Record<string, { division: string; description: string; competencies: Competency[] }> = {
  'Junior Statistical Officer (JSO)': {
    division: 'Field Operations Division (FOD), NSSO',
    description: 'Frontline statistical investigator responsible for primary household/enterprise survey enumeration, CAPI digital data entry, and agricultural crop estimation.',
    competencies: [
      { id: 'jso-1', skillName: 'Survey Design & Sampling', targetLevel: 3, category: 'Statistical Competencies', description: 'Understanding First Stage Units (FSUs), household listing, and circular systematic sampling.' },
      { id: 'jso-2', skillName: 'CAPI & Digital Field Enumeration', targetLevel: 4, category: 'Technical Competencies', description: 'Operating Computer Assisted Personal Interviewing tablets, GPS geotagging, and cloud data sync.' },
      { id: 'jso-3', skillName: 'Data Privacy & DPDPA 2023', targetLevel: 2, category: 'Digital Governance', description: 'Securing informant consent, protecting PII of survey respondents, and complying with data fiduciary rules.' },
      { id: 'jso-4', skillName: 'Public Ethics & Field Communication', targetLevel: 3, category: 'Behavioural and Managerial', description: 'Engaging rural/urban respondents professionally, minimizing non-response bias, and maintaining impartiality.' },
    ],
  },
  'Senior Statistical Officer (SSO)': {
    division: 'Data Processing Division (DPD), NSSO',
    description: 'Supervisory statistical officer overseeing field team audits, scrutiny of survey schedules, micro-data cleaning, and tabulation.',
    competencies: [
      { id: 'sso-1', skillName: 'Survey Design & Sampling Weights', targetLevel: 4, category: 'Statistical Competencies', description: 'Scrutiny of sampling weights, multiplier estimation, and non-sampling error detection.' },
      { id: 'sso-2', skillName: 'Statistical Data Analytics (R & Python)', targetLevel: 3, category: 'Technical Competencies', description: 'Executing automated consistency checks, missing data imputation, and outlier analysis.' },
      { id: 'sso-3', skillName: 'Cyber Security & Data Fiduciary', targetLevel: 3, category: 'Digital Governance', description: 'Ensuring anonymization protocols before releasing unit-level microdata to researchers.' },
      { id: 'sso-4', skillName: 'Supervisory Leadership & Audit', targetLevel: 4, category: 'Behavioural and Managerial', description: 'Conducting statistical inspections of regional field offices and drafting inspection memos.' },
    ],
  },
  'Assistant Director (ISS)': {
    division: 'National Accounts Division (NAD)',
    description: 'Middle management statistical policymaker responsible for macroeconomic indicators, GDP/GVA compilation, and CPI/IIP indices.',
    competencies: [
      { id: 'ad-1', skillName: 'National Accounts & Macro Indices', targetLevel: 4, category: 'Statistical Competencies', description: 'System of National Accounts (SNA 2008/2025), Gross Value Added (GVA), and Supply-Use Tables.' },
      { id: 'ad-2', skillName: 'Time Series & Seasonal Adjustment', targetLevel: 4, category: 'Technical Competencies', description: 'Applying X-13ARIMA-SEATS seasonal adjustment on monthly CPI and IIP data.' },
      { id: 'ad-3', skillName: 'National Data Governance Framework', targetLevel: 4, category: 'Digital Governance', description: 'Inter-ministerial data sharing protocols, API standardization, and open data portals.' },
      { id: 'ad-4', skillName: 'Evidence-Based Policy Writing', targetLevel: 4, category: 'Behavioural and Managerial', description: 'Synthesizing complex empirical statistical findings into actionable cabinet notes and policy briefs.' },
    ],
  },
  'Director [DIID] (ISS)': {
    division: 'Data Informatics & Innovation Division (DIID)',
    description: 'Apex leadership officer spearheading statistical modernization, AI/ML integration, sovereign cloud infrastructure, and Karmayogi capacity building.',
    competencies: [
      { id: 'dir-1', skillName: 'Official Statistics Architecture', targetLevel: 5, category: 'Statistical Competencies', description: 'UN Fundamental Principles of Official Statistics and National Statistical Commission guidelines.' },
      { id: 'dir-2', skillName: 'Big Data, Cloud & AI/ML Architecture', targetLevel: 5, category: 'Technical Competencies', description: 'Leveraging web scraping, satellite imagery, and high-performance computing for real-time nowcasting.' },
      { id: 'dir-3', skillName: 'Digital Personal Data Protection & Sovereign Clouds', targetLevel: 5, category: 'Digital Governance', description: 'Ensuring enterprise compliance with CERT-In mandates and sovereign data residency requirements.' },
      { id: 'dir-4', skillName: 'Strategic Leadership & Change Management', targetLevel: 5, category: 'Behavioural and Managerial', description: 'Driving organizational transformation, cross-departmental coordination, and institutional capacity building.' },
    ],
  },
};

/**
 * Unbiased Fisher-Yates array shuffle extracted outside component scope
 */
function shuffleArray<T>(arr: T[]): T[] {
  if (!arr || !Array.isArray(arr) || arr.length <= 1) return arr ? [...arr] : [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Dashboard() {
  const [designation, setDesignation] = useState('Junior Statistical Officer (JSO)');
  const [proficiency, setProficiency] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestionItem[]>([]);
  const [paperSet, setPaperSet] = useState<string>('Set A');
  const [reshufflesLeft, setReshufflesLeft] = useState<number>(3);
  const [deviceMode, setDeviceMode] = useState<DeviceCapability | 'LOADING'>('POTATO_DEVICE');
  const [selectedCourseContext, setSelectedCourseContext] = useState<string | null>(null);

  // Navigation and Discovery States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discover' | 'competency' | 'analytics'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [assessmentsTaken, setAssessmentsTaken] = useState(0);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [latestTelemetryStatement, setLatestTelemetryStatement] = useState<XApiStatementPayload | null>(null);

  // Resilient error states
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Ref to track active polling interval and prevent zombie timers on unmount
  const pollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Pure state derivation: competencies derived directly from selected cadre
  const skills = useMemo(() => {
    const cadreData = MOSPI_CADRES_DATA[designation] || MOSPI_CADRES_DATA['Junior Statistical Officer (JSO)'];
    return cadreData.competencies;
  }, [designation]);

  // Synchronize initial proficiency levels when skills change
  useEffect(() => {
    const initialProf: Record<string, number> = {};
    skills.forEach((s) => {
      initialProf[s.skillName] = Math.max(1, s.targetLevel - 1);
    });
    setProficiency(initialProf);
  }, [skills]);

  // Clean up any running polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  // Hardware capability auto-detection
  useEffect(() => {
    assessDeviceCapability().then(setDeviceMode);
  }, []);

  // Fetch real government courses catalog with AbortController for network resilience
  useEffect(() => {
    const controller = new AbortController();
    const domainQuery = selectedDomain !== 'All' ? `&domain=${encodeURIComponent(selectedDomain)}` : '';
    setCourseError(null);

    fetch(`http://localhost:5000/api/courses/search?q=${encodeURIComponent(searchQuery)}${domainQuery}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses.slice(0, 9)); // Show top 9 results
        } else {
          setCourses([]);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Course fetch error:', err);
          setCourseError('Unable to refresh courses. Displaying verified local catalog.');
        }
      });

    return () => controller.abort();
  }, [searchQuery, selectedDomain]);

  const selectCourseForQuiz = useCallback((courseTitle: string) => {
    setSelectedCourseContext(courseTitle);
    setGeneratedQuiz([]);
    setActiveTab('dashboard');
    setTimeout(() => {
      const el = document.getElementById('quiz-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleProficiencyChange = useCallback((skillName: string, level: number) => {
    setProficiency((prev) => ({ ...prev, [skillName]: level }));
    setAssessmentsTaken((prev) => prev + 1);
  }, []);

  const handleReshuffle = useCallback(() => {
    if (reshufflesLeft <= 0 || generatedQuiz.length === 0) return;

    const setCycle: Record<string, string> = {
      'Set A': 'Set B',
      'Set B': 'Set C',
      'Set C': 'Set D',
      'Set D': 'Set A',
    };
    const nextSet = setCycle[paperSet] || 'Set B';

    // Shuffles order and options strictly without adding new questions
    const reorderedQuestions = shuffleArray(generatedQuiz).map((q) => {
      const shuffledOptions = shuffleArray(q.options || []);
      return {
        ...q,
        options: shuffledOptions,
      };
    });

    setGeneratedQuiz(reorderedQuestions);
    setPaperSet(nextSet);
    setReshufflesLeft((prev) => prev - 1);
  }, [reshufflesLeft, generatedQuiz, paperSet]);

  const handleGenerateQuiz = async (file?: File) => {
    // Clear any active poll before starting new generation
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    setIsUploading(true);
    setAssessmentError(null);
    setGeneratedQuiz([]);

    const formData = new FormData();
    if (file) {
      formData.append('document', file);
    }
    if (selectedCourseContext) {
      formData.append('courseId', selectedCourseContext);
    }
    formData.append('numQuestions', '3');
    formData.append('difficulty', 'intermediate');

    try {
      const response = await fetch(`http://localhost:5000/api/quiz/generate-async?mode=${deviceMode}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}: Failed to start assessment job`);
      }

      const initData = await response.json();
      if (!initData.jobId) throw new Error(initData.error || 'Failed to start job');

      let pollAttempts = 0;
      let consecutiveErrors = 0;
      const MAX_ATTEMPTS = 40; // 60s max timeout

      pollIntervalRef.current = setInterval(async () => {
        pollAttempts++;
        if (pollAttempts > MAX_ATTEMPTS) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setIsUploading(false);
          setAssessmentError('Assessment generation timed out after 60s. Please try again or switch to Edge Offline Bank.');
          return;
        }

        try {
          const statusRes = await fetch(`http://localhost:5000/api/quiz/status/${initData.jobId}`);
          if (!statusRes.ok) {
            throw new Error(`HTTP ${statusRes.status}`);
          }
          const statusData = await statusRes.json();
          consecutiveErrors = 0; // reset on success

          if (statusData.status === 'complete') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsUploading(false);
            if (statusData.result && Array.isArray(statusData.result.questions)) {
              setGeneratedQuiz(statusData.result.questions);
              if (statusData.result.setLetter) {
                setPaperSet(`Set ${statusData.result.setLetter}`);
              } else {
                setPaperSet('Set A');
              }
              setReshufflesLeft(3);
            }
          } else if (statusData.status === 'error') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsUploading(false);
            setAssessmentError(statusData.error || 'Assessment Engine encountered an error.');
          }
        } catch (err) {
          consecutiveErrors++;
          console.error(`Poll attempt ${pollAttempts} failed:`, err);
          if (consecutiveErrors >= 5) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsUploading(false);
            setAssessmentError('Connection to backend assessment service lost. Please verify your network.');
          }
        }
      }, 1500);
    } catch (error: any) {
      console.error('Submission error:', error);
      setIsUploading(false);
      setAssessmentError(error.message || 'Failed to start assessment.');
    }
  };

  const analyticsData = useMemo(() => {
    const numSkills = skills.length || 1;
    const avgLevel = (Object.values(proficiency).reduce((a, b) => a + b, 0) / numSkills).toFixed(1);

    let topGapSkill = 'None';
    let maxGap = -1;
    skills.forEach((s) => {
      const currentLvl = proficiency[s.skillName] || 1;
      const gap = s.targetLevel - currentLvl;
      if (gap > maxGap) {
        maxGap = gap;
        topGapSkill = s.skillName;
      }
    });

    return { avgLevel, topGapSkill };
  }, [skills, proficiency]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-primary-900 selection:text-white">
      {/* Official Government Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="max-w-7xl mx-auto py-8 px-4 md:px-10 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: ASSESSMENT ENGINE (SOVEREIGN EDGE-AI & QUESTION GENERATION)       */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Card id="quiz-section">
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-primary-100 text-primary-900 rounded-md">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <Badge variant="default">Official Examination Module</Badge>
                    {selectedCourseContext && (
                      <Badge variant="saffron">{selectedCourseContext}</Badge>
                    )}
                  </div>
                  <CardTitle>Sovereign Edge-AI Assessment Generator</CardTitle>
                  <CardDescription>
                    Generate active-recall examination papers mapped to MoSPI FRAC competency benchmarks.
                  </CardDescription>
                </div>

                {/* Device Mode Toggle & Telemetry Inspector Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTelemetryDrawerOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold rounded-md transition-all shadow-xs border flex items-center gap-1.5 bg-slate-900 text-emerald-300 border-emerald-500/40 hover:bg-slate-800 cursor-pointer active:scale-95"
                    title="Inspect live ADL xAPI learning record sent to iGOT LRS"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>iGOT LRS Telemetry</span>
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeviceMode((prev) =>
                        prev === 'MODERN_DEVICE' ? 'POTATO_DEVICE' : 'MODERN_DEVICE'
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all shadow-xs border flex items-center gap-2 cursor-pointer ${
                      deviceMode === 'MODERN_DEVICE'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {deviceMode === 'MODERN_DEVICE'
                      ? 'Cloud Live RAG (PDF)'
                      : 'Edge Offline Bank'}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Upload & Direct Practice Container */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isUploading
                      ? 'border-primary-500 bg-primary-50/40'
                      : 'border-slate-300 hover:border-primary-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-4 text-primary-900">
                    {isUploading ? (
                      <RotateCw className="w-6 h-6 animate-spin text-primary-900" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-primary-900" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {isUploading
                      ? 'Synthesizing Examination Paper...'
                      : 'Upload MoSPI Manual / Training PDF'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                    Upload official training circulars or test immediately against the verified MoSPI
                    examination bank. Anti-collusion algorithms ensure unique sequence and option sets.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      id="pdf-upload"
                      aria-label="Upload official training circular or manual in PDF format"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        handleGenerateQuiz(e.target.files[0]);
                      }}
                    />
                    <label
                      htmlFor="pdf-upload"
                      tabIndex={isUploading ? -1 : 0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          document.getElementById('pdf-upload')?.click();
                        }
                      }}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-xs inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${
                        isUploading
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-primary-900 text-white hover:bg-primary-800 cursor-pointer'
                      }`}
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      {isUploading ? 'Processing File...' : 'Browse Local PDF'}
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => handleGenerateQuiz()}
                      className="text-xs font-bold border-slate-300 text-slate-800 hover:bg-white"
                    >
                      <BookOpen className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      Practice from Verified Question Bank
                    </Button>
                  </div>

                  {/* Inline Assessment Error Banner */}
                  {assessmentError && (
                    <div role="alert" className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-900 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium">{assessmentError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAssessmentError(null)}
                        className="text-xs font-bold text-red-800 hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        aria-label="Dismiss error notice"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                {/* Generated Assessment Paper Output */}
                {generatedQuiz.length > 0 && (
                  <div className="mt-10 animate-fade-in border-t border-slate-200 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Official Assessment Paper</h3>
                          <p className="text-xs text-slate-600">
                            Candidate Evaluation • MoSPI FRAC Standards
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Plain Words Badge */}
                        <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-md shadow-xs uppercase tracking-wider">
                          Paper: {paperSet}
                        </span>

                        {/* Reshuffle Button: max 3 attempts */}
                        <button
                          type="button"
                          onClick={handleReshuffle}
                          disabled={reshufflesLeft <= 0}
                          aria-label={`Reshuffle question and option sequence (${reshufflesLeft} attempts remaining)`}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 ${
                            reshufflesLeft > 0
                              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 cursor-pointer shadow-xs active:scale-95'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          title={
                            reshufflesLeft > 0
                              ? 'Shuffle sequence & options'
                              : 'Maximum 3 reshuffles allowed per session'
                          }
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                          Reshuffle ({reshufflesLeft} left)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {generatedQuiz.map((q, index) => (
                        <QuizQuestion
                          key={`${paperSet}-${index}-${q.question ? q.question.slice(0, 15) : index}`}
                          q={q}
                          index={index}
                          handleProficiencyChange={handleProficiencyChange}
                          skillToUpdate={skills.length > 0 ? skills[0].skillName : 'Survey Design & Sampling'}
                          onTelemetryStatement={setLatestTelemetryStatement}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DISCOVER COURSES (REAL 880+ CATALOG)                               */}
        {/* ========================================================================= */}
        {activeTab === 'discover' && (
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 bg-primary-100 text-primary-900 rounded-md">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <Badge variant="default">880+ Authentic Courses</Badge>
                  <Badge variant="success">iGOT Karmayogi & NSSTA TPAC</Badge>
                </div>
                <CardTitle>Government of India Course Discovery</CardTitle>
                <CardDescription>
                  Search official training programs across Statistical, Technical, Digital Governance, and Behavioural domains.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search authentic government courses across MoSPI, iGOT, and NSSTA"
                  placeholder="Search 880+ official courses (e.g., 'Sampling', 'CPI', 'National Accounts', 'Python', 'DPDPA')..."
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary-900 focus:ring-2 focus:ring-primary-100 shadow-xs text-sm text-slate-900 bg-white"
                />
              </div>

              {/* Course Fetch Error Banner if offline */}
              {courseError && (
                <div role="alert" className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" aria-hidden="true" />
                  <span>{courseError}</span>
                </div>
              )}

              {/* Domain Filter Pills */}
              <div className="flex flex-wrap gap-2" aria-label="Course Domain Filter">
                {[
                  'All',
                  'Statistical Competencies',
                  'Technical Competencies',
                  'Digital Governance',
                  'Behavioural and Managerial Competencies',
                ].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={selectedDomain === filter}
                    onClick={() => setSelectedDomain(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 ${
                      selectedDomain === filter
                        ? 'bg-primary-900 text-white border-primary-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.length > 0 ? (
                  courses.map((course: CourseItem, idx: number) => (
                    <Card
                      key={course.id || idx}
                      className="flex flex-col justify-between hover:shadow-md transition-all duration-200 border-slate-200 hover:border-primary-300 bg-white"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <Badge variant="saffron" className="text-[10px]">
                            {course.domain || 'MoSPI / NSSTA'}
                          </Badge>
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration || '4 Hours'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-2">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.description ||
                            'Official government competency enhancement module aligned with Karmayogi FRAC framework.'}
                        </p>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                        <span className="text-xs font-bold text-primary-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          Level {course.targetLevel || 3}
                        </span>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => selectCourseForQuiz(course.title)}
                        >
                          Generate Quiz
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-700">No courses match your filter</h4>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the domain filter or search terms.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COMPETENCY PROFILE & FRAC MATRIX                                   */}
        {/* ========================================================================= */}
        {activeTab === 'competency' && (
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-primary-100 text-primary-900 rounded-md">
                      <Award className="w-4 h-4" />
                    </span>
                    <Badge variant="default">MoSPI FRAC Taxonomy</Badge>
                  </div>
                  <CardTitle>Officer Competency Profile</CardTitle>
                  <CardDescription>
                    Framework for Roles, Activities and Competencies (FRAC) benchmarked across 4 official domains.
                  </CardDescription>
                </div>

                <div className="w-full md:w-auto">
                  <label htmlFor="cadre-select" className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Official Cadre / Designation:
                  </label>
                  <select
                    id="cadre-select"
                    value={designation}
                    aria-label="Official Cadre / Designation"
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-primary-900 focus:ring-2 focus:ring-primary-100 shadow-xs cursor-pointer"
                  >
                    <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                    <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                    <option value="Assistant Director (ISS)">Assistant Director (ISS)</option>
                    <option value="Director [DIID] (ISS)">Director [DIID] (ISS)</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                <div className="bg-primary-50/60 border border-primary-100 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-primary-900 uppercase tracking-wide">
                      Assigned Division: {MOSPI_CADRES_DATA[designation]?.division}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {MOSPI_CADRES_DATA[designation]?.description}
                    </p>
                  </div>
                  <Badge variant="success">Cadre Active</Badge>
                </div>

                {/* Competency Matrix Cards */}
                <div className="space-y-4">
                  {skills.map((skill) => {
                    const currentLevel = proficiency[skill.skillName] || 1;
                    const isGap = currentLevel < skill.targetLevel;

                    return (
                      <div
                        key={skill.id}
                        className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                      >
                        <div className="max-w-xl">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge variant={isGap ? 'destructive' : 'success'} className="text-[10px]">
                              {skill.category}
                            </Badge>
                            <span className="text-xs text-slate-600 font-medium">
                              Benchmark: Level {skill.targetLevel}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900">{skill.skillName}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>

                        {/* Interactive FRAC Level Selector */}
                        <div className="flex flex-col items-start md:items-end gap-1.5">
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                            Proficiency: Level {currentLevel} of 5
                          </span>
                          <div className="flex gap-1.5" role="group" aria-label={`Proficiency level for ${skill.skillName}`}>
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleProficiencyChange(skill.skillName, lvl)}
                                aria-label={`Set ${skill.skillName} proficiency to Level ${lvl}`}
                                aria-pressed={currentLevel >= lvl}
                                className={`w-9 h-9 rounded-md text-xs font-bold transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-1 ${
                                  currentLevel >= lvl
                                    ? 'bg-primary-900 text-white shadow-xs hover:bg-primary-800'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                }`}
                                title={`Set ${skill.skillName} to Level ${lvl}`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Personalised Learning Pathway */}
            <Card>
              <CardHeader>
                <CardTitle>Personalised Learning Pathway</CardTitle>
                <CardDescription>
                  Targeted iGOT Karmayogi course interventions dynamically recommended based on your competency gaps.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((s) => {
                    const currentLevel = proficiency[s.skillName] || 1;
                    if (currentLevel < s.targetLevel) {
                      return (
                        <div
                          key={s.id}
                          className="border border-amber-200 bg-amber-50/40 rounded-xl p-5 flex flex-col justify-between shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <Badge variant="destructive">Gap Identified</Badge>
                              <span className="text-xs font-semibold text-slate-600">
                                Level {currentLevel} &rarr; Target {s.targetLevel}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 leading-snug">
                              Advanced Competency: {s.skillName}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1">
                              NSSTA / iGOT Karmayogi Official Curriculum
                            </p>
                          </div>
                          <a
                            href="https://igotkarmayogi.gov.in/"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-lg text-center transition-all shadow-xs flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                          >
                            Enroll in Karmayogi Course
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {skills.every((s) => (proficiency[s.skillName] || 1) >= s.targetLevel) && (
                    <div className="col-span-full p-8 text-center border border-emerald-200 bg-emerald-50/60 rounded-xl">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                      <h4 className="font-bold text-base text-emerald-900">All Benchmarks Satisfied</h4>
                      <p className="text-xs text-emerald-700 mt-1">
                        All competencies meet or exceed the departmental cadre target level.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MOSPI ANALYTICS DASHBOARD                                         */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-primary-100 text-primary-900 rounded-md">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <Badge variant="default">Real-time Telemetry</Badge>
              </div>
              <CardTitle>MoSPI Division Competency Analytics</CardTitle>
              <CardDescription>
                Live monitoring of statistical readiness, assessment logs, and departmental gap heatmaps.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Assessments Logged
                    </span>
                    <span className="p-2 bg-primary-50 text-primary-900 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{assessmentsTaken}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Captured via xAPI / CMI-5 Telemetry
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Avg. FRAC Proficiency
                    </span>
                    <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {analyticsData.avgLevel} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Across 4 MoSPI Competency Domains</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Primary Training Need
                    </span>
                    <span className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-lg font-bold text-amber-900 truncate tracking-tight">
                    {analyticsData.topGapSkill}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">Prioritized for NSSTA Training Calendar</p>
                </div>
              </div>

              {/* Dynamic Competency Heatmap */}
              <div className="space-y-5 border-t border-slate-100 pt-6">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Competency Fulfillment Progress
                </h4>

                <div className="space-y-4">
                  {skills.map((s) => {
                    const currentLvl = proficiency[s.skillName] || 1;
                    const percent = Math.min(100, (currentLvl / s.targetLevel) * 100);
                    const isCritical = currentLvl < s.targetLevel;

                    return (
                      <div key={s.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{s.skillName}</span>
                          <span className={isCritical ? 'text-amber-700' : 'text-emerald-700'}>
                            Level {currentLvl} / Target {s.targetLevel} ({Math.round(percent)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isCritical ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Pillar 3: iGOT Karmayogi LRS Telemetry Inspector Drawer */}
      <XApiTelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
        statement={latestTelemetryStatement}
      />
    </div>
  );
}

const QuizQuestion = React.memo(function QuizQuestion({
  q,
  index,
  handleProficiencyChange,
  skillToUpdate,
  onTelemetryStatement,
}: {
  q: QuizQuestionItem;
  index: number;
  handleProficiencyChange: (skillName: string, level: number) => void;
  skillToUpdate: string;
  onTelemetryStatement?: (statement: XApiStatementPayload) => void;
}) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [recommendation, setRecommendation] = React.useState<RecommendationItem | null>(null);
  const [loadingRec, setLoadingRec] = React.useState(false);

  const isCorrect = selectedOption === q.correctAnswer;

  const handleSelect = async (opt: string) => {
    setSelectedOption(opt);

    // Dispatch live xAPI statement to iGOT Karmayogi LRS with network error handling
    fetch('http://localhost:5000/api/telemetry/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'JSO_1042',
        userName: 'MoSPI Field Officer',
        quizId: q.id || `eval-${index + 1}`,
        quizName: q.topic || 'MoSPI Official Assessment',
        score: opt === q.correctAnswer ? 100 : 0,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.statement && onTelemetryStatement) {
          onTelemetryStatement(data.statement);
        }
      })
      .catch((err) => console.warn('Telemetry offline or sync warning:', err));

    if (opt !== q.correctAnswer) {
      handleProficiencyChange(skillToUpdate, 2);

      setLoadingRec(true);
      try {
        const res = await fetch('http://localhost:5000/api/recommend/course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gapTopic: 'General', gapDescription: q.question }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.recommendation) {
            setRecommendation(data.recommendation);
          }
        }
      } catch (err) {
        console.warn('Course recommendation fetch warning:', err);
      } finally {
        setLoadingRec(false);
      }
    } else {
      handleProficiencyChange(skillToUpdate, 4);
    }
  };

  const safeOptions = Array.isArray(q.options) ? q.options : [];

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary-900 text-white flex items-center justify-center text-xs font-bold mt-0.5">
          {index + 1}
        </span>
        <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.question}</p>
      </div>

      <div className="p-6 space-y-5">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          aria-label={`Options for Question ${index + 1}`}
        >
          {safeOptions.map((opt: string, i: number) => {
            let btnStyle =
              'text-left px-4 py-3.5 border rounded-lg text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-1 ';

            if (!selectedOption) {
              btnStyle += 'border-slate-200 hover:border-primary-400 hover:bg-slate-50 text-slate-800';
            } else {
              if (opt === q.correctAnswer) {
                btnStyle += 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
              } else if (opt === selectedOption) {
                btnStyle += 'bg-red-50 border-red-400 text-red-950 font-bold shadow-xs';
              } else {
                btnStyle += 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-500 border-slate-200';
              }
            }

            return (
              <button
                key={i}
                type="button"
                aria-pressed={selectedOption === opt}
                disabled={!!selectedOption}
                onClick={() => handleSelect(opt)}
                className={btnStyle}
              >
                <span
                  className={`inline-block w-5 font-bold mr-1.5 ${
                    selectedOption && opt === q.correctAnswer ? 'text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Source Citation and Feedback */}
        {selectedOption && (
          <div className="animate-fade-in space-y-3 pt-2">
            <div className="bg-primary-50/60 border border-primary-100 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-primary-950">
              <BookOpen className="w-4 h-4 text-primary-900 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-bold text-primary-900 block mb-0.5">Source Context:</span>
                <p className="italic text-slate-700">{q.sourceCitation || 'Official MoSPI Reference'}</p>
                {q.explanation && (
                  <p className="mt-1 text-slate-800">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            </div>

            {!isCorrect && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4" role="alert">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="w-full">
                    <h5 className="text-xs font-bold text-amber-900">Competency Gap Identified</h5>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Response indicates a need for reinforcement in this competency.
                    </p>

                    {loadingRec ? (
                      <p className="text-xs text-amber-800 animate-pulse mt-2">
                        Querying 880+ Government Catalog for optimal course...
                      </p>
                    ) : recommendation ? (
                      <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3 shadow-xs">
                        <div>
                          <h6 className="text-xs font-bold text-slate-900">{recommendation.title}</h6>
                          <p className="text-[11px] text-slate-600">
                            {recommendation.provider} • {recommendation.duration}
                          </p>
                        </div>
                        <a
                          href={recommendation.link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-md transition shadow-xs flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                        >
                          Enroll in iGOT
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {isCorrect && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2.5 text-xs text-emerald-950" role="status">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" aria-hidden="true" />
                <p className="font-semibold">
                  Correct! Your FRAC competency level in this domain has been updated.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});
