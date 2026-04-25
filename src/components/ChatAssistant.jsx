import { useState, useRef, useEffect } from 'react';
import { useElection } from '../context/ElectionContext';
import { askGemini } from '../api/gemini';
import { Send, User, Bot, Sparkles, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatMessageSkeleton } from './Skeleton';

const ChatAssistant = () => {
  const { country, currentPhase, role, chatHistory, setChatHistory } = useElection();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await askGemini(input, { country, currentPhase, role });
      const botMessage = { role: 'bot', content: response };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Sorry, I encountered an error. Please check your connection or try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="flex flex-col h-[700px] bg-navy-dark/40 rounded-[32px] border border-white/5 overflow-hidden relative group">
      {/* Gemini-style Gradient Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-gold opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-navy-dark/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-gold rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-navy animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-base font-heading text-white">ElectIQ AI</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Model 1.5 Flash</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{country} Expert</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/5"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-gradient-to-b from-white/5 to-transparent rounded-3xl flex items-center justify-center mb-6 border border-white/5"
            >
              <Bot className="w-10 h-10 text-slate-600" />
            </motion.div>
            <h4 className="text-2xl font-bold mb-4 font-heading bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
              How can I help you today?
            </h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              I can explain complex voting laws, analyze candidate requirements, or guide you through the election timeline in {country}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['Registration rules', 'Voting dates', 'ID requirements'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gold text-navy' 
                    : 'bg-navy-light border border-white/10 text-gold'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`group relative ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-5 rounded-[24px] text-[15px] leading-relaxed transition-all ${
                    msg.role === 'user' 
                      ? 'bg-gold text-navy font-medium rounded-tr-none shadow-xl shadow-gold/10' 
                      : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none hover:bg-white/[0.08]'
                  }`}>
                    <article className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="m-0 mb-3 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="m-0 mb-3 list-disc list-inside space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="m-0">{children}</li>,
                          strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </article>
                  </div>
                  <div className={`mt-2 flex items-center gap-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.role === 'user' ? 'You' : 'ElectIQ'}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-navy-light border border-white/10 flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div className="space-y-3">
                <div className="w-48 h-10 bg-white/5 rounded-2xl rounded-tl-none animate-pulse"></div>
                <div className="w-32 h-3 bg-white/5 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Gemini Style Floating */}
      <div className="p-6 bg-gradient-to-t from-navy-dark to-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-gold rounded-[24px] blur opacity-10 group-focus-within:opacity-30 transition-opacity"></div>
            <div className="relative bg-navy border border-white/10 rounded-[22px] flex items-center gap-3 p-2 focus-within:border-gold/50 transition-all shadow-2xl">
              <button 
                type="button" 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Add file"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message...`}
                aria-label="Ask a question about the election"
                className="flex-grow bg-transparent border-none py-3 px-2 focus:outline-none text-slate-200 text-sm placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 bg-white text-navy disabled:bg-slate-800 disabled:text-slate-600 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-600 font-medium">
            ElectIQ may display inaccurate info. Please verify with official sources.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
