import { z } from "zod";

const title = z.string().trim().min(1, "Title is required.").max(200, "Title is too long.");
const notes = z.string().trim().max(2000, "Notes are too long.");

// Deadlines come in as ISO strings, e.g. "2026-10-12T10:00:00.000Z".
const dueAt = z.iso
  .datetime({ offset: true, message: "Invalid date." })
  .transform((value) => new Date(value));

export const createItemSchema = z.object({
  title,
  notes: notes.optional().nullable(),
  dueAt: dueAt.optional().nullable(),
});

export const updateItemSchema = z
  .object({
    title: title.optional(),
    notes: notes.optional().nullable(),
    dueAt: dueAt.optional().nullable(),
    isDone: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Nothing to update." });

export const idParamSchema = z.object({
  id: z.string().min(1).max(64),
});
