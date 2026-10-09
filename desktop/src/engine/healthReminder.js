// Simple interval-based break reminder (decision D15).
// The app can't tell whether you are really working, so it just nudges
// you every N minutes (60 by default) while it is running.
const MESSAGES = [
  "You've been at it for a while. Stand up and stretch!",
  "Water check! Grab a glass.",
  "Look at something far away for 20 seconds. Your eyes will thank you.",
  "Roll your shoulders and take three deep breaths.",
  "Quick break? A short walk resets your brain.",
];

function createHealthReminder({ notify, intervalMs }) {
  let interval = null;
  let index = 0;

  return {
    start() {
      interval = setInterval(() => {
        notify(MESSAGES[index % MESSAGES.length], "health");
        index += 1;
      }, intervalMs);
    },
    stop() {
      clearInterval(interval);
    },
  };
}

module.exports = { createHealthReminder };
