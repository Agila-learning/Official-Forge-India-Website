import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
  Modal, Alert, ActivityIndicator, TextInput, Platform, BackHandler, Image, Linking
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  Power, Navigation2, MapPin, IndianRupee, Star, TrendingUp,
  Car, Phone, CheckCircle, AlertCircle, X, Clock, Loader, User, Zap, Wallet, ChevronRight, ShieldAlert, Compass, Target
} from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Drawer } from 'expo-router/drawer';

let MapView: any = null;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}

const STEPS = [
  { status: 'Driver Assigned', label: 'Navigate to Pickup', action: 'I arrived at Pickup', next: 'Driver Reached Pickup', color: '#2563eb' },
  { status: 'Driver Reached Pickup', label: 'Waiting for Customer', action: 'Start Trip (Enter OTP)', next: 'Ride Started', color: '#d97706' },
  { status: 'Ride Started', label: 'On Route to Destination', action: 'Complete Trip', next: 'Completed', color: '#16a34a' }
];

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

export default function DriverDashboardScreen() {
  const { user } = useContext(AuthContext);

  const [isOnline, setIsOnline] = useState(false);
  const [radarRides, setRadarRides] = useState<any[]>([]);
  const [myRides, setMyRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [stats, setStats] = useState({ earnings: 1450, rides: 8, rating: 4.9, acceptance: 92 });
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('radar'); // 'radar' or 'history'
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert('Hold On!', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      });
      return () => sub.remove();
    }, [])
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isOnline && !activeRide) {
      fetchRadarRides();
      pollRef.current = setInterval(fetchRadarRides, 10000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
      if (!isOnline) setRadarRides([]);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [isOnline, activeRide]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setIsOnline(data.isOnline || false);
      fetchActiveRide();
    } catch { /* silent */ }
  };

  const fetchActiveRide = async () => {
    try {
      const { data } = await api.get('/orders/partner/me');
      setMyRides(data);
      const found = data.find((r: any) => STEPS.some(s => s.status === r.status));
      setActiveRide(found || null);
    } catch { /* silent */ }
  };

  const fetchRadarRides = async () => {
    try {
      const { data } = await api.get('/rides/nearby');
      setRadarRides(data);
    } catch { /* silent */ }
  };

  const toggleOnline = async () => {
    if (activeRide) return Alert.alert('Active Ride', 'Complete the current ride before going offline.');
    try {
      const newStatus = !isOnline;
      await api.put('/users/driver/status', { isOnline: newStatus });
      setIsOnline(newStatus);
    } catch {
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  const acceptRide = async (rideId: string) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/rides/${rideId}/accept`);
      setActiveRide(data);
      setRadarRides([]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to accept ride.');
      fetchRadarRides();
    } finally { setLoading(false); }
  };

  const updateStatus = async (nextStatus: string) => {
    if (nextStatus === 'Ride Started' && !otpInput.trim()) {
      return Alert.alert('OTP Required', 'Enter the 4-digit OTP to start the ride.');
    }
    setLoading(true);
    try {
      const payload: any = { status: nextStatus };
      if (nextStatus === 'Ride Started') payload.otp = otpInput.trim();
      const { data } = await api.put(`/rides/${activeRide._id}/status`, payload);

      if (nextStatus === 'Completed') {
        Alert.alert('🎉 Ride Completed!', 'Ride fare has been added to your wallet.');
        setActiveRide(null);
        setOtpInput('');
        fetchProfile();
      } else {
        setActiveRide(data);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status.');
    } finally { setLoading(false); }
  };

  if (user?.role !== 'Driver') {
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <Car size={64} color="#3b82f6" />
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-3xl text-center mt-4">DRIVERS ONLY</Text>
      </View>
    );
  }

  const step = STEPS.find(s => s.status === activeRide?.status);

  return (
    <View className="flex-1 bg-[#0a0f1e]">
      
      {/* ── Top Header (Uber Style) ── */}
      <View className="pt-14 pb-4 px-6 bg-[#13192b] rounded-b-[2rem] shadow-xl z-20">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-2xl tracking-tighter">₹{stats.earnings.toFixed(2)}</Text>
            <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-blue-500 text-[10px] uppercase tracking-[0.2em]">Today's Earnings</Text>
          </View>
          <TouchableOpacity 
            onPress={toggleOnline}
            className={`w-16 h-8 rounded-full justify-center px-1 ${isOnline ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <View className={`w-6 h-6 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-8' : 'translate-x-0'}`} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
          <View className="items-center">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-lg">{stats.rides}</Text>
            <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest">Trips</Text>
          </View>
          <View className="w-[1px] bg-white/10" />
          <View className="items-center">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-lg flex-row items-center">
               <Star size={12} color="#facc15" fill="#facc15" /> {stats.rating}
            </Text>
            <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest">Rating</Text>
          </View>
          <View className="w-[1px] bg-white/10" />
          <View className="items-center">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-lg">{stats.acceptance}%</Text>
            <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest">Acceptance</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchProfile()} tintColor="#3b82f6" />}>
        
        {activeRide ? (
          /* ── ACTIVE RIDE WORKFLOW ── */
          <View className="bg-[#13192b] rounded-[2.5rem] p-6 shadow-xl border border-white/5 mb-10">
            <View className="flex-row justify-between items-start mb-6">
              <View className="bg-blue-600/20 px-3 py-1.5 rounded-lg border border-blue-600/30">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-400 text-[9px] uppercase tracking-widest">{activeRide.status}</Text>
              </View>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-2xl">₹{activeRide.estimatedFare}</Text>
            </View>

            {/* Customer Info */}
            <View className="flex-row items-center gap-4 bg-black/20 p-4 rounded-2xl mb-6">
              <View className="w-12 h-12 bg-indigo-600 rounded-full items-center justify-center">
                 <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xl">{activeRide.customer?.firstName?.[0] || 'C'}</Text>
              </View>
              <View className="flex-1">
                 <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-lg">{activeRide.customer?.firstName || 'Customer'}</Text>
                 <View className="flex-row items-center mt-1">
                   <Star size={10} color="#facc15" fill="#facc15" />
                   <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400 text-[10px] ml-1">4.9 • 32 Trips</Text>
                 </View>
              </View>
              <View className="flex-row gap-2">
                 <TouchableOpacity onPress={() => Linking.openURL('tel:9999999999')} className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center">
                   <Phone size={16} color="#4ade80" />
                 </TouchableOpacity>
              </View>
            </View>

            {/* Locations */}
            <View className="pl-2 ml-4 border-l-2 border-white/10 space-y-6 mb-8 relative">
              <View>
                <View className="absolute -left-[14px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#13192b]" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Pickup</Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-sm leading-tight">{activeRide.pickupLocation?.address}</Text>
              </View>
              <View>
                <View className="absolute -left-[14px] top-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#13192b]" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Drop-off</Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-sm leading-tight">{activeRide.dropoffLocation?.address}</Text>
              </View>
            </View>

            {/* Actions */}
            <View className="space-y-4">
              {step?.status === 'Driver Reached Pickup' && (
                <View className="items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                  <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400 text-[9px] uppercase tracking-widest mb-2">Customer OTP Required</Text>
                  <TextInput
                    style={{ fontFamily: 'Outfit_900Black' }}
                    className="w-32 bg-[#0a0f1e] text-white text-2xl text-center rounded-xl p-3 border border-white/10"
                    placeholder="----"
                    placeholderTextColor="#334155"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otpInput}
                    onChangeText={setOtpInput}
                  />
                </View>
              )}

              <TouchableOpacity 
                onPress={() => updateStatus(step?.next || 'Completed')}
                disabled={loading}
                className="w-full bg-blue-600 rounded-2xl py-4 items-center justify-center shadow-lg shadow-blue-600/30 flex-row gap-2 active:bg-blue-700"
              >
                {loading ? <ActivityIndicator color="white" /> : (
                  <>
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs uppercase tracking-widest">{step?.action}</Text>
                    <ChevronRight size={16} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-red-500/10 rounded-2xl py-4 items-center justify-center border border-red-500/20 flex-row gap-2">
                <ShieldAlert size={14} color="#ef4444" />
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-[10px] uppercase tracking-widest">SOS / Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── RADAR VIEW ── */
          <View>
            {!isOnline ? (
              <View className="items-center justify-center py-20 bg-[#13192b] rounded-[3rem] border border-dashed border-white/10 mt-6">
                <Power size={48} color="#334155" />
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-500 text-xl tracking-tighter mt-4">YOU ARE OFFLINE</Text>
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-600 text-[10px] uppercase tracking-widest mt-2">Go online to receive ride requests</Text>
              </View>
            ) : radarRides.length === 0 ? (
              <View className="items-center justify-center h-80 bg-[#13192b] rounded-[3rem] border border-white/5 mt-6 relative overflow-hidden">
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
                <View className="absolute inset-0 bg-black/40" />
                <View className="absolute inset-0 items-center justify-center pointer-events-none">
                  <View className="w-64 h-64 border border-blue-500/20 rounded-full absolute" />
                  <View className="w-32 h-32 border border-blue-500/40 rounded-full absolute" />
                  <View className="w-12 h-12 bg-blue-500/20 rounded-full absolute items-center justify-center">
                    <Compass size={24} color="#3b82f6" />
                  </View>
                </View>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-500 text-lg tracking-tighter mt-32 z-10 bg-black/50 px-4 py-1 rounded-full">SCANNING AREA...</Text>
              </View>
            ) : (
              <View className="space-y-4">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xl tracking-tighter mb-2">Live Requests</Text>
                {radarRides.map(req => (
                  <View key={req._id} className="bg-[#13192b] rounded-[2rem] p-5 shadow-xl border border-blue-500/30 mb-4 relative overflow-hidden">
                    <View className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
                    
                    <View className="flex-row justify-between items-start mb-6">
                      <View>
                        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-3xl tracking-tighter">₹{req.estimatedFare}</Text>
                        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Est. Fare</Text>
                      </View>
                      <View className="items-end">
                        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-400 text-lg">3.2 km</Text>
                        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-[9px] uppercase tracking-widest">8 Min Away</Text>
                      </View>
                    </View>

                    <View className="space-y-4 mb-6">
                      <View className="flex-row items-center gap-3">
                        <View className="w-2 h-2 bg-blue-500 rounded-full" />
                        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-300 text-xs flex-1" numberOfLines={1}>{req.pickupLocation?.address}</Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <View className="w-2 h-2 bg-orange-500 rounded-full" />
                        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-300 text-xs flex-1" numberOfLines={1}>{req.dropoffLocation?.address}</Text>
                      </View>
                    </View>

                    <View className="flex-row gap-3">
                      <TouchableOpacity 
                        onPress={() => setRadarRides(radarRides.filter(r => r._id !== req._id))}
                        className="flex-1 bg-white/5 py-4 rounded-xl items-center justify-center active:bg-white/10"
                      >
                        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-400 text-[11px] uppercase tracking-[0.2em]">Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => acceptRide(req._id)}
                        className="flex-1 bg-blue-600 py-4 rounded-xl items-center justify-center active:bg-blue-700 shadow-lg shadow-blue-600/20"
                      >
                        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-[11px] uppercase tracking-[0.2em]">Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── HISTORY TAB ── */}
        {(!activeRide && view === 'history') && (
          <View className="space-y-4">
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xl tracking-tighter mb-2">Completed Trips</Text>
            {myRides.filter((r: any) => r.status === 'Completed').map((req, i) => (
              <View key={i} className="bg-[#13192b] rounded-[2rem] p-5 border border-white/5 mb-4">
                <View className="flex-row justify-between items-center mb-4">
                   <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xl">₹{req.totalPrice || req.estimatedFare}</Text>
                   <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                     <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-green-500 text-[10px] uppercase tracking-widest">Completed</Text>
                   </View>
                </View>
                <View className="flex-row items-center gap-3">
                   <MapPin size={14} color="#64748b" />
                   <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-slate-400 text-xs flex-1" numberOfLines={1}>{req.dropoffLocation?.address}</Text>
                </View>
              </View>
            ))}
            {myRides.filter((r: any) => r.status === 'Completed').length === 0 && (
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-center mt-10">No completed trips yet.</Text>
            )}
          </View>
        )}

        {/* ── WALLET TAB ── */}
        {(!activeRide && view === 'wallet') && (
          <View className="space-y-6">
             <View className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2rem] shadow-xl border border-blue-500/30 relative overflow-hidden">
                <Wallet className="absolute top-8 right-8 opacity-20" size={64} color="white" />
                <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-blue-200 text-[10px] uppercase tracking-[0.2em] mb-2">Available Balance</Text>
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-5xl tracking-tighter mb-8">₹{stats.earnings.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => Alert.alert('Withdrawal Request', 'Funds will be transferred to your registered account.')} className="bg-white/20 py-4 rounded-xl items-center border border-white/30">
                   <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-[11px] uppercase tracking-widest">Withdraw Earnings</Text>
                </TouchableOpacity>
             </View>
          </View>
        )}
        <View className="h-20" />
      </ScrollView>

      {/* ── BOTTOM TAB NAVIGATION ── */}
      {!activeRide && (
        <View className="absolute bottom-0 left-0 right-0 bg-[#0a0f1e]/90 p-4 border-t border-white/5 flex-row justify-around">
           <TouchableOpacity onPress={() => setView('radar')} className="items-center opacity-100">
              <Compass size={24} color={view === 'radar' ? "#3b82f6" : "#64748b"} />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className={`text-[9px] uppercase tracking-widest mt-1 ${view === 'radar' ? 'text-blue-500' : 'text-slate-500'}`}>Radar</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setView('wallet')} className="items-center opacity-100">
              <Wallet size={24} color={view === 'wallet' ? "#3b82f6" : "#64748b"} />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className={`text-[9px] uppercase tracking-widest mt-1 ${view === 'wallet' ? 'text-blue-500' : 'text-slate-500'}`}>Wallet</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setView('history')} className="items-center opacity-100">
              <Clock size={24} color={view === 'history' ? "#3b82f6" : "#64748b"} />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className={`text-[9px] uppercase tracking-widest mt-1 ${view === 'history' ? 'text-blue-500' : 'text-slate-500'}`}>History</Text>
           </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
