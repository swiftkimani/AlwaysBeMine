import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

function daysBetween(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: "Still up, my love?", emoji: "🌙" };
  if (h < 12) return { text: "Good morning, beautiful", emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon, my love", emoji: "🌤️" };
  if (h < 21) return { text: "Good evening, gorgeous", emoji: "🌅" };
  return { text: "Thinking of you tonight", emoji: "🌙" };
}

function TimeGreeting() {
  const g = getTimeGreeting();
  return (
    <div className="time-greeting">
      <span>{g.emoji}</span>
      <span>{g.text}</span>
    </div>
  );
}

function LiveCountdown({ since }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!since) return null;
  const start = new Date(since).getTime();
  if (isNaN(start)) return null;

  const diff = Math.max(0, Date.now() - start);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  void tick;

  return (
    <div className="live-countdown">
      <div className="countdown-unit">
        <span className="countdown-num">{days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(hours).padStart(2, "0")}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(mins).padStart(2, "0")}</span>
        <span className="countdown-label">Min</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(secs).padStart(2, "0")}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
}

const loveMessages = [
  "I love you more than words can say 💕",
  "You make my heart skip a beat 💓",
  "Can't stop thinking about you 🥰",
  "You're the best thing that ever happened to me 💝",
  "Every moment with you is a treasure ✨",
  "You're my sunshine on a cloudy day 🌞",
  "I fall in love with you more every day 💗",
  "You're my person, always 💖",
  "Just wanted you to know... I love you 💌",
  "My heart belongs to you 💞",
  "You make everything better just by being you 🌸",
  "I'm so lucky to have you in my life 🍀",
  "You're my favorite notification 📱💕",
  "Thinking about our future makes me smile 🥹",
];

