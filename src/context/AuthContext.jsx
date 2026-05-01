import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Simulate checking for a session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("electiq_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem("electiq_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("electiq_user");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    user,
    login,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
