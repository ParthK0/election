import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Ask = lazy(() => import('./pages/Ask'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Quiz = lazy(() => import('./pages/Quiz'));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const LoadingFallback = () => (
  <div className="max-w-6xl mx-auto px-6 py-16">
    <div className="space-y-6">
      <div className="h-10 w-64 bg-surface-tertiary rounded-xl animate-pulse" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-surface-tertiary rounded-2xl animate-pulse" />
        ))}
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
      <div className="min-h-screen bg-surface text-dark font-inter flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>

        <footer className="py-12 px-6 border-t border-border bg-surface-secondary">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <span className="font-extrabold text-lg text-dark tracking-tight">ElectIQ</span>
              </div>
              <p className="text-xs text-gray-400 tracking-wide">Your Civic Intelligence Partner</p>
              <div className="flex gap-5 mt-2">
                {['About', 'Privacy', 'Sources', 'Contact'].map(link => (
                  <a key={link} href="#" className="text-xs text-gray-400 hover:text-purple transition-colors">{link}</a>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right max-w-sm">
              <p className="text-sm text-gray-500 leading-relaxed">
                Neutral educational platform powered by Google Gemini AI. Data verified from official electoral commissions.
              </p>
              <p className="text-[11px] text-gray-400 mt-2">© 2026 ElectIQ</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
