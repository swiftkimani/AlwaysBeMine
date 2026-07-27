import { useState, useEffect } from "react";

export default function MarqueeProposal({ messages = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="liquid"
      style={{
        width: "100vw",
        height: "72px",
        margin: "32px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderLeft: "none",
        borderRight: "none",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          position: "absolute",
          animation: "marquee 10s linear infinite",
        }}
        key={currentIndex}
      >
        <span
          style={{
            fontSize: "clamp(1rem, 3vw, 2rem)",
            fontFamily: "Charm, serif",
            fontWeight: 700,
            color: "#191a19",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          {messages[currentIndex]}
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
