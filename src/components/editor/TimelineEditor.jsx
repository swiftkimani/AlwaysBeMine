import { useState } from "react";

const emptyEntry = () => ({ date: "", title: "", description: "", emoji: "💕" });

export default function TimelineEditor({ content, onSave }) {
  const [entries, setEntries] = useState(content.timeline?.length ? content.timeline : [emptyEntry()]);
  const [status, setStatus] = useState("");

  const updateEntry = (i, field, value) =>
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  const addEntry = () => setEntries((prev) => [...prev, emptyEntry()]);
  const removeEntry = (i) => setEntries((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setStatus("saving");
    try {
      await onSave({ timeline: entries.filter((e) => e.title.trim()) });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="liquid card-pad-sm rounded-2xl space-y-3">
      <h2 className="font-bold text-zinc-800">Timeline</h2>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-3 space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Emoji"
                value={entry.emoji}
                onChange={(e) => updateEntry(i, "emoji", e.target.value)}
                className="w-14 rounded-xl border border-zinc-300 px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-love"
              />
              <input
                placeholder="Date"
                value={entry.date}
                onChange={(e) => updateEntry(i, "date", e.target.value)}
                className="w-32 rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
              />
              <input
                placeholder="Title"
                value={entry.title}
                onChange={(e) => updateEntry(i, "title", e.target.value)}
                className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
              />
              <button
                type="button"
                onClick={() => removeEntry(i)}
                className="text-zinc-400 hover:text-love text-sm px-2"
                aria-label="Remove entry"
              >
                ✕
              </button>
            </div>
            <textarea
              placeholder="Description"
              value={entry.description}
              onChange={(e) => updateEntry(i, "description", e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
            />
          </div>
        ))}
        <button type="button" onClick={addEntry} className="text-sm text-love font-semibold">
          + Add moment
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary text-sm">
          Save timeline
        </button>
        {status === "saving" && <span className="text-xs text-zinc-500">Saving...</span>}
        {status === "saved" && <span className="text-xs text-emerald-600">Saved</span>}
        {status === "error" && <span className="text-xs text-love">Couldn't save — try again</span>}
      </div>
    </section>
  );
}
