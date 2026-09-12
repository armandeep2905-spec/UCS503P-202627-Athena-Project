/**
 * Faculty API — mock.
 */
import data from '../mocks/faculty.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getFaculty() {
  await delay(450);
  return { data };
}
