import { useElection } from '../context/ElectionContext';
import { CheckSquare, Square, ListChecks, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const checklistData = {
  india: [
    { id: 'in-1', text: 'Check name in voter list' },
    { id: 'in-2', text: 'Get Voter ID (EPIC) card' },
    { id: 'in-3', text: 'Find your polling station' },
    { id: 'in-4', text: 'Keep valid photo ID ready' },
    { id: 'in-5', text: 'Know your constituency candidates' },
    { id: 'in-6', text: 'Understand EVM & VVPAT process' },
  ],
  usa: [
    { id: 'us-1', text: 'Register to vote (vote.gov)' },
    { id: 'us-2', text: 'Check registration status' },
    { id: 'us-3', text: 'Know your state ID requirements' },
    { id: 'us-4', text: 'Find your polling place' },
    { id: 'us-5', text: 'Request absentee ballot (if needed)' },
    { id: 'us-6', text: 'Research candidates & ballot measures' },
  ],
};

const VoterChecklist = () => {
  const { country, checklist, toggleChecklistItem } = useElection();
  const [copied, setCopied] = useState(false);
  const items = checklistData[country] || [];
  const completed = items.filter(item => checklist[item.id]).length;
  const progress = items.length > 0 ? (completed / items.length) * 100 : 0;

  const handleShare = () => {
    const completedItems = items.filter(item => checklist[item.id]).map(i => `[x] ${i.text}`);
    const pendingItems = items.filter(item => !checklist[item.id]).map(i => `[ ] ${i.text}`);
    
    const text = `🗳️ ElectIQ Checklist for ${country.toUpperCase()}\nProgress: ${completed}/${items.length}\n\nCompleted:\n${completedItems.join('\n')}\n\nRemaining:\n${pendingItems.join('\n')}\n\nPrepared with ElectIQ AI.`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-card border border-dark-border shadow-premium">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-accent-purple" />
          Your Checklist
        </h3>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{completed}/{items.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden mb-5 border border-dark-border">
        <motion.div
          className="h-full bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.5)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-1 mb-6">
        {items.map((item) => {
          const isDone = checklist[item.id];
          return (
            <button
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all group ${
                isDone 
                  ? 'text-text-muted line-through opacity-50' 
                  : 'text-text-primary hover:bg-white/5'
              }`}
            >
              <div className="shrink-0 transition-transform group-active:scale-90">
                {isDone 
                  ? <CheckSquare className="w-4 h-4 text-accent-purple" /> 
                  : <Square className="w-4 h-4 text-dark-border group-hover:text-text-muted" />
                }
              </div>
              <span className="font-medium">{item.text}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={handleShare}
          className="w-full py-2.5 bg-dark-card-2 hover:bg-dark-border border border-dark-border rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2 text-accent-green"
              >
                <Check className="w-3.5 h-3.5" /> Copied to Clipboard
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-accent-purple" /> Share Progress
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {progress === 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-xl text-center"
          >
            <p className="text-[11px] text-accent-green font-bold uppercase tracking-wider">🎉 Fully Prepared</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VoterChecklist;
