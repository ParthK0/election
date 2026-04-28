import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';
import { useElection } from '../context/ElectionContext';

const PhaseCard = ({ phase, isActive, onClick }) => {
  const { role } = useElection();
  const isCandidate = role === 'candidate';

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border relative group perspective-1000 ${
        isActive 
          ? 'bg-accent-purple/5 border-accent-purple border-l-[4px] shadow-premium' 
          : 'bg-dark-card border-dark-border hover:border-text-muted/30 hover:shadow-xl'
      }`}
    >
      <div className="flex items-start justify-between mb-6 transform-gpu" style={{ transform: "translateZ(20px)" }}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${
          isActive ? 'bg-accent-purple text-white shadow-premium' : 'bg-dark-card-2 text-text-muted border border-dark-border'
        }`}>
          {phase.icon}
        </div>
        {isActive && (
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-3 py-1 text-white text-[10px] font-black rounded-full uppercase tracking-widest ${
              isCandidate ? 'bg-accent-green shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-accent-purple'
            }`}
          >
            {isCandidate ? 'Candidate Protocol' : 'Voter Guide'}
          </motion.span>
        )}
      </div>

      <h3 className={`text-xl font-bold mb-2 font-display ${isActive ? 'text-white' : 'text-text-primary'}`}>
        {phase.label}
      </h3>
      <p className="text-sm text-text-muted mb-6 line-clamp-2 leading-relaxed font-medium">
        {phase.description}
      </p>

      {isActive ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-6 border-t border-dark-border"
        >
          {isCandidate ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-accent-green uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div>
                  Candidate Obligations
                </h4>
                <details className="bg-accent-green/5 border border-accent-green/20 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden group/details">
                  <summary className="cursor-pointer p-4 flex items-center justify-between text-xs font-bold text-accent-green/80 hover:text-accent-green hover:bg-accent-green/10 transition-colors select-none">
                    View Full Requirements
                    <ChevronRight className="w-4 h-4 transform group-open/details:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-4 pt-0 space-y-4 border-t border-accent-green/10 mt-2">
                    {Object.entries(phase.candidateDetails || {}).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-[9px] font-bold text-accent-green/70 uppercase tracking-widest block mb-1">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        {Array.isArray(value) ? (
                          <ul className="space-y-1.5">
                            {value.map((item, i) => (
                              <li key={i} className="text-xs text-text-primary/90 flex gap-2">
                                <span className="text-accent-green">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-text-primary/90 leading-relaxed">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-accent-purple uppercase tracking-[0.2em]">
                Standard Procedures
              </h4>
              <div className="space-y-2">
                {phase.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-text-primary/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {phase.keyLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card-2 hover:bg-dark-border border border-dark-border rounded-xl text-xs font-bold transition-all text-text-primary"
              >
                {link.label}
                <ExternalLink className="w-3 h-3 text-accent-purple" />
              </a>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center text-xs font-bold text-accent-purple gap-2 uppercase tracking-widest">
          Details <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};

export default PhaseCard;
