import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Ask = lazy(() => import('./pages/Ask'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Sources = lazy(() => import('./pages/Sources'));

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

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
    <div className="w-20 h-20 bg-accent-purple/10 rounded-2xl flex items-center justify-center mb-8 shadow-premium">
      <span className="text-4xl">🔍</span>
    </div>
    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter font-display">Page Not Found</h1>
    <p className="text-text-muted mb-8 max-w-md text-sm leading-relaxed">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link 
      to="/" 
      className="bg-accent-purple text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-all shadow-premium active:scale-95"
    >
      Back to Home
    </Link>
  </div>
);

const LoadingFallback = () => (
  <div className="max-w-6xl mx-auto px-6 py-16">
    <div className="space-y-6">
      <div className="h-10 w-64 bg-dark-card-2 rounded-xl animate-pulse" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-dark-card-2 rounded-2xl animate-pulse" />
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
          <Route path="/sources" element={<PageWrapper><Sources /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-surface text-text-primary font-inter flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <AnimatedRoutes />
        </main>

        <footer className="py-12 px-6 border-t border-dark-border bg-dark-card">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-accent-purple rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">ElectIQ</span>
              </div>
              <p className="text-xs text-text-muted tracking-wide">Your Civic Intelligence Partner</p>
              <div className="flex gap-5 mt-2">
                {[
                  { label: 'Sources', to: '/sources' },
                  { label: 'Learn', to: '/learn' },
                  { label: 'Ask AI', to: '/ask' },
                  { label: 'Glossary', to: '/glossary' },
                ].map(link => (
                  <Link key={link.label} to={link.to} className="text-xs text-text-muted hover:text-accent-purple transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right max-w-sm">
              <p className="text-sm text-text-muted leading-relaxed">
                Neutral educational platform powered by Google Gemini AI. Data verified from official electoral commissions.
              </p>
              <p className="text-[11px] text-text-muted/60 mt-2">© 2026 ElectIQ</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
