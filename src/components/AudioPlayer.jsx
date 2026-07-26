import { useState, useEffect, useRef, useCallback } from "react";
import { BsPlayFill, BsPauseFill, BsSkipForwardFill, BsSkipBackwardFill, BsVolumeUpFill, BsVolumeMuteFill, BsHeartFill } from "react-icons/bs";

export default function AudioPlayer({ tracks, onTrackChange }) {
  const audioRef = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(new Set());
  const animRef = useRef(null);

  const track = tracks[currentIdx];

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress(dur ? (cur / dur) * 100 : 0);
    }
    animRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(updateProgress);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, updateProgress]);

  useEffect(() => {
    if (!track?.src) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;
    }
    const audio = audioRef.current;
    audio.src = track.src;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
    onTrackChange?.(track);
  }, [track, isPlaying, onTrackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => {
      setCurrentIdx((prev) => (prev + 1) % tracks.length);
    };
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [tracks.length]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const skipNext = () => {
    setCurrentIdx((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const skipPrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentIdx((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
    setProgress(0);
  };

  const seek = (e) => {
    if (!audioRef.current) return;
    const val = Number(e.target.value);
    audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    setProgress(val);
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  if (!track) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ${isExpanded ? "pb-0" : "pb-[var(--safe-bottom)]"}`}>
      {/* Mini Player Bar */}
      <div className="glass-card mx-2 mb-2 md:mx-4 md:mb-3 p-3 md:p-4 flex items-center gap-3 md:gap-4">
        {/* Track Info */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer bg-transparent border-0"
        >
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isPlaying ? "bg-gradient-to-br from-rose-500 to-pink-500 animate-pulse-glow" : "bg-white/15"}`}>
            {isPlaying ? (
              <div className="flex gap-0.5 items-end h-5">
                <span className="w-0.5 bg-white animate-bounce" style={{ height: "60%", animationDelay: "0ms" }} />
                <span className="w-0.5 bg-white animate-bounce" style={{ height: "100%", animationDelay: "150ms" }} />
                <span className="w-0.5 bg-white animate-bounce" style={{ height: "40%", animationDelay: "300ms" }} />
                <span className="w-0.5 bg-white animate-bounce" style={{ height: "80%", animationDelay: "75ms" }} />
              </div>
            ) : (
              <span className="text-lg">🎵</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-bold text-zinc-800 truncate">{track.title}</p>
            <p className="text-[10px] md:text-xs text-zinc-500 truncate">{track.artist}</p>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <button onClick={skipPrev} className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white/15 transition-all cursor-pointer" aria-label="Previous">
            <BsSkipBackwardFill size={14} />
          </button>
          <button onClick={togglePlay} className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <BsPauseFill size={18} /> : <BsPlayFill size={18} className="ml-0.5" />}
          </button>
          <button onClick={skipNext} className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white/15 transition-all cursor-pointer" aria-label="Next">
            <BsSkipForwardFill size={14} />
          </button>
        </div>

        {/* Like + Mute */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleLike} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${liked.has(currentIdx) ? "text-rose-500" : "text-zinc-400 hover:text-rose-400"}`} aria-label="Like">
            <BsHeartFill size={14} fill={liked.has(currentIdx) ? "currentColor" : "none"} />
          </button>
          <button onClick={toggleMute} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer" aria-label="Mute">
            {isMuted ? <BsVolumeMuteFill size={14} /> : <BsVolumeUpFill size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Tracklist */}
      {isExpanded && (
        <div className="glass-card mx-2 mb-2 md:mx-4 md:mb-3 p-4 max-h-[40vh] overflow-y-auto no-scrollbar animate-fade-in-up">
          {/* Progress Bar */}
          <div className="mb-4">
            <input type="range" min="0" max="100" value={progress} onChange={seek} className="audio-progress w-full" />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-1.5">
            {tracks.map((t, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentIdx(idx); setProgress(0); setIsPlaying(true); }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                  idx === currentIdx
                    ? "bg-gradient-to-r from-rose-500/15 to-pink-500/15 border border-rose-200/30"
                    : "hover:bg-white/10 border border-transparent"
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${idx === currentIdx ? "bg-rose-500 text-white" : "bg-white/10 text-zinc-500"}`}>
                  {idx === currentIdx && isPlaying ? (
                    <div className="flex gap-px items-end h-3">
                      <span className="w-px bg-white" style={{ height: "60%", animation: "float 0.6s ease-in-out infinite" }} />
                      <span className="w-px bg-white" style={{ height: "100%", animation: "float 0.6s ease-in-out 0.15s infinite" }} />
                      <span className="w-px bg-white" style={{ height: "40%", animation: "float 0.6s ease-in-out 0.3s infinite" }} />
                    </div>
                  ) : (
                    idx + 1
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold truncate ${idx === currentIdx ? "text-rose-600" : "text-zinc-800"}`}>{t.title}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{t.artist}</p>
                </div>
                {t.duration && <span className="text-[10px] text-zinc-400 shrink-0">{t.duration}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
