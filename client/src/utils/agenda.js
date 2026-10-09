// Splits items into the agenda sections shown on the main page.
import { daysFromToday } from "./dates.js";

export const SECTIONS = [
  { key: "overdue", title: "Overdue" },
  { key: "today", title: "Today" },
  { key: "tomorrow", title: "Tomorrow" },
  { key: "week", title: "Next 7 days" },
  { key: "later", title: "Later" },
  { key: "someday", title: "No deadline" },
  { key: "done", title: "Done" },
];

function sectionFor(item, now) {
  if (item.isDone) return "done";
  if (!item.dueAt) return "someday";

  const due = new Date(item.dueAt);
  if (due < now) return "overdue";

  const days = daysFromToday(due, now);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days <= 7) return "week";
  return "later";
}

/** Returns [{ key, title, items }] for every section that has items. */
export function groupItems(items, now = new Date()) {
  const buckets = Object.fromEntries(SECTIONS.map((section) => [section.key, []]));
  for (const item of items) buckets[sectionFor(item, now)].push(item);

  const byDue = (a, b) => new Date(a.dueAt) - new Date(b.dueAt);
  for (const key of ["overdue", "today", "tomorrow", "week", "later"]) buckets[key].sort(byDue);
  buckets.done.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return SECTIONS.map((section) => ({ ...section, items: buckets[section.key] })).filter(
    (section) => section.items.length > 0,
  );
}
