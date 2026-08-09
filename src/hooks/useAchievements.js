import { useState, useRef, useCallback, useEffect } from "react";

// Unlock-once achievement list plus the queued toast for the newest one.
// initialAchievements arrives asynchronously (after a Supabase fetch, on
// the couple-page route only) — restoring it doesn't queue toasts, since
// those are only for achievements unlocked in the current session.
export default function useAchievements({ initialAchievements, onAchievementsChange } = {}) {
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievement, setPendingAchievement] = useState(null);
  const unlocked = useRef(new Set());
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current || !initialAchievements?.length) return;
    restored.current = true;
    initialAchievements.forEach((a) => unlocked.current.add(a.id));
    setAchievements(initialAchievements);
  }, [initialAchievements]);

  const unlockAchievement = useCallback(
    (id, icon, label) => {
      if (unlocked.current.has(id)) return;
      unlocked.current.add(id);
      setAchievements((prev) => {
        const next = [...prev, { id, icon, label }];
        onAchievementsChange?.(next);
        return next;
      });
      setPendingAchievement({ icon, label });
    },
    [onAchievementsChange]
  );

  const dismissPending = useCallback(() => setPendingAchievement(null), []);

  return { achievements, pendingAchievement, unlockAchievement, dismissPending };
}
