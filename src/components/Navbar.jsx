import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useElection } from '../context/ElectionContext';
import CountrySelector from './CountrySelector';

const Navbar = () => {
  const location = useLocation();
  const { country } = useElection();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'AI Ask', path: '/ask' },
    { name: 'Glossary', path: '/glossary' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-accent-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:rotate-12 transition-transform duration-500">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-white font-display tracking-tight">
            ElectIQ
          </span>
        </Link>

        {/* Navigation Pill - Very Dark/Glassy */}
        <div className="hidden lg:flex items-center bg-dark-card/60 backdrop-blur-2xl border border-dark-border p-1.5 rounded-full shadow-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  isActive ? 'text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill-bg"
                    className="absolute inset-0 bg-accent-purple rounded-full -z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
             {/* Language Hint */}
             <div className="relative group/lang">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-card/40 border border-dark-border rounded-full backdrop-blur-md hover:border-accent-purple/30 transition-all">
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">EN</span>
                  <div className="w-1 h-1 bg-accent-purple rounded-full"></div>
                </button>
                <div className="absolute top-full right-0 mt-2 w-32 bg-dark-card border border-dark-border rounded-xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover/lang:opacity-100 group-hover/lang:translate-y-0 transition-all shadow-2xl backdrop-blur-xl">
                  <div className="px-2 py-1.5 bg-accent-purple/10 rounded-lg">
                    <p className="text-[9px] font-black text-accent-purple uppercase tracking-widest">English</p>
                  </div>
                  <div className="mt-1 px-2 py-1.5 opacity-40">
                    <p className="text-[9px] font-bold text-white uppercase tracking-widest">Hindi (Soon)</p>
                  </div>
                  <div className="px-2 py-1.5 opacity-40">
                    <p className="text-[9px] font-bold text-white uppercase tracking-widest">Spanish (Soon)</p>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-2 px-4 py-2 bg-dark-card/40 border border-dark-border rounded-full backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{country} LIVE</span>
             </div>
          </div>
          <Link 
            to="/learn"
            className="bg-accent-purple text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-all shadow-premium"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
