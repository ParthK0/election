import { useElection } from "../context/ElectionContext";
import { useState, useMemo } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

const GlossaryItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <details
      className="group bg-dark-card border border-dark-border rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-card-2 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">
            {item.term}
          </h3>
          {item.category && (
            <span className="px-2 py-0.5 bg-accent-purple/10 text-accent-purple text-[9px] font-bold uppercase tracking-widest rounded-md">
              {item.category}
            </span>
          )}
        </div>
        <div className="text-text-muted transform transition-transform group-open:rotate-180">
          ▼
        </div>
      </summary>
      <div className="p-4 pt-0 border-t border-dark-border/50 text-text-muted text-sm leading-relaxed bg-dark-card-2/50">
        <p className="mb-4">{item.definition}</p>
        <GlossaryChip term={item.term} />
      </div>
    </details>
  );
};

const Glossary = () => {
  const { electionData, country } = useElection();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from the data
  const categories = useMemo(() => {
    if (!electionData?.glossary) return ["All"];
    const cats = new Set(
      electionData.glossary.map((item) => item.category).filter(Boolean),
    );
    return ["All", ...Array.from(cats).sort()];
  }, [electionData]);

  const filteredGlossary = useMemo(() => {
    if (!electionData?.glossary) return [];
    return electionData.glossary.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [electionData, search, activeCategory]);

  const groupedGlossary = useMemo(() => {
    return filteredGlossary.reduce((acc, item) => {
      const letter = item.term.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(item);
      return acc;
    }, {});
  }, [filteredGlossary]);

  if (!electionData?.glossary) return null;

  const sortedLetters = Object.keys(groupedGlossary).sort();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10 items-start">
      <Helmet>
        <title>{country.toUpperCase()} Election Glossary | ElectIQ</title>
        <meta
          name="description"
          content={`Comprehensive A-Z dictionary of electoral terminology for ${country}.`}
        />
      </Helmet>
      <div className="flex-grow">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-accent-purple text-sm font-bold mb-3">
            <Book className="w-4 h-4" />
            Reference
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tighter font-display">
            Election Glossary
          </h1>
          <p className="text-text-muted max-w-xl text-sm leading-relaxed">
            Electoral terminology for{" "}
            {country.charAt(0).toUpperCase() + country.slice(1)}. Click "Ask AI"
            on any term for a detailed explanation.
          </p>
        </header>

        {/* Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (analytics && e.target.value.length > 2) {
                  logEvent(analytics, "glossary_term_searched", {
                    query: e.target.value,
                    results_count: filteredGlossary.length,
                  });
                }
              }}
              placeholder="Search terms..."
              className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent-purple/40 text-white text-sm transition-colors shadow-premium"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-text-muted shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-accent-purple text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                    : "bg-dark-card border border-dark-border text-text-muted hover:border-accent-purple/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-text-muted mb-6 font-mono">
          {filteredGlossary.length}{" "}
          {filteredGlossary.length === 1 ? "term" : "terms"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        {/* Glossary List */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {sortedLetters.map((letter) => (
              <motion.div
                key={letter}
                id={`letter-${letter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-black text-white">{letter}</h2>
                  <div className="h-px bg-dark-border flex-grow" />
                </div>
                <div className="space-y-3">
                  {groupedGlossary[letter].map((item) => (
                    <GlossaryItem key={item.term} item={item} />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredGlossary.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-text-muted text-sm mb-2">
                No terms found matching "{search}"
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-accent-purple text-xs font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky A-Z Sidebar */}
      <div className="hidden md:flex sticky top-24 shrink-0 bg-dark-card border border-dark-border rounded-2xl p-4 shadow-premium">
        <div className="flex flex-col gap-1">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-center mb-2">
            Index
          </p>
          {alphabet.map((letter) => {
            const hasTerms = groupedGlossary[letter];
            return (
              <button
                key={letter}
                onClick={() => hasTerms && scrollToLetter(letter)}
                disabled={!hasTerms}
                className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                  hasTerms
                    ? "text-white hover:bg-accent-purple/20 hover:text-accent-purple cursor-pointer"
                    : "opacity-20 text-text-muted cursor-not-allowed"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-dark-border">
          <button className="w-full py-2 bg-dark-card border border-dark-border hover:border-accent-purple/50 rounded-lg text-[10px] font-bold text-text-muted hover:text-white transition-colors">
            Suggest a term
          </button>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
