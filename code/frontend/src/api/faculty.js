/**
 * Faculty API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient } from './client';
import fallbackData from '../mocks/faculty.json';

export async function getFaculty() {
  try {
    const { data, error } = await fetchClient('/api/faculty/');
    if (data && (Array.isArray(data) || Array.isArray(data.results))) {
      return { data };
    }
    if (error) {
      console.warn('Backend faculty fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend faculty endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

