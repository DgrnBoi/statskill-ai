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

export interface AssessmentAnalysisReportProps {
  answers: QuestionAnswerRecord[];
  totalQuestions: number;
  timeTakenSeconds: number;
  paperSet: string;
  cadre: string;
  division: string;
  onNavigateToPathway: () => void;
  onRetakeQuiz: () => void;
  onOpenTelemetry: () => void;
}

export const AssessmentAnalysisReport: React.FC<AssessmentAnalysisReportProps> = ({
  answers,
  totalQuestions,
  timeTakenSeconds,
  paperSet,
  cadre,
  division,
  onNavigateToPathway,
  onRetakeQuiz,
  onOpenTelemetry,
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

  return (
    <Card className="border border-[#0B2E63]/30 bg-white overflow-hidden shadow-md animate-fade-in font-body">
      {/* Prototype scorecard header */}
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
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              Assessment result and topic review
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-body">
              Prototype evaluation summary for <strong className="text-white font-semibold">{cadre}</strong> ({division}).
              Results have been saved to this prototype&apos;s competency record. Open the telemetry inspector to review the xAPI payload prepared for integration.
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenTelemetry}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>Inspect xAPI payload</span>
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
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

