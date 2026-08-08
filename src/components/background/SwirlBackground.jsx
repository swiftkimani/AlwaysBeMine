import { useState, lazy, Suspense } from "react";

// Lazy-loaded since the Spline runtime is several MB — it starts
// downloading as soon as this component mounts (the app's very first
// paint), rather than blocking the initial bundle.
const Spline = lazy(() => import("@splinetool/react-spline"));
const SPLINE_SCENE = "https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode";

/* The animated 3D swirl scene. Fades in over a matching teal/purple
   gradient once loaded, and falls back to that same gradient
   permanently if the scene fails to load (offline, blocked request). */
export default function SwirlBackground() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-teal-100 via-cyan-50 to-purple-100 transition-opacity duration-1000 ${
          loaded && !errored ? "opacity-0" : "opacity-100"
        }`}
      />
      {!errored && (
        <Suspense fallback={null}>
          <Spline
            scene={SPLINE_SCENE}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        </Suspense>
      )}
    </>
  );
}
