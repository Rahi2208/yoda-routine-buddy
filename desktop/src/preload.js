// The safe bridge between Electron's main process and the React app.
// React sees only `window.yoda`, never Node.js or Electron itself.
const { contextBridge, ipcRenderer } = require("electron");

/** Returns a subscribe function: call it with a callback, get back an unsubscribe. */
const subscribe = (channel) => (callback) => {
  const listener = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld("yoda", {
  isDesktop: true,

  // Login session, so the main process can fetch deadline reminders
  setSession: (session) => ipcRenderer.send("session:set", session),
  clearSession: () => ipcRenderer.send("session:clear"),

  // Pet window
  showPet: () => ipcRenderer.send("pet:show"),
  hidePet: () => ipcRenderer.send("pet:hide"),
  setPetExpanded: (expanded) => ipcRenderer.send("pet:set-expanded", Boolean(expanded)),
  getPetVisible: () => ipcRenderer.invoke("pet:get-visible"),
  onPetVisibility: subscribe("pet:visibility"),

  // Pomodoro timer (runs in the main process)
  timer: {
    start: (phase) => ipcRenderer.send("timer:start", phase),
    pause: () => ipcRenderer.send("timer:pause"),
    reset: () => ipcRenderer.send("timer:reset"),
    getState: () => ipcRenderer.invoke("timer:get-state"),
    onState: subscribe("timer:state"),
  },

  // Speech bubble messages and timer chime
  onMessage: subscribe("pet:message"),
  onTimerDone: subscribe("timer:done"),

  quit: () => ipcRenderer.send("app:quit"),
});
