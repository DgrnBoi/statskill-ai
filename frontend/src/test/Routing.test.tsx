// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';

describe('App Routing and Browser History Navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('statskill_onboarding_complete', 'true');
    document.documentElement.lang = '';
    document.documentElement.style.fontSize = '';
  });

  afterEach(() => {
    document.documentElement.lang = '';
    document.documentElement.style.fontSize = '';
  });

  it('switches the public gateway interface to Hindi and updates the document language', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Toggle language preference|भाषा वरीयता बदलें/i }));

    expect(document.documentElement.lang).toBe('hi');
    expect(screen.getByRole('heading', { name: /अपनी भूमिका के लिए आवश्यक कौशल विकसित करें/i })).toBeDefined();
  });

  it('applies the landing text-size control to the complete application root', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Increase text size/i }));

    expect(document.documentElement.style.fontSize).toBe('110%');
  });

  it('provides the Sahayak dialog launcher as a bottom-right floating control', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    const launcher = screen.getByRole('complementary', { name: /Karmayogi Sahayak quick launch/i });
    expect(launcher.querySelector('button[aria-haspopup="dialog"]')).not.toBeNull();
  });

  it('renders login route on /login and handles Back to Portal button click', async () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    // Login page should be displayed
    expect(await screen.findByText(/MeriPehchan · Jan Parichay/i)).toBeDefined();
    expect(screen.getByText(/Access your statistical learning workspace/i)).toBeDefined();

    // Click "Back to Portal"
    const backToPortalBtn = screen.getByRole('button', { name: /Back to portal|पोर्टल पर वापस/i });
    expect(backToPortalBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(backToPortalBtn);
    });

    // Should navigate back to Public Gateway Landing Page
    expect(screen.getAllByText(/StatSkill AI/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Build the skills your role calls for/i })).toBeDefined();
  });

  it('updates route when popstate (browser back/forward) is triggered', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Initially on Public Gateway Landing Page
    expect(screen.getByRole('heading', { name: /Build the skills your role calls for/i })).toBeDefined();

    // Trigger popstate to /login
    await act(async () => {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByText(/MeriPehchan · Jan Parichay/i)).toBeDefined();

    // Direct admin route opens HQ Admin Command Center
    await act(async () => {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByText(/MoSPI Cadre Capacity & Officer Telemetry Control Center/i)).toBeDefined();
    expect(window.location.pathname).toBe('/admin');
  });

  it('navigates from Landing Page to Assessment Engine when Launch Assessment CTA is clicked', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    const launchCta = screen.getByRole('button', { name: /Start an assessment|आकलन शुरू करें/i });
    
    await act(async () => {
      fireEvent.click(launchCta);
    });

    expect(window.location.pathname).toBe('/dashboard');
    expect(await screen.findByRole('heading', { name: /Competency assessment generator|दक्षता आकलन जनरेटर/i }, { timeout: 3000 })).toBeDefined();
  });

  it('navigates between Portal tabs and updates history when in portal view', async () => {
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    const discoverTab = await screen.findByRole('button', { name: /Discover \(880\+ Catalog\)/i });
    
    await act(async () => {
      fireEvent.click(discoverTab);
    });

    expect(window.location.pathname).toBe('/discover');
    expect(await screen.findByText(/Government of India Course Discovery/i)).toBeDefined();
  });
});

