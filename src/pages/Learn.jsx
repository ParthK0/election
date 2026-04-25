import { useElection } from '../context/ElectionContext';
import ElectionTimeline from '../components/ElectionTimeline';
import PhaseCard from '../components/PhaseCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Calendar, MapPin, ChevronRight, Sparkles, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton, { PhaseCardSkeleton } from '../components/Skeleton';

const Learn = () => {
  const { electionData, currentPhase, setCurrentPhase, country, personaTheme, role } = useElection();

  if (!electionData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <Skeleton className="w-24 h-4 mb-4" />
          <Skeleton className="w-1/2 h-12 mb-4" />
          <Skeleton className="w-3/4 h-6" />
        </header>
        <div className="grid lg:grid-cols-3 gap-12 mt-16">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <PhaseCardSkeleton key={i} />)}
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full rounded-[32px]" />
            <Skeleton className="h-[300px] w-full rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Dynamic Persona Accent */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] -z-10 opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: personaTheme.color }}
      ></div>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gold text-[10px] font-black uppercase tracking-[0.3em]">
            <MapPin className="w-3.5 h-3.5" />
            {country}
          </div>
          <div 
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border"
            style={{ 
              backgroundColor: `${personaTheme.color}15`, 
              borderColor: `${personaTheme.color}30`,
              color: personaTheme.color 
            }}
          >
            <Target className="w-3.5 h-3.5" />
            {personaTheme.name} Focus
          </div>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black mb-6 font-heading tracking-tighter leading-none">
          {electionData.electionName} <br />
          <span className="text-slate-500">Master Guide</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl text-balance leading-relaxed font-medium">
          Personalized electoral navigation for {role}s in {country}. 
          Select a phase to unlock specific procedures and requirements.
        </p>
      </header>

      {/* Global Progress */}
      <div className="mb-20">
        <ElectionTimeline 
          phases={electionData.phases} 
          currentPhaseId={currentPhase}
          onPhaseClick={setCurrentPhase}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-16 mt-16">
        {/* Main Phase Details */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-8">
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
        <div className="space-y-10">
          {/* Eligibility Panel */}
          <div className="p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 font-heading">
              <Info className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
              Eligibility
            </h3>
            <div className="space-y-6">
              {Object.entries(electionData.eligibility).map(([key, value]) => (
                <div key={key} className="relative pl-6 border-l-2 border-white/5 group-hover:border-gold/30 transition-colors">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 block">{key}</span>
                  <p className="text-slate-200 font-bold text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Dates Panel */}
          <div className="p-10 rounded-[48px] bg-navy-light/30 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 font-heading">
              <Calendar className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
              Key Dates
            </h3>
            <div className="space-y-8">
              {electionData.keyDates.map((date, i) => (
                <div key={i} className="flex justify-between items-center group/date">
                  <div>
                    <p className="text-slate-300 font-bold group-hover/date:text-white transition-colors text-lg">{date.event}</p>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{date.date}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover/date:translate-x-1">
                    <ChevronRight className="w-5 h-5 text-gold" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Impact CTA Block */}
          <div className="p-10 rounded-[48px] bg-gold text-navy relative overflow-hidden group shadow-2xl shadow-gold/20">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-3 font-heading leading-tight tracking-tighter italic">Stuck in <br/> complexity?</h3>
              <p className="text-navy/70 mb-10 text-sm font-bold leading-relaxed">Our AI expert is trained on official {country} protocols to guide you.</p>
              
              <div className="flex flex-col gap-4">
                <Link 
                  to="/ask"
                  className="w-full py-4 bg-navy text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-navy/90 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask Assistant
                </Link>
                <Link 
                  to="/quiz"
                  className="w-full py-4 bg-white/20 text-navy border border-navy/10 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-white/30 transition-all flex items-center justify-center gap-3"
                >
                  <Trophy className="w-4 h-4" />
                  Test Knowledge
                </Link>
              </div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
