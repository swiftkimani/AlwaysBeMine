import { useState } from "react";

// Accent colors come from the design tokens in styles/globals.css.
const items = [
  { emoji: "💋", label: "Kiss", id: "kiss", burst: ["💋", "😘", "💕", "💗"], accent: "var(--color-love-bright)" },
  { emoji: "🤗", label: "Hug", id: "hug", burst: ["🤗", "🫂", "💞", "💖"], accent: "var(--color-amber)" },
  { emoji: "💓", label: "Heartbeat", id: "heartbeat", burst: ["💓", "💗", "❤️‍🔥", "💝"], accent: "var(--color-love)" },
  { emoji: "🌹", label: "Rose", id: "rose", burst: ["🌹", "🌷", "🌸", "🌺"], accent: "var(--color-pink)" },
  { emoji: "✨", label: "Magic", id: "magic", burst: ["✨", "💫", "⭐", "🌟"], accent: "var(--color-purple)" },
];

// Tap-to-send affection buttons; each tap fires a small emoji burst.
export default function SendLoveBar({ onLovePopup }) {
  const [counts, setCounts] = useState({ kiss: 0, hug: 0, heartbeat: 0, rose: 0, magic: 0 });

  const handleClick = (item) => {
    setCounts((prev) => ({ ...prev, [item.id]: prev[item.id] + 1 }));
    const burstEmojis = item.burst;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => onLovePopup(burstEmojis[i % burstEmojis.length]), i * 120);
    }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-3">
      {total > 0 && (
        <div className="text-center mb-2.5">
          <span className="send-love-total">
            💕 {total} love{total !== 1 ? "s" : ""} sent
          </span>
        </div>
      )}
      <div className="send-love-bar">
        {items.map((item) => (
          <button
            key={item.id}
            className="send-love-btn"
            style={{ "--accent": item.accent }}
            onClick={() => handleClick(item)}
            aria-label={`Send ${item.label}`}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="label">{item.label}</span>
            {counts[item.id] > 0 && (
              <span className="send-love-count">{counts[item.id]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
