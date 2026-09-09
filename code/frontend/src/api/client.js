/**
 * Base API client — shaped for Django REST Framework conventions.
 *
 * - Attaches `Authorization: Token <key>` header when token exists
 * - Returns `{ data, error }` tuples
 * - Normalizes DRF validation errors (`{ field: [msgs] }`)
 * - Handles DRF paginated list responses (`{ count, next, previous, results }`)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Get stored auth token.
 */
function getToken() {
  return localStorage.getItem('athena_token');
}

/**
 * Core fetch wrapper.
 * @param {string} endpoint — path like `/api/auth/login`
 * @param {RequestInit & { skipAuth?: boolean }} options
 * @returns {Promise<{ data?: any, error?: any }>}
 */
export async function fetchClient(endpoint, options = {}) {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Attach DRF Token auth header
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // No content
    if (response.status === 204) {
      return { data: null };
    }

    const body = await response.json().catch(() => null);

    if (response.ok) {
      return { data: body };
    }

    // 401 — clear token
    if (response.status === 401) {
      localStorage.removeItem('athena_token');
      localStorage.removeItem('athena_user');
      // Let calling code handle redirect
    }

    // DRF error shapes:
    //   400: { field_name: ["error"] }
    //   401/403/404: { detail: "..." }
    return {
      error: {
        status: response.status,
        ...(body || { detail: 'An unexpected error occurred.' }),
      },
    };
  } catch (err) {
    return {
      error: {
        status: 0,
        detail: 'Network error. Please check your connection.',
        _raw: err.message,
      },
    };
  }
}

/**
 * Unwrap a DRF paginated response → just the results array.
 * Pass-through if response isn't paginated.
 */
export function unwrapPaginated(data) {
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  return data;
}

/**
 * Flatten DRF field errors into a single message string.
 * e.g. { email: ["This field is required."], password: ["Too short."] }
 *   → "email: This field is required. password: Too short."
 */
export function flattenErrors(error) {
  if (!error) return 'Unknown error.';
  if (error.detail) return error.detail;

  return Object.entries(error)
    .filter(([key]) => key !== 'status' && key !== '_raw')
    .map(([field, messages]) => {
      const msgs = Array.isArray(messages) ? messages.join(' ') : messages;
      return `${field}: ${msgs}`;
    })
    .join(' ');
}
