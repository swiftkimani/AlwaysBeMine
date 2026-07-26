import { useState } from "react";

export default function ReasonsJar({ data }) {
  const [revealedReasons, setRevealedReasons] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  const unrevealedCount = data.length - revealedReasons.length;
  const allRevealed = unrevealedCount === 0;

  const pullReason = () => {
    if (allRevealed || isShaking) return;

    setIsShaking(true);
    setTimeout(() => {
      const unrevealed = data.filter((_, i) => !revealedReasons.includes(i));
      const randomIdx = data.indexOf(unrevealed[Math.floor(Math.random() * unrevealed.length)]);
      setRevealedReasons((prev) => [...prev, randomIdx]);
      setIsShaking(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 md:py-8 text-center">
      <div className="relative mb-8">
        <div
          className={`mx-auto w-48 h-56 md:w-56 md:h-64 relative cursor-pointer transition-transform duration-300 ${
            isShaking ? "animate-shake" : "hover:scale-105"
          }`}
          onClick={pullReason}
        >
          <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-xl">
            <defs>
              <linearGradient id="jarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
              </linearGradient>
              <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4956a" />
                <stop offset="100%" stopColor="#a07050" />
              </linearGradient>
            </defs>
            <rect x="30" y="60" width="140" height="180" rx="15" fill="url(#jarGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <rect x="40" y="40" width="120" height="30" rx="8" fill="url(#lidGrad)" stroke="#8b6340" strokeWidth="1.5" />
            {data.map((_, i) => {
              const x = 50 + (i % 4) * 28 + Math.random() * 10;
              const y = 80 + Math.floor(i / 4) * 35 + Math.random() * 10;
              const revealed = revealedReasons.includes(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  fontSize="18"
                  className={`transition-all duration-500 ${revealed ? "opacity-0" : "opacity-100"}`}
                >
                  💝
                </text>
              );
            })}
          </svg>
        </div>

        {!allRevealed ? (
          <button
            onClick={pullReason}
            disabled={isShaking}
            className="btn-glow bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {isShaking ? "Shaking... 🫙" : `Pull a Reason 💝 (${unrevealedCount} left)`}
          </button>
        ) : (
          <p className="text-lg text-zinc-600 font-bold" style={{ fontFamily: "Charm, serif" }}>
            You&apos;ve seen all the reasons! 🥰
          </p>
        )}
      </div>

      {revealedReasons.length > 0 && (
        <div className="space-y-3 mt-6">
          {revealedReasons.map((idx, i) => (
            <div
              key={idx}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/25 shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-zinc-800 font-medium text-sm md:text-base" style={{ fontFamily: "Charm, serif" }}>
                {i + 1}. {data[idx]} 💝
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
