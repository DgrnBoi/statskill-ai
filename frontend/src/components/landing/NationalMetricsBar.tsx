import React from 'react';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

const METRIC_KEYS = [
  { value: 17228635, labelKey: 'metricsOnboarded' as const },
  { value: 6707, labelKey: 'metricsCourses' as const },
  { value: 152381557, labelKey: 'metricsCompletions' as const },
  { value: 1640920, labelKey: 'metricsActiveLearners' as const },
  { value: 212042, labelKey: 'metricsCertificates' as const },
];

export function NationalMetricsBar() {
  const { language, t } = useUiPreferences();
  const locale = language === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <section id="metrics" className="landing-metrics" aria-labelledby="national-metrics-title">
      <div className="landing-container">
        <div className="landing-metrics-heading">
          <h2 id="national-metrics-title">{t('metricsTitle')}</h2>
          <span className="landing-sample-label">{t('metricsSampleLabel')}</span>
        </div>
        <dl className="landing-metrics-grid">
          {METRIC_KEYS.map((metric) => (
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
