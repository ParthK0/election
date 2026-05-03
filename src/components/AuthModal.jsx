import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      closeAuthModal();
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={closeAuthModal}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-dark-surface border border-dark-border rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          <button
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-dark-card border border-dark-border text-text-muted hover:text-white transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>


          <div className="relative z-10">
            <div className="w-12 h-12 bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6 border border-accent-purple/30">
              <Shield className="w-6 h-6 text-accent-purple" />
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-2 font-display">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-text-muted mb-8 text-sm leading-relaxed">
              {isLogin
                ? "Sign in to access your personalized election dashboard."
                : "Join ElectIQ to track candidates and save your progress."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <label htmlFor="auth-password" className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-accent-purple text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-purple/80 transition-all shadow-premium disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Sign Up"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                data-testid="auth-toggle"
                className="text-xs text-text-muted hover:text-white transition-colors"
              >
                {isLogin
                  ? "Don&apos;t have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-border text-center">
              <p className="text-[10px] text-text-muted/60 leading-relaxed max-w-[250px] mx-auto">
                By continuing, you agree to ElectIQ&apos;s Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
