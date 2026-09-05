import fs from 'fs';
import path from 'path';

export interface CatalogCourse {
  id: string;
  title: string;
  description?: string;
  provider: string;
  modality?: string;
  duration?: string;
  durationHours?: number;
  domain?: string;
  level?: number;
  appIcon?: string;
  posterImage?: string;
  link: string;
  competencyMapped?: string;
  tags?: string[];
  keywordsIndic?: string[];
}

export interface RecommendedCourse extends CatalogCourse {
  suitabilityScore: number;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  rationale: string;
  matchedCompetency?: string;
  zpdLevel: number;
}

export interface LearningTier {
  tierNumber: 1 | 2 | 3 | 4;
  tierName: string;
  targetLevel: string;
  description: string;
  courses: RecommendedCourse[];
}

export interface CompetencyGapInfo {
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
}

export interface LearningMilestone {
  id: string;
  title: string;
  timeline: string;
  description: string;
  targetCompetency: string;
}

export interface CourseProgressionInfo {
  index: number;
  id: string;
  title: string;
  provider: string;
  domain?: string;
  level?: number;
  duration?: string;
  link: string;
  clusterId: string;
  tier: 'Basic' | 'Intermediate' | 'Advanced';
  tierRank: number;
  prerequisites: string[];
  prerequisiteTitles: string[];
  nextProgression: string[];
  nextProgressionTitles: string[];
  competencyTag: string;
}

export interface CourseClusterDefinition {
  clusterId: string;
  clusterName: string;
  domain: string;
  description: string;
}

export interface StructuredLearningPathway {
  cadre: string;
  division: string;
  overallReadiness: number;
  totalEstimatedHours: number;
  identifiedGaps: CompetencyGapInfo[];
  tiers: LearningTier[];
  milestones: LearningMilestone[];
}

const CADRE_BENCHMARKS: Record<string, { division: string; defaultTargetLevel: number; focusDomains: string[] }> = {
  'Junior Statistical Officer (JSO)': {
    division: 'Field Operations Division (FOD), NSSO',
    defaultTargetLevel: 3,
    focusDomains: ['Statistical Competencies', 'Technical Competencies', 'Digital Governance', 'Behavioural and Managerial'],
  },
  'Senior Statistical Officer (SSO)': {
    division: 'Data Processing Division (DPD), NSSO',
    defaultTargetLevel: 4,
    focusDomains: ['Statistical Competencies', 'Technical Competencies', 'Digital Governance', 'Behavioural and Managerial'],
  },
  'Assistant Director (ISS)': {
    division: 'National Accounts Division (NAD)',
    defaultTargetLevel: 4,
    focusDomains: ['Statistical Competencies', 'Technical Competencies', 'Digital Governance', 'Behavioural and Managerial'],
  },
  'Director [DIID] (ISS)': {
    division: 'Data Informatics & Innovation Division (DIID)',
    defaultTargetLevel: 5,
    focusDomains: ['Statistical Competencies', 'Technical Competencies', 'Digital Governance', 'Behavioural and Managerial'],
  },
};


export interface MisconceptionDiagnosticRecord {
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  misconception: string;
  remedialCourse: string;
  remedialCourseId: string;
  remedialSkill: string;
}

export interface AssessmentAnswerSubmission {
  questionId?: string;
  questionText: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic?: string;
  distractorAnalysis?: Record<string, {
    misconception: string;
    remedialSkill: string;
    recommendedCourseId: string;
    recommendedCourseTitle: string;
  }>;
}

export interface CapacityCohortItem {
  id: string;
  name: string;
  division: string;
  officersCount: number;
  focusArea: string;
  badgeVariant: 'saffron' | 'success' | 'default' | 'neutral';
  imageGradient: string;
  relevanceMatch: number;
}

export interface AssessmentAnalysisResult {
  officerId: string;
  cadre: string;
  score: number;
  totalScore: number;
  scorePercentage: number;
  status: 'passed' | 'remedial';
  updatedProficiency: Record<string, number>;
  overallMastery: number;
  misconceptionsFound: MisconceptionDiagnosticRecord[];
  recommendedCourses: Array<CatalogCourse & { rationale: string }>;
  recommendedCohorts: CapacityCohortItem[];
}

