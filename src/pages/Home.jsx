import { useElection } from "../context/ElectionContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Vote,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
import CursorGlow from "../components/CursorGlow";

const Home = () => {
  const { setRole, role, country, electionData, currentPhase } = useElection();

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-dark-surface -mt-20">
      <Helmet>
        <title>ElectIQ — Premium AI Election Intelligence</title>
        <meta
          name="description"
          content="The ultimate civic toolkit. Navigate registration, candidates, and voting procedures with precision."
        />
      </Helmet>
      <CursorGlow />

      {/* LEFT HALF: Moody Purple/Black Hero */}
      <div
        className="relative w-full lg:w-[50%] hero-gradient min-h-[70vh] lg:min-h-screen flex items-center px-8 lg:px-20 py-20 z-10 animate-gradient"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(139,92,246,0.1), transparent 70%)",
        }}
      >
        {/* Giant Watermark - Even more subtle on dark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[200px] lg:text-[400px] font-black text-white/[0.03] select-none tracking-tighter leading-none transform -rotate-12 translate-y-20">
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
                {country.charAt(0).toUpperCase() + country.slice(1)} Election
                Intelligence Active
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
            The ultimate civic toolkit. Navigate registration, candidates, and
            voting procedures with precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 mb-16"
          >
            <Link
              to="/learn"
              className="px-8 py-4 bg-accent-purple text-white font-bold rounded-full text-base transition-all hover:scale-105 hover:bg-accent-purple/80 shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95"
            >
              Explore Guide
            </Link>
            <Link
              to="/ask"
              className="text-white/80 hover:text-white font-bold flex items-center gap-2 group transition-colors"
            >
              Consult AI{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-accent-purple" />
            </Link>
          </motion.div>

          {/* Hero Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-white/5"
          >
            {[
              { label: "AI Verified Data" },
              { label: "Official Sources" },
              { label: "Real-time Sync" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-green" />
                <span className="text-[11px] font-medium text-text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT HALF: Deep Dark UI Panels */}
      <div className="relative w-full lg:w-[50%] bg-dark-surface min-h-screen p-8 lg:p-20 flex flex-col justify-center gap-12 overflow-visible">
        {/* Role Selector */}
        <div className="space-y-4 w-full max-w-xl mx-auto z-50">
          <p className="text-[10px] font-bold text-accent-purple uppercase tracking-[0.2em]">
            Choose Your Perspective
          </p>
          <div className="flex gap-3">
            {[
              {
                id: "voter",
                label: "Voter",
                icon: Users,
                sub: "Dates & Procedures",
              },
              {
                id: "candidate",
                label: "Candidate",
                icon: Vote,
                sub: "Laws & Filings",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                className={`flex-1 p-5 rounded-xl border transition-all text-left group ${
                  role === p.id
                    ? "border-accent-purple bg-accent-purple/10"
                    : "border-dark-border bg-dark-card/30 hover:border-accent-purple/30"
                }`}
              >
                <p.icon
                  className={`w-6 h-6 mb-3 ${role === p.id ? "text-accent-purple" : "text-text-muted"}`}
                />
                <h4 className="text-sm font-bold text-white mb-0.5">
                  {p.label}
                </h4>
                <p className="text-[10px] text-text-muted leading-tight">
                  {p.sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Slanted Card Grid */}
        <div className="relative w-full max-w-xl mx-auto flex flex-col gap-6">
          <motion.div
            key={`progress-${role}`}
            initial={{ opacity: 0, rotate: -5, x: 50 }}
            animate={{ opacity: 1, rotate: -2, x: 0 }}
            transition={{ type: "spring", damping: 20 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
            className="dark-card p-6 shadow-premium z-30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                {role === "candidate"
                  ? "Campaign Progress"
                  : "Election Progress"}
              </h3>
              <Clock className="w-4 h-4 text-accent-purple" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xl font-extrabold text-white font-display tracking-tight mr-3">
                  {electionData?.phases?.length || "—"} Phases
                </span>
                <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest">
                  <Shield className="w-3 h-3 inline-block -mt-0.5" /> Tracked
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-accent-purple uppercase tracking-[0.2em] block">
                  Next Election
                </span>
                <span className="text-xl font-bold text-white">
                  {electionData?.targetDate
                    ? new Date(electionData.targetDate).getFullYear()
                    : "—"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white">
                  {electionData?.phases?.find((p) => p.id === currentPhase)
                    ?.label || "Current Phase"}
                </span>
                <span className="text-accent-purple">
                  {electionData?.phases
                    ? `${Math.round(((electionData.phases.findIndex((p) => p.id === currentPhase) + 1) / electionData.phases.length) * 100)}%`
                    : "—"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-dark-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: electionData?.phases
                      ? `${((electionData.phases.findIndex((p) => p.id === currentPhase) + 1) / electionData.phases.length) * 100}%`
                      : "0%",
                  }}
                  className="h-full bg-accent-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`assistant-${role}`}
            initial={{ opacity: 0, rotate: 5, x: 50 }}
            animate={{ opacity: 1, rotate: 1.5, x: 0 }}
            transition={{ type: "spring", damping: 20, delay: 0.1 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
            className="dark-card p-6 shadow-premium self-end w-[85%] z-40 -mt-8 -mr-8 border-accent-purple/20 bg-dark-card-2"
          >
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent-purple" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-accent-purple uppercase tracking-widest">
                  Assistant
                </p>
                <p className="text-xs text-text-primary leading-relaxed opacity-90">
                  {role === "candidate"
                    ? '"Your nomination package requires 10 proposers from your specific assembly constituency."'
                    : '"Don\'t forget to bring your EPIC card or a valid government ID to the polling booth."'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
