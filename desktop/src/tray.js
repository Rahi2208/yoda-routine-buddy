// Tray icon so YODA can be reopened or quit while all windows are hidden.
// On Hyprland it appears only if your bar supports a tray (e.g. waybar's "tray" module).
const { Menu, Tray, nativeImage } = require("electron");
const config = require("./config");

function createTray({ showMainWindow, togglePet, isPetVisible, quit }) {
  let tray;
  try {
    tray = new Tray(nativeImage.createFromPath(config.trayIconPath));
  } catch (error) {
    console.warn("[YODA] tray not available:", error.message);
    return null;
  }

  const refresh = () => {
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: "Open YODA", click: showMainWindow },
        { label: isPetVisible() ? "Hide pet" : "Show pet", click: togglePet },
        { type: "separator" },
        { label: "Quit YODA", click: quit },
      ]),
    );
  };

  tray.setToolTip("YODA");
  tray.on("click", showMainWindow);
  refresh();
  return { refresh };
}

module.exports = { createTray };
