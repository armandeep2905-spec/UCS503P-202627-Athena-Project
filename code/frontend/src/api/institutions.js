/**
 * Institutions API — mock.
 */
import data from '../mocks/institutions.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getInstitutions() {
  await delay(400);
  return { data };
}

export async function getInstitution(id) {
  await delay(300);
  const institution = data.results.find((i) => i.id === id);
  if (institution) return { data: institution };
  return { error: { status: 404, detail: 'Institution not found.' } };
}
