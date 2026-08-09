import { useState, useEffect, useRef } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsHeartFill,
  BsMusicNoteBeamed,
  BsSpotify,
  BsChevronDown,
  BsX,
} from "react-icons/bs";
import { useSpotifyEmbed } from "../useSpotifyEmbed.js";

export default function FloatingMusicControl({ tracks, fallbackUrl }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
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

  useEffect(() => {
    if (embed.isPlaying) setIsOpen(true);
  }, [embed.isPlaying]);

  useEffect(() => {
    document.body.classList.toggle("music-playing", embed.isPlaying);
    return () => document.body.classList.remove("music-playing");
  }, [embed.isPlaying]);

  const lastPositionRef = useRef(0);
  useEffect(() => {
    const nearEnd = embed.duration > 0 && embed.position >= embed.duration - 0.4;
    const wasAdvancing = lastPositionRef.current < embed.duration - 0.4;
    if (nearEnd && !embed.isPlaying && wasAdvancing && tracks?.length) {
      setCurrentIdx((p) => (p + 1) % tracks.length);
    }
    lastPositionRef.current = embed.position;
  }, [embed.position, embed.duration, embed.isPlaying, tracks?.length]);

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

  const skipNext = () => setCurrentIdx((p) => (p + 1) % tracks.length);
  const skipPrev = () => {
    if (embed.position > 3) embed.seek(0);
    else setCurrentIdx((p) => (p - 1 + tracks.length) % tracks.length);
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
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  if (!track) return null;

  const progress = embed.duration ? (embed.position / embed.duration) * 100 : 0;

  return (
    <div
      ref={panelRef}
      className="fixed z-60"
      style={{
        top: "75%",
        transform: "translateY(-50%) translateZ(0)",
        willChange: "transform",
        right: "max(16px, 2dvw)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
      }}
    >
      <div
        ref={embed.containerRef}
        aria-hidden="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
      />

      {/* ── Expanded premium iOS-style music panel ── */}
      {isOpen && (
        <div
          className="absolute bottom-[calc(100%+16px)] right-0 w-[340px] max-w-[calc(100vw-2rem)] animate-fade-in-up"
          style={{ transformOrigin: "bottom right" }}
        >
          {/* Main Card */}
          <div className="relative bg-white/85 backdrop-blur-3xl rounded-[2rem] p-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.15)] border border-white/70">
             
            {/* The Tip pointing precisely to the center of the FAB (FAB is w-12/48px, so its center is 24px from right. Tip is w-5/20px, so right-[14px] perfectly centers it at 24px) */}
            <div className="absolute -bottom-2.5 right-[14px] w-5 h-5 bg-white/85 backdrop-blur-3xl rotate-45 border-b border-r border-white/70 shadow-[6px_6px_12px_rgba(0,0,0,0.05)] rounded-sm pointer-events-none" />

            {/* Header / Track Info */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`relative w-[60px] h-[60px] rounded-full shadow-lg overflow-hidden shrink-0 transition-transform duration-700 ${embed.isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <div className="absolute inset-0 bg-zinc-900 rounded-full" />
                <div className="absolute inset-1 border border-zinc-700 rounded-full" />
                <div className="absolute inset-2 border border-zinc-700 rounded-full" />
                <div className="absolute inset-3 border border-zinc-700 rounded-full" />
                <div className="absolute inset-4 border border-zinc-700 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[18px] h-[18px] bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-inner flex items-center justify-center">
                    <span className="text-[6px]">💗</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-base font-bold text-zinc-900 truncate leading-tight tracking-tight mb-1">{track.title}</h3>
                <p className="text-sm font-medium text-zinc-500 truncate leading-none">{track.artist}</p>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="self-start w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors -mr-1 -mt-1"
                aria-label="Close music player"
              >
                <BsX size={18} />
              </button>
            </div>

            {/* Seek bar */}
            <div className="mb-6 relative z-10">
              <input
                type="range"
                min="0" max="100"
                value={progress}
                onChange={seek}
                className="sleek-progress w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-200"
                style={{
                  background: `linear-gradient(to right, #18181b ${progress}%, #e4e4e7 ${progress}%)`
                }}
              />
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500 mt-2 px-0.5 tracking-wide">
                <span>{fmt(embed.position)}</span>
                <span>{fmt(embed.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-7 relative z-10 mb-4">
              <button onClick={skipPrev} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <BsSkipBackwardFill size={24} />
              </button>
              
              <button
                onClick={() => embed.togglePlay()}
                disabled={!embed.ready}
                className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {embed.isPlaying ? <BsPauseFill size={28} /> : <BsPlayFill size={30} className="ml-1.5" />}
              </button>
              
              <button onClick={skipNext} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <BsSkipForwardFill size={24} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5 relative z-10">
               <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(e); }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${
                    liked.has(currentIdx) ? "text-rose-500 bg-rose-50" : "text-zinc-400 hover:text-rose-400 hover:bg-rose-50"
                  }`}
                >
                  <BsHeartFill size={13} />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Love</span>
               </button>

               <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors"
               >
                  <BsSpotify size={13} />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Spotify</span>
               </a>
            </div>

            {/* Playlist Toggle */}
            <div className="mt-2 pt-2 border-t border-black/5 relative z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setShowPlaylist((p) => !p); }}
                className="w-full flex items-center justify-between group py-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-700 transition-colors">
                  Up Next
                </span>
                <BsChevronDown size={12} className={`text-zinc-400 transition-transform ${showPlaylist ? "rotate-180" : ""}`} />
              </button>

              {showPlaylist && (
                <div className="animate-fade-in pt-2 space-y-1 max-h-[140px] overflow-y-auto no-scrollbar">
                  {tracks.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-left transition-colors ${
                        idx === currentIdx ? "bg-zinc-100" : "hover:bg-zinc-50"
                      }`}
                    >
                      {idx === currentIdx && embed.isPlaying ? (
                        <div className="flex gap-[2px] items-end h-3 w-4 shrink-0">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-[3px] bg-zinc-900 rounded-full"
                              style={{ height: "100%", animation: `eqBar 0.6s ease-in-out ${delay}ms infinite alternate` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="w-4 text-center text-[10px] font-bold text-zinc-400 shrink-0">{idx + 1}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-bold truncate ${idx === currentIdx ? "text-zinc-900" : "text-zinc-600"}`}>
                          {t.title}
                        </p>
                        <p className="text-[9px] text-zinc-400 truncate">{t.artist}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FAB — sleek frosted circle aligned perfectly with the tip ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open music player"
        className={`relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-white/60 select-none ${
          isOpen ? "bg-white text-zinc-900 scale-95 shadow-md" : "bg-white/80 backdrop-blur-xl text-zinc-700 hover:bg-white hover:scale-105"
        }`}
      >
        {embed.isPlaying && !isOpen && (
          <span
            className="absolute inset-0 rounded-full bg-zinc-900/10 pointer-events-none"
            style={{ animation: "fabPulse 2s ease-out infinite" }}
          />
        )}

        <span className="relative z-10 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(-10deg)' : 'rotate(0)' }}>
          <BsMusicNoteBeamed size={18} />
        </span>

        {embed.isPlaying && !isOpen && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full shadow-sm" />
        )}
      </button>

      <style>{`
        .sleek-progress::-webkit-slider-thumb {
          appearance: none;
          width: 0px;
          height: 0px;
          border-radius: 50%;
          background: #18181b;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .sleek-progress:hover::-webkit-slider-thumb {
          width: 12px;
          height: 12px;
        }
        .sleek-progress::-moz-range-thumb {
          width: 0px;
          height: 0px;
          border-radius: 50%;
          background: #18181b;
          transition: all 0.2s;
          border: none;
        }
        .sleek-progress:hover::-moz-range-thumb {
          width: 12px;
          height: 12px;
        }
        @keyframes fabPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes eqBar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s cubic-bezier(0.2, 0.9, 0.4, 1) forwards;
        }
      `}</style>
    </div>
  );
}
