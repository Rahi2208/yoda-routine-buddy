import { useState } from "react";
import ItemRow from "./ItemRow.jsx";

export default function AgendaSection({ section, onToggle, onOpen }) {
  // The "Done" section starts collapsed so finished work doesn't crowd the page.
  const [open, setOpen] = useState(section.key !== "done");
  const headingId = `section-${section.key}`;

  return (
    <section className={`agenda__section agenda__section--${section.key}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="agenda__heading">
        {section.key === "done" ? (
          <button
            type="button"
            className="agenda__toggle"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {section.title} <span className="agenda__count">{section.items.length}</span>
          </button>
        ) : (
          <>
            {section.title} <span className="agenda__count">{section.items.length}</span>
          </>
        )}
      </h2>
      {open && (
        <ul className="agenda__list">
          {section.items.map((item) => (
            <ItemRow key={item.id} item={item} section={section.key} onToggle={onToggle} onOpen={onOpen} />
          ))}
        </ul>
      )}
    </section>
  );
}
