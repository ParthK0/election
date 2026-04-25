import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

const PhaseCard = ({ phase, isActive, onClick }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ 
        y: -5,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`cursor-pointer rounded-[32px] p-8 transition-all duration-500 border relative overflow-hidden group perspective-1000 ${
        isActive 
          ? 'bg-gradient-to-br from-gold/20 to-navy-light/40 border-gold/50 shadow-[0_20px_50px_rgba(201,168,76,0.15)]' 
          : 'bg-white/5 border-white/5 hover:border-gold/30 hover:bg-white/[0.08]'
      }`}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-start justify-between mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
          isActive ? 'bg-gold text-navy' : 'bg-navy-light text-slate-300 border border-white/5'
        }`}>
          {phase.icon}
        </div>
        {isActive && (
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-1.5 bg-gold text-navy text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-gold/20"
          >
            In Focus
          </motion.span>
        )}
      </div>

      <h3 className={`text-2xl font-bold mb-2 font-heading tracking-tight ${isActive ? 'text-white' : 'text-slate-200'}`}>
        {phase.label}
      </h3>
      <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed font-medium">
        {phase.description}
      </p>

      {isActive ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 pt-8 border-t border-white/10"
        >
          <div className="grid gap-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gold/50"></span>
                Key Procedures
              </h4>
              <div className="space-y-3">
                {phase.steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 text-slate-300 text-[13px] group/step"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 group-hover/step:bg-emerald-500 group-hover/step:text-navy transition-all">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gold/50"></span>
                Citizen Checklist
              </h4>
              <div className="space-y-3">
                {phase.voterActions.map((action, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-4 text-slate-300 text-[13px] group/action"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 border border-gold/20 group-hover/action:bg-gold group-hover/action:text-navy transition-all">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {phase.keyLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all text-white shadow-xl"
              >
                {link.label}
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center text-xs font-black text-gold gap-2 group/btn uppercase tracking-[0.2em] mt-auto">
          Explore Details
          <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center group-hover/btn:bg-gold group-hover/btn:text-navy transition-all duration-300">
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PhaseCard;
