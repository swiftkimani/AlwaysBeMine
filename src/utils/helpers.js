// Initial mode comes from the URL hash when it names a valid mode,
// otherwise the first configured mode. Takes `modes` as a parameter
// (rather than importing config directly) since it now needs to work for
// both the static demo and a couple's Supabase-driven config.
export function getInitialMode(modes) {
  const hash = window.location.hash.replace("#", "");
  if (hash && modes.includes(hash)) return hash;
  return modes[0];
}

export function daysBetween(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

export function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: "Still up, my love?", emoji: "🌙" };
  if (h < 12) return { text: "Good morning, beautiful", emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon, my love", emoji: "🌤️" };
  if (h < 21) return { text: "Good evening, gorgeous", emoji: "🌅" };
  return { text: "Thinking of you tonight", emoji: "🌙" };
}
