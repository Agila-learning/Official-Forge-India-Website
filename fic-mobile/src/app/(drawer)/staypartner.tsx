import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, Image, BackHandler } from 'react-native';
import { Building, UserCheck, Wallet, Calendar, Star, MapPin, Plus, X, Home, ShieldCheck, UploadCloud, FileText, CheckCircle2, Trash2 } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';
export default function StayPartnerDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Overview');
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add Property State
  const [showAddModal, setShowAddModal] = useState(false);

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
  const [propForm, setPropForm] = useState({
    title: '', price: '', type: 'PG', rooms: '', location: ''
  });

  const fetchStayData = async () => {
    try {
      const [prodRes, ordRes, userRes] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);

      // Filter PGs by this owner
      const myPGs = (prodRes.data || []).filter((p: any) => 
        (p.vendor === user?._id || p.seller === user?._id) && ['PG', 'Hotel', 'Rentals', 'PG / Hostel'].includes(p.propertyType || p.category)
      );
      
      // Filter Orders that book these PGs
      const myBookings = (ordRes.data || []).filter((o: any) => 
        o.orderItems?.some((item: any) => myPGs.some((pg: any) => pg._id === item.product))
      );

      setProperties(myPGs);
      setBookings(myBookings);

      const me = userRes.data.find((u: any) => u._id === user?._id);
      if (me) setKycDocs(me.profileDocuments || []);

    } catch (e) {
      console.warn("Failed fetching stay partner data", e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStayData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStayData();
  }, [user]);

  const handleAddProperty = async () => {
    try {
      const payload = {
        name: propForm.title,
        price: propForm.price,
        countInStock: propForm.rooms,
        category: 'PG / Hostel',
        propertyType: propForm.type,
        location: propForm.location,
        isService: false,
        vendor: user?._id
      };
      await api.post('/products', payload);
      Alert.alert('Success', 'Property listed successfully!');
      setShowAddModal(false);
      fetchStayData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add property');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await api.delete('/products/' + id);
      Alert.alert('Success', 'Property removed');
      fetchStayData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete property');
    }
  };

  const stats = {
    occupancy: '85%',
    revenue: '₹' + bookings.filter((o: any) => o.isPaid).reduce((acc, o: any) => acc + (o.totalPrice || 0), 0).toLocaleString(),
    activeBookings: bookings.length || 0,
    rating: 4.8
  };

  const simulateUploadKYC = () => {
    Alert.alert('KYC Upload', 'Uploading your property licensing securely...');
    setTimeout(async () => {
      try {
        const newDocs = [...kycDocs, { name: 'Property Deed / Trade License', url: 'https://placeholder.com/doc', type: 'credential', uploadedAt: new Date() }];
        await api.put('/users/profile', { profileDocuments: newDocs });
        Alert.alert('Success', 'Document uploaded and awaiting admin verification.');
        fetchStayData();
      } catch (e) {
        Alert.alert('Error', 'Upload failed');
      }
    }, 1500);
  };

  const tabs = ['Overview', 'Properties', 'Bookings', 'KYC'];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <View className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></View>
      
      <View className="pt-12 pb-4 px-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-10">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="self-start px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 flex-row items-center gap-1.5 mb-2">
              <Building color="#3b82f6" size={10} />
              <Text className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Hospitality Command</Text>
            </View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Stay <Text className="text-blue-500">Intel.</Text>
            </Text>
          </View>
          {activeTab === 'Properties' && (
            <TouchableOpacity onPress={() => setShowAddModal(true)} className="bg-blue-600 w-10 h-10 rounded-xl items-center justify-center shadow-lg shadow-blue-600/30">
              <Plus color="white" size={20} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full mr-2 transition-all ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                <View className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center mb-4">
                  <UserCheck color="#3b82f6" size={20} />
                </View>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</Text>
                <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.occupancy}</Text>
              </View>
              <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                <View className="w-10 h-10 bg-emerald-500/10 rounded-xl items-center justify-center mb-4">
                  <Wallet color="#10b981" size={20} />
                </View>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</Text>
                <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.revenue}</Text>
              </View>
              <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                <View className="w-10 h-10 bg-purple-500/10 rounded-xl items-center justify-center mb-4">
                  <Calendar color="#a855f7" size={20} />
                </View>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bookings</Text>
                <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.activeBookings}</Text>
              </View>
              <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                <View className="w-10 h-10 bg-amber-500/10 rounded-xl items-center justify-center mb-4">
                  <Star color="#f59e0b" size={20} />
                </View>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</Text>
                <Text className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.rating}</Text>
              </View>
            </View>

            {/* Strategic Growth Banner */}
            <View className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl mb-8">
              <View className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20" />
              <Text className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Strategic{'\n'}Growth.</Text>
              <Text className="text-white/80 text-xs font-medium leading-relaxed max-w-[80%] mb-8">
                Deploy your property on the global network and reach 50,000+ verified guests monthly.
              </Text>
              <TouchableOpacity onPress={() => setActiveTab('Properties')} className="bg-white py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform">
                <Text className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Manage Properties</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'Properties' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 ml-2">Active Portfolios</Text>
            <View className="space-y-4">
              {properties.map((prop: any) => (
                <View key={prop._id} className="bg-white dark:bg-dark-card p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden mb-4">
                  <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center border border-blue-500/20">
                        <Building color="#3b82f6" size={20} />
                      </View>
                      <View>
                        <Text className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{prop.name}</Text>
                        <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex-row items-center">
                          <MapPin size={10} color="#94a3b8" /> {prop.location || 'India'}
                        </Text>
                      </View>
                    </View>
                    <View className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                      <Text className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{prop.status || 'Live'}</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-end mb-2">
                    <View className="flex-1 mr-4">
                      <Text className="text-xs font-black text-slate-900 dark:text-white mb-2">{prop.rooms || 0} Total Rooms</Text>
                      <View className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <View className="h-full bg-blue-600" style={{ width: `50%` }} />
                      </View>
                    </View>
                    <View className="items-end justify-between py-1">
                      <View>
                        <Text className="text-lg font-black text-slate-900 dark:text-white">₹{prop.price}</Text>
                        <Text className="text-[9px] text-slate-400 uppercase tracking-widest font-bold text-right">/ Month</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteProperty(prop._id)} className="w-6 h-6 bg-red-500/10 rounded-md items-center justify-center mt-2">
                        <Trash2 size={12} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {properties.length === 0 && (
                <View className="py-12 items-center justify-center border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
                  <Home color="#cbd5e1" size={48} className="mb-4" />
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No properties listed</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'Bookings' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter ml-2">Guest <Text className="text-blue-500">Bookings</Text></Text>
            {bookings.map((ord: any) => (
              <View key={ord._id} className="bg-white dark:bg-dark-card p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-4">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 pr-2">
                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking #{ord._id.slice(-8)}</Text>
                    <Text className="text-sm font-bold text-slate-900 dark:text-white mb-1">{ord.user?.firstName} {ord.user?.lastName}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(ord.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-black text-blue-500 mb-2">₹{ord.totalPrice}</Text>
                    <View className={`px-3 py-1 rounded-full ${ord.isPaid ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                      <Text className={`text-[8px] uppercase font-black tracking-widest ${ord.isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {ord.isPaid ? 'Paid' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            {bookings.length === 0 && (
              <View className="py-12 items-center justify-center border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
                <Calendar color="#cbd5e1" size={48} className="mb-4" />
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No recent bookings</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'KYC' && (
          <View className="space-y-6 pb-12 mt-4 px-2">
            <View className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 items-center text-center shadow-xl">
              <View className="w-20 h-20 bg-blue-500/10 rounded-full items-center justify-center mb-6">
                <ShieldCheck color="#3b82f6" size={40} />
              </View>
              <Text className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter mb-2">Hospitality KYC</Text>
              <Text className="text-slate-500 text-xs text-center mb-8 px-4 leading-relaxed">
                Upload your property deeds and business licensing to maintain active listings on the FIC network.
              </Text>
              <TouchableOpacity onPress={simulateUploadKYC} className="w-full bg-blue-600 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-lg shadow-blue-500/30">
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
                <CheckCircle2 color="#3b82f6" size={18} />
              </View>
            ))}
            {kycDocs.length === 0 && <Text className="text-slate-500 text-xs italic text-center py-4">No documents uploaded yet.</Text>}
          </View>
        )}

      </ScrollView>

      {/* Add Property Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-dark-card p-8 rounded-t-[2.5rem] border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Property</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">List on global network</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center">
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Property Name" placeholderTextColor="#94a3b8"
                value={propForm.title} onChangeText={(t) => setPropForm({...propForm, title: t})}
              />
              <View className="flex-row gap-4">
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Price/Month (₹)" placeholderTextColor="#94a3b8" keyboardType="numeric"
                  value={propForm.price} onChangeText={(t) => setPropForm({...propForm, price: t})}
                />
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Rooms" placeholderTextColor="#94a3b8" keyboardType="numeric"
                  value={propForm.rooms} onChangeText={(t) => setPropForm({...propForm, rooms: t})}
                />
              </View>
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Location" placeholderTextColor="#94a3b8"
                value={propForm.location} onChangeText={(t) => setPropForm({...propForm, location: t})}
              />
              <TouchableOpacity onPress={handleAddProperty} className="bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-600/30 mt-4">
                <Text className="text-white font-black uppercase tracking-widest text-xs">Deploy Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


