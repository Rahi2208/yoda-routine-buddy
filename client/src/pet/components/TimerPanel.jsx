// Pomodoro controls shown when YODA is clicked once.
function formatClock(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function TimerPanel({ timer }) {
  const { state, start, pause, reset } = timer;
  const progress = 1 - state.remainingMs / state.durationMs;
  const label = state.phase === "focus" ? "Focus" : "Break";

  return (
    <div className={`timer timer--${state.phase}`} role="group" aria-label="Focus timer">
      <div className="timer__top">
        <span className="timer__phase">{label}</span>
        <span className="timer__clock" aria-live="off">
          {formatClock(state.remainingMs)}
        </span>
      </div>
      <div className="timer__bar">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="timer__actions">
        {state.status === "idle" && (
          <>
            <button type="button" onClick={() => start("focus")}>
              Focus 25
            </button>
            <button type="button" onClick={() => start("break")}>
              Break 5
            </button>
          </>
        )}
        {state.status === "running" && (
          <>
            <button type="button" onClick={pause}>
              Pause
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </>
        )}
        {state.status === "paused" && (
          <>
            <button type="button" onClick={() => start()}>
              Resume
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
