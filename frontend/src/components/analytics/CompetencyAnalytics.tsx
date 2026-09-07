import type { Competency } from '../../pages/Dashboard';
import { Badge } from '../ui/Badge';
import { EmptyState, PageHeader } from '../ui/PageHeader';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

interface CompetencyAnalyticsProps {
  skills: Competency[];
  proficiency: Record<string, number>;
  assessmentsTaken: number;
  averageLevel: string;
  topGapSkill: string;
}

function pointFor(index: number, value: number, total: number, radius: number, center: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return `${center + Math.cos(angle) * radius * value},${center + Math.sin(angle) * radius * value}`;
}

function boundedLevel(value: number | undefined) {
  return Math.min(5, Math.max(0, Number.isFinite(value) ? value as number : 0));
}

export function CompetencyAnalytics({ skills, proficiency, assessmentsTaken, averageLevel, topGapSkill }: CompetencyAnalyticsProps) {
  const { t } = useUiPreferences();
  const center = 150;
  const radius = 105;
  const targetPoints = skills.map((skill, index) => pointFor(index, skill.targetLevel / 5, skills.length, radius, center)).join(' ');
  const actualPoints = skills.map((skill, index) => pointFor(index, boundedLevel(proficiency[skill.skillName]) / 5, skills.length, radius, center)).join(' ');
  const hasAssessment = assessmentsTaken > 0 || skills.some((skill) => boundedLevel(proficiency[skill.skillName]) > 0);

  return (
    <section aria-label="Competency analytics" className="space-y-5">
      <PageHeader
        title={t('analyticsTitle')}
        description={t('analyticsDescription')}
        actions={<Badge variant="neutral">{t('analyticsOfficerView')}</Badge>}
      />

      <div className="metric-strip" aria-label="Assessment summary">
        <div><span>{t('analyticsCompleted')}</span><strong>{assessmentsTaken}</strong></div>
        <div><span>{t('analyticsAverage')}</span><strong>{averageLevel}<small> / 5</small></strong></div>
        <div><span>{t('analyticsPriority')}</span><strong className="metric-strip-text">{topGapSkill}</strong></div>
      </div>

      {!hasAssessment ? (
        <EmptyState title={t('analyticsEmptyTitle')} description={t('analyticsEmptyDescription')} />
      ) : (
        <div className="analytics-layout">
          <figure className="competency-chart">
            <figcaption>
              <h2>Current level against cadre target</h2>
              <div><span className="legend legend--actual">Current</span><span className="legend legend--target">Target</span></div>
            </figcaption>
            <svg viewBox="0 0 300 300" role="img" aria-label="Radar chart comparing current and target competency levels">
              {[.2, .4, .6, .8, 1].map((scale) => (
                <polygon key={scale} points={skills.map((_, index) => pointFor(index, scale, skills.length, radius, center)).join(' ')} className="chart-grid" />
              ))}
              {skills.map((_, index) => {
                const point = pointFor(index, 1, skills.length, radius, center).split(',');
                return <line key={index} x1={center} y1={center} x2={point[0]} y2={point[1]} className="chart-axis" />;
              })}
              <polygon points={targetPoints} className="chart-target" />
              <polygon points={actualPoints} className="chart-actual" />
              {skills.map((skill, index) => {
                const level = boundedLevel(proficiency[skill.skillName]);
                const [cx, cy] = pointFor(index, level / 5, skills.length, radius, center).split(',');
                return <circle key={skill.id} cx={cx} cy={cy} r="4" className="chart-dot"><title>{skill.skillName}: level {level}</title></circle>;
              })}
            </svg>
          </figure>

          <div className="competency-table-wrap">
            <table className="competency-table">
              <caption className="sr-only">Current and target proficiency by competency</caption>
              <thead><tr><th scope="col">Competency</th><th scope="col">Current</th><th scope="col">Target</th><th scope="col">Gap</th></tr></thead>
              <tbody>
                {skills.map((skill) => {
                  const current = boundedLevel(proficiency[skill.skillName]);
                  const gap = Math.max(0, skill.targetLevel - current);
                  return <tr key={skill.id}><th scope="row"><span>{skill.skillName}</span><small>{skill.category}</small></th><td>{current}</td><td>{skill.targetLevel}</td><td><Badge variant={gap ? 'saffron' : 'success'}>{gap ? `${gap} level${gap === 1 ? '' : 's'}` : 'Met'}</Badge></td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
