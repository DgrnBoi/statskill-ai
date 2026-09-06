import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Volume2 } from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';
import { Button } from '../ui/Button';
import { InfoModalType } from './LandingInfoModal';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

interface LandingHeaderProps {
  onOpenLogin: () => void;
  onOpenSecretAdmin: () => void;
  onOpenAccessibility: () => void;
  onOpenInfo: (type: InfoModalType) => void;
  onLaunchPortal: () => void;
}

const NAV_ITEMS: { labelKey: 'about' | 'newsroom' | 'career' | 'tenders' | 'notifications' | 'helpCentre'; modalKey: NonNullable<InfoModalType> }[] = [
  { labelKey: 'about', modalKey: 'about' },
  { labelKey: 'newsroom', modalKey: 'newsroom' },
  { labelKey: 'career', modalKey: 'career' },
  { labelKey: 'tenders', modalKey: 'tenders' },
  { labelKey: 'notifications', modalKey: 'notifications' },
  { labelKey: 'helpCentre', modalKey: 'help' },
];

export function LandingHeader({ onOpenLogin, onOpenSecretAdmin, onOpenAccessibility,
  onOpenInfo, onLaunchPortal }: LandingHeaderProps) {
  const { adjustFontScale, fontScale, t, toggleLanguage } = useUiPreferences();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (tapTimer.current) clearTimeout(tapTimer.current); }, []);

  const handleEmblemTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 700);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      onOpenSecretAdmin();
    }
  };

  const openInfo = (type: InfoModalType) => {
    setMobileOpen(false);
    onOpenInfo(type);
  };

  return (
    <header className="landing-header">
      <div className="landing-government-bar">
        <div className="landing-container landing-government-inner">
          <button type="button" onClick={handleEmblemTap} className="landing-government-identity" title="Government of India · Triple tap for admin gateway">
            <IndianFlag variant="flag" width={24} height={16} />
            <span><span lang="hi">भारत सरकार</span> <span aria-hidden="true">/</span> {t('governmentOfIndia')}</span>
          </button>
          <div className="landing-utility-actions">
            <button type="button" onClick={toggleLanguage} aria-label="Toggle language preference" className="!inline-flex">
              {t('languageToggle')}
            </button>
            <div className="landing-font-controls" role="group" aria-label={'Text size ' + Math.round(fontScale * 100) + ' percent'}>
              <button type="button" aria-label="Decrease text size" disabled={fontScale <= 0.9} onClick={() => adjustFontScale('decrease')}>A−</button>
              <button type="button" aria-label="Reset text size" onClick={() => adjustFontScale('reset')}>A</button>
              <button type="button" aria-label="Increase text size" disabled={fontScale >= 1.4} onClick={() => adjustFontScale('increase')}>A+</button>
            </div>
            <button type="button" onClick={onOpenAccessibility} aria-label="Open accessibility settings" title="Accessibility settings (Ctrl+U / Alt+A)"><Volume2 size={16} aria-hidden="true" /><span className="landing-utility-label">{t('accessibility')}</span></button>
          </div>
        </div>
      </div>
      <div className="landing-container landing-brand-row">
        <button type="button" onClick={handleEmblemTap} className="landing-brand" title="StatSkill AI · Triple tap for admin gateway">
          <span className="landing-brand-mark"><IndianFlag variant="circular" width={32} height={32} /></span>
          <span><strong>StatSkill AI</strong><span>Statistical capacity building · MoSPI</span></span>
        </button>
        <div className="landing-account-actions">
          <Button variant="ghost" size="sm" className="landing-register" onClick={onOpenLogin}>{t('register')}</Button>
          <Button variant="outline" size="sm" onClick={onOpenLogin}>{t('login')}</Button>
          <Button size="sm" className="landing-desktop-launch" onClick={onLaunchPortal}>{t('launchPortal')}</Button>
          <button ref={menuRef} type="button" className="landing-menu-toggle" onClick={() => setMobileOpen(value => !value)} aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="landing-primary-navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav id="landing-primary-navigation" className={'landing-primary-navigation' + (mobileOpen ? ' is-open' : '')} aria-label="Primary" onKeyDown={event => {
        if (event.key === 'Escape') { setMobileOpen(false); menuRef.current?.focus(); }
      }}>
        <div className="landing-container landing-nav-inner">
          <div className="landing-nav-items">{NAV_ITEMS.map(item => <button type="button" key={item.modalKey} onClick={() => openInfo(item.modalKey)}>{t(item.labelKey)}</button>)}</div>
          <span className="landing-nav-caption">Mission Karmayogi · NSSTA</span>
          <Button className="landing-mobile-launch" onClick={() => { setMobileOpen(false); onLaunchPortal(); }}>{t('launchPortal')}</Button>
        </div>
      </nav>
    </header>
  );
}
