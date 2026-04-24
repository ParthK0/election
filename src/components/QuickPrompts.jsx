import { useElection } from '../context/ElectionContext';
import { HelpCircle, ArrowRight } from 'lucide-react';

const QuickPrompts = ({ onPromptSelect }) => {
  const { electionData } = useElection();

  if (!electionData || !electionData.quickQuestions) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <HelpCircle className="w-4 h-4" />
        Quick Questions
      </h3>
      <div className="grid gap-3">
        {electionData.quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onPromptSelect(q)}
            className="text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group flex items-center justify-between"
          >
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{q}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPrompts;
