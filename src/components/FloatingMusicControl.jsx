import { useState, useEffect, useRef } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipForwardFill,
  BsSkipBackwardFill,
  BsHeartFill,
  BsHeart,
  BsSpotify,
  BsChevronUp,
  BsX,
  BsVolumeUpFill,
  BsVolumeMuteFill,
} from "react-icons/bs";
import { useSpotifyEmbed } from "../useSpotifyEmbed.js";

/* ─── Reusable icon button ─── */
const IconBtn = ({ onClick, children, active, color = "#f43f5e", title, style = {} }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 32, height: 32, borderRadius: "50%", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all 0.15s",
      background: active ? `${color}18` : "transparent",
      color: active ? color : "#b0b0bc",
      ...style,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = active ? `${color}28` : "#f4f4f6"; e.currentTarget.style.color = active ? color : "#52525b"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = active ? `${color}18` : "transparent"; e.currentTarget.style.color = active ? color : "#b0b0bc"; }}
  >
    {children}
  </button>
);

/* ─── Reusable pill button ─── */
/* active = color change only — no fill — keeps Love & Queue visually balanced */
const PillBtn = ({ onClick, children, active, "aria-label": ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 10px", borderRadius: 20, border: "none",
      background: "transparent",
      color: active ? "#f43f5e" : "#b0b0bc",
      fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
      textTransform: "uppercase", cursor: "pointer", transition: "color 0.15s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#f43f5e"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = active ? "#f43f5e" : "#b0b0bc"; }}
  >
    {children}
  </button>
);

