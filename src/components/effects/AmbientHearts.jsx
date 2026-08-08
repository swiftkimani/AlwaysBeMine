import { useMemo } from "react";

// Six slow, ever-drifting hearts behind everything.
export default function AmbientHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${8 + Math.random() * 84}%`,
      size: 12 + Math.random() * 14,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 15,
      emoji: ["💕", "💗", "💖", "✨", "🤍", "💕"][i % 6],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="ambient-heart"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
