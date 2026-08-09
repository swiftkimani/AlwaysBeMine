import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Loads + saves a couple's gamification state (No-click count,
// achievements, letter progress). No-op when there's no coupleId — the
// static "/" demo never has one, so it stays pure in-memory as before.
export default function useCoupleProgress(coupleId) {
  const [progress, setProgress] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!coupleId || !supabase) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    supabase
      .from("couple_progress")
      .select("*")
      .eq("couple_id", coupleId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setProgress(data);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [coupleId]);

  const save = useCallback(
    (patch) => {
      if (!coupleId || !supabase) return;
      supabase
        .from("couple_progress")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("couple_id", coupleId)
        .then(() => {});
    },
    [coupleId]
  );

  return { progress, loaded, save };
}
