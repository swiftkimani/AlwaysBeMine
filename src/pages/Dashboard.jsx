import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../hooks/useAuth.js";

// Ensures the signed-in user has a couples row (+ empty content/progress
// rows to match), creating them on first visit from the partner names/slug
// stashed in user_metadata at signup. Retries the slug once with a random
// suffix if it's already taken.
async function ensureCoupleForUser(user) {
  const { data: existing } = await supabase
    .from("couples")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (existing) return existing;

  const meta = user.user_metadata || {};
  const baseSlug = meta.slug || user.id.slice(0, 8);

  for (const slug of [baseSlug, `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`]) {
    const { data: created, error } = await supabase
      .from("couples")
      .insert({
        owner_id: user.id,
        slug,
        partner_a_name: meta.partner_a_name || "",
        partner_b_name: meta.partner_b_name || "",
      })
      .select()
      .single();
    if (created) {
      await Promise.all([
        supabase.from("couple_content").insert({ couple_id: created.id }),
        supabase.from("couple_progress").insert({ couple_id: created.id }),
      ]);
      return created;
    }
    if (error?.code !== "23505") throw error; // anything but "slug taken" is unexpected
  }
  throw new Error("Could not create your page — that link name is taken. Contact support.");
}

export default function Dashboard() {
  const { session } = useAuth();
  const [couple, setCouple] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    ensureCoupleForUser(session.user)
      .then((c) => !cancelled && setCouple(c))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [session.user]);

  const handleSignOut = () => supabase.auth.signOut();

  const publicUrl = couple ? `${window.location.origin}/c/${couple.slug}` : "";

  return (
    <div className="min-h-dvh px-4 py-10 flex justify-center">
      <div className="liquid card-pad-md w-full max-w-lg rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-800">Dashboard</h1>
          <button onClick={handleSignOut} className="text-sm text-zinc-600 hover:text-love">
            Sign out
          </button>
        </div>

        {error && <p className="text-sm text-love">{error}</p>}

        {!couple && !error && <p className="text-sm text-zinc-600">Setting up your page...</p>}

        {couple && (
          <>
            <p className="text-sm text-zinc-600">
              {couple.partner_a_name || "You"} &amp; {couple.partner_b_name || "Partner"}
            </p>
            <div className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 break-all">
              {publicUrl}
            </div>
            <p className="text-sm text-zinc-500">
              Content editing (letter, timeline, photos) is coming next — for now this confirms your
              account and page are set up.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
