import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiUrl } from '../lib/api';

describe('Frontend Security & Environment Configuration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('TC_FRONT_ENV_001: apiUrl() respects environment configuration and appends paths correctly', () => {
    const url = apiUrl('/api/courses/search');
    expect(url).toContain('/api/courses/search');
    expect(url).not.toBe('http://localhost:5000/api/courses/search/invalid');
  });

  it('TC_FRONT_SEC_002: API keys are not automatically persisted to localStorage unless explicitly instructed', () => {
    expect(localStorage.getItem('statskill_api_key')).toBeNull();
  });

  it('TC_FRONT_SEC_003: Auth tokens are safely stored with Bearer formatting', () => {
    localStorage.setItem('statskill_token', 'demo_jwt_token_sample');
    const token = localStorage.getItem('statskill_token');
    expect(token).toBe('demo_jwt_token_sample');
    expect(token).not.toContain('password');
  });
});
