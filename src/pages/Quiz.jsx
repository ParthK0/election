import { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quiz = () => {
  const { electionData, country } = useElection();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  if (!electionData || !electionData.quiz) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No quiz available for {country} yet.</h2>
        <Link to="/learn" className="text-gold hover:underline">Return to Learning</Link>
      </div>
    );
  }

  const questions = electionData.quiz;

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const correct = index === questions[currentQuestion].answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-gold transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Learning
      </Link>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-navy-light/30 border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all duration-500" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-10 font-heading leading-tight">
              {questions[currentQuestion].question}
            </h2>

            <div className="grid gap-4">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isAnswer = questions[currentQuestion].answer === index;
                
                let buttonStyle = "bg-white/5 border-white/5 hover:bg-white/10";
                if (selectedOption !== null) {
                  if (isAnswer) buttonStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                  else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500/50 text-red-400";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${buttonStyle}`}
                  >
                    <span className="font-medium">{option}</span>
                    {selectedOption !== null && isAnswer && <CheckCircle2 className="w-5 h-5" />}
                    {selectedOption !== null && isSelected && !isAnswer && <XCircle className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5"
              >
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  <strong className="text-slate-300 not-italic block mb-1">Explanation:</strong>
                  {questions[currentQuestion].explanation}
                </p>
                <button
                  onClick={handleNext}
                  className="mt-6 w-full bg-gold text-navy py-4 rounded-xl font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
                >
                  {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-navy-light/30 border border-white/5 rounded-[40px] p-12 lg:p-20 shadow-2xl backdrop-blur-md"
          >
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy className="w-12 h-12 text-gold animate-bounce" />
            </div>
            <h2 className="text-4xl font-bold mb-4 font-heading tracking-tight">Quiz Complete!</h2>
            <p className="text-slate-400 text-xl mb-10">
              You scored <span className="text-gold font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-sm mx-auto">
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Quiz
              </button>
              <Link
                to="/learn"
                className="bg-gold text-navy px-6 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 flex items-center justify-center"
              >
                Finish
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
