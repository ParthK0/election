import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ElectionTimeline = ({ phases, currentPhaseId, onPhaseClick }) => {
  return (
    <div className="relative mb-12 overflow-x-auto pb-6 scrollbar-hide">
      <div className="flex items-center min-w-max px-4">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhaseId;
          const isPast = phases.findIndex(p => p.id === currentPhaseId) > index;
          
          return (
            <div key={phase.id} className="flex items-center">
              {/* Step Circle */}
              <div 
                className="flex flex-col items-center gap-3 cursor-pointer group"
                onClick={() => onPhaseClick(phase.id)}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${isActive ? 'bg-gold border-gold-light scale-110 shadow-lg shadow-gold/50' : 
                    isPast ? 'bg-emerald-500 border-emerald-400' : 'bg-navy-light border-white/5 hover:border-gold/30'}
                `}>
                  {isPast ? <Check className="w-6 h-6 text-white" /> : <span className={`font-bold ${isActive ? 'text-navy' : 'text-slate-400 group-hover:text-gold'}`}>{index + 1}</span>}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-gold' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {phase.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="w-16 lg:w-24 h-0.5 mx-2 bg-white/5 relative">
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
