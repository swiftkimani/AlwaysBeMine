import { useState, useEffect } from "react";
import { useRomance } from "../RomanceFX.jsx";

const pullBurst = ["💝", "💕", "✨", "💖"];

export default function ReasonsJar({ data, onProgress }) {
  const [revealedReasons, setRevealedReasons] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [currentReason, setCurrentReason] = useState(null);
  const { burstFromEvent } = useRomance();

  const unrevealedCount = data.length - revealedReasons.length;
  const allRevealed = unrevealedCount === 0;
  const pct = Math.round((revealedReasons.length / data.length) * 100);

  useEffect(() => {
    onProgress?.({ completed: revealedReasons.length, total: data.length });
  }, [revealedReasons.length, data.length, onProgress]);

  const pullReason = (e) => {
    if (allRevealed || isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      const unrevealed = data.filter((_, i) => !revealedReasons.includes(i));
      const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      const idx = data.indexOf(picked);
      setRevealedReasons((prev) => [...prev, idx]);
      setCurrentReason(idx);
      setIsShaking(false);
      burstFromEvent(e, pullBurst[Math.floor(Math.random() * pullBurst.length)]);
    }, 600);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      {/* Jar Section Card */}
      <div className="liquid p-6 sm:p-8 md:p-10 text-center rounded-3xl border border-white/80 shadow-2xl">
        <div className="relative mb-6">
          {/* Animated Glass Jar SVG */}
          <div
            className={`mx-auto w-44 h-52 md:w-52 md:h-60 relative cursor-pointer transition-transform duration-300 ${
              isShaking ? "animate-shake" : "hover:scale-105 active:scale-95"
            }`}
            onClick={pullReason}
            role="button"
            tabIndex={0}
            aria-label={
              allRevealed
                ? "All reasons revealed"
                : `Pull a reason from the jar. ${unrevealedCount} remaining`
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pullReason();
              }
            }}
          >
            <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="jarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                  <stop offset="100%" stopColor="rgba(255,225,238,0.55)" />
                </linearGradient>
                <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Jar Body */}
              <rect
                x="30"
                y="60"
                width="140"
                height="180"
                rx="20"
                fill="url(#jarGrad)"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="3"
              />
              {/* Jar Lid */}
              <rect
                x="36"
                y="36"
                width="128"
                height="32"
                rx="10"
                fill="url(#lidGrad)"
                stroke="#92400e"
                strokeWidth="2"
              />

              {/* Fill indicator fluid */}
              <rect
                x="34"
                y={64 + 172 * (1 - unrevealedCount / (data.length || 1))}
                width="132"
                height={172 * (unrevealedCount / (data.length || 1))}
                rx="16"
                fill="rgba(244,63,94,0.15)"
              />

              {/* Hearts Grid inside jar */}
              {data.map((_, i) => {
                const maxCols = 5;
                const col = i % maxCols;
                const row = Math.floor(i / maxCols);
                const x = 48 + col * 26;
                const y = 88 + row * 24;
                const revealed = revealedReasons.includes(i);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fontSize="14"
                    className={`transition-all duration-500 select-none ${
                      revealed ? "opacity-0 scale-0" : "opacity-90"
                    }`}
                  >
                    💝
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Pull Button */}
          {!allRevealed ? (
            <button
              onClick={pullReason}
              disabled={isShaking}
              className="btn-primary bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:scale-105 disabled:from-rose-300 disabled:to-pink-300 text-white text-sm sm:text-base px-8 py-3 mt-4 shadow-lg"
            >
              {isShaking
                ? "Shaking Jar... 🫙✨"
                : `Pull a Reason 💝 (${unrevealedCount} left)`}
            </button>
          ) : (
            <div className="animate-bounce-in mt-4 bg-rose-50/80 p-4 rounded-2xl border border-rose-200">
              <p
                className="text-base sm:text-lg text-rose-700 font-bold"
                style={{ fontFamily: "Charm, serif" }}
              >
                You&apos;ve unlocked all {data.length} reasons why I love you! 🥰✨
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1 progress-bar h-2.5">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="xp-badge shrink-0 px-3 py-1 font-bold">
            +{revealedReasons.length * 10} XP
          </span>
        </div>
      </div>

      {/* Current Reason Popup */}
      {currentReason !== null && !isShaking && (
        <div className="liquid mt-5 p-7 sm:p-8 animate-bounce-in border-l-4 border-rose-500 shadow-xl rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80">
              Reason #{revealedReasons.length}
            </span>
            <span className="text-xs text-rose-400 font-bold">💕 From the Heart</span>
          </div>
          <p
            className="text-base sm:text-lg text-zinc-900 font-semibold break-words"
            style={{ fontFamily: "Charm, serif", lineHeight: 1.8 }}
          >
            {data[currentReason]} 💝
          </p>
        </div>
      )}

      {/* Revealed Reasons History List */}
      {revealedReasons.length > 1 && (
        <div className="mt-5 space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar">
          {revealedReasons
            .slice()
            .reverse()
            .map((idx, i) => (
              <div
                key={idx}
                className="liquid p-5 sm:p-6 flex items-center gap-4 animate-slide-in rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-all"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="w-7 h-7 rounded-full bg-rose-500/15 flex items-center justify-center text-xs font-black text-rose-600 shrink-0">
                  {revealedReasons.indexOf(idx) + 1}
                </span>
                <p
                  className="text-xs sm:text-sm text-zinc-800 font-medium min-w-0 flex-1 break-words"
                  style={{ fontFamily: "Charm, serif", lineHeight: 1.75 }}
                >
                  {data[idx]}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
