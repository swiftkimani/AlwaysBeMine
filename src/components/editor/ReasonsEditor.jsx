import { useState } from "react";

export default function ReasonsEditor({ content, onSave }) {
  const [reasons, setReasons] = useState(content.reasons?.length ? content.reasons : [""]);
  const [status, setStatus] = useState("");

  const updateReason = (i, value) => setReasons((prev) => prev.map((r, idx) => (idx === i ? value : r)));
  const addReason = () => setReasons((prev) => [...prev, ""]);
  const removeReason = (i) => setReasons((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setStatus("saving");
    try {
      await onSave({ reasons: reasons.filter((r) => r.trim()) });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="liquid card-pad-sm rounded-2xl space-y-3">
      <h2 className="font-bold text-zinc-800">Reasons Jar</h2>

      <div className="space-y-2">
        {reasons.map((r, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={r}
              onChange={(e) => updateReason(i, e.target.value)}
              className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
            />
            <button
              type="button"
              onClick={() => removeReason(i)}
              className="text-zinc-400 hover:text-love text-sm px-2"
              aria-label="Remove reason"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addReason} className="text-sm text-love font-semibold">
          + Add reason
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary text-sm">
          Save reasons
        </button>
        {status === "saving" && <span className="text-xs text-zinc-500">Saving...</span>}
        {status === "saved" && <span className="text-xs text-emerald-600">Saved</span>}
        {status === "error" && <span className="text-xs text-love">Couldn't save — try again</span>}
      </div>
    </section>
  );
}
