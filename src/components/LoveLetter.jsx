import { useState, useEffect, useRef } from "react";
import { useRomance } from "../RomanceFX.jsx";

export default function LoveLetter({ data, onProgress }) {
  const [revealedParagraphs, setRevealedParagraphs] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [sealed, setSealed] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const { burstFromEvent } = useRomance();

  useEffect(() => {
    if (!isTyping || revealedParagraphs >= data.paragraphs.length) return;

    const text = data.paragraphs[revealedParagraphs];
    let charIdx = 0;
    setTypedText("");

    intervalRef.current = setInterval(() => {
      if (charIdx < text.length) {
        setTypedText(text.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [revealedParagraphs, data.paragraphs, isTyping]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [typedText]);

  const handleContinue = () => {
    if (revealedParagraphs < data.paragraphs.length) {
      setRevealedParagraphs((prev) => prev + 1);
      setIsTyping(true);
    }
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRevealedParagraphs(data.paragraphs.length);
    setTypedText("");
    setIsTyping(false);
  };

  useEffect(() => {
    onProgress?.({
      completed: revealedParagraphs,
      total: data.paragraphs.length,
    });
  }, [revealedParagraphs, data.paragraphs.length, onProgress]);

  const allDone = revealedParagraphs >= data.paragraphs.length && !isTyping;
  const pct = Math.round((revealedParagraphs / data.paragraphs.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Letter Card */}
      <div
        ref={containerRef}
        className="liquid relative overflow-hidden max-h-[70vh] overflow-y-auto no-scrollbar shadow-2xl rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,251,235,0.97), rgba(255,243,224,0.97))",
          border: "1.5px solid rgba(217,119,6,0.3)",
        }}
      >
        {/* Decorative line pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, rgba(217,119,6,0.12) 31px, rgba(217,119,6,0.12) 32px)",
          }}
        />

        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500" />

        {/* Wax seal watermark in top-right */}
        <div className="absolute top-6 right-6 opacity-20 pointer-events-none text-6xl">
          💌
        </div>

        <div className="relative p-7 sm:p-11 md:p-14">
          {/* Greeting */}
          <p
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-950 mb-9 sm:mb-10 tracking-wide"
            style={{ fontFamily: "Great Vibes, cursive" }}
          >
            {data.greeting}
          </p>

          {/* Paragraphs */}
          <div className="space-y-7 sm:space-y-8 mb-9">
            {data.paragraphs.slice(0, revealedParagraphs).map((p, i) => (
              <p
                key={i}
                className="text-zinc-800 text-sm sm:text-base md:text-lg font-medium tracking-wide"
                style={{ fontFamily: "Charm, serif", lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
            {revealedParagraphs < data.paragraphs.length && (
              <p
                className="text-zinc-800 text-sm sm:text-base md:text-lg font-medium tracking-wide"
                style={{ fontFamily: "Charm, serif", lineHeight: 1.85 }}
              >
                {typedText}
                {isTyping && (
                  <span className="animate-pulse text-rose-500 font-black ml-1 text-2xl">
                    |
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Closing & Signature */}
          {allDone && (
            <div className="text-right space-y-3 animate-fade-in mt-10 pt-8 border-t border-amber-200/80">
              <p
                className="text-2xl sm:text-3xl text-amber-800"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                {data.closing}
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold text-amber-950"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                {data.signature}
              </p>

              {/* Seal with Love Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={(e) => { setSealed(true); burstFromEvent(e, "💌"); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    sealed
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                  }`}
                >
                  <span>{sealed ? "💖 Sealed with Love!" : "🔴 Seal Letter"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          {!allDone && (
            <div className="flex items-center justify-between mt-9 gap-4 pt-5 border-t border-amber-200/50">
              {!isTyping && (
                <button
                  onClick={handleContinue}
                  className="btn-primary bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-xs sm:text-sm shadow-lg"
                >
                  Continue reading... ✉️
                </button>
              )}
              {isTyping && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-full bg-white/80 text-amber-900 hover:bg-white text-xs font-bold border border-amber-300 shadow-sm ml-auto cursor-pointer"
                >
                  Skip typing →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gamification footer */}
      <div className="liquid mt-5 p-4 sm:p-5 flex items-center gap-4 rounded-2xl border border-white/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg shrink-0 shadow-md">
          ✉️
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs sm:text-sm font-black text-zinc-800">
              Letter Reading Progress
            </p>
            <span className="text-xs font-bold text-amber-600">{pct}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="xp-badge shrink-0 px-3 py-1 text-xs">
          +{revealedParagraphs * 20} XP
        </span>
      </div>
    </div>
  );
}
