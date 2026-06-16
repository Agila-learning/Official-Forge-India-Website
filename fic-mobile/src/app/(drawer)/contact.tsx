import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MapPin, Phone, Mail, Send, MessageSquare } from 'lucide-react-native';
import api from '../../services/api';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', category: 'General Inquiry', message: ''
  });
  const [loading, setLoading] = useState(false);
  const contactInfo = { email: 'info@forgeindiaconnect.com', phone: '+91 6369406416' };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.email || !formData.message) {
      Alert.alert('Required Fields Missing', 'Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contacts', formData);
      Alert.alert('Message Sent!', 'Our administrative team will review your query and contact you shortly.');
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', category: 'General Inquiry', message: '' });
    } catch (err) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 p-6">
        
        {/* Header Section */}
        <View className="mb-8 mt-4">
          <View className="w-16 h-16 bg-blue-50 rounded-3xl items-center justify-center mb-4">
            <MessageSquare color="#2563eb" size={32} />
          </View>
          <Text className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Get In Touch</Text>
          <Text className="text-slate-500 font-medium leading-relaxed mt-2">
            Have a question about the Forge India Connect ecosystem? Our dedicated team is here to assist you 24/7.
          </Text>
        </View>

        {/* Contact Info Cards */}
        <View className="flex-row gap-4 mb-10">
          <View className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 items-center justify-center shadow-sm">
            <Mail color="#2563eb" size={24} className="mb-2" />
            <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>{contactInfo.email}</Text>
            <Text className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">24/7 Email</Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 items-center justify-center shadow-sm">
            <Phone color="#eab308" size={24} className="mb-2" />
            <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>{contactInfo.phone}</Text>
            <Text className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Toll Free</Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-12">
          <Text className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest border-b border-slate-100 pb-2">
            Send Message
          </Text>

          <View className="space-y-4">
            <View className="flex-row justify-between">
              <TextInput 
                className="w-[48%] bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900"
                placeholder="First Name" placeholderTextColor="#94a3b8"
                value={formData.firstName} onChangeText={t => setFormData({...formData, firstName: t})}
              />
              <TextInput 
                className="w-[48%] bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900"
                placeholder="Last Name" placeholderTextColor="#94a3b8"
                value={formData.lastName} onChangeText={t => setFormData({...formData, lastName: t})}
              />
            </View>
            
            <TextInput 
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900"
              placeholder="Email Address" placeholderTextColor="#94a3b8"
              keyboardType="email-address" autoCapitalize="none"
              value={formData.email} onChangeText={t => setFormData({...formData, email: t})}
            />

            <TextInput 
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900"
              placeholder="Mobile Number" placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t})}
            />

            <TextInput 
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-left align-top"
              placeholder="How can we help you today?" placeholderTextColor="#94a3b8"
              multiline numberOfLines={4} style={{ height: 120 }}
              value={formData.message} onChangeText={t => setFormData({...formData, message: t})}
            />

            <TouchableOpacity 
              className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-600/30 mt-4 flex-row justify-center gap-2"
              onPress={handleSubmit} disabled={loading}
            >
              <Send color="white" size={18} />
              <Text className="text-white font-black uppercase tracking-widest text-sm">
                {loading ? 'Transmitting...' : 'Dispatch Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
