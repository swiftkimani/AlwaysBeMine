import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Loads a couple's editable content row and exposes a save() that persists
// only the changed columns (couple_content has one jsonb/text column per
// section, so a partial update never touches sections another editor
// panel is mid-edit on).
export default function useCoupleContent(coupleId) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!coupleId) return;
    let cancelled = false;
    supabase
      .from("couple_content")
      .select("*")
      .eq("couple_id", coupleId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) setError(fetchError.message);
        else setContent(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [coupleId]);

  const save = useCallback(
    async (patch) => {
      const { data, error: saveError } = await supabase
        .from("couple_content")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("couple_id", coupleId)
        .select()
        .single();
      if (saveError) throw saveError;
      setContent(data);
      return data;
    },
    [coupleId]
  );

  return { content, loading, error, save };
}
