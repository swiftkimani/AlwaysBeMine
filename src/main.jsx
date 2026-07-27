import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Preloader from "./Preloaders/preloader1.jsx";
import config from "./config.js";
import "./index.css";

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 600);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="animate-fade-in w-full h-full">
        <App />
      </div>
      {loading && (
        <div
          className={`fixed inset-0 z-[9999] bg-black pointer-events-none transition-opacity duration-700 ease-in-out ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <Preloader />
        </div>
      )}
    </>
  );
}

document.title = config.title;

createRoot(document.getElementById("root")).render(<Root />);
