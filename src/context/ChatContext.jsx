import { createContext, useState, useEffect } from "react";

/**
 * @typedef {Object} ChatMessage
 * @property {string} role - The role of the message sender ('user' or 'bot').
 * @property {string} content - The content of the message.
 */

/**
 * @typedef {Object} ChatContextType
 * @property {ChatMessage[]} chatHistory - The list of chat messages.
 * @property {function} setChatHistory - Function to update chat history.
 * @property {boolean} isLoading - Loading state for AI responses.
 * @property {function} setIsLoading - Function to set loading state.
 * @property {string|null} error - Error message if any.
 * @property {function} setError - Function to set error message.
 * @property {function} clearHistory - Function to clear chat history.
 */

export const ChatContext = createContext();

// Hook moved to src/hooks/useChat.js

/**
 * Provider component for ChatContext.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("electiq_chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const capped = chatHistory.slice(-50);
    localStorage.setItem("electiq_chat", JSON.stringify(capped));
  }, [chatHistory]);

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("electiq_chat");
  };

  const value = {
    chatHistory,
    setChatHistory,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
