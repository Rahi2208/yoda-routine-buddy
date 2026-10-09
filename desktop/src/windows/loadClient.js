// Loads a route of the React app (e.g. "/" or "/pet") into a window,
// either from the Vite dev server or from the built files.
const config = require("../config");

function loadClient(window, route) {
  if (config.useBuiltClient) {
    return window.loadFile(config.builtClientIndex, { hash: route });
  }
  return window.loadURL(`${config.devServerUrl}/#${route}`);
}

/** Security: never navigate our windows to other sites or open popups. */
function lockDownNavigation(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    const allowed = config.useBuiltClient ? url.startsWith("file://") : url.startsWith(config.devServerUrl);
    if (!allowed) event.preventDefault();
  });
}

module.exports = { loadClient, lockDownNavigation };
