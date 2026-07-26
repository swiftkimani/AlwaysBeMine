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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl animate-fade-in">
          <div className="text-6xl mb-4">{percentage === 100 ? "🏆" : percentage >= 75 ? "🌟" : percentage >= 50 ? "💖" : "💕"}</div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Charm, serif" }}>
            {score}/{total}
          </h2>
          <div className="w-full bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-zinc-700 text-lg mb-6" style={{ fontFamily: "Charm, serif" }}>
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
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Play Again 💕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-rose-400">Question {currentQ + 1}/{total}</span>
          <span className="text-sm font-bold text-zinc-500">Score: {score}</span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / total) * 100}%` }}
          />
        </div>

        <h3 className="text-xl font-bold text-zinc-900 mb-6" style={{ fontFamily: "Charm, serif" }}>
          {question.q}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let styles = "bg-white/20 hover:bg-white/30 text-zinc-800";
            if (showResult) {
              if (idx === question.answer) styles = "bg-green-500/80 text-white";
              else if (idx === selected) styles = "bg-red-500/80 text-white";
              else styles = "bg-white/10 text-zinc-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl font-medium transition-all duration-200 border border-white/10 cursor-pointer ${styles} ${
                  !showResult ? "hover:scale-[1.02] active:scale-[0.98]" : ""
                }`}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="text-center mt-6 animate-fade-in">
            <button
              onClick={handleNext}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {currentQ + 1 >= total ? "See Results 🏆" : "Next Question 💕"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
