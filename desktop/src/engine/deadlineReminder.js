// Asks the API every minute for deadline reminders that are due,
// shows them through the notifier, then marks them as seen.
const HOUR = 60 * 60 * 1000;

// Rounded, not floored: a "3 hours before" reminder is checked a few seconds
// late (2h 59m left) and should still say "3 hours".
function timeLeft(dueAt, now = Date.now()) {
  const ms = new Date(dueAt).getTime() - now;
  if (ms <= 0) return "is due now";
  if (ms < 55 * 60 * 1000) {
    const minutes = Math.max(1, Math.round(ms / 60000));
    return `is due in ${minutes} min`;
  }

  const hours = Math.round(ms / HOUR);
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    return `is due in ${days} ${days === 1 ? "day" : "days"}`;
  }
  return `is due in ${hours} ${hours === 1 ? "hour" : "hours"}`;
}

function createDeadlineReminder({ session, notify, intervalMs }) {
  let interval = null;
  let running = false;

  async function api(method, path) {
    const response = await fetch(`${session.apiUrl}${path}`, {
      method,
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (response.status === 401) {
      session.clear(); // token expired: stop polling until the user logs in again
      return null;
    }
    if (!response.ok) throw new Error(`API ${method} ${path} failed with ${response.status}`);
    return response.status === 204 ? null : response.json();
  }

  async function poll() {
    if (running || !session.isLoggedIn) return;
    running = true;

    try {
      const data = await api("GET", "/api/reminders/due");
      if (!data) return;

      // If the app was closed for a while, several reminders for the same
      // item may be due at once. Show one message per item, mark all seen.
      const byItem = new Map();
      for (const reminder of data.reminders) {
        const list = byItem.get(reminder.item.id) ?? [];
        list.push(reminder);
        byItem.set(reminder.item.id, list);
      }

      for (const reminders of byItem.values()) {
        const { item } = reminders[0];
        notify(`Heads up! "${item.title}" ${timeLeft(item.dueAt)}.`, "reminder");
        for (const reminder of reminders) {
          await api("PATCH", `/api/reminders/${reminder.id}/seen`);
        }
      }
    } catch (error) {
      // Offline or server down: try again on the next tick.
      console.warn("[YODA] reminder check failed:", error.message);
    } finally {
      running = false;
    }
  }

  return {
    start() {
      session.on("change", poll); // check right after login
      interval = setInterval(poll, intervalMs);
      poll();
    },
    stop() {
      clearInterval(interval);
      session.off("change", poll);
    },
  };
}

module.exports = { createDeadlineReminder, timeLeft };
