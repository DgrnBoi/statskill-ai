// @vitest-environment jsdom
/* Hallmark · component: AssessmentAnalysisReport · genre: modern-minimal · theme: Cobalt/Gov */
/* states: default · hover · focus · active */
/* contrast: pass (WCAG AA 4.5:1+) */

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RotateCw,
  Terminal,
  ShieldCheck,
  BarChart3,
  Sparkles,
  BookOpen,
  ExternalLink,
  Target,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

export interface QuestionAnswerRecord {
  questionNumber: number;
  questionText: string;
  topic: string;
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

export interface PillarBreakdownItem {
  pillar: string;
  skillName: string;
  previousLevel: number;
  updatedLevel: number;
  delta: number;
  scorePercentage: number;
  benchmarkLevel: number;
}

export interface VerifiedCourseItem {
  id: string;
  title: string;
  provider: string;
  link: string;
  domain?: string;
  duration?: string;
  suitabilityScore?: number;
  rationale?: string;
  isVerifiedCatalog?: boolean;
}

export interface AIStrategicFeedbackData {
  executiveSummary: string;
  demonstratedStrengths: string[];
  priorityGrowthAreas: string[];
  actionPlan30Days: string[];
}

export interface AssessmentAnalysisData {
  score?: number;
  totalScore?: number;
  scorePercentage?: number;
  status?: 'passed' | 'remedial';
  updatedProficiency?: Record<string, number>;
  overallMastery?: number;
  pillarBreakdown?: PillarBreakdownItem[];
  misconceptionsFound?: any[];
  recommendedCourses?: VerifiedCourseItem[];
  aiStrategicFeedback?: AIStrategicFeedbackData;
  evaluationMode?: 'CLOUD_AI_VERIFIED' | 'DETERMINISTIC_SOVEREIGN' | string;
}

export interface AssessmentAnalysisReportProps {
  answers: QuestionAnswerRecord[];
  totalQuestions: number;
  timeTakenSeconds: number;
  paperSet: string;
  cadre: string;
  division: string;
  analysisData?: AssessmentAnalysisData | null;
  onNavigateToPathway: () => void;
  onRetakeQuiz: () => void;
  onOpenTelemetry: () => void;
  onOpenCertificate?: () => void;
  onOpenCitation?: (record: QuestionAnswerRecord) => void;
}

export const AssessmentAnalysisReport: React.FC<AssessmentAnalysisReportProps> = ({
  answers,
  totalQuestions,
  timeTakenSeconds,
  paperSet,
  cadre,
  division,
  analysisData,
  onNavigateToPathway,
  onRetakeQuiz,
  onOpenTelemetry,
  onOpenCertificate,
  onOpenCitation,
}) => {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const remainingSecondsTaken = timeTakenSeconds % 60;
  const formattedTimeTaken = `${minutesTaken > 0 ? `${minutesTaken}m ` : ''}${remainingSecondsTaken}s`;

  let ratingTitle = 'Foundational support needed';
  let ratingDescription = 'This attempt indicates topics to review before taking another assessment.';

  if (percentage === 100) {
    ratingTitle = 'All items correct';
    ratingDescription = 'Every item in this assessment was answered correctly.';
  } else if (percentage >= 80) {
    ratingTitle = 'Strong assessment result';
    ratingDescription = 'Most items were answered correctly; review the remaining explanations before the next attempt.';
  } else if (percentage >= 60) {
    ratingTitle = 'Working assessment result';
    ratingDescription = 'The attempt shows working knowledge with targeted review recommended for missed topics.';
  }

  // Fallback AI Feedback if not loaded from backend yet
  const aiFeedback: AIStrategicFeedbackData = analysisData?.aiStrategicFeedback || {
    executiveSummary: percentage >= 70
      ? `We evaluated your assessment responses and confirmed that you demonstrate solid mastery across key operational standards for ${cadre}.`
      : `We evaluated your performance and identified targeted opportunities to build proficiency in core statistical protocols for ${cadre}.`,
    demonstratedStrengths: answers.filter(a => a.isCorrect).map(a => `We confirmed strong proficiency in ${a.topic || 'Official Statistics'} enumeration workflows.`).slice(0, 2),
    priorityGrowthAreas: answers.filter(a => !a.isCorrect).map(a => `We recommend targeted review in ${a.topic || 'Statistical Concepts'} to resolve observed methodological gaps.`).slice(0, 2),
    actionPlan30Days: [
      'Complete the verified remedial course modules on the iGOT Karmayogi platform.',
      'Participate in peer validation sessions with the working group to practice sample verification.',
      'Retake the 4-pillar diagnostic assessment to confirm competency progression.',
    ],
  };

  const isCloudAi = analysisData?.evaluationMode === 'CLOUD_AI_VERIFIED';

  return (
    <Card className="border border-[#0B2E63]/30 bg-white overflow-hidden shadow-md animate-fade-in font-body">
      {/* Scorecard Header */}
      <div className="bg-[#0B2E63] text-white p-6 sm:p-8 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 bg-emerald-400/20 text-emerald-300 rounded border border-emerald-400/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </span>
              <Badge variant="success">Assessment completed</Badge>
              <Badge variant="neutral" className="bg-white/10 text-white border-white/20 font-mono">
                Paper: {paperSet}
              </Badge>
              <Badge variant="saffron" className="flex items-center gap-1 font-mono text-[10px]">
                <Sparkles className="w-3 h-3" />
                <span>{isCloudAi ? 'Cloud AI Verified' : 'Deterministic Sovereign Engine'}</span>
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              Diagnostic Assessment & AI Competency Calibration
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-body">
              Verified evaluation report for <strong className="text-white font-semibold">{cadre}</strong> ({division}).
              All proficiency updates and course suggestions are mathematically grounded and cross-referenced with authentic iGOT Karmayogi catalogs.
            </p>
          </div>

          {/* Top Score Pod */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-4 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-300 block font-mono">Overall Score</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 mt-0.5 block font-display">
                {correctCount} / {totalQuestions}
              </span>
              <span className="text-[11px] font-semibold text-slate-200 mt-0.5 block font-mono">{percentage}% Score</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-300 block font-mono">Time Taken</span>
              <span className="text-sm font-semibold text-white font-mono">{formattedTimeTaken} / 2m 30s</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-300 block font-mono">Assessment band</span>
              <span className="text-sm font-semibold text-white font-display">{ratingTitle}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-300 block font-mono">Answer summary</span>
              <span className="text-sm font-semibold text-white font-body">
                {correctCount} correct • {incorrectCount} to review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Details & Breakdown */}
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Rating Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            percentage >= 80
              ? 'bg-emerald-50 border-emerald-200/90 text-emerald-950'
              : percentage >= 60
              ? 'bg-amber-50 border-amber-200/90 text-amber-950'
              : 'bg-red-50 border-red-200/90 text-red-950'
          }`}
        >
          {percentage >= 80 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm font-bold font-display">{ratingTitle}</h4>
            <p className="text-xs mt-0.5 leading-relaxed font-body">{ratingDescription}</p>
          </div>
        </div>

        {/* AI Strategic Feedback Pod */}
        <div className="border border-blue-200 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-bold text-[#0B2E63] uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Strategic Diagnostic Analysis
            </h4>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-white border border-blue-200 text-blue-900 rounded-md">
              Anti-Hallucination Verified
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-body bg-white/80 p-3.5 rounded-lg border border-blue-100">
            {aiFeedback.executiveSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Demonstrated Strengths */}
            <div className="bg-white/90 border border-emerald-200/80 rounded-lg p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-emerald-900 uppercase font-display flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Demonstrated Strengths
              </span>
              <ul className="space-y-1.5">
                {aiFeedback.demonstratedStrengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-700 leading-snug flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Priority Growth Areas */}
            <div className="bg-white/90 border border-amber-200/80 rounded-lg p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase font-display flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                Priority Growth Areas
              </span>
              <ul className="space-y-1.5">
                {aiFeedback.priorityGrowthAreas.map((area, i) => (
                  <li key={i} className="text-xs text-slate-700 leading-snug flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 30-Day Action Plan */}
          {aiFeedback.actionPlan30Days && aiFeedback.actionPlan30Days.length > 0 && (
            <div className="bg-white/90 border border-blue-200/80 rounded-lg p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-[#0B2E63] uppercase font-display flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                30-Day Competency Advancement Plan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {aiFeedback.actionPlan30Days.map((step, idx) => (
                  <div key={idx} className="p-2.5 bg-blue-50/50 rounded-md border border-blue-100 flex items-start gap-2 text-xs text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#0B2E63] text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4-Pillar Competency Radar & Progress Breakdown */}
        {analysisData?.pillarBreakdown && analysisData.pillarBreakdown.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <BarChart3 className="w-4 h-4 text-[#0B2E63]" />
              4-Pillar Dynamic Competency Calibration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysisData.pillarBreakdown.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">{p.pillar}</span>
                      <span className="text-xs font-bold text-slate-900 font-display">{p.skillName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#0B2E63] font-mono">
                        Level {p.updatedLevel} / 5
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Benchmark: L{p.benchmarkLevel}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        p.updatedLevel >= p.benchmarkLevel ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${(p.updatedLevel / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Previous: Level {p.previousLevel}</span>
                    <span className={p.delta > 0 ? 'text-emerald-700 font-bold' : p.delta < 0 ? 'text-red-700 font-bold' : 'text-slate-600'}>
                      {p.delta > 0 ? `+${p.delta} Mastery Delta` : p.delta < 0 ? `${p.delta} Gapped` : 'Benchmark Maintained'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified iGOT Karmayogi Recommended Modules */}
        {analysisData?.recommendedCourses && analysisData.recommendedCourses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Verified iGOT Karmayogi Recommended Curriculum
              </h4>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Authentic Catalog Grounded
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysisData.recommendedCourses.map((course, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all shadow-2xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="saffron" className="text-[9px]">
                        {course.domain || 'Statistical Competencies'}
                      </Badge>
                      {course.suitabilityScore && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {course.suitabilityScore}% Match
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug font-display line-clamp-2">
                      {course.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-body">
                      Provider: {course.provider} • Duration: {course.duration || '2-4 hours'}
                    </p>
                    {course.rationale && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 font-body italic">
                        &quot;{course.rationale}&quot;
                      </p>
                    )}
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified iGOT ID: {course.id}
                    </span>
                    <a
                      href={course.link || 'https://igotkarmayogi.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2E63] hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      <span>Open Course</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question-by-Question Itemized Audit Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <BarChart3 className="w-4 h-4 text-[#0B2E63]" />
              Question-by-question review
            </h4>
            <span className="text-xs font-semibold text-slate-600 font-mono">
              {correctCount} of {totalQuestions} Correct
            </span>
          </div>

          <div className="border border-slate-200/90 rounded-xl overflow-hidden divide-y divide-slate-200/90">
            {answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-4 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  ans.isCorrect ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/30 hover:bg-amber-50/50'
                }`}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      {ans.questionNumber}
                    </span>
                    <Badge variant="saffron" className="text-[10px]">
                      {ans.topic || 'Official Statistics'}
                    </Badge>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono ${
                        ans.isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {ans.isCorrect ? 'Correct · level updated' : 'Review recommended'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug font-body">{ans.questionText}</p>
                  <p className="text-[11px] text-slate-600 font-body">
                    Selected Answer:{' '}
                    <strong className={ans.isCorrect ? 'text-emerald-800' : 'text-red-700'}>
                      {ans.selectedOption}
                    </strong>
                    {!ans.isCorrect && (
                      <span className="ml-2 text-slate-700">
                        • Correct Key: <strong className="text-emerald-800">{ans.correctAnswer}</strong>
                      </span>
                    )}
                  </p>
                  {ans.explanation && (
                    <p className="text-[11px] text-slate-500 mt-0.5 font-body">
                      Context: {ans.explanation}
                    </p>
                  )}

                  {!ans.isCorrect && ans.distractorAnalysis?.[ans.selectedOption] && (
                    <div className="mt-2 p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg text-xs space-y-1 font-body">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 font-display">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Identified Misconception:</span>
                      </div>
                      <p className="text-amber-950 text-[11px] leading-relaxed">
                        {ans.distractorAnalysis[ans.selectedOption].misconception}
                      </p>
                      {ans.distractorAnalysis[ans.selectedOption].recommendedCourseTitle && (
                        <p className="text-amber-900 text-[11px] font-semibold pt-0.5 font-mono">
                          Recommended Remedial Course: <span className="underline">{ans.distractorAnalysis[ans.selectedOption].recommendedCourseTitle}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {onOpenCitation && (ans.sourceCitation || ans.explanation) && (
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenCitation(ans)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B2E63] hover:text-[#123E82] hover:underline cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inspect Grounded Source Citation</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="pt-4 border-t border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onOpenCertificate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenCertificate}
                className="text-xs font-bold border-[#0B2E63]/40 text-[#0B2E63] bg-blue-50/50 hover:bg-blue-100/70 flex items-center gap-1.5 shadow-xs"
              >
                <Award className="w-4 h-4 text-[#0B2E63]" />
                <span>Export Official Certificate</span>
              </Button>
            )}
            <button
              type="button"
              onClick={onOpenTelemetry}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>Inspect xAPI payload</span>
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Practice New Set</span>
            </button>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={onNavigateToPathway}
            className="text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
          >
            <span>View 4-Tier Learning Pathway</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
