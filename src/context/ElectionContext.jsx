import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ElectionContext = createContext();

export const useElection = () => useContext(ElectionContext);

export const ElectionProvider = ({ children }) => {
  const [country, setCountry] = useState('india');
  const [currentPhase, setCurrentPhase] = useState('registration');
  const [role, setRole] = useState(() => localStorage.getItem('electiq_role') || 'voter');
  const [electionData, setElectionData] = useState(null);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('electiq_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem('electiq_role', role); }, [role]);
  useEffect(() => { localStorage.setItem('electiq_checklist', JSON.stringify(checklist)); }, [checklist]);

  const toggleChecklistItem = (id) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await import(`../data/${country}.json`);
        setElectionData(data.default);
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

  const personaTheme = useMemo(() => {
    switch (role) {
      case 'candidate':
        return { name: 'Candidate', color: '#7c3aed', icon: '👔' };
      case 'voter':
        return { name: 'Voter', color: '#7c3aed', icon: '🗳️' };
      default:
        return { name: 'General', color: '#7c3aed', icon: '🌍' };
    }
  }, [role]);

  const value = {
    country, setCountry,
    currentPhase, setCurrentPhase,
    role, setRole,
    electionData,
    checklist, toggleChecklistItem,
    personaTheme
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
