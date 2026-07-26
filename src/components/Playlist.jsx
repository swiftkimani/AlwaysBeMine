export default function Playlist({ data, compact }) {
  if (compact) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl w-72">
        <p className="text-xs font-bold text-zinc-700 mb-3" style={{ fontFamily: "Charm, serif" }}>
          🎵 Our Songs
        </p>
        {data.spotify && (
          <iframe
            src={data.spotify}
            width="100%"
            height={data.compactHeight || 152}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title="Spotify Playlist"
          />
        )}
        {data.youtube && !data.spotify && (
          <iframe
            width="100%"
            height="160"
            src={data.youtube}
            title="YouTube playlist player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="rounded-xl"
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🎵</span>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Charm, serif" }}>
            {data.title || "Our Love Songs"}
          </h2>
          <p className="text-sm text-zinc-500">{data.subtitle || "Songs that remind me of us"}</p>
          <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
        </div>

        {data.tracks && data.tracks.length > 0 && (
          <div className="space-y-3 mb-6">
            {data.tracks.map((track, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-all duration-200 cursor-pointer"
                onClick={() => track.url && window.open(track.url, "_blank")}
              >
                <span className="text-lg w-8 text-center text-rose-400 font-bold">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-800 truncate">{track.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
                </div>
                {track.url && <span className="text-xs text-rose-400 shrink-0">▶ Listen</span>}
              </div>
            ))}
          </div>
        )}

        {data.spotify && (
          <div className="rounded-2xl overflow-hidden shadow-lg">
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

        {data.youtube && (
          <div className="rounded-2xl overflow-hidden shadow-lg mt-4">
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

        {data.note && (
          <p className="text-center text-xs text-zinc-500 mt-4 italic" style={{ fontFamily: "Charm, serif" }}>
            {data.note}
          </p>
        )}
      </div>
    </div>
  );
}
