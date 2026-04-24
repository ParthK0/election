import { useElection } from '../context/ElectionContext';
import ChatAssistant from '../components/ChatAssistant';
import QuickPrompts from '../components/QuickPrompts';
import { askGemini } from '../api/gemini';
import { useState } from 'react';
import { MessageCircle, ShieldCheck, Info } from 'lucide-react';

const Ask = () => {
  const { country, currentPhase, role, setChatHistory } = useElection();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickPrompt = async (prompt) => {
    if (isProcessing) return;
    
    // Add user message to history
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Info & Prompts */}
        <div className="lg:col-span-1 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageCircle className="w-3.5 h-3.5" />
              Direct AI Access
            </div>
            <h1 className="text-4xl font-bold mb-4">Election Assistant</h1>
            <p className="text-slate-400 leading-relaxed">
              Have specific questions about {country}'s elections? 
              Our AI is trained on official guidelines to provide neutral, factual answers.
            </p>
          </div>

          <QuickPrompts onPromptSelect={handleQuickPrompt} />

          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4" />
              Neutrality Guaranteed
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This assistant is strictly educational. It will not express political opinions, 
              recommend candidates, or take sides in political debates.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              Contextual Awareness: The assistant knows you are viewing the <strong>{currentPhase}</strong> phase for <strong>{country}</strong>.
            </p>
          </div>
        </div>

        {/* Right: Chat UI */}
        <div className="lg:col-span-2">
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
};

export default Ask;
