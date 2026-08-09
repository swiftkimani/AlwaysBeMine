import { BsArrowUp, BsMusicNoteBeamed } from "react-icons/bs";

/* Utility rail — liquid glass buttons stacked above the music FAB. Sized
   and spaced to a 44px touch target with generous gaps, same rule the
   nav rail and bg picker follow. */
export default function UtilityRail({
  achievementsCount,
  historyOpen,
  onToggleHistory,
  showBackToTop,
  musicOpen,
  onToggleMusic,
  musicIsPlaying,
}) {
  /* musicIsPlaying is passed as a plain boolean from App.jsx.
     We intentionally do NOT call useSpotifyEmbed here — a second
     hook instance would spawn a competing iframe and break playback
     inside FloatingMusicControl. */
  const isLive = !!musicIsPlaying;

  return (
    <div className="fixed bottom-6 right-4 sm:right-5 z-40 flex flex-col items-center gap-3">

      {/* Achievements */}
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

      {/* Back to top */}
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

      {/* Music player FAB — same glass treatment as siblings above */}
      <div className="relative group">
        <button
          onClick={onToggleMusic}
          className={`side-btn relative w-11 h-11 rounded-full ${musicOpen ? "side-btn-active" : ""}`}
          aria-label={musicOpen ? "Close music player" : "Open music player"}
        >
          <BsMusicNoteBeamed size={15} className="relative z-10" />
          {/* Live dot — visible only when music plays and panel is closed */}
          {isLive && !musicOpen && (
            <span
              className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white z-20"
              style={{ background: "#f43f5e", boxShadow: "0 0 0 2px rgba(244,63,94,0.25)" }}
            />
          )}
        </button>
        <span className="nav-tip nav-tip-left">
          {musicOpen ? "Close player 🎵" : isLive ? "Now playing 🎶" : "Music player 🎵"}
        </span>
      </div>

    </div>
  );
}
