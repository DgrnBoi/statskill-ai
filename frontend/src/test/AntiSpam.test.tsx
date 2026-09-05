import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, render, screen, fireEvent } from '@testing-library/react';
import { useAntiSpam, useDebounce } from '../hooks/useAntiSpam';
import Dashboard from '../pages/Dashboard';

describe('Anti-Spam Click Shield & Search Debounce Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, courses: [] }),
    }));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('TC_SPAM_001: allows normal clicks and calls guarded callback', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();

    const guarded = result.current.guardAction(mockAction);
    act(() => {
      guarded();
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(result.current.isLocked).toBe(false);
  });

  it('TC_SPAM_002: triggers 5s lockout when click spam threshold is exceeded', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();
    const guarded = result.current.guardAction(mockAction);

    act(() => {
      for (let i = 0; i < 6; i++) {
        guarded();
      }
    });

    expect(result.current.isLocked).toBe(true);
    expect(result.current.lockoutRemaining).toBe(5);
    expect(result.current.spamMessage).toContain('Spam click shield active');
  });

  it('TC_SPAM_003: blocks subsequent actions during active lockout', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();
    const guarded = result.current.guardAction(mockAction);

    act(() => {
      for (let i = 0; i < 6; i++) {
        guarded();
      }
    });

    const callCountBefore = mockAction.mock.calls.length;

    // Attempt click while locked
    act(() => {
      guarded();
    });

    expect(mockAction).toHaveBeenCalledTimes(callCountBefore);
    expect(result.current.isLocked).toBe(true);
  });

  it('TC_SPAM_004: counts down lockout timer and automatically unlocks after 5 seconds', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();
    const guarded = result.current.guardAction(mockAction);

    act(() => {
      for (let i = 0; i < 6; i++) {
        guarded();
      }
    });

    expect(result.current.isLocked).toBe(true);
    expect(result.current.lockoutRemaining).toBe(5);

    // Advance 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.lockoutRemaining).toBe(2);
    expect(result.current.isLocked).toBe(true);

    // Advance remaining 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.lockoutRemaining).toBe(0);
  });

  it('TC_SPAM_005: debounces search input by 300ms', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useDebounce(text, 300),
      { initialProps: { text: 'Sam' } }
    );

    expect(result.current).toBe('Sam');

    // Rapid keystroke changes
    rerender({ text: 'Sampl' });
    rerender({ text: 'Sampling' });

    expect(result.current).toBe('Sam');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('Sam');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('Sampling');
  });

  it('TC_SPAM_006: renders anti-spam banner and disables practice button on rapid click burst in Dashboard', async () => {
    render(<Dashboard activeTab="dashboard" />);

    const practiceBtn = screen.getByRole('button', { name: /Practice from Verified Question Bank/i });
    expect(practiceBtn).toBeDefined();
    expect(practiceBtn.hasAttribute('disabled')).toBe(false);

    // Spam click the practice button 6 times in rapid succession
    act(() => {
      for (let i = 0; i < 6; i++) {
        fireEvent.click(practiceBtn);
      }
    });

    // Banner is rendered with role="alert"
    const alerts = screen.getAllByRole('alert');
    const spamAlert = alerts.find(a => a.textContent?.includes('Spam Click Protection Active'));
    expect(spamAlert).toBeDefined();
    expect(spamAlert?.textContent).toContain('Rapid clicks were detected');

    // Practice button is now disabled
    expect(practiceBtn.hasAttribute('disabled')).toBe(true);
  });
});
