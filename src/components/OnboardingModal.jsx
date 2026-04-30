import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Globe, Check, User } from "lucide-react";
import { useElection } from "../context/ElectionContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

const OnboardingModal = () => {
  const { country, setCountry, role, setRole } = useElection();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("electiq_onboarded");
    if (!hasOnboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("electiq_onboarded", "true");
    if (analytics) {
      logEvent(analytics, "onboarding_completed", {
        country,
        role,
        skipped: step === 1,
      });
    }
    setIsOpen(false);
  };

  // Listen for custom event to open preferences
  useEffect(() => {
    const handleOpenPrefs = () => {
      setStep(2);
      setIsOpen(true);
    };
    window.addEventListener("open-preferences", handleOpenPrefs);
    return () =>
      window.removeEventListener("open-preferences", handleOpenPrefs);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleComplete}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-dark-surface border border-dark-border rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          <button
            onClick={handleComplete}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-dark-card border border-dark-border text-text-muted hover:text-white transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step content */}
          <div className="relative z-0">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-12 h-12 bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6 border border-accent-purple/30">
                  <Shield className="w-6 h-6 text-accent-purple" />
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-3 font-display">
                  Welcome to ElectIQ
                </h2>
                <p className="text-text-muted mb-8 text-sm leading-relaxed">
                  Your personalized AI guide to elections worldwide. Before we
                  start, let's tailor your experience.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-accent-purple text-white rounded-xl font-bold hover:bg-accent-purple/80 transition-all shadow-premium"
                  >
                    Personalize Experience
                  </button>
                  <button
                    onClick={handleComplete}
                    className="w-full py-4 bg-dark-card border border-dark-border text-white rounded-xl font-bold hover:bg-dark-border transition-all"
                  >
                    Skip & Use Defaults
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-accent-purple/20 rounded-xl flex items-center justify-center border border-accent-purple/30">
                    <Globe className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-display">
                      Select Region
                    </h2>
                    <p className="text-xs text-text-muted">
                      Choose the election you're tracking.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {["india", "usa", "uk", "australia"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountry(c)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        country === c
                          ? "bg-accent-purple/10 border-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                          : "bg-dark-card border-dark-border text-text-muted hover:border-accent-purple/50 hover:text-white"
                      }`}
                    >
                      <span className="font-bold capitalize">
                        {c === "usa" ? "USA" : c === "uk" ? "UK" : c}
                      </span>
                      {country === c && (
                        <Check className="w-4 h-4 text-accent-purple" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-dark-card border border-dark-border rounded-xl text-sm font-bold text-white hover:bg-dark-border transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-accent-purple text-white rounded-xl text-sm font-bold shadow-premium hover:bg-accent-purple/80 transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-accent-purple/20 rounded-xl flex items-center justify-center border border-accent-purple/30">
                    <User className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-display">
                      Select Role
                    </h2>
                    <p className="text-xs text-text-muted">
                      Customize the guidance you receive.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    {
                      id: "voter",
                      label: "Voter",
                      desc: "Schedules, polling locations, ID rules.",
                    },
                    {
                      id: "candidate",
                      label: "Candidate",
                      desc: "Filing rules, campaigning laws, forms.",
                    },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`w-full p-4 rounded-xl border flex items-start gap-4 transition-all text-left ${
                        role === r.id
                          ? "bg-accent-purple/10 border-accent-purple shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                          : "bg-dark-card border-dark-border hover:border-accent-purple/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                          role === r.id
                            ? "border-accent-purple"
                            : "border-dark-border"
                        }`}
                      >
                        {role === r.id && (
                          <div className="w-2.5 h-2.5 bg-accent-purple rounded-full" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`block font-bold mb-1 ${role === r.id ? "text-white" : "text-text-primary"}`}
                        >
                          {r.label}
                        </span>
                        <span className="text-xs text-text-muted leading-tight block">
                          {r.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-dark-card border border-dark-border rounded-xl text-sm font-bold text-white hover:bg-dark-border transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-3 bg-accent-purple text-white rounded-xl text-sm font-bold shadow-premium hover:bg-accent-purple/80 transition-all"
                  >
                    Finish Setup
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
