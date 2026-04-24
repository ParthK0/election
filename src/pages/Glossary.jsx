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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Book className="w-8 h-8 text-blue-500" />
          Election Glossary
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          A comprehensive guide to electoral terminology in {country}. 
          Click on any term to get a more detailed AI-powered explanation.
        </p>
      </header>

      {/* Search */}
      <div className="relative max-w-md mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for terms or definitions..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Glossary Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGlossary.map((item, idx) => (
          <div key={idx} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.term}</h3>
              <GlossaryChip term={item.term} />
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              {item.definition}
            </p>
          </div>
        ))}
        {filteredGlossary.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 italic">
            No terms found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
