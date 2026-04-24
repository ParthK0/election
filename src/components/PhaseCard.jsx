import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';

const PhaseCard = ({ phase, isActive, onClick }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`cursor-pointer rounded-3xl p-6 transition-all duration-500 border ${
        isActive 
          ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
          isActive ? 'bg-blue-600' : 'bg-white/5'
        }`}>
          {phase.icon}
        </div>
        {isActive && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-tighter">
            Active Viewing
          </span>
        )}
      </div>

      <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
        {phase.label}
      </h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {phase.description}
      </p>

      {isActive ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6 pt-4 border-t border-white/10"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Key Steps</h4>
            <div className="space-y-2">
              {phase.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Your Actions</h4>
            <div className="space-y-2">
              {phase.voterActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {phase.keyLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center text-sm font-semibold text-blue-400 gap-1 group">
          See Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );
};

export default PhaseCard;
