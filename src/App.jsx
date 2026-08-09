import { useState, useCallback } from "react";
import useCoupleConfig from "./hooks/useCoupleConfig.js";
import { useRomance } from "./RomanceFX.jsx";
import { loveTracks } from "./data/tracks.js";

import useActiveMode from "./hooks/useActiveMode.js";
import useScrollProgress from "./hooks/useScrollProgress.js";
import useAchievements from "./hooks/useAchievements.js";
import useTapHearts from "./hooks/useTapHearts.js";
import useModeProgress from "./hooks/useModeProgress.js";
import useProposal from "./hooks/useProposal.js";
import useCoupleProgress from "./hooks/useCoupleProgress.js";

import Nav from "./components/layout/Nav.jsx";
import GreetingBadge from "./components/layout/GreetingBadge.jsx";
import UtilityRail from "./components/layout/UtilityRail.jsx";
import OnboardingOverlay from "./components/layout/OnboardingOverlay.jsx";
import AnimatedBackground from "./components/background/AnimatedBackground.jsx";
import AmbientHearts from "./components/effects/AmbientHearts.jsx";
import HeartTrail from "./components/effects/HeartTrail.jsx";
import ThinkingToast from "./components/effects/ThinkingToast.jsx";
import ConfettiBurst from "./components/effects/ConfettiBurst.jsx";
import TapHearts from "./components/effects/TapHearts.jsx";
import AchievementToast from "./components/achievements/AchievementToast.jsx";
import AchievementHistory from "./components/achievements/AchievementHistory.jsx";
import ProposalScene from "./components/proposal/ProposalScene.jsx";
import ModeContent from "./components/ModeContent.jsx";
import FloatingMusicControl from "./components/FloatingMusicControl.jsx";

export default function App() {
  const config = useCoupleConfig();
  const { activeMode, setActiveMode, visitedModes } = useActiveMode();
  const { scrollProgress, showBackToTop } = useScrollProgress(activeMode);
  const { progress, save: saveProgress } = useCoupleProgress(config.coupleId);
  const onAchievementsChange = useCallback((list) => saveProgress({ achievements: list }), [saveProgress]);
  const { achievements, pendingAchievement, unlockAchievement, dismissPending } = useAchievements({
    initialAchievements: progress?.achievements,
    onAchievementsChange,
  });
  const { handleModeProgress } = useModeProgress();
  const tapHearts = useTapHearts();
  const { burst } = useRomance();

  const [showConfetti, setShowConfetti] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [showAchievementHistory, setShowAchievementHistory] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("abm_onboarded"));

  const celebrate = useCallback(() => setShowConfetti(true), []);
  const onNoCountChange = useCallback((n) => saveProgress({ no_count: n }), [saveProgress]);
  const proposal = useProposal(activeMode, {
    unlockAchievement,
    onCelebrate: celebrate,
    initialNoCount: progress?.no_count,
    onNoCountChange,
  });

  const onLetterRevealChange = useCallback(
    (n) => saveProgress({ letter_revealed_paragraphs: n }),
    [saveProgress]
  );
  const onLetterSeal = useCallback(() => saveProgress({ letter_sealed: true }), [saveProgress]);
  const letterProgress = {
    initialRevealed: progress?.letter_revealed_paragraphs,
    initialSealed: progress?.letter_sealed,
    onRevealChange: onLetterRevealChange,
    onSeal: onLetterSeal,
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("abm_onboarded", "1");
  };

  // Fire a RomanceFX emoji burst near the center of the screen
  const triggerLovePopup = useCallback((emoji) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 100;
    const x = window.innerWidth / 2 + Math.cos(angle) * dist;
    const y = window.innerHeight / 2 + Math.sin(angle) * dist;
    burst(emoji, x, y);
  }, [burst]);

  const triggerRipple = useCallback(() => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  }, []);

  return (
    <div className="page-shell transition-opacity duration-700" style={{ opacity: proposal.isTransitioning ? 0 : 1 }}>
      {/* Ripple page transition overlay */}
      {ripple && <div className="page-ripple-overlay" aria-hidden="true" />}

      {/* Floating Greeting Badge — always top-right */}
      <GreetingBadge />

      {/* Ambient Floating Hearts */}
      <AmbientHearts />

      {/* Heart Cursor Trail + Thinking of You Toasts — only on proposal */}
      {activeMode === "proposal" && <HeartTrail />}
      {activeMode === "proposal" && <ThinkingToast />}

      {/* The app's one permanent background (see components/background/) */}
      <AnimatedBackground />

      {/* Scroll Progress Bar */}
      {activeMode !== "proposal" && (
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} role="progressbar" aria-valuenow={Math.round(scrollProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Scroll progress" />
      )}

      {/* Confetti on Yes */}
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Double-tap Hearts */}
      <TapHearts hearts={tapHearts} />

      {/* Soft scrim so scrolling content fades behind the fixed left rail / music FAB
          instead of clipping abruptly under them */}
      <div className="side-nav-scrim" aria-hidden="true" />
      <div className="fab-scrim" aria-hidden="true" />

      <Nav activeMode={activeMode} setActiveMode={setActiveMode} visitedModes={visitedModes} onNavClick={triggerRipple} />

      <main className="page-scroll w-full">
        <div className={`page-content ${config.selectionColor}`}>
          {activeMode === "proposal" ? (
            <div className="proposal-stage">
              <ProposalScene proposal={proposal} onLovePopup={triggerLovePopup} />
            </div>
          ) : (
            <div className="mode-stage mode-enter" key={activeMode}>
              <div className="mode-header flex flex-col items-center justify-center relative mb-5">
                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 font-script text-gradient-love">
                    {config.navTitle}
                  </h1>
                  {config.title && (
                    <p className="text-xs sm:text-sm text-rose-400/90 font-script">
                      {config.title}
                    </p>
                  )}
                  <div className="mode-ornament" aria-hidden="true">💞</div>
                </div>
              </div>
              <div className="mode-body">
                <ModeContent mode={activeMode} onProgress={handleModeProgress} letterProgress={letterProgress} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Music card panel — FAB lives in UtilityRail */}
      <FloatingMusicControl
        tracks={loveTracks}
        fallbackUrl={config.playlist?.languages?.[0]?.spotifyUrl}
        isOpen={musicOpen}
        onToggle={() => setMusicOpen(p => !p)}
        onPlayingChange={setMusicIsPlaying}
      />

      <UtilityRail
        achievementsCount={achievements.length}
        historyOpen={showAchievementHistory}
        onToggleHistory={() => setShowAchievementHistory((p) => !p)}
        showBackToTop={showBackToTop}
        musicOpen={musicOpen}
        onToggleMusic={() => setMusicOpen(p => !p)}
        musicIsPlaying={musicIsPlaying}
      />

      {/* Achievement Toast */}
      {pendingAchievement && (
        <AchievementToast achievement={pendingAchievement} onDone={dismissPending} />
      )}

      {/* Achievement History Panel */}
      {showAchievementHistory && (
        <AchievementHistory achievements={achievements} onClose={() => setShowAchievementHistory(false)} />
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
    </div>
  );
}
