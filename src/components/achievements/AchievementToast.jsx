import { useState, useEffect } from "react";
import { BsX } from "react-icons/bs";

// Toast for a freshly unlocked achievement; auto-dismisses after 5s.
export default function AchievementToast({ achievement, onDone }) {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${exiting ? "achievement-toast-exit" : "achievement-toast"}`}
      role="alert"
      aria-live="polite"
    >
      <div className="achievement-card px-7 py-5 flex items-center gap-4 w-[90vw] max-w-sm">
        <span className="text-4xl drop-shadow-md" aria-hidden="true">{achievement.icon}</span>
        <div className="flex-1">
          <p className="text-2xs font-black text-amber-500 uppercase tracking-widest mb-1.5">Achievement Unlocked!</p>
          <p className="text-lg font-bold text-zinc-900" style={{ lineHeight: 1.4 }}>{achievement.label}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-500 hover:text-zinc-800 hover:bg-amber-100 transition-all cursor-pointer shrink-0"
          aria-label="Dismiss achievement"
        >
          <BsX size={20} />
        </button>
      </div>
    </div>
  );
}
