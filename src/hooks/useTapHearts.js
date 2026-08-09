import { useState, useEffect } from "react";

// Double-tap / double-click anywhere spawns a short-lived heart at the
// pointer. Returns the list of live hearts to render.
export default function useTapHearts() {
  const [tapHearts, setTapHearts] = useState([]);

  useEffect(() => {
    let lastTap = 0;
    const handleTap = (e) => {
      const now = Date.now();
      if (now - lastTap < 350) {
        const id = `${now}-${Math.random()}`;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        setTapHearts((prev) => [...prev.slice(-8), { id, x, y }]);
        setTimeout(() => setTapHearts((prev) => prev.filter((h) => h.id !== id)), 1100);
      }
      lastTap = now;
    };
    window.addEventListener("dblclick", handleTap);
    return () => window.removeEventListener("dblclick", handleTap);
  }, []);

  return tapHearts;
}
