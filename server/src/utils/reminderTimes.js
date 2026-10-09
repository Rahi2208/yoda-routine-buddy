// Staged deadline reminders: 3 days, 1 day and 3 hours before the deadline.
const HOUR = 60 * 60 * 1000;
export const REMINDER_OFFSETS = [72 * HOUR, 24 * HOUR, 3 * HOUR];

/**
 * Returns the reminder times for a deadline, skipping any that are
 * already in the past (no point reminding "3 days before" if the
 * deadline is tomorrow).
 */
export function buildReminderTimes(dueAt, now = new Date()) {
  return REMINDER_OFFSETS.map((offset) => new Date(dueAt.getTime() - offset)).filter((time) => time > now);
}
