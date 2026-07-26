import { useState, useEffect } from "react";

export default function ReasonsJar({ data, onProgress }) {
  const [revealedReasons, setRevealedReasons] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [currentReason, setCurrentReason] = useState(null);

  const unrevealedCount = data.length - revealedReasons.length;
  const allRevealed = unrevealedCount === 0;
  const pct = Math.round((revealedReasons.length / data.length) * 100);

  useEffect(() => {
    onProgress?.({ completed: revealedReasons.length, total: data.length });
  }, [revealedReasons.length, data.length, onProgress]);

  const pullReason = () => {
    if (allRevealed || isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      const unrevealed = data.filter((_, i) => !revealedReasons.includes(i));
      const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      const idx = data.indexOf(picked);
      setRevealedReasons((prev) => [...prev, idx]);
      setCurrentReason(idx);
      setIsShaking(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Jar Section */}
      <div className="glass-card p-5 md:p-6 text-center">
        <div className="relative mb-5">
          <div
            className={`mx-auto w-40 h-48 md:w-48 md:h-56 relative cursor-pointer transition-transform duration-300 ${isShaking ? "animate-shake" : "hover:scale-105"}`}
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
              {/* Fill level indicator */}
              <rect x="35" y={60 + 180 * (1 - unrevealedCount / data.length)} width="130" height={180 * (unrevealedCount / data.length)} rx="12" fill="rgba(244,63,94,0.08)" />
              {/* Hearts */}
              {data.map((_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const x = 55 + col * 28;
                const y = 85 + row * 35;
                const revealed = revealedReasons.includes(i);
                return (
                  <text key={i} x={x} y={y} fontSize="16" className={`transition-all duration-500 ${revealed ? "opacity-0" : "opacity-90"}`}>
                    💝
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Pull Button */}
          {!allRevealed ? (
            <button onClick={pullReason} disabled={isShaking} className="btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-sm mt-4">
              {isShaking ? "Shaking... 🫙" : `Pull a Reason 💝 (${unrevealedCount} left)`}
            </button>
          ) : (
            <div className="animate-bounce-in">
              <p className="text-base text-zinc-600 font-bold" style={{ fontFamily: "Charm, serif" }}>
                You&apos;ve seen all {data.length} reasons! 🥰
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="xp-badge">+{revealedReasons.length * 10} XP</span>
        </div>
      </div>

      {/* Current Reason Popup */}
      {currentReason !== null && !isShaking && (
        <div className="glass-card mt-3 p-4 animate-bounce-in border-l-4 border-rose-400">
          <p className="text-xs font-bold text-rose-400 mb-1">Reason #{revealedReasons.length}</p>
          <p className="text-sm text-zinc-800 font-medium" style={{ fontFamily: "Charm, serif" }}>
            {data[currentReason]} 💝
          </p>
        </div>
      )}

      {/* Revealed List */}
      {revealedReasons.length > 1 && (
        <div className="mt-3 space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar">
          {revealedReasons.slice().reverse().map((idx, i) => (
            <div key={idx} className="glass-card p-3 flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
              <span className="w-6 h-6 rounded-full bg-rose-500/15 flex items-center justify-center text-[10px] font-bold text-rose-500 shrink-0 mt-0.5">
                {revealedReasons.indexOf(idx) + 1}
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
                {data[idx]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
