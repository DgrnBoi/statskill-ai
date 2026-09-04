// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App login handoff', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('stores the server-issued JWT before returning to the dashboard', async () => {
    const stored = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value), clear: () => stored.clear() },
    });
    window.history.pushState({}, '', '/login');
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: 'signed-demo-token' }) }));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Director \(ISS\).*DIID/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Director \(ISS\)/i }));

    await waitFor(() => expect(stored.get('auth_token')).toBe('signed-demo-token'));
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/demo-login', expect.objectContaining({
      method: 'POST',
    }));
  });
});
