import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Modal, TextInput, Alert, BackHandler } from 'react-native';
import { Package, ShoppingCart, Activity, ShieldCheck, Box, Tag, TrendingUp, Users, Plus, X, Trash2, Calendar, Star, CreditCard } from 'lucide-react-native';
import { Drawer } from 'expo-router/drawer';
import { useNavigation, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState(params.tab ? (params.tab as string) : 'overview');
  
  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params.tab]);

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

  const [stats, setStats] = useState({ activeProducts: 0, totalOrders: 0, revenue: 0, successRate: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'General', description: '' });
  const [customFields, setCustomFields] = useState<{label: string, value: string}[]>([]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] }))
      ]);

      const allProducts = productsRes.data || [];
      const vendorProducts = allProducts.filter((p: any) => 
        (p.vendorId?._id || p.vendorId) === user?._id
      );
      setProducts(vendorProducts);

      const vendorOrders = (ordersRes.data || []).filter((order: any) => 
        order.orderItems?.some((item: any) => vendorProducts.some((p: any) => p._id === item.product))
      );
      setOrders(vendorOrders);

      const revenue = vendorOrders.filter((o: any) => o.isPaid).reduce((acc: number, o: any) => acc + o.totalPrice, 0);
      const successOrders = vendorOrders.filter((o: any) => o.status === 'Completed' || o.status === 'Delivered').length;
      const successRate = vendorOrders.length > 0 ? Number(((successOrders / vendorOrders.length) * 100).toFixed(1)) : 0;

      setStats({ 
        activeProducts: vendorProducts.length, 
        totalOrders: vendorOrders.length, 
        revenue,
        successRate
      });
      
      setRecentOrders(vendorOrders.slice(0, 5));
    } catch (e) {
      console.error('Failed to fetch vendor data', e);
    } finally {
      setLoading(false);
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

  const handleSaveProduct = async () => {
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        customFields: customFields,
        vendorId: user?._id
      });
      Alert.alert('Success', 'Product created successfully');
      setModalVisible(false);
      setFormData({ name: '', price: '', category: 'General', description: '' });
      setCustomFields([]);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to save product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      Alert.alert('Success', 'Product deleted');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const role = user?.role?.toLowerCase() || '';
  if (role !== 'vendor' && role !== 'seller') {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-dark-bg items-center justify-center p-6">
        <ShieldCheck size={48} color="#ef4444" className="mb-4" />
        <Text className="text-slate-900 dark:text-white text-xl font-black text-center">Access Denied</Text>
        <Text className="text-slate-500 text-center mt-2">Vendor or Seller privileges required.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0f16]">
      <Drawer.Screen options={{ headerShown: false }} />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 50, paddingHorizontal: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        {/* Top Header */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity 
            onPress={() => (navigation as any).openDrawer()}
            className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
          >
            <View className="space-y-1.5 w-5">
              <View className="h-[2px] bg-slate-400 w-full" />
              <View className="h-[2px] bg-slate-400 w-3/4" />
              <View className="h-[2px] bg-slate-400 w-1/2" />
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
              <View className="relative">
                <Text className="text-slate-400 font-black">🔔</Text>
                <Text className="text-slate-400 text-[8px] font-bold absolute -top-2 -right-1">Z</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-12 h-12 bg-[#1a2333] rounded-xl items-center justify-center border border-blue-500/30 overflow-hidden">
              {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <Text className="text-blue-500 font-black text-xl">V</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Title */}
        <View className="mb-6 pl-3 border-l-[3px] border-blue-600">
          <Text className="text-blue-600 text-lg font-black tracking-widest">Management Hub</Text>
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{activeTab}</Text>
        </View>

        {activeTab === 'overview' && (
          <>
            <View className="mb-6">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business Statistics</Text>
              <Text className="text-2xl font-black text-white uppercase tracking-tighter">
                GROWTH <Text className="text-blue-500">STATS</Text>
              </Text>
            </View>

            {/* Action Pills */}
            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center gap-2">
                <Plus color="white" size={14} />
                <Text className="text-white font-black tracking-widest text-xs">Product</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-full flex-row items-center gap-2">
                <Text className="text-white text-xs font-black tracking-widest flex-row items-center"><Text className="text-sm mr-1">⚙️</Text> Service</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View className="bg-[#111620] p-6 rounded-[2rem] border border-white/5 shadow-2xl mb-6 relative overflow-hidden">
              <View className="absolute top-4 right-6 flex-row items-center gap-4">
                <View className="bg-blue-900/30 px-3 py-1 rounded-full border border-blue-900/50">
                  <Text className="text-blue-600 text-[8px] font-black uppercase tracking-widest">Vendor Hub</Text>
                </View>
                <Text className="text-slate-300 text-[8px] font-bold uppercase tracking-widest">Secure Session</Text>
              </View>

              <View className="flex-row mt-6 mb-6">
                <View className="w-20 h-20 bg-[#1a2333] rounded-full items-center justify-center border-[3px] border-[#0a0f16] mr-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white font-black text-2xl">V</Text>
                  </View>
                </View>
                <View className="flex-1 justify-center pt-2">
                  <Text className="text-white font-black text-lg mb-2 tracking-tight">Vendor <Text className="text-blue-500">FIC</Text></Text>
                  <Text className="text-slate-400 text-[9px] font-medium leading-relaxed">
                    Welcome To Your Personalized Vendor Executive Suite. Track Your Impact, Manage Your Assets, And Scale Your Presence In Forge India Connect.
                  </Text>
                </View>
              </View>

              <View className="flex-row border-t border-white/5 pt-4 mt-2">
                <View className="flex-1 items-center border-r border-white/5">
                  <Text className="text-white font-bold text-[10px] mb-1">Impact Score</Text>
                  <Text className="text-blue-500 font-black text-lg">A+</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-white font-bold text-[10px] mb-1">Status</Text>
                  <Text className="text-green-500 font-black text-lg">Live</Text>
                </View>
              </View>
            </View>

            {/* 2x2 Stats Grid */}
            <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
              <View className="w-[48%] bg-[#111620] p-5 rounded-3xl border border-white/5">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="w-10 h-10 bg-orange-500/10 rounded-xl items-center justify-center border border-orange-500/20">
                    <Package color="#f97316" size={18} />
                  </View>
                  <View className="bg-green-900/30 px-2 py-0.5 rounded flex-row items-center">
                    <Text className="text-green-500 text-[7px] font-black uppercase tracking-widest">Vendor Hub</Text>
                  </View>
                </View>
                <Text className="text-[10px] text-slate-400 mb-1">Active Inventory</Text>
                <Text className="text-white font-black text-2xl">{stats.activeProducts}</Text>
              </View>

              <View className="w-[48%] bg-[#111620] p-5 rounded-3xl border border-white/5">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="w-10 h-10 bg-green-500/10 rounded-xl items-center justify-center border border-green-500/20">
                    <TrendingUp color="#22c55e" size={18} />
                  </View>
                  <View className="bg-green-900/30 px-2 py-0.5 rounded flex-row items-center">
                    <Text className="text-green-500 text-[8px] font-black">+0%</Text>
                  </View>
                </View>
                <Text className="text-[10px] text-slate-400 mb-1">Today's Sales</Text>
                <Text className="text-white font-black text-2xl">₹{stats.revenue}</Text>
              </View>
            </View>
          </>
        )}

        {activeTab === 'inventory' && (
          <View className="pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white font-bold text-sm">Manage Products</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-600 px-4 py-2 rounded-full">
                <Text className="text-white font-bold text-xs">+ Add</Text>
              </TouchableOpacity>
            </View>
            {products.map((p: any) => (
              <View key={p._id} className="bg-[#111620] p-4 rounded-2xl border border-white/5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-white rounded-xl overflow-hidden mr-4 border border-slate-700">
                    <Image source={{uri: p.image || 'https://via.placeholder.com/150'}} className="w-full h-full" style={{ resizeMode: 'cover' }} />
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-white font-bold text-sm mb-1" numberOfLines={1}>{p.name}</Text>
                    <Text className="text-[10px] text-slate-400">₹{p.price} • {p.category}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteProduct(p._id)} className="bg-red-900/30 p-3 rounded-xl border border-red-900/50">
                  <Trash2 color="#ef4444" size={16} />
                </TouchableOpacity>
              </View>
            ))}
            {products.length === 0 && (
               <Text className="text-slate-500 text-center mt-10">No products found. Tap + Add to create one.</Text>
            )}
          </View>
        )}

        {activeTab === 'bookings' && (
          <View className="pb-8">
            <Text className="text-white font-bold text-sm mb-6">Active Bookings ({orders.length})</Text>
            {orders.map((o: any) => (
              <View key={o._id} className="bg-[#111620] p-5 rounded-2xl border border-white/5 mb-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-slate-300 font-bold text-xs">Order #{o._id.substring(0,6).toUpperCase()}</Text>
                  <Text className="text-orange-500 font-bold text-[10px] uppercase">{o.status}</Text>
                </View>
                <Text className="text-white font-black text-lg mb-1">₹{o.totalPrice}</Text>
                <Text className="text-slate-500 text-[10px]">{new Date(o.createdAt).toLocaleDateString()}</Text>
              </View>
            ))}
            {orders.length === 0 && (
               <Text className="text-slate-500 text-center mt-10">No active bookings found.</Text>
            )}
          </View>
        )}

        {['availability', 'pricing', 'reviews', 'payouts'].includes(activeTab) && (
          <View className="pb-8 items-center justify-center pt-10">
            <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-6 border border-white/10">
              {activeTab === 'availability' && <Calendar color="#475569" size={32} />}
              {activeTab === 'pricing' && <Tag color="#475569" size={32} />}
              {activeTab === 'reviews' && <Star color="#475569" size={32} />}
              {activeTab === 'payouts' && <CreditCard color="#475569" size={32} />}
            </View>
            <Text className="text-white font-black text-xl mb-2 capitalize">{activeTab} Module</Text>
            <Text className="text-slate-500 text-xs text-center max-w-[80%]">
              This module is currently being optimized for mobile. Access full {activeTab} features on the web dashboard.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Create Product Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-[#111620] p-6 rounded-t-[2rem] h-[80%] border-t border-white/10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg text-white font-black uppercase tracking-widest">New Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-white/5 rounded-full">
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4">
              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Product Name</Text>
              <TextInput 
                value={formData.name} 
                onChangeText={t => setFormData({...formData, name: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5 font-bold"
                placeholderTextColor="#475569"
                placeholder="e.g. Premium Security Cam"
              />

              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Price (₹)</Text>
              <TextInput 
                value={formData.price} 
                onChangeText={t => setFormData({...formData, price: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5 font-bold"
                placeholderTextColor="#475569"
                placeholder="e.g. 5000"
                keyboardType="numeric"
              />

              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Category</Text>
              <TextInput 
                value={formData.category} 
                onChangeText={t => setFormData({...formData, category: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5 font-bold"
                placeholderTextColor="#475569"
                placeholder="e.g. Electronics"
              />

              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Custom Details</Text>
                  <TouchableOpacity onPress={() => setCustomFields([...customFields, {label: '', value: ''}])} className="bg-blue-900/30 px-2 py-1 rounded">
                    <Text className="text-blue-500 font-bold text-[10px] uppercase">+ Add Field</Text>
                  </TouchableOpacity>
                </View>
                {customFields.map((field, idx) => (
                  <View key={idx} className="flex-row gap-2 mb-2 items-center">
                    <TextInput 
                      value={field.label}
                      onChangeText={t => { const newF = [...customFields]; newF[idx].label = t; setCustomFields(newF); }}
                      placeholder="Label (e.g. Color)" placeholderTextColor="#475569"
                      className="flex-1 bg-[#0a0f16] text-white p-3 rounded-xl border border-white/10 font-medium text-xs"
                    />
                    <TextInput 
                      value={field.value}
                      onChangeText={t => { const newF = [...customFields]; newF[idx].value = t; setCustomFields(newF); }}
                      placeholder="Value (e.g. Red)" placeholderTextColor="#475569"
                      className="flex-1 bg-[#0a0f16] text-white p-3 rounded-xl border border-white/10 font-medium text-xs"
                    />
                    <TouchableOpacity onPress={() => { const newF = customFields.filter((_, i) => i !== idx); setCustomFields(newF); }}>
                      <Trash2 color="#ef4444" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={handleSaveProduct} 
              className="bg-blue-600 p-4 rounded-xl items-center mb-6 shadow-sm shadow-blue-600/50"
            >
              <Text className="text-white font-black text-sm uppercase tracking-widest">Publish Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
