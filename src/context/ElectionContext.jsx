import { createContext, useState, useEffect, useMemo } from "react";

/**
 * @typedef {Object} ElectionContextType
 * @property {string} country - The selected country.
 * @property {function} setCountry - Function to set the selected country.
 * @property {string} subCategory - The selected subcategory.
 * @property {function} setSubCategory - Function to set the selected subcategory.
 * @property {string} currentPhase - The current election phase.
 * @property {function} setCurrentPhase - Function to set the current election phase.
 * @property {string} role - The user's role (e.g., 'voter', 'candidate').
 * @property {function} setRole - Function to set the user's role.
 * @property {Object|null} electionData - The loaded election data for the country.
 * @property {Object} checklist - The user's checklist progress.
 * @property {function} toggleChecklistItem - Function to toggle a checklist item's status.
 * @property {Object} personaTheme - The styling theme for the current role.
 */

export const ElectionContext = createContext();

// Hook moved to src/hooks/useElection.js

/**
 * Provider component for ElectionContext.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */

export const ElectionProvider = ({ children }) => {
  const [country, setCountry] = useState("india");
  const [subCategory, setSubCategory] = useState("loksabha");
  const [currentPhase, setCurrentPhase] = useState("registration");
  const [role, setRole] = useState(
    () => localStorage.getItem("electiq_role") || "voter",
  );
  const [electionData, setElectionData] = useState(null);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("electiq_checklist");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("electiq_role", role);
  }, [role]);
  useEffect(() => {
    localStorage.setItem("electiq_checklist", JSON.stringify(checklist));
  }, [checklist]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const filename = country === "india" ? `india_${subCategory}` : country;
        const data = await import(`../data/${filename}.json`);
        setElectionData(data.default);
        if (data.default.phases && data.default.phases.length > 0) {
          const phaseExists = data.default.phases.some(
            (p) => p.id === currentPhase,
          );
          if (!phaseExists) {
            setCurrentPhase(data.default.phases[0].id);
          }
        }
      } catch (error) {
        console.error(`Failed to load data for ${country}:`, error);
      }
    };
    loadData();
  }, [country, subCategory, currentPhase]);

  const personaTheme = useMemo(() => {
    switch (role) {
      case "candidate":
        return { name: "Candidate", color: "#7c3aed", icon: "👔" };
      case "voter":
        return { name: "Voter", color: "#7c3aed", icon: "🗳️" };
      default:
        return { name: "General", color: "#7c3aed", icon: "🌍" };
    }
  }, [role]);

  const value = {
    country,
    setCountry,
    subCategory,
    setSubCategory,
    currentPhase,
    setCurrentPhase,
    role,
    setRole,
    electionData,
    checklist,
    toggleChecklistItem,
    personaTheme,
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
