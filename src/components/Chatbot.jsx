import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "System initialized. I am Subkill AI. Query me for insights.", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: userMsg });
      setTimeout(() => {
        setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Connection severed. Check backend status.", sender: 'bot' }]);
        setIsTyping(false);
      }, 600);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-80 h-[450px] bg-bg-panel border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-6 backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-4 text-white bg-black/50 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-electric-green to-transparent opacity-50"></div>
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-electric-green/20 rounded-lg">
                  <Bot size={18} className="text-electric-green" />
                </div>
                <span className="font-bold tracking-widest text-sm uppercase">Subkill AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-light-red transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] font-medium leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-neon-blue to-blue-500 text-black rounded-br-none shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                      : 'bg-black/60 border border-white/5 text-gray-200 rounded-bl-none shadow-inner'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-5 py-4 bg-black/60 border border-white/5 rounded-2xl rounded-bl-none flex space-x-1.5 items-center object-contain">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-electric-green rounded-full shadow-[0_0_5px_rgba(0,255,159,1)]"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-electric-green rounded-full shadow-[0_0_5px_rgba(0,255,159,1)]"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-electric-green rounded-full shadow-[0_0_5px_rgba(0,255,159,1)]"></motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-black/50 border-t border-white/10 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter query..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-electric-green focus:bg-white/10 transition-colors placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                className="ml-2 w-10 h-10 flex items-center justify-center bg-electric-green text-black rounded-full hover:shadow-[0_0_15px_rgba(0,255,159,0.5)] transition-all disabled:opacity-50 disabled:hover:shadow-none"
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-4 bg-bg-panel border border-white/10 text-electric-green rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(0,255,159,0.4)] hover:border-electric-green/50 transition-all relative group"
        >
          <MessageSquare size={28} />
          {/* Unread indicator */}
          <span className="absolute top-0 right-1 flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-neon-blue"></span>
            <span className="relative inline-flex w-3 h-3 rounded-full bg-neon-blue"></span>
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;
