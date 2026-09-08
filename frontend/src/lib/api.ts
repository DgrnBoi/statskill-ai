/**
 * StatSkill AI - Centralized API Configuration & Fetch Client
 * Dynamically resolves API_BASE_URL from environment variables (VITE_API_BASE_URL).
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

/**
 * Helper to build full API endpoint URLs.
 * Example: apiUrl('/api/auth/users') => 'http://localhost:5000/api/auth/users'
 */
export function apiUrl(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

/**
 * Centralized fetch client wrapper for API calls.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = apiUrl(endpoint);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('statskill_jwt_token') : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
