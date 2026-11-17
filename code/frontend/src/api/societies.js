/**
 * Societies API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient, unwrapPaginated } from './client';
import fallbackData from '../mocks/societies.json';

export async function getSocieties() {
  try {
    const { data, error } = await fetchClient('/api/societies/');
    if (data) {
      const list = unwrapPaginated(data);
      if (Array.isArray(list)) {
        return {
          data: list.map(soc => ({
            id: soc.id,
            name: soc.name || soc.society_name || 'Campus Society',
            description: soc.description || '',
            events: soc.events || [],
            ...soc,
          }))
        };
      }
    }
    if (error) {
      console.warn('Backend societies fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend societies endpoint unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

