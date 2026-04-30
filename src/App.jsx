import { lazy, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import Navbar from "./components/Navbar";
import OnboardingModal from "./components/OnboardingModal";
import AuthModal from "./components/AuthModal";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = lazy(() => import("./pages/Home"));
const Learn = lazy(() => import("./pages/Learn"));
const Ask = lazy(() => import("./pages/Ask"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Sources = lazy(() => import("./pages/Sources"));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
    <div className="w-20 h-20 bg-accent-purple/10 rounded-2xl flex items-center justify-center mb-8 shadow-premium">
      <span className="text-4xl">🔍</span>
    </div>
    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter font-display">
      Page Not Found
    </h1>
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
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-dark-card-2 rounded-2xl animate-pulse"
          />
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
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/learn"
            element={
              <PageWrapper>
                <Learn />
              </PageWrapper>
            }
          />
          <Route
            path="/ask"
            element={
              <PageWrapper>
                <Ask />
              </PageWrapper>
            }
          />
          <Route
            path="/glossary"
            element={
              <PageWrapper>
                <Glossary />
              </PageWrapper>
            }
          />
          <Route
            path="/quiz"
            element={
              <PageWrapper>
                <Quiz />
              </PageWrapper>
            }
          />
          <Route
            path="/sources"
            element={
              <PageWrapper>
                <Sources />
              </PageWrapper>
            }
          />
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-dark-surface text-text-primary font-inter flex flex-col">
        <Navbar />
        <OnboardingModal />
        <AuthModal />
        <main
          id="main-content"
          className="flex-grow pt-24 pb-8 focus:outline-none"
          tabIndex="-1"
        >
          <AnimatedRoutes />
        </main>

        <footer className="relative pt-16 pb-10 px-6 bg-dark-card overflow-hidden">
          {/* Gradient top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-accent-purple/30 blur-sm" />

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10">
              {/* Brand */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-accent-purple rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-white tracking-tight font-display">
                    ElectIQ
                  </span>
                </div>
                <p className="text-xs text-accent-purple font-medium tracking-wide">
                  Your Civic Intelligence Partner
                </p>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-3">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em]">
                  Navigate
                </p>
                <div className="flex gap-6">
                  {[
                    { label: "Sources", to: "/sources" },
                    { label: "Learn", to: "/learn" },
                    { label: "Ask AI", to: "/ask" },
                    { label: "Glossary", to: "/glossary" },
                    { label: "Quiz", to: "/quiz" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-xs text-text-muted hover:text-accent-purple transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="max-w-xs text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-bold text-accent-green uppercase tracking-widest">
                    Verified Sources
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Neutral educational platform powered by Google Gemini AI. Data
                  verified from official electoral commissions.
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 pt-6 border-t border-dark-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-text-muted/50 font-mono">
                © 2026 ElectIQ — Open Civic Intelligence
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-accent-purple/40" />
                <span className="text-[10px] text-text-muted/40 font-mono">
                  v1.0
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
