import { useState, useEffect, useRef } from "react";

export default function LoveLetter({ data }) {
  const [revealedParagraphs, setRevealedParagraphs] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef(null);
  const currentParagraph = data.paragraphs[revealedParagraphs] || "";

  useEffect(() => {
    if (!isTyping || revealedParagraphs >= data.paragraphs.length) return;

    const text = data.paragraphs[revealedParagraphs];
    let charIdx = 0;
    setTypedText("");

    const interval = setInterval(() => {
      if (charIdx < text.length) {
        setTypedText(text.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
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

  const allDone = revealedParagraphs >= data.paragraphs.length && !isTyping;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div
        ref={containerRef}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 md:p-12 shadow-2xl border border-amber-200/50 relative overflow-hidden max-h-[70vh] overflow-y-auto no-scrollbar"
        style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)" }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400" />

        <p
          className="text-2xl md:text-3xl font-bold text-amber-900 mb-8"
          style={{ fontFamily: "Great Vibes, cursive" }}
        >
          {data.greeting}
        </p>

        <div className="space-y-5 mb-8">
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

        {allDone && (
          <div className="text-right space-y-3 animate-fade-in mt-6">
            <p className="text-xl text-amber-800" style={{ fontFamily: "Great Vibes, cursive" }}>
              {data.closing}
            </p>
            <p className="text-2xl font-bold text-amber-900" style={{ fontFamily: "Great Vibes, cursive" }}>
              {data.signature}
            </p>
          </div>
        )}

        {!allDone && !isTyping && (
          <div className="text-center mt-8">
            <button
              onClick={handleContinue}
              className="btn-glow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Continue reading... ✉️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
