import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { Navigation, Clock, ShieldCheck, MapPin, Wallet, Bell, ArrowRight, User, UploadCloud, FileText, CheckCircle2 } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';
export default function ServiceProviderDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const [rides, setRides] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchRides = async () => {
    try {
      // Fetch live orders
      const [res, userRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);
      
      // Filter for orders where this user is assigned as the provider
      const providerRides = (res.data || []).filter((o: any) => 
        o.orderItems?.some((item: any) => item.isService) && (o.provider === user?._id || !o.provider)
      );
      setRides(providerRides);

      const me = userRes.data.find((u: any) => u._id === user?._id);
      if (me) setKycDocs(me.profileDocuments || []);
    } catch (err) {
      console.warn("Could not fetch provider missions", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRides();
  }, [user]);

  const toggleOnline = async () => {
    try {
      const newStatus = !isOnline;
      await api.put('/users/profile', { isOnline: newStatus });
      setIsOnline(newStatus);
      Alert.alert('Status Updated', newStatus ? "You are now ONLINE. Searching for missions..." : "You are now OFFLINE.");
    } catch (err) {
      Alert.alert('Error', "Status update failed");
      setIsOnline(!isOnline); // optimistic update rollback if api fails
    }
  };

  const completeMission = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      Alert.alert('Success', 'Mission marked as completed!');
      fetchRides();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to complete mission.');
    }
  };

  const simulateUploadKYC = () => {
    Alert.alert('KYC Upload', 'Uploading your service credentials securely...');
    setTimeout(async () => {
      try {
        const newDocs = [...kycDocs, { name: 'Service License / Aadhar', url: 'https://placeholder.com/doc', type: 'credential', uploadedAt: new Date() }];
        await api.put('/users/profile', { profileDocuments: newDocs });
        Alert.alert('Success', 'Document uploaded and awaiting admin verification.');
        fetchRides();
      } catch (e) {
        Alert.alert('Error', 'Upload failed');
      }
    }, 1500);
  };

  const tabs = ['Overview', 'Missions', 'Earnings', 'Profile', 'KYC'];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]"></View>
      <View className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></View>

      <View className="pt-12 pb-4 px-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-10">
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Operations</Text>
            <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Welcome, <Text className="text-primary">{user?.firstName}</Text></Text>
          </View>
        </View>

        {/* Online Status Toggle inside Header */}
        <View className="bg-white dark:bg-dark-card p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl flex-row items-center justify-between mb-2">
          <View className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${isOnline ? 'bg-green-500/10' : 'bg-slate-50 dark:bg-dark-bg'}`}>
            <View className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-slate-400'}`} />
            <Text className={`text-[9px] font-black uppercase tracking-widest ${isOnline ? 'text-green-500' : 'text-slate-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={toggleOnline}
            className={`px-6 py-3 rounded-xl ${isOnline ? 'bg-slate-900 dark:bg-slate-800' : 'bg-primary'}`}
          >
            <Text className="text-[9px] font-black text-white uppercase tracking-widest">
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-4">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full mr-2 transition-all ${activeTab === tab ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        >
          {activeTab === 'Overview' && (
            <View>
              {/* Stats Grid */}
              <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                  <Wallet color="#22c55e" size={24} className="mb-3" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</Text>
                  <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">₹1,240</Text>
                </View>
                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                  <Navigation color="#3b82f6" size={24} className="mb-3" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Missions</Text>
                  <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{rides.length}</Text>
                </View>
                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                  <Clock color="#eab308" size={24} className="mb-3" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hours</Text>
                  <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">5.2h</Text>
                </View>
                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                  <ShieldCheck color="#2563eb" size={24} className="mb-3" />
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</Text>
                  <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">4.95</Text>
                </View>
              </View>

              {/* Recent Activity Feed */}
              <View className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-6 mb-8">
                <View className="flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    Active <Text className="text-primary">Missions</Text>
                  </Text>
                  <Bell size={20} color="#94a3b8" />
                </View>

                <View className="space-y-4">
                  {rides.map((ride: any) => (
                    <View key={ride.id} className="bg-slate-50 dark:bg-dark-bg p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-row items-center gap-4">
                          <View className="w-12 h-12 bg-white dark:bg-dark-card rounded-2xl items-center justify-center border border-slate-200 dark:border-slate-700">
                            <Navigation size={20} color="#2563eb" />
                          </View>
                          <View>
                            <Text className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{ride.user || ride.user?.firstName || 'Client'}</Text>
                            <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{ride.time || new Date().toLocaleDateString()}</Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <Text className="text-lg font-black text-primary mb-1">₹{ride.fare || ride.totalPrice || 150}</Text>
                          <View className={`px-3 py-1 rounded-full ${ride.status === 'Completed' || ride.isDelivered ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                            <Text className={`text-[8px] font-black uppercase tracking-[0.2em] ${ride.status === 'Completed' || ride.isDelivered ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {ride.status || (ride.isDelivered ? 'Completed' : 'Pending')}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className="bg-white dark:bg-dark-card p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex-row items-center gap-2 mt-4">
                        <MapPin size={12} color="#94a3b8" />
                        <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-1" numberOfLines={1}>
                          {ride.from || 'Origin'} → {ride.to || 'Destination'}
                        </Text>
                      </View>

                      {ride.status !== 'Completed' && !ride.isDelivered && (
                        <TouchableOpacity 
                          onPress={() => completeMission(ride._id)}
                          className="mt-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 items-center shadow-sm"
                        >
                          <Text className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mark as Completed</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  {rides.length === 0 && (
                    <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center py-4">No active missions detected.</Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Missions' && (
            <View className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-slate-100 dark:bg-dark-card rounded-full flex items-center justify-center mb-6">
                <Navigation size={40} color="#94a3b8" />
              </View>
              <Text className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Mission History</Text>
              <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">You have completed 12 missions.</Text>
            </View>
          )}

          {activeTab === 'Earnings' && (
            <View className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <Wallet size={40} color="#10b981" />
              </View>
              <Text className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Total Payouts</Text>
              <Text className="text-4xl font-black text-emerald-500 tracking-tighter">₹1,240</Text>
            </View>
          )}

          {activeTab === 'Profile' && (
            <View className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <User size={40} color="#2563eb" />
              </View>
              <Text className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Service Profile</Text>
              <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">{user?.email}</Text>
            </View>
          )}
          {activeTab === 'KYC' && (
          <View className="space-y-6 pb-12 mt-4 px-2">
            <View className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 items-center text-center shadow-xl">
              <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                <ShieldCheck color="#2563eb" size={40} />
              </View>
              <Text className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter mb-2">Service Partner KYC</Text>
              <Text className="text-slate-500 text-xs text-center mb-8 px-4 leading-relaxed">
                Upload your trade license and identification documents to securely access the FIC network.
              </Text>
              <TouchableOpacity onPress={simulateUploadKYC} className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-lg shadow-primary/30">
                <UploadCloud color="white" size={18} />
                <Text className="text-white font-black text-xs uppercase tracking-widest">Upload Credentials</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight ml-2 mt-4">Verification Records</Text>
            {kycDocs.map((doc: any, i) => (
              <View key={i} className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex-row items-center shadow-sm mb-2">
                <View className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl items-center justify-center mr-4">
                  <FileText color="#64748b" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-white font-black text-xs tracking-wider">{doc.name || 'Credential'}</Text>
                  <Text className="text-orange-500 text-[10px] uppercase font-bold mt-1">Pending Review</Text>
                </View>
                <CheckCircle2 color="#2563eb" size={18} />
              </View>
            ))}
            {kycDocs.length === 0 && <Text className="text-slate-500 text-xs italic text-center py-4">No documents uploaded yet.</Text>}
          </View>
        )}

      </ScrollView>
      )}
    </View>
  );
}