export class CourseMatcherService {
  private courses: CatalogCourse[] = [];
  private progressionData: {
    version: string;
    totalMapped: number;
    batch: string;
    clusters: CourseClusterDefinition[];
    courses: CourseProgressionInfo[];
  } | null = null;

  constructor() {
    this.loadCatalog();
    this.loadProgressionData();
  }

  private loadCatalog() {
    try {
      const dataPath = path.join(__dirname, '../../data/courses_catalog.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        this.courses = JSON.parse(raw);
        console.log(`[CourseMatcher] Successfully indexed ${this.courses.length} authentic government courses.`);
      } else {
        console.warn(`[CourseMatcher] Catalog not found at ${dataPath}. Initializing fallback.`);
        this.courses = [];
      }
    } catch (error) {
      console.error('[CourseMatcher] Failed to load catalog:', error);
      this.courses = [];
    }
  }

  private loadProgressionData() {
    try {
      const progressionPath = path.join(__dirname, '../../data/course_clusters_progression.json');
      if (fs.existsSync(progressionPath)) {
        const raw = fs.readFileSync(progressionPath, 'utf-8');
        this.progressionData = JSON.parse(raw);
        console.log(`[CourseMatcher] Successfully indexed ${this.progressionData?.totalMapped || 0} progression-mapped courses across ${this.progressionData?.clusters.length || 0} clusters.`);
      }
    } catch (error) {
      console.error('[CourseMatcher] Failed to load progression data:', error);
    }
  }

  public getProgressionClusters(): { clusters: CourseClusterDefinition[]; totalMapped: number; batch: string } {
    if (!this.progressionData) {
      this.loadProgressionData();
    }
    return {
      clusters: this.progressionData?.clusters || [],
      totalMapped: this.progressionData?.totalMapped || 0,
      batch: this.progressionData?.batch || 'N/A'
    };
  }

  public getClusterCourses(clusterId: string): { cluster?: CourseClusterDefinition; courses: CourseProgressionInfo[] } {
    if (!this.progressionData) {
      this.loadProgressionData();
    }
    const cluster = this.progressionData?.clusters.find(c => c.clusterId === clusterId);
    const courses = (this.progressionData?.courses || []).filter(c => c.clusterId === clusterId);
    return { cluster, courses };
  }

  public getCourseProgression(courseId: string): CourseProgressionInfo | undefined {
    if (!this.progressionData) {
      this.loadProgressionData();
    }
    return this.progressionData?.courses.find(c => c.id === courseId);
  }

  /**
   * Tokenizes text and calculates semantic keyword overlap.
   */
  private computeKeywordOverlap(query: string, targetText: string): number {
    if (!query || !targetText) return 0;
    const qTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    const targetLower = targetText.toLowerCase();

    let matches = 0;
    for (const token of qTokens) {
      if (targetLower.includes(token)) {
        matches += 1;
      }
    }
    return qTokens.length > 0 ? matches / qTokens.length : 0;
  }

