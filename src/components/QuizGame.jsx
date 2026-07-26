import { useState } from "react";

export default function QuizGame({ data, results }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = data[currentQ];
  const total = data.length;
  const percentage = Math.round((score / total) * 100);

  const handleAnswer = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const getResultMessage = () => {
    if (percentage === 100) return results.perfect;
    if (percentage >= 75) return results.high;
    if (percentage >= 50) return results.mid;
    return results.low;
  };

  if (finished) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 text-center">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/25 shadow-2xl animate-fade-in">
          <div className="text-7xl mb-4">{percentage === 100 ? "🏆" : percentage >= 75 ? "🌟" : percentage >= 50 ? "💖" : "💕"}</div>
          <h2 className="text-4xl font-bold text-zinc-900 mb-3" style={{ fontFamily: "Charm, serif" }}>
            {score}/{total}
          </h2>
          <div className="w-full bg-white/20 rounded-full h-4 mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-zinc-700 text-lg mb-8 leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
            {getResultMessage()}
          </p>
          <button
            onClick={() => {
              setCurrentQ(0);
              setScore(0);
              setSelected(null);
              setShowResult(false);
              setFinished(false);
            }}
            className="btn-glow bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Play Again 💕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <span className="text-sm font-bold text-rose-400 bg-white/10 px-3 py-1 rounded-full">Question {currentQ + 1}/{total}</span>
          <span className="text-sm font-bold text-zinc-500 bg-white/10 px-3 py-1 rounded-full">Score: {score}</span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2.5 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / total) * 100}%` }}
          />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
          {question.q}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let styles = "bg-white/20 hover:bg-white/35 text-zinc-800 border-white/15";
            if (showResult) {
              if (idx === question.answer) styles = "bg-green-500/80 text-white border-green-400/50";
              else if (idx === selected) styles = "bg-red-500/80 text-white border-red-400/50";
              else styles = "bg-white/10 text-zinc-400 border-white/5";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl font-medium transition-all duration-300 border cursor-pointer ${styles} ${
                  !showResult ? "hover:scale-[1.02] active:scale-[0.98]" : ""
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="text-center mt-8 animate-fade-in">
            <button
              onClick={handleNext}
              className="btn-glow bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              {currentQ + 1 >= total ? "See Results 🏆" : "Next Question 💕"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
