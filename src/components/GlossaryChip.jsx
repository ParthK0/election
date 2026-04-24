import { useElection } from '../context/ElectionContext';
import { useNavigate } from 'react-router-dom';
import { askGemini } from '../api/gemini';
import { MessageSquare } from 'lucide-react';

const GlossaryChip = ({ term }) => {
  const { country, setChatHistory } = useElection();
  const navigate = useNavigate();

  const handleTermClick = async () => {
    const prompt = `Explain the electoral term "${term}" in the context of ${country} elections. Provide a clear definition and an example.`;
    
    // Redirect to Ask page
    navigate('/ask');
    
    // Initialize chat with this prompt
    const userMessage = { role: 'user', content: `What is ${term}?` };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const response = await askGemini(prompt, { country, currentPhase: 'Glossary', role: 'Voter' });
      const botMessage = { role: 'bot', content: response };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleTermClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
    >
      {term}
      <MessageSquare className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
    </button>
  );
};

export default GlossaryChip;
