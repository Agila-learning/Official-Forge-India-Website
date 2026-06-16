import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, TextInput, Image } from 'react-native';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, Menu, User, X } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function JobsScreen() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j: any) => 
    j.title?.toLowerCase().includes(search.toLowerCase()) || 
    j.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Global Fixed Header */}
      <View className="pt-14 pb-4 px-4 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-10 flex-row justify-between items-center shadow-sm">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => (navigation as any).openDrawer()}
            className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-200"
          >
            <Menu color="#475569" size={20} />
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Explore</Text>
            <Text className="text-xl font-black text-slate-900 uppercase tracking-tighter">Job <Text className="text-blue-600">Board</Text></Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center overflow-hidden border border-blue-200">
           {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <User color="#3b82f6" size={20} />}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 pt-6 pb-2">
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white border border-slate-200 rounded-2xl flex-row items-center px-4 h-12 shadow-sm">
            <Search color="#94a3b8" size={18} />
            <TextInput 
              className="flex-1 text-slate-900 ml-3 font-medium h-full"
              placeholder="Search jobs, skills, or companies" 
              placeholderTextColor="#94a3b8"
              value={search} onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X color="#94a3b8" size={16} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity className="w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center shadow-md shadow-slate-900/20">
            <Filter color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6 pt-2"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
        >
          {filteredJobs.map((job: any) => (
            <TouchableOpacity 
              key={job._id}
              activeOpacity={0.8}
              onPress={() => router.push(`/(drawer)/jobs/${job._id}`)}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4 relative overflow-hidden group"
            >
              <View className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></View>
              
              <View className="flex-row justify-between items-start mb-4 relative z-10">
                <View className="flex-1 mr-4">
                  <Text className="text-xl font-black text-slate-900 mb-1 leading-tight">{job.title}</Text>
                  <Text className="text-blue-600 font-bold text-sm uppercase tracking-widest">{job.companyName}</Text>
                </View>
                <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center border border-blue-100 shrink-0">
                  <Briefcase color="#3b82f6" size={20} />
                </View>
              </View>
              
              <View className="flex-row flex-wrap gap-2 mb-5 relative z-10">
                <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <MapPin color="#64748b" size={12} className="mr-1.5" />
                  <Text className="text-xs text-slate-600 font-medium">{job.location || 'Remote'}</Text>
                </View>
                <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock color="#64748b" size={12} className="mr-1.5" />
                  <Text className="text-xs text-slate-600 font-medium">{job.jobType || 'Full-time'}</Text>
                </View>
                {job.salary && (
                  <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <DollarSign color="#64748b" size={12} className="mr-1" />
                    <Text className="text-xs text-slate-600 font-medium">{job.salary}</Text>
                  </View>
                )}
              </View>
              
              <View className="w-full py-3 bg-blue-50 border border-blue-100 rounded-xl items-center justify-center relative z-10">
                <Text className="text-blue-600 font-black uppercase tracking-widest text-[10px]">View Details & Apply</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredJobs.length === 0 && (
            <View className="py-12 items-center justify-center">
              <Search color="#334155" size={48} className="mb-4" />
              <Text className="text-slate-500 font-bold">No jobs match your search.</Text>
            </View>
          )}
          <View className="h-10" />
        </ScrollView>
      )}
    </View>
  );
}
