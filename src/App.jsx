import { useState, useRef, useEffect, useCallback } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import config from "./config.js";
import MouseStealing from "./MouseStealer.jsx";
import WordMarquee from "./MarqueeProposal.jsx";
import Timeline from "./components/Timeline.jsx";
import LoveLetter from "./components/LoveLetter.jsx";
import QuizGame from "./components/QuizGame.jsx";
import ReasonsJar from "./components/ReasonsJar.jsx";
import PhotoGallery from "./components/PhotoGallery.jsx";
import PromiseBuilder from "./components/PromiseBuilder.jsx";
import Playlist from "./components/Playlist.jsx";
import FloatingMusicControl from "./components/FloatingMusicControl.jsx";
import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import Lovegif from "./assets/GifData/main_temp.gif";
import heartGif from "./assets/GifData/happy.gif";
import sadGif from "./assets/GifData/sad.gif";
import purposerose from "./assets/GifData/RoseCute.gif";
import swalbg from "./assets/Lovingbg2_main.jpg";
import loveu from "./assets/GifData/cutieSwal4.gif";

import { BsArrowUp, BsShareFill, BsX } from "react-icons/bs";

import yesgif0 from "./assets/GifData/Yes/lovecutie0.gif";
import yesgif1 from "./assets/GifData/Yes/love2.gif";
import yesgif2 from "./assets/GifData/Yes/love3.gif";
import yesgif3 from "./assets/GifData/Yes/love1.gif";
import yesgif4 from "./assets/GifData/Yes/lovecutie1.gif";
import yesgif5 from "./assets/GifData/Yes/lovecutie5.gif";
import yesgif6 from "./assets/GifData/Yes/lovecutie7.gif";
import yesgif7 from "./assets/GifData/Yes/lovecutie8.gif";
import yesgif8 from "./assets/GifData/Yes/lovecutie3.gif";
import yesgif9 from "./assets/GifData/Yes/lovecutie9.gif";
import yesgif10 from "./assets/GifData/Yes/lovecutie6.gif";
import yesgif11 from "./assets/GifData/Yes/lovecutie4.gif";

import nogif0 from "./assets/GifData/No/breakRej0.gif";
import nogif0_1 from "./assets/GifData/No/breakRej0_1.gif";
import nogif1 from "./assets/GifData/No/breakRej1.gif";
import nogif2 from "./assets/GifData/No/breakRej2.gif";
import nogif3 from "./assets/GifData/No/breakRej3.gif";
import nogif4 from "./assets/GifData/No/breakRej4.gif";
import nogif5 from "./assets/GifData/No/breakRej5.gif";
import nogif6 from "./assets/GifData/No/breakRej6.gif";
import nogif7 from "./assets/GifData/No/RejectNo.gif";
import nogif8 from "./assets/GifData/No/breakRej7.gif";

import yesmusic1 from "./assets/AudioTracks/Love_LoveMeLikeYouDo.mp3";
import yesmusic2 from "./assets/AudioTracks/Love_EDPerfect.mp3";
import yesmusic3 from "./assets/AudioTracks/Love_Nadaaniyan.mp3";
import yesmusic4 from "./assets/AudioTracks/Love_JoTumMereHo.mp3";

const YesGifs = [yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11];
const NoGifs = [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8];

const loveTracks = [
  { title: "Love Me Like You Do", artist: "Ellie Goulding", src: yesmusic1 },
  { title: "Perfect", artist: "Ed Sheeran", src: yesmusic2 },
  { title: "Nadaaniyan", artist: "Armaan Malik", src: yesmusic3 },
  { title: "Jo Tum Mere Ho", artist: "Anuv Jain", src: yesmusic4 },
];

const modeLabels = {
  proposal: "💌 Proposal",
  timeline: "📅 Timeline",
  letter: "✉️ Letter",
  quiz: "❓ Quiz",
  jar: "💝 Reasons",
  gallery: "📸 Gallery",
  promises: "🤝 Promises",
  playlist: "🎵 Music",
};

