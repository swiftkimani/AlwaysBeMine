import config from "../../config.js";
import MouseStealing from "../../MouseStealer.jsx";
import WordMarquee from "../../MarqueeProposal.jsx";
import LiveCountdown from "../LiveCountdown.jsx";
import { YesGifs, lovesvg, Lovegif } from "../../data/proposalAssets.js";
import SendLoveBar from "./SendLoveBar.jsx";

// Purely presentational — all proposal state/logic lives in useProposal
// (see hooks/useProposal.js); the whole hook result arrives as `proposal`.
export default function ProposalScene({ proposal, onLovePopup }) {
  const {
    gifRef,
    noCount,
    yesPressed,
    currentGifIndex,
    floatingGifs,
    yesButtonSize,
    noButtonLabel,
    showMouseStealer,
    handleYesClick,
    handleNoClick,
    handleMouseEnterYes,
    handleMouseEnterNo,
    handleMouseLeave,
  } = proposal;

  return (
    <>
      {showMouseStealer && <MouseStealing />}
      {yesPressed && noCount > 3 ? (
        <div className="animate-fade-in">
          <img ref={gifRef} className="h-[200px] md:h-[240px] rounded-3xl drop-shadow-[0_15px_30px_rgba(225,29,72,0.35)] mx-auto hover:scale-105 transition-all duration-500" src={YesGifs[currentGifIndex]} alt="Yes Response" />
          <div className="text-3xl md:text-5xl font-bold mt-4 mb-3 font-script leading-normal">
            <span className="text-gradient-love">{config.yesTitle}</span>
          </div>
          <div className="text-xl md:text-3xl font-medium mb-4 font-romantic" style={{ lineHeight: 1.6 }}>{config.yesSubtitle}</div>
          <WordMarquee messages={config.marqueeMessages} />
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col items-center justify-center gap-6 sm:gap-8 w-full max-w-4xl mx-auto text-center min-h-[calc(100dvh-5.5rem)] py-12 px-4 sm:px-12 relative">

          {/* Hero Layout: Pulsing Love SVG & Creative Borderless Animated GIF */}
          <div className="relative flex flex-col items-center justify-center z-10 mt-4 sm:mt-2 group">
            <div className="absolute w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-rose-400/30 via-pink-400/20 to-purple-400/30 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
            <img src={lovesvg} className="animate-pulse w-24 sm:w-28 md:w-32 drop-shadow-lg mx-auto mb-3" alt="Love SVG" />
            <img ref={gifRef} className="h-[190px] sm:h-[230px] md:h-[270px] rounded-3xl object-cover drop-shadow-[0_15px_30px_rgba(225,29,72,0.3)] hover:scale-105 transition-all duration-500 mx-auto" src={Lovegif} alt="Love Animation" />
          </div>

          {/* Massive Bold Heading for High Contrast */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold proposal-heading font-script text-gradient-love px-2 leading-normal drop-shadow-md my-4 pb-4 sm:pb-6">
            {config.heading}
          </h1>

          {/* Live "loving you for" ticker — only renders once togetherSince is set */}
          {config.togetherSince && (
            <div className="-mt-4">
              <p className="live-countdown-label">Loving you for</p>
              <LiveCountdown since={config.togetherSince} />
            </div>
          )}

          {/* Big Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center w-full my-2">
            <button onMouseEnter={handleMouseEnterYes} onMouseLeave={handleMouseLeave}
              className="btn-primary btn-yes-pulse"
              style={{ fontSize: yesButtonSize, padding: "0.6em 1.5em", transition: "all 0.2s ease" }}
              onClick={handleYesClick}>
              {config.acceptBtn}
            </button>
            <button onMouseEnter={handleMouseEnterNo} onMouseLeave={handleMouseLeave} onClick={handleNoClick}
              className="btn-secondary"
              style={{ fontSize: "1.1rem" }}>
              {noButtonLabel}
            </button>
          </div>

          {/* Send Love Bar - Footer */}
          <div className="w-full mt-4">
            <SendLoveBar onLovePopup={onLovePopup} />
          </div>

          {/* A preview of the romantic marquee — the full experience
              waits behind "yes", but a taste of it here builds
              anticipation instead of hiding it completely. */}
          {config.marqueeMessages?.length > 0 && (
            <WordMarquee messages={config.marqueeMessages} />
          )}

          {/* Ambient Floating Elements */}
          {floatingGifs.map((gif) => (
            <img key={gif.id} src={gif.src} alt="" className="absolute w-10 h-10 md:w-12 md:h-12 animate-float pointer-events-none opacity-80" style={gif.style} />
          ))}
        </div>
      )}
    </>
  );
}
