import { createContext, useCallback, useContext, useState } from "react";

const RomanceFXContext = createContext(null);

let popupSeq = 0;

export function RomanceFXProvider({ children }) {
  const [popups, setPopups] = useState([]);

  const burst = useCallback((emoji, x, y) => {
    const id = `fx-${popupSeq++}`;
    const px = x ?? window.innerWidth / 2;
    const py = y ?? window.innerHeight / 2;
    setPopups((prev) => [...prev.slice(-8), { id, emoji, x: px, y: py }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 2200);
  }, []);

  const burstFromEvent = useCallback((e, emoji = "💕") => {
    // Keyboard-triggered events report clientX/Y as 0 — fall back to the
    // target element's center so the burst still lands somewhere sensible.
    let x = e?.clientX;
    let y = e?.clientY;
    if (!x && !y && e?.currentTarget?.getBoundingClientRect) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    burst(emoji, x ?? window.innerWidth / 2, y ?? window.innerHeight / 2);
  }, [burst]);

  return (
    <RomanceFXContext.Provider value={{ burst, burstFromEvent }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[160]" aria-hidden="true">
        {popups.map((p) => (
          <span key={p.id} className="love-popup" style={{ left: p.x - 32, top: p.y - 32 }}>
            {p.emoji}
          </span>
        ))}
      </div>
    </RomanceFXContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRomance() {
  const ctx = useContext(RomanceFXContext);
  if (!ctx) {
    // Safe no-op fallback so components never crash if used outside the provider.
    return { burst: () => {}, burstFromEvent: () => {} };
  }
  return ctx;
}
