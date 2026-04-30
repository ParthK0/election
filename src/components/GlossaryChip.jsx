import { useElection } from "../context/ElectionContext";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { askGemini } from "../api/gemini";

const GlossaryChip = ({ term }) => {
  const { country } = useElection();
  const { setChatHistory } = useChat();
  const navigate = useNavigate();

  const handleTermClick = async (e) => {
    e.stopPropagation();
    const prompt = `Explain the electoral term "${term}" in the context of ${country} elections. Provide a clear definition and an example.`;
    navigate("/ask");
    const userMessage = { role: "user", content: `What is ${term}?` };
    setChatHistory((prev) => [...prev, userMessage]);
    try {
      const response = await askGemini(prompt, {
        country,
        currentPhase: "Glossary",
        role: "Voter",
      });
      setChatHistory((prev) => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleTermClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-muted border border-purple/10 rounded-full text-[11px] font-semibold text-purple hover:bg-purple hover:text-white transition-all"
    >
      Ask AI
      <MessageSquare className="w-3 h-3" />
    </button>
  );
};

export default GlossaryChip;
