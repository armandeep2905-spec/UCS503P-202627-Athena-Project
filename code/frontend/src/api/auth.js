/**
 * Auth API — real DRF endpoints.
 * These hit the actual Django backend, unlike other API modules which use mocks.
 */

import { fetchClient } from './client';

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data?: { token: string, user: object }, error?: object }>}
 */
export async function login(email, password) {
  return fetchClient('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

/**
 * Register a new student account.
 * @param {{ name: string, email: string, password: string, institutionId: number }} data
 * @returns {Promise<{ data?: { token: string, user: object }, error?: object }>}
 */
export async function register(data) {
  return fetchClient('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      institution_id: data.institutionId,
    }),
    skipAuth: true,
  });
}

/**
 * Verify student email against institution domain.
 * MOCK for now — checks if email ends with the institution's domain.
 * Will hit POST /api/auth/verify when backend is ready.
 */
export async function verifyEmail(email, institutionDomain) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const emailDomain = email.split('@')[1]?.toLowerCase();
  const isValid = emailDomain === institutionDomain?.toLowerCase();

  if (isValid) {
    return { data: { verified: true, message: 'Email verified successfully.' } };
  }
  return {
    error: {
      status: 400,
      detail: `Email must belong to @${institutionDomain}`,
    },
  };
}
