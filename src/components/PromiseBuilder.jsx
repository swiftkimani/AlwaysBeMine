import { useState, useEffect } from "react";
import { useRomance } from "../RomanceFX.jsx";

export default function PromiseBuilder({ data, title, subtitle, onProgress }) {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const { burstFromEvent } = useRomance();

  const pct = Math.round((flippedCards.size / data.length) * 100);

  useEffect(() => {
    onProgress?.({ completed: flippedCards.size, total: data.length });
  }, [flippedCards.size, data.length, onProgress]);

  const toggleCard = (idx, e) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
        burstFromEvent(e, "💝");
      }
      return next;
    });
  };

  const allFlipped = flippedCards.size === data.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* Title */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 mb-1" style={{ fontFamily: "Charm, serif" }}>
          {title}
        </h2>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>

      {/* Progress */}
      <div className="liquid card-pad-sm mb-6 flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-base shrink-0">🤝</div>
        <div className="flex-1">
          <p className="text-xs font-bold text-zinc-700">Promises Sealed</p>
          <div className="progress-bar mt-1.5">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="text-xs font-semibold text-zinc-500 shrink-0">{flippedCards.size}/{data.length}</span>
        <span className="xp-badge shrink-0">+{flippedCards.size * 15} XP</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {data.map((promise, idx) => {
          const isFlipped = flippedCards.has(idx);
          return (
            <div
              key={idx}
              onClick={(e) => toggleCard(idx, e)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(idx, e); } }}
              className="cursor-pointer group"
              style={{ perspective: "1000px" }}
              role="button"
              tabIndex={0}
              aria-label={`Promise #${idx + 1}. ${isFlipped ? "Currently showing promise. Tap to hide." : "Tap to reveal promise."}`}
              aria-expanded={isFlipped}
            >
              <div
                className={`relative w-full h-52 sm:h-56 transition-transform duration-500`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 sm:p-7 border border-zinc-200/80 shadow-lg group-hover:shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,250,245,0.95))",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-center">
                    <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                      💝
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-700 font-bold">Promise #{idx + 1}</p>
                    <p className="text-[10px] text-zinc-400 mt-3 bg-zinc-100/80 pill-pad rounded-full inline-block border border-zinc-200">
                      Tap to reveal ✨
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 sm:p-7 border border-rose-200/80 shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(135deg, rgba(255,250,250,0.95), rgba(255,240,245,0.95))",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <p className="text-zinc-800 text-xs sm:text-sm md:text-base font-medium mb-3" style={{ fontFamily: "Charm, serif", lineHeight: 1.75 }}>
                      {promise}
                    </p>
                    <span className="text-[10px] text-rose-500 font-bold bg-rose-50 pill-pad rounded-full border border-rose-200">Sealed with love 💕</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All done */}
      {allFlipped && (
        <div className="liquid mt-5 card-pad-sm text-center animate-bounce-in border-l-4 border-rose-500 shadow-md">
          <p className="text-sm sm:text-base text-zinc-800 font-bold" style={{ fontFamily: "Charm, serif" }}>
            All {data.length} promises revealed! Every single one is from the heart. 🥰
          </p>
        </div>
      )}
    </div>
  );
}
