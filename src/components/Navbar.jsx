import { Link, useLocation } from 'react-router-dom';
import { Vote, BookOpen, MessageSquare, List, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useElection } from '../context/ElectionContext';
import CountrySelector from './CountrySelector';

const Navbar = () => {
  const location = useLocation();
  const { personaTheme, role } = useElection();

  const navItems = [
    { name: 'Home', path: '/', icon: Vote },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Ask', path: '/ask', icon: MessageSquare },
    { name: 'Glossary', path: '/glossary', icon: List },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex justify-between items-center shadow-2xl">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 group-hover:rotate-12 transition-transform duration-500">
            <Shield className="text-navy w-6 h-6" />
          </div>
          <span className="text-xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ElectIQ <span className="text-gold">AI</span>
          </span>
        </Link>

        {/* Persona Indicator */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
          >
            <span className="text-lg">{personaTheme.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mode:</span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em]`} style={{ color: personaTheme.color }}>
              {personaTheme.name}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={`Navigate to ${item.name}`}
              className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 group ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-navy-light rounded-xl border border-white/10 shadow-inner"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-gold' : 'group-hover:text-gold'} transition-colors`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <CountrySelector />
        </div>
        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block"></div>
        <Link 
          to="/learn"
          aria-label="Get Started with Election Guide"
          className="relative group bg-gold text-navy px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-gold/10 hover:shadow-gold/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <Zap className="w-3.5 h-3.5 fill-current" />
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
