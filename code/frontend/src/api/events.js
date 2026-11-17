/**
 * Events API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient, unwrapPaginated } from './client';
import fallbackData from '../mocks/events.json';

export async function getEvents() {
  try {
    const { data, error } = await fetchClient('/api/events/');
    if (data) {
      const list = unwrapPaginated(data);
      if (Array.isArray(list)) {
        return {
          data: list.map(evt => ({
            id: evt.id,
            title: evt.title || evt.event_name || 'Campus Event',
            date: evt.date || evt.event_date || '',
            venue: evt.venue || evt.location || 'Campus',
            description: evt.description || '',
            ...evt,
          }))
        };
      }
    }
    if (error) {
      console.warn('Backend events fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend events endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