function getInitialMode() {
  const hash = window.location.hash.replace("#", "");
  if (hash && config.modes.includes(hash)) return hash;
  return config.modes[0];
}

function generateRandomPositionWithSpacing(existingPositions) {
  const minDistance = 15;
  let position, tooClose;
  do {
    position = { top: `${Math.random() * 90}vh`, left: `${Math.random() * 90}vw` };
    tooClose = existingPositions.some((p) => {
      const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
      const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  } while (tooClose);
  return position;
}

function createFloatingGifs(gifSrc, idPrefix) {
  const gifs = [], positions = [];
  for (let i = 0; i < 12; i++) {
    const pos = generateRandomPositionWithSpacing(positions);
    positions.push(pos);
    gifs.push({ id: `${idPrefix}-${i}`, src: gifSrc, style: { ...pos, animationDuration: `${Math.random() * 2 + 1}s`, animationDelay: `${Math.random() * 0.5}s` } });
  }
  return gifs;
}

function AchievementToast({ achievement, onDone }) {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${exiting ? "achievement-toast-exit" : "achievement-toast"}`}
      role="alert"
      aria-live="polite"
    >
      <div className="glass-card px-5 py-3 flex items-center gap-3 shadow-2xl border border-amber-200/40">
        <span className="text-2xl" aria-hidden="true">{achievement.icon}</span>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Achievement Unlocked!</p>
          <p className="text-sm font-bold text-zinc-800">{achievement.label}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer shrink-0"
          aria-label="Dismiss achievement"
        >
          <BsX size={14} />
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
      <a
        className="fixed bottom-20 right-4 md:bottom-4 md:right-4 backdrop-blur-md opacity-80 hover:opacity-100 border px-3 py-1.5 rounded-xl border-white/20 bg-white/60 text-[10px] md:text-xs text-zinc-700 hover:text-zinc-900 transition-all duration-300 z-40"
      href="https://github.com/swiftkimani/AlwaysBeMine"
      target="_blank"
      rel="noopener noreferrer"
    >
      Inspired by Swift
    </a>
  );
}

function Nav({ activeMode, setActiveMode, visitedModes }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-white/40" role="navigation" aria-label="Main navigation" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-2 md:py-2.5 flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar">
        {config.modes.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setActiveMode(mode);
                window.location.hash = mode;
              }}
              aria-label={modeLabels[mode] || mode}
              aria-current={activeMode === mode ? "page" : undefined}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeMode === mode
                  ? "btn-glow bg-white/80 text-zinc-900 shadow-lg shadow-rose-200/30"
                  : "text-zinc-700 hover:bg-white/50 hover:text-zinc-900"
              }`}
            >
              {modeLabels[mode] || mode}
            </button>
            <div className={`mode-dot ${visitedModes.has(mode) ? "visited" : ""}`} aria-hidden="true" />
          </div>
        ))}
      </div>
    </nav>
  );
}

