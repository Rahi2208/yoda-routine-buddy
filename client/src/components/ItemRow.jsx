// One agenda item: done checkbox, title (opens the editor) and deadline.
import { formatDue } from "../utils/dates.js";

export default function ItemRow({ item, section, onToggle, onOpen }) {
  return (
    <li className={`item item--${section} ${item.isDone ? "item--done" : ""}`}>
      <input
        type="checkbox"
        className="item__check"
        checked={item.isDone}
        onChange={() => onToggle(item)}
        aria-label={item.isDone ? `Mark "${item.title}" as not done` : `Mark "${item.title}" as done`}
      />
      <button type="button" className="item__main" onClick={() => onOpen(item)}>
        <span className="item__title">{item.title}</span>
        {item.notes && <span className="item__notes">{item.notes}</span>}
      </button>
      {item.dueAt && !item.isDone && (
        <time className="item__due" dateTime={item.dueAt}>
          {formatDue(item.dueAt)}
        </time>
      )}
    </li>
  );
}
