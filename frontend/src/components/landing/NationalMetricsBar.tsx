import React from 'react';

const METRICS = [
  { value: 17228635, label: 'Karmayogis onboarded' },
  { value: 6707, label: 'Courses catalogued' },
  { value: 152381557, label: 'Learning completions' },
  { value: 1640920, label: 'Monthly active learners' },
  { value: 212042, label: 'Certificates issued in a day' },
];

export function NationalMetricsBar() {
  return (
    <section id="metrics" className="landing-metrics" aria-labelledby="national-metrics-title">
      <div className="landing-container">
        <div className="landing-metrics-heading"><h2 id="national-metrics-title">National learning at a glance</h2><span className="landing-sample-label">Illustrative data · Not live statistics</span></div>
        <dl className="landing-metrics-grid">
          {METRICS.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value.toLocaleString('en-IN')}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}
