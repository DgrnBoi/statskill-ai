import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { apiUrl } from './lib/api';

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

    const selectDirectorBtn = await screen.findByRole('button', { name: /Director \(ISS\).*DIID/i });
    fireEvent.click(selectDirectorBtn);
    await act(async () => {
      const continueBtn = await screen.findByRole('button', { name: /Continue as Director \(ISS\)/i });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => expect(stored.get('auth_token')).toBe('signed-demo-token'));
    expect(fetch).toHaveBeenCalledWith(apiUrl('/api/auth/demo-login'), expect.objectContaining({
      method: 'POST',
    }));
  });
});
