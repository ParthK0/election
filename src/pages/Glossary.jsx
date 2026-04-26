import { useElection } from '../context/ElectionContext';
import GlossaryChip from '../components/GlossaryChip';
import { Search, Book, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Glossary = () => {
  const { electionData, country } = useElection();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!electionData) return null;

  // Extract unique categories from the data
  const categories = useMemo(() => {
    const cats = new Set(electionData.glossary.map(item => item.category).filter(Boolean));
    return ['All', ...Array.from(cats).sort()];
  }, [electionData.glossary]);

  const filteredGlossary = electionData.glossary.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-accent-purple text-sm font-bold mb-3">
          <Book className="w-4 h-4" />
          Reference
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tighter font-display">
          Election Glossary
        </h1>
        <p className="text-text-muted max-w-xl text-sm leading-relaxed">
          Electoral terminology for {country}. Click "Ask AI" on any term for a detailed explanation powered by Gemini.
        </p>
      </header>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent-purple/40 text-white text-sm transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-text-muted shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-accent-purple text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-dark-card border border-dark-border text-text-muted hover:border-accent-purple/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted mb-6 font-mono">
        {filteredGlossary.length} {filteredGlossary.length === 1 ? 'term' : 'terms'}
        {activeCategory !== 'All' && ` in ${activeCategory}`}
      </p>

      {/* Terms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredGlossary.map((item, idx) => (
            <motion.div 
              key={item.term}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-accent-purple/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-accent-purple transition-colors">{item.term}</h3>
                  {item.category && (
                    <span className="inline-block px-2 py-0.5 bg-accent-purple/10 text-accent-purple text-[9px] font-bold uppercase tracking-widest rounded-md">
                      {item.category}
                    </span>
                  )}
                </div>
                <GlossaryChip term={item.term} />
              </div>
              <p className="text-text-muted text-sm leading-relaxed">{item.definition}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredGlossary.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-text-muted text-sm mb-2">No terms found matching "{search}"</p>
            <button 
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="text-accent-purple text-xs font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
