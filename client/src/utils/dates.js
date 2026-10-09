// Date helpers. All grouping uses the user's local time zone.
const DAY = 24 * 60 * 60 * 1000;

export function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Whole calendar days between today and the given date (0 = today, 1 = tomorrow). */
export function daysFromToday(date, now = new Date()) {
  return Math.round((startOfDay(date) - startOfDay(now)) / DAY);
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const dateFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Short, human label for a deadline, e.g. "14:30", "Tomorrow 09:00", "Wed 14:30", "2 hours ago". */
export function formatDue(dueAt, now = new Date()) {
  const date = new Date(dueAt);
  const days = daysFromToday(date, now);
  const time = timeFormat.format(date);

  if (date < now) {
    const hoursLate = Math.round((now - date) / (60 * 60 * 1000));
    if (hoursLate < 1) return "Just now";
    if (hoursLate < 24) return relative.format(-hoursLate, "hour");
    return relative.format(-Math.round(hoursLate / 24), "day");
  }
  if (days === 0) return time;
  if (days === 1) return `Tomorrow ${time}`;
  if (days < 7) return `${weekdayFormat.format(date)} ${time}`;
  return dateFormat.format(date);
}

/** Value for <input type="datetime-local"> from an ISO date (local time). */
export function toLocalInputValue(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date - offsetMs).toISOString().slice(0, 16);
}

/** ISO string from an <input type="datetime-local"> value, or null if empty. */
export function fromLocalInputValue(value) {
  return value ? new Date(value).toISOString() : null;
}
