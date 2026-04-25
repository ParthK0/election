import { motion } from 'framer-motion';
import { useElection } from '../context/ElectionContext';
import CountrySelector from '../components/CountrySelector';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, Shield, Vote, MessageCircle, Users } from 'lucide-react';

const Home = () => {
  const { setRole, role, country } = useElection();

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-dark-surface">
      
      {/* LEFT HALF: Moody Purple/Black Hero */}
      <div className="relative w-full lg:w-[55%] hero-gradient min-h-[70vh] lg:min-h-screen flex items-center px-8 lg:px-20 py-20 z-10 animate-gradient">
        {/* Giant Watermark - Even more subtle on dark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[200px] lg:text-[400px] font-black text-accent-purple/5 select-none tracking-tighter leading-none transform -rotate-12 translate-y-20">
            VOTE
          </span>
        </div>

        <div className="relative max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="px-3 py-1 bg-accent-purple/10 backdrop-blur-md border border-accent-purple/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-accent-purple uppercase tracking-widest">
                {country.toUpperCase()} Election Intelligence Active
              </span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-[84px] font-extrabold text-white leading-[0.9] tracking-tighter mb-8 font-display"
          >
            Empowering <br />
            Democracy with <br />
            <span className="text-accent-purple">AI.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg lg:text-xl text-text-muted font-medium mb-12 max-w-md"
          >
            The ultimate civic toolkit. Navigate registration, candidates, and voting procedures with precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6"
          >
            <Link 
              to="/learn"
              className="px-8 py-4 bg-accent-purple text-white font-bold rounded-full text-base transition-all hover:scale-105 hover:bg-accent-purple/80 shadow-premium active:scale-95"
            >
              Explore Guide
            </Link>
            <Link 
              to="/ask"
              className="text-white/80 hover:text-white font-bold flex items-center gap-2 group transition-colors"
            >
              Consult AI <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-accent-purple" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* RIGHT HALF: Deep Dark UI Panels */}
      <div className="relative w-full lg:w-[45%] bg-dark-surface min-h-screen p-8 lg:p-20 flex flex-col justify-center gap-12 overflow-visible">
        
        {/* Slanted Card Grid */}
        <div className="relative w-full max-w-xl mx-auto flex flex-col gap-6 lg:scale-110">
          
          <motion.div
            initial={{ opacity: 0, rotate: -5, x: 50 }}
            animate={{ opacity: 1, rotate: -2, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
            className="dark-card p-6 shadow-premium z-30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Global Timeline</h3>
              <Clock className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white">Validation Phase</span>
                <span className="text-accent-purple">88% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  className="h-full bg-accent-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 5, x: 50 }}
            animate={{ opacity: 1, rotate: 1.5, x: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 0.1 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
            className="dark-card p-6 shadow-premium self-end w-[85%] z-40 -mt-8 -mr-8 border-accent-purple/20 bg-dark-card-2"
          >
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent-purple" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-accent-purple uppercase tracking-widest">Assistant</p>
                <p className="text-xs text-text-primary leading-relaxed opacity-90">
                  "Your nomination package requires 10 proposers from your specific assembly constituency."
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 z-20">
            <div className="dark-card p-5 bg-dark-card flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Registered</span>
              <span className="text-2xl font-extrabold text-white font-display tracking-tight">1.2B+</span>
              <span className="text-[9px] text-accent-green font-bold flex items-center gap-1 uppercase tracking-widest">
                <Shield className="w-2.5 h-2.5" /> Encrypted
              </span>
            </div>
            <div className="dark-card p-5 bg-dark-card-2 border-accent-purple/20 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-accent-purple uppercase tracking-[0.2em]">Next Election</span>
              <span className="text-2xl font-extrabold text-white font-display tracking-tight">Q2 2024</span>
              <span className="text-[9px] font-mono text-text-muted">COUNTDOWN SYNCED</span>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mt-8 space-y-4">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] text-center">Perspective Tuning</p>
          <div className="flex gap-3">
            {[
              { id: 'voter', label: 'Voter', icon: Users, sub: 'Dates & Procedures' },
              { id: 'candidate', label: 'Candidate', icon: Vote, sub: 'Laws & Filings' }
            ].map((p) => (
              <button 
                key={p.id}
                onClick={() => setRole(p.id)}
                className={`flex-1 p-5 rounded-xl border transition-all text-left group ${
                  role === p.id 
                    ? 'border-accent-purple bg-accent-purple/10' 
                    : 'border-dark-border bg-dark-card/30 hover:border-accent-purple/30'
                }`}
              >
                <p.icon className={`w-6 h-6 mb-3 ${role === p.id ? 'text-accent-purple' : 'text-text-muted'}`} />
                <h4 className="text-sm font-bold text-white mb-0.5">{p.label}</h4>
                <p className="text-[10px] text-text-muted leading-tight">{p.sub}</p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Region Selector */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-dark-card/60 backdrop-blur-xl border border-dark-border px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white tracking-widest">{country.toUpperCase()}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div className="w-px h-3 bg-dark-border"></div>
          <CountrySelector />
        </div>
      </div>

    </div>
  );
};

export default Home;
