/**
 * Reminders API — connected to Django backend.
 * Reminders are scoped specifically to the logged-in student account.
 */
import { fetchClient, unwrapPaginated } from './client';

/**
 * Get all reminders for the authenticated student.
 * @returns {Promise<{ data?: Array<object>, error?: object }>}
 */
export async function getReminders() {
  const res = await fetchClient('/api/reminders/');
  if (res.data) {
    return { data: unwrapPaginated(res.data) };
  }
  return res;
}

/**
 * Create a new reminder for the authenticated student.
 * @param {{ title: string, date: string, note?: string }} reminder
 * @returns {Promise<{ data?: object, error?: object }>}
 */
export async function createReminder(reminder) {
  return fetchClient('/api/reminders/', {
    method: 'POST',
    body: JSON.stringify({
      title: reminder.title,
      date: reminder.date || reminder.reminder_date,
      note: reminder.note || reminder.description,
    }),
  });
}

/**
 * Update an existing reminder.
 * @param {number|string} id
 * @param {object} updates
 * @returns {Promise<{ data?: object, error?: object }>}
 */
export async function updateReminder(id, updates) {
  return fetchClient(`/api/reminders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a reminder by ID.
 * @param {number|string} id
 * @returns {Promise<{ data?: null, error?: object }>}
 */
export async function deleteReminder(id) {
  return fetchClient(`/api/reminders/${id}/`, {
    method: 'DELETE',
  });
}
