// Tells a single click apart from a double click on the same element.
//
// Browsers fire click -> click -> dblclick for a double click, so we wait
// a short moment before running the single-click action. If a second click
// arrives in that window, the single-click action is cancelled. (Decision D14)
import { useCallback, useEffect, useRef } from "react";

const DOUBLE_CLICK_MS = 250;

export function useClickOrDoubleClick(onSingle, onDouble) {
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onClick = useCallback(
    (event) => {
      if (event.detail > 1) return; // second click of a double click
      clearTimeout(timerRef.current);
      if (event.detail === 0) {
        onSingle(); // keyboard (Enter/Space): no double click possible, act right away
        return;
      }
      timerRef.current = setTimeout(onSingle, DOUBLE_CLICK_MS);
    },
    [onSingle],
  );

  const onDoubleClick = useCallback(() => {
    clearTimeout(timerRef.current);
    onDouble();
  }, [onDouble]);

  return { onClick, onDoubleClick };
}
