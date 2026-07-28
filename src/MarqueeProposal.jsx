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
      className="liquid marquee-proposal"
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "64px",
        margin: "1.5rem auto 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <span className="marquee-heart" aria-hidden="true">💗</span>
      <div className="marquee-track" key={currentIndex}>
        <span
          style={{
            fontSize: "clamp(0.9rem, 2.6vw, 1.6rem)",
            fontFamily: "Charm, serif",
            fontWeight: 700,
            color: "#9f1239",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            padding: "0 1.5rem",
          }}
        >
          {messages[currentIndex]}
        </span>
      </div>
      <style>{`
        .marquee-track {
          white-space: nowrap;
          position: absolute;
          animation: marquee 10s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-heart {
          position: absolute;
          left: 14px;
          font-size: 1.1rem;
          animation: marquee-heart-beat 1.4s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes marquee-heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        @media (max-width: 480px) {
          .marquee-heart { display: none; }
        }
      `}</style>
    </div>
  );
}
