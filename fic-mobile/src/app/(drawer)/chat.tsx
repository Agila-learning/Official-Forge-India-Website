import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MessageSquare, Send, ArrowLeft, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function ChatScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Default to chatting with "Admin" for standard users, or generic Support
  useEffect(() => {
    const fetchChat = async () => {
      try {
        // Find admin contact to fetch messages (Mock implementation mirroring web logic)
        const { data } = await api.get('/chat').catch(() => ({ data: [] }));
        
        // Mock data if backend empty
        if (!data || data.length === 0) {
          setMessages([
            { _id: '1', sender: { firstName: 'System' }, content: 'Welcome to FIC Support! How can we help you?', createdAt: new Date().toISOString() }
          ]);
        } else {
          // If we had a real thread ID, we'd fetch specific messages.
          // For now, load threads as the active messages for demo
          setMessages(data);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg = {
      _id: Date.now().toString(),
      sender: user?._id || user, // current user
      content: inputText,
      createdAt: new Date().toISOString()
    };
    
    // Optimistic UI update
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Find Admin user ID or default receiver to send to
      await api.post('/chat', { receiverRole: 'Admin', content: inputText });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 border-b border-slate-800 bg-[#0f172a] flex-row items-center justify-between z-10 shadow-lg">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center border border-slate-800">
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center border border-primary/30">
              <MessageSquare color="#3b82f6" size={18} />
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />
          </View>
          <View>
            <Text className="text-white font-black text-base uppercase tracking-tight">Support Desk</Text>
            <Text className="text-green-500 font-bold text-[9px] uppercase tracking-widest">Online</Text>
          </View>
        </View>
        <View className="w-10 h-10" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg: any) => {
            const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
            
            return (
              <View key={msg._id} className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <View className="w-8 h-8 bg-dark-card rounded-full items-center justify-center mr-2 self-end border border-slate-700">
                    <User color="#94a3b8" size={14} />
                  </View>
                )}
                
                <View className={`max-w-[75%] px-5 py-3 rounded-3xl ${
                  isMe 
                    ? 'bg-primary rounded-br-sm' 
                    : 'bg-dark-card border border-slate-800 rounded-bl-sm'
                }`}>
                  <Text className={`text-sm ${isMe ? 'text-white' : 'text-slate-300'}`}>
                    {msg.content}
                  </Text>
                  <Text className={`text-[8px] mt-1 font-bold ${isMe ? 'text-blue-200 text-right' : 'text-slate-500 text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Input Area */}
      <View className="p-4 bg-[#0f172a] border-t border-slate-800 flex-row items-center gap-3 pb-8">
        <TextInput 
          className="flex-1 bg-dark-card border border-slate-700 rounded-full px-5 py-3.5 text-white text-sm"
          placeholder="Type your message..." placeholderTextColor="#64748b"
          value={inputText} onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
            inputText.trim() ? 'bg-primary shadow-primary/30' : 'bg-slate-800'
          }`}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send color={inputText.trim() ? 'white' : '#64748b'} size={18} className="ml-1" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
