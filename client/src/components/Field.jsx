// Label + input + error message, with the accessibility wiring done once.
import { useId } from "react";

export default function Field({ label, error, hint, as: Component = "input", ...inputProps }) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <Component
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className="field__message">
          {message}
        </p>
      )}
    </div>
  );
}
