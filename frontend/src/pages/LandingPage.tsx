import React, { useState } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingHero } from '../components/landing/LandingHero';
import { NationalMetricsBar } from '../components/landing/NationalMetricsBar';
import { RuleToRoleAnalytics } from '../components/landing/RuleToRoleAnalytics';
import { ShowcasedCoursesCarousel } from '../components/landing/ShowcasedCoursesCarousel';
import { KarmayogiHubsOrbit } from '../components/landing/KarmayogiHubsOrbit';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingInfoModal, InfoModalType } from '../components/landing/LandingInfoModal';
import { SahayakLauncher } from '../components/ui/SahayakLauncher';

interface LandingPageProps {
  onLaunchAssessment: (courseTopic?: string) => void;
  onExploreCourses: () => void;
  onOpenDashboard: () => void;
  onOpenLogin: () => void;
  onOpenSecretAdmin: () => void;
  onOpenAccessibility: () => void;
  onOpenSahayak: () => void;
}

export function LandingPage({
  onLaunchAssessment,
  onExploreCourses,
  onOpenDashboard,
  onOpenLogin,
  onOpenSecretAdmin,
  onOpenAccessibility,
  onOpenSahayak,
}: LandingPageProps) {
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <LandingHeader
        onOpenLogin={onOpenLogin}
        onOpenSecretAdmin={onOpenSecretAdmin}
        onOpenAccessibility={onOpenAccessibility}
        onOpenInfo={(type) => setInfoModalType(type)}
        onLaunchPortal={() => onLaunchAssessment()}
      />

      <main id="main-content" className="flex-1">
        <LandingHero
          onLaunchAssessment={() => onLaunchAssessment()}
          onExploreCourses={onExploreCourses}
        />
        <NationalMetricsBar />
        <RuleToRoleAnalytics onOpenDashboard={onOpenDashboard} />
        <ShowcasedCoursesCarousel
          onSelectCourse={(title) => onLaunchAssessment(title)}
          onExploreAll={onExploreCourses}
        />
        <KarmayogiHubsOrbit onLaunchAssessment={() => onLaunchAssessment()} />
      </main>

      <LandingFooter onOpenInfo={(type) => setInfoModalType(type)} />
      <SahayakLauncher onOpen={onOpenSahayak} />

      <LandingInfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onLaunchPortal={() => {
          setInfoModalType(null);
          onLaunchAssessment();
        }}
      />
    </div>
  );
}

export default LandingPage;
