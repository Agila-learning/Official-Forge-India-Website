import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Alert, BackHandler } from 'react-native';
import { CheckCircle2, TrendingUp, Bell, Menu, CheckCircle, Package, Zap, X, ShieldCheck, UploadCloud, FileText } from 'lucide-react-native';
import { Drawer } from 'expo-router/drawer';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function DeliveryDashboard() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [kycDocs, setKycDocs] = useState<any[]>([]);

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

  const fetchOrders = async () => {
    try {
      const [ordRes, userRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);
      const myOrders = ordRes.data.filter((o: any) => 
        (o.deliveryPartner?._id || o.deliveryPartner) === user?._id
      );
      setOrders(myOrders);

      const me = userRes.data.find((u: any) => u._id === user?._id);
      if (me) setKycDocs(me.profileDocuments || []);
    } catch (err) {
      console.warn('Orders fetch failed');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const markDelivered = async (id: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status: 'Delivered' });
      Alert.alert('Success', 'Order marked as Delivered!');
      fetchOrders();
    } catch(err) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const simulateUploadKYC = () => {
    Alert.alert('KYC Upload', 'Uploading your identity credential securely...');
    setTimeout(async () => {
      try {
        const newDocs = [...kycDocs, { name: 'Driver License', url: 'https://placeholder.com/doc', type: 'credential', uploadedAt: new Date() }];
        await api.put('/users/profile', { profileDocuments: newDocs });
        Alert.alert('Success', 'Document uploaded and awaiting admin verification.');
        fetchOrders();
      } catch (e) {
        Alert.alert('Error', 'Upload failed');
      }
    }, 1500);
  };

  const activeOrders = orders.filter((o: any) => o.status !== 'Completed' && o.status !== 'Delivered');
  const completedOrders = orders.filter((o: any) => o.status === 'Completed' || o.status === 'Delivered');
  const stats = {
    total: orders.length,
    delivered: completedOrders.length,
    pending: activeOrders.length,
    earnings: completedOrders.length * 45
  };
  const successRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 100;
  const aiScore = Math.min(99, Math.max(80, successRate - 2));

  return (
    <View className="flex-1 bg-slate-50 relative">
      <Drawer.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-slate-50 flex-row justify-between items-center z-10">
        <TouchableOpacity onPress={() => (navigation as any).openDrawer()}>
          <Menu color="#0f172a" size={24} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-900 text-[15px] uppercase tracking-wider">MANAGEMENT HUB</Text>
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <Bell color="#0f172a" size={20} />
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </View>
          <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
            <Image source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=Delivery&background=0D8ABC&color=fff' }} className="w-full h-full" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}>
        
        {/* Navigation Tabs */}
        <View className="flex-row mb-6 border-b border-slate-200 pb-2">
          <TouchableOpacity onPress={() => setActiveTab('overview')} className={`mr-6 ${activeTab === 'overview' ? 'border-b-2 border-orange-500' : ''}`}>
             <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'overview' ? 'text-orange-500' : 'text-slate-400'}`}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('orders')} className={`mr-6 ${activeTab === 'orders' ? 'border-b-2 border-orange-500' : ''}`}>
             <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'orders' ? 'text-orange-500' : 'text-slate-400'}`}>Pending Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('kyc')} className={`mr-6 ${activeTab === 'kyc' ? 'border-b-2 border-orange-500' : ''}`}>
             <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'kyc' ? 'text-orange-500' : 'text-slate-400'}`}>KYC Vault</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <View>
            {/* Status Bar Card */}
            <View className="bg-white rounded-[1rem] border border-slate-100 px-4 py-3 flex-row justify-between items-center mb-4 shadow-sm">
              <View className="flex-row items-center gap-3">
                <View className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] uppercase tracking-widest text-slate-500">
                  {isOnline ? 'Online & Receiving Missions' : 'Offline Mode Active'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsOnline(!isOnline)} className="px-3 py-1.5 rounded-lg bg-red-50">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] uppercase tracking-widest text-red-600">
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Earnings Card */}
            <View className="bg-white rounded-[1rem] border border-slate-100 mb-4 overflow-hidden shadow-sm relative">
              <View className="absolute right-0 top-0 bottom-0 w-[5px] bg-orange-600 z-10" />
              <View className="p-5">
                <View className="flex-row justify-between items-start mb-2">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-500 uppercase tracking-widest">Today's Total Earnings</Text>
                  <View className="bg-green-50 px-2 py-1 rounded flex-row items-center gap-1">
                    <TrendingUp size={10} color="#16a34a" />
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-green-700">+12%</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[2.5rem] leading-[3rem] text-slate-900 tracking-tighter mb-4">₹{stats.earnings}</Text>
                <View className="border-t border-slate-100 pt-4 flex-row justify-between items-center">
                  <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[11px] text-slate-400">Last update: Just now</Text>
                  <TouchableOpacity onPress={() => setActiveTab('orders')}>
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[11px] text-orange-600 pr-2">View Missions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 3-Box Stats Grid */}
            <View className="flex-row justify-between gap-3 mb-4">
              <View className="flex-1 bg-white p-4 rounded-[1rem] border border-slate-100 shadow-sm">
                <View className="w-7 h-7 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle size={16} color="#16a34a" />
                </View>
                <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-2xl text-slate-900 mb-0.5 leading-none">{stats.delivered}</Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Completed</Text>
              </View>
              
              <TouchableOpacity onPress={() => setActiveTab('orders')} className="flex-1 bg-white p-4 rounded-[1rem] border border-slate-100 shadow-sm active:bg-slate-50">
                <View className="w-7 h-7 rounded-full flex items-center justify-center mb-3">
                  <Package size={16} color="#ea580c" />
                </View>
                <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-2xl text-slate-900 mb-0.5 leading-none">{stats.pending}</Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Pending</Text>
              </TouchableOpacity>

              <View className="flex-1 bg-white p-4 rounded-[1rem] border border-slate-100 shadow-sm">
                <View className="w-7 h-7 rounded-full flex items-center justify-center mb-3">
                  <Zap size={16} color="#3b82f6" />
                </View>
                <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-2xl text-slate-900 mb-0.5 leading-none">{aiScore}<Text className="text-[10px] text-slate-400"> /100</Text></Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">AI Prod.</Text>
              </View>
            </View>

            {/* Weekly Performance Placeholder */}
            <View className="bg-white rounded-[1rem] border border-slate-100 p-5 mb-4 shadow-sm overflow-hidden">
              <View className="flex-row justify-between items-center mb-8">
                <View className="flex-row items-center gap-2">
                  <TrendingUp size={14} color="#ea580c" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-slate-900 uppercase tracking-widest">Weekly Performance</Text>
                </View>
                <View className="bg-slate-50 px-2 py-1 rounded flex-row items-center">
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-600">This Week</Text>
                </View>
              </View>
              
              {/* Simulated Line Chart using basic views */}
              <View className="h-28 relative mb-2 flex-row items-end justify-between px-2">
                {[20, 30, 20, 50, 40, 60, 40].map((h, idx) => (
                  <View key={idx} className="items-center z-10" style={{ height: `${h}%` }}>
                    <View className="w-2.5 h-2.5 rounded-full border-2 border-orange-500 bg-white" />
                    <View className="w-px h-full bg-slate-100 absolute top-2.5 -z-10" />
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center px-1 border-t border-slate-50 pt-3">
                 {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                   <Text key={day} style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-400">{day}</Text>
                 ))}
              </View>
            </View>

            {/* Delivery Success Rate */}
            <View className="bg-white rounded-[1rem] border border-slate-100 p-8 mb-8 shadow-sm items-center">
              <View className="w-[140px] h-[140px] rounded-full border-[8px] border-green-500 flex items-center justify-center mb-6 shadow-sm">
                 <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-4xl text-slate-900 tracking-tighter">{successRate}%</Text>
                 <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-green-600 uppercase tracking-widest mt-1">Success</Text>
              </View>
              
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-slate-900 mb-6">Delivery Success Rate</Text>
              
              <View className="bg-green-50/50 w-full p-5 rounded-[1rem] items-center border border-green-500/10">
                 <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[13px] text-green-800 text-center leading-tight">
                   Excellent work! You're in the top 5% of fleet operators this month.
                 </Text>
              </View>
            </View>
          </View>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <View className="pb-8">
            {activeOrders.map((order: any) => (
              <View key={order._id} className="bg-white p-5 rounded-2xl border border-slate-200 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900">Order #{order._id.substring(0, 6).toUpperCase()}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500">To: {order.shippingAddress?.address || 'Customer Address'}</Text>
                  </View>
                  <View className="bg-orange-50 px-2 py-1 rounded">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-orange-600 uppercase tracking-widest">{order.status || 'Assigned'}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <TouchableOpacity 
                    onPress={() => markDelivered(order._id)} 
                    className="flex-1 bg-green-600 p-3 rounded-xl items-center shadow-sm shadow-green-600/30"
                  >
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs uppercase tracking-widest">Mark as Delivered</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {activeOrders.length === 0 && (
              <View className="py-10 items-center justify-center">
                <Package size={48} color="#cbd5e1" className="mb-4" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400">No active missions available.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'kyc' && (
          <View className="space-y-6 pb-12 mt-4">
            <View className="bg-white p-8 rounded-[2.5rem] border border-slate-100 items-center text-center shadow-xl">
              <View className="w-20 h-20 bg-orange-500/10 rounded-full items-center justify-center mb-6">
                <ShieldCheck color="#ea580c" size={40} />
              </View>
              <Text className="text-slate-900 font-black text-xl uppercase tracking-tighter mb-2">Delivery KYC Vault</Text>
              <Text className="text-slate-500 text-xs text-center mb-8 px-4 leading-relaxed">
                Upload your driver's license and vehicle registration to maintain active fleet status.
              </Text>
              <TouchableOpacity onPress={simulateUploadKYC} className="w-full bg-orange-500 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-lg shadow-orange-500/30">
                <UploadCloud color="white" size={18} />
                <Text className="text-white font-black text-xs uppercase tracking-widest">Upload License</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-slate-900 font-black text-sm uppercase tracking-tight ml-2 mt-4">Verification Records</Text>
            {kycDocs.map((doc: any, i) => (
              <View key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center shadow-sm mb-2">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center mr-4">
                  <FileText color="#64748b" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-black text-xs tracking-wider">{doc.name || 'License'}</Text>
                  <Text className="text-orange-500 text-[10px] uppercase font-bold mt-1">Pending Review</Text>
                </View>
                <CheckCircle2 color="#ea580c" size={18} />
              </View>
            ))}
            {kycDocs.length === 0 && <Text className="text-slate-500 text-xs italic text-center py-4">No documents uploaded yet.</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
