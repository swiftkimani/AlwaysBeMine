import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import staticConfig from "../config.js";
import { CoupleConfigContext } from "../context/CoupleConfigContext.js";
import App from "../App.jsx";

// Only the sections the dashboard editor can actually write to (letter,
// timeline, reasons) are overridden from the couple's row — everything
// else (proposal copy, nav title, modes list, popup phrases, quiz,
// playlist, gallery) still falls back to the static demo config until
// those get their own editor panels. This gives a real, working page
// today instead of waiting on a full config schema/editor to exist.
function mergeConfig(couple, content) {
  return {
    ...staticConfig,
    coupleId: couple.id,
    navTitle: `${couple.partner_a_name || staticConfig.navTitle} & ${couple.partner_b_name || ""}`.trim(),
    togetherSince: couple.anniversary_date || staticConfig.togetherSince,
    letter: {
      greeting: content.greeting || staticConfig.letter.greeting,
      paragraphs: content.paragraphs?.length ? content.paragraphs : staticConfig.letter.paragraphs,
      closing: content.closing || staticConfig.letter.closing,
      signature: content.signature || staticConfig.letter.signature,
    },
    timeline: content.timeline?.length ? content.timeline : staticConfig.timeline,
    reasons: content.reasons?.length ? content.reasons : staticConfig.reasons,
  };
}

export default function PublicCouplePage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, error: "", config: null });

  useEffect(() => {
    if (!supabase) {
      setState({ loading: false, error: "This page isn't connected to a backend yet.", config: null });
      return;
    }
    let cancelled = false;

    (async () => {
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;
      if (coupleError || !couple) {
        setState({ loading: false, error: "We couldn't find that page.", config: null });
        return;
      }

      const { data: content } = await supabase
        .from("couple_content")
        .select("*")
        .eq("couple_id", couple.id)
        .maybeSingle();

      if (cancelled) return;
      setState({ loading: false, error: "", config: mergeConfig(couple, content || {}) });
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading) {
    return <div className="min-h-dvh flex items-center justify-center text-zinc-500 text-sm">Loading...</div>;
  }

  if (state.error) {
    return <div className="min-h-dvh flex items-center justify-center text-zinc-500 text-sm">{state.error}</div>;
  }

  return (
    <CoupleConfigContext.Provider value={state.config}>
      <App />
    </CoupleConfigContext.Provider>
  );
}
