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
import nomusic1 from "./assets/AudioTracks/Rejection_WeDontTalkAnyMore.mp3";
import nomusic2 from "./assets/AudioTracks/Rejection_LoseYouToLoveMe.mp3";
import nomusic3 from "./assets/AudioTracks/Reject_withoutMe.mp3";
import nomusic4 from "./assets/AudioTracks/Neutral_Base_IHateU.mp3";
import nomusic5 from "./assets/AudioTracks/Reject1_TooGood.mp3";

const YesGifs = [yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11];
const NoGifs = [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8];
const YesMusic = [yesmusic1, yesmusic3, yesmusic4, yesmusic2];
const NoMusic = [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5];

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
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] achievement-toast">
      <div className="glass-card px-5 py-3 flex items-center gap-3 shadow-2xl border border-amber-200/40">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Achievement Unlocked!</p>
          <p className="text-sm font-bold text-zinc-800">{achievement.label}</p>
        </div>
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

function Nav({ activeMode, setActiveMode }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-b border-white/40" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 md:py-2.5 flex gap-1 md:gap-1.5 overflow-x-auto no-scrollbar">
        {config.modes.map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setActiveMode(mode);
              window.location.hash = mode;
            }}
            className={`shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeMode === mode
                ? "btn-glow bg-white/80 text-zinc-900 shadow-lg shadow-rose-200/30"
                : "text-zinc-700 hover:bg-white/50 hover:text-zinc-900"
            }`}
          >
            {modeLabels[mode] || mode}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ModeHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-6 md:mb-8">
      <h1
        className="text-2xl md:text-4xl font-bold mb-1.5 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        style={{ fontFamily: "Charm, serif" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs md:text-sm text-zinc-500" style={{ fontFamily: "Charm, serif" }}>
          {subtitle}
        </p>
      )}
      <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
    </div>
  );
}

export default function Page() {
  const [activeMode, setActiveMode] = useState(getInitialMode);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [yesPopupShown, setYesPopupShown] = useState(false);
  const [floatingGifs, setFloatingGifs] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievement, setPendingAchievement] = useState(null);

  const gifRef = useRef(null);
  const yesButtonSize = Math.min(noCount * 12 + 18, 60);

  const unlockedAchievements = useRef(new Set());

  const unlockAchievement = useCallback((id, icon, label) => {
    if (unlockedAchievements.current.has(id)) return;
    unlockedAchievements.current.add(id);
    setAchievements((prev) => [...prev, { id, icon, label }]);
    setPendingAchievement({ icon, label });
  }, []);

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

  const playMusic = useCallback((url, musicArray) => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    const audio = new Audio(url);
    audio.muted = isMuted;
    setCurrentAudio(audio);
    audio.addEventListener("ended", () => {
      const idx = musicArray.indexOf(url);
      playMusic(musicArray[(idx + 1) % musicArray.length], musicArray);
    });
    audio.play().catch(() => {});
  }, [currentAudio, isMuted]);

  const handleYesClick = useCallback(() => {
    if (!popupShown) setYesPressed(true);
    if (noCount > 3) { setYesPressed(true); playMusic(YesMusic[0], YesMusic); }
  }, [noCount, popupShown, playMusic]);

  const handleNoClick = useCallback(() => {
    const next = noCount + 1;
    setNoCount(next);
    if (next >= 4 && gifRef.current) gifRef.current.src = NoGifs[(next - 4) % NoGifs.length];
    if (next === 1 || (next - 1) % 7 === 0) playMusic(NoMusic[Math.floor(next / 7) % NoMusic.length], NoMusic);
    if (next === 5) unlockAchievement("persistent", "😤", "Persistent - Clicked No 5 times!");
    if (next === 10) unlockAchievement("stubborn", "💢", "Stubborn - 10 No clicks!");
    if (next === 15) unlockAchievement("unbreakable", "🛡️", "Unbreakable - 15 No clicks!");
  }, [noCount, playMusic, unlockAchievement]);

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
          <div className="flex flex-col items-center animate-fade-in">
            {noCount > mouseStealMin && noCount < mouseStealMax && !yesPressed && <MouseStealing />}
            {yesPressed && noCount > 3 ? (
              <>
                <img ref={gifRef} className="h-[180px] md:h-[220px] rounded-2xl shadow-2xl" src={YesGifs[currentGifIndex]} alt="Yes Response" />
                <div className="text-3xl md:text-5xl font-bold my-3 text-center bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: "Charm, serif" }}>{config.yesTitle}</div>
                <div className="text-xl md:text-3xl font-bold my-1 text-center" style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}>{config.yesSubtitle}</div>
                <WordMarquee messages={config.marqueeMessages} />
              </>
            ) : (
              <>
                <img src={lovesvg} className="fixed animate-pulse top-16 md:left-15 left-6 md:w-40 w-24 drop-shadow-lg z-10" alt="Love SVG" />
                <img ref={gifRef} className="h-[180px] md:h-[220px] rounded-2xl shadow-2xl" src={Lovegif} alt="Love Animation" />
                <h1 className="text-2xl md:text-5xl my-4 md:my-5 text-center font-bold" style={{ fontFamily: "Charm, serif" }}>{config.heading}</h1>
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
              </>
            )}
          </div>
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
    <div className={`min-h-screen transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Spline scene="https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode" />
      </div>

      <Nav activeMode={activeMode} setActiveMode={setActiveMode} />

      <main className="pb-28 md:pb-20 min-h-screen text-zinc-900 overflow-y-auto no-scrollbar" style={{ paddingTop: "calc(var(--safe-top) + 3.5rem)" }}>
        <div className={`max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 ${config.selectionColor}`}>
          {activeMode === "proposal" ? (
            <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
              {renderMode()}
            </div>
          ) : (
            <div className="animate-fade-in py-6 md:py-8">
              <ModeHeader title={config.navTitle} subtitle={config.title} />
              {renderMode()}
            </div>
          )}
        </div>
      </main>

      {/* Draggable Music Control */}
      <FloatingMusicControl
        tracks={loveTracks}
        onMuteChange={(muted) => {
          setIsMuted(muted);
          if (currentAudio) currentAudio.muted = muted;
        }}
      />

      {/* Achievement Toast */}
      {pendingAchievement && (
        <AchievementToast achievement={pendingAchievement} onDone={() => setPendingAchievement(null)} />
      )}

      <Footer />
    </div>
  );
}
