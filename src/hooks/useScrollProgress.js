import { useState, useEffect } from "react";

// Scroll progress percentage + back-to-top visibility.
// Note: .page-scroll has no bounded height/overflow-y of its own, so the
// document (window) is what actually scrolls — not the <main> element.
export default function useScrollProgress(activeMode) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const pct = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
      setScrollProgress(Math.min(100, pct));
      setShowBackToTop(scrollTop > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMode]);

  return { scrollProgress, showBackToTop };
}
