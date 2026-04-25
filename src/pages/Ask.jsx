import { useElection } from '../context/ElectionContext';
import ChatAssistant from '../components/ChatAssistant';
import QuickPrompts from '../components/QuickPrompts';
import { askGemini } from '../api/gemini';
import { useState } from 'react';
import { MessageCircle, ShieldCheck, Info, Sparkles, Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Ask = () => {
  const { country, currentPhase, role, setChatHistory, personaTheme } = useElection();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickPrompt = async (prompt) => {
    if (isProcessing) return;
    
    const userMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    try {
      const response = await askGemini(prompt, { country, currentPhase, role });
      const botMessage = { role: 'bot', content: response };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[85vh] flex flex-col">
      <div className="grid lg:grid-cols-4 gap-12 flex-grow">
        
        {/* Left Sidebar: Context & Guidance */}
        <div className="lg:col-span-1 space-y-10 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gold text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5" />
              AI Intelligence
            </div>
            
            <h1 className="text-4xl font-black font-heading leading-none tracking-tighter">
              Election <br />
              <span className="text-slate-500 italic">Assistant</span>
            </h1>
            
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              A neutral, specialized model trained on {country} electoral protocols. 
              Always cross-verify with official gazettes.
            </p>
          </motion.div>

          <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Territory</p>
                <p className="text-sm font-bold text-white">{country}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Persona</p>
                <p className="text-sm font-bold text-white uppercase" style={{ color: personaTheme.color }}>{role}</p>
              </div>
            </div>
          </div>

          <QuickPrompts onPromptSelect={handleQuickPrompt} />

          <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10">
            <h4 className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4" />
              Safety & Neutrality
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Strictly educational. No political opinions or candidate recommendations will be provided.
            </p>
          </div>
        </div>

        {/* Right: Dedicated Chat Interface */}
        <div className="lg:col-span-3 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow flex flex-col"
          >
            <ChatAssistant />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Ask;
