/**
 * Reminders API — mock.
 */
import data from '../mocks/reminders.json';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Keep a mutable copy so new reminders persist during session
let reminders = [...data.results];
let nextId = reminders.length + 1;

export async function getReminders() {
  await delay(400);
  return {
    data: {
      count: reminders.length,
      next: null,
      previous: null,
      results: [...reminders],
    },
  };
}

export async function createReminder(reminder) {
  await delay(300);
  const newReminder = {
    id: nextId++,
    studentId: 1,
    ...reminder,
  };
  reminders = [newReminder, ...reminders];
  return { data: newReminder };
}
