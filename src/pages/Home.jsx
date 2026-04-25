import { motion } from 'framer-motion';
import { useElection } from '../context/ElectionContext';
import CountrySelector from '../components/CountrySelector';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Globe, Users, Vote, MessageSquare, Sparkles, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  const { setRole, role, personaTheme } = useElection();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      variants={containerVariants}
      className="relative overflow-hidden min-h-screen"
    >
      {/* Intense Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[150px] -z-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-navy)_80%)] -z-10"></div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative">
        <div className="text-center mb-32">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl backdrop-blur-md cursor-default"
          >
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-navy"></div>
              <div className="w-6 h-6 rounded-full bg-gold border-2 border-navy"></div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-navy"></div>
            </div>
            Next-Gen Election Intelligence
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-7xl lg:text-9xl font-black mb-10 tracking-tighter font-heading text-balance leading-[0.85]">
            VOTE WITH <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold animate-shimmer bg-[length:200%_auto]">
              CONFIDENCE.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed text-balance font-medium">
            Bridging the gap between complex bureaucracy and clear citizen action with state-of-the-art AI.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <div className="group bg-white/5 p-4 rounded-[32px] border border-white/5 hover:border-white/20 transition-all">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black mb-4 block">Region</span>
              <CountrySelector />
            </div>
            
            <Link 
              to="/learn"
              className="group relative bg-white text-navy px-12 py-6 rounded-[32px] font-black text-xl flex items-center gap-4 hover:bg-gold transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden"
            >
              <span>Get Started</span>
              <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-40">
          {[
            {
              icon: Globe,
              title: "Global Logic",
              desc: "Localized electoral intelligence for India and USA.",
              color: "blue-500"
            },
            {
              icon: MessageSquare,
              title: "Gemini AI",
              desc: "Ask anything. Get neutral, verified answers instantly.",
              color: "purple-500"
            },
            {
              icon: TrendingUp,
              title: "Real-time",
              desc: "Stay updated with phases, dates, and live procedures.",
              color: "gold"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -15, rotateZ: 1 }}
              className="p-10 rounded-[48px] bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-[24px] bg-${feature.color}/10 flex items-center justify-center mb-8 group-hover:bg-${feature.color} group-hover:text-navy transition-all duration-500 shadow-2xl`}>
                <feature.icon className={`w-8 h-8 text-${feature.color} group-hover:text-navy`} />
              </div>
              <h3 className="text-3xl font-black mb-4 font-heading">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Solid Color Persona Selection */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-[64px] overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Voter Block */}
            <motion.button
              onClick={() => setRole('voter')}
              whileHover={{ flexGrow: 1.2 }}
              className={`p-16 lg:p-24 text-left transition-all duration-700 relative overflow-hidden group ${role === 'voter' ? 'bg-blue-600' : 'bg-blue-900/40'}`}
            >
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 font-heading tracking-tighter">I'M A <br/> VOTER.</h2>
                <p className="text-blue-100 text-xl font-medium max-w-sm mb-10 opacity-80">
                  I want to know where, when, and how to cast my ballot.
                </p>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm ${role === 'voter' ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}>
                  Select Perspective <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </motion.button>

            {/* Candidate Block */}
            <motion.button
              onClick={() => setRole('candidate')}
              whileHover={{ flexGrow: 1.2 }}
              className={`p-16 lg:p-24 text-left transition-all duration-700 relative overflow-hidden group ${role === 'candidate' ? 'bg-gold' : 'bg-gold/20'}`}
            >
              <div className="relative z-10">
                <div className="w-20 h-20 bg-black/10 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform text-navy">
                  <Vote className="w-10 h-10" />
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-navy mb-6 font-heading tracking-tighter">I'M A <br/> CANDIDATE.</h2>
                <p className="text-navy/70 text-xl font-medium max-w-sm mb-10">
                  I need to understand nomination, compliance, and campaign rules.
                </p>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm ${role === 'candidate' ? 'bg-navy text-white' : 'bg-white/10 text-navy'}`}>
                  Select Perspective <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </motion.button>
          </div>
        </motion.div>

        {/* Social Proof Section */}
        <motion.div variants={itemVariants} className="mt-40 text-center">
          <div className="inline-flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <span className="text-2xl font-black tracking-tighter">DEMOCRACY</span>
            <span className="text-2xl font-black tracking-tighter">INTELLIGENCE</span>
            <span className="text-2xl font-black tracking-tighter">NEUTRALITY</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
