import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Phone, ArrowRight, AlertCircle, Loader } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function LoginScreen() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    setStatus({ ...status, loading: true, error: '' });
    
    try {
      if (!formData.identifier || !formData.password) throw new Error('Please fill in all fields');
      // Backend auth expects email, but let's pass the identifier as email (since it could be email or mobile if backend supports it)
      await login({ email: formData.identifier.toLowerCase().trim(), password: formData.password }, 'email');
      router.replace('/');
    } catch (err: any) {
      setStatus({ 
        ...status, 
        loading: false, 
        error: err.message || err.response?.data?.message || 'Authentication failed. Please check credentials.' 
      });
    }
  };

  // handleSendOTP removed

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <ScrollView className="flex-1 px-8 pt-16 relative" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
        {/* Background Gradients */}
        <View className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40"></View>
        <View className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40"></View>

        <View className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8">
          
          <View className="mb-8 items-center">
            <View className="bg-white p-4 rounded-3xl shadow-xl shadow-white/10 mb-6 w-full items-center border border-slate-100">
              <Image 
                source={require('../../../assets/images/logo.jpg')} 
                style={{ width: '100%', height: 60 }} 
                resizeMode="contain" 
              />
            </View>
            <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</Text>
            <Text className="text-slate-500 font-medium text-center mt-2">Sign in to your FIC account</Text>
          </View>
          
          <View className="space-y-6">
            <View className="space-y-2">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email / Mobile Number</Text>
              <View className="relative justify-center">
                <View className="absolute left-6 z-10">
                  <Mail size={18} color="#94a3b8" />
                </View>
                <TextInput 
                  className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-5 py-4 text-slate-900 dark:text-white font-medium"
                  placeholder="name@company.com or Mobile" placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  value={formData.identifier} onChangeText={t => setFormData({...formData, identifier: t})}
                />
              </View>
            </View>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center px-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</Text>
                <TouchableOpacity><Text className="text-[10px] font-black text-primary uppercase tracking-widest">Forgot?</Text></TouchableOpacity>
              </View>
              <View className="relative justify-center">
                <View className="absolute left-6 z-10">
                  <Lock size={18} color="#94a3b8" />
                </View>
                <TextInput 
                  className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-5 py-4 text-slate-900 dark:text-white font-medium"
                  placeholder="••••••••" placeholderTextColor="#94a3b8"
                  secureTextEntry
                  value={formData.password} onChangeText={t => setFormData({...formData, password: t})}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-primary py-5 rounded-2xl flex-row justify-center items-center gap-2 shadow-lg shadow-primary/30 mt-8 active:scale-95 transition-transform"
            onPress={handleLogin}
            disabled={status.loading}
          >
            {status.loading ? <Text className="text-white font-black uppercase tracking-widest text-sm">Loading...</Text> : (
              <>
                <Text className="text-white font-black uppercase tracking-widest text-sm">Sign In</Text>
                <ArrowRight size={18} color="white" />
              </>
            )}
          </TouchableOpacity>

          <View className="mt-10 flex-row justify-center">
            <Text className="text-slate-500 font-bold text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-secondary font-black uppercase tracking-widest text-[11px] underline">Register Now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
