import { useElection } from '../context/ElectionContext';
import { useNavigate } from 'react-router-dom';
import { askGemini } from '../api/gemini';
import { MessageSquare } from 'lucide-react';

const GlossaryChip = ({ term }) => {
  const { country, setChatHistory } = useElection();
  const navigate = useNavigate();

  const handleTermClick = async (e) => {
    e.stopPropagation();
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
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-bold text-gold hover:bg-gold/20 hover:border-gold/40 transition-all group uppercase tracking-widest"
    >
      {term}
      <MessageSquare className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" />
    </button>
  );
};

export default GlossaryChip;
