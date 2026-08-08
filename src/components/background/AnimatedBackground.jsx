import SwirlBackground from "./SwirlBackground.jsx";

/* The app's one permanent background: the animated Dream Swirl 3D
   scene, softly tinted rose so its teal/purple palette reads as part
   of this app rather than a generic 3D demo (see .animated-bg-tint). */
export default function AnimatedBackground() {
  return (
    <div className="animated-bg-layer" aria-hidden="true">
      <SwirlBackground />
      <div className="animated-bg-tint" />
    </div>
  );
}
