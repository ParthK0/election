import { useElection } from '../context/ElectionContext';
import ElectionTimeline from '../components/ElectionTimeline';
import PhaseCard from '../components/PhaseCard';
import { AnimatePresence } from 'framer-motion';
import { Info, Calendar, MapPin, ChevronRight, Sparkles, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhaseCardSkeleton } from '../components/Skeleton';
import VoterChecklist from '../components/VoterChecklist';
import CountdownTimer from '../components/CountdownTimer';

const Learn = () => {
  const { electionData, currentPhase, setCurrentPhase, country, role } = useElection();

  if (!electionData) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="h-8 w-48 bg-surface-tertiary rounded-lg animate-pulse mb-4" />
        <div className="h-12 w-96 bg-surface-tertiary rounded-xl animate-pulse mb-12" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <PhaseCardSkeleton key={i} />)}
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-surface-tertiary rounded-2xl animate-pulse" />
            <div className="h-64 bg-surface-tertiary rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-purple text-sm font-semibold mb-3">
          <MapPin className="w-4 h-4" />
          {country.charAt(0).toUpperCase() + country.slice(1)}
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-dark mb-3 tracking-tight">
          {electionData.electionName}
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Complete guide to the electoral process. Select a phase to see details.
        </p>
      </header>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Timeline */}
      <div className="mb-14">
        <ElectionTimeline 
          phases={electionData.phases} 
          currentPhaseId={currentPhase}
          onPhaseClick={setCurrentPhase}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Phase Cards */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {electionData.phases.map((phase) => (
                <PhaseCard 
                  key={phase.id} 
                  phase={phase} 
                  isActive={currentPhase === phase.id}
                  onClick={() => setCurrentPhase(phase.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voter Checklist */}
          <VoterChecklist />

          {/* Eligibility */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2 text-white">
              <Info className="w-4 h-4 text-accent-purple" />
              Eligibility
            </h3>
            <div className="space-y-4">
              {Object.entries(electionData.eligibility).map(([key, value]) => (
                <div key={key}>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{key}</span>
                  <p className="text-white font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Dates */}
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-accent-purple" />
              Key Dates
            </h3>
            <div className="space-y-4">
              {electionData.keyDates.map((date, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div>
                    <p className="text-dark text-sm font-medium">{date.event}</p>
                    <p className="text-xs text-gray-400">{date.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-2xl bg-purple text-white">
            <h3 className="text-base font-bold mb-2">Have questions?</h3>
            <p className="text-white/70 mb-5 text-sm">Our AI can explain any part of the process.</p>
            <div className="flex flex-col gap-2">
              <Link 
                to="/ask"
                className="w-full py-2.5 bg-accent-purple text-white rounded-xl text-sm font-bold hover:bg-accent-purple/80 transition-all flex items-center justify-center gap-2 shadow-premium"
              >
                <Sparkles className="w-4 h-4" /> Ask Assistant
              </Link>
              <Link 
                to="/quiz"
                className="w-full py-2.5 bg-white/15 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" /> Test Knowledge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
