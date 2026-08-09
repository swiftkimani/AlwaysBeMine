import config from "../../config.js";
import { daysBetween, getTimeGreeting } from "../../utils/helpers.js";

function TimeGreeting() {
  const g = getTimeGreeting();
  return (
    <div className="time-greeting">
      <span>{g.emoji}</span>
      <span>{g.text}</span>
    </div>
  );
}

// Floating top-right badge: time-of-day greeting + days-together counter.
export default function GreetingBadge() {
  const days = daysBetween(config.togetherSince);
  return (
    <div className="greeting-badge">
      <TimeGreeting />
      {days !== null && (
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-px bg-rose-300" />
          <span className="text-rose-600 font-black text-xs">{days}</span>
          <span className="text-zinc-600 font-semibold text-3xs">Days 💕</span>
        </div>
      )}
    </div>
  );
}
