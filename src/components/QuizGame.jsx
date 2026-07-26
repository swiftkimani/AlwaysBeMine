import { useState, useEffect, useCallback } from "react";

export default function QuizGame({ data, results, onProgress }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  const question = data[currentQ];
  const total = data.length;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    onProgress?.({ completed: currentQ, total, score, streak, finished });
  }, [currentQ, total, score, streak, finished, onProgress]);

  const handleAnswer = useCallback((idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.answer) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setTotalXP((p) => p + 25 + streak * 5);
    } else {
      setStreak(0);
    }
  }, [showResult, question.answer, bestStreak, streak]);

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  }, [currentQ, total]);

  // Keyboard navigation: 1-4 or A-D to select, Enter/Space for next
  useEffect(() => {
    const handleKey = (e) => {
      if (finished) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          resetQuiz();
        }
        return;
      }

      if (!showResult) {
        const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
        const idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined && idx < question.options.length) {
          e.preventDefault();
          handleAnswer(idx);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showResult, finished, handleAnswer, handleNext, question.options.length]);

  const getResultMessage = () => {
    if (percentage === 100) return results.perfect;
    if (percentage >= 75) return results.high;
    if (percentage >= 50) return results.mid;
    return results.low;
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setStreak(0);
    setTotalXP(0);
  };

  if (finished) {
    return (
      <div className="w-full max-w-xl mx-auto text-center">
        <div className="glass-card p-6 md:p-10 animate-fade-in">
          <div className="text-6xl mb-3">{percentage === 100 ? "🏆" : percentage >= 75 ? "🌟" : percentage >= 50 ? "💖" : "💕"}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Charm, serif" }}>
            {score}/{total}
          </h2>
          <p className="text-xs text-zinc-500 mb-3">{percentage}% correct</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
            <div className="bg-rose-50 rounded-xl p-3 border border-rose-100">
              <p className="text-lg font-bold text-rose-500">{score}</p>
              <p className="text-[10px] text-zinc-500">Correct</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-lg font-bold text-amber-500">{bestStreak}</p>
              <p className="text-[10px] text-zinc-500">Best Streak</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-lg font-bold text-purple-500">{totalXP}</p>
              <p className="text-[10px] text-zinc-500">XP Earned</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar mb-3">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>

          <p className="text-zinc-700 text-sm mb-6 leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
            {getResultMessage()}
          </p>

          <button onClick={resetQuiz} className="btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-sm">
            Play Again 💕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Question {currentQ + 1}/{total}
          </span>
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <span className="streak-counter">
                🔥 {streak} streak
              </span>
            )}
            <span className="xp-badge">{totalXP} XP</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-4">
          <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
        </div>

        {/* Question */}
        <h3 className="text-lg md:text-xl font-bold text-zinc-900 mb-5 leading-relaxed" style={{ fontFamily: "Charm, serif" }}>
          {question.q}
        </h3>

        {/* Options */}
        <div className="space-y-3" role="radiogroup" aria-label={question.q}>
          {question.options.map((opt, idx) => {
            let styles = "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200";
            if (showResult) {
              if (idx === question.answer) styles = "bg-green-50 text-green-800 border-green-300";
              else if (idx === selected) styles = "bg-red-50 text-red-800 border-red-300";
              else styles = "bg-zinc-50/50 text-zinc-400 border-zinc-100";
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                role="radio"
                aria-checked={selected === idx}
                aria-label={`Option ${String.fromCharCode(65 + idx)}: ${opt}`}
                tabIndex={showResult ? -1 : 0}
                className={`w-full text-left p-3 md:p-4 rounded-xl font-medium transition-all duration-300 border text-sm md:text-base cursor-pointer ${styles} ${
                  !showResult ? "hover:scale-[1.01] active:scale-[0.99]" : ""
                }`}
              >
                <span className="font-bold mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                {opt}
                {showResult && idx === question.answer && <span className="ml-2">✓</span>}
                {showResult && idx === selected && idx !== question.answer && <span className="ml-2">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Next */}
        {showResult && (
          <div className="text-center mt-6 animate-fade-in">
            <button onClick={handleNext} className="btn-primary bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-sm">
              {currentQ + 1 >= total ? "See Results 🏆" : "Next Question 💕"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
