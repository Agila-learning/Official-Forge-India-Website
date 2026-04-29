import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  MessageCircle, X, Send, Image, Video, Mic, MicOff,
  Search, ChevronLeft, Phone, MoreVertical, Smile, Paperclip,
  Volume2, Check, CheckCheck, Loader2, ChevronDown, Trash2, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

let socket = null;

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : window.location.origin;

const getInitials = (user) => {
  if (!user) return '?';
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
};

const getRoleBadge = (role) => {
  const map = {
    Admin: 'bg-red-500',
    'Sub-Admin': 'bg-orange-500',
    Vendor: 'bg-blue-500',
    HR: 'bg-purple-500',
    'Delivery Partner': 'bg-green-500',
    Candidate: 'bg-yellow-500',
    Customer: 'bg-zinc-500',
  };
  return map[role] || 'bg-zinc-500';
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWidget = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const token = localStorage.getItem('token');

  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tab, setTab] = useState('threads'); // 'threads' | 'contacts'
  const [showRedirectMenu, setShowRedirectMenu] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleEditMessage = async (msgId) => {
    if (!editContent.trim()) return;
    try {
      await api.put(`/${msgId}`, { messageId: msgId, content: editContent });
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, content: editContent, isEdited: true } : m));
      setEditingMsgId(null);
      setEditContent('');
      toast.success('Message updated');
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/${msgId}`);
      setMessages(prev => prev.filter(m => m._id !== msgId));
      toast.success('Message deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const endRef = useRef(null);
  const typingTimeout = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // Initialize socket
  useEffect(() => {
    if (!userInfo?._id || !token) return;

    if (!socket) {
      socket = io(SOCKET_URL, { 
        auth: { token }
      });

      socket.on('connect', () => {
        socket.emit('user-online', userInfo._id);
        console.log('Chat/Notification Node Online');
      });

      socket.on('notification', ({ userId, notification }) => {
        if (userId === userInfo?._id) {
          toast.success(`${notification.title}: ${notification.message}`, {
            duration: 6000,
            icon: '🏢',
            style: { borderRadius: '20px', background: '#0a66c2', color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }
          });
          setUnreadCount(prev => prev + 1);
        }
      });

      socket.on('receive-message', (msg) => {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        if (!isOpen || activeContact?._id !== msg.sender?._id) {
          setUnreadCount((c) => c + 1);
        }
      });

      socket.on('user-typing', ({ senderId }) => {
        if (activeContact?._id === senderId) setIsTyping(true);
      });

      socket.on('user-stopped-typing', ({ senderId }) => {
        if (activeContact?._id === senderId) setIsTyping(false);
      });

      socket.on('online-users', (users) => setOnlineUsers(users));
    }

    return () => {
      if (socket) {
        socket.off('notification');
        socket.off('receive-message');
        socket.off('user-typing');
        socket.off('user-stopped-typing');
        socket.off('online-users');
      }
    };
  }, [userInfo?._id, token, isOpen, activeContact]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load threads and contacts when widget opens
  useEffect(() => {
    if (!isOpen || !token) return;
    setUnreadCount(0);
    const fetchData = async () => {
      try {
        const [threadsRes, contactsRes] = await Promise.all([
          api.get('/chat/threads'),
          api.get('/chat/contacts'),
        ]);
        setThreads(threadsRes.data);
        setContacts(contactsRes.data);
        // If no threads, show contacts by default to avoid "empty" look
        if (threadsRes.data.length === 0 && contactsRes.data.length > 0) {
            setTab('contacts');
        }
      } catch (err) {
          console.error('Chat load error:', err);
      }
    };
    fetchData();
  }, [isOpen, token]);

  // Load messages for active contact
  useEffect(() => {
    if (!activeContact || !token) return;
    setLoading(true);
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${activeContact._id}`);
        setMessages(data);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [activeContact, token]);

  const sendMessage = useCallback(
    async ({ type = 'text', content = inputText.trim(), fileUrl } = {}) => {
      if (!content && !fileUrl) return;
      if (!socket || !activeContact) return;

      socket.emit('private-message', {
        senderId: userInfo._id,
        receiverId: activeContact._id,
        content: content || '',
        messageType: type,
        fileUrl,
      });

      if (type === 'text') setInputText('');
    },
    [inputText, activeContact, userInfo?._id]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Typing indicator
    socket?.emit('typing', { senderId: userInfo._id, receiverId: activeContact?._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit('stop-typing', { senderId: userInfo._id, receiverId: activeContact?._id });
    }, 1500);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = data.startsWith('/') ? `http://localhost:5000${data}` : data;
      sendMessage({ type, content: '', fileUrl: url });
    } catch (_) {}
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks.current = [];
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
        mediaRecorder.current.onstop = async () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const fd = new FormData();
          fd.append('file', blob, 'voice-note.webm');
          try {
            const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const url = data.startsWith('/') ? `http://localhost:5000${data}` : data;
            sendMessage({ type: 'voice', content: '🎤 Voice Message', fileUrl: url });
          } catch (_) {}
          stream.getTracks().forEach((t) => t.stop());
        };
        mediaRecorder.current.start();
        setIsRecording(true);
      } catch (_) {}
    }
  };

  if (!userInfo || !token) return null;

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.businessName || ''} ${c.companyName || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-10 right-10 md:bottom-12 md:right-12 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20"
        aria-label="Open Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageCircle size={26} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-primary">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-32 right-10 md:right-12 z-50 w-[380px] max-w-[95vw] h-[560px] max-h-[80vh] bg-[#0a0f1e] border border-white/10 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
          >
            {!activeContact ? (
              /* ─── THREAD / CONTACTS LIST ───────────────────────────────────── */
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="font-black text-white text-lg">Messages</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {onlineUsers.length} online
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {userInfo?.role !== 'Admin' && (
                      <button
                        onClick={async () => {
                          const { data: contacts } = await api.get('/chat/contacts');
                          const admin = contacts.find(c => c.role === 'Admin');
                          if (admin) setActiveContact(admin);
                        }}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all"
                      >
                        Help Desk
                      </button>
                    )}
                    <button
                      onClick={() => setTab(tab === 'threads' ? 'contacts' : 'threads')}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                    >
                      {tab === 'threads' ? 'New Chat' : 'Chats'}
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="px-4 py-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm text-white placeholder-zinc-600 outline-none focus:border-primary/40 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                  {tab === 'threads' ? (
                    threads.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center px-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={32} className="opacity-30" />
                        </div>
                        <p className="text-sm font-black text-white uppercase tracking-tighter mb-2">No active threads</p>
                        <p className="text-[10px] font-medium text-zinc-500 mb-6">Start a new conversation with our experts or partners.</p>
                        <button 
                            onClick={() => setTab('contacts')}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                            Start New Chat
                        </button>
                      </div>
                    ) : (
                      threads.map((thread, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveContact(thread.partner)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                        >
                          <div className={`relative w-11 h-11 rounded-full ${getRoleBadge(thread.partner?.role)} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                            {getInitials(thread.partner)}
                            {onlineUsers.includes(thread.partner?._id) && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0f1e]"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="text-sm font-black text-white truncate">
                                {thread.partner?.firstName} {thread.partner?.lastName}
                              </p>
                              <p className="text-[10px] text-zinc-600 shrink-0 ml-2">
                                {formatTime(thread.lastMessage?.createdAt)}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-500 truncate font-medium">
                              {thread.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                          {thread.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-primary rounded-full text-[10px] font-black text-white flex items-center justify-center shrink-0">
                              {thread.unreadCount}
                            </span>
                          )}
                        </button>
                      ))
                    )
                  ) : (
                    filteredContacts.map((contact) => (
                      <button
                        key={contact._id}
                        onClick={() => { setActiveContact(contact); setTab('threads'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left"
                      >
                        <div className={`relative w-11 h-11 rounded-full ${getRoleBadge(contact.role)} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                          {getInitials(contact)}
                          {onlineUsers.includes(contact._id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0f1e]"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white">{contact.firstName} {contact.lastName}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{contact.role}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* ─── MESSAGE THREAD ────────────────────────────────────────────── */
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <button
                    onClick={() => { setActiveContact(null); setMessages([]); }}
                    className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className={`w-10 h-10 rounded-full ${getRoleBadge(activeContact.role)} flex items-center justify-center text-white font-black text-sm relative shrink-0`}>
                    {getInitials(activeContact)}
                    {onlineUsers.includes(activeContact._id) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0f1e]"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm">{activeContact.firstName} {activeContact.lastName}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {isTyping ? <span className="text-primary animate-pulse">Typing...</span> : (onlineUsers.includes(activeContact._id) ? <span className="text-green-400">Online</span> : activeContact.role)}
                    </p>
                  </div>
                  {(userInfo.role === 'Admin' || userInfo.role === 'Sub-Admin') && (
                    <div className="relative">
                      <button 
                        onClick={() => setShowRedirectMenu(!showRedirectMenu)}
                        className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                         Redirect <ChevronDown size={14} />
                      </button>
                      
                      <AnimatePresence>
                        {showRedirectMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-48 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden"
                          >
                             <div className="p-3 border-b border-white/5 bg-white/5">
                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Forward to Team Member</p>
                             </div>
                             <div className="max-h-48 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                {contacts.filter(c => ['HR', 'Vendor'].includes(c.role)).map(team => (
                                  <button 
                                    key={team._id}
                                    onClick={async () => {
                                      const transcript = messages.slice(-5).map(m => `${m.sender.firstName}: ${m.content}`).join('\n');
                                      const content = `[FORWARDED SUPPORT SESSION]\nCustomer: ${activeContact.firstName} ${activeContact.lastName}\nEmail: ${activeContact.email}\nContext:\n${transcript}\n\nPlease take over this inquiry.`;
                                      
                                      socket.emit('private-message', {
                                        senderId: userInfo._id,
                                        receiverId: team._id,
                                        content: content,
                                        messageType: 'text'
                                      });
                                      
                                      toast.success(`Redirected to ${team.firstName} (${team.role})`);
                                      setShowRedirectMenu(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-white/5 rounded-xl transition-all"
                                  >
                                    <p className="text-xs font-bold text-white truncate">{team.firstName} {team.lastName}</p>
                                    <p className="text-[9px] font-black text-primary/60 uppercase">{team.role}</p>
                                  </button>
                                ))}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-sm">
                      <MessageCircle size={32} className="mb-3 opacity-30" />
                      <p className="font-bold">Start the conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = (msg.sender?._id || msg.sender) === userInfo._id;
                      return (
                        <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            {msg.messageType === 'image' && msg.fileUrl && (
                              <img src={msg.fileUrl} alt="img" className="rounded-2xl max-h-48 object-cover border border-white/10" />
                            )}
                            {msg.messageType === 'video' && msg.fileUrl && (
                              <video src={msg.fileUrl} controls className="rounded-2xl max-h-48 border border-white/10" />
                            )}
                            {msg.messageType === 'voice' && msg.fileUrl && (
                              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${isMine ? 'bg-primary' : 'bg-white/10'}`}>
                                <Volume2 size={16} className="shrink-0" />
                                <audio controls src={msg.fileUrl} className="h-8 max-w-[150px]" />
                              </div>
                            )}
                            {msg.content && (
                              <div className="group relative">
                                {editingMsgId === msg._id ? (
                                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-primary/30">
                                    <input 
                                      value={editContent} 
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="bg-transparent text-sm text-white outline-none min-w-[150px]"
                                      autoFocus
                                      onKeyDown={(e) => e.key === 'Enter' && handleEditMessage(msg._id)}
                                    />
                                    <button onClick={() => handleEditMessage(msg._id)} className="p-1 hover:text-primary"><Check size={14}/></button>
                                    <button onClick={() => setEditingMsgId(null)} className="p-1 hover:text-red-500"><X size={14}/></button>
                                  </div>
                                ) : (
                                  <>
                                    <div
                                      className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                        isMine
                                          ? 'bg-primary text-white rounded-br-md'
                                          : 'bg-white/10 text-white rounded-bl-md'
                                      }`}
                                    >
                                      {msg.content}
                                      {msg.isEdited && <span className="text-[8px] opacity-40 ml-2 italic">(edited)</span>}
                                    </div>
                                    {isMine && (
                                      <div className="absolute top-0 -left-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                        <button onClick={() => { setEditingMsgId(msg._id); setEditContent(msg.content); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"><Edit2 size={12}/></button>
                                        <button onClick={() => handleDeleteMessage(msg._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            <div className={`flex items-center gap-1.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                              <p className="text-[10px] text-zinc-600 font-bold">{formatTime(msg.createdAt)}</p>
                              {isMine && (
                                msg.isRead
                                  ? <CheckCheck size={12} className="text-primary" />
                                  : <Check size={12} className="text-zinc-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                <div className="px-4 pb-4 pt-3 border-t border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    {/* File Upload */}
                    <label className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-500 hover:text-white transition-all cursor-pointer shrink-0" title="Send Image">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                      <Image size={18} />
                    </label>

                    <label className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-500 hover:text-white transition-all cursor-pointer shrink-0" title="Send Video">
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                      <Video size={18} />
                    </label>

                    <button
                      onClick={toggleRecording}
                      className={`p-2.5 rounded-xl transition-all shrink-0 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-white/10 text-zinc-500 hover:text-white'}`}
                      title={isRecording ? 'Stop Recording' : 'Voice Message'}
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-primary/40 transition-all font-medium"
                    />

                    <button
                      disabled={!inputText.trim()}
                      onClick={() => sendMessage()}
                      className="p-2.5 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
