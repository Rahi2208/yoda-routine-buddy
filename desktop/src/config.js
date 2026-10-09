// Settings for the desktop app. Values can be overridden with environment
// variables when starting Electron, e.g. YODA_HEALTH_MINUTES=30 npm run dev
const path = require("node:path");
const { app } = require("electron");

const minutes = (value, fallback) => (Number(value) > 0 ? Number(value) : fallback) * 60 * 1000;

module.exports = {
  // Where the React app is loaded from:
  //   development: the Vite dev server
  //   packaged app / YODA_CLIENT=dist: the built files in client/dist
  devServerUrl: process.env.YODA_DEV_URL || "http://localhost:5173",
  useBuiltClient: app.isPackaged || process.env.YODA_CLIENT === "dist",
  builtClientIndex: app.isPackaged
    ? path.join(process.resourcesPath, "client", "index.html")
    : path.join(__dirname, "..", "..", "client", "dist", "index.html"),

  // Background jobs
  reminderPollMs: minutes(process.env.YODA_POLL_MINUTES, 1),
  healthReminderMs: minutes(process.env.YODA_HEALTH_MINUTES, 60),

  // Pomodoro lengths
  focusMs: minutes(process.env.YODA_FOCUS_MINUTES, 25),
  breakMs: minutes(process.env.YODA_BREAK_MINUTES, 5),

  // Pet window sizes (decision D17: small unless the bubble or timer is open)
  petCompact: { width: 150, height: 150 },
  petExpanded: { width: 300, height: 360 },
  petWindowTitle: "YODA Pet", // Hyprland window rules match this title

  iconPath: path.join(__dirname, "..", "assets", "icon.png"),
  trayIconPath: path.join(__dirname, "..", "assets", "tray.png"),
};
