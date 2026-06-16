import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Platform, TextInput, Modal, Alert, BackHandler } from 'react-native';
import { Briefcase, Users, Plus, ChevronRight, Activity, Cloud, PieChart, LayoutDashboard, Settings, Menu, Bell, TrendingUp, X, Edit3, Trash2 } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useRouter, useNavigation, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

export default function HRDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState(params.tab ? (params.tab as string) : 'overview');

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

  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params.tab]);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, hired: 0, interviewRate: 0 });
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', location: '' });

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/applications').catch(() => ({ data: [] }))
      ]);

      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);

      const hired = (appsRes.data || []).filter((a: any) => a.status === 'Hired').length;
      const rate = appsRes.data?.length > 0 ? Number(((hired / appsRes.data.length) * 100).toFixed(1)) : 0;

      setStats({
        activeJobs: jobsRes.data?.length || 0,
        totalApplicants: appsRes.data?.length || 0,
        hired,
        interviewRate: rate
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, formData);
        Alert.alert('Success', 'Job updated successfully');
      } else {
        await api.post('/jobs', { ...formData, companyName: 'Forge India Connect', status: 'Active' });
        Alert.alert('Success', 'Job created successfully');
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to save job');
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`);
      Alert.alert('Success', 'Job deleted');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete job');
    }
  };

  const deleteApp = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      Alert.alert('Success', 'Application deleted');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete application');
    }
  };

  const updateAppStatus = async (id: string, status: string) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const openJobModal = (job: any = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({ title: job.title, location: job.location });
    } else {
      setEditingJob(null);
      setFormData({ title: '', location: '' });
    }
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-slate-50 relative">
      <Drawer.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-white border-b border-slate-200 flex-row justify-between items-center z-10 shadow-sm">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => (navigation as any).openDrawer()}>
            <Menu color="#475569" size={24} />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-900 text-[15px] uppercase tracking-wider">FORGE INDIA</Text>
            <View className="w-px h-4 bg-slate-300 mx-2"></View>
            <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-slate-500 text-[13px]">HR Portal</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="relative">
            <Bell color="#475569" size={20} />
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </View>
          <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            <Image source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=HR&background=0D8ABC&color=fff' }} className="w-full h-full" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
      >
        {activeTab === 'overview' && (
          <View>
            {/* Top Profile Card */}
            <View className="bg-white rounded-md border border-slate-200 mb-4 overflow-hidden">
              <View className="p-4 flex-row justify-between items-start border-b border-slate-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-blue-50 border border-blue-100 rounded flex items-center justify-center">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xl text-blue-900">H</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-slate-900 leading-tight">HR FORGE</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-xs text-slate-500">Executive Intel Suite</Text>
                  </View>
                </View>
                <View className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex-row items-center gap-1.5">
                  <View className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-emerald-700 uppercase tracking-widest">Live</Text>
                </View>
              </View>
              <View className="flex-row">
                <View className="flex-1 p-4 border-r border-slate-100">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Impact Class</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-blue-900">A+</Text>
                </View>
                <View className="flex-1 p-4">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Recruitment Velocity</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-emerald-600">88%</Text>
                </View>
              </View>
            </View>

            {/* 2x2 Grid */}
            <View className="flex-row flex-wrap justify-between gap-y-3 mb-4">
              <TouchableOpacity onPress={() => setActiveTab('requisitions')} className="w-[48%] bg-white rounded-md border border-slate-200 p-4 active:bg-slate-50">
                <View className="flex-row items-center gap-2 mb-3">
                  <Briefcase size={14} color="#2563eb" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-500 uppercase tracking-widest">Open Listings</Text>
                </View>
                <View className="flex-row items-baseline gap-2">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-slate-900">{stats.activeJobs.toString().padStart(2, '0')}</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-emerald-600 uppercase tracking-widest">Active</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('pipeline')} className="w-[48%] bg-white rounded-md border border-slate-200 p-4 active:bg-slate-50">
                <View className="flex-row items-center gap-2 mb-3">
                  <Activity size={14} color="#2563eb" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-500 uppercase tracking-widest">Pipeline</Text>
                </View>
                <View className="flex-row items-baseline gap-2">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-slate-900">{stats.totalApplicants.toString().padStart(2, '0')}</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-500 uppercase tracking-widest">Tracked</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('pipeline')} className="w-[48%] bg-white rounded-md border border-slate-200 p-4 active:bg-slate-50">
                <View className="flex-row items-center gap-2 mb-3">
                  <Users size={14} color="#2563eb" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-500 uppercase tracking-widest">Applications</Text>
                </View>
                <View className="flex-row items-baseline gap-2">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-slate-900">{stats.totalApplicants.toString().padStart(2, '0')}</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-orange-500 uppercase tracking-widest">Queued</Text>
                </View>
              </TouchableOpacity>
              <View className="w-[48%] bg-white rounded-md border border-slate-200 p-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <TrendingUp size={14} color="#2563eb" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-500 uppercase tracking-widest">Conversion</Text>
                </View>
                <View className="flex-row items-baseline gap-2">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-2xl text-slate-900">{stats.interviewRate}%</Text>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-500 uppercase tracking-widest">Stable</Text>
                </View>
              </View>
            </View>

            {/* Pipeline Overview */}
            <View className="bg-white rounded-md border border-slate-200 mb-4 overflow-hidden">
              <View className="px-4 py-3 border-b border-slate-100 flex-row justify-between items-center">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[11px] text-slate-900 uppercase tracking-widest">Pipeline Overview</Text>
                <TouchableOpacity onPress={() => setActiveTab('pipeline')}>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-blue-600">View all</Text>
                </TouchableOpacity>
              </View>
              {applications.slice(0, 3).map((app: any, idx: number) => (
                <View key={app._id || idx} className={`p-4 flex-row items-center justify-between ${idx !== (applications.slice(0, 3).length - 1) ? 'border-b border-slate-50' : ''}`}>
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[11px] text-blue-900">
                        {app.fullName ? app.fullName.substring(0, 2).toUpperCase() : 'BS'}
                      </Text>
                    </View>
                    <View className="flex-1 pr-2">
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 leading-tight" numberOfLines={1}>{app.fullName || 'Candidate'}</Text>
                      <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500" numberOfLines={1}>{app.jobRole || 'Application'}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-600 uppercase tracking-widest">{app.status || 'Pending'}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Active Requisitions */}
            <View className="bg-white rounded-md border border-slate-200 mb-8 overflow-hidden">
              <View className="px-4 py-3 border-b border-slate-100 flex-row justify-between items-center">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[11px] text-slate-900 uppercase tracking-widest">Active Requisitions</Text>
                <TouchableOpacity onPress={() => setActiveTab('requisitions')}>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-blue-600">View all</Text>
                </TouchableOpacity>
              </View>
              {jobs.slice(0, 3).map((job: any, idx: number) => {
                const isCloud = job.title?.toLowerCase().includes('cloud') || job.title?.toLowerCase().includes('aws');
                return (
                  <View key={job._id || idx} className={`p-4 flex-row items-center justify-between ${idx !== (jobs.slice(0, 3).length - 1) ? 'border-b border-slate-100' : ''}`}>
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 rounded border border-slate-200 flex items-center justify-center bg-white">
                        {isCloud ? <Cloud size={16} color="#0284c7" /> : <Briefcase size={16} color="#0284c7" />}
                      </View>
                      <View className="flex-1 pr-2">
                        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 leading-tight" numberOfLines={1}>{job.title}</Text>
                        <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500" numberOfLines={1}>{job.location}</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-slate-900 leading-none">
                        {applications.filter(a => a.job === job._id || a.jobRole === job.title).length}
                      </Text>
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[7px] text-slate-500 uppercase tracking-widest mt-1">Apps</Text>
                    </View>
                  </View>
                );
              })}
              <TouchableOpacity onPress={() => openJobModal()} className="py-4 items-center justify-center bg-slate-50 border-t border-slate-100">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[11px] text-blue-600 uppercase tracking-widest">Create New Requisition</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* REQUISITIONS TAB */}
        {activeTab === 'requisitions' && (
          <View className="pb-8">
            <View className="flex-row justify-between items-center mb-4">
               <TouchableOpacity onPress={() => setActiveTab('overview')} className="flex-row items-center gap-2">
                  <X size={16} color="#64748b" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xs text-slate-500 uppercase tracking-widest">Back to Hub</Text>
               </TouchableOpacity>
               <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase">All Jobs</Text>
            </View>
            
            {jobs.map((job: any) => (
              <View key={job._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-3 flex-row items-center gap-4">
                <View className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase size={16} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase" numberOfLines={1}>{job.title}</Text>
                  <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mb-1" numberOfLines={1}>{job.companyName} • {job.location}</Text>
                  <View className="bg-slate-100 self-start px-2 py-0.5 rounded">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] uppercase text-slate-600">{job.status || 'Active'}</Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => openJobModal(job)} className="p-2 bg-slate-50 rounded border border-slate-200">
                    <Edit3 color="#2563eb" size={14} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteJob(job._id)} className="p-2 bg-red-50 rounded border border-red-200">
                    <Trash2 color="#ef4444" size={14} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <View className="pb-8">
            <View className="flex-row justify-between items-center mb-4">
               <TouchableOpacity onPress={() => setActiveTab('overview')} className="flex-row items-center gap-2">
                  <X size={16} color="#64748b" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xs text-slate-500 uppercase tracking-widest">Back to Hub</Text>
               </TouchableOpacity>
               <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase">Applications</Text>
            </View>
            
            {applications.map((app: any) => (
              <View key={app._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-3">
                <View className="flex-row items-center gap-4 mb-3">
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900 uppercase" numberOfLines={1}>{app.fullName}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mb-1" numberOfLines={1}>{app.jobRole} • {app.email}</Text>
                    <View className="bg-blue-50 self-start px-2 py-0.5 rounded border border-blue-100">
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] uppercase text-blue-600">{app.status || 'Pending'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => deleteApp(app._id)} className="p-2 bg-red-50 rounded border border-red-200">
                    <Trash2 color="#ef4444" size={14} />
                  </TouchableOpacity>
                </View>

                {app.resumeUrl && (
                  <TouchableOpacity onPress={() => import('expo-linking').then(Linking => Linking.openURL(app.resumeUrl))} className="mb-3">
                    <Text className="text-xs text-blue-600 font-bold">📄 View Resume</Text>
                  </TouchableOpacity>
                )}

                <View className="flex-row flex-wrap gap-2">
                  {['Pending', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(status => (
                    <TouchableOpacity 
                      key={status}
                      onPress={() => updateAppStatus(app._id, status)}
                      className={`px-2 py-1 rounded border ${app.status === status ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <Text className={`text-[8px] uppercase font-bold ${app.status === status ? 'text-white' : 'text-slate-500'}`}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {activeTab !== 'pipeline' && (
        <TouchableOpacity 
          onPress={() => openJobModal()}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95 z-20"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Create/Edit Job Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-slate-900/50">
          <View className="bg-white p-6 rounded-t-3xl h-3/4 shadow-2xl border-t border-slate-200">
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-slate-900 uppercase">{editingJob ? 'Edit Requisition' : 'New Requisition'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4">
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-xs text-slate-500 mb-1 ml-1 uppercase">Job Title</Text>
              <TextInput 
                value={formData.title} 
                onChangeText={t => setFormData({...formData, title: t})}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4"
                style={{ fontFamily: 'Outfit_500Medium' }}
                placeholder="e.g. Senior Cloud Engineer"
              />

              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-xs text-slate-500 mb-1 ml-1 uppercase">Location</Text>
              <TextInput 
                value={formData.location} 
                onChangeText={t => setFormData({...formData, location: t})}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4"
                style={{ fontFamily: 'Outfit_500Medium' }}
                placeholder="e.g. Bangalore, India"
              />
            </ScrollView>

            <TouchableOpacity 
              onPress={handleSaveJob} 
              className="bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-600/30 active:bg-blue-700"
            >
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-sm uppercase tracking-widest">{editingJob ? 'Save Changes' : 'Publish Requisition'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}
