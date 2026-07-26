import { useState } from "react";

export default function PhotoGallery({ data, onProgress }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [viewed, setViewed] = useState(new Set());

  const handleView = (idx) => {
    setActiveIdx(activeIdx === idx ? null : idx);
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(idx);
      onProgress?.({ completed: next.size, total: data.length });
      return next;
    });
  };

  const pct = Math.round((viewed.size / data.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Gallery Header */}
      <div className="glass-card p-4 md:p-5 mb-4 md:mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm shrink-0">
          📸
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-zinc-700">Memory Lane</p>
          <div className="progress-bar mt-1">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="text-[10px] text-zinc-500">{viewed.size}/{data.length} memories</span>
        <span className="xp-badge">+{viewed.size * 10} XP</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleView(idx)}
            className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-500 shadow-lg hover:shadow-2xl ${
              activeIdx === idx ? "col-span-2 row-span-2" : ""
            }`}
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.caption}
                className={`w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  activeIdx === idx ? "h-56 md:h-80" : "h-32 md:h-44"
                }`}
              />
            ) : (
              <div className={`bg-gradient-to-br ${item.color} w-full transition-all duration-500 flex items-center justify-center ${
                activeIdx === idx ? "h-56 md:h-80" : "h-32 md:h-44"
              }`}>
                <span className="text-4xl opacity-50 group-hover:scale-125 transition-transform duration-300">
                  {["📸", "🌅", "💕", "✨", "🎭", "🌸"][idx % 6]}
                </span>
              </div>
            )}

            {/* Viewed badge */}
            {viewed.has(idx) && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] z-10 shadow-sm">
                ✓
              </div>
            )}

            {/* Caption overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-3 transition-opacity duration-300 ${
              activeIdx === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
              <p className="text-white text-xs md:text-sm font-medium leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Active caption */}
      {activeIdx !== null && (
        <div className="glass-card mt-3 p-4 text-center animate-fade-in">
          <p className="text-sm text-zinc-800 font-medium" style={{ fontFamily: "Charm, serif" }}>
            {data[activeIdx].caption} 💕
          </p>
        </div>
      )}
    </div>
  );
}
