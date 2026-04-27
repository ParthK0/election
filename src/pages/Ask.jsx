import { useElection } from '../context/ElectionContext';
import { useChat } from '../context/ChatContext';
import ChatAssistant from '../components/ChatAssistant';
import QuickPrompts from '../components/QuickPrompts';
import { askGemini } from '../api/gemini';
import { useState } from 'react';
import { Sparkles, ShieldCheck, MapPin } from 'lucide-react';

const Ask = () => {
  const { country, currentPhase, role } = useElection();
  const { setChatHistory } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickPrompt = async (prompt) => {
    if (isProcessing) return;
    setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);
    setIsProcessing(true);
    try {
      const response = await askGemini(prompt, { country, currentPhase, role });
      setChatHistory(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8 hidden lg:block">
          <div>
            <div className="flex items-center gap-2 text-purple text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </div>
            <h1 className="text-3xl font-extrabold text-dark mb-3 tracking-tight">
              Election Assistant
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Get instant answers about {country}'s electoral processes. Powered by Gemini AI.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-purple" />
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Region</p>
                <p className="text-sm font-medium text-dark capitalize">{country}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-purple flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Phase</p>
                <p className="text-sm font-medium text-dark capitalize">{currentPhase}</p>
              </div>
            </div>
          </div>

          <QuickPrompts onPromptSelect={handleQuickPrompt} />

          <div className="p-4 rounded-xl bg-accent-green/5 border border-accent-green/15">
            <h4 className="flex items-center gap-1.5 text-accent-green font-semibold text-xs mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Neutrality Guaranteed
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Strictly educational. No political opinions or candidate recommendations.
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3">
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
};

export default Ask;
