// Business logic for agenda items and their staged reminders.
import { prisma } from "../lib/prisma.js";
import { notFound } from "../utils/AppError.js";
import { buildReminderTimes } from "../utils/reminderTimes.js";

function reminderRows(dueAt) {
  return dueAt ? buildReminderTimes(dueAt).map((remindAt) => ({ remindAt })) : [];
}

async function findOwnItem(userId, id) {
  const item = await prisma.item.findFirst({ where: { id, userId } });
  if (!item) throw notFound("ITEM_NOT_FOUND", "Item not found.");
  return item;
}

export function listItems(userId) {
  return prisma.item.findMany({
    where: { userId },
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });
}

export function createItem(userId, { title, notes, dueAt }) {
  // Item and its reminders are created together in one transaction.
  return prisma.item.create({
    data: {
      userId,
      title,
      notes: notes || null,
      dueAt: dueAt ?? null,
      reminders: { create: reminderRows(dueAt) },
    },
  });
}

export async function updateItem(userId, id, changes) {
  const item = await findOwnItem(userId, id);

  const dueAtChanged =
    changes.dueAt !== undefined && (changes.dueAt?.getTime() ?? null) !== (item.dueAt?.getTime() ?? null);

  const data = {
    title: changes.title,
    notes: changes.notes === undefined ? undefined : changes.notes || null,
    dueAt: changes.dueAt,
    isDone: changes.isDone,
  };

  if (!dueAtChanged) {
    return prisma.item.update({ where: { id }, data });
  }

  // New deadline: drop reminders that were not shown yet and schedule new ones.
  const [, updated] = await prisma.$transaction([
    prisma.reminder.deleteMany({ where: { itemId: id, seenAt: null } }),
    prisma.item.update({
      where: { id },
      data: { ...data, reminders: { create: reminderRows(changes.dueAt) } },
    }),
  ]);
  return updated;
}

export async function deleteItem(userId, id) {
  await findOwnItem(userId, id);
  await prisma.item.delete({ where: { id } }); // reminders are removed by ON DELETE CASCADE
}
