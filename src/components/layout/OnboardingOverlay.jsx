import useCoupleConfig from "../../hooks/useCoupleConfig.js";
import { modeLabels } from "../../data/modes.js";

// First-visit welcome tour; parent decides visibility and persists dismissal.
export default function OnboardingOverlay({ onDismiss }) {
  const config = useCoupleConfig();
  return (
    <div className="onboarding-overlay" onClick={onDismiss} role="dialog" aria-label="Welcome tour">
      <div className="onboarding-card" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4">
          <span className="text-4xl mb-2 block">💌</span>
          <h2 className="text-xl font-bold text-zinc-900 mb-1 font-script">
            Welcome to {config.title?.replace(/[❤️🎂💑💝🎉]/g, "").trim() || "Always Be Mine"}
          </h2>
          <p className="text-xs text-zinc-500">Explore our story through different modes</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {config.modes.map((mode) => (
            <div key={mode} className="flex items-center gap-2 p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-rose-100/90 shadow-sm">
              <span className="text-base">{modeLabels[mode]?.split(" ")[0]}</span>
              <span className="text-2xs font-bold text-zinc-600">{modeLabels[mode]?.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onDismiss}
          className="w-full btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-sm"
        >
          Start Exploring 💕
        </button>
      </div>
    </div>
  );
}