function ThinkingToast() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const show = () => {
      setMsg(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
      setVisible(true);
      setExiting(false);
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
      }, 4000);
    };
    const first = setTimeout(show, 15000);
    const interval = setInterval(show, 45000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[80] ${exiting ? "thinking-toast-exit" : "thinking-toast"}`}
    >
      <div className="liquid px-5 py-3 flex items-center gap-3 shadow-xl border border-rose-200/40 rounded-2xl">
        <span className="text-xl">💌</span>
        <p className="text-xs font-semibold text-zinc-700" style={{ fontFamily: "Charm, serif" }}>{msg}</p>
      </div>
    </div>
  );
}

function AmbientHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${8 + Math.random() * 84}%`,
      size: 12 + Math.random() * 14,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 15,
      emoji: ["💕", "💗", "💖", "✨", "🤍", "💕"][i % 6],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="ambient-heart"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function ConfettiBurst({ onDone }) {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: ["#f43f5e", "#ec4899", "#a855f7", "#fbbf24", "#f472b6", "#fb7185", "#c084fc", "#fda4af"][i % 8],
      x: (Math.random() - 0.5) * 200,
      rot: Math.random() * 720,
      delay: Math.random() * 0.4,
      size: 6 + Math.random() * 8,
      shape: i % 3 === 0 ? "circle" : "rect",
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            "--confetti-x": `${p.x}px`,
            "--confetti-rot": `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.shape === "circle" ? p.size : p.size * 0.6}px`,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

function HeartTrail() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    let last = 0;
    const isMobile = "ontouchstart" in window;
    if (isMobile) return;
    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 140) return;
      last = now;
      const id = `${now}-${Math.random()}`;
      const emojis = ["💕", "💗", "💖", "✨", "🤍", "💜"];
      setHearts((prev) => [...prev.slice(-10), {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1300);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[150]" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-trail"
          style={{ left: h.x - 7, top: h.y - 7 }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function SendLoveBar({ onLovePopup }) {
  const [counts, setCounts] = useState({ kiss: 0, hug: 0, heartbeat: 0, rose: 0, magic: 0 });

  const items = [
    { emoji: "💋", label: "Kiss", id: "kiss", burst: ["💋", "😘", "💕", "💗"] },
    { emoji: "🤗", label: "Hug", id: "hug", burst: ["🤗", "🫂", "💞", "💖"] },
    { emoji: "💓", label: "Heartbeat", id: "heartbeat", burst: ["💓", "💗", "❤️‍🔥", "💝"] },
    { emoji: "🌹", label: "Rose", id: "rose", burst: ["🌹", "🌷", "🌸", "🌺"] },
    { emoji: "✨", label: "Magic", id: "magic", burst: ["✨", "💫", "⭐", "🌟"] },
  ];

  const handleClick = (item) => {
    setCounts((prev) => ({ ...prev, [item.id]: prev[item.id] + 1 }));
    const burstEmojis = item.burst;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => onLovePopup(burstEmojis[i % burstEmojis.length]), i * 120);
    }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-3">
      {total > 0 && (
        <div className="text-center mb-2">
          <span className="text-[10px] font-bold text-rose-400 bg-rose-50/80 px-3 py-1 rounded-full border border-rose-200/50 backdrop-blur-sm">
            💕 {total} love{total !== 1 ? "s" : ""} sent
          </span>
        </div>
      )}
      <div className="send-love-bar">
        {items.map((item) => (
          <button
            key={item.id}
            className="send-love-btn"
            onClick={() => handleClick(item)}
            aria-label={`Send ${item.label}`}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="label">{item.label}</span>
            {counts[item.id] > 0 && (
              <span className="text-[9px] font-bold text-rose-400">{counts[item.id]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
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
      <div className="bg-white/95 backdrop-blur-md px-6 py-4 flex items-center gap-4 shadow-[0_15px_40px_-5px_rgba(251,191,36,0.5)] border-2 border-amber-300 rounded-[2rem] w-[90vw] max-w-sm">
        <span className="text-4xl drop-shadow-md" aria-hidden="true">{achievement.icon}</span>
        <div className="flex-1">
          <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Achievement Unlocked!</p>
          <p className="text-lg font-bold text-zinc-900 leading-tight">{achievement.label}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-500 hover:text-zinc-800 hover:bg-amber-100 transition-all cursor-pointer shrink-0"
          aria-label="Dismiss achievement"
        >
          <BsX size={20} />
        </button>
      </div>
    </div>
  );
}



function Nav({ activeMode, setActiveMode, visitedModes, onNavClick }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <nav
      style={{
        position: "fixed",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
      }}
      className="flex flex-col items-center gap-3 pointer-events-none"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Top Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-zinc-900 text-white rounded-full p-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center group relative border border-white/20"
        aria-label="Toggle navigation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-500 ${isOpen ? "" : "rotate-180"}`}>
          <path d="M18 15l-6-6-6 6"/>
        </svg>
        {/* Tooltip */}
        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg tracking-wide pointer-events-none">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>

      {/* The actual menu */}
      <div className={`liquid rounded-2xl border border-white/80 shadow-[0_12px_40px_-8px_rgba(225,29,72,0.25)] backdrop-blur-2xl pointer-events-auto transition-all duration-400 origin-top ${isOpen ? "opacity-100 scale-y-100 p-2" : "opacity-0 scale-y-0 h-0 overflow-hidden p-0 border-0 shadow-none"}`}>
        <div className="flex flex-col gap-1.5">
          {config.modes.map((mode) => {
            const isActive = activeMode === mode;
            const isVisited = visitedModes.has(mode);
            const icon = (modeLabels[mode] || mode).split(" ")[0];

            return (
              <button
                key={mode}
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
                title={modeLabels[mode] || mode}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/40 scale-105"
                    : "bg-white/60 hover:bg-white/90 text-zinc-600 hover:text-rose-500 border border-white/70 hover:scale-105"
                }`}
              >
                <span className="leading-none select-none">{icon}</span>
                {isVisited && !isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
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
  const [ripple, setRipple] = useState(false);
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [tapHearts, setTapHearts] = useState([]);
  const [lovePopups, setLovePopups] = useState([]);
  const tapTimerRef = useRef(null);

  const gifRef = useRef(null);
  const mainRef = useRef(null);
  const yesButtonSize = noCount === 0 ? "1.2rem" : (noCount * 12 + 16) + "px";

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
        Swal.fire({
          title: config.earlyPopup,
          showClass: { popup: "animate__animated animate__slideInUp animate__faster" },
          hideClass: { popup: "animate__animated animate__fadeOut animate__faster" },
          width: "min(700px, 92vw)",
          padding: "2.5em 2em",
          color: config.popupColor,
          background: `#fff url(${swalbg})`,
          backdrop: `rgba(0,0,0,0.7) url(${loveu}) right bottom / contain no-repeat`,
          confirmButtonColor: "#e11d48",
        });
        setPopupShown(true); setYesPressed(false); setIsTransitioning(false);
        unlockAchievement("first-yes", "💕", "First Yes! You said yes!");
      }, 400);
    }
  }, [yesPressed, noCount, popupShown, unlockAchievement]);

  useEffect(() => {
    if (yesPressed && noCount > 3 && !yesPopupShown) {
      setShowConfetti(true);
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({
          title: config.latePopup,
          showClass: { popup: "animate__animated animate__slideInUp animate__faster" },
          hideClass: { popup: "animate__animated animate__fadeOut animate__faster" },
          width: "min(800px, 92vw)",
          padding: "2.5em 2em",
          color: config.popupColor,
          background: `#fff url(${swalbg})`,
          backdrop: `rgba(0,0,0,0.75) url(${purposerose}) right bottom / contain no-repeat`,
          confirmButtonColor: "#e11d48",
        });
        setYesPopupShown(true); setYesPressed(true); setIsTransitioning(false);
        unlockAchievement("eventual-yes", "🎉", "Eventual Yes! Love conquers all!");
      }, 400);
    }
  }, [yesPressed, noCount, yesPopupShown, unlockAchievement]);

  useEffect(() => {
    if (noCount === config.stubbornCount) {
      Swal.fire({
        title: config.stubbornPopup,
        showClass: { popup: "animate__animated animate__slideInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOut animate__faster" },
        width: "min(850px, 92vw)",
        padding: "2.5em 2em",
        color: config.popupColor,
        background: `#fff url(${swalbg})`,
        backdrop: `rgba(0,0,0,0.75) url(${nogif1}) right bottom / contain no-repeat`,
        confirmButtonColor: "#e11d48",
      });
    }
  }, [noCount]);

  const [mouseStealMin, mouseStealMax] = config.mouseStealerRange;

  // Double-tap / double-click to spawn hearts
  useEffect(() => {
    let lastTap = 0;
    const handleTap = (e) => {
      const now = Date.now();
      if (now - lastTap < 350) {
        const id = `${now}-${Math.random()}`;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        setTapHearts((prev) => [...prev.slice(-8), { id, x, y }]);
        setTimeout(() => setTapHearts((prev) => prev.filter((h) => h.id !== id)), 1100);
      }
      lastTap = now;
    };
    window.addEventListener("dblclick", handleTap);
    return () => window.removeEventListener("dblclick", handleTap);
  }, []);

  const triggerLovePopup = useCallback((emoji) => {
    const id = `${Date.now()}-${Math.random()}`;
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 100;
    const x = window.innerWidth / 2 + Math.cos(angle) * dist;
    const y = window.innerHeight / 2 + Math.sin(angle) * dist;
    setLovePopups((prev) => [...prev.slice(-8), { id, emoji, x, y }]);
    setTimeout(() => setLovePopups((prev) => prev.filter((p) => p.id !== id)), 2200);
  }, []);

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
                <img ref={gifRef} className="h-[200px] md:h-[240px] rounded-3xl drop-shadow-[0_15px_30px_rgba(225,29,72,0.35)] mx-auto hover:scale-105 transition-all duration-500" src={YesGifs[currentGifIndex]} alt="Yes Response" />
                <div className="text-3xl md:text-5xl font-bold my-3 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: "Charm, serif" }}>{config.yesTitle}</div>
                <div className="text-xl md:text-3xl font-bold my-1" style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}>{config.yesSubtitle}</div>
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold proposal-heading bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent px-2 leading-normal drop-shadow-md my-4 pb-4 sm:pb-6" style={{ fontFamily: "Charm, cursive, serif" }}>
                  {config.heading}
                </h1>

                {/* Big Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center w-full my-2">
                  <button onMouseEnter={handleMouseEnterYes} onMouseLeave={handleMouseLeave}
                    className={`btn-primary btn-yes-pulse`}
                    style={{ fontSize: yesButtonSize, padding: "0.6em 1.5em", transition: "all 0.2s ease" }}
                    onClick={handleYesClick}>
                    {config.acceptBtn}
                  </button>
                  <button onMouseEnter={handleMouseEnterNo} onMouseLeave={handleMouseLeave} onClick={handleNoClick}
                    className={`btn-secondary`}
                    style={{ fontSize: "1.1rem" }}>
                    {noCount === 0 ? "No" : getNoButtonText()}
                  </button>
                </div>

                {/* Send Love Bar - Footer */}
                <div className="w-full mt-4">
                  <SendLoveBar onLovePopup={triggerLovePopup} />
                </div>

                {/* Ambient Floating Elements */}
                {floatingGifs.map((gif) => (
                  <img key={gif.id} src={gif.src} alt="" className="absolute w-10 h-10 md:w-12 md:h-12 animate-float pointer-events-none opacity-80" style={gif.style} />
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

  const triggerRipple = useCallback(() => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  }, []);

  return (
    <div className="page-shell transition-opacity duration-700" style={{ opacity: isTransitioning ? 0 : 1 }}>
      {/* Ripple page transition overlay */}
      {ripple && (
        <div className="page-ripple-overlay" aria-hidden="true" />
      )}

      {/* Floating Greeting Badge — always top-right */}
      <div className="greeting-badge">
        <TimeGreeting />
        {config.togetherSince && (() => {
          const days = daysBetween(config.togetherSince);
          return days !== null ? (
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-px bg-rose-300" />
              <span className="text-rose-600 font-black text-xs">{days}</span>
              <span className="text-zinc-600 font-semibold text-[10px]">Days 💕</span>
            </div>
          ) : null;
        })()}
      </div>

      {/* Ambient Floating Hearts */}
      <AmbientHearts />

      {/* Heart Cursor Trail — only on proposal */}
      {activeMode === "proposal" && <HeartTrail />}

      {/* Thinking of You Toasts — only on proposal */}
      {activeMode === "proposal" && <ThinkingToast />}

      {/* Love Popups from Send Love buttons */}
      {lovePopups.map((p) => (
        <span key={p.id} className="love-popup" style={{ left: p.x - 32, top: p.y - 32 }} aria-hidden="true">{p.emoji}</span>
      ))}

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

      {/* Confetti on Yes */}
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Tap Hearts */}
      {tapHearts.map((h) => (
        <span key={h.id} className="tap-heart" style={{ left: h.x - 16, top: h.y - 16 }} aria-hidden="true">❤️</span>
      ))}

      <Nav activeMode={activeMode} setActiveMode={setActiveMode} visitedModes={visitedModes} onNavClick={triggerRipple} />

      <main ref={mainRef} className="page-scroll w-full">
        <div className={`page-content ${config.selectionColor}`}>
          {activeMode === "proposal" ? (
            <div className="proposal-stage">
              {renderMode()}
            </div>
          ) : (
            <div className="mode-stage mode-enter" key={activeMode}>
              <div className="mode-header flex flex-col items-center justify-center relative mb-5">
                <div className="text-center">
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                    style={{ fontFamily: "Charm, serif" }}
                  >
                    {config.navTitle}
                  </h1>
                  {config.title && (
                    <p className="text-xs sm:text-sm text-zinc-500" style={{ fontFamily: "Charm, serif" }}>
                      {config.title}
                    </p>
                  )}
                  <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
                </div>
              </div>
              <div className="mode-body">
                {renderMode()}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Music FAB — chatbot-style, bottom right */}
      <FloatingMusicControl tracks={loveTracks} />

      {/* Utility rail — slim buttons stacked above music FAB */}
      <div className="fixed bottom-24 right-4 sm:right-5 z-40 flex flex-col items-center gap-2">
        {achievements.length > 0 && (
          <button
            onClick={() => setShowAchievementHistory(!showAchievementHistory)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/70 hover:bg-white/95 text-zinc-700 hover:text-amber-500 transition-all cursor-pointer border border-white/80 shadow-md backdrop-blur-md relative"
            aria-label={`View ${achievements.length} achievements`}
            title={`${achievements.length} achievements`}
          >
            <span className="text-base">🏆</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
              {achievements.length}
            </span>
          </button>
        )}

        {showBackToTop && (
          <button
            onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/70 hover:bg-white/95 text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer border border-white/80 shadow-md backdrop-blur-md"
            aria-label="Back to top"
            title="Back to top"
          >
            <BsArrowUp size={14} />
          </button>
        )}
      </div>

      {/* Achievement Toast */}
      {pendingAchievement && (
        <AchievementToast achievement={pendingAchievement} onDone={() => setPendingAchievement(null)} />
      )}

      {/* Achievement History Panel */}
      {showAchievementHistory && (
        <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center p-4" onClick={() => setShowAchievementHistory(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowAchievementHistory(false)} />
          <div
            className="relative liquid p-5 w-full max-w-sm max-h-[60vh] overflow-y-auto no-scrollbar animate-fade-in-up"
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
    </div>
  );
}
