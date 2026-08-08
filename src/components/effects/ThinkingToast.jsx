import { useState, useEffect } from "react";
import { loveMessages } from "../../data/loveMessages.js";

// Periodic "thinking of you" toast: first after 15s, then every 45s.
export default function ThinkingToast() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const show = () => {
      setMsg(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
      setVisible(true);
      setExiting(false);
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
      }, 4000);
    };
    const first = setTimeout(show, 15000);
    const interval = setInterval(show, 45000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[80] ${exiting ? "thinking-toast-exit" : "thinking-toast"}`}
    >
      <div className="liquid px-5 py-3 flex items-center gap-3 shadow-xl border border-rose-200/40 rounded-2xl">
        <span className="text-xl">💌</span>
        <p className="text-xs font-semibold text-zinc-700 font-script">{msg}</p>
      </div>
    </div>
  );
}
