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
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-5">
      {/* Letter Card */}
      <div
        ref={containerRef}
        className="liquid relative overflow-hidden max-h-[75vh] overflow-y-auto no-scrollbar shadow-2xl rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,251,235,0.97), rgba(255,243,224,0.97))",
          border: "1.5px solid rgba(217,119,6,0.3)",
        }}
      >
        {/* Decorative line pattern — kept faint so it never competes with the text */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 39px, rgba(217,119,6,0.12) 39px, rgba(217,119,6,0.12) 40px)",
          }}
        />

        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500" />

        {/* Wax seal watermark in top-right */}
        <div className="absolute top-10 right-8 opacity-20 pointer-events-none text-6xl">
          💌
        </div>

        <div className="relative px-6 sm:px-12 md:px-16 lg:px-20 pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-14 md:pb-16">
          {/* Greeting — sized down from a billboard-scale script to something that
              actually reads as an opening line, with real air above and below it
              so the cursive swashes never crowd the accent bar or the prose. */}
          <p
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-950 mb-14 sm:mb-16 md:mb-20 tracking-wide"
            style={{ fontFamily: "var(--font-vibes)", lineHeight: 1.5 }}
          >
            {data.greeting}
          </p>

          {/* Paragraphs — generous vertical rhythm so each thought gets its own
              pocket of air instead of reading as one dense block. */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 mb-16">
            {data.paragraphs.slice(0, revealedParagraphs).map((p, i) => (
              <p
                key={i}
                className={`letter-paragraph text-zinc-800 text-[15px] sm:text-base md:text-lg font-medium tracking-wide ${
                  i === 0 ? "letter-dropcap" : ""
                }`}
                style={{ fontFamily: "var(--font-script)", lineHeight: 2.05 }}
              >
                {p}
              </p>
            ))}
            {revealedParagraphs < data.paragraphs.length && (
              <p
                className={`text-zinc-800 text-[15px] sm:text-base md:text-lg font-medium tracking-wide ${
                  revealedParagraphs === 0 ? "letter-dropcap" : ""
                }`}
                style={{ fontFamily: "var(--font-script)", lineHeight: 2.05 }}
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
            <div className="text-right space-y-4 animate-fade-in mt-6 pt-12 border-t border-amber-200/80">
              <p
                className="text-2xl sm:text-3xl text-amber-800"
                style={{ fontFamily: "var(--font-vibes)" }}
              >
                {data.closing}
              </p>
              <p
                className="text-3xl sm:text-4xl font-bold text-amber-950"
                style={{ fontFamily: "var(--font-vibes)" }}
              >
                {data.signature}
              </p>

              {/* Seal with Love Button */}
              <div className="mt-8 flex justify-end">
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
            <div className="flex items-center justify-between mt-4 gap-4 pt-10 border-t border-amber-200/50">
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
      <div className="liquid mt-6 card-pad-sm flex items-center gap-4 rounded-2xl border border-white/80">
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
        <span className="xp-badge shrink-0 text-xs">
          +{revealedParagraphs * 20} XP
        </span>
      </div>
    </div>
  );
}
