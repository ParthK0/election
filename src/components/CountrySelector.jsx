import { useElection } from '../context/ElectionContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const countries = [
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'usa', name: 'USA', flag: '🇺🇸', disabled: true },
  { id: 'uk', name: 'UK', flag: '🇬🇧', disabled: true },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', disabled: true },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', disabled: true },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', disabled: true }
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
        className="flex items-center gap-2 px-3 py-2 bg-transparent rounded-lg hover:bg-dark-card transition-colors text-sm"
      >
        <span>{selectedCountry.flag}</span>
        <span className="font-medium text-white">{selectedCountry.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-dark-card rounded-xl overflow-hidden shadow-2xl border border-dark-border z-50 backdrop-blur-xl"
          >
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => { if (!c.disabled) { setCountry(c.id); setIsOpen(false); } }}
                disabled={c.disabled}
                className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                  country === c.id ? 'bg-accent-purple/10 text-accent-purple font-bold border-l-2 border-accent-purple' : 
                  c.disabled ? 'text-text-muted/40 cursor-not-allowed' : 'text-text-primary hover:bg-dark-card-2 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={c.disabled ? 'opacity-40 grayscale' : ''}>{c.flag}</span>
                  <span>{c.name}</span>
                </div>
                {c.disabled && <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted/50 border border-dark-border px-1.5 py-0.5 rounded">Soon</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;
