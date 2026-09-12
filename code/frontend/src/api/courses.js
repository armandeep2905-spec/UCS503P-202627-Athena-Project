/**
 * Courses API — mock.
 */
import data from '../mocks/courses.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getCourses() {
  await delay(500);
  return { data };
}
