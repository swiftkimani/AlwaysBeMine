import { useState, useEffect, useRef, useCallback } from "react";

export default function Timeline({ data, onProgress }) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const timelineRef = useRef(null);
  const observedRef = useRef(new Set());

  const reportProgress = useCallback((vis) => {
    onProgress?.({ completed: vis.size, total: data.length });
  }, [data.length, onProgress]);

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
      { threshold: 0.3 },
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

  const pct = Math.round((visibleItems.size / data.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Header */}
      <div className="liquid p-6 md:p-8 mb-6 md:mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {visibleItems.size}/{data.length}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-zinc-700">Journey Progress</p>
          <div className="progress-bar mt-1.5">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="xp-badge">+{visibleItems.size * 15} XP</span>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative px-4 md:px-0">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 via-pink-400 to-purple-400 rounded-full" />

        {data.map((item, idx) => {
          const isVisible = visibleItems.has(idx);
          return (
            <div
              key={idx}
              data-idx={idx}
              className={`relative flex items-center mb-8 md:mb-12 transition-all duration-700 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              {/* Desktop card */}
              <div className={`hidden md:block w-5/12 ${idx % 2 === 0 ? "text-right pr-10" : "text-left pl-10"}`}>
                <div className={`inline-block liquid p-5 md:p-6 transition-all duration-300 ${isVisible ? "hover:shadow-2xl hover:scale-[1.02]" : ""}`}>
                  <div className="flex items-center gap-2 mb-1.5" style={{ justifyContent: idx % 2 === 0 ? "flex-end" : "flex-start" }}>
                    {isVisible && <span className="xp-badge">+15 XP</span>}
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">{item.emoji} {item.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Dot */}
              <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-500 ${isVisible ? "bg-gradient-to-br from-rose-400 to-pink-500 scale-100" : "bg-zinc-300 scale-75"}`} />

              {/* Mobile card */}
              <div className="ml-14 md:hidden w-full">
                <div className={`liquid p-5 md:p-6 transition-all duration-300 ${isVisible ? "hover:shadow-xl" : ""}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {isVisible && <span className="xp-badge">+15 XP</span>}
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">{item.emoji} {item.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
