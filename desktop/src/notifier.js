// Decides where a message goes (decision D12):
//   pet visible -> speech bubble in the pet window
//   pet hidden  -> operating system notification
// The pet window keeps its own queue, so messages arriving at the same
// time are shown one after another (reminders first).
const { Notification } = require("electron");
const config = require("./config");

function createNotifier(getPetWindow) {
  function notify(text, kind = "info") {
    const pet = getPetWindow();

    if (pet && !pet.isDestroyed() && pet.isVisible()) {
      pet.webContents.send("pet:message", { text, kind });
      return;
    }

    if (Notification.isSupported()) {
      new Notification({ title: "YODA", body: text, icon: config.iconPath, silent: false }).show();
    } else {
      console.log(`[YODA] ${text}`);
    }
  }

  return { notify };
}

module.exports = { createNotifier };
