import { useState, useEffect, useRef, useCallback } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsHeartFill,
  BsX,
  BsMusicNoteBeamed,
} from "react-icons/bs";

const PANEL_W = 300;
const BTN_SIZE = 56;

export default function FloatingMusicControl({ tracks }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(new Set());

  const [pos, setPos] = useState({ x: 44, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const hasMoved = useRef(false);
  const audioRef = useRef(null);
  const animRef = useRef(null);
  const panelRef = useRef(null);

  const track = tracks?.[currentIdx];

  useEffect(() => {
    const update = () => {
      const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom")) || 0;
      setPos({ x: 44, y: window.innerHeight - 68 - safeBottom });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
  }, [track, isPlaying]);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setProgress(audioRef.current.duration ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0);
    }
    animRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    if (isPlaying) animRef.current = requestAnimationFrame(updateProgress);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, updateProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setCurrentIdx((p) => (p + 1) % tracks.length);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [tracks.length]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    hasMoved.current = false;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
      setPos({
        x: Math.max(BTN_SIZE / 2 + 8, Math.min(window.innerWidth - BTN_SIZE / 2 - 8, dragRef.current.startPosX + dx)),
        y: Math.max(80, Math.min(window.innerHeight - BTN_SIZE / 2 - 8, dragRef.current.startPosY + dy)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [isDragging]);

  const handleClick = () => { if (!hasMoved.current) setIsExpanded((p) => !p); };

  useEffect(() => {
    if (!isExpanded) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        const btn = e.target.closest("[data-music-btn]");
        if (!btn) setIsExpanded(false);
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [isExpanded]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const skipNext = () => { setCurrentIdx((p) => (p + 1) % tracks.length); setProgress(0); };
  const skipPrev = () => {
    if (audioRef.current?.currentTime > 3) audioRef.current.currentTime = 0;
    else setCurrentIdx((p) => (p - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const toggleMute = () => {
    const next = !isMuted;
    if (audioRef.current) audioRef.current.muted = next;
    setIsMuted(next);
  };

  const seek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    setProgress(val);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => { const n = new Set(p); n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx); return n; });
  };

  const fmt = (s) => { if (!s || isNaN(s)) return "0:00"; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };

  if (!track) return null;

  const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--safe-bottom")) || 0;
  const btnLeft = Math.max(PANEL_W / 2 + 8, Math.min(pos.x, window.innerWidth - PANEL_W / 2 - 8));

  const panelAbove = pos.y > 320;
  const panelBottom = panelAbove ? undefined : BTN_SIZE / 2 + 10;
  const panelTop = panelAbove ? undefined : -(PANEL_W > 280 ? 340 : 300);

  return (
    <>
      {isExpanded && (
        <div
          ref={panelRef}
          className="fixed z-[60] animate-fade-in-up"
          style={{
            left: btnLeft,
            bottom: panelAbove ? window.innerHeight - pos.y + BTN_SIZE / 2 + 10 : undefined,
            top: panelAbove ? undefined : window.innerHeight - pos.y + BTN_SIZE / 2 + 10,
            transform: "translateX(-50%)",
            width: PANEL_W,
          }}
        >
          <div className="liquid rounded-2xl p-3.5 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isPlaying ? "bg-gradient-to-br from-rose-500 to-pink-500 animate-pulse-glow" : "bg-white/30"}`}>
                {isPlaying ? (
                  <div className="flex gap-0.5 items-end h-3.5">
                    <span className="w-0.5 bg-white animate-bounce" style={{ height: "60%", animationDelay: "0ms" }} />
                    <span className="w-0.5 bg-white animate-bounce" style={{ height: "100%", animationDelay: "150ms" }} />
                    <span className="w-0.5 bg-white animate-bounce" style={{ height: "40%", animationDelay: "300ms" }} />
                  </div>
                ) : <BsMusicNoteBeamed size={14} className="text-rose-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-zinc-800 truncate">{track.title}</p>
                <p className="text-[9px] text-zinc-500 truncate">{track.artist}</p>
              </div>
              <button onClick={() => setIsExpanded(false)} className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-white/50 transition-all cursor-pointer" aria-label="Close">
                <BsX size={14} />
              </button>
            </div>

            <div className="mb-2.5">
              <input type="range" min="0" max="100" value={progress} onChange={seek} className="audio-progress w-full" />
              <div className="flex justify-between text-[9px] text-zinc-400 mt-0.5">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 mb-2.5">
              <button onClick={toggleLike} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${liked.has(currentIdx) ? "text-rose-500" : "text-zinc-400 hover:text-rose-400 hover:bg-white/30"}`} aria-label="Like">
                <BsHeartFill size={13} fill={liked.has(currentIdx) ? "currentColor" : "none"} />
              </button>
              <button onClick={skipPrev} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white/40 transition-all cursor-pointer" aria-label="Previous">
                <BsSkipBackwardFill size={14} />
              </button>
              <button onClick={togglePlay} className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <BsPauseFill size={18} /> : <BsPlayFill size={18} className="ml-0.5" />}
              </button>
              <button onClick={skipNext} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-white/40 transition-all cursor-pointer" aria-label="Next">
                <BsSkipForwardFill size={14} />
              </button>
              <button onClick={toggleMute} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-white/30 transition-all cursor-pointer" aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <BsVolumeMuteFill size={12} /> : <BsVolumeUpFill size={12} />}
              </button>
            </div>

            <div className="space-y-0.5 max-h-[130px] overflow-y-auto no-scrollbar border-t border-white/30 pt-2">
              {tracks.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentIdx(idx); setProgress(0); setIsPlaying(true); }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer text-left ${idx === currentIdx ? "bg-rose-50/80 border border-rose-200/60" : "hover:bg-white/30 border border-transparent"}`}
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${idx === currentIdx ? "bg-rose-500 text-white" : "bg-white/40 text-zinc-500"}`}>
                    {idx === currentIdx && isPlaying ? "▶" : idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-bold truncate ${idx === currentIdx ? "text-rose-600" : "text-zinc-800"}`}>{t.title}</p>
                    <p className="text-[8px] text-zinc-500 truncate">{t.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Connector arrow pointing down to button */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ [panelAbove ? "bottom" : "top"]: "-8px" }}
          >
            <div
              className="w-4 h-4 rotate-45 liquid"
              style={{ borderRadius: "3px" }}
            />
          </div>
        </div>
      )}

      <div
        data-music-btn
        className="fixed z-50 select-none"
        style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <div className={`liquid rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-xl transition-all duration-300 ${isDragging ? "scale-110 shadow-2xl" : "hover:scale-105"} ${isPlaying ? "ring-2 ring-rose-400/60 animate-pulse-glow" : ""}`}>
          {isPlaying ? (
            <div className="flex gap-0.5 items-end h-5">
              <span className="w-[3px] rounded-full bg-rose-500 animate-bounce" style={{ height: "60%", animationDelay: "0ms" }} />
              <span className="w-[3px] rounded-full bg-pink-500 animate-bounce" style={{ height: "100%", animationDelay: "150ms" }} />
              <span className="w-[3px] rounded-full bg-rose-400 animate-bounce" style={{ height: "40%", animationDelay: "300ms" }} />
              <span className="w-[3px] rounded-full bg-pink-400 animate-bounce" style={{ height: "80%", animationDelay: "75ms" }} />
            </div>
          ) : (
            <BsMusicNoteBeamed size={22} className="text-rose-500" />
          )}
        </div>
      </div>
    </>
  );
}
