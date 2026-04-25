import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ElectionContext = createContext();

export const useElection = () => useContext(ElectionContext);

export const ElectionProvider = ({ children }) => {
  const [country, setCountry] = useState('india');
  const [currentPhase, setCurrentPhase] = useState('registration');
  const [role, setRole] = useState(() => localStorage.getItem('electiq_role') || 'voter');
  const [electionData, setElectionData] = useState(null);
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('electiq_chat');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('electiq_role', role);
  }, [role]);

  // Sync chat to localStorage
  useEffect(() => {
    localStorage.setItem('electiq_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    // Load country data dynamically
    const loadData = async () => {
      try {
        const data = await import(`../data/${country}.json`);
        setElectionData(data.default);
        // Reset phase when country changes if current phase doesn't exist in new data
        if (data.default.phases && data.default.phases.length > 0) {
          const phaseExists = data.default.phases.some(p => p.id === currentPhase);
          if (!phaseExists) {
            setCurrentPhase(data.default.phases[0].id);
          }
        }
      } catch (error) {
        console.error(`Failed to load data for ${country}:`, error);
      }
    };
    loadData();
  }, [country]);

  // Persona configuration
  const personaTheme = useMemo(() => {
    switch (role) {
      case 'candidate':
        return {
          name: 'Candidate',
          color: '#c9a84c', // Gold
          secondary: '#162a4d',
          accent: 'gold',
          icon: '👔'
        };
      case 'voter':
        return {
          name: 'Voter',
          color: '#3b82f6', // Blue
          secondary: '#1e3a8a',
          accent: 'blue',
          icon: '🗳️'
        };
      default:
        return {
          name: 'General',
          color: '#10b981', // Emerald
          secondary: '#064e3b',
          accent: 'emerald',
          icon: '🌍'
        };
    }
  }, [role]);

  const value = {
    country,
    setCountry,
    currentPhase,
    setCurrentPhase,
    role,
    setRole,
    electionData,
    chatHistory,
    setChatHistory,
    personaTheme
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
