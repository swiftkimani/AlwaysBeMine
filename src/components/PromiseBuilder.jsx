import { useState, useEffect } from "react";

export default function PromiseBuilder({ data, title, subtitle, onProgress }) {
  const [flippedCards, setFlippedCards] = useState(new Set());

  const pct = Math.round((flippedCards.size / data.length) * 100);

  useEffect(() => {
    onProgress?.({ completed: flippedCards.size, total: data.length });
  }, [flippedCards.size, data.length, onProgress]);

  const toggleCard = (idx) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allFlipped = flippedCards.size === data.length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-5">
        <h2 className="text-xl md:text-3xl font-bold text-zinc-900 mb-1" style={{ fontFamily: "Charm, serif" }}>
          {title}
        </h2>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>

      {/* Progress */}
      <div className="glass-card p-3 md:p-4 mb-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-sm">🤝</div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-zinc-600">Promises Sealed</p>
          <div className="progress-bar mt-1">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="text-[10px] text-zinc-500">{flippedCards.size}/{data.length}</span>
        <span className="xp-badge">+{flippedCards.size * 15} XP</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
        {data.map((promise, idx) => {
          const isFlipped = flippedCards.has(idx);
          return (
            <div
              key={idx}
              onClick={() => toggleCard(idx)}
              className="cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              <div
                className={`relative w-full h-40 md:h-44 transition-transform duration-500`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center p-5 border border-zinc-200 shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,250,245,0.95))",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform duration-300">
                      {isFlipped ? "💝" : "💝"}
                    </span>
                    <p className="text-xs text-zinc-500 font-bold">Promise #{idx + 1}</p>
                    <p className="text-[10px] text-zinc-400 mt-1.5 bg-zinc-50 px-2.5 py-0.5 rounded-full inline-block border border-zinc-200">
                      {isFlipped ? "Tap to hide" : "Tap to reveal"}
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center p-5 border border-rose-200/50 shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(135deg, rgba(255,250,250,0.95), rgba(255,240,245,0.95))",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-center">
                    <p className="text-zinc-800 text-xs md:text-sm leading-relaxed mb-2" style={{ fontFamily: "Charm, serif" }}>
                      {promise}
                    </p>
                    <span className="text-[10px] text-rose-400 font-bold">Sealed with love 💕</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All done */}
      {allFlipped && (
        <div className="glass-card mt-4 p-4 md:p-5 text-center animate-bounce-in border-l-4 border-rose-400">
          <p className="text-sm text-zinc-800 font-bold" style={{ fontFamily: "Charm, serif" }}>
            All {data.length} promises revealed! Every single one is from the heart. 🥰
          </p>
        </div>
      )}
    </div>
  );
}
