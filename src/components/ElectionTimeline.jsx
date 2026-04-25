import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ElectionTimeline = ({ phases, currentPhaseId, onPhaseClick }) => {
  return (
    <div className="relative overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center min-w-max px-2">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhaseId;
          const isPast = phases.findIndex(p => p.id === currentPhaseId) > index;
          
          return (
            <div key={phase.id} className="flex items-center">
              <div 
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => onPhaseClick(phase.id)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all border-2
                  ${isActive 
                    ? 'bg-accent-purple border-accent-purple text-white scale-110 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                    : isPast 
                      ? 'bg-accent-green border-accent-green text-white' 
                      : 'bg-dark-card border-dark-border text-text-muted group-hover:border-accent-purple/40'}
                `}>
                  {isPast 
                    ? <Check className="w-4 h-4" /> 
                    : <span className="text-xs font-bold">{index + 1}</span>
                  }
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${
                  isActive ? 'text-purple' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {phase.label}
                </span>
              </div>

              {index < phases.length - 1 && (
                <div className="w-12 lg:w-20 h-0.5 mx-2 bg-border relative">
                  <motion.div 
                    initial={false}
                    animate={{ width: isPast ? '100%' : '0%' }}
                    className="absolute top-0 left-0 h-full bg-emerald-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionTimeline;
