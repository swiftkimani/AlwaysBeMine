// Renders the short-lived hearts spawned by useTapHearts (double-tap).
export default function TapHearts({ hearts }) {
  return hearts.map((h) => (
    <span key={h.id} className="tap-heart" style={{ left: h.x - 16, top: h.y - 16 }} aria-hidden="true">❤️</span>
  ));
}
