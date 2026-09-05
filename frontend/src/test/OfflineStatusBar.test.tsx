import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OfflineStatusBar } from '../components/ui/OfflineStatusBar';

describe('OfflineStatusBar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders nothing by default when navigator is online and no install prompt is present', () => {
    const { container } = render(<OfflineStatusBar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders offline alert when offline event is dispatched', () => {
    render(<OfflineStatusBar />);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.getByRole('complementary', { name: /Network Status Alert/i })).toBeDefined();
    expect(screen.getByText(/Offline Field Mode Active/i)).toBeDefined();
  });

  it('allows user to dismiss offline alert', () => {
    render(<OfflineStatusBar />);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    const dismissBtn = screen.getByRole('button', { name: /Dismiss offline alert/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText(/Offline Field Mode Active/i)).toBeNull();
  });

  it('shows connection restored alert on reconnection', () => {
    render(<OfflineStatusBar />);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.getByRole('complementary', { name: /Connection Restored Alert/i })).toBeDefined();
    expect(screen.getByText(/Connection Restored/i)).toBeDefined();

    // Auto-dismisses after 4000ms
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText(/Connection Restored/i)).toBeNull();
  });

  it('renders PWA install banner on beforeinstallprompt event', () => {
    render(<OfflineStatusBar />);

    const promptEvent = new Event('beforeinstallprompt');
    Object.assign(promptEvent, {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    act(() => {
      window.dispatchEvent(promptEvent);
    });

    expect(screen.getByRole('complementary', { name: /Install PWA Prompt/i })).toBeDefined();
    expect(screen.getByText(/Install App/i)).toBeDefined();
  });
});
