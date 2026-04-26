import { ExternalLink, BookOpen, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sources = [
  {
    country: 'India',
    icon: '🇮🇳',
    items: [
      { name: 'Election Commission of India (ECI)', url: 'https://eci.gov.in', desc: 'Official election authority — schedules, results, and voter registration.' },
      { name: 'Voter Service Portal', url: 'https://voters.eci.gov.in', desc: 'Check voter registration, download e-EPIC, and find polling stations.' },
      { name: 'Know Your Candidate', url: 'https://affidavit.eci.gov.in', desc: 'View candidate affidavits — criminal records, assets, and education.' },
      { name: 'cVIGIL App', url: 'https://cvigil.eci.gov.in', desc: 'Report Model Code of Conduct violations with photo/video evidence.' },
      { name: 'ECI Results Portal', url: 'https://results.eci.gov.in', desc: 'Live and historical election results, constituency-wise.' },
      { name: 'Constitution of India', url: 'https://legislative.gov.in/constitution-of-india', desc: 'Full text of the Constitution including electoral provisions (Articles 324-329).' },
    ]
  },
  {
    country: 'United States',
    icon: '🇺🇸',
    items: [
      { name: 'Vote.gov', url: 'https://vote.gov', desc: 'Official U.S. government resource for voter registration and state-specific information.' },
      { name: 'USA.gov — Voting', url: 'https://www.usa.gov/register-to-vote', desc: 'Federal guide to registering, finding polling places, and understanding your ballot.' },
      { name: 'Ballotpedia', url: 'https://ballotpedia.org', desc: 'Non-partisan encyclopedia of American politics — candidates, ballot measures, and election data.' },
      { name: 'Federal Election Commission (FEC)', url: 'https://www.fec.gov', desc: 'Campaign finance data, contribution limits, and political committee filings.' },
      { name: 'National Archives — Electoral College', url: 'https://www.archives.gov/electoral-college', desc: 'Official Electoral College information, historical results, and constitutional provisions.' },
      { name: 'National Association of Secretaries of State', url: 'https://www.nass.org/can-i-vote', desc: 'State-by-state voting rules, ID requirements, and absentee ballot information.' },
    ]
  }
];

const Sources = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-accent-purple text-sm font-bold mb-3">
          <BookOpen className="w-4 h-4" />
          Transparency
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tighter font-display">
          Our Sources
        </h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Every fact in ElectIQ is sourced from official government election commissions and non-partisan organizations. We link directly so you can verify.
        </p>
      </header>

      <div className="flex items-center gap-3 p-4 bg-accent-green/5 border border-accent-green/10 rounded-2xl mb-12">
        <Shield className="w-5 h-5 text-accent-green shrink-0" />
        <p className="text-sm text-accent-green/90 font-medium">
          ElectIQ never expresses political opinions or recommends candidates. All data is factual and sourced from official bodies.
        </p>
      </div>

      <div className="space-y-12">
        {sources.map((section, sIdx) => (
          <motion.div 
            key={section.country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">{section.country}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {section.items.map((source, i) => (
                <motion.a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.1 + i * 0.05 }}
                  className="group p-5 bg-dark-card border border-dark-border rounded-2xl hover:border-accent-purple/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">{source.name}</h3>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5 group-hover:text-accent-purple transition-colors" />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{source.desc}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-text-muted mb-6">
          Know a source we should include? Have a correction?
        </p>
        <Link 
          to="/ask"
          className="inline-flex items-center gap-2 bg-accent-purple text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-all shadow-premium"
        >
          Ask Our AI
        </Link>
      </div>
    </div>
  );
};

export default Sources;
