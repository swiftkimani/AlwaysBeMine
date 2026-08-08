import { useState, useRef, useCallback } from "react";

// Unlock-once achievement list plus the queued toast for the newest one.
export default function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievement, setPendingAchievement] = useState(null);
  const unlocked = useRef(new Set());

  const unlockAchievement = useCallback((id, icon, label) => {
    if (unlocked.current.has(id)) return;
    unlocked.current.add(id);
    setAchievements((prev) => [...prev, { id, icon, label }]);
    setPendingAchievement({ icon, label });
  }, []);

  const dismissPending = useCallback(() => setPendingAchievement(null), []);

  return { achievements, pendingAchievement, unlockAchievement, dismissPending };
}
