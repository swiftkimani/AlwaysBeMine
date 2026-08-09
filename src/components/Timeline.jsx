import { useState, useEffect, useRef, useCallback } from "react";
import { useRomance } from "../RomanceFX.jsx";

export default function Timeline({ data, onProgress }) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [lovedItems, setLovedItems] = useState(new Set());
  const timelineRef = useRef(null);
  const observedRef = useRef(new Set());
  const { burstFromEvent } = useRomance();

  const reportProgress = useCallback(
    (vis) => {
      onProgress?.({ completed: vis.size, total: data.length });
    },
    [data.length, onProgress]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setVisibleItems((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set([...prev, idx]);
              reportProgress(next);
              return next;
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    const items = timelineRef.current?.querySelectorAll("[data-idx]");
    const observed = new Set(observedRef.current);
    items?.forEach((item) => {
      if (!observed.has(item)) {
        observer.observe(item);
        observed.add(item);
      }
    });
    observedRef.current = observed;
    return () => {
      observed.forEach((item) => observer.unobserve(item));
    };
  }, [data, reportProgress]);

  const toggleLove = (idx, e) => {
    e.stopPropagation();
    setLovedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
        burstFromEvent(e, "❤️");
      }
      return next;
    });
  };

  const pct = Math.round((visibleItems.size / data.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Progress Header Card */}
      <div className="liquid card-pad-sm mb-8 md:mb-10 flex items-center gap-4 sm:gap-6 rounded-3xl border border-white/80 shadow-xl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-black text-sm sm:text-base shrink-0 shadow-lg shadow-rose-500/30">
          {visibleItems.size}/{data.length}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm sm:text-base font-black text-zinc-800">Our Love Journey 📖</p>
            <span className="text-xs font-bold text-rose-500">{pct}% Explored</span>
          </div>
          <div className="progress-bar h-2.5">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="xp-badge shrink-0 text-xs">+{visibleItems.size * 15} XP</span>
      </div>

      {/* Timeline Tree */}
      <div ref={timelineRef} className="relative">
        {/* Center glowing line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-rose-400 via-pink-400 to-purple-500 rounded-full shadow-sm" />

        {data.map((item, idx) => {
          const isVisible = visibleItems.has(idx);
          const isLoved = lovedItems.has(idx);
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              data-idx={idx}
              className={`relative flex items-center mb-8 sm:mb-12 md:mb-14 transition-all duration-700 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Desktop view card */}
              <div
                className={`hidden md:block w-5/12 ${
                  isEven ? "text-right pr-8" : "text-left pl-8"
                }`}
              >
                <div
                  className={`inline-block w-full liquid card-pad rounded-3xl border border-white/80 transition-all duration-300 ${
                    isVisible
                      ? "hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                      : ""
                  }`}
                >
                  <div
                    className="flex items-center gap-2 mb-3"
                    style={{
                      justifyContent: isEven ? "flex-end" : "flex-start",
                    }}
                  >
                    {isVisible && <span className="xp-badge">+15 XP</span>}
                    <span className="text-xs font-black text-rose-500 bg-rose-50 pill-pad rounded-full border border-rose-200/80">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 mb-3 flex items-center gap-2 justify-inherit">
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.title}</span>
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-zinc-600 font-medium"
                    style={{ fontFamily: "var(--font-script)", lineHeight: 1.85 }}
                  >
                    {item.description}
                  </p>
                  <div
                    className="mt-5 pt-4 border-t border-rose-100/60 flex items-center gap-2"
                    style={{
                      justifyContent: isEven ? "flex-end" : "flex-start",
                    }}
                  >
                    <button
                      onClick={(e) => toggleLove(idx, e)}
                      className={`flex items-center gap-1.5 text-xs font-bold pill-pad rounded-full transition-all cursor-pointer ${
                        isLoved
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      }`}
                    >
                      <span>{isLoved ? "❤️" : "🤍"}</span>
                      <span>{isLoved ? "Cherished" : "Cherish Memory"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Center Node */}
              <div
                className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center transition-all duration-500 ${
                  isVisible
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 scale-110 ring-4 ring-rose-300/40 text-white text-xs font-bold"
                    : "bg-zinc-300 scale-90"
                }`}
              >
                {isVisible ? "💕" : ""}
              </div>

              {/* Mobile view card */}
              <div className="ml-14 md:hidden w-full">
                <div
                  className={`liquid card-pad rounded-3xl border border-white/80 transition-all duration-300 ${
                    isVisible ? "hover:shadow-xl" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {isVisible && <span className="xp-badge">+15 XP</span>}
                    <span className="text-xs font-black text-rose-500 bg-rose-50 pill-pad rounded-full border border-rose-200/80">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-zinc-900 mb-2.5 flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.title}</span>
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-zinc-600 font-medium"
                    style={{ fontFamily: "var(--font-script)", lineHeight: 1.85 }}
                  >
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleLove(idx, e)}
                      className={`flex items-center gap-1.5 text-xs font-bold pill-pad rounded-full transition-all cursor-pointer ${
                        isLoved
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      }`}
                    >
                      <span>{isLoved ? "❤️" : "🤍"}</span>
                      <span>{isLoved ? "Loved" : "Love"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
