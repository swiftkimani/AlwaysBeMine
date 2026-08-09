import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Preloader from "./Preloaders/preloader1.jsx";
import { RomanceFXProvider } from "./RomanceFX.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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
      <div className="app-mount w-full h-full">
        <RomanceFXProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* The original static demo, unchanged — still config.js-driven.
                    /c/:slug (couple-content-driven) lands here in a later pass. */}
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </RomanceFXProvider>
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
