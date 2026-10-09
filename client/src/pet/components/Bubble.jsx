// Comic-style speech bubble above YODA. Click it to dismiss.
export default function Bubble({ message, onDismiss }) {
  if (!message) return null;

  return (
    <button
      type="button"
      key={message.id}
      className={`bubble bubble--${message.kind}`}
      onClick={onDismiss}
      aria-live="polite"
      title="Click to dismiss"
    >
      {message.text}
    </button>
  );
}
