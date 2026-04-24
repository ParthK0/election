import { useElection } from '../context/ElectionContext';
import ElectionTimeline from '../components/ElectionTimeline';
import PhaseCard from '../components/PhaseCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Calendar, MapPin, ChevronRight } from 'lucide-react';

const Learn = () => {
  const { electionData, currentPhase, setCurrentPhase, country } = useElection();

  if (!electionData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
          <MapPin className="w-4 h-4" />
          {country}
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{electionData.electionName} Guide</h1>
        <p className="text-slate-400 text-lg max-w-3xl">
          Everything you need to know about the electoral process in {country}. 
          Select a phase below to see specific steps and requirements.
        </p>
      </header>

      {/* Global Progress */}
      <ElectionTimeline 
        phases={electionData.phases} 
        currentPhaseId={currentPhase}
        onPhaseClick={setCurrentPhase}
      />

      <div className="grid lg:grid-cols-3 gap-12 mt-16">
        {/* Main Phase Details */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-6">
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

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Eligibility Panel */}
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Eligibility
            </h3>
            <div className="space-y-4">
              {Object.entries(electionData.eligibility).map(([key, value]) => (
                <div key={key}>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{key}</span>
                  <p className="text-slate-200 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Dates Panel */}
          <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Key Dates
            </h3>
            <div className="space-y-6">
              {electionData.keyDates.map((date, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div>
                    <p className="text-slate-300 font-medium group-hover:text-white transition-colors">{date.event}</p>
                    <p className="text-sm text-slate-500">{date.date}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Link */}
          <div className="p-8 rounded-[32px] bg-blue-600 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Have questions?</h3>
              <p className="text-blue-100 mb-6 text-sm">Our AI assistant can explain any part of the process in detail.</p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Ask the Assistant
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
