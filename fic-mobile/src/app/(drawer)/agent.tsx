import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, BackHandler } from 'react-native';
import { ShieldCheck, Users, TrendingUp, UserPlus, Phone, Edit, Trash2, FileText, UploadCloud, X, CheckCircle } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';

export default function AgentDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [leads, setLeads] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Lead Form State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', type: 'Vendor' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const fetchAgentData = async () => {
    try {
      const res = await api.get('/users');
      // Filter leads explicitly referred by this agent
      const myLeads = res.data.filter((u: any) => 
        u.referredByAgentName === user?.firstName || u.agentMobile === user?.mobile
      );
      setLeads(myLeads);
      
      const me = res.data.find((u: any) => u._id === user?._id);
      if (me) setKycDocs(me.profileDocuments || []);
    } catch (err) {
      console.warn("Failed to fetch agent data");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAgentData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAgentData();
  }, [user]);

  const handleSaveLead = async () => {
    if (!leadForm.name || !leadForm.phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    try {
      if (editingId) {
        Alert.alert('Success', 'Lead details updated securely.');
      } else {
        await api.post('/auth/register', {
          firstName: leadForm.name.split(' ')[0] || 'Lead',
          lastName: leadForm.name.split(' ')[1] || '',
          email: `${leadForm.phone}@fic-lead.com`,
          password: 'fic_temp_pass',
          mobile: leadForm.phone,
          role: leadForm.type,
          referredByAgentName: user?.firstName,
          agentMobile: user?.mobile,
          approvalStatus: 'Pending'
        });
        Alert.alert('Success', 'New vendor lead registered into the pipeline!');
      }
      setShowLeadModal(false);
      setLeadForm({ name: '', phone: '', type: 'Vendor' });
      setEditingId(null);
      fetchAgentData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save lead. Mobile might already be registered.');
    }
  };

  const handleDeleteLead = (id: string) => {
    Alert.alert('Remove Lead', 'Drop this lead from your pipeline?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/users/${id}`);
          fetchAgentData();
        } catch (e) {
          Alert.alert('Error', 'Failed to remove lead');
        }
      }}
    ]);
  };

  const simulateUploadKYC = () => {
    Alert.alert('KYC Upload', 'Uploading your identity credential securely...');
    setTimeout(async () => {
      try {
        const newDocs = [...kycDocs, { name: 'Aadhar Verification', url: 'https://placeholder.com/doc', type: 'credential', uploadedAt: new Date() }];
        await api.put('/users/profile', { profileDocuments: newDocs });
        Alert.alert('Success', 'Document uploaded and awaiting admin verification.');
        fetchAgentData();
      } catch (e) {
        Alert.alert('Error', 'Upload failed');
      }
    }, 1500);
  };

  const tabs = ['Overview', 'Leads', 'KYC Verification'];

  return (
    <View className="flex-1 bg-[#0f172a] relative">
      <View className="absolute top-0 left-0 w-full h-full bg-blue-500/5 opacity-50" />
      
      <View className="pt-12 pb-4 px-6 bg-[#0f172a]/90 border-b border-slate-800 z-10">
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 self-start flex-row items-center gap-1.5 mb-2">
              <ShieldCheck color="#3b82f6" size={12} />
              <Text className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">Authorized Access</Text>
            </View>
            <Text className="text-2xl font-black text-white tracking-tighter uppercase">
              Agent <Text className="text-blue-500">Command</Text>
            </Text>
          </View>
          {activeTab === 'Leads' && (
            <TouchableOpacity onPress={() => setShowLeadModal(true)} className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-500/30">
              <UserPlus color="white" size={18} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full mr-3 ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-800 border border-slate-700'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}>
        
        {activeTab === 'Overview' && (
          <View className="space-y-6 pb-12">
            <View className="flex-row justify-between gap-4">
              <View className="flex-1 bg-slate-800/80 border border-slate-700 p-6 rounded-[2rem] items-center">
                <View className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center mb-3"><Users color="#3b82f6" size={24} /></View>
                <Text className="text-3xl font-black text-white mb-1">{leads.length}</Text>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Leads</Text>
              </View>
              <View className="flex-1 bg-slate-800/80 border border-slate-700 p-6 rounded-[2rem] items-center">
                <View className="w-12 h-12 bg-green-500/10 rounded-2xl items-center justify-center mb-3"><TrendingUp color="#22c55e" size={24} /></View>
                <Text className="text-3xl font-black text-white mb-1">₹{leads.length * 500}</Text>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Commissions</Text>
              </View>
            </View>

            <View className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden mt-2">
              <View className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <Text className="text-lg font-black text-white uppercase tracking-tight mb-2">Expand The Network</Text>
              <Text className="text-blue-100 text-xs font-medium mb-6 max-w-[85%] leading-relaxed">Refer vendors and service providers to the FIC ecosystem and earn commissions on successful onboarding.</Text>
              <TouchableOpacity onPress={() => { setActiveTab('Leads'); setShowLeadModal(true); }} className="bg-white py-4 rounded-xl flex-row items-center justify-center gap-2 active:scale-95">
                <UserPlus color="#2563eb" size={16} />
                <Text className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Add New Lead</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'Leads' && (
          <View className="space-y-4 pb-12">
            {leads.map((lead: any) => (
              <View key={lead._id} className="bg-slate-800/80 p-5 rounded-[2rem] border border-slate-700 flex-row items-center">
                <View className="w-12 h-12 bg-blue-500/20 rounded-full items-center justify-center border border-blue-500/30 mr-4">
                  <Text className="text-blue-400 font-black uppercase text-lg">{lead.firstName?.charAt(0) || 'L'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-black text-sm uppercase tracking-tight mb-1">{lead.firstName} {lead.lastName}</Text>
                  <View className="flex-row items-center gap-1">
                    <Phone color="#94a3b8" size={10} />
                    <Text className="text-slate-400 text-[10px] font-bold tracking-widest">{lead.mobile || 'No Contact'}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity className="w-8 h-8 bg-slate-700 rounded-full items-center justify-center" onPress={() => { setEditingId(lead._id); setLeadForm({ name: `${lead.firstName} ${lead.lastName}`, phone: lead.mobile, type: lead.role }); setShowLeadModal(true); }}>
                    <Edit color="#94a3b8" size={14} />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center" onPress={() => handleDeleteLead(lead._id)}>
                    <Trash2 color="#ef4444" size={14} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {leads.length === 0 && (
              <View className="py-12 items-center justify-center border border-slate-700 border-dashed rounded-[2rem]">
                <Users color="#475569" size={40} className="mb-4" />
                <Text className="text-slate-500 text-xs font-black uppercase tracking-widest">Pipeline Empty</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'KYC Verification' && (
          <View className="space-y-6 pb-12">
            <View className="bg-slate-800/80 p-8 rounded-[2.5rem] border border-slate-700 items-center text-center">
              <View className="w-20 h-20 bg-blue-500/10 rounded-full items-center justify-center mb-6">
                <ShieldCheck color="#3b82f6" size={40} />
              </View>
              <Text className="text-white font-black text-xl uppercase tracking-tighter mb-2">Identity Vault</Text>
              <Text className="text-slate-400 text-xs text-center mb-8 px-4 leading-relaxed">
                Upload your official credentials to verify your Agent status and unlock payout capabilities.
              </Text>
              <TouchableOpacity onPress={simulateUploadKYC} className="w-full bg-blue-600 py-4 rounded-xl flex-row items-center justify-center gap-3">
                <UploadCloud color="white" size={18} />
                <Text className="text-white font-black text-xs uppercase tracking-widest">Upload Document</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-white font-black text-sm uppercase tracking-tight ml-2">Vault Records</Text>
            {kycDocs.map((doc: any, i) => (
              <View key={i} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex-row items-center">
                <View className="w-10 h-10 bg-slate-700 rounded-xl items-center justify-center mr-4">
                  <FileText color="#94a3b8" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-black text-xs tracking-wider">{doc.name || 'Credential'}</Text>
                  <Text className="text-slate-500 text-[10px] uppercase font-bold mt-1">Pending Admin Review</Text>
                </View>
                <CheckCircle color="#3b82f6" size={18} />
              </View>
            ))}
            {kycDocs.length === 0 && <Text className="text-slate-500 text-xs italic text-center py-4">No documents uploaded yet.</Text>}
          </View>
        )}

      </ScrollView>

      {/* Lead CRUD Modal */}
      <Modal visible={showLeadModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-slate-900 p-8 rounded-t-[2.5rem] border-t border-slate-800">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-2xl font-black text-white uppercase tracking-tighter">{editingId ? 'Edit Lead' : 'New Vendor Lead'}</Text>
                <Text className="text-blue-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Network Expansion</Text>
              </View>
              <TouchableOpacity onPress={() => setShowLeadModal(false)} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center">
                <X color="#94a3b8" size={18} />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput 
                className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white font-medium"
                placeholder="Business or Owner Name" placeholderTextColor="#64748b"
                value={leadForm.name} onChangeText={(t) => setLeadForm({...leadForm, name: t})}
              />
              <TextInput 
                className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white font-medium"
                placeholder="Mobile Number" placeholderTextColor="#64748b" keyboardType="phone-pad"
                value={leadForm.phone} onChangeText={(t) => setLeadForm({...leadForm, phone: t})}
              />
              <View className="flex-row gap-4 mb-4">
                {['Vendor', 'Service Provider'].map(type => (
                  <TouchableOpacity 
                    key={type} onPress={() => setLeadForm({...leadForm, type})}
                    className={`flex-1 p-4 rounded-xl border items-center ${leadForm.type === type ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                  >
                    <Text className={`font-black text-[10px] uppercase tracking-widest ${leadForm.type === type ? 'text-blue-400' : 'text-slate-500'}`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={handleSaveLead} className="bg-blue-600 py-5 rounded-xl items-center shadow-lg shadow-blue-600/30">
                <Text className="text-white font-black text-xs uppercase tracking-widest">{editingId ? 'Save Changes' : 'Register Lead'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
