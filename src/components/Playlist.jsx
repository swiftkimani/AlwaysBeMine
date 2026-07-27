import { useState, useRef, useEffect, useCallback } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsHeartFill,
  BsMusicNoteBeamed,
} from "react-icons/bs";

export default function Playlist({ data, compact }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(new Set());

  const audioRef = useRef(null);
  const animRef = useRef(null);

  const tracks = data?.tracks || [];
  const track = tracks[activeIdx];

  useEffect(() => {
    if (!track?.src) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
    const audio = audioRef.current;
    audio.src = track.src;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [track, isPlaying]);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setProgress(
        audioRef.current.duration
          ? (audioRef.current.currentTime / audioRef.current.duration) * 100
          : 0
      );
    }
    animRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    if (isPlaying) animRef.current = requestAnimationFrame(updateProgress);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, updateProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setActiveIdx((p) => (p + 1) % tracks.length);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [tracks.length]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const skipNext = () => {
    setActiveIdx((p) => (p + 1) % tracks.length);
    setProgress(0);
  };
  const skipPrev = () => {
    if (audioRef.current?.currentTime > 3) audioRef.current.currentTime = 0;
    else setActiveIdx((p) => (p - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const toggleMute = () => {
    const next = !isMuted;
    if (audioRef.current) audioRef.current.muted = next;
    setIsMuted(next);
  };

  const seek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current)
      audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    setProgress(val);
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
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  if (!tracks.length) return null;

  if (compact) {
    return (
      <div className="liquid p-4 w-72 rounded-2xl border border-white/80">
        <p
          className="text-xs font-bold text-zinc-700 mb-3"
          style={{ fontFamily: "Charm, serif" }}
        >
          🎵 {data.title || "Our Songs"}
        </p>
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto no-scrollbar">
          {tracks.slice(0, 5).map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIdx(idx);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all cursor-pointer ${
                idx === activeIdx
                  ? "bg-rose-50 border border-rose-200"
                  : "hover:bg-zinc-50 border border-transparent"
              }`}
            >
              <span
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  idx === activeIdx
                    ? "bg-rose-500 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {idx === activeIdx && isPlaying ? "▶" : idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[11px] font-bold truncate ${
                    idx === activeIdx ? "text-rose-600" : "text-zinc-800"
                  }`}
                >
                  {t.title}
                </p>
                <p className="text-[9px] text-zinc-500 truncate">{t.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="liquid p-6 sm:p-8 md:p-10 rounded-3xl border border-white/80 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl mx-auto mb-3 shadow-lg shadow-rose-500/30">
            🎵
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black text-zinc-900 mb-1"
            style={{ fontFamily: "Charm, serif" }}
          >
            {data.title || "Our Love Songs"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-semibold">
            {data.subtitle || "Songs that remind me of us 💕"}
          </p>
          <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
        </div>

        {/* Built-in Audio Player Hero Card */}
        {track && (
          <div className="bg-gradient-to-br from-white/95 via-rose-50/80 to-pink-50/90 rounded-3xl p-6 sm:p-8 mb-8 border border-white shadow-xl relative overflow-hidden">
            {/* Ambient blur glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              {/* Animated Disc / Equalizer */}
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-xl ${
                  isPlaying
                    ? "bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 scale-105 shadow-rose-500/40"
                    : "bg-gradient-to-br from-zinc-100 to-zinc-200"
                }`}
              >
                {isPlaying ? (
                  <div className="flex gap-1 items-end h-8">
                    {[0, 150, 300, 450].map((delay) => (
                      <span
                        key={delay}
                        className="w-1 bg-white rounded-full"
                        style={{
                          height: "100%",
                          animation: `eqBar 0.6s ease-in-out ${delay}ms infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <BsMusicNoteBeamed size={36} className="text-zinc-400" />
                )}
              </div>

              {/* Track Metadata & Controls */}
              <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-200">
                    Now Playing #{activeIdx + 1}
                  </span>
                  <button
                    onClick={(e) => toggleLike(activeIdx, e)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      liked.has(activeIdx)
                        ? "text-rose-500 bg-rose-100"
                        : "text-zinc-400 hover:text-rose-400 hover:bg-zinc-100"
                    }`}
                    aria-label="Like track"
                  >
                    <BsHeartFill size={14} />
                  </button>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-zinc-900 truncate">
                  {track.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-zinc-500 truncate mb-4">
                  {track.artist}
                </p>

                {/* Seek Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={seek}
                    className="audio-progress w-full"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-1">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>

                {/* Player Buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <button
                    onClick={skipPrev}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                    aria-label="Previous track"
                  >
                    <BsSkipBackwardFill size={16} />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <BsPauseFill size={26} />
                    ) : (
                      <BsPlayFill size={26} className="ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={skipNext}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                    aria-label="Next track"
                  >
                    <BsSkipForwardFill size={16} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-white transition-all cursor-pointer ml-auto"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <BsVolumeMuteFill size={15} />
                    ) : (
                      <BsVolumeUpFill size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Track List */}
        <div className="space-y-3">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest px-1">
            ♫ All Track List ({tracks.length})
          </p>
          {tracks.map((t, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveIdx(idx);
                setIsPlaying(true);
              }}
              className={`flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                idx === activeIdx
                  ? "bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50/80 border-rose-200/90 shadow-md"
                  : "bg-white/60 hover:bg-white border-white/80 shadow-xs hover:shadow-sm"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${
                  idx === activeIdx
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-rose-400/40"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {idx === activeIdx && isPlaying ? "▶" : idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-black truncate ${
                    idx === activeIdx ? "text-rose-600" : "text-zinc-800"
                  }`}
                >
                  {t.title}
                </p>
                <p className="text-xs text-zinc-500 truncate font-semibold">
                  {t.artist}
                </p>
              </div>

              <button
                onClick={(e) => toggleLike(idx, e)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  liked.has(idx)
                    ? "text-rose-500 bg-rose-50"
                    : "text-zinc-300 hover:text-rose-400"
                }`}
              >
                <BsHeartFill size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
