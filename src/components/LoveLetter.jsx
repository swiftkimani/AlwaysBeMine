import { useState, useEffect, useRef } from "react";

export default function LoveLetter({ data, onProgress }) {
  const [revealedParagraphs, setRevealedParagraphs] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

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

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [revealedParagraphs, data.paragraphs, isTyping]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
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
    onProgress?.({ completed: revealedParagraphs, total: data.paragraphs.length });
  }, [revealedParagraphs, data.paragraphs.length, onProgress]);

  const allDone = revealedParagraphs >= data.paragraphs.length && !isTyping;
  const pct = Math.round((revealedParagraphs / data.paragraphs.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Letter Card */}
      <div
        ref={containerRef}
        className="glass-card relative overflow-hidden max-h-[60vh] overflow-y-auto no-scrollbar"
        style={{
          background: "linear-gradient(135deg, rgba(255,251,235,0.95), rgba(255,237,213,0.95))",
          border: "1px solid rgba(217,119,6,0.2)",
        }}
      >
        {/* Decorative line pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(217,119,6,0.08) 31px, rgba(217,119,6,0.08) 32px)" }} />

        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400" />

        <div className="relative p-6 md:p-10">
          {/* Greeting */}
          <p className="text-xl md:text-2xl font-bold text-amber-900 mb-6" style={{ fontFamily: "Great Vibes, cursive" }}>
            {data.greeting}
          </p>

          {/* Paragraphs */}
          <div className="space-y-4 mb-6">
            {data.paragraphs.slice(0, revealedParagraphs).map((p, i) => (
              <p key={i} className="text-zinc-700 leading-relaxed text-sm md:text-base" style={{ fontFamily: "Charm, serif" }}>
                {p}
              </p>
            ))}
            {revealedParagraphs < data.paragraphs.length && (
              <p className="text-zinc-700 leading-relaxed text-sm md:text-base" style={{ fontFamily: "Charm, serif" }}>
                {typedText}
                {isTyping && <span className="animate-pulse text-amber-600 font-bold">|</span>}
              </p>
            )}
          </div>

          {/* Closing */}
          {allDone && (
            <div className="text-right space-y-2 animate-fade-in mt-6">
              <p className="text-lg text-amber-800" style={{ fontFamily: "Great Vibes, cursive" }}>{data.closing}</p>
              <p className="text-xl font-bold text-amber-900" style={{ fontFamily: "Great Vibes, cursive" }}>{data.signature}</p>
            </div>
          )}

          {/* Controls */}
          {!allDone && (
            <div className="flex items-center justify-between mt-6 gap-3">
              {!isTyping && (
                <button onClick={handleContinue} className="btn-primary bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm">
                  Continue reading... ✉️
                </button>
              )}
              {isTyping && (
                <button onClick={handleSkip} className="btn-primary bg-white/50 text-amber-800 hover:bg-white/70 text-xs border border-amber-200">
                  Skip typing →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gamification footer */}
      <div className="glass-card mt-3 p-3 md:p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-sm">✉️</div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-zinc-600">Letter Progress</p>
          <div className="progress-bar mt-1">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="xp-badge">+{revealedParagraphs * 20} XP</span>
      </div>
    </div>
  );
}
