/**
 * Events API — mock.
 */
import data from '../mocks/events.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getEvents() {
  await delay(400);
  return { data };
}
