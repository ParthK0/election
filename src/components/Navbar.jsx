import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "focus-trap-react";
import {
  Shield,
  Menu,
  X,
  ChevronDown,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useElection } from "../context/ElectionContext";
import { useAuth } from "../context/AuthContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";
import CountrySelector from "./CountrySelector";

const Navbar = () => {
  const location = useLocation();
  const { country, role, setRole } = useElection();
  const { user, logout, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleDropdownRef = useRef(null);

  // Close role dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(e.target)
      ) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsMenuOpen(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleRoleSwitch = (newRole) => {
    if (analytics) {
      logEvent(analytics, "role_switched", {
        from_role: role,
        to_role: newRole,
        country,
      });
    }
    setRole(newRole);
    setIsRoleDropdownOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
    { name: "AI Ask", path: "/ask" },
    { name: "Glossary", path: "/glossary" },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[200] bg-accent-purple text-white px-4 py-2 rounded-xl text-sm font-bold shadow-premium"
      >
        Skip to main content
      </a>
      <nav
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-300 pointer-events-none ${isScrolled ? "py-3 bg-dark-surface/80 backdrop-blur-2xl border-b border-dark-border/50 shadow-2xl" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group w-[200px]">
            <div className="w-10 h-10 bg-accent-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:rotate-12 transition-transform duration-500">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white font-display tracking-tight">
              ElectIQ
            </span>
          </Link>

          {/* Navigation Pill — Desktop Only */}
          <div
            aria-label="Desktop Navigation Links"
            className="hidden lg:flex items-center mx-auto bg-dark-card/60 backdrop-blur-2xl border border-dark-border p-1.5 rounded-full shadow-2xl"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isActive ? "text-white" : "text-text-muted hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-bg"
                      className="absolute inset-0 bg-accent-purple rounded-full -z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-end gap-3 w-[280px]">
            <div className="hidden sm:flex items-center gap-2">
              {/* Country Selector embedded */}
              <div className="border-r border-dark-border pr-2">
                <CountrySelector />
              </div>

              {/* Role Dropdown */}
              <div className="flex items-center gap-1">
                <div className="relative" ref={roleDropdownRef}>
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-card/40 border border-dark-border rounded-full backdrop-blur-md hover:border-accent-purple/30 transition-all"
                  >
                    <span className="text-[9px] font-bold text-white/80 tracking-widest uppercase">
                      Viewing as:{" "}
                      <span className="text-white capitalize">{role}</span>
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-white/60 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isRoleDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-32 bg-dark-card border border-dark-border rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50"
                      >
                        <button
                          onClick={() => handleRoleSwitch("voter")}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-widest ${role === "voter" ? "bg-accent-purple/10 text-accent-purple" : "text-white hover:bg-dark-card-2"}`}
                        >
                          Voter
                        </button>
                        <button
                          onClick={() => handleRoleSwitch("candidate")}
                          className={`w-full text-left mt-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-widest ${role === "candidate" ? "bg-accent-purple/10 text-accent-purple" : "text-white hover:bg-dark-card-2"}`}
                        >
                          Candidate
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("open-preferences"))
                  }
                  className="p-1.5 text-text-muted hover:text-white hover:bg-dark-card rounded-full transition-colors"
                  title="Preferences"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Auth Button */}
            <div className="hidden md:block border-l border-dark-border pl-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-purple/20 flex items-center justify-center border border-accent-purple/40">
                      <User className="w-3 h-3 text-accent-purple" />
                    </div>
                    <span className="text-[10px] font-bold text-white capitalize">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-text-muted hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="px-4 py-1.5 bg-accent-purple text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent-purple/80 transition-colors shadow-premium"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-dark-card/60 backdrop-blur-xl border border-dark-border rounded-xl transition-all hover:border-accent-purple/30"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <FocusTrap active={isMenuOpen}>
              <motion.div
                id="mobile-menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] bg-dark-surface border-l border-dark-border z-[102] lg:hidden flex flex-col"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                      <Shield className="text-white w-4 h-4" />
                    </div>
                    <span className="text-base font-extrabold text-white font-display tracking-tight">
                      ElectIQ
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav
                  aria-label="Mobile Navigation Links"
                  className="flex-1 p-6 space-y-2"
                >
                  {navItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            isActive
                              ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                              : "text-text-primary hover:bg-dark-card hover:text-white"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/quiz"
                      className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        location.pathname === "/quiz"
                          ? "bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                          : "text-text-primary hover:bg-dark-card hover:text-white"
                      }`}
                    >
                      Quiz
                    </Link>
                  </motion.div>
                </nav>

                {/* Drawer Footer */}
                <div className="p-6 border-t border-dark-border space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-dark-card rounded-xl border border-dark-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      {country} LIVE
                    </span>
                  </div>
                </div>
              </motion.div>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
