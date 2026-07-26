# Always Be Mine

A romantic, interactive love story website with 8 modes, liquid morphism UI, gamification, and draggable music control. Configurable for Valentine's Day, birthdays, anniversaries, or confessions.

## Live Demo

> **Inspired by Swift** — [github.com/swiftkimani/AlwaysBeMine](https://github.com/swiftkimani/AlwaysBeMine)

## Features

### 8 Interactive Modes
| Mode | Description |
|------|-------------|
| **Proposal** | Will you be my Valentine? with animated Yes/No buttons, mouse-stealing easter egg, confetti burst on Yes |
| **Timeline** | Scrollable love story timeline with scroll-reveal cards and XP badges |
| **Letter** | Typewriter-effect love letter that reveals paragraph by paragraph |
| **Quiz** | Love quiz with keyboard nav (1-4 / A-D / Enter), streak counter, score results |
| **Jar** | Reasons I love you jar — tap to reveal with shake animation |
| **Gallery** | Photo gallery with lightbox and caption overlays |
| **Promises** | Flip-card promise builder — tap to reveal each promise |
| **Playlist** | Embedded music playlist with now-playing display |

### Liquid Morphism Design
- Tinted translucent cards with `blur(24px) saturate(200%)`
- Animated shimmer sweep on hover
- Inner light reflections with inset shadows
- Applied to nav, cards, floating controls, modals, and toast notifications

### Gamification
- XP badges per mode (+10 to +25 XP per interaction)
- Achievement system with unlock toasts and history panel
- Progress bars tracking completion across all modes
- Streak counters for quiz combos
- Visited mode tracking with nav completion dots

### Romantic Features
- **Ambient floating hearts** — 8 emoji hearts drifting across the background
- **Heart cursor trail** — mouse leaves a trail of floating hearts (desktop)
- **Double-tap hearts** — double-click anywhere spawns a floating heart
- **Send Love bar** — tap Kiss, Hug, Heartbeat, Rose, or Magic to burst emojis with counters
- **Confetti burst** — 30-particle celebration when she says Yes
- **Live countdown** — ticking days:hours:min:sec since your date
- **Days counter** — "X days of love" badge on proposal page
- **Time-aware greeting** — "Good morning beautiful" / "Thinking of you tonight"
- **Thinking of You toasts** — 14 romantic messages appear periodically

### Music Control
- Draggable glass-morphism floating button (defaults to bottom-left)
- Smart panel opens directly above/below the button with connector arrow
- Play/pause, skip, mute, seek, like per track
- Track list with now-playing indicator

### Design & UX
- Spline 3D background with gradient fallback
- Hash-based routing for shareable deep links (`#timeline`, `#quiz`, etc.)
- Scroll progress bar and back-to-top button
- Onboarding overlay for first-time visitors
- Safe area insets for iOS/notch devices
- `prefers-reduced-motion` support
- Focus-visible indicators and ARIA labels on all interactive elements
- Minimum 44px touch targets for mobile comfort
- Responsive across all breakpoints (mobile-first)

## Getting Started

```bash
# Clone
git clone git@github.com:swiftkimani/AlwaysBeMine.git
cd AlwaysBeMine

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

## Configuration

All content is driven by `src/config.js`. Change the `theme` field to switch between:

```js
const theme = "valentine"; // "valentine" | "birthday" | "anniversary" | "confession"
```

### Key fields to personalize

```js
valentine: {
  togetherSince: "2024-01-01",   // Your date — powers the live countdown + days counter
  heading: "Will you be my Valentine?",
  heroName: "My Love",
  // ... timeline dates, letter paragraphs, quiz questions, reasons, promises
}
```

Each theme defines data for all 8 modes — timeline entries, letter text, quiz questions, reasons in the jar, promises, and playlist tracks.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + custom CSS |
| 3D Background | Spline |
| Alerts | SweetAlert2 |
| Icons | react-icons |
| Audio | Native HTML5 Audio |
| Routing | Hash-based (no router) |
| Linting | ESLint 9 (flat config) |

## Project Structure

```
src/
├── App.jsx                 # Main app, routing, proposal mode, overlays
├── config.js               # All themes + data for 8 modes
├── index.css               # Liquid morphism, animations, layout system
├── MarqueeProposal.jsx     # Scrolling text marquee for Yes screen
├── MouseStealer.jsx        # Cursor-stealing easter egg
└── components/
    ├── FloatingMusicControl.jsx   # Draggable music player
    ├── Timeline.jsx               # Love story timeline
    ├── LoveLetter.jsx             # Typewriter letter
    ├── QuizGame.jsx               # Love quiz with keyboard nav
    ├── ReasonsJar.jsx             # Tap-to-reveal reasons jar
    ├── PhotoGallery.jsx           # Photo gallery with lightbox
    ├── PromiseBuilder.jsx         # Flip-card promises
    └── Playlist.jsx               # Music playlist
```

## License

Feel free to use this project to express your love. Inspired by Swift.
