import * as remindersService from "../services/reminders.service.js";

export async function listDue(req, res) {
  res.json({ reminders: await remindersService.listDueReminders(req.user.id) });
}

export async function markSeen(req, res) {
  await remindersService.markReminderSeen(req.user.id, req.validated.params.id);
  res.status(204).end();
}
