import { useCallback, useEffect, useMemo, useState } from "react";
import { createItem, deleteItem, listItems, updateItem } from "../api/items.js";
import AddButton from "../components/AddButton.jsx";
import AgendaSection from "../components/AgendaSection.jsx";
import ItemModal from "../components/ItemModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { desktop, isDesktop } from "../desktop/bridge.js";
import Pet from "../pet/components/Pet.jsx";
import { groupItems } from "../utils/agenda.js";

export default function MainPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // null = closed, "new" = adding, item object = editing
  const [editing, setEditing] = useState(null);
  const [petVisible, setPetVisible] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listItems());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-group every minute so "Today" / "Overdue" stay correct while the app is open.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Desktop only: keep the "Show pet" button in sync with the pet window.
  useEffect(() => {
    if (!isDesktop) return undefined;
    desktop.getPetVisible().then(setPetVisible);
    return desktop.onPetVisibility(setPetVisible);
  }, []);

  const sections = useMemo(() => groupItems(items, now), [items, now]);

  const replaceItem = (saved) =>
    setItems((list) => list.map((item) => (item.id === saved.id ? saved : item)));

  async function handleToggle(item) {
    // Optimistic update: flip it right away, roll back if the server refuses.
    replaceItem({ ...item, isDone: !item.isDone, updatedAt: new Date().toISOString() });
    try {
      replaceItem(await updateItem(item.id, { isDone: !item.isDone }));
    } catch (err) {
      replaceItem(item);
      setError(err.message);
    }
  }

  async function handleSave(data) {
    if (editing === "new") {
      const created = await createItem(data);
      setItems((list) => [...list, created]);
    } else {
      replaceItem(await updateItem(editing.id, data));
    }
    setEditing(null);
  }

  async function handleDelete(item) {
    await deleteItem(item.id);
    setItems((list) => list.filter((entry) => entry.id !== item.id));
    setEditing(null);
  }

  const firstName = user?.name?.split(" ")[0] ?? "friend";

  return (
    <div className="main">
      <header className="main__header">
        <div>
          <h1 className="main__greeting">Hi, {firstName}</h1>
          <p className="main__tagline">You're doing amazing. Here's what's coming up.</p>
        </div>
        <nav className="main__actions" aria-label="Account">
          {isDesktop && (
            <button
              type="button"
              className="button button--quiet"
              onClick={() => (petVisible ? desktop.hidePet() : desktop.showPet())}
            >
              {petVisible ? "Hide pet" : "Show pet"}
            </button>
          )}
          <button type="button" className="button button--quiet" onClick={logout}>
            Log out
          </button>
          {isDesktop && (
            <button type="button" className="button button--quiet" onClick={() => desktop.quit()}>
              Quit YODA
            </button>
          )}
        </nav>
      </header>

      {error && (
        <div className="banner" role="alert">
          <span>{error}</span>
          <button type="button" className="button button--quiet" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <p className="page-status">Loading your agenda…</p>
      ) : sections.length === 0 ? (
        <div className="empty">
          <Pet size={140} mood="happy" />
          <h2 className="empty__title">Nothing on your plate yet</h2>
          <p className="empty__text">
            Add your first task with the + button. Give it a deadline and I'll remind you.
          </p>
        </div>
      ) : (
        <div className="agenda">
          {sections.map((section) => (
            <AgendaSection key={section.key} section={section} onToggle={handleToggle} onOpen={setEditing} />
          ))}
        </div>
      )}

      <AddButton onClick={() => setEditing("new")} />

      {editing && (
        <ItemModal
          item={editing === "new" ? null : editing}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
