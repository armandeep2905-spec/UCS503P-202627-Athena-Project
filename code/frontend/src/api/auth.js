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
 * Send OTP to email for registration or password reset.
 * @param {string} email
 * @param {'register'|'reset_password'} purpose
 * @returns {Promise<{ data?: { message: string, dev_otp?: string }, error?: object }>}
 */
export async function sendOtp(email, purpose = 'register') {
  const normPurpose = purpose === 'registration' ? 'register' : (purpose === 'password_reset' ? 'reset_password' : purpose);
  return fetchClient('/api/auth/send-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, purpose: normPurpose }),
    skipAuth: true,
  });
}

/**
 * Register a new student account with verified email OTP.
 * @param {{ name: string, email: string, password: string, otp: string, institutionId?: number }} data
 * @returns {Promise<{ data?: { token: string, user: object }, error?: object }>}
 */
export async function register(data) {
  return fetchClient('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      otp: data.otp,
      institution_id: data.institutionId,
    }),
    skipAuth: true,
  });
}

/**
 * Reset user password with verified OTP.
 * @param {{ email: string, otp: string, newPassword: string }} data
 * @returns {Promise<{ data?: { message: string }, error?: object }>}
 */
export async function resetPassword({ email, otp, newPassword }) {
  return fetchClient('/api/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp,
      new_password: newPassword,
    }),
    skipAuth: true,
  });
}

/**
 * Get currently authenticated student profile.
 */
export async function getProfile() {
  return fetchClient('/api/auth/me/');
}

/**
 * Update authenticated student profile (name, rollNumber).
 * @param {{ name?: string, rollNumber?: string }} data
 */
export async function updateProfile(data) {
  return fetchClient('/api/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Verify student email against institution domain.
 * Strictly verifies that the email belongs to @thapar.edu or the institution's domain.
 */
export async function verifyEmail(email, institutionDomain) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const targetDomain = (institutionDomain || 'thapar.edu').toLowerCase();
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const isValid = emailDomain === targetDomain;

  if (isValid) {
    return { data: { verified: true, message: 'Email verified successfully.' } };
  }
  return {
    error: {
      status: 400,
      detail: `Email must belong to @${targetDomain}`,
    },
  };
}
