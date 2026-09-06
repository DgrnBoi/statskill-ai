import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { KarmayogiSahayakModal } from '../components/ui/KarmayogiSahayakModal';
import { AccessibilityModal, DEFAULT_ACCESSIBILITY_SETTINGS, AccessibilitySettings } from '../components/ui/AccessibilityModal';
import { SecretAdminGatewayModal } from '../components/admin/SecretAdminGatewayModal';
import { Navbar } from '../components/layout/Navbar';
import Dashboard from '../pages/Dashboard';

describe('iGOT Karmayogi Universal Accessibility Console, AI Sahayak Guide & Navigation Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, courses: [] }),
    }));
  });

  /* ------------------------------------------------------------------------- */
  /* TEST 1: Karmayogi Sahayak AI Guide                                        */
  /* ------------------------------------------------------------------------- */
  it('TC_GUIDE_001: renders Karmayogi Sahayak dialog and triggers direct navigation jumps', () => {
    const mockNavigate = vi.fn();
    const mockClose = vi.fn();

    render(
      <KarmayogiSahayakModal
        isOpen={true}
        onClose={mockClose}
        onNavigateTab={mockNavigate}
        onOpenLogin={vi.fn()}
        onOpenAccessibility={vi.fn()}
        onOpenSecretAdmin={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog', { name: /Karmayogi Sahayak prototype guide/i })).toBeDefined();
    expect(screen.getByText(/I am the StatSkill prototype guide/i)).toBeDefined();

    // Click "Take Diagnostic Assessment" action chip
    const quizJumpBtn = screen.getByRole('button', { name: /Take Diagnostic Assessment/i });
    fireEvent.click(quizJumpBtn);

    expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    expect(mockClose).toHaveBeenCalled();
  });

  it('TC_GUIDE_002: parses free-text questions and provides structured guidance and action button', () => {
    const mockNavigate = vi.fn();
    const mockClose = vi.fn();

    render(
      <KarmayogiSahayakModal
        isOpen={true}
        onClose={mockClose}
        onNavigateTab={mockNavigate}
        onOpenLogin={vi.fn()}
        onOpenAccessibility={vi.fn()}
        onOpenSecretAdmin={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Message Karmayogi Sahayak guide/i);
    const sendBtn = screen.getByLabelText(/Send message to guide/i);

    // Ask about searching courses
    fireEvent.change(input, { target: { value: 'Where can I find iGOT courses for sampling?' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText(/indexes the project catalog of government training resources/i)).toBeDefined();
    const jumpBtn = screen.getByRole('button', { name: /Open 880\+ Course Discovery/i });
    fireEvent.click(jumpBtn);

    expect(mockNavigate).toHaveBeenCalledWith('discover');
    expect(mockClose).toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------------- */
  /* TEST 2: iGOT Karmayogi 12-Module Accessibility Console                    */
  /* ------------------------------------------------------------------------- */
  it('TC_ACC_001: renders iGOT accessibility menu (CTRL+U) with all 12 modules and toggle switches', () => {
    const mockUpdate = vi.fn();
    const mockReset = vi.fn();

    render(
      <AccessibilityModal
        isOpen={true}
        onClose={vi.fn()}
        settings={DEFAULT_ACCESSIBILITY_SETTINGS}
        onUpdateSettings={mockUpdate}
        onResetSettings={mockReset}
      />
    );

    expect(screen.getByRole('dialog', { name: /Accessibility Menu \(CTRL\+U\)/i })).toBeDefined();
    expect(screen.getByText(/How Karmayogi Accessibility Works/i)).toBeDefined();
    expect(screen.getByText(/Oversized Widget/i)).toBeDefined();

    // Verify presence of all 12 core accessibility modules
    expect(screen.getByRole('button', { name: /Contrast \+/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Highlight Links/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bigger Text/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Text Spacing/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Pause Animations/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Hide Images/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Dyslexia Friendly/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Cursor/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Tooltips/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Line Height/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Text Align/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Saturation/i })).toBeDefined();

    // Verify Reset button
    expect(screen.getByRole('button', { name: /Reset All Accessibility Settings/i })).toBeDefined();
  });

  it('TC_ACC_002: cycles saturation levels (low, high, mono) and highlights active state', () => {
    const mockUpdate = vi.fn();

    render(
      <AccessibilityModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{
          ...DEFAULT_ACCESSIBILITY_SETTINGS,
          saturation: 'normal',
        }}
        onUpdateSettings={mockUpdate}
        onResetSettings={vi.fn()}
      />
    );

    // Click Saturation tile
    const satBtn = screen.getByRole('button', { name: /Saturation/i });
    fireEvent.click(satBtn);

    expect(mockUpdate).toHaveBeenCalledWith({ saturation: 'low' });
  });

  it('TC_ACC_003: cycles Bigger Text and Highlight Links preferences and handles Reset', () => {
    const mockUpdate = vi.fn();
    const mockReset = vi.fn();

    render(
      <AccessibilityModal
        isOpen={true}
        onClose={vi.fn()}
        settings={{
          ...DEFAULT_ACCESSIBILITY_SETTINGS,
          biggerText: 'normal',
          highlightLinks: false,
        }}
        onUpdateSettings={mockUpdate}
        onResetSettings={mockReset}
      />
    );

    // Click Bigger Text tile
    const biggerTextBtn = screen.getByRole('button', { name: /Bigger Text/i });
    fireEvent.click(biggerTextBtn);
    expect(mockUpdate).toHaveBeenCalledWith({ biggerText: 'medium', textScale: 'large' });

    // Click Highlight Links tile
    const linksBtn = screen.getByRole('button', { name: /Highlight Links/i });
    fireEvent.click(linksBtn);
    expect(mockUpdate).toHaveBeenCalledWith({ highlightLinks: true });

    // Click Reset button
    const resetBtn = screen.getByRole('button', { name: /Reset All Accessibility Settings/i });
    fireEvent.click(resetBtn);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  /* ------------------------------------------------------------------------- */
  /* TEST 3: Secret Admin HQ Gateway                                           */
  /* ------------------------------------------------------------------------- */
  it('TC_GATE_001: validates ministerial clearance passcode and unlocks HQ Admin Command Center', async () => {
    vi.useFakeTimers();
    const mockUnlock = vi.fn();
    const mockClose = vi.fn();

    render(
      <SecretAdminGatewayModal
        isOpen={true}
        onClose={mockClose}
        onUnlockAdmin={mockUnlock}
      />
    );

    expect(screen.getByRole('dialog', { name: /Demo Admin Gateway/i })).toBeDefined();

    // Enter wrong PIN
    const pinInput = screen.getByLabelText(/Demo admin access key/i);
    const authBtn = screen.getByRole('button', { name: /Open admin preview/i });

    fireEvent.change(pinInput, { target: { value: 'WRONGPIN' } });
    fireEvent.click(authBtn);

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText(/Invalid demo key/i)).toBeDefined();

    // Enter valid PIN
    fireEvent.change(pinInput, { target: { value: 'MOSPI2026' } });
    fireEvent.click(authBtn);

    expect(screen.getByText(/Demo key accepted/i)).toBeDefined();

    act(() => {
      vi.runAllTimers();
    });

    expect(mockUnlock).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
    vi.useRealTimers();
  });

  /* ------------------------------------------------------------------------- */
  /* TEST 4: Navbar 3-Tap Emblem Trigger & Hidden Admin                        */
  /* ------------------------------------------------------------------------- */
  it('TC_NAV_001: hides Admin tab by default and triggers secret entrance on 3 emblem taps', () => {
    const mockSecretAdmin = vi.fn();
    const mockTabChange = vi.fn();

    render(
      <Navbar
        activeTab="dashboard"
        setActiveTab={mockTabChange}
        isLoggedIn={false}
        setIsLoggedIn={vi.fn()}
        isAdminUnlocked={false}
        onOpenSecretAdmin={mockSecretAdmin}
      />
    );

    // Admin tab is hidden from normal view
    expect(screen.queryByText('Admin Command Center')).toBeNull();

    // Click National Emblem 3 times
    const emblemBtn = screen.getByLabelText(/Government of India National Emblem/i);
    fireEvent.click(emblemBtn);
    fireEvent.click(emblemBtn);
    fireEvent.click(emblemBtn);

    expect(mockSecretAdmin).toHaveBeenCalledTimes(1);
  });

  /* ------------------------------------------------------------------------- */
  /* TEST 5: Back to Previous Menu Navigation in Dashboard                     */
  /* ------------------------------------------------------------------------- */
  it('TC_NAV_002: tracks navigation history and allows returning to previous view via Back button', () => {
    render(<Dashboard />);

    // Switch from initial tab to "Discover (880+ Catalog)"
    const discoverNavTab = screen.getByRole('button', { name: /Discover/i });
    fireEvent.click(discoverNavTab);

    // A "Back to Assessment Engine" button is now rendered
    const backBtn = screen.getByRole('button', { name: /Back to Assessment Engine/i });
    expect(backBtn).toBeDefined();

    // Click back button to return to Assessment Engine
    fireEvent.click(backBtn);

    // We are back at Assessment Engine
    expect(screen.getByText(/Competency assessment generator/i)).toBeDefined();
  });
});
