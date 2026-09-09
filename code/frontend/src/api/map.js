/**
 * Map / Locations API — mock.
 */
import data from '../mocks/buildings.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getLocations() {
  await delay(400);
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
  await delay(300);
  const building = data.results.find((b) => b.id === id);
  if (building) return { data: building };
  return { error: { status: 404, detail: 'Building not found.' } };
}
