import { useState } from "react";
import useCoupleConfig from "../../hooks/useCoupleConfig.js";
import { modeLabels, NAV_ACCENTS } from "../../data/modes.js";

/* Main navigation: a small heart tab stays permanently reachable at
   the left edge; tapping it docks the sticker-list panel in or out
   from the left as one whole unit — background, border, shadow and
   all, not just its contents. The panel is transformed (translateX)
   rather than position:absolute, so it can never end up rendering
   behind or over page content the way an out-of-flow absolutely
   positioned element could on a careless mobile layout — see the CSS
   comment on .side-nav for the full reasoning.

   Every mode gets its own romantic pastel "sticker" color (see
   data/modes.js NAV_ACCENTS), and hovering one pops it — and its
   neighbors a little — toward the page. No mode name is ever
   permanently on screen; it only appears as a tooltip on hover, in
   the spirit of a macOS Finder sidebar / VS Code activity bar. */
export default function Nav({ activeMode, setActiveMode, visitedModes, onNavClick }) {
  const config = useCoupleConfig();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav className="side-nav-wrap" role="navigation" aria-label="Main navigation">
      <div className="relative flex flex-col items-center">
        {/* Persistent heart tab — always reachable, stays put while the
            panel below docks in and out. */}
        <div className="dock-item-wrap group">
          <button
            onClick={() => setIsOpen((p) => !p)}
            className={`nav-sticker ${isOpen ? "nav-sticker-active" : ""}`}
            style={{
              "--sticker-bg-a": "var(--color-blush-2)",
              "--sticker-bg-b": "var(--color-love-blush)",
              "--sticker-active-a": "var(--color-love-bright)",
              "--sticker-active-b": "var(--color-love-deep)",
            }}
            aria-label={isOpen ? "Hide navigation" : "Show navigation"}
            aria-expanded={isOpen}
          >
            <span
              className={`nav-sticker-emoji side-nav-toggle-emoji text-xl ${isOpen ? "" : "rotate-[360deg] scale-90"}`}
              aria-hidden="true"
            >
              {isOpen ? "🤍" : "💗"}
            </span>
          </button>
          <span className="nav-tip">{isOpen ? "Hide the love menu 💕" : "Show the love menu 💕"}</span>
        </div>

        {/* The whole card — divider + sticker list — docks in/out from
            the left as one unit. */}
        <div className={`side-nav glass-panel no-scrollbar ${isOpen ? "" : "side-nav-closed"}`}>
          <div className="side-nav-divider" aria-hidden="true" />

          {config.modes.map((mode) => {
            const isActive = activeMode === mode;
            const isVisited = visitedModes.has(mode);
            const icon = (modeLabels[mode] || mode).split(" ")[0];
            const accent = NAV_ACCENTS[mode] || NAV_ACCENTS.proposal;

            return (
              <div key={mode} className="dock-item-wrap group">
                <span className="nav-tip">{modeLabels[mode] || mode}</span>
                <button
                  onClick={() => {
                    if (mode !== activeMode) {
                      onNavClick?.();
                      setTimeout(() => {
                        setActiveMode(mode);
                        window.location.hash = mode;
                      }, 150);
                    }
                  }}
                  aria-label={modeLabels[mode] || mode}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-sticker ${isActive ? "nav-sticker-active" : ""}`}
                  style={{
                    "--sticker-bg-a": accent.bgA,
                    "--sticker-bg-b": accent.bgB,
                    "--sticker-active-a": accent.activeA,
                    "--sticker-active-b": accent.activeB,
                  }}
                >
                  <span className="nav-sticker-emoji text-xl">{icon}</span>
                  {isVisited && !isActive && (
                    <span className="nav-visited-heart" aria-hidden="true">♥</span>
                  )}
                </button>
              </div>
            );
          })}
          <p className="side-nav-sparkle" aria-hidden="true">˚₊ 💕 ₊˚</p>
        </div>
      </div>
    </nav>
  );
}
