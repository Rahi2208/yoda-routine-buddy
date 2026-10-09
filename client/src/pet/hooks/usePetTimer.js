// Pomodoro timer state for the pet.
// In the desktop app the real timer lives in Electron's main process
// (decision D11) and we only display it. In a plain browser (for quick
// UI testing at /#/pet) a small local timer stands in for it.
import { useCallback, useEffect, useRef, useState } from "react";
import { desktop, isDesktop } from "../../desktop/bridge.js";

export const DURATIONS = { focus: 25 * 60 * 1000, break: 5 * 60 * 1000 };

const IDLE = { phase: "focus", status: "idle", remainingMs: DURATIONS.focus, durationMs: DURATIONS.focus };

export function usePetTimer(onLocalDone) {
  const [state, setState] = useState(IDLE);
  const local = useRef({ endsAt: 0, interval: null, state: IDLE });

  // Desktop: subscribe to the main process.
  useEffect(() => {
    if (!isDesktop) return undefined;
    desktop.timer.getState().then((initial) => initial && setState(initial));
    return desktop.timer.onState(setState);
  }, []);

  // Browser fallback ------------------------------------------------------
  const setLocal = useCallback((next) => {
    local.current.state = next;
    setState(next);
  }, []);

  const tick = useCallback(() => {
    // Remaining time comes from the clock, not from counting ticks (D16).
    const remainingMs = Math.max(0, local.current.endsAt - Date.now());
    if (remainingMs === 0) {
      clearInterval(local.current.interval);
      const finished = local.current.state.phase;
      setLocal({
        ...IDLE,
        phase: finished,
        remainingMs: DURATIONS[finished],
        durationMs: DURATIONS[finished],
      });
      onLocalDone?.(finished);
      return;
    }
    setLocal({ ...local.current.state, status: "running", remainingMs });
  }, [onLocalDone, setLocal]);

  useEffect(() => () => clearInterval(local.current.interval), []);

  const start = useCallback(
    (phase) => {
      if (isDesktop) return desktop.timer.start(phase);
      const current = local.current.state;
      const resume = !phase && current.status === "paused";
      const nextPhase = phase ?? current.phase;
      const remaining = resume ? current.remainingMs : DURATIONS[nextPhase];
      local.current.endsAt = Date.now() + remaining;
      setLocal({
        phase: nextPhase,
        status: "running",
        remainingMs: remaining,
        durationMs: DURATIONS[nextPhase],
      });
      clearInterval(local.current.interval);
      local.current.interval = setInterval(tick, 500);
    },
    [setLocal, tick],
  );

  const pause = useCallback(() => {
    if (isDesktop) return desktop.timer.pause();
    clearInterval(local.current.interval);
    setLocal({ ...local.current.state, status: "paused", remainingMs: local.current.endsAt - Date.now() });
  }, [setLocal]);

  const reset = useCallback(() => {
    if (isDesktop) return desktop.timer.reset();
    clearInterval(local.current.interval);
    setLocal(IDLE);
  }, [setLocal]);

  return { state, start, pause, reset };
}
