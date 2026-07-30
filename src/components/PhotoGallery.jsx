import { useState } from "react";
import { BsX, BsChevronLeft, BsChevronRight, BsHeartFill } from "react-icons/bs";
import { createPortal } from "react-dom";
import { useRomance } from "../RomanceFX.jsx";

const memoryLabels = [
  "📸 First Date",
  "🌅 Sunsets",
  "💕 Sweet Moments",
  "✨ Magic Days",
  "🎭 Laughs Together",
  "🌸 Forever Love",
];

export default function PhotoGallery({ data, onProgress }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [viewed, setViewed] = useState(new Set());
  const [reactions, setReactions] = useState({});
  const { burstFromEvent } = useRomance();

  const handleView = (idx) => {
    setActiveIdx(idx);
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(idx);
      onProgress?.({ completed: next.size, total: data.length });
      return next;
    });
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    const nextIdx = (activeIdx - 1 + data.length) % data.length;
    handleView(nextIdx);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    const nextIdx = (activeIdx + 1) % data.length;
    handleView(nextIdx);
  };

  const handleReaction = (emoji, e) => {
    if (activeIdx === null) return;
    setReactions((prev) => ({
      ...prev,
      [activeIdx]: emoji,
    }));
    burstFromEvent(e, emoji);
  };

  const pct = Math.round((viewed.size / data.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* Gallery Header */}
      <div className="liquid card-pad-sm mb-6 md:mb-8 flex items-center gap-4 rounded-3xl border border-white/80 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl shrink-0 shadow-md">
          📸
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm sm:text-base font-black text-zinc-800">
              Memory Lane 💖
            </p>
            <span className="text-xs font-bold text-zinc-500">
              {viewed.size}/{data.length} memories
            </span>
          </div>
          <div className="progress-bar h-2.5">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="xp-badge shrink-0 font-bold">
          +{viewed.size * 10} XP
        </span>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-7 md:gap-9 p-1 sm:p-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleView(idx)}
            className={`gallery-item relative p-2.5 sm:p-3.5 pb-10 sm:pb-12 cursor-pointer group transition-all duration-500 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_-5px_rgba(225,29,72,0.3)] hover:-translate-y-4 hover:scale-[1.15] hover:z-30 bg-[#fdfbf9] border-2 border-white aspect-[4/5] flex flex-col ${
              ["-rotate-2", "rotate-3", "-rotate-1", "rotate-2", "-rotate-3", "rotate-1"][idx % 6]
            } ${["hover:rotate-2", "hover:-rotate-2", "hover:rotate-1", "hover:-rotate-3"][idx % 4]}`}
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Washi Tape */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-6 bg-white/40 backdrop-blur-sm shadow-sm border border-white/50 z-20 ${["-rotate-3", "rotate-2", "rotate-4", "-rotate-2", "rotate-1", "-rotate-4"][idx % 6]}`} />

            <div className="relative w-full flex-1 overflow-hidden shadow-inner bg-zinc-100">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`bg-gradient-to-br ${
                    item.color || "from-rose-400 via-pink-400 to-purple-500"
                  } w-full h-full flex flex-col items-center justify-center p-4 text-center`}
                >
                  <span className="text-4xl sm:text-5xl opacity-80 group-hover:scale-125 transition-transform duration-300">
                    {["📸", "🌅", "💕", "✨", "🎭", "🌸"][idx % 6]}
                  </span>
                </div>
              )}
            </div>

            {/* Top Memory Label Chip (Now a fun badge) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="text-[9px] sm:text-[10px] font-black text-rose-600 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-100 shadow-sm uppercase tracking-wider">
                {memoryLabels[idx % memoryLabels.length]}
              </span>
            </div>

            {/* Polaroid Caption */}
            <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2 text-center pointer-events-none">
              <p className="text-zinc-800 text-sm sm:text-base font-bold truncate px-1" style={{ fontFamily: "'Charm', cursive" }}>
                {item.caption}
              </p>
            </div>

            {/* Reaction badge if reacted */}
            {reactions[idx] && (
              <div className="absolute -right-3 -bottom-3 w-10 h-10 rounded-full bg-white text-2xl flex items-center justify-center shadow-xl z-20 border-2 border-rose-100 animate-bounce-short">
                {reactions[idx]}
              </div>
            )}

            {/* Viewed badge */}
            {viewed.has(idx) && !reactions[idx] && (
              <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg z-10 rotate-12 border-2 border-white">
                <BsHeartFill size={14} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Premium Lightbox Modal */}
      {/* Premium Lightbox Modal */}
      {activeIdx !== null && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col md:flex-row items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4 sm:p-10 gap-6 md:gap-12 overflow-hidden cursor-pointer"
          onClick={() => setActiveIdx(null)}
        >
          {/* Top Bar / Close */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 backdrop-blur-md border border-white/20 hover:scale-110"
            aria-label="Close photo preview"
          >
            <BsX size={28} className="sm:w-8 sm:h-8" />
          </button>

          {/* Image Container */}
          <div
            className="relative w-full md:w-[65%] h-[50vh] md:h-[85vh] flex items-center justify-center group gallery-item cursor-auto"
            style={{ animation: "modal-slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Prev/Next arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-zinc-900 backdrop-blur-md shadow-xl flex items-center justify-center transition-all cursor-pointer z-10 border border-white/20 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                aria-label="Previous photo"
              >
                <BsChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-zinc-900 backdrop-blur-md shadow-xl flex items-center justify-center transition-all cursor-pointer z-10 border border-white/20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                aria-label="Next photo"
              >
                <BsChevronRight size={24} />
              </button>

              {/* Image display */}
              {data[activeIdx].src ? (
                <img
                  src={data[activeIdx].src}
                  alt={data[activeIdx].caption}
                  className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
                />
              ) : (
                <div
                  className={`bg-gradient-to-br ${
                    data[activeIdx].color || "from-rose-400 to-purple-500"
                  } w-full h-full flex items-center justify-center rounded-2xl`}
                >
                  <span className="text-7xl animate-pulse">
                    {["📸", "🌅", "💕", "✨", "🎭", "🌸"][activeIdx % 6]}
                  </span>
                </div>
              )}
            </div>

            {/* Sidebar / Info panel */}
            <div
              className="w-full md:w-[35%] max-w-md flex flex-col items-center md:items-start justify-center gap-4 sm:gap-6 bg-white/5 backdrop-blur-xl card-pad rounded-3xl sm:rounded-[2rem] border border-white/10 shadow-2xl cursor-auto"
              style={{ animation: "modal-slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] border border-rose-400/30 pill-pad rounded-full">
                Memory {activeIdx + 1} of {data.length}
              </span>
              
              <p
                className="text-2xl sm:text-5xl text-white font-bold text-center md:text-left leading-tight"
                style={{ fontFamily: "Charm, serif" }}
              >
                {data[activeIdx].caption} 💕
              </p>

              {/* Reaction Heart Bar */}
              <div className="flex flex-col gap-2 sm:gap-3 w-full mt-2 sm:mt-4">
                <span className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-wider text-center md:text-left">How did this make you feel?</span>
                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                  {["💕", "🥰", "😍", "💖", "🔥"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => { e.stopPropagation(); handleReaction(emoji, e); }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer ${
                        reactions[activeIdx] === emoji
                          ? "bg-rose-500 text-white scale-125 shadow-[0_0_20px_rgba(225,29,72,0.6)]"
                          : "bg-white/10 hover:bg-white/20 text-white hover:scale-110 border border-white/10"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
