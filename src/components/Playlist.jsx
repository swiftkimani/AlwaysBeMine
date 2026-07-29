import { useState, useRef, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsHeartFill,
  BsMusicNoteBeamed,
  BsSpotify,
} from "react-icons/bs";
import { useRomance } from "../RomanceFX.jsx";
import { useSpotifyEmbed } from "../useSpotifyEmbed.js";

export default function Playlist({ data }) {
  const languages = data?.languages || [];
  const [activeCode, setActiveCode] = useState(languages[0]?.code);
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState(new Set());

  const { burstFromEvent } = useRomance();
  // Seeded from whichever language ships local tracks first (English) —
  // language switches after that go through loadTrack(), same controller.
  const embed = useSpotifyEmbed(languages[0]?.tracks?.[0]?.spotifyUri);
  const wasPlayingRef = useRef(false);
  const didMountRef = useRef(false);

  const lang = languages.find((l) => l.code === activeCode) || languages[0];
  const tracks = lang?.tracks || [];
  const track = tracks[activeIdx];

  useEffect(() => {
    wasPlayingRef.current = embed.isPlaying;
  }, [embed.isPlaying]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!track?.spotifyUri) return;
    embed.loadTrack(track.spotifyUri);
    if (wasPlayingRef.current) embed.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  const switchLanguage = (l, e) => {
    if (l.code === activeCode) return;
    wasPlayingRef.current = false;
    embed.pause();
    setActiveCode(l.code);
    setActiveIdx(0);
    burstFromEvent(e, "🎵");
  };

  const skipNext = () => setActiveIdx((p) => (p + 1) % tracks.length);
  const skipPrev = () => {
    if (embed.position > 3) embed.seek(0);
    else setActiveIdx((p) => (p - 1 + tracks.length) % tracks.length);
  };
  const playTrack = (idx) => {
    wasPlayingRef.current = true;
    setActiveIdx(idx);
  };
  const seek = (e) => {
    const val = Number(e.target.value);
    embed.seek((val / 100) * (embed.duration || 0));
  };
  const toggleLike = (idx, e) => {
    e.stopPropagation();
    setLiked((p) => {
      const n = new Set(p);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };
  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  if (!lang) return null;

  const progress = embed.duration ? (embed.position / embed.duration) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="liquid p-5 sm:p-7 md:p-8 rounded-3xl border border-white/80 shadow-xl">
        {/* Hidden mount point for the real Spotify embed */}
        <div
          ref={embed.containerRef}
          aria-hidden="true"
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
        />

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-lg shadow-rose-500/30">
            🎵
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-1" style={{ fontFamily: "Charm, serif" }}>
            {data.title || "Our Love Songs"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-semibold">
            {data.subtitle || "Songs that remind me of us 💕"}
          </p>
        </div>

        {/* Language toggle */}
        <div className="flex items-center justify-center gap-2 mb-6" role="tablist" aria-label="Playlist language">
          {languages.map((l) => {
            const isActive = l.code === lang.code;
            return (
              <button
                key={l.code}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => switchLanguage(l, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-md shadow-rose-500/30 scale-105"
                    : "bg-white/70 text-zinc-600 border-white/80 hover:bg-white hover:scale-105"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>

        {track && embed.failed && (
          <div className="text-center py-3 mb-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <p className="text-xs font-bold text-amber-700">Couldn't load Spotify here — use the link below instead 🎵</p>
          </div>
        )}

        {track ? (
          <div key={lang.code} className="animate-fade-in">
            {/* Hero player */}
            <div className="bg-gradient-to-br from-white/95 via-rose-50/80 to-pink-50/90 rounded-3xl p-5 sm:p-7 mb-5 border border-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-lg ${
                    embed.isPlaying
                      ? "bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 scale-105 shadow-rose-500/40"
                      : "bg-gradient-to-br from-zinc-100 to-zinc-200"
                  }`}
                >
                  {embed.isPlaying ? (
                    <div className="flex gap-1 items-end h-7">
                      {[0, 150, 300, 450].map((delay) => (
                        <span key={delay} className="w-1 bg-white rounded-full" style={{ height: "100%", animation: `eqBar 0.6s ease-in-out ${delay}ms infinite alternate` }} />
                      ))}
                    </div>
                  ) : (
                    <BsMusicNoteBeamed size={30} className="text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-100/80 pill-pad rounded-full border border-rose-200">
                      Track {activeIdx + 1}/{tracks.length}
                    </span>
                    <button
                      onClick={(e) => toggleLike(activeIdx, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        liked.has(activeIdx) ? "text-rose-500 bg-rose-100" : "text-zinc-400 hover:text-rose-400 hover:bg-zinc-100"
                      }`}
                      aria-label="Like track"
                    >
                      <BsHeartFill size={13} />
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-zinc-900 truncate">{track.title}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-500 truncate mb-3">{track.artist}</p>

                  <input type="range" min="0" max="100" value={progress} onChange={seek} className="audio-progress w-full" />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-1 mb-3">
                    <span>{fmt(embed.position)}</span>
                    <span>{fmt(embed.duration)}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <button onClick={skipPrev} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white transition-all cursor-pointer" aria-label="Previous track">
                      <BsSkipBackwardFill size={15} />
                    </button>
                    <button
                      onClick={() => { wasPlayingRef.current = true; embed.togglePlay(); }}
                      disabled={!embed.ready}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                      aria-label={embed.isPlaying ? "Pause" : "Play"}
                    >
                      {embed.isPlaying ? <BsPauseFill size={22} /> : <BsPlayFill size={22} className="ml-0.5" />}
                    </button>
                    <button onClick={skipNext} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white transition-all cursor-pointer" aria-label="Next track">
                      <BsSkipForwardFill size={15} />
                    </button>
                    {lang.spotifyUrl && (
                      <a
                        href={lang.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#1DB954] hover:bg-[#1DB954]/10 transition-all cursor-pointer ml-auto"
                        aria-label="Open on Spotify"
                        title="Open on Spotify"
                      >
                        <BsSpotify size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Track list */}
            <div className="space-y-2 mb-6">
              {tracks.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => playTrack(idx)}
                  className={`flex items-center gap-3 rounded-2xl row-pad transition-all duration-300 cursor-pointer border ${
                    idx === activeIdx ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200/90 shadow-sm" : "bg-white/60 hover:bg-white border-white/80"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === activeIdx ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {idx === activeIdx && embed.isPlaying ? "▶" : idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black truncate ${idx === activeIdx ? "text-rose-600" : "text-zinc-800"}`}>{t.title}</p>
                    <p className="text-xs text-zinc-500 truncate font-semibold">{t.artist}</p>
                  </div>
                  <button onClick={(e) => toggleLike(idx, e)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${liked.has(idx) ? "text-rose-500 bg-rose-50" : "text-zinc-300 hover:text-rose-400"}`}>
                    <BsHeartFill size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 mb-6">
            <span className="text-4xl mb-3 block">💿</span>
            <p className="text-sm font-bold text-zinc-700 mb-1">No offline preview for {lang.label} yet</p>
            <p className="text-xs text-zinc-500">Tap below to hear the real playlist on Spotify</p>
          </div>
        )}

        {/* Highlights from the full playlist */}
        {lang.highlights?.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
              ♫ More on "{lang.playlistName}"
            </p>
            <div className="flex flex-wrap gap-2">
              {lang.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50/90 border border-rose-200/80 rounded-full pill-pad">
                  <BsMusicNoteBeamed size={10} className="shrink-0 text-rose-400" />
                  <span className="truncate max-w-[9rem]">{h.title}</span>
                  <span className="text-rose-300">·</span>
                  <span className="text-zinc-500 truncate max-w-[7rem]">{h.artist}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Open full playlist on Spotify */}
        {lang.spotifyUrl && (
          <a
            href={lang.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#1DB954]/30 transition-all"
          >
            <BsSpotify size={16} />
            Open "{lang.playlistName}" on Spotify
          </a>
        )}

        {data.note && (
          <p className="text-center text-[11px] sm:text-xs text-zinc-400 font-medium mt-5">{data.note}</p>
        )}
      </div>

      <style>{`
        @keyframes eqBar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}
