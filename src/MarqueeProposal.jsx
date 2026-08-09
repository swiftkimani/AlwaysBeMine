import { useState, useEffect } from "react";

// How long one message takes to scroll fully across, and how often the
// next one starts — kept equal so each phrase gets one clean, complete
// pass instead of getting cut off mid-scroll by the next swap.
const SCROLL_SECONDS = 34;

export default function MarqueeProposal({ messages = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, SCROLL_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    // Plain, unstyled wrapper with no width/flex opinion of its own —
    // it exists purely so .marquee-proposal-bleed's containing block is
    // a normal block box instead of a flex item directly. The caller
    // (ProposalScene) renders this inside a `flex items-center`
    // column, and a flex item's own sizing pass can conflict with a
    // margin-based full-bleed breakout applied directly to it. One
    // inert block wrapper in between removes that ambiguity entirely.
    <div className="w-full">
      <div className="marquee-proposal-bleed">
        <div className="marquee-proposal">
          <div className="marquee-track" key={currentIndex} style={{ animationDuration: `${SCROLL_SECONDS}s` }}>
            <span className="marquee-text">
              {messages[currentIndex]}
            </span>
          </div>
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
          /* Start position uses min(100vw, 1280px) — the same cap as
             the container's own max-width. Using plain 100vw here
             would start the text off in space beyond the visible
             1280px window on wide screens: most of the animation
             would play with the text invisible, then it would rush
             across the much-smaller visible width in whatever time
             was left, which is exactly what read as "too fast." This
             keeps the start distance matched to what's actually
             visible, at any screen size. The end position stays
             text-relative (-100%) so it correctly clears the left
             edge regardless of how long the phrase is. */
          0% { transform: translateX(min(100vw, 1280px)); }
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
