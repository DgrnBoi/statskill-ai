import fs from 'fs';
import path from 'path';
import { userDb } from '../../db/UserDatabase';
import { CompetencyEngine, SynthesizedCompetency } from '../CompetencyEngine';

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

export interface AssessmentAnswer {
  questionNumber?: number;
  questionText: string;
  topic?: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  sourceCitation?: string;
  distractorAnalysis?: Record<string, {
    misconception: string;
    remedialSkill: string;
    recommendedCourseTitle: string;
    recommendedCourseId: string;
  }>;
}

export interface DiagnosticMisconception {
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  misconception: string;
  remedialCourse: string;
  remedialCourseId: string;
  remedialSkill: string;
}

export interface PillarProficiencyScore {
  pillar: string;
  skillName: string;
  previousLevel: number;
  updatedLevel: number;
  delta: number;
  scorePercentage: number;
  benchmarkLevel: number;
}

export interface AIStrategicFeedback {
  executiveSummary: string;
  demonstratedStrengths: string[];
  priorityGrowthAreas: string[];
  actionPlan30Days: string[];
}

export interface VerifiedCourseRecommendation extends CatalogCourse {
  suitabilityScore: number;
  rationale: string;
  matchedPillar: string;
  isVerifiedCatalog: boolean;
}

export interface CapacityCohortItem {
  id: string;
  name: string;
  division: string;
  officersCount: number;
  focusArea: string;
  badgeVariant: 'saffron' | 'default' | 'success' | 'neutral';
  imageGradient: string;
  relevanceMatch: number;
}

export interface AIEvaluationResult {
  officerId: string;
  cadre: string;
  score: number;
  totalScore: number;
  scorePercentage: number;
  status: 'passed' | 'remedial';
  updatedProficiency: Record<string, number>;
  overallMastery: number;
  pillarBreakdown: PillarProficiencyScore[];
  misconceptionsFound: DiagnosticMisconception[];
  recommendedCourses: VerifiedCourseRecommendation[];
  recommendedCohorts: CapacityCohortItem[];
  aiStrategicFeedback: AIStrategicFeedback;
  evaluationMode: 'CLOUD_AI_VERIFIED' | 'DETERMINISTIC_SOVEREIGN';
}

export class AIEvaluationService {
  private catalog: CatalogCourse[] = [];
  private competencyEngine: CompetencyEngine;

  constructor() {
    this.competencyEngine = new CompetencyEngine();
    this.loadCatalog();
  }

  private loadCatalog(): void {
    try {
      const catalogPath = path.join(__dirname, '../../data/courses_catalog.json');
      if (fs.existsSync(catalogPath)) {
        const raw = fs.readFileSync(catalogPath, 'utf8');
        this.catalog = JSON.parse(raw);
        console.log(`[AIEvaluationService] Loaded ${this.catalog.length} verified iGOT Karmayogi courses.`);
      }
    } catch (err) {
      console.error('[AIEvaluationService] Failed to load courses_catalog.json:', err);
      this.catalog = [];
    }
  }

  public getCatalog(): CatalogCourse[] {
    return this.catalog;
  }

