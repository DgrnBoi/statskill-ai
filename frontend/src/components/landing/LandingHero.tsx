import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

interface LandingHeroProps {
  onLaunchAssessment: () => void;
  onExploreCourses: () => void;
}

export function LandingHero({ onLaunchAssessment, onExploreCourses }: LandingHeroProps) {
  const { t } = useUiPreferences();
  return (
    <section id="hero" className="landing-hero">
      <div className="landing-container landing-hero-layout">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">{t('heroEyebrow')}</p>
          <h1>{t('heroTitle')}</h1>
          <p className="landing-hero-description">{t('heroDescription')}</p>
          <p className="landing-hero-context">{t('heroContext')}</p>
          <div className="landing-hero-actions">
            <Button onClick={onLaunchAssessment}>{t('startAssessment')} <ArrowRight size={16} aria-hidden="true" /></Button>
            <Button variant="outline" onClick={onExploreCourses}>{t('exploreCourses')}</Button>
          </div>
          <p className="landing-hero-note">JSO · SSO · Assistant Director · Director</p>
        </div>
        <aside className="landing-learning-path" aria-labelledby="learning-path-title">
          <div className="landing-path-heading"><p className="landing-eyebrow">{t('learningPath')}</p><h2 id="learning-path-title">{t('learningPathTitle')}</h2></div>
          <ol>
            <li><span className="landing-step-number">01</span><div><h3>{t('assessCompetencies')}</h3><p>{t('assessCompetenciesDescription')}</p></div></li>
            <li><span className="landing-step-number">02</span><div><h3>{t('findLearning')}</h3><p>{t('findLearningDescription')}</p></div></li>
            <li><span className="landing-step-number">03</span><div><h3>{t('seeProgress')}</h3><p>{t('seeProgressDescription')}</p></div></li>
          </ol>
          <div className="landing-path-footer">FRAC-aligned competencies <span aria-hidden="true">·</span> Mission Karmayogi</div>
        </aside>
      </div>
    </section>
  );
}
