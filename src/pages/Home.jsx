import { motion } from 'framer-motion';
import { useElection } from '../context/ElectionContext';
import CountrySelector from '../components/CountrySelector';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Globe, Users } from 'lucide-react';

const Home = () => {
  const { setRole } = useElection();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] -z-10"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-20 lg:py-32"
      >
        <div className="text-center mb-16">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Verified Educational Resource
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            Democracy, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Simplified for You.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Navigate the complexities of elections with our AI-powered guide. 
            From registration to results, we've got you covered with neutral, factual information.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Select Your Country</span>
              <CountrySelector />
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden sm:block"></div>
            <Link 
              to="/learn"
              className="group bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-slate-200 transition-all shadow-xl shadow-white/10 active:scale-95"
            >
              Explore Timeline
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: Globe,
              title: "Country Specific",
              desc: "Tailored rules, dates, and processes for your specific electoral system."
            },
            {
              icon: MessageSquare,
              title: "AI Assistant",
              desc: "Ask anything about voting, eligibility, or terms and get instant, neutral answers."
            },
            {
              icon: CheckCircle,
              title: "Voter Journey",
              desc: "Personalized checklists whether you are a first-time voter or a candidate."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Role Selection */}
        <motion.div 
          variants={itemVariants}
          className="mt-32 p-12 rounded-[40px] bg-gradient-to-br from-blue-600/20 to-emerald-600/10 border border-white/10 relative overflow-hidden"
        >
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 italic">Who are you today?</h2>
              <p className="text-slate-300 text-lg mb-8">
                Tell us your role so we can personalize your election timeline and tasks.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setRole('voter')}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
                >
                  <Users className="w-5 h-5" /> I'm a Voter
                </button>
                <button 
                  onClick={() => setRole('candidate')}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
                >
                  <Vote className="w-5 h-5" /> I'm a Candidate
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="w-full h-64 bg-slate-800/50 rounded-2xl border border-white/10 p-6 flex flex-col gap-4 animate-float">
                <div className="w-2/3 h-4 bg-blue-500/20 rounded-full"></div>
                <div className="w-full h-4 bg-white/5 rounded-full"></div>
                <div className="w-1/2 h-4 bg-white/5 rounded-full"></div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-white/10 rounded-full"></div>
                    <div className="w-16 h-3 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
