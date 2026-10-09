// Dialog for adding a new item or editing / deleting an existing one.
import { useEffect, useRef, useState } from "react";
import { fromLocalInputValue, toLocalInputValue } from "../utils/dates.js";
import Field from "./Field.jsx";

export default function ItemModal({ item, onSave, onDelete, onClose }) {
  const isEdit = Boolean(item);
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    title: item?.title ?? "",
    notes: item?.notes ?? "",
    dueAt: toLocalInputValue(item?.dueAt),
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // <dialog> gives us focus trapping and Esc-to-close for free.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    try {
      await onSave({
        title: form.title,
        notes: form.notes || null,
        dueAt: fromLocalInputValue(form.dueAt),
      });
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      if (!error.details?.length) setFormError(error.message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    try {
      await onDelete(item);
    } catch (error) {
      setFormError(error.message);
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="item-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => event.target === dialogRef.current && onClose()} // click on backdrop
    >
      <form className="form modal__body" onSubmit={handleSubmit} noValidate>
        <h2 id="item-modal-title" className="modal__title">
          {isEdit ? "Edit task" : "New task"}
        </h2>
        <Field
          label="What do you need to do?"
          value={form.title}
          onChange={update("title")}
          error={errors.title}
          placeholder="Finish the essay draft"
          autoFocus
        />
        <Field
          label="Notes"
          as="textarea"
          rows={3}
          value={form.notes}
          onChange={update("notes")}
          error={errors.notes}
          hint="Optional."
        />
        <div className="modal__due">
          <Field
            label="Deadline"
            type="datetime-local"
            value={form.dueAt}
            onChange={update("dueAt")}
            error={errors.dueAt}
            hint="Optional. YODA reminds you 3 days, 1 day and 3 hours before."
          />
          {form.dueAt && (
            <button
              type="button"
              className="button button--quiet"
              onClick={() => setForm({ ...form, dueAt: "" })}
            >
              Clear deadline
            </button>
          )}
        </div>
        {formError && (
          <p className="form__error" role="alert">
            {formError}
          </p>
        )}
        <div className="modal__actions">
          {isEdit && (
            <button type="button" className="button button--danger" onClick={handleDelete} disabled={busy}>
              {confirmDelete ? "Yes, delete it" : "Delete"}
            </button>
          )}
          <span className="modal__spacer" />
          <button type="button" className="button button--quiet" onClick={onClose}>
            Cancel
          </button>
          <button className="button button--primary" disabled={busy}>
            {isEdit ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
