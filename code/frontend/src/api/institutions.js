/**
 * Institutions API — Live DRF endpoint with Thapar fallback.
 */
import { fetchClient } from './client';
import fallbackData from '../mocks/institutions.json';

export async function getInstitutions() {
  try {
    const { data, error } = await fetchClient('/api/institutions/');
    if (data) {
      return { data };
    }
    if (error) {
      console.warn('Backend institutions endpoint error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend institutions unreachable, using fallback:', err);
  }
  return { data: fallbackData };
}

export async function getInstitution(id) {
  try {
    const { data } = await fetchClient(`/api/institutions/${id}/`);
    if (data) return { data };
  } catch {}
  const institution = fallbackData.results.find((i) => i.id === Number(id));
  if (institution) return { data: institution };
  return { error: { status: 404, detail: 'Institution not found.' } };
}
