import { useElection } from '../context/ElectionContext';
import GlossaryChip from '../components/GlossaryChip';
import { Search, Book } from 'lucide-react';
import { useState } from 'react';

const Glossary = () => {
  const { electionData, country } = useElection();
  const [search, setSearch] = useState('');

  if (!electionData) return null;

  const filteredGlossary = electionData.glossary.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-dark mb-2 flex items-center gap-3 tracking-tight">
          <Book className="w-7 h-7 text-purple" />
          Election Glossary
        </h1>
        <p className="text-gray-500 max-w-xl">
          Electoral terminology for {country}. Click "Ask AI" on any term for a detailed explanation.
        </p>
      </header>

      <div className="relative max-w-sm mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent-purple/40 text-white text-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGlossary.map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-accent-purple/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white group-hover:text-accent-purple transition-colors">{item.term}</h3>
              <GlossaryChip term={item.term} />
            </div>
            <p className="text-text-muted text-sm leading-relaxed">{item.definition}</p>
          </div>
        ))}
        {filteredGlossary.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 text-sm">
            No terms found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
