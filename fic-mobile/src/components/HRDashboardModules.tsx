import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Search, Users, Activity, CheckCircle, FileText, Send, Building, Clock, Briefcase } from 'lucide-react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function HRDashboardModules({ activeTab, applications, userInfo }: any) {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (['search', 'talent-pool'].includes(activeTab)) {
      api.get('/users?role=Candidate').then(res => setCandidates(res.data || [])).catch(() => {});
    }
  }, [activeTab]);

  if (activeTab === 'search') {
    return (
      <View className="flex-1 mt-4">
        <View className="mb-4 bg-white p-4 rounded-xl border border-slate-200">
          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg uppercase text-slate-900 mb-2">Talent Search</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-lg p-2">
            <Search size={16} color="#64748b" className="mr-2" />
            <TextInput placeholder="Search candidates..." className="flex-1 font-medium text-xs text-slate-900" style={{ fontFamily: 'Outfit_500Medium' }} />
          </View>
        </View>
        {candidates.map(c => (
          <View key={c._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-3 flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-blue-600">{c.firstName?.[0]}</Text>
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase" numberOfLines={1}>{c.firstName} {c.lastName}</Text>
              <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 uppercase">{c.industry || 'General'}</Text>
            </View>
            <TouchableOpacity className="p-2 bg-blue-600 rounded-lg" onPress={() => router.push({ pathname: '/(drawer)/chat', params: { receiverId: c._id } } as any)}>
              <Send size={14} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  if (activeTab === 'shortlists') {
    const shorts = applications.filter((a: any) => a.status === 'Shortlisted');
    return (
      <View className="flex-1 mt-4">
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg uppercase text-slate-900 mb-4">Shortlisted Candidates</Text>
        {shorts.map((app: any) => (
          <View key={app._id} className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-3">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-blue-900 uppercase">{app.fullName}</Text>
            <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-blue-600 uppercase mb-2">{app.jobRole}</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-1 bg-blue-600 p-2 rounded items-center">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-white uppercase">Interview</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white border border-slate-200 p-2 rounded items-center">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-red-500 uppercase">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {shorts.length === 0 && <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-xs text-slate-500 text-center py-10 uppercase tracking-widest">No Shortlists</Text>}
      </View>
    );
  }

  if (activeTab === 'feedback') {
    return (
      <View className="flex-1 mt-4">
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg uppercase text-slate-900 mb-4">Interview Feedback</Text>
        {applications.filter((a: any) => ['Interview', 'Hired', 'Rejected'].includes(a.status)).map((app: any) => (
          <View key={app._id} className="bg-white p-4 rounded-xl border border-slate-200 mb-3 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase">{app.fullName}</Text>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{app.status}</Text>
            </View>
            <TextInput 
              multiline 
              defaultValue={app.hrNotes || ''}
              placeholder="Enter HR notes here..." 
              className="bg-slate-50 p-3 rounded border border-slate-200 text-xs mb-2"
              style={{ fontFamily: 'Outfit_500Medium' }}
            />
            <TouchableOpacity className="bg-slate-900 p-3 rounded items-center">
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-white uppercase tracking-widest">Save Notes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  if (activeTab === 'reports') {
    return (
      <View className="flex-1 mt-4 p-6 bg-white rounded-2xl border border-slate-200 items-center justify-center shadow-sm">
        <FileText size={48} color="#2563eb" className="mb-4" />
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg uppercase text-slate-900 mb-2">Data Reports</Text>
        <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-xs text-slate-500 text-center mb-6 px-4">Export all candidate and ATS data as a structured CSV for offline analytics.</Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-4 rounded-xl shadow-lg shadow-blue-600/30">
          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xs text-white uppercase tracking-widest">Generate CSV Export</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback for remaining (messages, campaigns, subscription, company-profile, settings, profile, analytics, interviews, talent-pool)
  return (
    <View className="flex-1 items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 mt-4 shadow-sm">
      <View className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Activity size={24} color="#2563eb" />
      </View>
      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xl text-slate-900 uppercase tracking-tighter mb-2 capitalize">{activeTab.replace('-', ' ')}</Text>
      <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 text-center px-8 uppercase tracking-widest leading-relaxed">
        This module is actively being calibrated by the strategic deployment team. Features like messaging, analytics, and subscriptions will sync automatically via OTA update.
      </Text>
    </View>
  );
}
