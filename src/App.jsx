import { useState, useRef, useEffect, useCallback } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill, BsMusicNoteBeamed } from "react-icons/bs";

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

function Footer() {
  return (
    <a
      className="fixed bottom-2 right-2 backdrop-blur-md opacity-70 hover:opacity-100 border px-3 py-1.5 rounded-xl border-white/20 bg-black/10 text-xs text-zinc-600 hover:text-zinc-900 transition-all duration-300 z-50"
      href="https://github.com/swiftkimani/AlwaysBeMine"
      target="_blank"
      rel="noopener noreferrer"
    >
      Inspired by Swift
    </a>
  );
}

function Nav({ activeMode, setActiveMode }) {
  const handleNav = (mode) => {
    setActiveMode(mode);
    window.location.hash = mode;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-white/15">
      <div className="max-w-5xl mx-auto px-3 py-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {config.modes.map((mode) => (
          <button
            key={mode}
            onClick={() => handleNav(mode)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeMode === mode
                ? "btn-glow bg-white/30 text-zinc-900 shadow-lg shadow-white/10"
                : "text-zinc-600 hover:bg-white/10 hover:text-zinc-800 hover:shadow-md"
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
    <div className="text-center mb-8 pt-4">
      <h1
        className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        style={{ fontFamily: "Charm, serif" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-zinc-500" style={{ fontFamily: "Charm, serif" }}>
          {subtitle}
        </p>
      )}
      <div className="w-20 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
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
  const [showPlaylist, setShowPlaylist] = useState(false);

  const gifRef = useRef(null);
  const yesButtonSize = Math.min(noCount * 14 + 18, 72);

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
  }, [noCount, playMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => { if (currentAudio) currentAudio.muted = !prev; return !prev; });
  }, [currentAudio]);

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
      }, 400);
    }
  }, [yesPressed, noCount, popupShown]);

  useEffect(() => {
    if (yesPressed && noCount > 3 && !yesPopupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({ title: config.latePopup, width: 800, padding: "2em", color: config.popupColor, background: `#fff url(${swalbg})`, backdrop: `rgba(0,0,123,0.7) url(${purposerose}) right no-repeat` });
        setYesPopupShown(true); setYesPressed(true); setIsTransitioning(false);
      }, 400);
    }
  }, [yesPressed, noCount, yesPopupShown]);

  useEffect(() => {
    if (noCount === config.stubbornCount) {
      Swal.fire({ title: config.stubbornPopup, width: 850, padding: "2em", color: config.popupColor, background: `#fff url(${swalbg})`, backdrop: `rgba(0,104,123,0.7) url(${nogif1}) right no-repeat` });
    }
  }, [noCount]);

  const [mouseStealMin, mouseStealMax] = config.mouseStealerRange;

  const renderMode = () => {
    switch (activeMode) {
      case "proposal":
        return (
          <div className="flex flex-col items-center animate-fade-in px-4">
            {noCount > mouseStealMin && noCount < mouseStealMax && !yesPressed && <MouseStealing />}
            {yesPressed && noCount > 3 ? (
              <>
                <img ref={gifRef} className="h-[200px] md:h-[230px] rounded-2xl shadow-2xl" src={YesGifs[currentGifIndex]} alt="Yes Response" />
                <div className="text-4xl md:text-6xl font-bold my-4 text-center bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: "Charm, serif" }}>{config.yesTitle}</div>
                <div className="text-2xl md:text-4xl font-bold my-1 text-center" style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}>{config.yesSubtitle}</div>
                <WordMarquee messages={config.marqueeMessages} />
              </>
            ) : (
              <>
                <img src={lovesvg} className="fixed animate-pulse top-16 md:left-15 left-6 md:w-40 w-28 drop-shadow-lg z-10" alt="Love SVG" />
                <img ref={gifRef} className="h-[200px] md:h-[230px] rounded-2xl shadow-2xl" src={Lovegif} alt="Love Animation" />
                <h1 className="text-3xl md:text-6xl my-5 text-center font-bold" style={{ fontFamily: "Charm, serif" }}>{config.heading}</h1>
                <div className="flex flex-wrap justify-center gap-4 items-center">
                  <button onMouseEnter={handleMouseEnterYes} onMouseLeave={handleMouseLeave}
                    className={`btn-glow ${config.acceptColor} text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer`}
                    style={{ fontSize: yesButtonSize, padding: "16px 40px" }} onClick={handleYesClick}>
                    {config.acceptBtn}
                  </button>
                  <button onMouseEnter={handleMouseEnterNo} onMouseLeave={handleMouseLeave} onClick={handleNoClick}
                    className={`${config.rejectColor} rounded-2xl text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer`}
                    style={{ fontSize: "1rem", padding: "16px 40px" }}>
                    {noCount === 0 ? "No" : getNoButtonText()}
                  </button>
                </div>
                {floatingGifs.map((gif) => (
                  <img key={gif.id} src={gif.src} alt="" className="absolute w-12 h-12 animate-bounce" style={gif.style} />
                ))}
              </>
            )}
          </div>
        );
      case "timeline":
        return <Timeline data={config.timeline} />;
      case "letter":
        return <LoveLetter data={config.letter} />;
      case "quiz":
        return <QuizGame data={config.quiz} results={config.quizResults} />;
      case "jar":
        return <ReasonsJar data={config.reasons} />;
      case "gallery":
        return <PhotoGallery data={config.gallery} />;
      case "promises":
        return <PromiseBuilder data={config.promises} title={config.promiseTitle} subtitle={config.promiseSubtitle} />;
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

      <div className={`pt-16 pb-24 min-h-screen flex flex-col items-center justify-center text-zinc-900 ${config.selectionColor}`}>
        {activeMode === "proposal" ? (
          renderMode()
        ) : (
          <div className="w-full max-w-5xl mx-auto animate-fade-in px-4">
            <ModeHeader title={config.navTitle} subtitle={config.title} />
            {renderMode()}
          </div>
        )}
      </div>

      <button
        className="fixed bottom-20 right-4 md:bottom-10 md:right-10 bg-black/15 backdrop-blur-sm p-3 rounded-full hover:bg-black/25 active:scale-90 transition-all duration-300 shadow-lg cursor-pointer z-50"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <BsVolumeMuteFill size={22} className="text-zinc-700" /> : <BsVolumeUpFill size={22} className="text-zinc-700" />}
      </button>

      {config.playlist?.spotify && (
        <button
          className={`fixed bottom-20 right-4 md:bottom-10 md:right-20 bg-black/15 backdrop-blur-sm p-3 rounded-full hover:bg-black/25 active:scale-90 transition-all duration-300 shadow-lg cursor-pointer z-50 ${showPlaylist ? "ring-2 ring-rose-400" : ""}`}
          onClick={() => setShowPlaylist((p) => !p)}
          aria-label="Toggle playlist"
        >
          <BsMusicNoteBeamed size={22} className="text-zinc-700" />
        </button>
      )}

      {showPlaylist && config.playlist?.spotify && (
        <div className="fixed bottom-36 right-4 md:bottom-28 md:right-10 z-50 animate-fade-in-up">
          <Playlist data={config.playlist} compact />
        </div>
      )}

      <Footer />
    </div>
  );
}
