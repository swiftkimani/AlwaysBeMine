import { useState, useEffect, useCallback } from "react";
import { useRomance } from "../RomanceFX.jsx";

const humanFeedback = {
  correct: [
    "Aww, you know me so well! 🥹💖",
    "Bingo! That's my favorite memory too! 🥰",
    "Spot on, my love! You remember! ✨",
    "Yes! You never fail to amaze me 💕",
  ],
  incorrect: [
    "Ahn ahn! Guessing again? Try to remember! 😉💕",
    "Haha close, but not quite! I still love you though! 😘",
    "Oopsie! Somebody needs extra kisses for punishment! 💋",
    "Wrong answer, but you look so cute trying! 🥰",
  ],
};

export default function QuizGame({ data, results, onProgress }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const { burstFromEvent } = useRomance();

  const question = data[currentQ];
  const total = data.length;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    onProgress?.({ completed: currentQ, total, score, streak, finished });
  }, [currentQ, total, score, streak, finished, onProgress]);

  const handleAnswer = useCallback(
    (idx, e) => {
      if (showResult) return;
      setSelected(idx);
      setShowResult(true);
      const isCorrect = idx === question.answer;

      const msgs = isCorrect ? humanFeedback.correct : humanFeedback.incorrect;
      setFeedbackMsg(msgs[Math.floor(Math.random() * msgs.length)]);

      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });
        setTotalXP((p) => p + 25 + streak * 5);
        burstFromEvent(e, "💖");
      } else {
        setStreak(0);
      }
    },
    [showResult, question.answer, bestStreak, streak, burstFromEvent]
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
      setFeedbackMsg("");
    }
  }, [currentQ, total]);

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
        const keyMap = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
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
    setFeedbackMsg("");
  };

  if (finished) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center px-2">
        <div className="liquid p-6 sm:p-8 md:p-10 rounded-3xl border border-white/80 shadow-2xl animate-fade-in">
          <div className="text-6xl sm:text-7xl mb-4">
            {percentage === 100
              ? "🏆"
              : percentage >= 75
              ? "🌟"
              : percentage >= 50
              ? "💖"
              : "💕"}
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-2"
            style={{ fontFamily: "Charm, serif" }}
          >
            {score}/{total} Correct!
          </h2>
          <p className="text-sm text-zinc-500 mb-6 font-semibold">
            {percentage}% Compatibility Score 💕
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-rose-50/90 rounded-2xl card-pad-sm border border-rose-200/80 shadow-sm">
              <p className="text-2xl font-black text-rose-500">{score}</p>
              <p className="text-xs font-bold text-zinc-500">Correct</p>
            </div>
            <div className="bg-amber-50/90 rounded-2xl card-pad-sm border border-amber-200/80 shadow-sm">
              <p className="text-2xl font-black text-amber-500">{bestStreak}</p>
              <p className="text-xs font-bold text-zinc-500">Best Streak</p>
            </div>
            <div className="bg-purple-50/90 rounded-2xl card-pad-sm border border-purple-200/80 shadow-sm">
              <p className="text-2xl font-black text-purple-500">{totalXP}</p>
              <p className="text-xs font-bold text-zinc-500">XP Earned</p>
            </div>
          </div>

          <p
            className="text-zinc-800 text-base sm:text-lg mb-8 font-medium bg-rose-50/50 p-6 rounded-2xl border border-rose-100"
            style={{ fontFamily: "Charm, serif", lineHeight: 1.8 }}
          >
            {getResultMessage()}
          </p>

          <button
            onClick={resetQuiz}
            className="btn-primary bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:scale-105 text-sm sm:text-base px-8 py-3 shadow-lg"
          >
            Play Again 💕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="liquid p-6 sm:p-8 md:p-10 rounded-3xl border border-white/80 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black text-rose-600 bg-rose-50 pill-pad rounded-full border border-rose-200 shadow-sm">
            Question {currentQ + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <span className="streak-counter font-black">
                🔥 {streak} Streak!
              </span>
            )}
            <span className="xp-badge font-black">{totalXP} XP</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar h-2.5 mb-6">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQ + 1) / total) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h3
          className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 mb-7"
          style={{ fontFamily: "Charm, serif", lineHeight: 1.7 }}
        >
          {question.q}
        </h3>

        {/* Options */}
        <div className="space-y-4" role="radiogroup" aria-label={question.q}>
          {question.options.map((opt, idx) => {
            let styles =
              "bg-white/80 hover:bg-white text-zinc-800 border-white/90 shadow-sm";
            if (showResult) {
              if (idx === question.answer)
                styles =
                  "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-950 border-emerald-300 shadow-md font-bold";
              else if (idx === selected)
                styles =
                  "bg-gradient-to-r from-rose-50 to-red-50 text-rose-950 border-rose-300 shadow-md";
              else
                styles =
                  "bg-zinc-50/40 text-zinc-400 border-zinc-100 opacity-60";
            }

            return (
              <button
                key={idx}
                onClick={(e) => handleAnswer(idx, e)}
                role="radio"
                aria-checked={selected === idx}
                aria-label={`Option ${String.fromCharCode(65 + idx)}: ${opt}`}
                tabIndex={showResult ? -1 : 0}
                className={`w-full flex items-center justify-between card-pad-sm rounded-2xl transition-all duration-300 border text-sm sm:text-base cursor-pointer text-left ${styles} ${
                  !showResult
                    ? "hover:scale-[1.01] hover:border-rose-300 active:scale-[0.99]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${
                      showResult && idx === question.answer
                        ? "bg-emerald-500 text-white"
                        : showResult && idx === selected
                        ? "bg-rose-500 text-white"
                        : "bg-rose-100/80 text-rose-700"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-semibold">{opt}</span>
                </div>
                {showResult && idx === question.answer && (
                  <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                    ✓
                  </span>
                )}
                {showResult && idx === selected && idx !== question.answer && (
                  <span className="w-7 h-7 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Human Touch Feedback Toast */}
        {showResult && feedbackMsg && (
          <div className="mt-6 card-pad-sm rounded-2xl bg-rose-50/90 border border-rose-200 text-center animate-bounce-in">
            <p
              className="text-sm sm:text-base font-bold text-rose-700"
              style={{ fontFamily: "Charm, serif", lineHeight: 1.7 }}
            >
              {feedbackMsg}
            </p>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <div className="text-center mt-6 animate-fade-in">
            <button
              onClick={handleNext}
              className="btn-primary bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-xs sm:text-sm px-8 py-3 shadow-lg hover:scale-105"
            >
              {currentQ + 1 >= total ? "See Results 🏆" : "Next Question 💕"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
