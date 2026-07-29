import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import Swal from "sweetalert2";
import config from "./config.js";
import MouseStealing from "./MouseStealer.jsx";
import WordMarquee from "./MarqueeProposal.jsx";
import { RomanceFXProvider, useRomance } from "./RomanceFX.jsx";
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

// The original 3D swirl background, lazy-loaded so its multi-MB runtime
// only ever downloads if someone actually picks it in the bg picker —
// everyone else keeps the lightweight, pure-CSS default.
const Spline = lazy(() => import("@splinetool/react-spline"));
const SPLINE_SCENE = "https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode";

const YesGifs = [yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11];
const NoGifs = [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8];

// Real, actual recordings — streamed via Spotify's licensed embed player
// (see useSpotifyEmbed.js) instead of bundling audio files locally.
const loveTracks = [
  { title: "Love Me Like You Do", artist: "Ellie Goulding", spotifyUri: "spotify:track:4fnIzIPlnq6bmV96NqJdGF" },
  { title: "Perfect", artist: "Ed Sheeran", spotifyUri: "spotify:track:0RqHgwssXvp8y56PbHGp72" },
  { title: "I Love You So", artist: "The Walters", spotifyUri: "spotify:track:4SqWKzw0CbA05TGszDgMlc" },
  { title: "Until I Found You", artist: "Stephen Sanchez", spotifyUri: "spotify:track:1GOsqtDkX9iFwdTYhaCu54" },
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

const BG_THEMES = [
  {
    id: "classic",
    label: "Classic Blush",
    emoji: "🌸",
    swatch: "linear-gradient(160deg, #fff6f8 0%, #ffeef2 35%, #fdf2f8 70%, #f6f1ff 100%)",
  },
  {
    id: "spiral",
    label: "Spiral Bloom",
    emoji: "🌀",
    swatch: "conic-gradient(from 0deg, #f43f5e, #a855f7, #ec4899, #fbbf24, #f43f5e)",
  },
  {
    id: "aurora",
    label: "Aurora Dream",
    emoji: "🌌",
    swatch: "linear-gradient(120deg, #f43f5e, #a855f7 45%, #38bdf8 100%)",
  },
  {
    id: "swirl",
    label: "Dream Swirl",
    emoji: "🔮",
    swatch: "linear-gradient(135deg, #5eead4 0%, #7dd3fc 40%, #c4b5fd 75%, #a855f7 100%)",
  },
  {
    id: "auto",
    label: "Auto Mix",
    emoji: "🎲",
    // No static swatch — this one gets its own animated CSS class
    // (.bg-swatch-auto) so the picker itself hints that it's alive.
    swatch: null,
  },
];

// Auto Mix cycles through the lightweight CSS themes only — the 3D swirl
// stays opt-in-only since re-mounting/unmounting it on a timer would mean
// repeatedly paying its load cost in the background.
const AUTO_ROTATE_THEMES = ["classic", "spiral", "aurora"];
const AUTO_ROTATE_INTERVAL_MS = 25000;

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
    return Array.from({ length: 6 }, (_, i) => ({
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
    { emoji: "💋", label: "Kiss", id: "kiss", burst: ["💋", "😘", "💕", "💗"], accent: "#f43f5e" },
    { emoji: "🤗", label: "Hug", id: "hug", burst: ["🤗", "🫂", "💞", "💖"], accent: "#f59e0b" },
    { emoji: "💓", label: "Heartbeat", id: "heartbeat", burst: ["💓", "💗", "❤️‍🔥", "💝"], accent: "#e11d48" },
    { emoji: "🌹", label: "Rose", id: "rose", burst: ["🌹", "🌷", "🌸", "🌺"], accent: "#ec4899" },
    { emoji: "✨", label: "Magic", id: "magic", burst: ["✨", "💫", "⭐", "🌟"], accent: "#a855f7" },
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
        <div className="text-center mb-2.5">
          <span className="send-love-total">
            💕 {total} love{total !== 1 ? "s" : ""} sent
          </span>
        </div>
      )}
      <div className="send-love-bar">
        {items.map((item) => (
          <button
            key={item.id}
            className="send-love-btn"
            style={{ "--accent": item.accent }}
            onClick={() => handleClick(item)}
            aria-label={`Send ${item.label}`}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="label">{item.label}</span>
            {counts[item.id] > 0 && (
              <span className="send-love-count">{counts[item.id]}</span>
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
      <div className="bg-white/95 backdrop-blur-md px-7 py-5 flex items-center gap-4 shadow-[0_15px_40px_-5px_rgba(251,191,36,0.5)] border-2 border-amber-300 rounded-[2rem] w-[90vw] max-w-sm">
        <span className="text-4xl drop-shadow-md" aria-hidden="true">{achievement.icon}</span>
        <div className="flex-1">
          <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1.5">Achievement Unlocked!</p>
          <p className="text-lg font-bold text-zinc-900" style={{ lineHeight: 1.4 }}>{achievement.label}</p>
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



/* The original 3D swirl, restored as an opt-in background. It fades in
   over a matching teal/purple gradient once loaded, and falls back to
   that same gradient permanently if the scene fails to load (offline,
   blocked request, etc.) — same defensive pattern the app used before
   this was replaced with pure CSS. */
function SwirlBackground() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-teal-100 via-cyan-50 to-purple-100 transition-opacity duration-1000 ${
          loaded && !errored ? "opacity-0" : "opacity-100"
        }`}
      />
      {!errored && (
        <Suspense fallback={null}>
          <Spline
            scene={SPLINE_SCENE}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        </Suspense>
      )}
    </>
  );
}

/* Background theme picker — a top-left twin to the rose-toned nav toggle
   on the right, in its own teal/purple/rose gradient so it reads as "the
   background control" at a glance. Panel opens downward since the button
   lives in the top corner. */
function BackgroundPicker({ bgTheme, setBgTheme }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const activeLabel = BG_THEMES.find((t) => t.id === bgTheme)?.label;

  return (
    <div
      ref={wrapRef}
      className="fixed top-3 left-3 sm:top-4 sm:left-4 z-[70]"
      style={{ transform: "translateZ(0)", willChange: "transform" }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className={`bg-picker-fab relative w-11 h-11 rounded-full cursor-pointer ${
          open ? "bg-picker-fab-active" : ""
        }`}
        aria-label="Change background"
        aria-expanded={open}
        title="Change background"
      >
        <span className="bg-picker-fab-glow" aria-hidden="true" />
        <span className="relative z-10 text-lg">🎨</span>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+12px)] left-0 w-72 animate-fade-in-up"
          style={{ transformOrigin: "top left" }}
        >
          {/* Tail pointing up to the palette button */}
          <div
            className="absolute -top-1.5 left-5 w-3.5 h-3.5 rotate-45 z-10"
            style={{
              background: "rgba(255,255,255,0.97)",
              borderLeft: "1px solid rgba(255,255,255,0.8)",
              borderTop: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "-2px -2px 6px rgba(94,234,212,0.15)",
            }}
          />
          <div className="liquid relative rounded-3xl p-4 shadow-[0_20px_50px_-10px_rgba(94,234,212,0.35)] border border-white/80">
            <div className="bg-picker-accent" />
            <p className="text-xs font-black text-zinc-700 mb-3 flex items-center gap-1.5">
              <span aria-hidden="true">🎨</span> Pick your vibe
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {BG_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setBgTheme(t.id)}
                  className={`bg-swatch ${t.id === "auto" ? "bg-swatch-auto" : ""} ${
                    bgTheme === t.id ? "bg-swatch-active" : ""
                  }`}
                  style={t.swatch ? { background: t.swatch } : undefined}
                  aria-label={`Use ${t.label} background`}
                  aria-pressed={bgTheme === t.id}
                  title={t.label}
                >
                  <span className="bg-swatch-emoji" aria-hidden="true">{t.emoji}</span>
                  <span className="bg-swatch-check" aria-hidden="true">✓</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-rose-500 mt-3 text-center">
              {activeLabel}
              {bgTheme === "auto" && (
                <span className="block text-[10px] font-semibold text-zinc-400 mt-0.5">
                  drifts to a new look every 25s ✨
                </span>
              )}
            </p>
          </div>
        </div>
      )}
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
        // translateZ(0) forces this onto its own GPU compositing layer so
        // mobile browsers (Safari especially) don't repaint it on every
        // scroll frame — that repaint lag is what reads as "the sidebar
        // moves during scroll" even though position:fixed is correct.
        transform: "translateY(-50%) translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        zIndex: 50,
      }}
      className="pointer-events-none"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Anchor wrapper — its box is sized ONLY by the toggle button below, since
          the panel is absolutely positioned. That keeps this height constant across
          open/close and page switches, so the translateY(-50%) centering above never
          recomputes and the toggle never visibly jumps. */}
      <div className="relative flex flex-col items-center">
        {/* Top Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav-toggle-btn pointer-events-auto text-white rounded-full w-11 h-11 shadow-[0_8px_24px_-4px_rgba(225,29,72,0.55)] hover:scale-110 active:scale-90 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-center group relative border border-white/40"
          aria-label="Toggle navigation"
        >
          <span className="nav-toggle-glow" aria-hidden="true" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`relative z-10 transition-transform duration-500 ${isOpen ? "" : "rotate-180"}`}>
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg tracking-wide pointer-events-none">
            {isOpen ? "Hide" : "Show"} 💕
          </span>
        </button>

        {/* The actual menu — absolutely positioned below the toggle so its size never
            affects the wrapper above. */}
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 liquid rounded-2xl border border-white/80 shadow-[0_16px_44px_-8px_rgba(225,29,72,0.3)] backdrop-blur-2xl p-2.5 transition-all duration-300 origin-top ${
            isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <div className="nav-panel-accent" aria-hidden="true" />
          <div className="flex flex-col gap-2.5">
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
                  className={`side-btn w-11 h-11 rounded-2xl text-xl ${
                    isActive ? "side-btn-active" : ""
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
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("abm_onboarded"));
  const [visitedModes, setVisitedModes] = useState(() => {
    const saved = localStorage.getItem("abm_visited");
    return new Set(saved ? JSON.parse(saved) : [getInitialMode()]);
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showAchievementHistory, setShowAchievementHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bgTheme, setBgTheme] = useState(() => localStorage.getItem("abm_bg_theme") || "spiral");
  const [autoIdx, setAutoIdx] = useState(0);
  const [tapHearts, setTapHearts] = useState([]);
  const tapTimerRef = useRef(null);
  const { burst } = useRomance();

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
  // Note: .page-scroll has no bounded height/overflow-y of its own, so the
  // document (window) is what actually scrolls — not the <main> element.
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const pct = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
      setScrollProgress(Math.min(100, pct));
      setShowBackToTop(scrollTop > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMode]);

  // Persist chosen background theme
  useEffect(() => {
    localStorage.setItem("abm_bg_theme", bgTheme);
  }, [bgTheme]);

  // Auto Mix: quietly cycle through the CSS-only themes on a timer,
  // reusing the same crossfade the manual picker uses.
  useEffect(() => {
    if (bgTheme !== "auto") return;
    const id = setInterval(() => {
      setAutoIdx((i) => (i + 1) % AUTO_ROTATE_THEMES.length);
    }, AUTO_ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [bgTheme]);

  const effectiveBgTheme = bgTheme === "auto" ? AUTO_ROTATE_THEMES[autoIdx] : bgTheme;

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
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 100;
    const x = window.innerWidth / 2 + Math.cos(angle) * dist;
    const y = window.innerHeight / 2 + Math.sin(angle) * dist;
    burst(emoji, x, y);
  }, [burst]);

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
                <div className="text-3xl md:text-5xl font-bold mt-4 mb-3" style={{ fontFamily: "Charm, serif", lineHeight: 1.5 }}>
                  <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 bg-clip-text text-transparent">{config.yesTitle}</span>
                </div>
                <div className="text-xl md:text-3xl font-bold mb-4" style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500, lineHeight: 1.6 }}>{config.yesSubtitle}</div>
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

      {/* Romantic Background — five selectable themes (Classic, Spiral
          Bloom, Aurora Dream, the original Dream Swirl 3D scene, and Auto
          Mix) stacked as crossfading layers so switching in the picker —
          manually or on Auto Mix's own timer — dissolves smoothly instead
          of cutting. The swirl only mounts its heavy 3D runtime while
          actually selected, and Auto Mix never rotates into it. */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className={`bg-layer bg-theme-classic ${effectiveBgTheme === "classic" ? "bg-layer-active" : ""}`} />
        <div className={`bg-layer bg-theme-spiral ${effectiveBgTheme === "spiral" ? "bg-layer-active" : ""}`}>
          <div className="romantic-blob romantic-blob-a" />
          <div className="romantic-blob romantic-blob-b" />
          <div className="spiral-swirl" />
        </div>
        <div className={`bg-layer bg-theme-aurora ${effectiveBgTheme === "aurora" ? "bg-layer-active" : ""}`}>
          <div className="aurora-ribbon aurora-ribbon-a" />
          <div className="aurora-ribbon aurora-ribbon-b" />
          <div className="aurora-ribbon aurora-ribbon-c" />
          <div className="aurora-sparkles" />
        </div>
        {bgTheme === "swirl" && (
          <div className="bg-layer bg-layer-active bg-theme-swirl">
            <SwirlBackground />
          </div>
        )}
      </div>

      <BackgroundPicker bgTheme={bgTheme} setBgTheme={setBgTheme} />

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

      {/* Soft scrim so scrolling content fades behind the fixed sidebar / music FAB
          instead of clipping abruptly under them */}
      <div className="nav-scrim" aria-hidden="true" />
      <div className="fab-scrim" aria-hidden="true" />

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
      <FloatingMusicControl tracks={loveTracks} fallbackUrl={config.playlist?.languages?.[0]?.spotifyUrl} />

      {/* Utility rail — liquid glass buttons stacked above music FAB. Sized
          and spaced to a 44px touch target with generous gaps, same rule
          the nav rail and bg picker follow. */}
      <div className="fixed bottom-24 right-4 sm:right-5 z-40 flex flex-col items-center gap-3">
        {achievements.length > 0 && (
          <button
            onClick={() => setShowAchievementHistory(!showAchievementHistory)}
            className={`side-btn relative w-11 h-11 rounded-full ${showAchievementHistory ? "side-btn-active" : ""}`}
            aria-label={`View ${achievements.length} achievements`}
            title={`${achievements.length} achievements`}
          >
            <span className="relative z-10 text-lg">🏆</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center shadow-sm z-10">
              {achievements.length}
            </span>
          </button>
        )}

        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="side-btn w-11 h-11 rounded-full"
            aria-label="Back to top"
            title="Back to top"
          >
            <BsArrowUp size={16} className="relative z-10" />
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
