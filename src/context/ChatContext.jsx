import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('electiq_chat');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('electiq_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('electiq_chat');
  };

  const value = {
    chatHistory,
    setChatHistory,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearHistory
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
