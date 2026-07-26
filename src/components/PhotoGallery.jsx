import { useState } from "react";

export default function PhotoGallery({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ${
              activeIdx === idx ? "col-span-2 row-span-2" : ""
            }`}
          >
            <div className={`bg-gradient-to-br ${item.color} w-full ${
              activeIdx === idx ? "h-80 md:h-96" : "h-40 md:h-48"
            } transition-all duration-500 flex items-center justify-center`}>
              <span className="text-5xl opacity-60 group-hover:scale-125 transition-transform duration-300">
                {["📸", "🌅", "💕", "✨", "🎭", "🌸"][idx % 6]}
              </span>
            </div>

            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300 ${
              activeIdx === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}>
              <p className="text-white text-sm md:text-base font-medium" style={{ fontFamily: "Charm, serif" }}>
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activeIdx !== null && (
        <div className="text-center mt-6 animate-fade-in">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <p className="text-lg text-zinc-800 font-medium" style={{ fontFamily: "Charm, serif" }}>
              {data[activeIdx].caption} 💕
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
