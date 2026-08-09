import { useState } from "react";

export default function LetterEditor({ content, onSave }) {
  const [greeting, setGreeting] = useState(content.greeting || "");
  const [paragraphs, setParagraphs] = useState(content.paragraphs?.length ? content.paragraphs : [""]);
  const [closing, setClosing] = useState(content.closing || "");
  const [signature, setSignature] = useState(content.signature || "");
  const [status, setStatus] = useState("");

  const updateParagraph = (i, value) =>
    setParagraphs((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addParagraph = () => setParagraphs((prev) => [...prev, ""]);
  const removeParagraph = (i) => setParagraphs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setStatus("saving");
    try {
      await onSave({
        greeting,
        paragraphs: paragraphs.filter((p) => p.trim()),
        closing,
        signature,
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="liquid card-pad-sm rounded-2xl space-y-3">
      <h2 className="font-bold text-zinc-800">Letter</h2>

      <label className="block text-sm font-medium text-zinc-700">
        Greeting
        <input
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
        />
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700">Paragraphs</p>
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={(e) => updateParagraph(i, e.target.value)}
              rows={2}
              className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
            />
            <button
              type="button"
              onClick={() => removeParagraph(i)}
              className="text-zinc-400 hover:text-love text-sm px-2"
              aria-label="Remove paragraph"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addParagraph} className="text-sm text-love font-semibold">
          + Add paragraph
        </button>
      </div>

      <label className="block text-sm font-medium text-zinc-700">
        Closing
        <input
          value={closing}
          onChange={(e) => setClosing(e.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700">
        Signature
        <input
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-love"
        />
      </label>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary text-sm">
          Save letter
        </button>
        {status === "saving" && <span className="text-xs text-zinc-500">Saving...</span>}
        {status === "saved" && <span className="text-xs text-emerald-600">Saved</span>}
        {status === "error" && <span className="text-xs text-love">Couldn't save — try again</span>}
      </div>
    </section>
  );
}
