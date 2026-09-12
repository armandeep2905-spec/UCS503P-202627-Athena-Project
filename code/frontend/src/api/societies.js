/**
 * Societies API — mock.
 */
import data from '../mocks/societies.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getSocieties() {
  await delay(400);
  return { data };
}
