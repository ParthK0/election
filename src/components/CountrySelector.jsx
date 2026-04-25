import { useElection } from '../context/ElectionContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const countries = [
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
];

const CountrySelector = () => {
  const { country, setCountry } = useElection();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedCountry = countries.find(c => c.id === country) || countries[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-surface-tertiary border border-border rounded-lg hover:border-purple/30 transition-colors text-sm"
      >
        <span>{selectedCountry.flag}</span>
        <span className="font-medium text-dark">{selectedCountry.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full mt-1 right-0 w-40 bg-dark-card rounded-xl overflow-hidden shadow-2xl border border-dark-border z-50"
          >
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCountry(c.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-dark-card-2 transition-colors ${
                  country === c.id ? 'bg-accent-purple/10 text-accent-purple font-bold' : 'text-text-muted'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;
