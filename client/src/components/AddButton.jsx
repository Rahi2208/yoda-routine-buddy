// The floating "+" button, shaped like YODA's body.
export default function AddButton({ onClick }) {
  return (
    <button type="button" className="add-button" onClick={onClick} aria-label="Add a task">
      <span aria-hidden="true">+</span>
    </button>
  );
}
