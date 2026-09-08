import React, { useState, useEffect } from 'react';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';
import { apiUrl } from '../../lib/api';

const DEFAULT_METRICS = {
  onboarded: 14850,
  courses: 884,
  completions: 48200,
  activeLearners: 3450,
  certificates: 1240,
};

export function NationalMetricsBar() {
  const { language, t } = useUiPreferences();
  const locale = language === 'hi' ? 'hi-IN' : 'en-IN';

  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch(apiUrl('/api/admin/users-activity'));
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.activityRecords) && json.activityRecords.length > 0) {
            const records = json.activityRecords;
            const onboarded = DEFAULT_METRICS.onboarded + records.length;
            const activeLearners = DEFAULT_METRICS.activeLearners + (json.activeSessionsCount ?? records.filter((r: any) => r.status?.includes('Online')).length);
            const completions = DEFAULT_METRICS.completions + records.reduce((acc: number, r: any) => acc + (r.totalAssessments || 0), 0);
            const certificates = DEFAULT_METRICS.certificates + records.reduce((acc: number, r: any) => acc + (r.passedAssessments || 0), 0);
            const courses = DEFAULT_METRICS.courses + records.reduce((acc: number, r: any) => acc + (r.enrolledCoursesCount || 0), 0);

            if (isMounted) {
              setMetrics({ onboarded, courses, completions, activeLearners, certificates });
            }
          }
        }
      } catch {
        // Keep illustrative defaults on failure
      }
    };

    fetchMetrics();
    return () => { isMounted = false; };
  }, []);

  const metricItems = [
    { value: metrics.onboarded, labelKey: 'metricsOnboarded' as const },
    { value: metrics.courses, labelKey: 'metricsCourses' as const },
    { value: metrics.completions, labelKey: 'metricsCompletions' as const },
    { value: metrics.activeLearners, labelKey: 'metricsActiveLearners' as const },
    { value: metrics.certificates, labelKey: 'metricsCertificates' as const },
  ];

  return (
    <section id="metrics" className="landing-metrics" aria-labelledby="national-metrics-title">
      <div className="landing-container">
        <div className="landing-metrics-heading">
          <h2 id="national-metrics-title">{t('metricsTitle')}</h2>
          <span className="landing-sample-label">{t('metricsSampleLabel')}</span>
        </div>
        <dl className="landing-metrics-grid">
          {metricItems.map((metric) => (
            <div key={metric.labelKey}>
              <dt>{t(metric.labelKey)}</dt>
              <dd>{metric.value.toLocaleString(locale)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