  /**
   * Computes multi-factor composite suitability score:
   * (0.35 * Cadre/Domain Match) + (0.30 * Topic Match) + (0.20 * ZPD Level Proximity) + (0.15 * Provider Quality)
   */
  private scoreCourse(
    course: CatalogCourse,
    targetDomain: string,
    topicQuery: string,
    idealLevel: number
  ): number {
    // 1. Domain match (0.35)
    let domainScore = 0.5;
    if (course.domain && targetDomain) {
      if (course.domain.toLowerCase() === targetDomain.toLowerCase()) {
        domainScore = 1.0;
      } else if (course.domain.toLowerCase().includes(targetDomain.toLowerCase()) || targetDomain.toLowerCase().includes(course.domain.toLowerCase())) {
        domainScore = 0.8;
      }
    }

    // 2. Topic/Keyword match (0.30)
    const combinedText = `${course.title} ${course.description || ''} ${course.competencyMapped || ''} ${(course.tags || []).join(' ')}`;
    const topicScore = this.computeKeywordOverlap(topicQuery, combinedText);

    // 3. ZPD Level proximity (0.20)
    const courseLevel = course.level || 2;
    const levelDiff = Math.abs(courseLevel - idealLevel);
    const levelScore = Math.max(0, 1 - levelDiff * 0.35);

    // 4. Provider prestige / duration practicality (0.15)
    let providerScore = 0.6;
    const provider = (course.provider || '').toLowerCase();
    if (provider.includes('mospi') || provider.includes('nssta') || provider.includes('istm') || provider.includes('igot')) {
      providerScore = 1.0;
    } else if (provider.includes('ministry') || provider.includes('ndrf') || provider.includes('gem')) {
      providerScore = 0.85;
    }

    const compositeScore = (0.35 * domainScore) + (0.30 * topicScore) + (0.20 * levelScore) + (0.15 * providerScore);
    return Math.round(compositeScore * 100) / 100;
  }

  /**
   * Semantically matches a single failed topic/question to the best authentic course.
   */
  async recommendCourse(gapTopic?: string, gapDescription?: string, assessedLevel: number = 2): Promise<CatalogCourse & { rationale: string }> {
    if (this.courses.length === 0) {
      this.loadCatalog();
    }

    const query = `${gapTopic || ''} ${gapDescription || ''}`.trim();
    const idealZpdLevel = Math.min(5, assessedLevel + 1);

    let bestCourse: CatalogCourse = this.courses[0] || {
      id: 'igot-default',
      title: 'Foundations of Official Statistics',
      provider: 'MoSPI Training Unit',
      duration: '4 Hours',
      durationHours: 4,
      link: 'https://igotkarmayogi.gov.in/',
      domain: 'Statistical Competencies',
      level: 2,
    };
    let highestScore = -1;

    for (const course of this.courses) {
      const score = this.scoreCourse(course, 'Statistical Competencies', query, idealZpdLevel);
      if (score > highestScore) {
        highestScore = score;
        bestCourse = course;
      }
    }

    const rationale = `Recommended because the officer demonstrated a gap in ${gapTopic || 'core concepts'}. This module provides targeted Level ${bestCourse.level || 2} scaffolding to reinforce required competency standards.`;

    return {
      ...bestCourse,
      rationale,
    };
  }

