import { useState, useEffect } from "react";
import useCoupleConfig from "./useCoupleConfig.js";
import { getInitialMode } from "../utils/helpers.js";

// Owns which mode is on screen: hash-derived initial mode, hashchange
// syncing, and the persisted set of modes the visitor has already seen.
export default function useActiveMode() {
  const config = useCoupleConfig();
  const [activeMode, setActiveMode] = useState(() => getInitialMode(config.modes));
  const [visitedModes, setVisitedModes] = useState(() => {
    const saved = localStorage.getItem("abm_visited");
    return new Set(saved ? JSON.parse(saved) : [getInitialMode(config.modes)]);
  });

  // Track visited modes
  useEffect(() => {
    setVisitedModes((prev) => {
      const next = new Set(prev);
      next.add(activeMode);
      localStorage.setItem("abm_visited", JSON.stringify([...next]));
      return next;
    });
  }, [activeMode]);

  // Follow back/forward navigation and hand-edited hashes
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && config.modes.includes(hash)) setActiveMode(hash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [config]);

  return { activeMode, setActiveMode, visitedModes };
}
