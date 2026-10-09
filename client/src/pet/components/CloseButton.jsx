// Faint "X" in the top-right corner of the pet. Hides the pet window;
// the app keeps running and messages go to OS notifications instead.
export default function CloseButton({ onClick }) {
  return (
    <button type="button" className="pet-close" onClick={onClick} aria-label="Hide YODA" title="Hide YODA">
      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
