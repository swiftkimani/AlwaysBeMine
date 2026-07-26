import { useState } from "react";

export default function PromiseBuilder({ data, title, subtitle }) {
  const [flippedCards, setFlippedCards] = useState(new Set());

  const toggleCard = (idx) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Charm, serif" }}>
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {data.map((promise, idx) => (
          <div
            key={idx}
            onClick={() => toggleCard(idx)}
            className="cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            <div
              className={`relative w-full h-44 md:h-48 transition-transform duration-500 ${
                flippedCards.has(idx) ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 border border-white/25 shadow-xl ${
                  flippedCards.has(idx) ? "[visibility:hidden]" : ""
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">💝</span>
                  <p className="text-sm text-zinc-500 font-bold">Promise #{idx + 1}</p>
                  <p className="text-xs text-zinc-400 mt-2 bg-white/10 px-3 py-1 rounded-full">Tap to reveal</p>
                </div>
              </div>

              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 border border-rose-200/30 shadow-xl ${
                  !flippedCards.has(idx) ? "[visibility:hidden]" : ""
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(236,72,153,0.12))",
                  backdropFilter: "blur(12px)",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-zinc-800 text-sm md:text-base text-center leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
                  {promise}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
