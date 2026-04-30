import { useState, useEffect } from "react";
import { useElection } from "../context/ElectionContext";
import {
  HelpCircle,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCcw,
  Share2
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { logEvent } from "firebase/analytics";
import { db, functions, analytics } from "../lib/firebase";

const Quiz = () => {
  const { electionData, country } = useElection();
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (showResult && functions) {
      const fetchLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
          const getLeaderboard = httpsCallable(functions, 'getQuizLeaderboard');
          const result = await getLeaderboard();
          setLeaderboard(result.data || []);
        } catch (error) {
          console.error("Error fetching leaderboard", error);
        } finally {
          setLoadingLeaderboard(false);
        }
      };
      fetchLeaderboard();
    }
  }, [showResult]);

  if (!electionData || !electionData.quiz || electionData.quiz.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="Intelligence Not Available"
        message={`We are currently compiling the quiz data for ${country.toUpperCase()}. Please check back later.`}
        actionText="Return to Learning"
        actionLink="/learn"
      />
    );
  }

  const questions = electionData.quiz;

  const filteredQuestions = difficulty
    ? questions.filter((q) => q.difficulty === difficulty)
    : questions;

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === filteredQuestions[currentQuestion].answer)
      setScore(score + 1);
  };

  const saveScore = async (finalScore) => {
    if (!db) return;
    try {
      await addDoc(collection(db, "quizScores"), {
        score: finalScore,
        total: filteredQuestions.length,
        difficulty,
        country,
        timestamp: new Date(),
      });
      if (analytics) {
        logEvent(analytics, "quiz_completed", {
          score: finalScore,
          difficulty,
          country,
        });
      }
      console.log("Quiz score securely saved to Firestore.");
    } catch (error) {
      console.error("Failed to save quiz score to Firestore:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      saveScore(
        score +
          (selectedOption === filteredQuestions[currentQuestion].answer
            ? 1
            : 0),
      );
    }
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ElectIQ Quiz Score`,
          text: `I just scored ${score}/${filteredQuestions.length} on the ${country.toUpperCase()} Election Intelligence Quiz! Test your knowledge too.`,
          url: window.location.origin
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Helmet>
        <title>
          {country.toUpperCase()} Election Intelligence Quiz | ElectIQ
        </title>
        <meta
          name="description"
          content={`Test your knowledge of ${country}'s electoral process. Various difficulty levels from beginner to expert.`}
        />
      </Helmet>
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-text-muted hover:text-accent-purple transition-colors mb-8 text-xs font-bold uppercase tracking-widest group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Learning
      </Link>

      <AnimatePresence mode="wait">
        {!difficulty ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-dark-card border border-dark-border rounded-3xl p-10 lg:p-12 shadow-premium text-center"
          >
            <div className="w-20 h-20 bg-accent-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-premium">
              <Trophy className="w-10 h-10 text-accent-purple" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 tracking-tighter font-display">
              Election Intelligence Quiz
            </h1>
            <p className="text-text-muted mb-10 max-w-sm mx-auto text-sm leading-relaxed">
              Test your knowledge of {country}'s electoral process. Choose a
              difficulty level to begin.
            </p>
            <div className="grid gap-4">
              {[
                {
                  id: "Beginner",
                  desc: "Basic terminology and dates",
                  color: "bg-accent-green",
                },
                {
                  id: "Intermediate",
                  desc: "Rules, procedures, and rights",
                  color: "bg-accent-purple",
                },
                {
                  id: "Expert",
                  desc: "Deep-dive legislative details",
                  color: "bg-accent-warning",
                },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setDifficulty(tier.id)}
                  className="group relative p-5 bg-dark-card-2 border border-dark-border rounded-2xl text-left hover:border-accent-purple/50 transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white font-bold tracking-tight">
                      {tier.id}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${tier.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted font-medium">
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        ) : !showResult ? (
          <motion.div
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-dark-card border border-dark-border rounded-3xl p-8 lg:p-10 shadow-premium"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-accent-purple uppercase tracking-widest mb-1">
                  {difficulty} Level
                </span>
                <span className="text-xs font-bold text-white">
                  Question {currentQuestion + 1} of {filteredQuestions.length}
                </span>
              </div>
              <div className="h-1.5 w-24 bg-dark-surface rounded-full overflow-hidden border border-dark-border">
                <div
                  className="h-full bg-accent-purple transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  style={{
                    width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <h2 className="text-xl lg:text-2xl font-black text-white mb-8 leading-[1.1] tracking-tight font-display">
              {filteredQuestions[currentQuestion].question}
            </h2>

            <div className="grid gap-3">
              {filteredQuestions[currentQuestion].options.map(
                (option, index) => {
                  const isSelected = selectedOption === index;
                  const isAnswer =
                    filteredQuestions[currentQuestion].answer === index;

                  let style =
                    "bg-dark-card-2 border-dark-border text-text-primary hover:border-accent-purple/30";
                  if (selectedOption !== null) {
                    if (isAnswer)
                      style =
                        "bg-accent-green/10 border-accent-green/30 text-accent-green";
                    else if (isSelected)
                      style = "bg-red-500/10 border-red-500/30 text-red-400";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm font-bold ${style}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && isAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-accent-green" />
                      )}
                      {selectedOption !== null && isSelected && !isAnswer && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="p-5 bg-dark-card-2 rounded-2xl border border-dark-border mb-4">
                  <h4 className="text-[10px] font-black text-accent-purple uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Intelligence Report
                  </h4>
                  <p className="text-sm text-text-primary/90 leading-relaxed font-medium">
                    {filteredQuestions[currentQuestion].explanation}
                  </p>
                </div>
                {filteredQuestions[currentQuestion].funFact && (
                  <div className="p-4 bg-accent-warning/5 rounded-2xl border border-accent-warning/10 mb-6">
                    <h4 className="text-[10px] font-black text-accent-warning uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                      💡 Did you know?
                    </h4>
                    <p className="text-sm text-accent-warning/80 leading-relaxed">
                      {filteredQuestions[currentQuestion].funFact}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="w-full bg-accent-purple text-white py-4 rounded-xl text-sm font-bold hover:bg-accent-purple/80 transition-all shadow-premium active:scale-95"
                >
                  {currentQuestion + 1 === filteredQuestions.length
                    ? "See Final Score"
                    : "Continue"}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-dark-card border border-dark-border rounded-3xl p-12 shadow-premium"
          >
            <div className="w-20 h-20 bg-accent-purple/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-premium">
              <Trophy className="w-10 h-10 text-accent-purple" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tighter font-display">
              Analysis Complete
            </h2>
            <p className="text-text-muted mb-8 font-medium">
              You scored{" "}
              <span className="text-accent-purple font-black text-xl">
                {score}
              </span>{" "}
              out of{" "}
              <span className="font-bold text-white text-xl">
                {filteredQuestions.length}
              </span>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 bg-dark-card-2 border border-dark-border px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-dark-border transition-colors text-white"
              >
                <RefreshCcw className="w-4 h-4" /> Retry
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1DA1F2]/20 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <Link
                to="/learn"
                className="bg-accent-purple text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent-purple/80 transition-all shadow-premium flex items-center justify-center"
              >
                Finish
              </Link>
            </div>

            {/* Leaderboard */}
            <div className="mt-8 text-left bg-dark-card-2 p-6 rounded-2xl border border-dark-border">
              <h3 className="text-xl font-bold mb-4 text-white font-display flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-warning" /> Global
                Leaderboard
              </h3>
              {loadingLeaderboard ? (
                <p className="text-text-muted text-sm animate-pulse">
                  Loading scores...
                </p>
              ) : leaderboard.length > 0 ? (
                <ul className="space-y-3">
                  {leaderboard.map((entry, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center text-sm p-3 bg-dark-card border border-dark-border rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted font-mono w-4">
                          {idx + 1}.
                        </span>
                        <span className="text-white font-bold">
                          {entry.country?.toUpperCase() || "UNKNOWN"}
                        </span>
                        <span className="text-[10px] text-accent-purple uppercase tracking-widest border border-accent-purple/20 bg-accent-purple/10 px-2 py-0.5 rounded-md">
                          {entry.difficulty}
                        </span>
                      </div>
                      <span className="text-white font-black">
                        {entry.score}/{entry.total}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-muted text-sm">
                  No scores yet. You're the first!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
