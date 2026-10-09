// Entry point of the desktop app: the "brain" (decision D11).
// Owns the windows, the pomodoro timer, the reminder jobs and the notifier.
const { app, BrowserWindow, ipcMain } = require("electron");
const config = require("./config");
const { createNotifier } = require("./notifier");
const { session } = require("./session");
const { createTray } = require("./tray");
const { createDeadlineReminder } = require("./engine/deadlineReminder");
const { createHealthReminder } = require("./engine/healthReminder");
const { PomodoroTimer } = require("./engine/timer");
const { createMainWindow } = require("./windows/mainWindow");
const { createPetWindow, setPetExpanded } = require("./windows/petWindow");

// Only one YODA at a time. Launching it again just reopens the window.
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let mainWindow = null;
let petWindow = null;
let tray = null;
let quitting = false;

const isPetVisible = () => Boolean(petWindow && !petWindow.isDestroyed() && petWindow.isVisible());
const { notify } = createNotifier(() => petWindow);
const timer = new PomodoroTimer({ focusMs: config.focusMs, breakMs: config.breakMs });

function sendToAll(channel, payload) {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) window.webContents.send(channel, payload);
  }
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) mainWindow = createMainWindow({ isQuitting: () => quitting });
  mainWindow.show();
  mainWindow.focus();
}

function showPet() {
  if (!petWindow || petWindow.isDestroyed()) {
    petWindow = createPetWindow();
    petWindow.on("show", onPetVisibilityChange);
    petWindow.on("hide", onPetVisibilityChange);
    return;
  }
  petWindow.showInactive();
}

function hidePet() {
  // hide(), not close(): the window and the app keep running (decision D13)
  petWindow?.hide();
}

function onPetVisibilityChange() {
  sendToAll("pet:visibility", isPetVisible());
  tray?.refresh();
}

function quit() {
  quitting = true;
  app.quit();
}

/** Only accept IPC messages from our own windows. */
function fromOurWindow(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  return window === mainWindow || window === petWindow;
}

function registerIpc() {
  ipcMain.on("session:set", (event, payload) => {
    if (!fromOurWindow(event)) return;
    const { token, apiUrl } = payload ?? {};
    if (typeof token !== "string" || !/^https?:\/\//.test(apiUrl ?? "")) return;
    session.set({ token, apiUrl });
  });
  ipcMain.on("session:clear", (event) => fromOurWindow(event) && session.clear());

  ipcMain.on("pet:show", (event) => fromOurWindow(event) && showPet());
  ipcMain.on("pet:hide", (event) => fromOurWindow(event) && hidePet());
  ipcMain.on("pet:set-expanded", (event, expanded) => {
    if (fromOurWindow(event) && isPetVisible()) setPetExpanded(petWindow, expanded === true);
  });
  ipcMain.handle("pet:get-visible", () => isPetVisible());

  ipcMain.on("timer:start", (event, phase) => {
    if (fromOurWindow(event)) timer.start(phase === "focus" || phase === "break" ? phase : undefined);
  });
  ipcMain.on("timer:pause", (event) => fromOurWindow(event) && timer.pause());
  ipcMain.on("timer:reset", (event) => fromOurWindow(event) && timer.reset());
  ipcMain.handle("timer:get-state", () => timer.getState());

  ipcMain.on("app:quit", (event) => fromOurWindow(event) && quit());
}

function startEngine() {
  timer.on("state", (state) => petWindow?.webContents.send("timer:state", state));
  timer.on("done", (phase) => {
    petWindow?.webContents.send("timer:done", phase); // chime plays in the pet window
    notify(
      phase === "focus" ? "Focus session done! Take a short break." : "Break's over. Ready to focus?",
      "timer",
    );
  });

  createDeadlineReminder({ session, notify, intervalMs: config.reminderPollMs }).start();
  createHealthReminder({ notify, intervalMs: config.healthReminderMs }).start();
}

app.on("second-instance", showMainWindow);

// Keep running in the background when every window is hidden or closed.
app.on("window-all-closed", () => {});
app.on("before-quit", () => {
  quitting = true;
});

app.whenReady().then(() => {
  registerIpc();
  showMainWindow();
  showPet();
  startEngine();
  tray = createTray({
    showMainWindow,
    togglePet: () => (isPetVisible() ? hidePet() : showPet()),
    isPetVisible,
    quit,
  });
});
