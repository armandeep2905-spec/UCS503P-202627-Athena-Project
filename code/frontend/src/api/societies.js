/**
 * Societies API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient } from './client';
import fallbackData from '../mocks/societies.json';

export async function getSocieties() {
  try {
    const { data, error } = await fetchClient('/api/societies/');
    if (data && (Array.isArray(data) || Array.isArray(data.results))) {
      return { data };
    }
    if (error) {
      console.warn('Backend societies fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend societies endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

