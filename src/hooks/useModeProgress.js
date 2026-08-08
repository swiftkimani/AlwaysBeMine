import { useState, useCallback } from "react";

// Accumulates XP from the per-mode onProgress callbacks. Nothing renders
// totalXP yet — it's exposed for a future XP/level display.
export default function useModeProgress() {
  const [totalXP, setTotalXP] = useState(0);

  const handleModeProgress = useCallback((mode, progress) => {
    setTotalXP((prev) => {
      const expected = progress.completed * (mode === "quiz" ? 25 : mode === "timeline" ? 15 : 10);
      return prev + Math.max(0, expected - prev);
    });
  }, []);

  return { totalXP, handleModeProgress };
}
