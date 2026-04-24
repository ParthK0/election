import { useElection } from '../context/ElectionContext';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const countries = [
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  // Future: uk, eu, canada, australia
];

const CountrySelector = () => {
  const { country, setCountry } = useElection();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = countries.find(c => c.id === country) || countries[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95"
      >
        <span className="text-xl">{selectedCountry.flag}</span>
        <span className="font-semibold text-white">{selectedCountry.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 w-48 glass rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCountry(c.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                  country === c.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300'
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;
