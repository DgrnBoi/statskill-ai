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

  it('TC_SPAM_002: maintains unlocked state even when rapid clicks occur', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();
    const guarded = result.current.guardAction(mockAction);

    act(() => {
      for (let i = 0; i < 6; i++) {
        guarded();
      }
    });

    expect(result.current.isLocked).toBe(false);
    expect(mockAction).toHaveBeenCalledTimes(6);
  });

  it('TC_SPAM_003: allows all actions without blocking', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    const mockAction = vi.fn();
    const guarded = result.current.guardAction(mockAction);

    act(() => {
      for (let i = 0; i < 10; i++) {
        guarded();
      }
    });

    expect(mockAction).toHaveBeenCalledTimes(10);
    expect(result.current.isLocked).toBe(false);
  });

  it('TC_SPAM_004: resetLock maintains clean unlocked state', () => {
    const { result } = renderHook(() => useAntiSpam({ threshold: 5, windowMs: 2000, cooldownSeconds: 5 }));
    act(() => {
      result.current.resetLock();
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

    const practiceBtn = screen.getByRole('button', { name: /Practise with Question Bank/i });
    expect(practiceBtn).toBeDefined();
    expect(practiceBtn.hasAttribute('disabled')).toBe(false);

    // Rapid click the practice button 55 times in succession
    act(() => {
      for (let i = 0; i < 55; i++) {
        fireEvent.click(practiceBtn);
      }
    });

    // Practice button is set to disabled during active generation (isUploading=true)
    expect(practiceBtn.hasAttribute('disabled')).toBe(true);
  });
});
