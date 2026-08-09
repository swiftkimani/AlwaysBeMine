// Emoji + label for each app mode; the emoji doubles as the nav icon.
// Labels double as the nav tooltip text, so they carry the romantic
// voice of the app rather than reading like generic section names.
export const modeLabels = {
  proposal: "💌 The Question",
  timeline: "📅 Our Story",
  letter: "✉️ Love Letter",
  quiz: "❓ Love Quiz",
  jar: "💝 Why I Love You",
  gallery: "📸 Our Memories",
  promises: "🤝 My Promises",
  playlist: "🎵 Our Playlist",
};

// One soft pastel "sticker" color family per mode, so the nav rail reads
// as a colorful sticker sheet instead of a stack of identical white
// squares. bgA/bgB tint the resting state; activeA/activeB is the
// richer gradient the selected mode's sticker switches to. All values
// are design tokens from styles/globals.css.
export const NAV_ACCENTS = {
  proposal: {
    bgA: "var(--color-blush-2)",
    bgB: "var(--color-love-blush)",
    activeA: "var(--color-love-bright)",
    activeB: "var(--color-love-deep)",
  },
  timeline: {
    bgA: "var(--color-peach-light)",
    bgB: "var(--color-gold)",
    activeA: "var(--color-gold)",
    activeB: "var(--color-amber)",
  },
  letter: {
    bgA: "var(--color-violet-light)",
    bgB: "var(--color-violet-soft)",
    activeA: "var(--color-purple-soft)",
    activeB: "var(--color-purple)",
  },
  quiz: {
    bgA: "var(--color-sky-light)",
    bgB: "var(--color-sky-soft)",
    activeA: "var(--color-sky-soft)",
    activeB: "var(--color-sky)",
  },
  jar: {
    bgA: "var(--color-pink-light)",
    bgB: "var(--color-pink-soft)",
    activeA: "var(--color-pink)",
    activeB: "var(--color-gold)",
  },
  gallery: {
    bgA: "var(--color-fuchsia-light)",
    bgB: "var(--color-purple-soft)",
    activeA: "var(--color-pink)",
    activeB: "var(--color-purple)",
  },
  promises: {
    bgA: "var(--color-mint-light)",
    bgB: "var(--color-teal-soft)",
    activeA: "var(--color-teal-soft)",
    activeB: "var(--color-emerald)",
  },
  playlist: {
    bgA: "var(--color-violet-light)",
    bgB: "var(--color-pink-soft)",
    activeA: "var(--color-purple)",
    activeB: "var(--color-pink)",
  },
};
