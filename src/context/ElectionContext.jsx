import { createContext, useContext, useState, useEffect } from 'react';

const ElectionContext = createContext();

export const useElection = () => useContext(ElectionContext);

export const ElectionProvider = ({ children }) => {
  const [country, setCountry] = useState('india');
  const [currentPhase, setCurrentPhase] = useState('registration');
  const [role, setRole] = useState('voter'); // 'voter' or 'candidate'
  const [electionData, setElectionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Load country data dynamically
    const loadData = async () => {
      try {
        const data = await import(`../data/${country}.json`);
        setElectionData(data.default);
        // Reset phase when country changes
        if (data.default.phases && data.default.phases.length > 0) {
          setCurrentPhase(data.default.phases[0].id);
        }
      } catch (error) {
        console.error(`Failed to load data for ${country}:`, error);
      }
    };
    loadData();
  }, [country]);

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
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
