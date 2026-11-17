/**
 * Map / Locations API — Live DRF endpoint connected to PostgreSQL with fallback.
 */
import { fetchClient } from './client';
import data from '../mocks/buildings.json';

export async function getLocations() {
  try {
    const { data: resData, error } = await fetchClient('/api/map/locations/');
    if (resData && (Array.isArray(resData) || Array.isArray(resData.results))) {
      const results = Array.isArray(resData) ? resData : resData.results;
      return {
        data: {
          count: results.length,
          next: null,
          previous: null,
          results,
        },
      };
    }
    if (error) {
      console.warn('Backend map locations fetch error, using fallback:', error);
    }
  } catch (err) {
    console.warn('Backend map locations endpoint unreachable, using fallback:', err);
  }
  return {
    data: {
      count: data.results.length,
      next: null,
      previous: null,
      results: data.results,
    },
  };
}

export async function getLocation(id) {
  try {
    const { data: resData, error } = await fetchClient(`/api/map/locations/${id}/`);
    if (resData && !error) {
      return { data: resData };
    }
  } catch (err) {
    console.warn('Backend map location detail unreachable, using fallback:', err);
  }
  const building = data.results.find((b) => b.id === id);
  if (building) return { data: building };
  return { error: { status: 404, detail: 'Building not found.' } };
}

