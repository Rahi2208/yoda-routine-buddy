// The logged-in session, sent here by the React app after login.
// Kept in memory only: on restart the React app sends it again
// from its own storage, so no token is written to disk by Electron.
const { EventEmitter } = require("node:events");

class Session extends EventEmitter {
  token = null;
  apiUrl = null;

  get isLoggedIn() {
    return Boolean(this.token && this.apiUrl);
  }

  set({ token, apiUrl }) {
    this.token = token;
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.emit("change", this);
  }

  clear() {
    this.token = null;
    this.apiUrl = null;
    this.emit("change", this);
  }
}

module.exports = { session: new Session() };
