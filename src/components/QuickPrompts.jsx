import { HelpCircle, ArrowRight } from "lucide-react";
import { useElection } from "../context/ElectionContext";

const QuickPrompts = ({ onPromptSelect }) => {
  const { electionData } = useElection();
  if (!electionData || !electionData.quickQuestions) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5" />
        Suggested
      </h3>
      <div className="grid gap-2">
        {electionData.quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onPromptSelect(q)}
            className="text-left p-3 rounded-xl bg-surface-tertiary border border-border hover:border-purple/30 transition-all group flex items-center justify-between"
          >
            <span className="text-xs text-gray-500 group-hover:text-dark transition-colors">
              {q}
            </span>
            <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-purple group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPrompts;
