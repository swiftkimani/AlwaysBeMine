import { BsArrowUp } from "react-icons/bs";

/* Utility rail — liquid glass buttons stacked above the music FAB. Sized
   and spaced to a 44px touch target with generous gaps, same rule the
   nav rail and bg picker follow. */
export default function UtilityRail({ achievementsCount, historyOpen, onToggleHistory, showBackToTop }) {
  return (
    <div className="fixed bottom-24 right-4 sm:right-5 z-40 flex flex-col items-center gap-3">
      {achievementsCount > 0 && (
        <div className="relative group">
          <button
            onClick={onToggleHistory}
            className={`side-btn relative w-11 h-11 rounded-full ${historyOpen ? "side-btn-active" : ""}`}
            aria-label={`View ${achievementsCount} achievements`}
          >
            <span className="relative z-10 text-lg">🏆</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-white text-4xs font-bold flex items-center justify-center shadow-sm z-10">
              {achievementsCount}
            </span>
          </button>
          <span className="nav-tip nav-tip-left">🏆 {achievementsCount} achievement{achievementsCount !== 1 ? "s" : ""}</span>
        </div>
      )}

      {showBackToTop && (
        <div className="relative group">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="side-btn w-11 h-11 rounded-full"
            aria-label="Back to top"
          >
            <BsArrowUp size={16} className="relative z-10" />
          </button>
          <span className="nav-tip nav-tip-left">Back to top 💫</span>
        </div>
      )}
    </div>
  );
}