  /**
   * Generates a 4-Tier Zone of Proximal Development (ZPD) Structured Learning Pathway
   * based on the officer's designation and assessed proficiency levels.
   */
  async generatePersonalisedPathway(
    designation: string,
    proficiencies: Record<string, number>
  ): Promise<StructuredLearningPathway> {
    if (this.courses.length === 0) {
      this.loadCatalog();
    }

    const cadreInfo = CADRE_BENCHMARKS[designation] || CADRE_BENCHMARKS['Junior Statistical Officer (JSO)'];
    const assignedDivision = cadreInfo.division;

    // Identify competency gaps
    const identifiedGaps: CompetencyGapInfo[] = [];
    let totalTarget = 0;
    let totalCurrent = 0;

    const defaultSkills = [
      { name: 'Survey Design & Sampling', category: 'Statistical Competencies', target: designation.includes('Director') ? 5 : designation.includes('Assistant Director') ? 4 : designation.includes('Senior') ? 4 : 3 },
      { name: 'CAPI & Digital Field Enumeration', category: 'Technical Competencies', target: designation.includes('Director') ? 5 : designation.includes('Assistant Director') ? 4 : designation.includes('Senior') ? 3 : 4 },
      { name: 'Data Privacy & DPDPA 2023', category: 'Digital Governance', target: designation.includes('Director') ? 5 : designation.includes('Assistant Director') ? 4 : designation.includes('Senior') ? 3 : 2 },
      { name: 'Public Ethics & Field Communication', category: 'Behavioural and Managerial', target: designation.includes('Director') ? 5 : designation.includes('Assistant Director') ? 4 : designation.includes('Senior') ? 4 : 3 },
    ];

    defaultSkills.forEach((skill) => {
      const current = proficiencies[skill.name] ?? Math.max(1, skill.target - 1);
      totalTarget += skill.target;
      totalCurrent += current;

      if (current < skill.target) {
        identifiedGaps.push({
          skillName: skill.name,
          category: skill.category,
          currentLevel: current,
          targetLevel: skill.target,
          gap: skill.target - current,
        });
      }
    });

    const overallReadiness = Math.min(100, Math.round((totalCurrent / totalTarget) * 100));

    // Used course IDs to ensure deduplication across tiers
    const usedCourseIds = new Set<string>();

    const selectCoursesForTier = (
      tierNumber: 1 | 2 | 3 | 4,
      tierName: string,
      targetLevelRange: number[],
      queryKeywords: string[],
      categoryPreference: string,
      count: number = 2
    ): RecommendedCourse[] => {
      const candidates: Array<{ course: CatalogCourse; score: number }> = [];

      for (const course of this.courses) {
        if (usedCourseIds.has(course.id)) continue;
        const cLevel = course.level || 2;
        if (!targetLevelRange.includes(cLevel)) continue;

        const topicQuery = queryKeywords.join(' ');
        const score = this.scoreCourse(course, categoryPreference, topicQuery, targetLevelRange[0]);
        candidates.push({ course, score });
      }

      candidates.sort((a, b) => b.score - a.score);
      const selected = candidates.slice(0, count);

      return selected.map(({ course, score }) => {
        usedCourseIds.add(course.id);

        let rationale = '';
        if (tierNumber === 1) {
          rationale = `Assigned as a foundational prerequisite to solidify baseline principles before advancing to specialized operational modules.`;
        } else if (tierNumber === 2) {
          rationale = `Targeted operational reinforcement to bridge demonstrated diagnostic deficits in practical execution.`;
        } else if (tierNumber === 3) {
          rationale = `Official cadre curriculum required to achieve Level 4 benchmark compliance for ${designation}.`;
        } else {
          rationale = `Advanced extension module preparing the officer for strategic policy formulation, leadership, and digital transformation.`;
        }

        return {
          ...course,
          suitabilityScore: score,
          tier: tierNumber,
          tierName,
          rationale,
          zpdLevel: targetLevelRange[0],
        };
      });
    };

    // Tier 1: Foundation (Level 1-2)
    const tier1Courses = selectCoursesForTier(
      1,
      'Tier 1: Foundation & Remedial',
      [1, 2],
      ['basics', 'introduction', 'sampling', 'fundamentals', 'ethics', 'overview'],
      'Statistical Competencies',
      2
    );

    // Tier 2: Reinforcement (Level 3)
    const tier2Courses = selectCoursesForTier(
      2,
      'Tier 2: Operational Reinforcement',
      [3],
      ['field', 'capi', 'data', 'processing', 'scrutiny', 'operations', 'survey'],
      'Technical Competencies',
      2
    );

    // Tier 3: Core Cadre Benchmark (Level 4)
    const tier3Courses = selectCoursesForTier(
      3,
      'Tier 3: Core Cadre Benchmark',
      [4],
      ['national accounts', 'macro', 'supervision', 'audit', 'governance', 'analytics'],
      'Statistical Competencies',
      2
    );

    // Tier 4: Advanced Extension (Level 5)
    const tier4Courses = selectCoursesForTier(
      4,
      'Tier 4: Strategic Leadership & Policy',
      [5],
      ['leadership', 'modernization', 'artificial intelligence', 'policy', 'cloud', 'architecture'],
      'Behavioural and Managerial Competencies',
      2
    );

    const tiers: LearningTier[] = [
      {
        tierNumber: 1,
        tierName: 'Tier 1: Foundation & Prerequisite',
        targetLevel: 'Level 1–2 (Baseline Remediation)',
        description: 'Core statistical principles, data literacy, and public service ethics to address foundational competency gaps.',
        courses: tier1Courses,
      },
      {
        tierNumber: 2,
        tierName: 'Tier 2: Operational Reinforcement',
        targetLevel: 'Level 3 (Working Proficiency)',
        description: 'Day-to-day operational execution, field data scrubbing, CAPI operations, and survey scrutiny protocols.',
        courses: tier2Courses,
      },
      {
        tierNumber: 3,
        tierName: 'Tier 3: Core Cadre Benchmark',
        targetLevel: 'Level 4 (Cadre Standard)',
        description: `Official mandated curriculum required for ${designation} cadre accreditation and supervisory excellence.`,
        courses: tier3Courses,
      },
      {
        tierNumber: 4,
        tierName: 'Tier 4: Strategic Leadership & Policy',
        targetLevel: 'Level 5 (Advanced Leadership)',
        description: 'Advanced statistical architecture, AI/ML nowcasting, sovereign data protection, and evidence-based policy formulation.',
        courses: tier4Courses,
      },
    ];

    // Compute total estimated learning hours
    let totalEstimatedHours = 0;
    tiers.forEach((tier) => {
      tier.courses.forEach((c) => {
        totalEstimatedHours += c.durationHours || 2;
      });
    });

    // Milestones
    const milestones: LearningMilestone[] = [
      {
        id: 'ms-1',
        title: 'Milestone 1: Baseline Remediation',
        timeline: 'Weeks 1–3',
        description: 'Complete Tier 1 foundational coursework and clear prerequisite validation checks.',
        targetCompetency: 'Foundational Statistical Literacy & Ethics',
      },
      {
        id: 'ms-2',
        title: 'Milestone 2: Operational Mastery & Cadre Compliance',
        timeline: 'Weeks 4–8',
        description: 'Complete Tier 2 & Tier 3 modules to meet mandatory cadre benchmark standards.',
        targetCompetency: 'Survey Execution & Macro Data Verification',
      },
      {
        id: 'ms-3',
        title: 'Milestone 3: Apex Accreditation & Policy Leadership',
        timeline: 'Weeks 9–12',
        description: 'Pass the comprehensive post-training evaluation and complete Tier 4 strategic electives.',
        targetCompetency: 'Official Statistics Architecture & Policy Formulation',
      },
    ];

    return {
      cadre: designation,
      division: assignedDivision,
      overallReadiness,
      totalEstimatedHours,
      identifiedGaps,
      tiers,
      milestones,
    };
  }

