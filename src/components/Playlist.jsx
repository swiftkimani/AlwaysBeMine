import { useState } from "react";

export default function Playlist({ data, compact }) {
  const [activeTrack, setActiveTrack] = useState(0);

  if (!data?.tracks) return null;

  if (compact) {
    return (
      <div className="glass-card p-4 w-72">
        <p className="text-xs font-bold text-zinc-700 mb-3" style={{ fontFamily: "Charm, serif" }}>
          🎵 {data.title || "Our Songs"}
        </p>
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto no-scrollbar">
          {data.tracks.slice(0, 5).map((track, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTrack(idx)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all cursor-pointer ${
                idx === activeTrack ? "bg-rose-50 border border-rose-200" : "hover:bg-zinc-50 border border-transparent"
              }`}
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                idx === activeTrack ? "bg-rose-500 text-white" : "bg-zinc-100 text-zinc-500"
              }`}>
                {idx === activeTrack ? "▶" : idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-bold truncate ${idx === activeTrack ? "text-rose-600" : "text-zinc-800"}`}>
                  {track.title}
                </p>
                <p className="text-[9px] text-zinc-500 truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-5 md:p-7">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-3xl mb-2 block">🎵</span>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-1" style={{ fontFamily: "Charm, serif" }}>
            {data.title || "Our Love Songs"}
          </h2>
          <p className="text-xs text-zinc-500">{data.subtitle || "Songs that remind me of us"}</p>
          <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
        </div>

        {/* Track List */}
        <div className="space-y-1.5 mb-5">
          {data.tracks.map((track, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTrack(idx)}
              className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-200 cursor-pointer ${
                idx === activeTrack
                  ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200"
                  : "hover:bg-zinc-50 border border-transparent"
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                idx === activeTrack ? "bg-rose-500 text-white" : "bg-zinc-100 text-zinc-500"
              }`}>
                {idx === activeTrack ? (
                  <div className="flex gap-px items-end h-3">
                    <span className="w-px bg-white" style={{ height: "60%", animation: "float 0.6s ease-in-out infinite" }} />
                    <span className="w-px bg-white" style={{ height: "100%", animation: "float 0.6s ease-in-out 0.15s infinite" }} />
                    <span className="w-px bg-white" style={{ height: "40%", animation: "float 0.6s ease-in-out 0.3s infinite" }} />
                  </div>
                ) : (
                  idx + 1
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${idx === activeTrack ? "text-rose-600" : "text-zinc-800"}`}>
                  {track.title}
                </p>
                <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
              </div>
              {track.url && (
                <span className="text-[10px] text-rose-500 shrink-0 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">▶ Open</span>
              )}
            </div>
          ))}
        </div>

        {/* Spotify Embed */}
        {data.spotify && (
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={data.spotify}
              width="100%"
              height={data.height || 352}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist"
            />
          </div>
        )}

        {/* YouTube Embed */}
        {data.youtube && !data.spotify && (
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="315"
              src={data.youtube}
              title="YouTube playlist player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {/* Note */}
        {data.note && (
          <p className="text-center text-xs text-zinc-500 mt-4 italic" style={{ fontFamily: "Charm, serif" }}>
            {data.note}
          </p>
        )}
      </div>
    </div>
  );
}
