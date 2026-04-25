import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Users, Paperclip, MoreVertical, Search, CheckCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ChatComponent = ({ initialBatchId = null }) => {
    const [batches, setBatches] = useState([]);
    const [activeBatch, setActiveBatch] = useState(initialBatchId);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (activeBatch) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Poll every 5s for simple real-time
            return () => clearInterval(interval);
        }
    }, [activeBatch]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchBatches = async () => {
        try {
            const { data } = await api.get('/training/trainer/batches');
            setBatches(data);
            if (data.length > 0 && !activeBatch) {
                setActiveBatch(data[0]._id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async () => {
        if (!activeBatch) return;
        try {
            const { data } = await api.get(`/training/messages/batch/${activeBatch}`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeBatch) return;

        try {
            const { data } = await api.post('/training/messages', {
                batch: activeBatch,
                content: newMessage,
                sender: userInfo._id
            });
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="flex h-[700px] bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
            {/* Sidebar: Batches */}
            <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Conversations</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input placeholder="Search batch..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {batches.map(batch => (
                        <button
                            key={batch._id}
                            onClick={() => setActiveBatch(batch._id)}
                            className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeBatch === batch._id ? 'bg-secondary/10 border-secondary' : 'hover:bg-gray-50 dark:hover:bg-dark-bg'}`}
                        >
                            <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center shrink-0">
                                <Users size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white truncate">{batch.course?.title}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{batch.batchId}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-dark-bg/10">
                {activeBatch ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        {batches.find(b => b._id === activeBatch)?.course?.title}
                                    </h4>
                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Batch Chat</p>
                                </div>
                            </div>
                            <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender?._id === userInfo._id;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                                                <User size={14} className="text-gray-500" />
                                            </div>
                                            <div className={`p-4 rounded-2xl ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-tl-none shadow-sm'}`}>
                                                {!isMe && <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">{msg.sender?.firstName}</p>}
                                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                                                    <span className="text-[9px] font-bold">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <button type="button" className="p-4 bg-gray-50 dark:bg-dark-bg text-gray-400 rounded-2xl hover:text-primary transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 px-6 bg-gray-50 dark:bg-dark-bg rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-primary transition-all"
                                />
                                <button type="submit" className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-bg rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
                            <Users size={32} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-gray-400">Select a batch to start communicating</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;
