import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { assessDeviceCapability, DeviceCapability } from '../utils/detectPerformance';
import { Navbar, PortalTab } from '../components/layout/Navbar';
import { AdminCommandCenter } from '../components/admin/AdminCommandCenter';
import { PersonalisedPathway } from '../components/recommendation/PersonalisedPathway';
import { AssessmentAnalysisReport, QuestionAnswerRecord } from '../components/assessment/AssessmentAnalysisReport';
import { OfficerDashboard, RecentExamRecord, CapacityCohort } from '../components/dashboard/OfficerDashboard';
import { AcbpDossierModal } from '../components/admin/AcbpDossierModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { XApiTelemetryDrawer, XApiStatementPayload } from '../components/ui/XApiTelemetryDrawer';
import { useAntiSpam, useDebounce } from '../hooks/useAntiSpam';
import { IndianFlag } from '../components/ui/IndianFlag';
import { KarmayogiSahayakModal } from '../components/ui/KarmayogiSahayakModal';
import { AccessibilityModal, AccessibilitySettings, DEFAULT_ACCESSIBILITY_SETTINGS } from '../components/ui/AccessibilityModal';
import { SecretAdminGatewayModal } from '../components/admin/SecretAdminGatewayModal';
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
  ShieldAlert,
  Bot,
  Eye,
  Lock,
  ArrowLeft,
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
  distractorAnalysis?: Record<string, {
    misconception: string;
    remedialSkill: string;
    recommendedCourseTitle: string;
    recommendedCourseId: string;
  }>;
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
  level?: number;
  domain?: string;
  rationale?: string;
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

/**
 * Authentic MoSPI & iGOT Karmayogi Fallback Catalog for Offline & Instant Zero-Latency Discovery
 */
export const FALLBACK_COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: 'Sampling Techniques in Official Statistics',
    domain: 'Statistical Competencies',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    durationHours: 4,
    duration: '4 Hours',
    level: 3,
    description: 'Master multistage stratified sampling, primary sampling units, and survey weighting for NSS surveys.',
  },
  {
    id: 'c2',
    title: 'Python for Microdata Processing',
    domain: 'Technical Competencies',
    provider: 'Data Informatics and Innovation Division (DIID)',
    durationHours: 6,
    duration: '6 Hours',
    level: 4,
    description: 'Advanced Python pipelines for large-scale microdata cleaning, anonymisation, and tabulation.',
  },
  {
    id: 'c3',
    title: 'DPDPA 2023 Compliance for Statistical Officers',
    domain: 'Digital Governance',
    provider: 'Ministry of Electronics and Information Technology (MeitY)',
    durationHours: 2,
    duration: '2 Hours',
    level: 2,
    description: 'Statutory compliance with Digital Personal Data Protection Act 2023 for government data fiduciaries.',
  },
  {
    id: 'c4',
    title: 'National Accounts: Supply-Use Tables (SUT) & GDP Deflators',
    domain: 'Statistical Competencies',
    provider: 'National Accounts Division (NAD-CSO)',
    durationHours: 6,
    duration: '6h 20m',
    level: 4,
    description: 'Compilation of macroeconomic aggregates, gross value added (GVA), and double deflation methodology.',
  },
  {
    id: 'c5',
    title: 'CAPI Digital Field Data Collection & Paradata Validation',
    domain: 'Technical Competencies',
    provider: 'Field Operations Division (FOD-NSSO)',
    durationHours: 4,
    duration: '3h 45m',
    level: 2,
    description: 'Computer Assisted Personal Interviewing workflow, real-time sync, and field paradata validation.',
  },
  {
    id: 'c6',
    title: 'Consumer Price Index (CPI) Geometric Mean & Web Scraping',
    domain: 'Statistical Competencies',
    provider: 'Social Statistics Division (SSD-MoSPI)',
    durationHours: 3,
    duration: '3h 10m',
    level: 3,
    description: 'Laspeyres price aggregation, geometric mean price relatives, and high-frequency digital price collection.',
  },
  {
    id: 'c7',
    title: 'Handling of Unit Level Data of NSS and its Analysis using R',
    domain: 'Technical Competencies',
    provider: 'National Statistical Systems Training Academy (NSSTA)',
    durationHours: 8,
    duration: '8h 30m',
    level: 4,
    description: 'Working with raw NSS unit-level files, multiplier weights, survey designs, and variance estimation in R.',
  },
  {
    id: 'c8',
    title: 'Civil Services Values & Ethics in Official Statistics',
    domain: 'Behavioural and Managerial Competencies',
    provider: 'Capacity Building Commission (CBC)',
    durationHours: 2,
    duration: '2h 00m',
    level: 2,
    description: 'Ethical stewardship, impartiality in official statistical releases, and public trust in national data.',
  },
  {
    id: 'c9',
    title: 'Digital Data Governance & Microdata Anonymisation Protocols',
    domain: 'Digital Governance',
    provider: 'Data Informatics & Innovation Division (DIID-MoSPI)',
    durationHours: 5,
    duration: '5h 00m',
    level: 4,
    description: 'k-anonymity, l-diversity, microdata masking, and secure dissemination protocols under DPDP Act 2023.',
  },
];

