import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Tracks the current Supabase auth session for the whole app: one initial
// fetch plus a subscription, so login/logout in one tab (or a token
// refresh) is reflected everywhere without polling.
export default function useAuthSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
