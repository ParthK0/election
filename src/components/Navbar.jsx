import { Link, useLocation } from 'react-router-dom';
import { Vote, BookOpen, MessageSquare, List } from 'lucide-react';
import { motion } from 'framer-motion';

import CountrySelector from './CountrySelector';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Vote },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Ask', path: '/ask', icon: MessageSquare },
    { name: 'Glossary', path: '/glossary', icon: List },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
          <Vote className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          ElectionGuide <span className="text-blue-500">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/5 rounded-lg border border-white/10"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <CountrySelector />
        </div>
        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
        <Link 
          to="/learn"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
