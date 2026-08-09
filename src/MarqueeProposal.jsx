import { useState, useEffect } from "react";

// How long one message takes to scroll fully across, and how often the
// next one starts — kept equal so each phrase gets one clean, complete
// pass instead of getting cut off mid-scroll by the next swap.
const SCROLL_SECONDS = 13;

export default function MarqueeProposal({ messages = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, SCROLL_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="marquee-proposal-bleed">
      <div className="marquee-proposal">
        <div className="marquee-track" key={currentIndex} style={{ animationDuration: `${SCROLL_SECONDS}s` }}>
          <span className="marquee-glow-text">
            {messages[currentIndex]}
          </span>
        </div>
      </div>
      <style>{`
        .marquee-track {
          white-space: nowrap;
          position: absolute;
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            position: static;
            white-space: normal;
            text-align: center;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
