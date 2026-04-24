import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Globe, ChevronDown, CheckCircle2, Calendar, 
  HelpCircle, Send, ArrowRight, BookOpen, MessageCircle, 
  Layout, List, User, Bot, Sparkles, Search, ChevronRight
} from 'lucide-react';

// --- DUMMY DATA ---
const COUNTRIES = [
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'uk', name: 'UK', flag: '🇬🇧' },
  { id: 'eu', name: 'EU', flag: '🇪🇺' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺' },
];

const PHASES = [
  {
    id: 'registration',
    name: 'Registration',
    subtitle: 'Voter Enrollment',
    description: 'The foundation of participation. Ensure your eligibility and presence on the official electoral roll.',
    steps: [
      { title: 'Check Enrollment', detail: 'Verify your name in the Voter List via the ECI Voter Service Portal.', icon: <Search className="w-4 h-4" /> },
      { title: 'Submit Form 6', detail: 'New voters or those who moved must submit Form 6 for inclusion.', icon: <Layout className="w-4 h-4" /> },
      { title: 'Field Verification', detail: 'Booth Level Officers conduct door-to-door verification of details.', icon: <User className="w-4 h-4" /> },
      { title: 'EPIC Issuance', detail: 'The Electoral Photo Identity Card is issued to verified citizens.', icon: <Shield className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Special Drive', date: 'Oct 15 - Nov 30' },
      { event: 'Draft Roll Pub', date: 'Dec 05' },
      { event: 'Final Roll Pub', date: 'Jan 05' },
    ],
    glossary: ['EPIC Card', 'Form 6', 'BLO', 'Electoral Roll']
  },
  {
    id: 'nomination',
    name: 'Nomination',
    subtitle: 'Candidate Entry',
    description: 'Prospective representatives formalize their intent to contest by filing official papers.',
    steps: [
      { title: 'Filing Papers', detail: 'Candidates file nominations with the Returning Officer (RO).', icon: <BookOpen className="w-4 h-4" /> },
      { title: 'Security Deposit', detail: 'Contestants must deposit a fixed sum (refundable if 1/6th votes gained).', icon: <Shield className="w-4 h-4" /> },
      { title: 'Scrutiny', detail: 'The RO examines all filed papers for legal compliance.', icon: <CheckCircle2 className="w-4 h-4" /> },
      { title: 'Withdrawal', detail: 'Candidates are given a 2-day window to withdraw their names.', icon: <ArrowRight className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Gazette Notif', date: 'Day 0' },
      { event: 'Last Nom Date', date: 'Day 7' },
      { event: 'Scrutiny Date', date: 'Day 8' },
    ],
    glossary: ['Returning Officer', 'Affidavit', 'Security Deposit', 'Scrutiny']
  },
  {
    id: 'campaign',
    name: 'Campaign',
    subtitle: 'Public Outreach',
    description: 'Parties and candidates present their visions to the electorate through rallies and manifestos.',
    steps: [
      { title: 'Manifesto Release', detail: 'Parties publish their policy promises and planned initiatives.', icon: <List className="w-4 h-4" /> },
      { title: 'Public Rallies', detail: 'Mass mobilization and speeches by star campaigners.', icon: <Sparkles className="w-4 h-4" /> },
      { title: 'MCC Enforcement', detail: 'The Model Code of Conduct governs all political behavior.', icon: <Shield className="w-4 h-4" /> },
      { title: 'Silence Period', detail: 'All campaigning must stop 48 hours before the poll ends.', icon: <Shield className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Star Campaigners List', date: 'Day 10' },
      { event: 'Public Meetings', date: 'Ongoing' },
      { event: 'Silence Period', date: 'Polling - 48h' },
    ],
    glossary: ['MCC', 'Manifesto', 'Star Campaigner', 'Silence Period']
  },
  {
    id: 'voting',
    name: 'Voting Day',
    subtitle: 'The Main Poll',
    description: 'Millions of citizens exercise their constitutional right at polling booths across the nation.',
    steps: [
      { title: 'Mock Poll', detail: 'Verification of EVMs in front of polling agents at 5:30 AM.', icon: <CheckCircle2 className="w-4 h-4" /> },
      { title: 'Identity Check', detail: 'First Polling Officer verifies identity against the roll.', icon: <User className="w-4 h-4" /> },
      { title: 'The Indelible Ink', detail: 'A mark is placed on the left index finger as a safeguard.', icon: <Shield className="w-4 h-4" /> },
      { title: 'Vote Casting', detail: 'The blue button is pressed; VVPAT slip confirms the choice.', icon: <Shield className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Poll Start', date: '7:00 AM' },
      { event: 'Poll End', date: '6:00 PM' },
      { event: 'Seal EVMs', date: 'After Poll' },
    ],
    glossary: ['EVM', 'VVPAT', 'Indelible Ink', 'Polling Agent']
  },
  {
    id: 'counting',
    name: 'Counting',
    subtitle: 'Tabulating Results',
    description: 'The sealed EVMs are opened in designated counting centers to reveal the public mandate.',
    steps: [
      { title: 'Strong Room Opening', detail: 'Seals are checked by candidates and officials before opening.', icon: <Shield className="w-4 h-4" /> },
      { title: 'Postal Ballots', detail: 'Special votes from service personnel are counted first.', icon: <BookOpen className="w-4 h-4" /> },
      { title: 'EVM Round-wise', detail: 'Votes are tabulated round by round from individual machines.', icon: <List className="w-4 h-4" /> },
      { title: 'Result Declaration', detail: 'RO announces the winner and issues a Certificate of Election.', icon: <CheckCircle2 className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Counting Day', date: '8:00 AM' },
      { event: 'First Trends', date: '9:30 AM' },
      { event: 'Final Result', date: 'Late Evening' },
    ],
    glossary: ['Strong Room', 'Postal Ballot', 'Round-wise', 'RO']
  },
  {
    id: 'certification',
    name: 'Certification',
    subtitle: 'Formalizing Victories',
    description: 'The Election Commission consolidates all winners and issues the official gazette notification.',
    steps: [
      { title: 'Consolidation', detail: 'The ECI compiles results from all 543 constituencies.', icon: <List className="w-4 h-4" /> },
      { title: 'Gazette Notification', detail: 'Official publication of the names of the elected members.', icon: <Shield className="w-4 h-4" /> },
      { title: 'Submission to President', detail: 'Commissioners present the list to the Head of State.', icon: <User className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Consolidation', date: 'Result + 1 Day' },
      { event: 'Gazette Date', date: 'Result + 3 Days' },
    ],
    glossary: ['Gazette', 'ECI', 'Constituency']
  },
  {
    id: 'government',
    name: 'Formation',
    subtitle: 'New Administration',
    description: 'The largest party or coalition is invited to prove its majority and take the oath of office.',
    steps: [
      { title: 'Invitation', detail: 'The President invites the leader of the largest group.', icon: <ArrowRight className="w-4 h-4" /> },
      { title: 'Oath Ceremony', detail: 'The Prime Minister and Cabinet take the oath at Rashtrapati Bhavan.', icon: <Shield className="w-4 h-4" /> },
      { title: 'Floor Test', detail: 'The new government must prove its majority in the Lok Sabha.', icon: <CheckCircle2 className="w-4 h-4" /> },
    ],
    keyDates: [
      { event: 'Oath Ceremony', date: 'To be decided' },
      { event: 'First Session', date: 'Oath + 7 Days' },
    ],
    glossary: ['Coalition', 'Oath of Office', 'Floor Test', 'Majority']
  },
];

const QUICK_QUESTIONS = [
  "How can I register if I live abroad?",
  "What documents are valid for identity proof?",
  "How does the VVPAT system work?",
  "What is the limit for candidate expenditure?",
  "Can I vote if my name is not in the roll but I have an ID?"
];

// --- COMPONENTS ---

const CountrySelector = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry = COUNTRIES.find(c => c.id === selected);

  return (
    <div className="relative w-full px-4 mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-navy-light/50 border border-gold/20 rounded-lg px-3 py-2 text-sm hover:border-gold/40 transition-all"
      >
        <div className="flex items-center gap-2">
          <span>{selectedCountry.flag}</span>
          <span className="font-medium text-slate-200">{selectedCountry.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 top-full left-4 right-4 mt-1 bg-navy-light border border-gold/20 rounded-lg shadow-2xl overflow-hidden"
          >
            {COUNTRIES.map(c => (
              <button
                key={c.id}
                onClick={() => { onSelect(c.id); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PhaseSidebar = ({ activePhase, onSelect }) => {
  return (
    <div className="space-y-1">
      {PHASES.map((phase, idx) => {
        const isActive = activePhase === idx;
        return (
          <button
            key={phase.id}
            onClick={() => onSelect(idx)}
            className={`w-full group flex items-start gap-3 px-4 py-3 text-left transition-all relative ${
              isActive ? 'bg-navy-light/40 border-l-2 border-gold' : 'hover:bg-navy-light/20'
            }`}
          >
            <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              isActive ? 'bg-gold border-gold text-navy' : 'bg-navy-light border-slate-700 text-slate-500 group-hover:border-slate-500'
            }`}>
              {idx + 1}
            </div>
            <div>
              <div className={`text-sm font-bold ${isActive ? 'text-gold' : 'text-slate-300 group-hover:text-white'}`}>
                {phase.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {phase.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-navy-light h-1.5 rounded-full overflow-hidden mb-8">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.3)]"
      />
    </div>
  );
};

const PhaseContent = ({ phase, phaseIdx }) => {
  return (
    <motion.div
      key={phaseIdx}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-[28px] font-playfair font-bold text-white mb-2">{phase.name}</h2>
      <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-2xl">
        {phase.description}
      </p>

      <div className="space-y-4 mb-12">
        {phase.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group flex items-center gap-4 bg-navy-light/30 border border-white/5 p-4 rounded-xl hover:border-gold/20 hover:bg-navy-light/50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-bold text-white shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
              {idx + 1}
            </div>
            <div className="flex-grow">
              <h4 className="text-[15px] font-bold text-slate-100 mb-0.5">{step.title}</h4>
              <p className="text-[13px] text-slate-500 leading-tight">{step.detail}</p>
            </div>
            <div className="text-slate-600 group-hover:text-gold transition-colors">
              {step.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-10">
        <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Key Dates</h5>
        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
          {phase.keyDates.map((date, idx) => (
            <div key={idx} className="shrink-0 bg-gold px-4 py-2 rounded-lg text-navy flex flex-col min-w-[120px]">
              <span className="text-[10px] font-bold uppercase opacity-70">{date.event}</span>
              <span className="text-sm font-bold">{date.date}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const GlossaryPills = ({ terms, onTermClick }) => {
  return (
    <div className="pt-6 border-t border-white/5">
      <div className="flex flex-wrap gap-2">
        {terms.map((term, idx) => (
          <button
            key={idx}
            onClick={() => onTermClick(term)}
            className="px-3 py-1 bg-navy-light/50 border border-white/10 rounded-full text-[11px] text-slate-400 hover:border-gold/50 hover:text-gold transition-all"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

const QuickQuestions = ({ onSelect }) => {
  return (
    <div className="mb-8">
      <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">People also ask</h5>
      <div className="space-y-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="w-full flex items-center justify-between gap-3 text-left p-3 rounded-lg bg-navy-light/20 hover:bg-navy-light/40 transition-colors group"
          >
            <span className="text-xs text-slate-300 leading-tight group-hover:text-gold">{q}</span>
            <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-gold" />
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatPanel = ({ chatHistory, isThinking, onSend }) => {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-slate-200">Ask ElectIQ</h4>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-green"></div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {chatHistory.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 text-[13px] leading-relaxed rounded-xl ${
              msg.role === 'user' 
                ? 'bg-navy border border-gold/20 text-slate-100 rounded-tr-none' 
                : 'bg-navy-light border border-white/5 text-slate-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-navy-light p-3 rounded-xl rounded-tl-none border border-white/5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the process..."
          className="flex-grow bg-navy border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/50 transition-all text-slate-200"
        />
        <button 
          type="submit"
          className="w-10 h-10 bg-gold hover:bg-gold/80 rounded-lg flex items-center justify-center transition-all shrink-0 shadow-lg shadow-gold/10"
        >
          <Send className="w-4 h-4 text-navy" />
        </button>
      </form>
    </div>
  );
};

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'learn', icon: BookOpen, label: 'Learn' },
    { id: 'ask', icon: MessageCircle, label: 'Ask' },
    { id: 'glossary', icon: List, label: 'Glossary' },
    { id: 'quiz', icon: Shield, label: 'Quiz' },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-navy border-t border-white/10 flex justify-around items-center z-50 px-2">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-gold' : 'text-slate-500'}`}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- MOCK API ---
const claudeChat = async (message) => {
  // Simulate AI response based on keywords
  await new Promise(r => setTimeout(r, 1500));
  if (message.toLowerCase().includes('register')) return "Voter registration is the process of enrolling in the electoral roll. In India, citizens can use Form 6 to apply as a new voter. You'll need proof of age and residence.";
  if (message.toLowerCase().includes('vvpat')) return "VVPAT (Voter Verifiable Paper Audit Trail) is a machine connected to the EVM that generates a paper slip. It allows voters to verify that their vote was cast correctly for their intended candidate.";
  return "That's a great question about the electoral process. In the current phase of the election, specific rules and deadlines apply to ensure a free and fair outcome. Do you have a more specific detail you'd like to know?";
};

// --- MAIN APP ---

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState('india');
  const [activePhase, setActivePhase] = useState(0);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', content: "Welcome to ElectIQ. I am your neutral, factual guide to the electoral process. How can I assist you today?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [mobileTab, setMobileTab] = useState('learn');

  const progress = ((activePhase + 1) / PHASES.length) * 100;
  const currentPhase = PHASES[activePhase];

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setChatHistory(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await claudeChat(text);
      setChatHistory(prev => [...prev, { role: 'bot', content: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleTermClick = (term) => {
    handleSendMessage(`What is ${term}?`);
    setMobileTab('ask');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-navy text-slate-200 overflow-hidden font-plex">
      
      {/* LEFT SIDEBAR (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-[220px] bg-navy border-r border-white/5 overflow-y-auto scrollbar-hide">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-gold rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-navy" />
            </div>
            <h1 className="text-xl font-playfair font-bold text-white">ElectIQ</h1>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Election Guide</p>
        </div>

        <CountrySelector selected={selectedCountry} onSelect={setSelectedCountry} />
        
        <nav className="flex-grow">
          <PhaseSidebar activePhase={activePhase} onSelect={setActivePhase} />
        </nav>

        <div className="p-4 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-gold/5">
            <Sparkles className="w-4 h-4" />
            Quiz Me
          </button>
        </div>
      </aside>

      {/* CENTER PANEL */}
      <main className={`flex-1 flex flex-col h-full bg-navy relative ${mobileTab !== 'learn' && 'hidden md:flex'}`}>
        {/* Top Header */}
        <header className="p-6 md:px-10 md:pt-10 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            <span>{COUNTRIES.find(c => c.id === selectedCountry).name}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">{currentPhase.name}</span>
          </div>
          <ProgressBar progress={progress} />
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto px-6 md:px-10 pb-20 md:pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <PhaseContent key={activePhase} phase={currentPhase} phaseIdx={activePhase} />
          </AnimatePresence>
          <GlossaryPills terms={currentPhase.glossary} onTermClick={handleTermClick} />
        </div>
      </main>

      {/* RIGHT SIDEBAR (Desktop Only) */}
      <aside className={`flex flex-col w-full md:w-[320px] bg-navy border-l border-white/5 h-full ${mobileTab !== 'ask' && 'hidden md:flex'}`}>
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar pb-24 md:pb-0">
          <QuickQuestions onSelect={handleSendMessage} />
          <div className="h-[calc(100vh-250px)] md:h-[calc(100vh-280px)]">
            <ChatPanel 
              chatHistory={chatHistory} 
              isThinking={isThinking} 
              onSend={handleSendMessage} 
            />
          </div>
        </div>
      </aside>

      {/* MOBILE MOBILE ONLY CONTENT (Placeholder for other tabs) */}
      {mobileTab === 'glossary' && (
        <div className="md:hidden flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-playfair font-bold mb-6">Terms Library</h2>
          <div className="grid gap-3">
            {PHASES.flatMap(p => p.glossary).map((term, i) => (
              <button 
                key={i} 
                onClick={() => handleTermClick(term)}
                className="p-4 bg-navy-light/30 border border-white/5 rounded-xl text-left hover:border-gold/30 transition-all"
              >
                <div className="text-gold font-bold mb-1">{term}</div>
                <div className="text-[10px] text-slate-500 uppercase">Context: Phase {i % 7 + 1}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mobileTab === 'quiz' && (
        <div className="md:hidden flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-2xl font-playfair font-bold mb-2">Challenge Your Knowledge</h2>
          <p className="text-slate-400 text-sm mb-8">Take a short quiz on the current electoral phase to test what you've learned.</p>
          <button className="bg-gold text-navy px-8 py-3 rounded-xl font-bold">Start Quiz</button>
        </div>
      )}

      {/* MOBILE TAB BAR */}
      <TabBar activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  );
}
