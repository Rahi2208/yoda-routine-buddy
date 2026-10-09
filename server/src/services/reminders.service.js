// Deadline reminders that are due and have not been shown yet.
// The desktop app polls this every minute.
import { prisma } from "../lib/prisma.js";
import { notFound } from "../utils/AppError.js";

export function listDueReminders(userId, now = new Date()) {
  return prisma.reminder.findMany({
    where: {
      remindAt: { lte: now },
      seenAt: null,
      item: { userId, isDone: false, dueAt: { not: null } },
    },
    orderBy: { remindAt: "asc" },
    include: { item: { select: { id: true, title: true, dueAt: true } } },
  });
}

export async function markReminderSeen(userId, id) {
  const result = await prisma.reminder.updateMany({
    where: { id, item: { userId } },
    data: { seenAt: new Date() },
  });
  if (result.count === 0) throw notFound("REMINDER_NOT_FOUND", "Reminder not found.");
}
