import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton, { PhaseCardSkeleton, ChatMessageSkeleton } from './components/Skeleton';

// Lazy load pages for better performance and smaller initial chunks
const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Ask = lazy(() => import('./pages/Ask'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Quiz = lazy(() => import('./pages/Quiz'));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
  >
    {children}
  </motion.div>
);

const LoadingFallback = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="space-y-8">
      <Skeleton className="w-1/3 h-12" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <PhaseCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/learn" element={<PageWrapper><Learn /></PageWrapper>} />
          <Route path="/ask" element={<PageWrapper><Ask /></PageWrapper>} />
          <Route path="/glossary" element={<PageWrapper><Glossary /></PageWrapper>} />
          <Route path="/quiz" element={<PageWrapper><Quiz /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy text-slate-200 font-plex selection:bg-gold/30 selection:text-gold-light flex flex-col">
        <Navbar />
        <main className="relative z-10 flex-grow">
          <AnimatedRoutes />
        </main>

        {/* Global Footer */}
        <footer className="py-16 px-6 border-t border-white/5 bg-navy-dark/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center shadow-lg shadow-gold/20">
                  <div className="w-4 h-4 bg-navy rounded-sm"></div>
                </div>
                <span className="font-bold text-2xl text-white font-heading tracking-tight">ElectIQ</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">Your Civic Intelligence Partner</p>
              
              <div className="flex gap-4 mt-4">
                {['About', 'Privacy', 'Sources', 'Contact'].map(link => (
                  <a key={link} href="#" className="text-xs text-slate-500 hover:text-gold transition-colors">{link}</a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-4 text-center md:text-right">
              <p className="text-sm text-slate-400 leading-relaxed max-w-md ml-auto">
                ElectIQ is a neutral educational platform powered by Google Gemini AI. We provide factual electoral information to foster informed civic participation.
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                © 2026 ElectIQ Project • Data verified from Official Electoral Commissions
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