export default function Page() {
  const [activeMode, setActiveMode] = useState(getInitialMode);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [popupShown, setPopupShown] = useState(false);
  const [yesPopupShown, setYesPopupShown] = useState(false);
  const [floatingGifs, setFloatingGifs] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievement, setPendingAchievement] = useState(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("abm_onboarded"));
  const [visitedModes, setVisitedModes] = useState(() => {
    const saved = localStorage.getItem("abm_visited");
    return new Set(saved ? JSON.parse(saved) : [getInitialMode()]);
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showAchievementHistory, setShowAchievementHistory] = useState(false);

  const gifRef = useRef(null);
  const mainRef = useRef(null);
  const yesButtonSize = Math.min(noCount * 12 + 18, 60);

  const unlockedAchievements = useRef(new Set());

  const unlockAchievement = useCallback((id, icon, label) => {
    if (unlockedAchievements.current.has(id)) return;
    unlockedAchievements.current.add(id);
    setAchievements((prev) => [...prev, { id, icon, label }]);
    setPendingAchievement({ icon, label });
  }, []);

  // Track visited modes
  useEffect(() => {
    setVisitedModes((prev) => {
      const next = new Set(prev);
      next.add(activeMode);
      localStorage.setItem("abm_visited", JSON.stringify([...next]));
      return next;
    });
  }, [activeMode]);

  // Scroll progress + back-to-top
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = main;
      const pct = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
      setScrollProgress(Math.min(100, pct));
      setShowBackToTop(scrollTop > 300);
    };
    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, [activeMode]);

  // Dismiss onboarding
  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("abm_onboarded", "1");
  };

  // Share current mode
  const shareMode = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${activeMode}`;
    if (navigator.share) {
      navigator.share({ title: config.title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ title: "Link copied!", icon: "success", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      });
    }
  }, [activeMode]);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && config.modes.includes(hash)) setActiveMode(hash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleMouseEnterYes = useCallback(() => setFloatingGifs(createFloatingGifs(heartGif, "heart")), []);
  const handleMouseEnterNo = useCallback(() => setFloatingGifs(createFloatingGifs(sadGif, "sad")), []);
  const handleMouseLeave = useCallback(() => setFloatingGifs([]), []);

  const handleYesClick = useCallback(() => {
    if (!popupShown) setYesPressed(true);
  }, [popupShown]);

  const handleNoClick = useCallback(() => {
    const next = noCount + 1;
    setNoCount(next);
    if (next >= 4 && gifRef.current) gifRef.current.src = NoGifs[(next - 4) % NoGifs.length];
    if (next === 5) unlockAchievement("persistent", "😤", "Persistent - Clicked No 5 times!");
    if (next === 10) unlockAchievement("stubborn", "💢", "Stubborn - 10 No clicks!");
    if (next === 15) unlockAchievement("unbreakable", "🛡️", "Unbreakable - 15 No clicks!");
  }, [noCount, unlockAchievement]);

  const getNoButtonText = () => config.noPhrases[Math.min(noCount, config.noPhrases.length - 1)];

  useEffect(() => {
    if (activeMode !== "proposal") return;
    const h = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleYesClick(); } else if (e.key === "Escape") handleNoClick(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeMode, handleYesClick, handleNoClick]);

  useEffect(() => {
    if (gifRef.current && yesPressed && noCount > 3) gifRef.current.src = YesGifs[currentGifIndex];
  }, [yesPressed, currentGifIndex, noCount]);

  useEffect(() => {
    if (yesPressed && noCount > 3) {
      const id = setInterval(() => setCurrentGifIndex((p) => (p + 1) % YesGifs.length), 5000);
      return () => clearInterval(id);
    }
  }, [yesPressed, noCount]);

  useEffect(() => { if (gifRef.current) gifRef.current.src = gifRef.current.src; }, [noCount]);

  useEffect(() => {
    if (yesPressed && noCount < 4 && !popupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({ title: config.earlyPopup, showClass: { popup: "animate__animated animate__fadeInUp animate__faster" }, width: 700, padding: "2em", color: config.popupColor, background: `#fff url(${swalbg})`, backdrop: `rgba(0,0,123,0.2) url(${loveu}) right no-repeat` });
        setPopupShown(true); setYesPressed(false); setIsTransitioning(false);
        unlockAchievement("first-yes", "💕", "First Yes! You said yes!");
      }, 400);
    }
  }, [yesPressed, noCount, popupShown, unlockAchievement]);

  useEffect(() => {
    if (yesPressed && noCount > 3 && !yesPopupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({ title: config.latePopup, width: 800, padding: "2em", color: config.popupColor, background: `#fff url(${swalbg})`, backdrop: `rgba(0,0,123,0.7) url(${purposerose}) right no-repeat` });
        setYesPopupShown(true); setYesPressed(true); setIsTransitioning(false);
        unlockAchievement("eventual-yes", "🎉", "Eventual Yes! Love conquers all!");
      }, 400);
    }
  }, [yesPressed, noCount, yesPopupShown, unlockAchievement]);

  useEffect(() => {
    if (noCount === config.stubbornCount) {
      Swal.fire({ title: config.stubbornPopup, width: 850, padding: "2em", color: config.popupColor, background: `#fff url(${swalbg})`, backdrop: `rgba(0,104,123,0.7) url(${nogif1}) right no-repeat` });
    }
  }, [noCount]);

  const [mouseStealMin, mouseStealMax] = config.mouseStealerRange;

  const handleModeProgress = useCallback((mode, progress) => {
    setTotalXP((prev) => {
      const expected = progress.completed * (mode === "quiz" ? 25 : mode === "timeline" ? 15 : 10);
      return prev + Math.max(0, expected - prev);
    });
  }, []);

  const renderMode = () => {
    switch (activeMode) {
      case "proposal":
        return (
          <>
            {noCount > mouseStealMin && noCount < mouseStealMax && !yesPressed && <MouseStealing />}
            {yesPressed && noCount > 3 ? (
              <div className="animate-fade-in">
                <img ref={gifRef} className="h-[180px] md:h-[220px] rounded-2xl shadow-2xl mx-auto" src={YesGifs[currentGifIndex]} alt="Yes Response" />
                <div className="text-3xl md:text-5xl font-bold my-3 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: "Charm, serif" }}>{config.yesTitle}</div>
                <div className="text-xl md:text-3xl font-bold my-1" style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}>{config.yesSubtitle}</div>
                <WordMarquee messages={config.marqueeMessages} />
              </div>
            ) : (
              <div className="animate-fade-in">
                <img src={lovesvg} className="animate-pulse w-20 md:w-32 drop-shadow-lg mx-auto mb-4" alt="Love SVG" />
                <img ref={gifRef} className="h-[180px] md:h-[220px] rounded-2xl shadow-2xl mx-auto" src={Lovegif} alt="Love Animation" />
                <h1 className="text-2xl md:text-5xl my-4 md:my-5 font-bold" style={{ fontFamily: "Charm, serif" }}>{config.heading}</h1>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 items-center">
                  <button onMouseEnter={handleMouseEnterYes} onMouseLeave={handleMouseLeave}
                    className={`btn-glow btn-primary ${config.acceptColor}`}
                    style={{ fontSize: yesButtonSize }}
                    onClick={handleYesClick}>
                    {config.acceptBtn}
                  </button>
                  <button onMouseEnter={handleMouseEnterNo} onMouseLeave={handleMouseLeave} onClick={handleNoClick}
                    className={`btn-primary ${config.rejectColor}`}
                    style={{ fontSize: "1rem" }}>
                    {noCount === 0 ? "No" : getNoButtonText()}
                  </button>
                </div>
                {floatingGifs.map((gif) => (
                  <img key={gif.id} src={gif.src} alt="" className="absolute w-10 h-10 md:w-12 md:h-12 animate-float" style={gif.style} />
                ))}
              </div>
            )}
          </>
        );
      case "timeline":
        return <Timeline data={config.timeline} onProgress={(p) => handleModeProgress("timeline", p)} />;
      case "letter":
        return <LoveLetter data={config.letter} onProgress={(p) => handleModeProgress("letter", p)} />;
      case "quiz":
        return <QuizGame data={config.quiz} results={config.quizResults} onProgress={(p) => handleModeProgress("quiz", p)} />;
      case "jar":
        return <ReasonsJar data={config.reasons} onProgress={(p) => handleModeProgress("jar", p)} />;
      case "gallery":
        return <PhotoGallery data={config.gallery} onProgress={(p) => handleModeProgress("gallery", p)} />;
      case "promises":
        return <PromiseBuilder data={config.promises} title={config.promiseTitle} subtitle={config.promiseSubtitle} onProgress={(p) => handleModeProgress("promises", p)} />;
      case "playlist":
        return <Playlist data={config.playlist} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-shell transition-opacity duration-700" style={{ opacity: isTransitioning ? 0 : 1 }}>
      {/* Spline Background with Fallback */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 ${splineLoaded && !splineError ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`} />
        <Spline
          scene="https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode"
          onLoad={() => setSplineLoaded(true)}
          onError={() => setSplineError(true)}
        />
      </div>

      {/* Scroll Progress Bar */}
      {activeMode !== "proposal" && (
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} role="progressbar" aria-valuenow={Math.round(scrollProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Scroll progress" />
      )}

      <Nav activeMode={activeMode} setActiveMode={setActiveMode} visitedModes={visitedModes} />

      <main ref={mainRef} className="page-scroll" style={{ paddingTop: "calc(var(--safe-top) + 3.5rem)" }}>
        <div className={`page-content ${config.selectionColor}`}>
          {activeMode === "proposal" ? (
            <div className="proposal-stage">
              {renderMode()}
            </div>
          ) : (
            <div className="mode-stage animate-fade-in">
              <div className="mode-header relative">
                <div>
                  <h1
                    className="text-2xl md:text-4xl font-bold mb-1.5 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                    style={{ fontFamily: "Charm, serif" }}
                  >
                    {config.navTitle}
                  </h1>
                  {config.title && (
                    <p className="text-xs md:text-sm text-zinc-500" style={{ fontFamily: "Charm, serif" }}>
                      {config.title}
                    </p>
                  )}
                  <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
                </div>
                <button
                  onClick={shareMode}
                  className="absolute top-0 right-0 w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:bg-white/60 transition-all cursor-pointer"
                  aria-label="Share this mode"
                  title="Share"
                >
                  <BsShareFill size={14} />
                </button>
              </div>
              <div className="mode-body">
                {renderMode()}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
          aria-label="Back to top"
        >
          <BsArrowUp size={16} />
        </button>
      )}

      {/* Draggable Music Control */}
      <FloatingMusicControl
        tracks={loveTracks}
      />

      {/* Achievement Toast */}
      {pendingAchievement && (
        <AchievementToast achievement={pendingAchievement} onDone={() => setPendingAchievement(null)} />
      )}

      {/* Achievement History Button */}
      {achievements.length > 0 && (
        <button
          onClick={() => setShowAchievementHistory(!showAchievementHistory)}
          className="fixed bottom-20 left-4 md:bottom-4 md:left-4 z-40 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md bg-white/60 border border-white/40 text-zinc-600 hover:text-amber-500 hover:bg-white/80 transition-all cursor-pointer shadow-lg"
          aria-label={`View ${achievements.length} achievements`}
          title={`${achievements.length} achievements`}
        >
          <span className="text-sm">🏆</span>
        </button>
      )}

      {/* Achievement History Panel */}
      {showAchievementHistory && (
        <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center p-4" onClick={() => setShowAchievementHistory(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative glass-card p-5 w-full max-w-sm max-h-[60vh] overflow-y-auto no-scrollbar animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-800">Achievements ({achievements.length})</h3>
              <button
                onClick={() => setShowAchievementHistory(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
                aria-label="Close achievements"
              >
                <BsX size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {achievements.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
                  <span className="text-xl">{a.icon}</span>
                  <p className="text-xs font-bold text-zinc-700">{a.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="onboarding-overlay" onClick={dismissOnboarding} role="dialog" aria-label="Welcome tour">
          <div className="onboarding-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="text-xl font-bold text-zinc-900 mb-1" style={{ fontFamily: "Charm, serif" }}>
                Welcome to {config.title?.replace(/[❤️🎂💑💝🎉]/g, "").trim() || "Always Be Mine"}
              </h2>
              <p className="text-xs text-zinc-500">Explore our story through different modes</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {config.modes.map((mode) => (
                <div key={mode} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="text-base">{modeLabels[mode]?.split(" ")[0]}</span>
                  <span className="text-[11px] font-bold text-zinc-600">{modeLabels[mode]?.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
            <button
              onClick={dismissOnboarding}
              className="w-full btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-sm"
            >
              Start Exploring 💕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
