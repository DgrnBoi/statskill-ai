// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

describe('App Routing and Browser History Navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('renders login route on /login and handles Back to Portal button click', async () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    // Login page should be displayed
    expect(screen.getByText(/MeriPehchan · Jan Parichay/i)).toBeDefined();
    expect(screen.getByText(/Sign in to your StatSkill workspace/i)).toBeDefined();

    // Click "Back to Portal"
    const backToPortalBtn = screen.getByRole('button', { name: /Back to StatSkill Portal/i });
    expect(backToPortalBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(backToPortalBtn);
    });

    // Should navigate back to Public Gateway Landing Page
    expect(screen.getAllByText(/StatSkill AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sovereign Capacity Building for India's Statistical Cadres/i)).toBeDefined();
  });

  it('updates route when popstate (browser back/forward) is triggered', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Initially on Public Gateway Landing Page
    expect(screen.getByText(/Sovereign Capacity Building for India's Statistical Cadres/i)).toBeDefined();

    // Trigger popstate to /login
    await act(async () => {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByText(/MeriPehchan · Jan Parichay/i)).toBeDefined();

    // Trigger popstate to /admin
    await act(async () => {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByText(/MoSPI Cadre Capacity & Readiness Command Center/i)).toBeDefined();
  });

  it('navigates from Landing Page to Assessment Engine when Launch Assessment CTA is clicked', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    const launchCta = screen.getByRole('button', { name: /Launch Diagnostic Assessment/i });
    
    await act(async () => {
      fireEvent.click(launchCta);
    });

    expect(window.location.pathname).toBe('/dashboard');
    expect(await screen.findByText(/Sovereign Edge-AI Assessment Generator/i)).toBeDefined();
  });

  it('navigates between Portal tabs and updates history when in portal view', async () => {
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    const discoverTab = screen.getByRole('button', { name: /Discover \(880\+ Catalog\)/i });
    
    await act(async () => {
      fireEvent.click(discoverTab);
    });

    expect(window.location.pathname).toBe('/discover');
    expect(await screen.findByText(/Government of India Course Discovery/i)).toBeDefined();
  });
});

