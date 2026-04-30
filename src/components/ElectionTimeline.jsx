import { Check } from "lucide-react";
import { motion } from "framer-motion";

const ElectionTimeline = ({ phases, currentPhaseId, onPhaseClick }) => {
  return (
    <div className="relative overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center min-w-max px-2 md:justify-center md:min-w-full">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhaseId;
          const isPast =
            phases.findIndex((p) => p.id === currentPhaseId) > index;

          return (
            <div key={phase.id} className="flex items-center">
              <div
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => onPhaseClick(phase.id)}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute inset-[-4px] rounded-full border-2 border-accent-purple opacity-50 animate-ping" />
                  )}
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 relative z-10
                    ${
                      isPast
                        ? "bg-accent-purple border-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        : isActive
                          ? "bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                          : "bg-transparent border-dark-border text-text-muted group-hover:border-accent-purple/40"
                    }
                  `}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap mt-1 ${
                    isActive
                      ? "text-accent-purple"
                      : isPast
                        ? "text-text-primary"
                        : "text-text-muted group-hover:text-white"
                  }`}
                >
                  {phase.label}
                </span>
              </div>

              {index < phases.length - 1 && (
                <div className="w-12 lg:w-20 h-0.5 mx-2 bg-dark-border relative mt-[-18px]">
                  <motion.div
                    initial={false}
                    animate={{ width: isPast ? "100%" : "0%" }}
                    className="absolute top-0 left-0 h-full bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.5)]"
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