export default function FloatingMusicControl({ tracks, fallbackUrl, isOpen, onToggle, onPlayingChange }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [liked, setLiked] = useState(new Set());
  const [isMuted, setIsMuted] = useState(false);

  const panelRef = useRef(null);
  const track = tracks?.[currentIdx];
  const embed = useSpotifyEmbed(tracks?.[0]?.spotifyUri);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    if (!track?.spotifyUri) return;
    embed.loadTrack(track.spotifyUri);
    if (!isMuted) embed.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  const autoPlayedRef = useRef(false);
  useEffect(() => {
    if (autoPlayedRef.current || !embed.ready) return;
    const go = () => {
      if (autoPlayedRef.current) return;
      autoPlayedRef.current = true;
      if (!isMuted) embed.play();
      document.removeEventListener("click", go);
      document.removeEventListener("touchstart", go);
    };
    document.addEventListener("click", go);
    document.addEventListener("touchstart", go);
    return () => { document.removeEventListener("click", go); document.removeEventListener("touchstart", go); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed.ready]);

  useEffect(() => {
    onPlayingChange?.(embed.isPlaying);
    if (embed.isPlaying && !isOpen) onToggle?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed.isPlaying]);
  useEffect(() => {
    document.body.classList.toggle("music-playing", embed.isPlaying);
    return () => document.body.classList.remove("music-playing");
  }, [embed.isPlaying]);

  const lastPosRef = useRef(0);
  useEffect(() => {
    const nearEnd = embed.duration > 0 && embed.position >= embed.duration - 0.4;
    const wasAdvancing = lastPosRef.current < embed.duration - 0.4;
    if (nearEnd && !embed.isPlaying && wasAdvancing && tracks?.length)
      setCurrentIdx((p) => (p + 1) % tracks.length);
    lastPosRef.current = embed.position;
  }, [embed.position, embed.duration, embed.isPlaying, tracks?.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onToggle?.(); };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [isOpen, onToggle]);

  const skipNext = () => setCurrentIdx((p) => (p + 1) % tracks.length);
  const skipPrev = () => {
    if (embed.position > 3) embed.seek(0);
    else setCurrentIdx((p) => (p - 1 + tracks.length) % tracks.length);
  };
  const seek = (e) => embed.seek((Number(e.target.value) / 100) * (embed.duration || 0));
  const toggleMute = (e) => {
    e.stopPropagation();
    if (embed.isPlaying) { embed.pause(); setIsMuted(true); }
    else { embed.play(); setIsMuted(false); }
  };
  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => { const n = new Set(p); n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx); return n; });
  };
  const fmt = (s) => (!s || isNaN(s)) ? "0:00" : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  if (!track) return null;
  const progress = embed.duration ? (embed.position / embed.duration) * 100 : 0;
  const isLiked = liked.has(currentIdx);
  const isActive = embed.isPlaying && !isMuted;

  /* 
    Card anchors to bottom-right, positioned so it sits above the
    UtilityRail column (bottom-6 = 24px, button is 44px, gap-3 = 12px).
    We offset bottom by 24 + 44 + 12 = 80px so the tip points at the music FAB.
    Right aligns to the same 16px/20px the rail uses.
    Tip center = FAB center: rail button w-11 = 44px, center = 22px from right edge
    of the rail (right-4 = 16px) => 16 + 22 = 38px from viewport right.
    Tip is 12px wide, so tip right = 38 - 6 = 32px from card right edge... 
    but since card has right: 16px, tip offset = 38 - 16 - 6 = 16px.
  */
  const RAIL_RIGHT = 16;           /* right-4 = 16px */
  const FAB_W     = 44;            /* w-11 = 44px */
  const FAB_CENTER_FROM_VIEWPORT = RAIL_RIGHT + FAB_W / 2; /* 38px */
  const CARD_RIGHT = RAIL_RIGHT;   /* card right edge aligns with rail */
  const TIP_W     = 12;
  const TIP_RIGHT = FAB_CENTER_FROM_VIEWPORT - CARD_RIGHT - TIP_W / 2; /* 16px */
  const CARD_BOTTOM = 24 + FAB_W + 12; /* 80px: 24px rail bottom + 44px FAB + 12px gap */

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed", zIndex: 60,
        bottom: CARD_BOTTOM,
        right: CARD_RIGHT,
        display: "flex", flexDirection: "column", alignItems: "flex-end",
      }}
    >
      {/* Hidden embed */}
      <div ref={embed.containerRef} aria-hidden="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }} />

      {/* ══════════════════════════════
          PLAYER CARD + TIP (relative wrapper)
      ══════════════════════════════ */}
      {isOpen && (
        <div
          className="fmc-enter"
          style={{
            position: "relative",
            transformOrigin: "bottom right",
            maxHeight: `calc(100dvh - ${CARD_BOTTOM + 20}px)`,
            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* ── Card ── */}
          <div style={{
            width: 290,
            maxWidth: "calc(100vw - 2rem)",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 20px 56px rgba(100,0,40,0.24), 0 4px 16px rgba(244,63,94,0.14)",
            /* Fix #7 — card itself is also flex-column so white body can scroll */
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}>

            {/* Dark header */}
            <div style={{
              padding: "16px 16px 18px",
              background: "linear-gradient(150deg, #430019 0%, #2d0550 60%, #190230 100%)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                {/* Vinyl */}
                <div className={isActive ? "fmc-spin" : ""} style={{
                  position: "relative", width: 56, height: 56,
                  borderRadius: "50%", flexShrink: 0,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 4px 16px rgba(244,63,94,0.4)",
                }}>
                  {[0, 5, 10, 15, 20].map(i => (
                    <div key={i} style={{
                      position: "absolute", inset: i, borderRadius: "50%",
                      background: i === 0 ? "#0f0f10" : "transparent",
                      border: `1px solid rgba(255,255,255,${Math.max(0.03, 0.14 - i * 0.025)})`,
                    }} />
                  ))}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "linear-gradient(135deg, #fb7185, #e11d48)",
                      boxShadow: "0 2px 10px rgba(244,63,94,0.7)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7,
                    }}>💗</div>
                  </div>
                </div>

                {/* Track info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: "#fff", fontWeight: 800, fontSize: 13,
                    lineHeight: 1.2, margin: "0 0 3px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    letterSpacing: "-0.3px",
                  }}>{track.title}</p>
                  <p style={{
                    color: "#fda4af", fontWeight: 600, fontSize: 11,
                    margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{track.artist}</p>
                  {isActive && (
                    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", marginTop: 7, height: 9 }}>
                      {[0, 70, 140, 210, 280].map(d => (
                        <span key={d} style={{
                          width: 3, height: "100%", borderRadius: 2,
                          background: "rgba(251,113,133,0.7)",
                          animation: `fmcEq 0.65s ease-in-out ${d}ms infinite alternate`,
                        }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
                  style={{
                    width: 26, height: 26, borderRadius: "50%", border: "none",
                    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", flexShrink: 0, alignSelf: "flex-start",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                  aria-label="Close"
                ><BsX size={16} /></button>
              </div>
            </div>

            {/* Fix #2 — 2px hairline seam instead of thick stripe */}
            <div style={{
              height: 2,
              background: "linear-gradient(to bottom, rgba(80,10,100,0.35), rgba(248,248,252,0))",
              pointerEvents: "none",
            }} />

            {/* White controls body — Fix #6 give seek bar breathing room with more top padding */}
            <div style={{ background: "#f8f8fc", padding: "18px 16px 16px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <input
                  type="range" min="0" max="100" value={progress} onChange={seek}
                  className="fmc-seek"
                  style={{
                    width: "100%", height: 3, borderRadius: 3,
                    appearance: "none", cursor: "pointer", display: "block", outline: "none",
                    background: `linear-gradient(to right, #f43f5e ${progress}%, #e8d8ef ${progress}%)`,
                  }}
                />
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 10, fontWeight: 700, color: "#c4b8d0",
                  marginTop: 5, padding: "0 1px",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  <span>{fmt(embed.position)}</span>
                  <span>{fmt(embed.duration)}</span>
                </div>
              </div>

              {/* Controls row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                {/* Fix #3 — Skip back: transparent bg so it doesn't compete with play button */}
                <button
                  onClick={skipPrev}
                  aria-label="Previous"
                  style={{
                    width: 40, height: 40, borderRadius: "50%", border: "none",
                    background: "transparent", color: "#c4b0cc",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.08)"; e.currentTarget.style.color = "#f43f5e"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4b0cc"; }}
                ><BsSkipBackwardFill size={18} /></button>

                {/* Play/pause */}
                <button
                  onClick={() => embed.togglePlay()}
                  disabled={!embed.ready}
                  aria-label={embed.isPlaying ? "Pause" : "Play"}
                  style={{
                    width: 60, height: 60, borderRadius: "50%", border: "none",
                    background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
                    color: "#fff", cursor: embed.ready ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    /* Crisp, contained shadow — not a blob */
                    boxShadow: "0 4px 16px rgba(244,63,94,0.5), 0 1px 4px rgba(244,63,94,0.3)",
                    transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                    opacity: embed.ready ? 1 : 0.45,
                  }}
                  onMouseEnter={(e) => { if (embed.ready) { e.currentTarget.style.transform = "scale(1.07)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(244,63,94,0.55), 0 2px 6px rgba(244,63,94,0.3)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(244,63,94,0.5), 0 1px 4px rgba(244,63,94,0.3)"; }}
                  onMouseDown={(e) => { if (embed.ready) e.currentTarget.style.transform = "scale(0.94)"; }}
                  onMouseUp={(e) => { if (embed.ready) e.currentTarget.style.transform = "scale(1.07)"; }}
                >
                  {embed.isPlaying
                    ? <BsPauseFill size={25} />
                    : <BsPlayFill size={27} style={{ marginLeft: 2 }} />}
                </button>

                {/* Fix #3 — Skip forward: transparent bg to match skip back */}
                <button
                  onClick={skipNext}
                  aria-label="Next"
                  style={{
                    width: 40, height: 40, borderRadius: "50%", border: "none",
                    background: "transparent", color: "#c4b0cc",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.08)"; e.currentTarget.style.color = "#f43f5e"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4b0cc"; }}
                ><BsSkipForwardFill size={18} /></button>
              </div>

              {/* Action row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PillBtn onClick={(e) => { e.stopPropagation(); toggleLike(e); }} active={isLiked}>
                    {isLiked ? <BsHeartFill size={10} /> : <BsHeart size={10} />}
                    Love
                  </PillBtn>
                  <IconBtn onClick={toggleMute} active={isMuted} title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <BsVolumeMuteFill size={12} /> : <BsVolumeUpFill size={12} />}
                  </IconBtn>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PillBtn onClick={(e) => { e.stopPropagation(); setShowPlaylist(p => !p); }} active={showPlaylist} aria-label="Toggle queue">
                    <BsChevronUp size={9} style={{ transition: "transform 0.3s", transform: showPlaylist ? "none" : "rotate(180deg)" }} />
                    Queue
                  </PillBtn>
                  <a
                    href={fallbackUrl} target="_blank" rel="noopener noreferrer"
                    style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1DB954", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(29,185,84,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    aria-label="Open on Spotify"
                  ><BsSpotify size={14} /></a>
                </div>
              </div>

              {/* Fix #1 & #7 — Queue accordion: flex-grow so it fills remaining space, scrolls internally */}
              <div style={{
                overflow: "hidden",
                flex: showPlaylist ? "1 1 auto" : "0 0 0px",
                maxHeight: showPlaylist ? "160px" : "0px",
                opacity: showPlaylist ? 1 : 0,
                marginTop: showPlaylist ? 12 : 0,
                transition: "max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease, margin-top 0.22s ease",
                minHeight: 0,
              }}>
                <div style={{
                  borderTop: "1px solid rgba(244,63,94,0.08)",
                  paddingTop: 6,
                  paddingBottom: 6,
                  height: "100%",
                  overflowY: "auto",
                }}>
                  {tracks.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 8px", borderRadius: 11, border: "none",
                        cursor: "pointer", textAlign: "left",
                        background: idx === currentIdx ? "linear-gradient(90deg,rgba(244,63,94,0.07),rgba(236,72,153,0.05))" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (idx !== currentIdx) e.currentTarget.style.background = "rgba(244,63,94,0.04)"; }}
                      onMouseLeave={(e) => { if (idx !== currentIdx) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {idx === currentIdx && isActive ? (
                          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
                            {[0, 120, 240].map(d => (
                              <span key={d} style={{ width: 3, height: "100%", borderRadius: 2, background: "#f43f5e", animation: `fmcEq 0.55s ease-in-out ${d}ms infinite alternate` }} />
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: 10, fontWeight: 700, color: idx === currentIdx ? "#f43f5e" : "#d4d4d8" }}>{idx + 1}</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: idx === currentIdx ? "#f43f5e" : "#3f3f46" }}>{t.title}</p>
                        <p style={{ margin: "1px 0 0", fontSize: 10, color: "#b0aab8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4 }}>{t.artist}</p>
                      </div>
                      {idx === currentIdx && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e", flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              </div>

            </div>{/* end white body */}
          </div>{/* end card */}

          {/* Fix #4 — Tip shrunk to 12px, crisp and proportional */}
          <div style={{
            position: "absolute",
            bottom: -6,
            right: TIP_RIGHT + 3,
            width: 12, height: 12,
            transform: "rotate(45deg)",
            background: "#f8f8fc",
            borderRight: "1px solid rgba(220,170,200,0.4)",
            borderBottom: "1px solid rgba(220,170,200,0.4)",
            borderRadius: "0 0 3px 0",
            boxShadow: "2px 2px 5px rgba(160,40,80,0.07)",
            pointerEvents: "none",
          }} />
        </div>
      )}

      <style>{`
        .fmc-seek { -webkit-appearance: none; }
        .fmc-seek::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 0; height: 0; border-radius: 50%;
          background: #f43f5e; box-shadow: 0 2px 6px rgba(244,63,94,0.45);
          transition: width 0.2s cubic-bezier(0.34,1.56,0.64,1), height 0.2s cubic-bezier(0.34,1.56,0.64,1);
          cursor: grab;
        }
        .fmc-seek:hover::-webkit-slider-thumb,
        .fmc-seek:active::-webkit-slider-thumb { width: 14px; height: 14px; }
        .fmc-seek::-moz-range-thumb {
          width: 0; height: 0; border: none; border-radius: 50%;
          background: #f43f5e; cursor: grab;
          transition: width 0.2s, height 0.2s;
        }
        .fmc-seek:hover::-moz-range-thumb { width: 14px; height: 14px; }
        .fmc-spin { animation: fmcSpin 4s linear infinite; }
        @keyframes fmcSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fmcPulse {
          0%   { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(1.72); opacity: 0; }
        }
        @keyframes fmcEq {
          from { transform: scaleY(0.18); }
          to   { transform: scaleY(1); }
        }
        @keyframes fmcIn {
          from { opacity: 0; transform: translateY(18px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fmc-enter { animation: fmcIn 0.32s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>
  );
}
