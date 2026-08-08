import { useState, useEffect } from "react";

// Live days/hrs/min/sec counter since a given date — mounted in the
// proposal hero (see ProposalScene.jsx) as the "loving you for" ticker.
export default function LiveCountdown({ since }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!since) return null;
  const start = new Date(since).getTime();
  if (isNaN(start)) return null;

  const diff = Math.max(0, Date.now() - start);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  void tick;

  return (
    <div className="live-countdown">
      <div className="countdown-unit">
        <span className="countdown-num">{days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(hours).padStart(2, "0")}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(mins).padStart(2, "0")}</span>
        <span className="countdown-label">Min</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{String(secs).padStart(2, "0")}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
}