  /**
   * Anti-Hallucination Guard: Validates that a course ID or title exists in authentic catalog.
   * If not found, snaps to the closest matching verified course by domain, skill, or keyword.
   */
  public findVerifiedCourse(candidateIdOrTitle: string, fallbackTopic: string = 'General Statistical Methodology'): CatalogCourse {
    if (!this.catalog || this.catalog.length === 0) {
      return {
        id: 'igot-stats-fallback-01',
        title: 'Official Statistics and Field Survey Methodologies',
        provider: 'National Statistical Systems Training Academy (NSSTA)',
        link: 'https://igotkarmayogi.gov.in/app/toc/lex_auth_0138549281928374821/overview',
        domain: 'Statistical Competencies',
        level: 2,
        duration: '4 hours',
        competencyMapped: fallbackTopic,
      };
    }

    const cleanQuery = (candidateIdOrTitle || '').toLowerCase().trim();

    // 1. Exact ID Match
    const idMatch = this.catalog.find(c => c.id && c.id.toLowerCase() === cleanQuery);
    if (idMatch) return idMatch;

    // 2. Exact Title Match
    const exactTitleMatch = this.catalog.find(c => c.title && c.title.toLowerCase() === cleanQuery);
    if (exactTitleMatch) return exactTitleMatch;

    // 3. Substring Title / ID Match
    const partialTitleMatch = this.catalog.find(c => c.title && (c.title.toLowerCase().includes(cleanQuery) || cleanQuery.includes(c.title.toLowerCase())));
    if (partialTitleMatch) return partialTitleMatch;

    // 4. Topic / Competency Match
    const cleanTopic = (fallbackTopic || '').toLowerCase().trim();
    const topicMatch = this.catalog.find(c => {
      const comp = (c.competencyMapped || '').toLowerCase();
      const domain = (c.domain || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      return comp.includes(cleanTopic) || domain.includes(cleanTopic) || desc.includes(cleanTopic) || cleanTopic.includes(comp);
    });
    if (topicMatch) return topicMatch;

    // 5. Fallback to first high-quality NSSTA/MoSPI course in catalog
    const nsstaCourse = this.catalog.find(c => (c.provider || '').includes('NSSTA') || (c.domain || '').includes('Statistical'));
    return nsstaCourse || this.catalog[0];
  }

  /**
   * Evaluates diagnostic assessment with deterministic scoring, anti-hallucination course verification,
   * and dynamic 4-pillar competency calibration.
   */
  public async evaluateAssessment(
    officerId: string,
    cadre: string,
    answers: AssessmentAnswer[],
    currentProficiency: Record<string, number> = {},
    customApiKey?: string
  ): Promise<AIEvaluationResult> {
    const totalQuestions = answers.length || 1;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const status: 'passed' | 'remedial' = scorePercentage >= 70 ? 'passed' : 'remedial';

    // 1. Derive 4-Pillar Competencies for this cadre
    const cadreCompetencies: SynthesizedCompetency[] = await this.competencyEngine.getRequiredSkillsForRole(cadre);
    const updatedProficiency: Record<string, number> = { ...currentProficiency };

    // Initialize missing proficiencies from cadre target levels
    cadreCompetencies.forEach(comp => {
      if (typeof updatedProficiency[comp.skillName] !== 'number') {
        updatedProficiency[comp.skillName] = Math.max(1, comp.targetLevel - 1);
      }
    });

    // 2. Load Question Bank for fallback distractor analysis
    let bankQuestions: any[] = [];
    try {
      const qbPath = path.join(__dirname, '../../data/question_bank.json');
      if (fs.existsSync(qbPath)) {
        bankQuestions = JSON.parse(fs.readFileSync(qbPath, 'utf8'));
      }
    } catch (_) {}

    // 3. Process Answers & Build Misconception Records
    const misconceptionsFound: DiagnosticMisconception[] = [];
    const skillDeltas: Record<string, { previous: number; updated: number }> = {};

    cadreCompetencies.forEach(comp => {
      const existing = updatedProficiency[comp.skillName] ?? 0;
      skillDeltas[comp.skillName] = {
        previous: existing,
        updated: existing,
      };
    });

    for (const ans of answers) {
      const topicKey = ans.topic || cadreCompetencies[0]?.skillName || 'Survey Design & Sampling';

      const matchedComp = cadreCompetencies.find(
        c =>
          c.skillName.toLowerCase() === topicKey.toLowerCase() ||
          topicKey.toLowerCase().includes(c.skillName.toLowerCase()) ||
          c.skillName.toLowerCase().includes(topicKey.toLowerCase())
      );
      const targetSkillKey = matchedComp ? matchedComp.skillName : topicKey;

      if (!skillDeltas[targetSkillKey]) {
        const existing = updatedProficiency[targetSkillKey] ?? 0;
        skillDeltas[targetSkillKey] = {
          previous: existing,
          updated: existing,
        };
      }

      if (ans.isCorrect) {
        // Increment proficiency deterministically
        const current = updatedProficiency[targetSkillKey] ?? 0;
        const next = Math.min(5, current + 1);
        updatedProficiency[targetSkillKey] = next;
        skillDeltas[targetSkillKey].updated = next;
      } else {
        // Decrement proficiency if already assessed, keeping 0 if unassessed
        const current = updatedProficiency[targetSkillKey] ?? 0;
        const next = current > 0 ? Math.max(1, current - 1) : 0;
        updatedProficiency[targetSkillKey] = next;
        skillDeltas[targetSkillKey].updated = next;

        // Distractor Analysis Lookup
        let diag = ans.distractorAnalysis?.[ans.selectedOption];
        if (!diag) {
          const match = bankQuestions.find(
            b => (b.question || '').toLowerCase() === (ans.questionText || '').toLowerCase()
          );
          if (match?.distractorAnalysis?.[ans.selectedOption]) {
            diag = match.distractorAnalysis[ans.selectedOption];
          }
        }

        const misconception = diag?.misconception || `We observed a gap in applied protocols for ${topicKey}.`;
        const remedialSkill = diag?.remedialSkill || targetSkillKey;
        const remedialCourseTitle = diag?.recommendedCourseTitle || `Remedial Module: ${targetSkillKey}`;
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

    // 4. Calculate 4-Pillar Breakdown
    const pillarBreakdown: PillarProficiencyScore[] = cadreCompetencies.map(comp => {
      const deltaInfo = skillDeltas[comp.skillName] || { previous: comp.targetLevel, updated: updatedProficiency[comp.skillName] || comp.targetLevel };
      const current = updatedProficiency[comp.skillName] || deltaInfo.updated;
      const prev = deltaInfo.previous;
      return {
        pillar: comp.category,
        skillName: comp.skillName,
        previousLevel: prev,
        updatedLevel: current,
        delta: current - prev,
        scorePercentage: Math.round((current / 5) * 100),
        benchmarkLevel: comp.targetLevel,
      };
    });

    // 5. Build Candidate Verified Courses for Remediation & Enrichment
    const candidateCourses: VerifiedCourseRecommendation[] = [];
    const seenCourseIds = new Set<string>();

    for (const misc of misconceptionsFound) {
      const verified = this.findVerifiedCourse(misc.remedialCourseId || misc.remedialCourse, misc.remedialSkill);
      if (verified && !seenCourseIds.has(verified.id)) {
        seenCourseIds.add(verified.id);
        candidateCourses.push({
          ...verified,
          suitabilityScore: 94,
          rationale: `We mapped this course to address your identified gap in ${misc.remedialSkill}.`,
          matchedPillar: verified.domain || 'Statistical Competencies',
          isVerifiedCatalog: true,
        });
      }
    }

    // Add general domain enrichment courses if fewer than 3
    if (candidateCourses.length < 3) {
      for (const comp of cadreCompetencies) {
        const verified = this.findVerifiedCourse(comp.skillName, comp.category);
        if (verified && !seenCourseIds.has(verified.id)) {
          seenCourseIds.add(verified.id);
          candidateCourses.push({
            ...verified,
            suitabilityScore: 88,
            rationale: `We recommended this module to build proficiency toward the ${cadre} Level ${comp.targetLevel} benchmark.`,
            matchedPillar: comp.category,
            isVerifiedCatalog: true,
          });
        }
        if (candidateCourses.length >= 4) break;
      }
    }

    // 6. Generate AI Strategic Feedback (Cloud LLM or Sovereign Deterministic Engine)
    const activeApiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY;
    let aiFeedback: AIStrategicFeedback;
    let evalMode: 'CLOUD_AI_VERIFIED' | 'DETERMINISTIC_SOVEREIGN' = 'DETERMINISTIC_SOVEREIGN';

    if (activeApiKey) {
      try {
        const cloudResult = await this.callCloudAiEvaluation(
          cadre,
          scorePercentage,
          answers,
          pillarBreakdown,
          misconceptionsFound,
          candidateCourses,
          activeApiKey
        );
        aiFeedback = cloudResult.feedback;
        evalMode = 'CLOUD_AI_VERIFIED';
      } catch (err) {
        console.warn('[AIEvaluationService] Cloud AI evaluation failed or timed out. Falling back to sovereign engine:', err);
        aiFeedback = this.generateSovereignFeedback(cadre, scorePercentage, pillarBreakdown, misconceptionsFound);
      }
    } else {
      aiFeedback = this.generateSovereignFeedback(cadre, scorePercentage, pillarBreakdown, misconceptionsFound);
    }

    // 7. Capacity Cohorts
    const rawCohorts: Array<{
      id: string;
      name: string;
      division: string;
      officersCount: number;
      focusArea: string;
      badgeVariant: 'saffron' | 'default' | 'success' | 'neutral';
      imageGradient: string;
      relevanceMatch: number;
    }> = [
      {
        id: 'cohort-1',
        name: 'NSSO 79th Round Household Survey',
        division: 'FOD · Field Operations',
        officersCount: 14,
        focusArea: 'CAPI & Circular Systematic Sampling',
        badgeVariant: 'saffron',
        imageGradient: 'from-amber-600 to-amber-900',
        relevanceMatch: (updatedProficiency['Survey Design & Sampling'] ?? 0) <= 3 ? 96 : 80,
      },
      {
        id: 'cohort-2',
        name: 'National Accounts SNA 2008 Working Group',
        division: 'NAD · Macroeconomics',
        officersCount: 8,
        focusArea: 'Supply-Use Tables & GVA Deflators',
        badgeVariant: 'default',
        imageGradient: 'from-blue-700 to-indigo-950',
        relevanceMatch: (updatedProficiency['National Accounts & Macro Indices'] ?? 0) <= 3 ? 94 : 75,
      },
      {
        id: 'cohort-3',
        name: 'AI & Big Data for Official Statistics',
        division: 'DIID · Modernization',
        officersCount: 19,
        focusArea: 'Satellite Imagery & Nowcasting',
        badgeVariant: 'success',
        imageGradient: 'from-emerald-700 to-teal-950',
        relevanceMatch: (updatedProficiency['Statistical Data Analytics (R & Python)'] ?? 0) <= 3 ? 92 : 78,
      },
      {
        id: 'cohort-4',
        name: 'DPDPA 2023 Data Fiduciary Taskforce',
        division: 'DPD · Microdata Scrutiny',
        officersCount: 12,
        focusArea: 'Unit-Level Anonymization & Consent',
        badgeVariant: 'neutral',
        imageGradient: 'from-amber-700 to-stone-900',
        relevanceMatch: (updatedProficiency['Data Privacy & DPDPA 2023'] ?? 0) <= 3 ? 98 : 72,
      },
    ];

    const recommendedCohorts: CapacityCohortItem[] = rawCohorts.sort((a, b) => b.relevanceMatch - a.relevanceMatch);

    // 8. Record in User Database
    try {
      const user = userDb.getUserByParichayId(officerId) || userDb.getUserById(officerId);
      if (user) {
        userDb.recordAssessment(user.id, {
          id: `eval-${Date.now()}`,
          courseId: answers[0]?.topic || 'Assessment',
          courseTitle: answers[0]?.topic || 'Competency Diagnostic Assessment',
          category: cadre,
          score: correctCount * 20,
          totalScore: totalQuestions * 20,
          scorePercentage,
          status,
          durationMinutes: 3,
          date: new Date().toISOString().split('T')[0],
          misconceptions: misconceptionsFound,
        });
        userDb.updateUser(user.id, {
          proficiency: updatedProficiency,
        });
      }
    } catch (_) {}

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
      pillarBreakdown,
      misconceptionsFound,
      recommendedCourses: candidateCourses,
      recommendedCohorts,
      aiStrategicFeedback: aiFeedback,
      evaluationMode: evalMode,
    };
  }

  /**
   * Deterministic Sovereign Feedback Generator.
   * Adheres strictly to copywriting rules:
   * - No staccato noun fragments
   * - Complete sentences with active verbs
   * - Perspective of "We"
   */
  private generateSovereignFeedback(
    cadre: string,
    scorePercentage: number,
    pillars: PillarProficiencyScore[],
    misconceptions: DiagnosticMisconception[]
  ): AIStrategicFeedback {
    const strengths = pillars
      .filter(p => p.updatedLevel >= p.benchmarkLevel)
      .map(p => `We confirmed strong proficiency in ${p.skillName} under the ${p.pillar} pillar at Level ${p.updatedLevel}.`);

    if (strengths.length === 0) {
      strengths.push(`We observed foundational awareness across primary statistical workflows for the ${cadre} designation.`);
    }

    const growthAreas = misconceptions.map(
      m => `We recommend targeted remediation in ${m.remedialSkill} to resolve misconceptions regarding ${m.misconception.toLowerCase().replace(/\.$/, '')}.`
    );

    if (growthAreas.length === 0) {
      growthAreas.push(`We recommend pursuing advanced electives in modern data pipelines and predictive modeling to surpass standard benchmark levels.`);
    }

    const actionPlan = [
      `Complete the verified remedial course modules on the iGOT Karmayogi platform within the next 14 days.`,
      `Participate in peer validation sessions with the ${cadre} working group to practice sample verification.`,
      `Retake the 4-pillar diagnostic assessment after completing remedial coursework to confirm competency progression.`,
    ];

    let executiveSummary = '';
    if (scorePercentage >= 80) {
      executiveSummary = `We evaluated your assessment responses and confirmed that you demonstrate strong mastery across key operational domains for the ${cadre} role. Your results satisfy national competency benchmarks while highlighting specific opportunities for advanced specialization.`;
    } else if (scorePercentage >= 60) {
      executiveSummary = `We evaluated your performance and identified steady working proficiency in your core cadre responsibilities. You demonstrate consistent command in primary workflows, and our structured recommendations will help you close specific technical gaps.`;
    } else {
      executiveSummary = `We conducted a detailed review of your diagnostic assessment and mapped targeted learning pathways to support your professional growth. By focusing on foundational statistical guidelines, you can rapidly raise your proficiency to the required cadre standard.`;
    }

    return {
      executiveSummary,
      demonstratedStrengths: strengths,
      priorityGrowthAreas: growthAreas,
      actionPlan30Days: actionPlan,
    };
  }

  /**
   * Calls Cloud AI with strict anti-hallucination groundings.
   */
  private async callCloudAiEvaluation(
    cadre: string,
    scorePercentage: number,
    answers: AssessmentAnswer[],
    pillars: PillarProficiencyScore[],
    misconceptions: DiagnosticMisconception[],
    candidateCourses: VerifiedCourseRecommendation[],
    apiKey: string
  ): Promise<{ feedback: AIStrategicFeedback }> {
    const catalogContext = candidateCourses.map(c => `- ID: "${c.id}" | Title: "${c.title}" | Provider: "${c.provider}" | Domain: "${c.domain}" | Link: "${c.link}"`).join('\n');

    const prompt = `You are a Senior Learning Evaluator and Psychometrician for the National Statistical Systems Training Academy (NSSTA), Ministry of Statistics and Programme Implementation (MoSPI), Government of India.

Analyze this completed diagnostic assessment for an officer in the cadre: "${cadre}".
Overall Assessment Score: ${scorePercentage}% (${answers.filter(a => a.isCorrect).length}/${answers.length} correct).

4-PILLAR PERFORMANCE BREAKDOWN:
${pillars.map(p => `- ${p.pillar} (${p.skillName}): Level ${p.updatedLevel}/5 (Benchmark: Level ${p.benchmarkLevel})`).join('\n')}

IDENTIFIED MISCONCEPTIONS:
${misconceptions.length > 0 ? misconceptions.map(m => `- Topic: ${m.remedialSkill} | Misconception: ${m.misconception}`).join('\n') : 'No misconceptions identified. All questions answered correctly.'}

VERIFIED IGOT KARMAYOGI COURSES (STRICT REFERENCE CATALOG):
<verified_igot_catalog>
${catalogContext}
</verified_igot_catalog>

COPYWRITING & INTEGRITY RULES:
1. Write in complete sentences with active verbs. Never use staccato noun fragments (e.g. do not write "Compute, electricity, cooling").
2. Write from the perspective of "We" (e.g. "We evaluated your responses...", "We recommend...").
3. Anti-Hallucination Invariant: Do NOT invent fake courses or URLs. Only refer to concepts and courses present in the verified catalog.

Return ONLY a valid JSON object matching this schema:
{
  "executiveSummary": "2-3 complete sentences summarizing the evaluation from the perspective of 'We'.",
  "demonstratedStrengths": ["Complete sentence describing strength 1", "Complete sentence describing strength 2"],
  "priorityGrowthAreas": ["Complete sentence describing growth area 1", "Complete sentence describing growth area 2"],
  "actionPlan30Days": ["Complete sentence action step 1", "Complete sentence action step 2", "Complete sentence action step 3"]
}`;

    const geminiKey = apiKey.startsWith('AIza') ? apiKey : (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '');
    const isGeminiAvailable = !!geminiKey && geminiKey.startsWith('AIza');
    const groqKey = apiKey.startsWith('gsk_') ? apiKey : (process.env.GROQ_API_KEY || apiKey);
    const isGroqAvailable = !!groqKey && (groqKey.startsWith('gsk_') || !!process.env.GROQ_API_KEY);

    if (isGeminiAvailable) {
      const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
      for (const model of geminiModels) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 1200 }
            })
          });
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            return {
              feedback: {
                executiveSummary: parsed.executiveSummary || 'Assessment completed.',
                demonstratedStrengths: Array.isArray(parsed.demonstratedStrengths) ? parsed.demonstratedStrengths : [],
                priorityGrowthAreas: Array.isArray(parsed.priorityGrowthAreas) ? parsed.priorityGrowthAreas : [],
                actionPlan30Days: Array.isArray(parsed.actionPlan30Days) ? parsed.actionPlan30Days : []
              }
            };
          }
        } catch (_) {}
      }
    }

    if (isGroqAvailable) {
      const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it", "mixtral-8x7b-32768"];
      for (const model of groqModels) {
        try {
          const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" },
              temperature: 0.2
            })
          });
          const data = await res.json();
          if (data.choices?.[0]?.message?.content) {
            const raw = data.choices[0].message.content;
            const parsed = JSON.parse(raw);
            return {
              feedback: {
                executiveSummary: parsed.executiveSummary || 'Assessment completed.',
                demonstratedStrengths: Array.isArray(parsed.demonstratedStrengths) ? parsed.demonstratedStrengths : [],
                priorityGrowthAreas: Array.isArray(parsed.priorityGrowthAreas) ? parsed.priorityGrowthAreas : [],
                actionPlan30Days: Array.isArray(parsed.actionPlan30Days) ? parsed.actionPlan30Days : []
              }
            };
          }
        } catch (_) {}
      }
    }

    throw new Error('Cloud AI evaluation models unavailable.');
  }
}

/**
 * Robustly parses AI responses by stripping markdown code blocks and conversational text wrappers.
 */
export function extractCleanJson(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return {};
  let cleaned = rawText.trim();

  // Strip markdown code fences (```json ... ``` or ``` ...)
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }

  // If there's conversational prefix, find the first '{' or '[' and last '}' or ']'
  const firstBrace = cleaned.search(/[\{\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    try {
      const repaired = cleaned.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(repaired);
    } catch (_) {
      return { raw: rawText, error: 'JSON parse error' };
    }
  }
}

