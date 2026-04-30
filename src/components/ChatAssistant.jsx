import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  X,
  Sparkles,
  Brain,
  Trash2,
  MessageCircle,
  Send,
  User,
  Volume2,
  Square,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useElection } from "../context/ElectionContext";
import { useChat } from "../context/ChatContext";
import { askGemini } from "../api/gemini";
import { logEvent } from "firebase/analytics";
import { analytics, perf } from "../lib/firebase";
import { checklistData } from "./VoterChecklist";


import DOMPurify from "dompurify";

const ChatAssistant = () => {
  const { country, currentPhase, role, checklist } = useElection();
  const {
    chatHistory,
    setChatHistory,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearHistory,
  } = useChat();

  const [input, setInput] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === "function"
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (
      scrollContainerRef.current &&
      typeof scrollContainerRef.current.scrollTo === "function"
    ) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading, displayedText]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const typeText = useCallback((fullText, onComplete) => {
    setIsTyping(true);
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      i += 3; // Faster typing for better UX
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        onComplete();
      }
    }, 10);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e, forcedInput = null) => {
    if (e) e.preventDefault();
    const finalInput = forcedInput || input.trim();
    if (!finalInput || isLoading) return;

    const userMessage = { role: "user", content: finalInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const items = checklistData[country] || [];
      const completedItems = items
        .filter((i) => checklist[i.id])
        .map((i) => i.text);
      const remainingItems = items
        .filter((i) => !checklist[i.id])
        .map((i) => i.text);

      const contextData = {
        country,
        currentPhase,
        role,
        checklist: { completed: completedItems, remaining: remainingItems },
      };

      const trace = perf ? perf.trace("ai_response_time") : null;
      if (trace) trace.start();

      if (analytics) {
        logEvent(analytics, "ai_question_asked", {
          question_length: finalInput.length,
          country,
          phase: currentPhase,
        });
      }

      const response = await askGemini(finalInput, contextData, chatHistory);

      if (trace) trace.stop();

      typeText(response, () => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "bot",
            content: response,
            timestamp: new Date().toISOString(),
          },
        ]);
      });
    } catch (err) {
      const msg = err?.message || "";
      if (
        msg.includes("429") ||
        msg.includes("Quota") ||
        msg.includes("quota")
      ) {
        setError("API quota exhausted. Please wait a minute and try again.");
      } else if (msg.includes("API key") || msg.includes("403")) {
        setError("Invalid API key. Check your .env configuration.");
      } else {
        setError("Connection lost. Please try again.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleELI5 = () => {
    const eli5Prompt = `Explain the ${currentPhase} phase in ${country} to me like I'm 10 years old. Keep it very simple and use analogies.`;
    handleSubmit(null, eli5Prompt);
  };

  const handleSpeech = (text, index) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const getSourceLinks = (content) => {
    const sources = [];
    const lowerContent = content.toLowerCase();
    if (country.toLowerCase() === "india") {
      if (lowerContent.includes("register") || lowerContent.includes("voter")) {
        sources.push({
          label: "Voter Service Portal",
          url: "https://voters.eci.gov.in",
        });
      }
      if (
        lowerContent.includes("candidate") ||
        lowerContent.includes("affidavit")
      ) {
        sources.push({
          label: "ECI Affidavits",
          url: "https://affidavit.eci.gov.in",
        });
      }
    } else {
      if (lowerContent.includes("register") || lowerContent.includes("vote")) {
        sources.push({ label: "Vote.gov", url: "https://vote.gov" });
      }
      if (lowerContent.includes("electoral")) {
        sources.push({
          label: "National Archives",
          url: "https://www.archives.gov/electoral-college",
        });
      }
    }
    return sources;
  };

  return (
    <div className="flex flex-col h-[650px] bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-premium relative">
      {/* Toast Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20 shadow-2xl backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:bg-red-400/20 p-1 rounded-md transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-dark-border bg-dark-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-purple" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              ElectIQ AI
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {country} Intelligence Active
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleELI5}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent-purple/10 hover:bg-accent-purple/20 border border-accent-purple/30 rounded-lg text-[10px] font-bold text-accent-purple transition-all"
            title="Explain Like I'm 10"
            aria-label="Explain current phase like I'm 10 years old"
          >
            <Brain className="w-3 h-3" /> ELI5
          </button>
          <button
            onClick={clearHistory}
            className="p-2 text-text-muted hover:text-white transition-colors"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.03),transparent)]"
      >
        {chatHistory.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-dark-card border border-dark-border rounded-2xl flex items-center justify-center mb-6 shadow-premium">
              <MessageCircle className="w-8 h-8 text-text-muted" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 font-display">
              How can I guide you?
            </h4>
            <p className="text-sm text-text-muted max-w-xs mx-auto">
              Ask about registration deadlines, candidate rules, or voting
              procedures in {country.charAt(0).toUpperCase() + country.slice(1)}
              .
            </p>
            <div className="flex flex-col gap-3 mt-8 w-full max-w-sm">
              {[
                "What are the rules for campaigning?",
                "How do I check my polling booth?",
                "Explain the counting process",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSubmit(null, q)}
                  className="px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-xs text-text-primary hover:border-accent-purple/50 hover:bg-accent-purple/5 transition-all w-full text-left flex justify-between items-center group"
                >
                  {q}
                  <Send className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-accent-purple"
                      : "bg-dark-card border border-dark-border"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-accent-purple" />
                  )}
                </div>
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-premium ${
                      msg.role === "user"
                        ? "bg-accent-purple text-white rounded-tr-sm"
                        : "bg-dark-card text-text-primary border border-dark-border rounded-tl-sm"
                    }`}
                  >
                    <article className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="m-0 mb-3 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="m-0 mb-3 list-disc list-inside space-y-1">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="m-0">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-white font-bold">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {DOMPurify.sanitize(msg.content)}
                      </ReactMarkdown>
                    </article>
                  </div>

                  {msg.role === "bot" && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between gap-4 px-2"
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSpeech(msg.content, i)}
                          className={`p-1 rounded transition-colors ${speakingIndex === i ? "text-accent-purple bg-accent-purple/10" : "text-text-muted hover:text-white hover:bg-white/10"}`}
                          title={
                            speakingIndex === i ? "Stop speaking" : "Read aloud"
                          }
                          aria-label={
                            speakingIndex === i
                              ? "Stop speaking"
                              : "Read message aloud"
                          }
                        >
                          {speakingIndex === i ? (
                            <Square className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          className="text-text-muted hover:text-accent-green transition-colors p-1 rounded hover:bg-accent-green/10"
                          title="Helpful"
                          aria-label="Mark message as helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          className="text-text-muted hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
                          title="Not helpful"
                          aria-label="Mark message as not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>

                      {getSourceLinks(msg.content).length > 0 && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3 h-3 text-accent-purple" />
                          {getSourceLinks(msg.content).map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-accent-purple hover:underline"
                            >
                              {s.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-purple" />
              </div>
              <div className="p-4 rounded-2xl bg-dark-card text-text-primary border border-dark-border rounded-tl-sm text-sm">
                <article className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {DOMPurify.sanitize(displayedText)}
                  </ReactMarkdown>
                </article>
                <span className="inline-block w-1 h-4 bg-accent-purple ml-1 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {isLoading && !isTyping && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-dark-card border border-dark-border flex gap-2">
              <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-dark-card/50 border-t border-dark-border mt-auto"
      >
        <div className="relative flex items-center gap-3 bg-dark-surface border border-dark-border rounded-xl p-2 focus-within:border-accent-purple transition-all shadow-premium">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent border-none py-2 px-3 focus:outline-none text-white text-sm placeholder:text-text-muted"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-accent-purple hover:bg-accent-purple/80 disabled:bg-dark-border text-white rounded-lg flex items-center justify-center transition-all active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAssistant;
