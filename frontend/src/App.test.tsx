// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App login handoff', () => {
  it('stores the chosen demo identity before returning to the dashboard', () => {
    const stored = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value), clear: () => stored.clear() },
    });
    window.history.pushState({}, '', '/login');
    window.localStorage.clear();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Director \(ISS\).*DIID/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Director \(ISS\)/i }));

    expect(JSON.parse(stored.get('statskill_demo_login') ?? '{}')).toMatchObject({
      method: 'parichay-id',
      officer: { id: 'director' },
    });
  });
});
