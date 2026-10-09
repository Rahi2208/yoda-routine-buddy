// Pomodoro timer that lives in the main process, so it keeps running
// while the pet is hidden (decision D11).
// Remaining time is computed from a fixed end time, not by counting
// ticks, so a delayed tick never makes the timer drift (decision D16).
const { EventEmitter } = require("node:events");

class PomodoroTimer extends EventEmitter {
  constructor({ focusMs, breakMs }) {
    super();
    this.durations = { focus: focusMs, break: breakMs };
    this.phase = "focus";
    this.status = "idle"; // "idle" | "running" | "paused"
    this.endsAt = 0;
    this.remainingMs = focusMs;
    this.interval = null;
  }

  getState() {
    return {
      phase: this.phase,
      status: this.status,
      remainingMs: this.status === "running" ? Math.max(0, this.endsAt - Date.now()) : this.remainingMs,
      durationMs: this.durations[this.phase],
    };
  }

  /** Starts a phase, or resumes the paused one when called without a phase. */
  start(phase) {
    if (phase && !(phase in this.durations)) return;

    if (phase || this.status === "idle") {
      this.phase = phase ?? this.phase;
      this.remainingMs = this.durations[this.phase];
    }

    this.status = "running";
    this.endsAt = Date.now() + this.remainingMs;
    this.#startTicking();
    this.#emitState();
  }

  pause() {
    if (this.status !== "running") return;
    this.remainingMs = Math.max(0, this.endsAt - Date.now());
    this.status = "paused";
    this.#stopTicking();
    this.#emitState();
  }

  reset() {
    this.#stopTicking();
    this.status = "idle";
    this.phase = "focus";
    this.remainingMs = this.durations.focus;
    this.#emitState();
  }

  #tick() {
    if (Date.now() < this.endsAt) {
      this.#emitState();
      return;
    }

    const finished = this.phase;
    this.#stopTicking();
    // Get the next phase ready: after focus comes a break, and vice versa.
    this.phase = finished === "focus" ? "break" : "focus";
    this.status = "idle";
    this.remainingMs = this.durations[this.phase];
    this.#emitState();
    this.emit("done", finished);
  }

  #startTicking() {
    this.#stopTicking();
    this.interval = setInterval(() => this.#tick(), 1000);
  }

  #stopTicking() {
    clearInterval(this.interval);
    this.interval = null;
  }

  #emitState() {
    this.emit("state", this.getState());
  }
}

module.exports = { PomodoroTimer };
