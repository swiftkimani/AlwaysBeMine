import { useMemo, useEffect } from "react";

// Confetti colors come from the design tokens in styles/globals.css.
const CONFETTI_COLORS = [
  "var(--color-love-bright)",
  "var(--color-pink)",
  "var(--color-purple)",
  "var(--color-gold)",
  "var(--color-pink-soft)",
  "var(--color-love-soft)",
  "var(--color-purple-soft)",
  "var(--color-love-blush)",
];

// One-shot celebration burst; calls onDone after the 3s show.
export default function ConfettiBurst({ onDone }) {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      x: (Math.random() - 0.5) * 200,
      rot: Math.random() * 720,
      delay: Math.random() * 0.4,
      size: 6 + Math.random() * 8,
      shape: i % 3 === 0 ? "circle" : "rect",
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            "--confetti-x": `${p.x}px`,
            "--confetti-rot": `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.shape === "circle" ? p.size : p.size * 0.6}px`,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
