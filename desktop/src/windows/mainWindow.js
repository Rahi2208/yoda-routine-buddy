// The normal app window: login and the agenda.
// Closing it only hides it, so the pet and reminders keep running.
const path = require("node:path");
const { BrowserWindow } = require("electron");
const config = require("../config");
const { loadClient, lockDownNavigation } = require("./loadClient");

function createMainWindow({ isQuitting }) {
  const window = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 380,
    minHeight: 500,
    title: "YODA",
    icon: config.iconPath,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  lockDownNavigation(window);
  window.once("ready-to-show", () => window.show());

  window.on("close", (event) => {
    if (!isQuitting()) {
      event.preventDefault();
      window.hide();
    }
  });

  loadClient(window, "/");
  return window;
}

module.exports = { createMainWindow };
