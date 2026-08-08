import { useState, useEffect } from "react";

// Desktop-only cursor trail of little hearts (skipped on touch devices).
export default function HeartTrail() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    let last = 0;
    const isMobile = "ontouchstart" in window;
    if (isMobile) return;
    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 140) return;
      last = now;
      const id = `${now}-${Math.random()}`;
      const emojis = ["💕", "💗", "💖", "✨", "🤍", "💜"];
      setHearts((prev) => [...prev.slice(-10), {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1300);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[150]" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-trail"
          style={{ left: h.x - 7, top: h.y - 7 }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
