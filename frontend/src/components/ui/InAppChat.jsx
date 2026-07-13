import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, ShieldAlert, Check, CheckCheck, Mic, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Quick Replies
const QUICK_REPLIES = {
  customer: ["I'm on the way", "Please wait 2 minutes", "Traffic ahead", "Please share your exact location"],
  driver: ["I've reached your pickup location", "I'm 2 minutes away", "Ride completed. Thank you!", "Stuck in traffic"]
};

const InAppChat = ({ isOpen, onClose, userRole = 'customer', receiverName = 'Driver', receiverPhone = '+91 9876543210' }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, I have accepted your ride request.", sender: 'other', time: '10:00 AM', status: 'read' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate status update
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 1000);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
    }, 2500);
    
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Okay, got it.",
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    }, 4000);
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 md:left-auto md:right-8 w-full md:w-[400px] h-[85vh] md:h-[600px] bg-white dark:bg-[#15171A] rounded-t-3xl md:rounded-t-3xl shadow-2xl z-[120] border border-gray-100 dark:border-white/5 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-50 dark:bg-[#1A1D21] p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-black text-blue-600">
              {receiverName.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-sm">{receiverName}</h3>
              <p className="text-[10px] uppercase tracking-widest text-green-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.href = `tel:${receiverPhone}`} className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors">
              <Phone size={14} />
            </button>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-2 text-center border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-center gap-2">
          <ShieldAlert size={12} className="text-blue-600" />
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">End-to-End Encrypted Chat</span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#0A0B0D]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold shadow-sm ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-gray-100 dark:bg-[#1A1D21] text-gray-900 dark:text-white rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase">{msg.time}</span>
                {msg.sender === 'me' && (
                  msg.status === 'sent' ? <Check size={10} className="text-gray-400" /> :
                  msg.status === 'delivered' ? <CheckCheck size={10} className="text-gray-400" /> :
                  <CheckCheck size={10} className="text-blue-500" />
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-3 bg-gray-50 dark:bg-[#1A1D21] border-t border-gray-100 dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar">
          {(QUICK_REPLIES[userRole] || QUICK_REPLIES.customer).map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(reply)}
              className="px-3 py-1.5 bg-white dark:bg-[#0A0B0D] border border-gray-200 dark:border-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#15171A] border-t border-gray-100 dark:border-gray-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} 
            className="flex items-center gap-2 relative"
          >
            <button type="button" className="w-10 h-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl flex items-center justify-center transition-colors">
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 dark:bg-[#1A1D21] border-none rounded-full py-3 px-4 outline-none focus:ring-2 ring-blue-500/20 text-sm font-bold text-gray-900 dark:text-white"
            />
            {input.trim() ? (
              <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0">
                <Send size={16} className="ml-1" />
              </button>
            ) : (
              <button type="button" onClick={() => toast("Voice notes coming soon!", { icon: "🎤" })} className="w-10 h-10 bg-gray-100 dark:bg-[#1A1D21] text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors shrink-0">
                <Mic size={18} />
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InAppChat;
