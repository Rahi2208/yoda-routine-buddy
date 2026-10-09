// The desktop pet window ("the face"). It only displays things:
// timers and reminders are driven by Electron's main process ("the brain").
//
//   hover        -> happy animation
//   single click -> open/close the pomodoro panel
//   double click -> random affirmation in the speech bubble
//   X button     -> hide the pet (messages then become OS notifications)
import { useCallback, useEffect, useRef, useState } from "react";
import { desktop, isDesktop } from "../desktop/bridge.js";
import { useClickOrDoubleClick } from "../hooks/useClickOrDoubleClick.js";
import Bubble from "./components/Bubble.jsx";
import CloseButton from "./components/CloseButton.jsx";
import Pet from "./components/Pet.jsx";
import TimerPanel from "./components/TimerPanel.jsx";
import { randomAffirmation } from "./data/affirmations.js";
import { usePetTimer } from "./hooks/usePetTimer.js";
import "./pet.css";
import { playChime } from "./utils/sound.js";

// Lower number = shown first. Reminders jump ahead of affirmations.
const PRIORITY = { reminder: 0, timer: 1, health: 2, affirmation: 3 };
const DURATION_MS = { reminder: 10000, timer: 8000, health: 8000, affirmation: 5000 };

let nextId = 1;

export default function PetPage() {
  const [hovered, setHovered] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const lastAffirmation = useRef(null);

  // Transparent page background so only YODA is visible on the desktop.
  useEffect(() => {
    document.documentElement.classList.add("pet-window");
    return () => document.documentElement.classList.remove("pet-window");
  }, []);

  const enqueue = useCallback((text, kind = "affirmation") => {
    const message = { id: nextId++, text, kind };
    setQueue((list) => [...list, message].sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]));
  }, []);

  // Show the next queued message when nothing is on screen.
  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((list) => list.slice(1));
  }, [current, queue]);

  // Auto-dismiss the current message.
  useEffect(() => {
    if (!current) return undefined;
    const timer = setTimeout(() => setCurrent(null), DURATION_MS[current.kind] ?? 6000);
    return () => clearTimeout(timer);
  }, [current]);

  const onTimerDone = useCallback(() => playChime(), []);
  const timer = usePetTimer((phase) => {
    onTimerDone();
    enqueue(
      phase === "focus" ? "Focus session done! Take a short break." : "Break's over. Ready to focus?",
      "timer",
    );
  });

  // Messages and timer events from the main process.
  useEffect(() => {
    const offMessage = desktop.onMessage(({ text, kind }) => enqueue(text, kind));
    const offDone = desktop.onTimerDone(onTimerDone);
    return () => {
      offMessage();
      offDone();
    };
  }, [enqueue, onTimerDone]);

  // Grow the window only while something extra is shown (decision D17).
  const expanded = Boolean(current) || timerOpen;
  const expandedRef = useRef(expanded);
  useEffect(() => {
    expandedRef.current = expanded;
    desktop.setPetExpanded(expanded);
  }, [expanded]);

  // When the pet is shown again after being hidden, restore the right size.
  useEffect(
    () => desktop.onPetVisibility((visible) => visible && desktop.setPetExpanded(expandedRef.current)),
    [],
  );

  const clicks = useClickOrDoubleClick(
    useCallback(() => setTimerOpen((open) => !open), []),
    useCallback(() => {
      const text = randomAffirmation(lastAffirmation.current);
      lastAffirmation.current = text;
      enqueue(text, "affirmation");
    }, [enqueue]),
  );

  const mood = current?.kind === "reminder" ? "alert" : current ? "talking" : hovered ? "happy" : "idle";

  return (
    <main className={`pet-stage ${expanded ? "pet-stage--expanded" : ""}`}>
      <Bubble message={current} onDismiss={() => setCurrent(null)} />
      {timerOpen && <TimerPanel timer={timer} />}

      <div
        className="pet-holder"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="pet-button"
          aria-label="YODA. Click for the timer, double-click for encouragement."
          {...clicks}
        >
          <Pet size={104} mood={mood} />
        </button>
        <CloseButton onClick={() => desktop.hidePet()} />
      </div>

      {!isDesktop && (
        <p className="pet-preview-note">Preview mode: run the desktop app to see YODA on your desktop.</p>
      )}
    </main>
  );
}
