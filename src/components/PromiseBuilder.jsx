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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Charm, serif" }}>
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((promise, idx) => (
          <div
            key={idx}
            onClick={() => toggleCard(idx)}
            className="perspective-1000 cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            <div
              className={`relative w-full h-40 transition-transform duration-500 transform-style-preserve-3d ${
                flippedCards.has(idx) ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 border border-white/20 shadow-xl backface-hidden ${
                  flippedCards.has(idx) ? "[visibility:hidden]" : ""
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">💝</span>
                  <p className="text-sm text-zinc-500 font-medium">Promise #{idx + 1}</p>
                  <p className="text-xs text-zinc-400 mt-1">Tap to reveal</p>
                </div>
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center p-6 border border-rose-200/30 shadow-xl backface-hidden [transform:rotateY(180deg)] ${
                  !flippedCards.has(idx) ? "[visibility:hidden]" : ""
                }`}
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, rgba(244,63,94,0.1), rgba(236,72,153,0.1))",
                  backdropFilter: "blur(10px)",
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
