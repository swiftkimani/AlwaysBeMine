import { BsX } from "react-icons/bs";

// Bottom-sheet (mobile) / centered (desktop) panel listing all unlocks.
export default function AchievementHistory({ achievements, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative liquid card-pad-sm w-full max-w-sm max-h-[60vh] overflow-y-auto no-scrollbar animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-800">Achievements ({achievements.length})</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
            aria-label="Close achievements"
          >
            <BsX size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
              <span className="text-xl">{a.icon}</span>
              <p className="text-xs font-bold text-zinc-700">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
