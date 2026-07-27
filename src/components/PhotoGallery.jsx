import { useState } from "react";
import { BsX, BsChevronLeft, BsChevronRight, BsHeartFill } from "react-icons/bs";

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

  const handleReaction = (emoji) => {
    if (activeIdx === null) return;
    setReactions((prev) => ({
      ...prev,
      [activeIdx]: emoji,
    }));
  };

  const pct = Math.round((viewed.size / data.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* Gallery Header */}
      <div className="liquid p-5 sm:p-7 mb-6 md:mb-8 flex items-center gap-4 rounded-3xl border border-white/80 shadow-xl">
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
        <span className="xp-badge shrink-0 px-3 py-1 font-bold">
          +{viewed.size * 10} XP
        </span>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 p-2 sm:p-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleView(idx)}
            className={`relative p-2 sm:p-3 pb-10 sm:pb-12 cursor-pointer group transition-all duration-500 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.25)] hover:-translate-y-3 hover:scale-105 hover:z-20 bg-[#fdfbf9] border border-zinc-200 aspect-[4/5] flex flex-col ${
              ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1", "-rotate-3", "rotate-3"][idx % 6]
            }`}
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
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-end bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="w-[75vw] h-[100dvh] relative bg-zinc-950 shadow-[-20px_0_80px_rgba(0,0,0,0.5)] flex flex-col rounded-l-[2rem] overflow-hidden"
            style={{ animation: "modal-slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-100 hover:bg-rose-100 text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer z-10 border border-zinc-200"
              aria-label="Close photo preview"
            >
              <BsX size={20} />
            </button>

            {/* Prev/Next arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-xl flex items-center justify-center transition-all cursor-pointer z-10 border border-white"
              aria-label="Previous photo"
            >
              <BsChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-xl flex items-center justify-center transition-all cursor-pointer z-10 border border-white"
              aria-label="Next photo"
            >
              <BsChevronRight size={18} />
            </button>

            {/* Image display */}
            <div className="w-full max-h-[55vh] overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center shadow-inner my-2">
              {data[activeIdx].src ? (
                <img
                  src={data[activeIdx].src}
                  alt={data[activeIdx].caption}
                  className="max-h-[55vh] w-auto object-contain rounded-xl"
                />
              ) : (
                <div
                  className={`bg-gradient-to-br ${
                    data[activeIdx].color || "from-rose-400 to-purple-500"
                  } w-full h-72 flex items-center justify-center rounded-xl`}
                >
                  <span className="text-7xl animate-pulse">
                    {["📸", "🌅", "💕", "✨", "🎭", "🌸"][activeIdx % 6]}
                  </span>
                </div>
              )}
            </div>

            {/* Caption & Reaction row */}
            <p
              className="text-base sm:text-lg text-zinc-900 font-black text-center mt-3 leading-relaxed"
              style={{ fontFamily: "Charm, serif" }}
            >
              {data[activeIdx].caption} 💕
            </p>

            {/* Reaction Heart Bar */}
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-zinc-100 w-full justify-center">
              <span className="text-xs text-zinc-400 font-bold">React:</span>
              {["💕", "🥰", "😍", "💖", "🔥"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`w-9 h-9 rounded-full text-base flex items-center justify-center transition-all cursor-pointer ${
                    reactions[activeIdx] === emoji
                      ? "bg-rose-500 text-white scale-110 shadow-md"
                      : "bg-zinc-100 hover:bg-rose-50 hover:scale-110"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-black text-rose-500 mt-2 uppercase tracking-widest">
              Memory {activeIdx + 1} of {data.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
