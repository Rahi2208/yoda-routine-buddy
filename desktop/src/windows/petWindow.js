// The transparent, frameless window where YODA lives on the desktop.
const path = require("node:path");
const { BrowserWindow, screen } = require("electron");
const config = require("../config");
const { loadClient, lockDownNavigation } = require("./loadClient");

function createPetWindow() {
  const { width, height } = config.petCompact;
  const area = screen.getPrimaryDisplay().workArea;

  const window = new BrowserWindow({
    width,
    height,
    // Bottom-right corner. (On Wayland the compositor decides the position;
    // use a Hyprland window rule instead, see README.)
    x: area.x + area.width - width - 24,
    y: area.y + area.height - height - 24,
    title: config.petWindowTitle,
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    hasShadow: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      // Keep timers and sound working even while the pet is hidden.
      backgroundThrottling: false,
    },
  });

  // Keep the title fixed (the page would otherwise rename it to "YODA"),
  // so Hyprland window rules can match it.
  window.on("page-title-updated", (event) => event.preventDefault());
  window.setAlwaysOnTop(true, "floating");
  window.setVisibleOnAllWorkspaces(true);
  lockDownNavigation(window);

  window.once("ready-to-show", () => window.showInactive());
  loadClient(window, "/pet");
  return window;
}

/**
 * Grows or shrinks the pet window while keeping YODA (bottom-centre)
 * in the same place on screen.
 */
function setPetExpanded(window, expanded) {
  const target = expanded ? config.petExpanded : config.petCompact;
  const current = window.getBounds();
  if (current.width === target.width && current.height === target.height) return;

  window.setResizable(true);
  window.setBounds({
    x: Math.round(current.x + current.width / 2 - target.width / 2),
    y: current.y + current.height - target.height,
    width: target.width,
    height: target.height,
  });
  window.setResizable(false);
}

module.exports = { createPetWindow, setPetExpanded };
