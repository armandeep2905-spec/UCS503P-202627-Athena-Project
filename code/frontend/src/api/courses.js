/**
 * Courses API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient } from './client';
import fallbackData from '../mocks/courses.json';

export async function getCourses() {
  try {
    const { data, error } = await fetchClient('/api/courses/');
    if (data && (Array.isArray(data) || Array.isArray(data.results))) {
      return { data };
    }
    if (error) {
      console.warn('Backend courses fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend courses endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}
