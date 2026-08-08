import { useState, useEffect, useRef } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsHeartFill,
  BsMusicNoteBeamed,
  BsSpotify,
  BsX,
} from "react-icons/bs";
import { useSpotifyEmbed } from "../useSpotifyEmbed.js";

export default function FloatingMusicControl({ tracks, fallbackUrl }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(new Set());

  const panelRef = useRef(null);
  const track = tracks?.[currentIdx];
  const embed = useSpotifyEmbed(tracks?.[0]?.spotifyUri);

  // Load whichever track is current into the (already-mounted) embed —
  // skip the very first render since the controller already boots with
  // tracks[0].
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!track?.spotifyUri) return;
    embed.loadTrack(track.spotifyUri);
    embed.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // Real playback needs a user gesture before Spotify's iframe will play —
  // start on the visitor's first tap/click anywhere, same as before.
  const autoPlayedRef = useRef(false);
  useEffect(() => {
    if (autoPlayedRef.current || !embed.ready) return;
    const tryAutoplay = () => {
      if (autoPlayedRef.current) return;
      autoPlayedRef.current = true;
      embed.play();
      document.removeEventListener("click", tryAutoplay);
      document.removeEventListener("touchstart", tryAutoplay);
    };
    document.addEventListener("click", tryAutoplay);
    document.addEventListener("touchstart", tryAutoplay);
    return () => {
      document.removeEventListener("click", tryAutoplay);
      document.removeEventListener("touchstart", tryAutoplay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed.ready]);

  // Auto-open panel when playing starts
  useEffect(() => {
    if (embed.isPlaying) setIsOpen(true);
  }, [embed.isPlaying]);

  useEffect(() => {
    document.body.classList.toggle("music-playing", embed.isPlaying);
    return () => document.body.classList.remove("music-playing");
  }, [embed.isPlaying]);

  // Best-effort "track ended" detection — the iFrame API doesn't expose an
  // explicit ended event, but playback settling at/near the very end is a
  // reliable enough signal to auto-advance.
  const lastPositionRef = useRef(0);
  useEffect(() => {
    const nearEnd = embed.duration > 0 && embed.position >= embed.duration - 0.4;
    const wasAdvancing = lastPositionRef.current < embed.duration - 0.4;
    if (nearEnd && !embed.isPlaying && wasAdvancing && tracks?.length) {
      setCurrentIdx((p) => (p + 1) % tracks.length);
    }
    lastPositionRef.current = embed.position;
  }, [embed.position, embed.duration, embed.isPlaying, tracks?.length]);

  // close panel on outside click
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [isOpen]);

  const skipNext = () => {
    setCurrentIdx((p) => (p + 1) % tracks.length);
  };
  const skipPrev = () => {
    if (embed.position > 3) {
      embed.seek(0);
    } else {
      setCurrentIdx((p) => (p - 1 + tracks.length) % tracks.length);
    }
  };

  const seek = (e) => {
    const val = Number(e.target.value);
    embed.seek((val / 100) * (embed.duration || 0));
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => {
      const n = new Set(p);
      n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx);
      return n;
    });
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  if (!track) return null;

  const progress = embed.duration ? (embed.position / embed.duration) * 100 : 0;

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: "75%",
        // translateZ(0) promotes this to its own GPU layer so it doesn't
        // repaint on every scroll frame on mobile browsers.
        transform: "translateY(-50%) translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        right: "max(16px, 2dvw)",
        zIndex: 60,
      }}
    >
      {/* Hidden mount point for the real Spotify embed — sized to
          effectively nothing since our own bubble/panel is the UI. */}
      <div
        ref={embed.containerRef}
        aria-hidden="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
      />

      {/* ── Expanded music panel (chatbot tooltip style) ── */}
      {isOpen && (
        <div
          className="absolute bottom-[calc(100%+12px)] right-0 w-80 max-w-[calc(100vw-2rem)] animate-fade-in-up"
          style={{ transformOrigin: "bottom right" }}
        >
          {/* Panel card — real glass; the animated bg glows through */}
          <div className="music-panel relative rounded-[1.75rem] overflow-hidden">
            {/* Decorative header gradient */}
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg,var(--color-love-bright),var(--color-pink),var(--color-purple),var(--color-love-bright))",
                backgroundSize: "200% 100%",
                animation: "gradientShift 3s linear infinite",
              }}
            />

            {embed.failed ? (
              <div className="p-5 text-center">
                <p className="text-xs font-bold text-zinc-700 mb-1">Couldn't load Spotify here 🎵</p>
                <p className="text-2xs text-zinc-400 mb-3">
                  Listen to the real tracks directly instead.
                </p>
                {fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#1DB954] to-[#1ed760] shadow-md shadow-[#1DB954]/30"
                  >
                    <BsSpotify size={14} />
                    Open on Spotify
                  </a>
                )}
              </div>
            ) : (
              <>
                {/* Header: now playing */}
                <div className="px-4 pt-3 pb-2 flex items-center gap-3">
                  {/* Spinning vinyl heart — turns while the song plays */}
                  <div className={`music-vinyl ${embed.isPlaying ? "music-vinyl-playing" : ""}`}>
                    <span className="vinyl-heart" aria-hidden="true">💗</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-zinc-800 truncate leading-tight">
                      {track.title}
                    </p>
                    <p className="text-3xs text-zinc-400 truncate leading-tight mt-0.5">
                      {track.artist}
                    </p>
                    {embed.isPlaying && (
                      <div className="flex gap-[3px] items-end h-2 mt-1" aria-hidden="true">
                        {[0, 150, 300, 450].map((delay) => (
                          <span
                            key={delay}
                            className="w-[3px] rounded-full bg-gradient-to-t from-rose-500 to-purple-400"
                            style={{
                              height: "100%",
                              animation: `eqBar 0.6s ease-in-out ${delay}ms infinite alternate`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(e); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      liked.has(currentIdx)
                        ? "text-rose-500 bg-rose-50"
                        : "text-zinc-300 hover:text-rose-400 hover:bg-rose-50"
                    }`}
                    aria-label="Like track"
                  >
                    <BsHeartFill size={12} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
                    aria-label="Close music player"
                  >
                    <BsX size={16} />
                  </button>
                </div>

                {/* Progress bar — filled with the love gradient */}
                <div className="px-4 pb-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={seek}
                    className="audio-progress w-full"
                    style={{ "--progress": `${progress}%` }}
                    aria-label="Seek position"
                  />
                  <div className="flex justify-between text-4xs font-semibold text-zinc-400 mt-1">
                    <span>{fmt(embed.position)}</span>
                    <span>{fmt(embed.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="px-4 pb-3 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); skipPrev(); }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
                    aria-label="Previous"
                  >
                    <BsSkipBackwardFill size={15} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); embed.togglePlay(); }}
                    disabled={!embed.ready}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-400/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                    aria-label={embed.isPlaying ? "Pause" : "Play"}
                  >
                    {embed.isPlaying ? (
                      <BsPauseFill size={22} />
                    ) : (
                      <BsPlayFill size={22} className="ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); skipNext(); }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
                    aria-label="Next"
                  >
                    <BsSkipForwardFill size={15} />
                  </button>

                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#1DB954] hover:bg-[#1DB954]/10 transition-all cursor-pointer ml-1"
                    aria-label="Open on Spotify"
                    title="Open on Spotify"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BsSpotify size={16} />
                  </a>
                </div>

                {/* Track list */}
                <div className="border-t border-white/60 px-3 pb-3 pt-2 space-y-1 max-h-[156px] overflow-y-auto no-scrollbar">
                  <p className="text-4xs font-black uppercase tracking-widest text-rose-400/90 px-1 mb-2">
                    ♫ Our little playlist 💕
                  </p>
                  {tracks.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`music-track-row w-full flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer text-left group ${
                        idx === currentIdx ? "music-track-row-active" : ""
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center text-4xs font-black shrink-0 transition-all ${
                          idx === currentIdx
                            ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm"
                            : "bg-white/70 text-zinc-500 group-hover:bg-rose-100"
                        }`}
                      >
                        {idx === currentIdx && embed.isPlaying ? "♪" : idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-3xs font-bold truncate ${
                            idx === currentIdx ? "text-rose-600" : "text-zinc-700"
                          }`}
                        >
                          {t.title}
                        </p>
                        <p className="text-4xs text-zinc-400 truncate">
                          {t.artist}
                        </p>
                      </div>
                      {idx === currentIdx && (
                        <span className="text-xs shrink-0" aria-hidden="true">💗</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Inspired by footer */}
                <div className="border-t border-white/60 px-4 py-2 flex items-center justify-between">
                  <a
                    href="https://github.com/swiftkimani/AlwaysBeMine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-semibold text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    Inspired by Swift ✨
                  </a>
                  <span className="text-[9px] text-zinc-300 flex items-center gap-1">
                    <BsSpotify size={10} className="text-[#1DB954]" />
                    via Spotify
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Tail / caret pointing down to FAB */}
          <div
            className="absolute -bottom-2 right-5 w-4 h-4 rotate-45"
            style={{
              background: "rgba(255,240,248,0.9)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(255,255,255,0.85)",
              borderTop: "none",
              borderLeft: "none",
              boxShadow: "2px 2px 6px rgba(225,29,72,0.1)",
            }}
          />
        </div>
      )}

      {/* ── FAB bubble button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open music player"
        title="Music Player"
        className={`relative flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-300 select-none ${
          isOpen
            ? "shadow-[0_8px_30px_-4px_rgba(225,29,72,0.5)] scale-95"
            : "shadow-[0_8px_30px_-4px_rgba(225,29,72,0.4)] hover:scale-105 hover:shadow-[0_12px_40px_-4px_rgba(225,29,72,0.55)] active:scale-95"
        }`}
        style={{
          background: embed.isPlaying
            ? "linear-gradient(135deg,var(--color-love-bright),var(--color-pink),var(--color-purple))"
            : "linear-gradient(135deg,var(--color-love-bright),var(--color-love-deep))",
          backgroundSize: "200% 200%",
          animation: embed.isPlaying ? "gradientShift 2s linear infinite" : "none",
        }}
      >
        {/* Pulsing ring when playing */}
        {embed.isPlaying && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg,var(--color-love-bright),var(--color-pink),var(--color-purple))",
              animation: "fabPulse 1.8s ease-out infinite",
              opacity: 0.4,
            }}
          />
        )}

        {/* Tiny notes drifting up while a song plays */}
        {embed.isPlaying && (
          <span aria-hidden="true">
            <span className="music-note-rise" style={{ "--note-dx": "-18px", "--note-rot": "-20deg", "--note-delay": "0s" }}>🎵</span>
            <span className="music-note-rise" style={{ "--note-dx": "14px", "--note-rot": "18deg", "--note-delay": "0.9s" }}>💕</span>
            <span className="music-note-rise" style={{ "--note-dx": "2px", "--note-rot": "8deg", "--note-delay": "1.7s" }}>🎶</span>
          </span>
        )}

        <span className="relative z-10 text-white">
          {embed.isPlaying ? (
            <BsMusicNoteBeamed size={22} className="animate-bounce" />
          ) : (
            <BsMusicNoteBeamed size={22} />
          )}
        </span>

        {/* Playing indicator dot */}
        {embed.isPlaying && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
        )}
      </button>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fabPulse {
          0% { transform: scale(1); opacity: 0.5; }
          80% { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes eqBar {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
