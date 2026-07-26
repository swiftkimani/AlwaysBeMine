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
    <div className="w-full max-w-lg mx-auto px-4 py-8 text-center">
      <div className="relative mb-8">
        {/* Jar SVG */}
        <div
          className={`mx-auto w-48 h-56 relative cursor-pointer transition-transform duration-300 ${
            isShaking ? "animate-shake" : "hover:scale-105"
          }`}
          onClick={pullReason}
        >
          <svg viewBox="0 0 200 260" className="w-full h-full">
            {/* Jar body */}
            <rect x="30" y="60" width="140" height="180" rx="15" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            {/* Jar lid */}
            <rect x="40" y="40" width="120" height="30" rx="8" fill="rgba(180,140,100,0.8)" stroke="rgba(150,110,70,0.8)" strokeWidth="2" />
            {/* Hearts inside */}
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
            className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {isShaking ? "Shaking... 🫙" : `Pull a Reason 💝 (${unrevealedCount} left)`}
          </button>
        ) : (
          <p className="text-lg text-zinc-600 font-bold" style={{ fontFamily: "Charm, serif" }}>
            You've seen all the reasons! 🥰
          </p>
        )}
      </div>

      {revealedReasons.length > 0 && (
        <div className="space-y-3 mt-6">
          {revealedReasons.map((idx, i) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-zinc-800 font-medium" style={{ fontFamily: "Charm, serif" }}>
                {i + 1}. {data[idx]} 💝
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