interface DashboardProps {
  onOpenLogin?: () => void;
  activeTab?: PortalTab;
  onTabChange?: (tab: PortalTab) => void;
  initialCourseTopic?: string | null;
}

export default function Dashboard({
  onOpenLogin,
  activeTab: propActiveTab,
  onTabChange,
  initialCourseTopic,
}: DashboardProps = {}) {
  // Check if an officer is authenticated via Jan Parichay SSO
  const savedOfficerInfo = useMemo(() => {
    try {
      const saved = window.localStorage.getItem('statskill_demo_login');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  }, []);

  const [internalTab, setInternalTab] = useState<PortalTab>('dashboard');
  const activeTab = propActiveTab || internalTab;

  // Modals & Navigation History State
  const [isSahayakOpen, setIsSahayakOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<PortalTab[]>([]);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = window.localStorage.getItem('statskill_accessibility');
      if (saved) return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const updateAccessibilitySettings = useCallback((newPartial: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        window.localStorage.setItem('statskill_accessibility', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetAccessibilitySettings = useCallback(() => {
    setAccessibilitySettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    try {
      window.localStorage.setItem('statskill_accessibility', JSON.stringify(DEFAULT_ACCESSIBILITY_SETTINGS));
    } catch {}
  }, []);

  const handleTabChange = useCallback((tab: PortalTab) => {
    if (tab !== activeTab) {
      setNavigationHistory((prev) => [...prev, activeTab]);
    }
    if (onTabChange) {
      onTabChange(tab);
    }
    setInternalTab(tab);
  }, [activeTab, onTabChange]);

  const handleGoBack = useCallback(() => {
    setNavigationHistory((prev) => {
      if (prev.length === 0) return prev;
      const nextHistory = [...prev];
      const previousTab = nextHistory.pop()!;
      if (onTabChange) {
        onTabChange(previousTab);
      }
      setInternalTab(previousTab);
      return nextHistory;
    });
  }, [onTabChange]);

  const previousTabTitle = useMemo(() => {
    if (navigationHistory.length === 0) return '';
    const lastTab = navigationHistory[navigationHistory.length - 1];
    const map: Record<PortalTab, string> = {
      home: 'Public Gateway',
      overview: 'Officer Dashboard',
      dashboard: 'Assessment Engine',
      discover: 'Course Discovery',
      competency: 'FRAC Competencies',
      analytics: 'MoSPI Analytics',
      admin: 'HQ Command Center',
    };
    return map[lastTab] || 'Previous Menu';
  }, [navigationHistory]);

  const [designation, setDesignation] = useState(() => {
    try {
      const saved = window.localStorage.getItem('statskill_demo_login');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.officer?.designation && MOSPI_CADRES_DATA[parsed.officer.designation]) {
          return parsed.officer.designation;
        }
      }
    } catch {}
    return 'Junior Statistical Officer (JSO)';
  });
  const [proficiency, setProficiency] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestionItem[]>([]);
  const [paperSet, setPaperSet] = useState<string>('Set A');
  const [reshufflesLeft, setReshufflesLeft] = useState<number>(3);
  const [deviceMode, setDeviceMode] = useState<DeviceCapability | 'LOADING'>('POTATO_DEVICE');
  const [selectedCourseContext, setSelectedCourseContext] = useState<string | null>(null);

  // Assessment Timer & Anti-Cheat State (2 min 30 sec = 150s)
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [userExamAnswers, setUserExamAnswers] = useState<Record<number, QuestionAnswerRecord>>({});
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [examTimeTaken, setExamTimeTaken] = useState<number>(0);
  const examTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Navigation and Discovery States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!window.localStorage.getItem('statskill_demo_login');
    } catch {
      return false;
    }
  });
  const [courses, setCourses] = useState<CourseItem[]>(FALLBACK_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [assessmentsTaken, setAssessmentsTaken] = useState(0);
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [isAcbpModalOpen, setIsAcbpModalOpen] = useState(false);
  const [latestTelemetryStatement, setLatestTelemetryStatement] = useState<XApiStatementPayload | null>(null);

  const [assessmentHistory, setAssessmentHistory] = useState<RecentExamRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem('statskill_assessment_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });
  const [capacityCohorts, setCapacityCohorts] = useState<CapacityCohort[]>(() => {
    try {
      const saved = window.localStorage.getItem('statskill_capacity_cohorts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  // Anti-Spam Click Shield and Search Debouncing
  const {
    isLocked: isAntiSpamLocked,
    lockoutRemaining: antiSpamRemaining,
    spamMessage: antiSpamMessage,
    guardAction: antiSpamGuardAction,
    triggerLockout: triggerAntiSpamLockout,
  } = useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  // Clean up any running polling and exam timer intervals on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
    };
  }, []);

  // Global Keyboard Shortcuts (Alt+1..5, Alt+A, Alt+H, Ctrl+Shift+A, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for secret admin combo (Ctrl+Shift+A or Cmd+Shift+A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretAdminOpen((prev) => !prev);
        return;
      }

      // Check for Alt shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          handleTabChange('overview');
        } else if (e.key === '2') {
          e.preventDefault();
          handleTabChange('dashboard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleTabChange('discover');
        } else if (e.key === '4') {
          e.preventDefault();
          handleTabChange('competency');
        } else if (e.key === '5') {
          e.preventDefault();
          handleTabChange('analytics');
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setIsAccessibilityOpen((prev) => !prev);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setIsSahayakOpen((prev) => !prev);
        }
      }

      if (e.key === 'Escape') {
        setIsSahayakOpen(false);
        setIsAccessibilityOpen(false);
        setIsSecretAdminOpen(false);
        setIsTelemetryDrawerOpen(false);
        setIsAcbpModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTabChange]);

  // Manage assessment countdown timer (150s = 2m 30s)
  useEffect(() => {
    if (generatedQuiz.length > 0) {
      setTimeLeft(150);
      setIsTimedOut(false);

      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
      }

      examTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (examTimerRef.current) {
              clearInterval(examTimerRef.current);
              examTimerRef.current = null;
            }
            setIsTimedOut(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
      setTimeLeft(150);
      setIsTimedOut(false);
    }

    return () => {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
    };
  }, [generatedQuiz.length, paperSet]);

  // Hardware capability auto-detection
  useEffect(() => {
    assessDeviceCapability().then(setDeviceMode);
  }, []);

  // Resilient local filtering for offline mode or initial catalog discovery
  const filterLocalCourses = useCallback((query: string, domain: string) => {
    let filtered = [...FALLBACK_COURSES];
    if (domain && domain !== 'All') {
      filtered = filtered.filter((c) => c.domain === domain);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.domain && c.domain.toLowerCase().includes(q)) ||
          (c.provider && c.provider.toLowerCase().includes(q))
      );
    }
    return filtered.slice(0, 9);
  }, []);

  // Fetch real government courses catalog with AbortController for network resilience
  useEffect(() => {
    const controller = new AbortController();
    const domainQuery = selectedDomain !== 'All' ? `&domain=${encodeURIComponent(selectedDomain)}` : '';
    setCourseError(null);

    fetch(`http://localhost:5000/api/courses/search?q=${encodeURIComponent(debouncedSearchQuery)}${domainQuery}`, {
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
          setCourses(filterLocalCourses(debouncedSearchQuery, selectedDomain));
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Course fetch error:', err);
          setCourseError('Displaying verified local official catalog (Autonomous Cadre Mode).');
          setCourses(filterLocalCourses(debouncedSearchQuery, selectedDomain));
        }
      });

    return () => controller.abort();
  }, [debouncedSearchQuery, selectedDomain, filterLocalCourses]);

  const selectCourseForQuiz = useCallback((courseTitle: string) => {
    setSelectedCourseContext(courseTitle);
    setGeneratedQuiz([]);
    handleTabChange('dashboard');
    setTimeout(() => {
      const el = document.getElementById('quiz-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [handleTabChange]);

  const handleProficiencyChange = useCallback((skillName: string, level: number) => {
    setProficiency((prev) => ({ ...prev, [skillName]: level }));
    setAssessmentsTaken((prev) => prev + 1);
  }, []);

  const handleQuestionAnswered = useCallback(
    (qIndex: number, record: QuestionAnswerRecord) => {
      setUserExamAnswers((prev) => {
        const updated = { ...prev, [qIndex]: record };
        const answeredCount = Object.keys(updated).length;

        if (generatedQuiz.length > 0 && answeredCount >= generatedQuiz.length) {
          // Stop countdown timer immediately upon answering all questions
          if (examTimerRef.current) {
            clearInterval(examTimerRef.current);
            examTimerRef.current = null;
          }
          const timeSpent = Math.max(1, 150 - timeLeft);
          setExamTimeTaken(timeSpent);
          setIsExamCompleted(true);

          // Dispatch diagnostic assessment results to recommendation engine
          const answersList = Object.values(updated);
          fetch('http://localhost:5000/api/recommend/analyze-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              officerId: savedOfficerInfo?.officer?.parichayId || 'JSO_1042',
              cadre: designation,
              answers: answersList,
              proficiencies: proficiency,
            }),
          })
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
            .then((data) => {
              if (data.success && data.analysis) {
                const analysis = data.analysis;
                if (analysis.updatedProficiency) {
                  setProficiency((currentProf) => ({
                    ...currentProf,
                    ...analysis.updatedProficiency,
                  }));
                }

                const newExamRecord: RecentExamRecord = {
                  id: `exam-${Date.now()}`,
                  title:
                    selectedCourseContext ||
                    (generatedQuiz[0]?.topic ? `${generatedQuiz[0].topic} Assessment` : 'MoSPI FRAC Diagnostic Assessment'),
                  category:
                    skills.find((s) => s.skillName === generatedQuiz[0]?.topic)?.category ||
                    'Statistical Competencies',
                  date: new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }),
                  durationMinutes: Math.max(1, Math.ceil(timeSpent / 60)),
                  score: analysis.scorePercentage,
                  totalScore: 100,
                  status: analysis.status,
                  misconceptions: (analysis.misconceptionsFound || []).map((m: any) => ({
                    question: m.question,
                    chosenAnswer: m.chosenAnswer,
                    correctAnswer: m.correctAnswer,
                    misconception: m.misconception,
                    remedialCourse: m.remedialCourse,
                    remedialCourseId: m.remedialCourseId,
                  })),
                };

                setAssessmentHistory((prevHistory) => {
                  const updatedHistory = [newExamRecord, ...prevHistory];
                  try {
                    window.localStorage.setItem(
                      'statskill_assessment_history',
                      JSON.stringify(updatedHistory)
                    );
                  } catch {}
                  return updatedHistory;
                });

                if (Array.isArray(analysis.recommendedCohorts) && analysis.recommendedCohorts.length > 0) {
                  setCapacityCohorts(analysis.recommendedCohorts);
                  try {
                    window.localStorage.setItem(
                      'statskill_capacity_cohorts',
                      JSON.stringify(analysis.recommendedCohorts)
                    );
                  } catch {}
                }
              }
            })
            .catch((err) => {
              console.warn('Assessment analysis background computation notice:', err);
            });
        }

        return updated;
      });
    },
    [generatedQuiz, timeLeft, savedOfficerInfo, designation, proficiency, selectedCourseContext, skills]
  );

  const handleReshuffle = useCallback(() => {
    if (reshufflesLeft <= 0 || generatedQuiz.length === 0 || isExamCompleted) return;

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
    setUserExamAnswers({});
    setIsExamCompleted(false);
    setExamTimeTaken(0);
  }, [reshufflesLeft, generatedQuiz, paperSet, isExamCompleted]);

  const handleGenerateQuiz = async (file?: File) => {
    // Clear any active poll before starting new generation
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    setIsUploading(true);
    setAssessmentError(null);
    setGeneratedQuiz([]);
    setUserExamAnswers({});
    setIsExamCompleted(false);
    setExamTimeTaken(0);

    const formData = new FormData();
    if (file) {
      formData.append('document', file);
    }
    if (selectedCourseContext) {
      formData.append('courseId', selectedCourseContext);
    }
    formData.append('numQuestions', '5');
    formData.append('difficulty', 'intermediate');

    try {
      const response = await fetch(`http://localhost:5000/api/quiz/generate-async?mode=${deviceMode}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          triggerAntiSpamLockout(errData.retryAfter || 10);
        }
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

  useEffect(() => {
    if (initialCourseTopic) {
      setSelectedCourseContext(initialCourseTopic);
      handleGenerateQuiz();
    }
  }, [initialCourseTopic]);

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
    <div
      className={`min-h-screen bg-[#F5F6F8] font-body text-slate-900 antialiased selection:bg-[#0B2E63] selection:text-white transition-colors duration-200 ${
        accessibilitySettings.highContrast ? 'contrast-125 saturate-150' : ''
      } ${
        accessibilitySettings.textScale === 'large'
          ? 'text-[105%]'
          : accessibilitySettings.textScale === 'xlarge'
          ? 'text-[115%]'
          : ''
      } ${
        accessibilitySettings.reducedMotion
          ? '[&_*]:transition-none [&_*]:animate-none'
          : ''
      } ${
        accessibilitySettings.dyslexicSpacing
          ? 'tracking-wide leading-relaxed'
          : ''
      }`}
    >
      {/* Official Government Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={(logged) => {
          if (!logged) {
            try {
              window.localStorage.removeItem('statskill_demo_login');
            } catch {}
          }
          setIsLoggedIn(logged);
        }}
        onOpenLogin={onOpenLogin}
        officerName={savedOfficerInfo?.officer?.name}
        officerCadreId={savedOfficerInfo?.officer?.parichayId}
        isAdminUnlocked={isAdminUnlocked}
        onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenSahayak={() => setIsSahayakOpen(true)}
        canGoBack={navigationHistory.length > 0}
        previousTabTitle={previousTabTitle}
        onGoBack={handleGoBack}
      />

      <main className="max-w-7xl mx-auto py-8 px-4 md:px-10 space-y-8">
        {/* Anti-Spam Click Shield Active Banner */}
        {isAntiSpamLocked && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-4 bg-amber-50 border-2 border-amber-500/80 rounded-xl text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xs"
          >
            <div className="flex items-start sm:items-center gap-3">
              <span className="p-2 bg-amber-500 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-slate-950" />
                SHIELD ACTIVE
              </span>
              <div>
                <p className="font-bold text-sm text-amber-950">Spam Click Protection Active</p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Rapid clicks were detected. Module actions are temporarily locked for {antiSpamRemaining} seconds to protect server stability.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm font-black bg-white px-3.5 py-1.5 rounded-lg border border-amber-300 text-amber-950 shadow-xs self-end sm:self-center">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>00:{antiSpamRemaining.toString().padStart(2, '0')}</span>
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {/* TAB 0: OFFICER OVERVIEW (LEARNER DASHBOARD & SPIDER RADAR)                */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <OfficerDashboard
            currentCadre={designation}
            onCadreChange={setDesignation}
            cadresList={Object.keys(MOSPI_CADRES_DATA)}
            divisionName={MOSPI_CADRES_DATA[designation]?.division || 'Field Operations Division (FOD), NSSO'}
            divisionDescription={MOSPI_CADRES_DATA[designation]?.description || ''}
            skills={skills}
            proficiency={proficiency}
            onNavigateTab={handleTabChange}
            onOpenTelemetry={() => setIsTelemetryDrawerOpen(true)}
            onOpenAcbpModal={() => setIsAcbpModalOpen(true)}
            officerName={savedOfficerInfo?.officer?.name}
            officerCadreId={savedOfficerInfo?.officer?.parichayId}
            assessmentHistory={assessmentHistory}
            capacityCohorts={capacityCohorts}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 1: ASSESSMENT ENGINE (SOVEREIGN EDGE-AI & QUESTION GENERATION)       */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Card id="quiz-section">
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-[#0B2E63]/10 text-[#0B2E63] rounded-md">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <Badge variant="default">Official Examination Module</Badge>
                    {selectedCourseContext && (
                      <Badge variant="saffron">{selectedCourseContext}</Badge>
                    )}
                  </div>
                  <CardTitle>Sovereign Edge-AI Assessment Generator</CardTitle>
                  <CardDescription>
                    Generate structured active-recall assessments mapped to MoSPI FRAC competency benchmarks.
                  </CardDescription>
                </div>

                {/* Device Mode Toggle & Telemetry Inspector Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTelemetryDrawerOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs border flex items-center gap-1.5 bg-slate-900 text-emerald-300 border-emerald-500/40 hover:bg-slate-800 cursor-pointer active:translate-y-[1px]"
                    title="Inspect live ADL xAPI learning record sent to iGOT LRS"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-mono text-[11px]">iGOT LRS Telemetry</span>
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeviceMode((prev) =>
                        prev === 'MODERN_DEVICE' ? 'POTATO_DEVICE' : 'MODERN_DEVICE'
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs border flex items-center gap-2 cursor-pointer active:translate-y-[1px] ${
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

              <CardContent className="p-6 sm:p-8">
                {/* Upload & Direct Practice Container */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isUploading
                      ? 'border-[#0B2E63] bg-blue-50/40'
                      : 'border-slate-300 hover:border-[#0B2E63]/60 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-4 text-[#0B2E63]">
                    {isUploading ? (
                      <RotateCw className="w-6 h-6 animate-spin text-[#0B2E63]" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-[#0B2E63]" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 font-display">
                    {isUploading
                      ? 'Synthesizing Examination Paper...'
                      : 'Upload MoSPI Manual or Training PDF'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed font-body">
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
                      disabled={isUploading || isAntiSpamLocked}
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        antiSpamGuardAction(() => handleGenerateQuiz(e.target.files![0]))();
                      }}
                    />
                    <label
                      htmlFor="pdf-upload"
                      tabIndex={isUploading || isAntiSpamLocked ? -1 : 0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isAntiSpamLocked) {
                            document.getElementById('pdf-upload')?.click();
                          }
                        }
                      }}
                      className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-xs inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63] focus-visible:ring-offset-2 active:translate-y-[1px] ${
                        isUploading || isAntiSpamLocked
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-[#0B2E63] text-white hover:bg-[#123E82] cursor-pointer'
                      }`}
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      {isUploading ? 'Processing File...' : 'Browse Local PDF'}
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading || isAntiSpamLocked}
                      onClick={antiSpamGuardAction(() => handleGenerateQuiz())}
                      className="text-xs font-semibold border-slate-300 text-slate-800 hover:bg-white"
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
                  <div className="mt-10 animate-fade-in border-t border-slate-200 pt-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#155C33] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900 font-display">Official Assessment Paper</h3>
                            <Badge variant="neutral">5 MCQs</Badge>
                          </div>
                          <p className="text-xs text-slate-600 font-body">
                            Candidate Evaluation • MoSPI FRAC Standards • 2m 30s Time Limit
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Live Examination Countdown Timer Badge */}
                        {isExamCompleted ? (
                          <div
                            className="px-3.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 shadow-xs bg-emerald-50 border-emerald-300 text-emerald-950 font-black animate-fade-in"
                            aria-label={`Assessment completed in ${Math.floor(examTimeTaken / 60)} minutes and ${examTimeTaken % 60} seconds`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>
                              Completed in {Math.floor(examTimeTaken / 60)}m {examTimeTaken % 60}s
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 shadow-xs transition-colors ${
                              timeLeft <= 30
                                ? 'bg-red-100 border-red-300 text-red-950 animate-pulse font-black'
                                : timeLeft <= 60
                                ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                                : 'bg-slate-100 border-slate-300 text-slate-800'
                            }`}
                            aria-label={`Time remaining: ${Math.floor(timeLeft / 60)} minutes and ${timeLeft % 60} seconds`}
                          >
                            <Clock className={`w-4 h-4 ${timeLeft <= 30 ? 'text-red-600' : timeLeft <= 60 ? 'text-amber-600' : 'text-slate-600'}`} />
                            <span className="font-mono text-sm">
                              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                            {timeLeft <= 30 && (
                              <span className="text-[10px] uppercase font-bold text-red-700 bg-red-200 px-1 rounded">
                                Final Seconds
                              </span>
                            )}
                          </div>
                        )}

                        {/* Plain Words Badge */}
                        <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-md shadow-xs uppercase tracking-wider">
                          Paper: {paperSet}
                        </span>

                        {/* Reshuffle Button: max 3 attempts */}
                        <button
                          type="button"
                          onClick={antiSpamGuardAction(handleReshuffle)}
                          disabled={reshufflesLeft <= 0 || isTimedOut || isExamCompleted || isAntiSpamLocked}
                          aria-label={`Reshuffle question and option sequence (${reshufflesLeft} attempts remaining)`}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 ${
                            reshufflesLeft > 0 && !isTimedOut && !isExamCompleted && !isAntiSpamLocked
                              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 cursor-pointer shadow-xs active:scale-95'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          title={
                            isAntiSpamLocked
                              ? `Locked for ${antiSpamRemaining}s (Anti-Spam Shield)`
                              : isExamCompleted
                              ? 'Assessment finalized'
                              : reshufflesLeft > 0
                              ? 'Shuffle sequence & options'
                              : 'Maximum 3 reshuffles allowed per session'
                          }
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                          Reshuffle ({reshufflesLeft} left)
                        </button>
                      </div>
                    </div>

                    {/* Countdown Progress Line */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 transition-all duration-1000 ${
                          isExamCompleted
                            ? 'bg-emerald-600'
                            : timeLeft <= 30
                            ? 'bg-red-600'
                            : timeLeft <= 60
                            ? 'bg-amber-500'
                            : 'bg-primary-900'
                        }`}
                        style={{ width: `${isExamCompleted ? 100 : (timeLeft / 150) * 100}%` }}
                      />
                    </div>

                    {/* Timed Out Notice */}
                    {isTimedOut && !isExamCompleted && (
                      <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-3 animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm">Assessment Time Limit Expired (2m 30s)</p>
                          <p className="text-red-700 mt-0.5">
                            The allocated 2 minutes and 30 seconds for this assessment session have elapsed. Answered questions have been registered in your competency profile.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Post-Assessment Performance Analysis & Scorecard */}
                    {isExamCompleted && (
                      <AssessmentAnalysisReport
                        answers={Object.values(userExamAnswers)}
                        totalQuestions={generatedQuiz.length}
                        timeTakenSeconds={examTimeTaken}
                        paperSet={paperSet}
                        cadre={designation}
                        division={MOSPI_CADRES_DATA[designation]?.division || 'Field Operations Division (FOD), NSSO'}
                        onNavigateToPathway={() => {
                          handleTabChange('competency');
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                        }}
                        onRetakeQuiz={() => {
                          handleGenerateQuiz();
                        }}
                        onOpenTelemetry={() => setIsTelemetryDrawerOpen(true)}
                      />
                    )}

                    <div className="space-y-6">
                      {generatedQuiz.map((q, index) => (
                        <QuizQuestion
                          key={`${paperSet}-${index}-${q.question ? q.question.slice(0, 15) : index}`}
                          q={q}
                          index={index}
                          handleProficiencyChange={handleProficiencyChange}
                          skillToUpdate={skills.length > 0 ? skills[0].skillName : 'Survey Design & Sampling'}
                          onTelemetryStatement={setLatestTelemetryStatement}
                          onQuestionAnswered={(record) => handleQuestionAnswered(index, record)}
                          isTimedOut={isTimedOut}
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
                          disabled={isAntiSpamLocked}
                          onClick={antiSpamGuardAction(() => selectCourseForQuiz(course.title))}
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

            {/* Pillar 2: 4-Tier Zone of Proximal Development (ZPD) Personalised Learning Pathway */}
            <PersonalisedPathway
              designation={designation}
              proficiencies={proficiency}
              onSelectCourseForQuiz={selectCourseForQuiz}
            />
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

        {/* ========================================================================= */}
        {/* TAB 5: MOSPI CADRE COMMAND CENTER & ACBP DOSSIER (PILLAR 5)               */}
        {/* ========================================================================= */}
        {activeTab === 'admin' && (
          <AdminCommandCenter onBackToLearner={() => handleTabChange('dashboard')} />
        )}
      </main>

      {/* Floating AI Sahayak Quick Launch Button */}
      <aside aria-label="Karmayogi Sahayak Quick Launch" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsSahayakOpen(true)}
          aria-label="Open Karmayogi Sahayak AI Navigation Guide (Alt+H)"
          className="px-4 py-2.5 rounded-full bg-[#0B2E63] hover:bg-[#123E82] text-amber-300 font-bold text-xs shadow-lg border border-amber-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Karmayogi Sahayak AI Guide (Alt+H)"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <Bot className="w-4 h-4 text-amber-400" />
          <span>Ask AI Sahayak</span>
        </button>
      </aside>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 md:px-10 border-t border-slate-800 mt-16 font-body">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <IndianFlag variant="circular" width={32} height={32} />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                Ministry of Statistics and Programme Implementation (MoSPI)
              </p>
              <p className="text-[11px] text-slate-400">
                Mission Karmayogi • National Statistical Systems Training Academy (NSSTA) • DIID Sovereign Node
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Accessibility Options (Alt+A)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSahayakOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              AI Navigation Guide (Alt+H)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSecretAdminOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-slate-400 hover:text-amber-400"
              title="Restricted HQ Administrative Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>HQ Gateway (Ctrl+Shift+A)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Pillar 3: iGOT Karmayogi LRS Telemetry Inspector Drawer */}
      <XApiTelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
        statement={latestTelemetryStatement}
      />

      {/* MoSPI Annual Capacity Building Plan (ACBP) Dossier Modal */}
      <AcbpDossierModal
        isOpen={isAcbpModalOpen}
        onClose={() => setIsAcbpModalOpen(false)}
      />

      {/* Karmayogi Sahayak Interactive AI Guide Modal */}
      <KarmayogiSahayakModal
        isOpen={isSahayakOpen}
        onClose={() => setIsSahayakOpen(false)}
        onNavigateTab={handleTabChange}
        onOpenLogin={() => {
          if (onOpenLogin) onOpenLogin();
          else setIsLoggedIn(true);
        }}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
      />

      {/* WCAG 2.2 Accessibility Control Center Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onUpdateSettings={updateAccessibilitySettings}
        onResetSettings={resetAccessibilitySettings}
      />

      {/* Secret Admin HQ Passcode Gateway Modal */}
      <SecretAdminGatewayModal
        isOpen={isSecretAdminOpen}
        onClose={() => setIsSecretAdminOpen(false)}
        onUnlockAdmin={() => {
          setIsAdminUnlocked(true);
          handleTabChange('admin');
        }}
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
  onQuestionAnswered,
  isTimedOut,
}: {
  q: QuizQuestionItem;
  index: number;
  handleProficiencyChange: (skillName: string, level: number) => void;
  skillToUpdate: string;
  onTelemetryStatement?: (statement: XApiStatementPayload) => void;
  onQuestionAnswered?: (record: QuestionAnswerRecord) => void;
  isTimedOut?: boolean;
}) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [recommendation, setRecommendation] = React.useState<RecommendationItem | null>(null);
  const [loadingRec, setLoadingRec] = React.useState(false);

  const isCorrect = selectedOption === q.correctAnswer;

  const handleSelect = async (opt: string) => {
    if (isTimedOut) return;
    setSelectedOption(opt);

    // Notify parent dashboard of answer to track full paper completion and stop timer
    if (onQuestionAnswered) {
      onQuestionAnswered({
        questionNumber: index + 1,
        questionText: q.question,
        topic: q.topic || skillToUpdate,
        selectedOption: opt,
        correctAnswer: q.correctAnswer,
        isCorrect: opt === q.correctAnswer,
        explanation: q.explanation,
        sourceCitation: q.sourceCitation,
        distractorAnalysis: q.distractorAnalysis,
      });
    }

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
          body: JSON.stringify({
            gapTopic: q.topic || skillToUpdate,
            gapDescription: q.question,
            assessedLevel: 2,
          }),
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
    <Card
      className="overflow-hidden border-slate-200/90 select-none shadow-xs"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200/80 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#0B2E63] text-white flex items-center justify-center text-xs font-bold mt-0.5 font-mono">
            {index + 1}
          </span>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed select-none font-body">{q.question}</p>
        </div>
        {isTimedOut && !selectedOption && (
          <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 shrink-0 font-mono">
            Window Expired
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          aria-label={`Options for Question ${index + 1}`}
        >
          {safeOptions.map((opt: string, i: number) => {
            let btnStyle =
              'text-left px-4 py-3.5 border rounded-lg text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63] focus-visible:ring-offset-1 select-none active:translate-y-[1px] ';

            if (!selectedOption) {
              if (isTimedOut) {
                btnStyle += 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200';
              } else {
                btnStyle += 'border-slate-200/90 hover:border-[#0B2E63]/60 hover:bg-slate-50 text-slate-800';
              }
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
                disabled={!!selectedOption || isTimedOut}
                onClick={() => handleSelect(opt)}
                className={btnStyle}
              >
                <span
                  className={`inline-block w-5 font-bold mr-1.5 font-mono ${
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
            <div className="bg-[#0B2E63]/5 border border-[#0B2E63]/15 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-slate-900">
              <BookOpen className="w-4 h-4 text-[#0B2E63] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-bold text-[#0B2E63] block mb-0.5 font-display">Source Context:</span>
                <p className="text-slate-700 font-body">{q.sourceCitation || 'Official MoSPI Reference'}</p>
                {q.explanation && (
                  <p className="mt-1 text-slate-800 font-body">
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
                    <h5 className="text-xs font-bold text-amber-900 font-display">Competency Gap Identified</h5>
                    <p className="text-xs text-amber-900 mt-0.5 font-body">
                      Response indicates a need for reinforcement in this competency.
                    </p>

                    {loadingRec ? (
                      <p className="text-xs text-amber-800 animate-pulse mt-2 font-mono">
                        Querying 880+ Government Catalog for optimal course...
                      </p>
                    ) : recommendation ? (
                      <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3.5 space-y-2 shadow-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant="saffron" className="text-[10px]">
                                {recommendation.domain || 'MoSPI / iGOT'}
                              </Badge>
                              <span className="text-[10px] font-bold text-slate-500 font-mono">
                                Level {recommendation.level || 2}
                              </span>
                            </div>
                            <h6 className="text-xs font-bold text-slate-900 font-display">{recommendation.title}</h6>
                            <p className="text-[11px] text-slate-600 font-body">
                              {recommendation.provider} • {recommendation.duration || '3 Hours'}
                            </p>
                          </div>
                          <a
                            href={recommendation.link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#D96B07] hover:bg-[#B85704] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 shrink-0 active:translate-y-[1px]"
                          >
                            Enroll in iGOT
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        </div>
                        {recommendation.rationale && (
                          <p className="text-[11px] text-slate-600 bg-amber-50/70 rounded p-2 border border-amber-100 leading-relaxed font-body">
                            {recommendation.rationale}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {isCorrect && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2.5 text-xs text-emerald-950" role="status">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" aria-hidden="true" />
                <p className="font-semibold font-body">
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
