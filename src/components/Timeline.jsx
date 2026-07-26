import { useState, useEffect, useRef } from "react";

export default function Timeline({ data }) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const timelineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setVisibleItems((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.3 },
    );

    const items = timelineRef.current?.querySelectorAll("[data-idx]");
    items?.forEach((item) => observer.observe(item));
    return () => items?.forEach((item) => observer.unobserve(item));
  }, [data]);

  return (
    <div ref={timelineRef} className="w-full max-w-3xl mx-auto px-4 py-12">
      <div className="relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 via-pink-400 to-purple-400" />

        {data.map((item, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`relative flex items-center mb-12 transition-all duration-700 ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } ${visibleItems.has(idx) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className={`hidden md:block w-5/12 ${idx % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
              <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">{item.date}</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">{item.emoji} {item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-lg z-10" />

            <div className="ml-14 md:hidden">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">{item.date}</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">{item.emoji} {item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