  /**
   * Diagnostic Mistake Analysis & Dynamic Closed-Loop Recommendation Engine
   */
  public async analyzeAssessmentResults(
    officerId: string = 'JSO_1042',
    cadre: string = 'Junior Statistical Officer (JSO)',
    answers: AssessmentAnswerSubmission[] = [],
    currentProficiency: Record<string, number> = {}
  ): Promise<AssessmentAnalysisResult> {
    const totalQuestions = answers.length || 1;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const status: 'passed' | 'remedial' = scorePercentage >= 70 ? 'passed' : 'remedial';

    const updatedProficiency: Record<string, number> = { ...currentProficiency };
    const misconceptionsFound: MisconceptionDiagnosticRecord[] = [];

    // Load question bank for fallback distractor search if needed
    let bankQuestions: any[] = [];
    try {
      const qbPath = path.join(__dirname, '../../data/question_bank.json');
      if (fs.existsSync(qbPath)) {
        bankQuestions = JSON.parse(fs.readFileSync(qbPath, 'utf8'));
      }
    } catch {}

    // 1. Process each question answer
    for (const ans of answers) {
      const topicKey = ans.topic || 'Survey Design & Sampling';

      if (ans.isCorrect) {
        // Increment proficiency on demonstrated mastery
        updatedProficiency[topicKey] = Math.min(5, (updatedProficiency[topicKey] || 3) + 1);
      } else {
        // Decrement proficiency on identified gap
        updatedProficiency[topicKey] = Math.max(1, (updatedProficiency[topicKey] || 3) - 1);

        // Find distractor diagnostic info
        let diag = ans.distractorAnalysis?.[ans.selectedOption];
        if (!diag) {
          const match = bankQuestions.find(
            (b) => (b.question || '').toLowerCase() === (ans.questionText || '').toLowerCase()
          );
          if (match?.distractorAnalysis?.[ans.selectedOption]) {
            diag = match.distractorAnalysis[ans.selectedOption];
          }
        }

        const misconception = diag?.misconception || ("Misconception identified in " + topicKey + " enumeration protocols.");
        const remedialSkill = diag?.remedialSkill || topicKey;
        const remedialCourseTitle = diag?.recommendedCourseTitle || ("Remedial Module: " + topicKey);
        const remedialCourseId = diag?.recommendedCourseId || 'nsso-sampling-201';

        misconceptionsFound.push({
          question: ans.questionText,
          chosenAnswer: ans.selectedOption,
          correctAnswer: ans.correctAnswer,
          misconception,
          remedialCourse: remedialCourseTitle,
          remedialCourseId,
          remedialSkill,
        });
      }
    }

    // 2. Query 884-course graph for targeted remedial courses
    const recommendedCourses: Array<CatalogCourse & { rationale: string }> = [];
    for (const misc of misconceptionsFound) {
      const matched = await this.recommendCourse(misc.remedialSkill, misc.misconception, 2);
      if (matched && !recommendedCourses.some((c) => c.id === matched.id)) {
        recommendedCourses.push(matched);
      }
    }

    // 3. Dynamic Capacity Cohorts matched to lowest competency dimensions
    const allCohorts: CapacityCohortItem[] = [
      {
        id: 'cohort-1',
        name: 'NSSO 79th Round Household Survey',
        division: 'FOD · Field Operations',
        officersCount: 14,
        focusArea: 'CAPI & Circular Systematic Sampling',
        badgeVariant: 'saffron',
        imageGradient: 'from-amber-600 to-amber-900',
        relevanceMatch: (updatedProficiency['Survey Design & Sampling'] || 3) <= 3 ? 96 : 80,
      },
      {
        id: 'cohort-2',
        name: 'National Accounts SNA 2008 Working Group',
        division: 'NAD · Macroeconomics',
        officersCount: 8,
        focusArea: 'Supply-Use Tables & GVA Deflators',
        badgeVariant: 'default',
        imageGradient: 'from-blue-700 to-indigo-950',
        relevanceMatch: (updatedProficiency['National Accounts & Macro Indices'] || 3) <= 3 ? 94 : 75,
      },
      {
        id: 'cohort-3',
        name: 'AI & Big Data for Official Statistics',
        division: 'DIID · Modernization',
        officersCount: 19,
        focusArea: 'Satellite Imagery & Nowcasting',
        badgeVariant: 'success',
        imageGradient: 'from-emerald-700 to-teal-950',
        relevanceMatch: (updatedProficiency['Statistical Data Analytics (R & Python)'] || 3) <= 3 ? 92 : 78,
      },
      {
        id: 'cohort-4',
        name: 'DPDPA 2023 Data Fiduciary Taskforce',
        division: 'DPD · Microdata Scrutiny',
        officersCount: 12,
        focusArea: 'Unit-Level Anonymization & Consent',
        badgeVariant: 'neutral',
        imageGradient: 'from-amber-700 to-stone-900',
        relevanceMatch: (updatedProficiency['Data Privacy & DPDPA 2023'] || 3) <= 3 ? 98 : 72,
      },
    ];

    const recommendedCohorts = allCohorts.sort((a, b) => b.relevanceMatch - a.relevanceMatch);

    // Calculate overall mastery
    const profValues = Object.values(updatedProficiency);
    const avgScore = profValues.length > 0 ? (profValues.reduce((a, b) => a + b, 0) / (profValues.length * 5)) * 100 : scorePercentage;
    const overallMastery = Math.round(avgScore);

    return {
      officerId,
      cadre,
      score: correctCount * 20,
      totalScore: totalQuestions * 20,
      scorePercentage,
      status,
      updatedProficiency,
      overallMastery,
      misconceptionsFound,
      recommendedCourses,
      recommendedCohorts,
    };
  }
}
