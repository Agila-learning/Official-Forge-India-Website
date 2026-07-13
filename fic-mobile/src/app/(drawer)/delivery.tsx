import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Alert, BackHandler, TextInput, Linking, Platform } from 'react-native';

let MapView: any = null;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}
import { CheckCircle2, TrendingUp, Bell, Menu, CheckCircle, Package, Zap, X, ShieldCheck, UploadCloud, FileText, Navigation2, MapPin, Truck, Phone, Target, CreditCard, Settings, Archive } from 'lucide-react-native';
import { Drawer } from 'expo-router/drawer';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

export default function DeliveryDashboard() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [openPool, setOpenPool] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [radarRides, setRadarRides] = useState<any[]>([]);
  const [otpInput, setOtpInput] = useState('');
  const [deliveryOtpInput, setDeliveryOtpInput] = useState<{[key: string]: string}>({});

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
        api.get('/users/profile').catch(() => ({ data: null }))
      ]);
      const myOrders = ordRes.data.filter((o: any) => 
        (o.deliveryPartner?._id || o.deliveryPartner) === user?._id
      );
      const unassigned = ordRes.data.filter((o: any) => 
        !o.deliveryPartner && (o.fulfillmentType === 'Delivery Partner' || o.orderItems?.some((i: any) => i.category === 'Logistics' || i.name?.includes('Delivery')))
      );
      setOrders(myOrders);
      setOpenPool(unassigned);

      const me = userRes.data;
      if (me) {
        setKycDocs(me.profileDocuments || []);
        setIsOnline(me.isOnline ?? true);
        setWalletBalance(me.walletBalance || 0);
      }
      
      if (me?.isOnline || isOnline) {
        const radarRes = await api.get('/rides/nearby').catch(() => ({ data: [] }));
        setRadarRides(radarRes.data || []);
      } else {
        setRadarRides([]);
      }
    } catch (err) {
      console.warn('Orders fetch failed', err);
    }
  };

  const toggleOnline = async () => {
    try {
      const res = await api.put('/users/profile', { isOnline: !isOnline });
      setIsOnline(res.data.isOnline ?? !isOnline);
      if (res.data.isOnline ?? !isOnline) {
        fetchOrders();
      } else {
        setRadarRides([]);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update status');
    }
  };

  const acceptRide = async (id: string) => {
    try {
      await api.put(`/rides/${id}/accept`);
      Alert.alert('Success', 'Ride accepted! Navigating to customer...');
      fetchOrders();
      setActiveTab('orders');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to accept ride');
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/assign`, { partnerId: user?._id });
      Alert.alert('Success', 'Mission Accepted!');
      fetchOrders();
      setActiveTab('orders');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept mission');
    }
  };

  const updateRideStatus = async (id: string, status: string, isRide: boolean) => {
    try {
      if (isRide) {
        const payload: any = { status };
        if (status === 'Ride Started') {
          if (!otpInput) return Alert.alert('Error', 'Please enter OTP to start the ride.');
          payload.otp = otpInput;
        }
        await api.put(`/rides/${id}/status`, payload);
        if (status === 'Ride Started') setOtpInput('');
      } else {
        await api.put(`/orders/${id}/status`, { status });
      }
      Alert.alert('Success', `Status updated to ${status}`);
      fetchOrders();
    } catch(err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDeliveryStatus = async (id: string, currentStatus: string) => {
    let nextStatus = '';
    let payload: any = {};
    if (!currentStatus || currentStatus === 'Partner Assigned') nextStatus = 'Reached Hub';
    else if (currentStatus === 'Reached Hub') nextStatus = 'Picked Up';
    else if (currentStatus === 'Picked Up') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') {
      const pin = deliveryOtpInput[id];
      if (!pin || pin.length < 4) return Alert.alert('Error', 'Please enter the 4-digit Delivery PIN from customer.');
      nextStatus = 'Delivered';
      payload.otp = pin;
    }
    if (!nextStatus) return;
    try {
      await api.put(`/orders/${id}/status`, { status: nextStatus, ...payload });
      Alert.alert('Mission Updated', `Status: ${nextStatus}`);
      setDeliveryOtpInput(prev => ({ ...prev, [id]: '' }));
      fetchOrders();
    } catch(err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
    const baseURL = api.defaults.baseURL || 'http://localhost:5001/api';
    const SOCKET_URL = baseURL.replace('/api', '');
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      path: '/api/fic-socket/',
      transports: ['polling', 'websocket'],
    });
    
    socket.on('notification', (data) => {
      if (data.userId === user?._id || data.forRole === 'Delivery Partner') {
        fetchOrders();
        Alert.alert('Priority Alert', data.notification?.title || 'New update received.');
      }
    });

    return () => { socket.disconnect(); };
  }, [user]);

  const markDelivered = async (id: string) => {
    updateRideStatus(id, 'Delivered', false);
  };

  const rechargePocket = async () => {
    try {
      const { data } = await api.put('/users/profile', { walletBalance: walletBalance + 500 });
      setWalletBalance(data.walletBalance);
      Alert.alert('Success', '₹500 added to your pocket via demo recharge!');
    } catch (e) {
      Alert.alert('Error', 'Recharge failed');
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
        <View className="mb-6 border-b border-slate-200 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity onPress={() => setActiveTab('overview')} className={`mr-6 ${activeTab === 'overview' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'overview' ? 'text-orange-500' : 'text-slate-400'}`}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('radar')} className={`mr-6 ${activeTab === 'radar' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'radar' ? 'text-orange-500' : 'text-slate-400'}`}>Radar {radarRides.length > 0 && `(${radarRides.length})`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('orders')} className={`mr-6 ${activeTab === 'orders' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'orders' ? 'text-orange-500' : 'text-slate-400'}`}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('open-pool')} className={`mr-6 ${activeTab === 'open-pool' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'open-pool' ? 'text-orange-500' : 'text-slate-400'}`}>Pool {openPool.length > 0 && `(${openPool.length})`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('pocket')} className={`mr-6 ${activeTab === 'pocket' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'pocket' ? 'text-orange-500' : 'text-slate-400'}`}>Pocket</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('history')} className={`mr-6 ${activeTab === 'history' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'history' ? 'text-orange-500' : 'text-slate-400'}`}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('kyc')} className={`mr-6 ${activeTab === 'kyc' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'kyc' ? 'text-orange-500' : 'text-slate-400'}`}>KYC</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('bank')} className={`mr-6 ${activeTab === 'bank' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'bank' ? 'text-orange-500' : 'text-slate-400'}`}>Bank</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('settings')} className={`mr-6 ${activeTab === 'settings' ? 'border-b-2 border-orange-500 pb-1' : 'pb-1'}`}>
               <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`${activeTab === 'settings' ? 'text-orange-500' : 'text-slate-400'}`}>Settings</Text>
            </TouchableOpacity>
          </ScrollView>
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
              <TouchableOpacity onPress={toggleOnline} className={`px-3 py-1.5 rounded-lg ${isOnline ? 'bg-red-50' : 'bg-green-50'}`}>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className={`text-[9px] uppercase tracking-widest ${isOnline ? 'text-red-600' : 'text-green-600'}`}>
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

        {/* RADAR TAB */}
        {activeTab === 'radar' && (
          <View className="pb-8">
            <Text className="text-lg font-black text-slate-900 mb-4 ml-2 tracking-tighter uppercase">Incoming <Text className="text-orange-500">Missions</Text></Text>
            {radarRides.map((ride: any) => (
              <View key={ride._id} className="bg-white p-5 rounded-2xl border border-orange-200 mb-4 shadow-sm shadow-orange-500/10">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 pr-2">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900">Ride #{ride._id.substring(0, 6).toUpperCase()}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mt-1"><Text className="font-bold text-slate-700">From:</Text> {ride.pickupDetails?.location || 'Unknown'}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mt-1"><Text className="font-bold text-slate-700">To:</Text> {ride.shippingAddress?.address || 'Unknown'}</Text>
                  </View>
                  <View className="bg-orange-500 px-2 py-1 rounded">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-white uppercase tracking-widest">₹{ride.totalPrice}</Text>
                  </View>
                </View>
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity 
                    onPress={() => setRadarRides(radarRides.filter(r => r._id !== ride._id))}
                    className="flex-1 bg-slate-100 p-3 rounded-xl items-center shadow-sm"
                  >
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-500 text-xs uppercase tracking-widest">Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => acceptRide(ride._id)} 
                    className="flex-1 bg-orange-600 p-3 rounded-xl items-center shadow-sm shadow-orange-600/30"
                  >
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs uppercase tracking-widest">Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {radarRides.length === 0 && (
              <View className="py-10 items-center justify-center">
                <Zap size={48} color="#cbd5e1" className="mb-4" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400">{isOnline ? 'Scanning for nearby rides...' : 'Go Online to receive rides.'}</Text>
              </View>
            )}
          </View>
        )}

        {/* ORDERS TAB (Immersive Full Screen) */}
        {activeTab === 'orders' && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: '#fff' }}>
             
             {/* Map Area */}
             <View className="flex-1 relative">
                {Platform.OS === 'web' || !MapView ? (
                  <View className="absolute inset-0 bg-[#e2e8f0] items-center justify-center">
                    <Text className="text-slate-500 font-bold">Map Preview (Available on Mobile)</Text>
                  </View>
                ) : (
                  <MapView
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    initialRegion={{
                      latitude: 20.5937,
                      longitude: 78.9629,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}
                    customMapStyle={mapStyle}
                    showsUserLocation={true}
                  />
                )}
                {/* Animated Map Path (Fallback for MapView if needed, or overlay) */}
                {activeOrders.length > 0 && Platform.OS === 'web' && (
                  <View className="absolute inset-0 items-center justify-center pt-20 pointer-events-none">
                    <View className="w-[70%] h-[50%] border-l-4 border-b-4 border-[#2563EB] rounded-bl-[40px]" style={{ borderStyle: 'dashed' }} />
                    <View className="absolute top-[20%] right-[15%] bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                       <MapPin size={14} color="white" />
                    </View>
                    <View className="absolute bottom-[30%] left-[10%] bg-blue-500 w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                       <Truck size={14} color="white" />
                    </View>
                  </View>
                )}
             </View>

             {/* Top Overlay: Back Button & Status */}
             <View className="absolute top-12 left-5 right-5 flex-row justify-between items-start">
                <TouchableOpacity onPress={() => setActiveTab('overview')} className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg shadow-black/10">
                   <X size={24} color="#1e293b" />
                </TouchableOpacity>
                {activeOrders.length > 0 && (
                   <View className="bg-white/90 px-4 py-2 rounded-full shadow-lg border border-slate-100 flex-row items-center gap-2">
                     <View className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                     <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xs uppercase tracking-widest text-slate-800">
                        {activeOrders[0].status || 'Assigned'}
                     </Text>
                   </View>
                )}
             </View>

             {/* Bottom Sheet for Active Mission */}
             <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pt-8 pb-10">
                {activeOrders.length > 0 ? (
                  <>
                    <View className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                    
                    {/* Time & Distance */}
                    <View className="flex-row justify-between items-center mb-6">
                       <View>
                         <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-3xl text-slate-900 tracking-tighter">14 Min</Text>
                         <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-[10px] text-slate-500 uppercase tracking-widest">4.2 KM Away</Text>
                       </View>
                       <View className="bg-slate-50 p-3 rounded-2xl items-center border border-slate-100">
                         <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-lg text-green-600">₹{activeOrders[0].totalPrice}</Text>
                       </View>
                    </View>

                    {/* Customer & Location */}
                    <View className="bg-slate-50 rounded-[2rem] p-5 mb-6 border border-slate-100">
                       <View className="flex-row items-center gap-4 mb-4">
                         <View className="w-12 h-12 bg-[#2563EB]/10 rounded-full items-center justify-center border border-[#2563EB]/20">
                            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[#2563EB] text-xl">
                               {activeOrders[0].shippingAddress?.fullName?.[0] || 'C'}
                            </Text>
                         </View>
                         <View className="flex-1">
                            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900">{activeOrders[0].shippingAddress?.fullName || 'Customer'}</Text>
                            <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-xs text-slate-500 mt-0.5">Order #{activeOrders[0]._id.substring(0,6).toUpperCase()}</Text>
                         </View>
                         <TouchableOpacity onPress={() => Linking.openURL(`tel:${activeOrders[0].shippingAddress?.phone || '9999999999'}`)} className="w-12 h-12 bg-green-100 rounded-full items-center justify-center border border-green-200">
                            <Phone size={20} color="#16a34a" />
                         </TouchableOpacity>
                       </View>
                       <View className="h-px w-full bg-slate-200 mb-4" />
                       <View className="flex-row items-start gap-3">
                         <MapPin size={16} color="#ef4444" className="mt-0.5 shrink-0" />
                         <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-xs text-slate-700 flex-1 leading-tight">
                            {activeOrders[0].shippingAddress?.address}, {activeOrders[0].shippingAddress?.city}
                         </Text>
                       </View>
                    </View>

                    {/* PIN Input if Delivery */}
                    {(!activeOrders[0].isService && activeOrders[0].status === 'Out for Delivery') && (
                       <View className="mb-6 flex-row items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-600 text-xs uppercase tracking-widest">Ask for PIN:</Text>
                          <TextInput
                            className="bg-white border border-blue-200 w-24 rounded-xl py-2 text-center font-black text-xl text-slate-900 tracking-[0.2em]"
                            placeholder="----"
                            keyboardType="numeric"
                            maxLength={4}
                            value={deliveryOtpInput[activeOrders[0]._id] || ''}
                            onChangeText={(text) => setDeliveryOtpInput(prev => ({...prev, [activeOrders[0]._id]: text}))}
                          />
                       </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity
                      onPress={() => {
                        const order = activeOrders[0];
                        if (order.isService) {
                          updateRideStatus(order._id, order.status === 'Driver Assigned' ? 'Driver Arriving' : (order.status === 'Driver Arriving' ? 'Ride Started' : 'Completed'), true);
                        } else {
                          handleDeliveryStatus(order._id, order.status);
                        }
                      }}
                      className={`w-full py-5 rounded-[2rem] items-center justify-center shadow-lg ${
                         activeOrders[0].status === 'Picked Up' || activeOrders[0].status === 'Out for Delivery' ? 'bg-[#2563EB] shadow-blue-500/30' : 'bg-orange-600 shadow-orange-500/30'
                      }`}
                    >
                      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-sm uppercase tracking-widest flex-row items-center">
                         {activeOrders[0].isService ? (
                            activeOrders[0].status === 'Driver Assigned' ? 'Confirm Arrival' : 
                            (activeOrders[0].status === 'Driver Arriving' ? 'Start Trip' : 'Complete Trip')
                         ) : (
                            (!activeOrders[0].status || activeOrders[0].status === 'Partner Assigned') ? 'Confirm Hub Arrival' : 
                            (activeOrders[0].status === 'Reached Hub' ? 'Confirm Pickup' : 
                            (activeOrders[0].status === 'Picked Up' ? 'Start Route' : 'Finalize Delivery'))
                         )}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View className="items-center justify-center py-10">
                     <Package size={48} color="#cbd5e1" className="mb-4" />
                     <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-400 uppercase tracking-widest">Fleet Idle</Text>
                     <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-slate-400 text-xs mt-2">No active missions right now.</Text>
                  </View>
                )}
             </View>
          </View>
        )}

        {/* OPEN POOL TAB */}
        {activeTab === 'open-pool' && (
          <View className="pb-8">
            <Text className="text-lg font-black text-slate-900 mb-4 ml-2 tracking-tighter uppercase">Open <Text className="text-orange-500">Missions Pool</Text></Text>
            {openPool.map((poolOrder: any) => (
              <View key={poolOrder._id} className="bg-white p-5 rounded-2xl border border-blue-200 mb-4 shadow-sm shadow-blue-500/10">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 pr-2">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-sm text-slate-900">{poolOrder.orderItems?.[0]?.name || 'Logistics Mission'}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mt-1"><Text className="font-bold text-slate-700">Hub:</Text> {poolOrder.instructions?.replace('Pickup: ', '') || 'Vendor Hub'}</Text>
                    <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 mt-1"><Text className="font-bold text-slate-700">To:</Text> {poolOrder.shippingAddress?.address || 'Unknown'}, {poolOrder.shippingAddress?.city}</Text>
                  </View>
                  <View className="bg-green-100 px-2 py-1 rounded">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[10px] text-green-700 uppercase tracking-widest">₹{poolOrder.totalPrice}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => acceptOrder(poolOrder._id)} 
                  className="mt-4 bg-blue-600 p-3 rounded-xl items-center shadow-sm shadow-blue-600/30 flex-row justify-center gap-2"
                >
                  <Package size={16} color="white" />
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs uppercase tracking-widest">Accept Mission</Text>
                </TouchableOpacity>
              </View>
            ))}
            {openPool.length === 0 && (
              <View className="py-10 items-center justify-center">
                <Package size={48} color="#cbd5e1" className="mb-4" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400">No open missions available right now.</Text>
              </View>
            )}
          </View>
        )}

        {/* POCKET TAB */}
        {activeTab === 'pocket' && (
          <View className="pb-8">
            <View className="bg-slate-900 p-8 rounded-3xl mb-6 shadow-xl shadow-slate-900/30 overflow-hidden relative">
              <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></View>
              <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Available Pocket Balance</Text>
              <Text className="text-white text-5xl font-black tracking-tighter mb-4">₹{walletBalance.toFixed(2)}</Text>
              <View className="flex-row items-center mb-6">
                <View className="bg-green-500/20 px-3 py-1 rounded-lg flex-row items-center border border-green-500/30">
                  <TrendingUp size={12} color="#4ade80" />
                  <Text className="text-green-400 text-[9px] font-black uppercase tracking-widest ml-1">
                    {walletBalance >= 0 ? 'Good Standing' : 'Needs Recharge'}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={rechargePocket}
                  className="flex-1 bg-white/10 py-4 rounded-xl flex-row items-center justify-center border border-white/20"
                >
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-[10px] uppercase tracking-widest ml-2">Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Withdrawal Submitted', `₹${walletBalance.toFixed(2)} will be transferred to your registered bank account within 2-4 hours.`)}
                  className="flex-1 bg-orange-500 py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-orange-500/30"
                >
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-[10px] uppercase tracking-widest ml-2">Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="grid gap-4">
              <View className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-4">
                <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mb-4 border border-green-100">
                  <TrendingUp size={20} color="#16a34a" />
                </View>
                <Text className="text-slate-900 font-black text-xs uppercase mb-2">Online Missions</Text>
                <Text className="text-slate-500 text-[10px] leading-relaxed">
                  For prepaid missions, 80% of the total order value is instantly credited to your pocket.
                </Text>
              </View>

              <View className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mb-4 border border-red-100">
                  <Target size={20} color="#dc2626" />
                </View>
                <Text className="text-slate-900 font-black text-xs uppercase mb-2">Cash Missions</Text>
                <Text className="text-slate-500 text-[10px] leading-relaxed">
                  For COD missions, you keep 100% of the cash. We deduct our 20% platform fee from your pocket balance. Keep your balance positive to accept cash missions!
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View className="space-y-4 pb-12 mt-4">
            <Text className="text-slate-900 font-black text-sm uppercase tracking-tight ml-2">Completed Missions</Text>
            {orders.filter((o: any) => o.status === 'Completed' || o.status === 'Delivered').map((order: any, i: number) => (
              <View key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center border border-green-100">
                    <CheckCircle2 color="#16a34a" size={24} />
                  </View>
                  <View>
                    <Text className="text-slate-900 font-black text-xs tracking-wider uppercase mb-1">
                      {order.isService ? 'Ride' : 'Delivery'} #{order._id.substring(0, 6).toUpperCase()}
                    </Text>
                    <Text className="text-slate-500 text-[10px] font-medium">Earned: ₹{order.totalPrice}</Text>
                  </View>
                </View>
                <View className="bg-green-100 px-3 py-1.5 rounded-lg">
                  <Text className="text-green-700 text-[9px] font-black uppercase tracking-widest">{order.status}</Text>
                </View>
              </View>
            ))}
            {orders.filter((o: any) => o.status === 'Completed' || o.status === 'Delivered').length === 0 && (
              <View className="items-center py-10">
                <Archive color="#cbd5e1" size={40} className="mb-4" />
                <Text className="text-slate-500 text-xs italic">No completed missions yet.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'kyc' && (
          <View className="space-y-6 pb-12 mt-4">
            <View className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <View className="w-16 h-16 bg-orange-500/10 rounded-full items-center justify-center mb-6 self-center">
                <ShieldCheck color="#ea580c" size={32} />
              </View>
              <Text className="text-slate-900 font-black text-lg uppercase tracking-tighter mb-6 text-center">Identity & KYC</Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">PAN Card URL</Text>
                  <TextInput defaultValue={user?.profileDocuments?.find((d:any) => d.name === 'PAN Card')?.url} className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800" placeholder="https://..." />
                </View>
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Driving License URL</Text>
                  <TextInput defaultValue={user?.drivingLicense || user?.profileDocuments?.find((d:any) => d.name === 'Driving License')?.url} className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800" placeholder="https://..." />
                </View>
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Vehicle RC URL</Text>
                  <TextInput defaultValue={user?.vehicleRC || user?.profileDocuments?.find((d:any) => d.name === 'Vehicle RC')?.url} className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800" placeholder="https://..." />
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Success', 'KYC Documents submitted for review!')} className="w-full bg-orange-500 py-4 rounded-2xl items-center mt-2 shadow-lg shadow-orange-500/30">
                  <Text className="text-white font-black text-xs uppercase tracking-widest">Submit KYC</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'bank' && (
          <View className="space-y-6 pb-12 mt-4">
            <View className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <View className="w-16 h-16 bg-blue-500/10 rounded-full items-center justify-center mb-6 self-center">
                <CreditCard color="#3b82f6" size={32} />
              </View>
              <Text className="text-slate-900 font-black text-lg uppercase tracking-tighter mb-6 text-center">Payout Settings</Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Account Holder Name</Text>
                  <TextInput className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800 font-bold" placeholder="JOHN DOE" />
                </View>
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Account Number</Text>
                  <TextInput keyboardType="number-pad" className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800 font-bold" placeholder="0000000000" />
                </View>
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">IFSC Code</Text>
                  <TextInput autoCapitalize="characters" className="w-full bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 text-xs text-slate-800 font-bold" placeholder="SBIN000XXXX" />
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Success', 'Bank details updated!')} className="w-full bg-blue-600 py-4 rounded-2xl items-center mt-2 shadow-lg shadow-blue-600/30">
                  <Text className="text-white font-black text-xs uppercase tracking-widest">Save Bank Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View className="space-y-4 pb-12 mt-4">
            <Text className="text-slate-900 font-black text-sm uppercase tracking-tight ml-2 mb-2">Preferences</Text>
            
            <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row justify-between items-center mb-3">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <Bell color="#475569" size={18} />
                </View>
                <View>
                  <Text className="text-slate-900 font-black text-xs uppercase mb-1">Push Notifications</Text>
                  <Text className="text-slate-500 text-[10px]">Receive mission alerts</Text>
                </View>
              </View>
              <View className="w-12 h-6 bg-green-500 rounded-full p-1 justify-center items-end">
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </View>
            </View>

            <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row justify-between items-center mb-3">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                  <MapPin color="#475569" size={18} />
                </View>
                <View>
                  <Text className="text-slate-900 font-black text-xs uppercase mb-1">Live Location Sharing</Text>
                  <Text className="text-slate-500 text-[10px]">Allow customers to track you</Text>
                </View>
              </View>
              <View className="w-12 h-6 bg-green-500 rounded-full p-1 justify-center items-end">
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </View>
            </View>
            
            <TouchableOpacity onPress={() => (navigation as any).openDrawer()} className="bg-slate-900 p-5 rounded-3xl mt-4 flex-row justify-center items-center gap-3">
              <Settings color="white" size={18} />
              <Text className="text-white font-black text-xs uppercase tracking-widest">Advanced Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
