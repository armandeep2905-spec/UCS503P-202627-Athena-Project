/**
 * Events API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient } from './client';
import fallbackData from '../mocks/events.json';

export async function getEvents() {
  try {
    const { data, error } = await fetchClient('/api/events/');
    if (data && (Array.isArray(data) || Array.isArray(data.results))) {
      return { data };
    }
    if (error) {
      console.warn('Backend events fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend events endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

