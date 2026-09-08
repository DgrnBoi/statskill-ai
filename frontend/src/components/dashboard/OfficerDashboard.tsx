import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Clock, FileText, GraduationCap, Terminal, Users, X } from 'lucide-react';
import { PortalTab } from '../layout/Navbar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { EmptyState, PageHeader } from '../ui/PageHeader';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

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

function formatScore(exam: RecentExamRecord) {
  return exam.totalScore > 0 ? Math.round((exam.score / exam.totalScore) * 100) : 0;
}

function getLevel(proficiency: Record<string, number>, skill: CompetencyItem) {
  return proficiency[skill.skillName] ?? proficiency[skill.id] ?? 0;
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
  officerName,
  officerCadreId,
  assessmentHistory = [],
  capacityCohorts = [],
}: OfficerDashboardProps) {
  const { t } = useUiPreferences();
  const [selectedExam, setSelectedExam] = useState<RecentExamRecord | null>(null);
  const dialogRef = useDialogAccessibility(Boolean(selectedExam), () => setSelectedExam(null));

  const summary = useMemo(() => {
    const levels = skills.map((skill) => getLevel(proficiency, skill));
    const assessed = levels.filter((level) => level > 0);
    const averageLevel = assessed.length ? assessed.reduce((total, level) => total + level, 0) / assessed.length : 0;
    const met = skills.filter((skill) => getLevel(proficiency, skill) >= skill.targetLevel).length;
    const priority = [...skills]
      .map((skill) => ({ skill, gap: Math.max(0, skill.targetLevel - getLevel(proficiency, skill)) }))
      .sort((a, b) => b.gap - a.gap)[0];
    const averageScore = assessmentHistory.length
      ? Math.round(assessmentHistory.reduce((total, exam) => total + formatScore(exam), 0) / assessmentHistory.length)
      : null;
    const minutes = assessmentHistory.reduce((total, exam) => total + exam.durationMinutes, 0);
    return { averageLevel, met, priority, averageScore, minutes, hasData: assessed.length > 0 || assessmentHistory.length > 0 };
  }, [assessmentHistory, proficiency, skills]);

  return (
    <section className="overview-workspace" aria-label="Officer overview">
      <PageHeader
        title={t('officerDashboardTitle')}
        description={divisionDescription}
        actions={<Button onClick={() => onNavigateTab('dashboard')}>{t('officerTakeExam')} <ArrowRight size={16} aria-hidden="true" /></Button>}
      />

      <div className="overview-identity-bar">
        <div className="overview-officer">
          <span className="overview-officer-icon"><GraduationCap size={20} aria-hidden="true" /></span>
          <div><strong>{officerName || t('officerDemoOfficer')}</strong><span>{currentCadre} · {divisionName}</span></div>
        </div>
        {officerCadreId && <Badge variant="neutral">ID: {officerCadreId}</Badge>}
        <label className="overview-cadre-select"><span>{t('officerCadreTrack')}</span><select value={currentCadre} onChange={(event) => onCadreChange(event.target.value)}>{cadresList.map((cadre) => <option key={cadre} value={cadre}>{cadre}</option>)}</select></label>
      </div>

      <div className="overview-metrics" aria-label="Learning progress summary">
        <div><span>{t('officerAssessmentsRecorded')}</span><strong>{assessmentHistory.length}</strong></div>
        <div><span>{t('officerAverageScore')}</span><strong>{summary.averageScore === null ? '—' : `${summary.averageScore}%`}</strong></div>
        <div><span>{t('officerCompetenciesMet')}</span><strong>{summary.met}<small> / {skills.length}</small></strong></div>
        <div><span>{t('officerAssessmentTime')}</span><strong>{summary.minutes}<small> min</small></strong></div>
      </div>

      <div className="overview-primary-grid">
        <Card>
          <CardHeader><CardTitle>{t('officerProgressTitle')}</CardTitle><CardDescription>Current levels come from assessments saved for this officer on this device.</CardDescription></CardHeader>
          <CardContent>
            {!summary.hasData ? (
              <EmptyState title="No diagnostic results yet" description="Complete an assessment to establish a baseline. Until then, the dashboard will not substitute sample scores."><Button size="sm" onClick={() => onNavigateTab('dashboard')}>Start first assessment</Button></EmptyState>
            ) : (
              <div className="overview-competencies">
                <div className="overview-level-summary"><span>Average assessed level</span><strong>{summary.averageLevel.toFixed(1)}<small> / 5</small></strong><p>Priority gap: {summary.priority?.skill.skillName || 'No gap identified'}</p></div>
                <div className="overview-level-list">
                  {skills.map((skill) => {
                    const level = getLevel(proficiency, skill);
                    const percent = Math.min(100, Math.max(0, (level / 5) * 100));
                    const targetPercent = Math.min(100, Math.max(0, ((skill.targetLevel || 3) / 5) * 100));
                    return <div key={skill.id}><div><span>{skill.skillName}</span><strong>{level} / {skill.targetLevel || 3}</strong></div><div className="overview-progress" aria-label={`${skill.skillName}: level ${level} of target ${skill.targetLevel || 3}`}><span style={{ width: `${percent}%` }} /><i style={{ left: `${targetPercent}%` }} /></div></div>;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('officerCohortsTitle')}</CardTitle><CardDescription>Peer groups recommended from assessed learning gaps.</CardDescription></CardHeader>
          <CardContent>
            {capacityCohorts.length === 0 ? (
              <EmptyState title="No cohort recommendations" description="Cohorts will appear when assessment analysis returns a matching peer group."><Button variant="outline" size="sm" onClick={() => onNavigateTab('discover')}><BookOpen size={15} /> Browse courses</Button></EmptyState>
            ) : (
              <ul className="overview-cohort-list">{capacityCohorts.map((cohort) => <li key={cohort.id}><button type="button" onClick={() => onNavigateTab('discover')}><span className="overview-cohort-icon"><Users size={16} aria-hidden="true" /></span><span><strong>{cohort.name}</strong><small>{cohort.focusArea} · {cohort.officersCount} officers</small></span><ArrowRight size={15} aria-hidden="true" /></button></li>)}</ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="overview-section-heading">
          <div><CardTitle>{t('officerAssessmentsTitle')}</CardTitle><CardDescription>Stored assessment attempts and item-level remediation, when available.</CardDescription></div>
          <div className="overview-section-actions">{onOpenTelemetry && <Button variant="ghost" size="sm" onClick={onOpenTelemetry}><Terminal size={15} /> Inspect telemetry</Button>}{onOpenAcbpModal && <Button variant="outline" size="sm" onClick={onOpenAcbpModal}>Generate officer ACBP dossier</Button>}</div>
        </CardHeader>
        <CardContent className={assessmentHistory.length ? 'overview-table-shell' : undefined}>
          {assessmentHistory.length === 0 ? (
            <EmptyState title="No assessments recorded" description="Completed attempts will appear here. This prototype stores the history in this browser." />
          ) : (
            <table className="overview-table"><caption className="sr-only">Recent diagnostic assessments</caption><thead><tr><th scope="col">Assessment</th><th scope="col">Outcome</th><th scope="col">Score</th><th scope="col">Time</th><th scope="col">Date</th><th scope="col">Analysis</th></tr></thead><tbody>{assessmentHistory.map((exam) => { const gapCount = exam.misconceptions?.length ?? 0; return <tr key={exam.id}><th scope="row"><FileText size={15} aria-hidden="true" /><span>{exam.title}<small>{exam.category}</small></span></th><td><Badge variant={exam.status === 'passed' ? 'success' : exam.status === 'pending' ? 'neutral' : 'saffron'}>{exam.status === 'remedial' ? 'Remedial required' : exam.status}</Badge></td><td>{exam.score} / {exam.totalScore}</td><td><Clock size={13} aria-hidden="true" /> {exam.durationMinutes} min</td><td>{exam.date}</td><td>{gapCount > 0 ? <Button variant="ghost" size="sm" onClick={() => setSelectedExam(exam)}>Inspect {gapCount} {gapCount === 1 ? 'gap' : 'gaps'}</Button> : <span className="overview-no-gap"><CheckCircle2 size={14} /> No flagged gaps</span>}</td></tr>; })}</tbody></table>
          )}
        </CardContent>
      </Card>

      {selectedExam && (
        <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedExam(null)}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="misconception-title" className="diagnostic-dialog">
            <div className="diagnostic-dialog-header"><div><Badge variant="saffron">Cognitive misconception analysis</Badge><h2 id="misconception-title">{selectedExam.title}</h2><p>Item-level feedback returned for this assessment.</p></div><button type="button" onClick={() => setSelectedExam(null)} aria-label="Close misconception analysis"><X size={18} /></button></div>
            <div className="diagnostic-dialog-body">{selectedExam.misconceptions?.map((item, index) => <article key={`${item.question}-${index}`} className="misconception-card"><h3><span>{index + 1}</span>{item.question}</h3><dl><div><dt>Selected answer</dt><dd>{item.chosenAnswer}</dd></div><div><dt>Correct answer</dt><dd>{item.correctAnswer}</dd></div></dl><p><AlertTriangle size={15} aria-hidden="true" /><span><strong>Identified misconception</strong>{item.misconception}</span></p><div><span>Recommended: <strong>{item.remedialCourse}</strong></span><Button size="sm" onClick={() => { setSelectedExam(null); onNavigateTab('discover'); }}>Find course <ArrowRight size={14} /></Button></div></article>)}</div>
            <div className="diagnostic-dialog-footer"><Button variant="outline" onClick={() => setSelectedExam(null)}>Close inspector</Button></div>
          </div>
        </div>
      )}
    </section>
  );
}
