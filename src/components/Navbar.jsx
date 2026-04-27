import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useElection } from '../context/ElectionContext';

const Navbar = () => {
  const location = useLocation();
  const { country } = useElection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'AI Ask', path: '/ask' },
    { name: 'Glossary', path: '/glossary' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-300 pointer-events-none ${isScrolled ? 'py-3 bg-dark-surface/80 backdrop-blur-2xl border-b border-dark-border/50 shadow-2xl' : 'py-4'}`}>
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

          {/* Navigation Pill — Desktop Only */}
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

            {/* Desktop CTA */}
            <Link 
              to="/learn"
              className="hidden sm:block bg-accent-purple text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-all shadow-premium"
            >
              Get Started
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-dark-card/60 backdrop-blur-xl border border-dark-border rounded-xl transition-all hover:border-accent-purple/30"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-dark-surface border-l border-dark-border z-[102] lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                    <Shield className="text-white w-4 h-4" />
                  </div>
                  <span className="text-base font-extrabold text-white font-display tracking-tight">ElectIQ</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 p-6 space-y-2">
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
                            : 'text-text-primary hover:bg-dark-card hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/quiz"
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      location.pathname === '/quiz'
                        ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
                        : 'text-text-primary hover:bg-dark-card hover:text-white'
                    }`}
                  >
                    Quiz
                  </Link>
                </motion.div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-dark-border space-y-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-dark-card rounded-xl border border-dark-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{country} LIVE</span>
                </div>
                <Link
                  to="/learn"
                  className="block w-full text-center bg-accent-purple text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-all shadow-premium"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
