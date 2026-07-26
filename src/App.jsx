import { useState, useRef, useEffect, useCallback } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";

import config from "./config.js";
import MouseStealing from "./MouseStealer.jsx";
import WordMarquee from "./MarqueeProposal.jsx";
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

const YesGifs = [
  yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5,
  yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11,
];
const NoGifs = [
  nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4,
  nogif5, nogif6, nogif7, nogif8,
];
const YesMusic = [yesmusic1, yesmusic3, yesmusic4, yesmusic2];
const NoMusic = [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5];

function generateRandomPositionWithSpacing(existingPositions) {
  const minDistance = 15;
  let position;
  let tooClose;
  do {
    position = {
      top: `${Math.random() * 90}vh`,
      left: `${Math.random() * 90}vw`,
    };
    tooClose = existingPositions.some((p) => {
      const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
      const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  } while (tooClose);
  return position;
}

function createFloatingGifs(gifSrc, idPrefix) {
  const gifs = [];
  const positions = [];
  for (let i = 0; i < 12; i++) {
    const pos = generateRandomPositionWithSpacing(positions);
    positions.push(pos);
    gifs.push({
      id: `${idPrefix}-${i}`,
      src: gifSrc,
      style: {
        ...pos,
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      },
    });
  }
  return gifs;
}

function Footer() {
  return (
    <div className="fixed bottom-2 left-2 right-2 flex justify-between items-end pointer-events-none z-50">
      <a
        className="pointer-events-auto backdrop-blur-md opacity-70 hover:opacity-100 border px-2 py-1 rounded-lg border-white/20 bg-black/10 text-xs text-zinc-600 hover:text-zinc-900 transition-all duration-300"
        href="https://github.com/swiftkimani/AlwaysBeMine"
        target="_blank"
        rel="noopener noreferrer"
      >
        Created by Swift
      </a>
      <a
        className="pointer-events-auto backdrop-blur-md opacity-70 hover:opacity-100 border px-2 py-1 rounded-lg border-white/20 bg-black/10 text-xs text-zinc-600 hover:text-zinc-900 transition-all duration-300"
        href="https://github.com/UjjwalSaini07/AlwaysBeMine"
        target="_blank"
        rel="noopener noreferrer"
      >
        Inspired by Ujjwal
      </a>
    </div>
  );
}

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [yesPopupShown, setYesPopupShown] = useState(false);
  const [floatingGifs, setFloatingGifs] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const gifRef = useRef(null);
  const yesButtonSize = Math.min(noCount * 14 + 18, 72);

  const handleMouseEnterYes = useCallback(() => {
    setFloatingGifs(createFloatingGifs(heartGif, "heart"));
  }, []);

  const handleMouseEnterNo = useCallback(() => {
    setFloatingGifs(createFloatingGifs(sadGif, "sad"));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setFloatingGifs([]);
  }, []);

  const playMusic = useCallback(
    (url, musicArray) => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      const audio = new Audio(url);
      audio.muted = isMuted;
      setCurrentAudio(audio);
      audio.addEventListener("ended", () => {
        const idx = musicArray.indexOf(url);
        playMusic(musicArray[(idx + 1) % musicArray.length], musicArray);
      });
      audio.play().catch(() => {});
    },
    [currentAudio, isMuted],
  );

  const handleYesClick = useCallback(() => {
    if (!popupShown) {
      setYesPressed(true);
    }
    if (noCount > 3) {
      setYesPressed(true);
      playMusic(YesMusic[0], YesMusic);
    }
  }, [noCount, popupShown, playMusic]);

  const handleNoClick = useCallback(() => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    if (nextCount >= 4) {
      const nextGifIndex = (nextCount - 4) % NoGifs.length;
      if (gifRef.current) {
        gifRef.current.src = NoGifs[nextGifIndex];
      }
    }
    if (nextCount === 1 || (nextCount - 1) % 7 === 0) {
      const nextSongIndex = Math.floor(nextCount / 7) % NoMusic.length;
      playMusic(NoMusic[nextSongIndex], NoMusic);
    }
  }, [noCount, playMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (currentAudio) currentAudio.muted = next;
      return next;
    });
  }, [currentAudio]);

  const getNoButtonText = () =>
    config.noPhrases[Math.min(noCount, config.noPhrases.length - 1)];

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleYesClick();
      } else if (e.key === "Escape") {
        handleNoClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleYesClick, handleNoClick]);

  // Cycle yes gifs
  useEffect(() => {
    if (gifRef.current && yesPressed && noCount > 3) {
      gifRef.current.src = YesGifs[currentGifIndex];
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- noCount intentionally excluded to avoid gif flicker
  }, [yesPressed, currentGifIndex]);

  useEffect(() => {
    if (yesPressed && noCount > 3) {
      const id = setInterval(() => {
        setCurrentGifIndex((prev) => (prev + 1) % YesGifs.length);
      }, 5000);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when yesPressed changes
  }, [yesPressed]);

  useEffect(() => {
    if (gifRef.current) {
      gifRef.current.src = gifRef.current.src;
    }
  }, [noCount]);

  // Early popup (noCount < threshold)
  useEffect(() => {
    if (yesPressed && noCount < 4 && !popupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({
          title: config.earlyPopup,
          showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
          width: 700,
          padding: "2em",
          color: config.popupColor,
          background: `#fff url(${swalbg})`,
          backdrop: `rgba(0,0,123,0.2) url(${loveu}) right no-repeat`,
        });
        setPopupShown(true);
        setYesPressed(false);
        setIsTransitioning(false);
      }, 400);
    }
  }, [yesPressed, noCount, popupShown]);

  // Late popup (after enough No clicks)
  useEffect(() => {
    if (yesPressed && noCount > 3 && !yesPopupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({
          title: config.latePopup,
          width: 800,
          padding: "2em",
          color: config.popupColor,
          background: `#fff url(${swalbg})`,
          backdrop: `rgba(0,0,123,0.7) url(${purposerose}) right no-repeat`,
        });
        setYesPopupShown(true);
        setYesPressed(true);
        setIsTransitioning(false);
      }, 400);
    }
  }, [yesPressed, noCount, yesPopupShown]);

  // Stubborn popup at high noCount
  useEffect(() => {
    if (noCount === config.stubbornCount) {
      Swal.fire({
        title: config.stubbornPopup,
        width: 850,
        padding: "2em",
        color: config.popupColor,
        background: `#fff url(${swalbg})`,
        backdrop: `rgba(0,104,123,0.7) url(${nogif1}) right no-repeat`,
      });
    }
  }, [noCount]);

  const [mouseStealMin, mouseStealMax] = config.mouseStealerRange;

  return (
    <div className={`transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Spline scene="https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode" />
      </div>

      {noCount > mouseStealMin &&
        noCount < mouseStealMax &&
        !yesPressed && <MouseStealing />}

      <div
        className={`overflow-hidden flex flex-col items-center justify-center pt-4 h-screen -mt-16 text-zinc-900 ${config.selectionColor}`}
      >
        {yesPressed && noCount > 3 ? (
          <div className="flex flex-col items-center animate-fade-in">
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg shadow-2xl"
              src={YesGifs[currentGifIndex]}
              alt="Yes Response"
            />
            <div
              className="text-4xl md:text-6xl font-bold my-3 text-center bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Charm, serif" }}
            >
              {config.yesTitle}
            </div>
            <div
              className="text-2xl md:text-4xl font-bold my-1 text-center"
              style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}
            >
              {config.yesSubtitle}
            </div>
            <WordMarquee messages={config.marqueeMessages} />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <img
              src={lovesvg}
              className="fixed animate-pulse top-10 md:left-15 left-6 md:w-40 w-28 drop-shadow-lg"
              alt="Love SVG"
            />
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg shadow-2xl"
              src={Lovegif}
              alt="Love Animation"
            />
            <h1
              className="text-3xl md:text-6xl my-4 text-center font-bold"
              style={{ fontFamily: "Charm, serif" }}
            >
              {config.heading}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 items-center">
              <button
                onMouseEnter={handleMouseEnterYes}
                onMouseLeave={handleMouseLeave}
                className={`${config.acceptColor} text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}
                style={{ fontSize: yesButtonSize }}
                onClick={handleYesClick}
              >
                {config.acceptBtn}
              </button>
              <button
                onMouseEnter={handleMouseEnterNo}
                onMouseLeave={handleMouseLeave}
                onClick={handleNoClick}
                className={`${config.rejectColor} rounded-xl text-white font-bold py-2.5 px-6 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer`}
              >
                {noCount === 0 ? "No" : getNoButtonText()}
              </button>
            </div>
            {floatingGifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.src}
                alt=""
                className="absolute w-12 h-12 animate-bounce"
                style={gif.style}
              />
            ))}
          </div>
        )}

        <button
          className="fixed bottom-10 right-10 bg-black/10 backdrop-blur-sm p-2.5 mb-2 rounded-full hover:bg-black/20 active:scale-90 transition-all duration-200 shadow-lg cursor-pointer z-50"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <BsVolumeMuteFill size={24} className="text-zinc-700" />
          ) : (
            <BsVolumeUpFill size={24} className="text-zinc-700" />
          )}
        </button>

        <Footer />
      </div>
    </div>
  );
}
