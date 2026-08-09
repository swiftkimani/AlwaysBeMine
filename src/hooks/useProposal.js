import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import useCoupleConfig from "./useCoupleConfig.js";
import { createFloatingGifs } from "../utils/floatingGifs.js";
import {
  YesGifs,
  NoGifs,
  heartGif,
  sadGif,
  purposerose,
  swalbg,
  loveu,
  stubbornBackdrop,
} from "../data/proposalAssets.js";

// The whole proposal state machine: yes/no counting, gif swapping,
// hover gifs, keyboard shortcuts and the three Swal popups. Lives in a
// hook (owned by App, not the proposal component) so progress survives
// switching to another mode and back.
export default function useProposal(activeMode, { unlockAchievement, onCelebrate }) {
  const config = useCoupleConfig();
  const swalBase = useMemo(
    () => ({
      padding: "2.5em 2em",
      color: config.popupColor,
      background: `#fff url(${swalbg})`,
      confirmButtonColor: "var(--color-love)",
    }),
    [config.popupColor]
  );
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [popupShown, setPopupShown] = useState(false);
  const [yesPopupShown, setYesPopupShown] = useState(false);
  const [floatingGifs, setFloatingGifs] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gifRef = useRef(null);

  // Grows with every "No" click for comic effect, but capped — the app
  // itself encourages repeated No-clicking (achievements at 5/10/15,
  // stubbornCount can be set to 25+ in config), and an uncapped value
  // here would grow past 300px and break the page layout for exactly
  // the users the game design rewards for clicking No the most.
  const yesButtonSize = noCount === 0 ? "1.2rem" : Math.min(noCount * 12 + 16, 96) + "px";
  const noButtonLabel =
    noCount === 0 ? "No" : config.noPhrases[Math.min(noCount, config.noPhrases.length - 1)];

  const [mouseStealMin, mouseStealMax] = config.mouseStealerRange;
  const showMouseStealer = noCount > mouseStealMin && noCount < mouseStealMax && !yesPressed;

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

  // Keyboard shortcuts, proposal mode only: Enter/Space = yes, Esc = no
  useEffect(() => {
    if (activeMode !== "proposal") return;
    const h = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleYesClick();
      } else if (e.key === "Escape") handleNoClick();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeMode, handleYesClick, handleNoClick]);

  useEffect(() => {
    if (gifRef.current && yesPressed && noCount > 3) gifRef.current.src = YesGifs[currentGifIndex];
  }, [yesPressed, currentGifIndex, noCount]);

  // After the eventual yes, keep rotating through the celebration gifs
  useEffect(() => {
    if (yesPressed && noCount > 3) {
      const id = setInterval(() => setCurrentGifIndex((p) => (p + 1) % YesGifs.length), 5000);
      return () => clearInterval(id);
    }
  }, [yesPressed, noCount]);

  // Restart the current gif from frame 0 on every No click
  useEffect(() => {
    const el = gifRef.current;
    if (el) {
      const { src } = el;
      el.src = src;
    }
  }, [noCount]);

  // Early yes (before any real resistance)
  useEffect(() => {
    if (yesPressed && noCount < 4 && !popupShown) {
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({
          ...swalBase,
          title: config.earlyPopup,
          width: "min(700px, 92vw)",
          backdrop: `rgba(0,0,0,0.7) url(${loveu}) right bottom / contain no-repeat`,
        });
        setPopupShown(true);
        setYesPressed(false);
        setIsTransitioning(false);
        unlockAchievement("first-yes", "💕", "First Yes! You said yes!");
      }, 400);
    }
  }, [yesPressed, noCount, popupShown, unlockAchievement, config.earlyPopup, swalBase]);

  // Eventual yes after 4+ No clicks — the big celebration
  useEffect(() => {
    if (yesPressed && noCount > 3 && !yesPopupShown) {
      onCelebrate();
      setIsTransitioning(true);
      setTimeout(() => {
        Swal.fire({
          ...swalBase,
          title: config.latePopup,
          width: "min(800px, 92vw)",
          backdrop: `rgba(0,0,0,0.75) url(${purposerose}) right bottom / contain no-repeat`,
        });
        setYesPopupShown(true);
        setYesPressed(true);
        setIsTransitioning(false);
        unlockAchievement("eventual-yes", "🎉", "Eventual Yes! Love conquers all!");
      }, 400);
    }
  }, [yesPressed, noCount, yesPopupShown, unlockAchievement, onCelebrate, config.latePopup, swalBase]);

  // Gentle nudge once the No count hits the configured stubborn threshold
  useEffect(() => {
    if (noCount === config.stubbornCount) {
      Swal.fire({
        ...swalBase,
        title: config.stubbornPopup,
        width: "min(850px, 92vw)",
        backdrop: `rgba(0,0,0,0.75) url(${stubbornBackdrop}) right bottom / contain no-repeat`,
      });
    }
  }, [noCount, config.stubbornCount, config.stubbornPopup, swalBase]);

  return {
    gifRef,
    noCount,
    yesPressed,
    currentGifIndex,
    floatingGifs,
    isTransitioning,
    yesButtonSize,
    noButtonLabel,
    showMouseStealer,
    handleYesClick,
    handleNoClick,
    handleMouseEnterYes,
    handleMouseEnterNo,
    handleMouseLeave,
  };
}
