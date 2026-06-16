import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image, TextInput, Alert, Modal, BackHandler } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Package, TrendingUp, DollarSign, Clock, CheckCircle2, ChevronRight, Store, Plus, X, CreditCard, ShoppingBag, ShieldCheck, UploadCloud, FileText, Trash2 } from 'lucide-react-native';
import api from '../../services/api';
import { useFocusEffect } from 'expo-router';

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kycDocs, setKycDocs] = useState<any[]>([]);

  // Add Product State
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
  const [productForm, setProductForm] = useState({
    name: '', price: '', countInStock: '', category: '', image: ''
  });

  const fetchSellerData = async () => {
    try {
      const [prodRes, ordRes, userRes] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);

      // Filter for current seller (vendor)
      const sellerProducts = (prodRes.data || []).filter((p: any) => p.vendor === user?._id || p.seller === user?._id);
      const sellerOrders = (ordRes.data || []).filter((o: any) => 
        o.orderItems?.some((item: any) => sellerProducts.some((sp: any) => sp._id === item.product))
      );

      setProducts(sellerProducts);
      setOrders(sellerOrders);
      
      const me = (userRes.data || []).find((u: any) => u._id === user?._id);
      if (me) setKycDocs(me.profileDocuments || []);

      if (activeTab === 'payouts') {
        const setRes = await api.get('/settlements/vendor').catch(() => ({ data: [] }));
        setSettlements(setRes.data || []);
      }
    } catch (e) {
      console.warn('Failed to fetch seller data', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSellerData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSellerData();
  }, [user, activeTab]);

  const handleAddProduct = async () => {
    try {
      await api.post('/products', { ...productForm, vendor: user?._id });
      Alert.alert('Success', 'Product deployed to inventory!');
      setShowAddModal(false);
      setProductForm({ name: '', price: '', countInStock: '', category: '', image: '' });
      fetchSellerData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      Alert.alert('Success', 'Product removed from inventory');
      fetchSellerData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const simulateUploadKYC = () => {
    Alert.alert('KYC Upload', 'Uploading your identity credential securely...');
    setTimeout(async () => {
      try {
        const newDocs = [...kycDocs, { name: 'GST Certificate / Aadhar', url: 'https://placeholder.com/doc', type: 'credential', uploadedAt: new Date() }];
        await api.put('/users/profile', { profileDocuments: newDocs });
        Alert.alert('Success', 'Document uploaded and awaiting admin verification.');
        fetchSellerData();
      } catch (e) {
        Alert.alert('Error', 'Upload failed');
      }
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'orders', label: 'Orders' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'kyc', label: 'KYC Verif' }
  ];

  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]"></View>
      <View className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></View>

      <View className="pt-12 pb-4 px-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-10">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">E-Commerce</Text>
            <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Seller <Text className="text-primary">Hub</Text></Text>
          </View>
          {activeTab === 'inventory' && (
            <TouchableOpacity 
              onPress={() => setShowAddModal(true)}
              className="w-10 h-10 bg-primary rounded-xl items-center justify-center shadow-lg shadow-primary/30"
            >
              <Plus color="white" size={18} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab.id} 
              onPress={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full mr-2 transition-all ${activeTab === tab.id ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>{tab.label}</Text>
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
          {activeTab === 'overview' && (
            <View>
              <View className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
                <View className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></View>
                <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total Revenue</Text>
                <Text className="text-4xl font-black text-white tracking-tighter mb-6">₹{totalRevenue.toLocaleString()}</Text>
                
                <View className="flex-row justify-between border-t border-slate-800 pt-4">
                  <View>
                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Products</Text>
                    <Text className="text-xl font-black text-white">{products.length}</Text>
                  </View>
                  <View>
                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</Text>
                    <Text className="text-xl font-black text-white">{orders.length}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row flex-wrap justify-between mb-8">
                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl mb-4 items-center">
                  <View className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center mb-3"><Package color="#3b82f6" size={20} /></View>
                  <Text className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</Text>
                  <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-center">Listed Items</Text>
                </View>

                <View className="w-[48%] bg-white dark:bg-dark-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl mb-4 items-center">
                  <View className="w-12 h-12 bg-emerald-500/10 rounded-2xl items-center justify-center mb-3"><ShoppingBag color="#10b981" size={20} /></View>
                  <Text className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</Text>
                  <Text className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-center">Total Sales</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'inventory' && (
            <View className="mb-8">
              <Text className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter ml-2">My <Text className="text-primary">Products</Text></Text>
              {products.map((item: any) => (
                <View key={item._id} className="bg-white dark:bg-dark-card p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-4 flex-row items-center">
                  <View className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mr-4 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {item.image ? <Image source={{uri: item.image}} className="w-full h-full" /> : <Package size={20} color="#94a3b8" />}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category}</Text>
                  </View>
                  <View className="items-end justify-between py-1">
                    <Text className="text-sm font-black text-primary mb-1">₹{item.price}</Text>
                    <View className="flex-row items-center gap-3 mt-1">
                      <Text className={`text-[9px] font-black uppercase tracking-widest ${item.countInStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.countInStock > 0 ? `${item.countInStock} Stock` : 'Out of Stock'}
                      </Text>
                      <TouchableOpacity onPress={() => handleDeleteProduct(item._id)} className="w-6 h-6 bg-red-500/10 rounded-md items-center justify-center">
                        <Trash2 size={12} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {products.length === 0 && (
                <View className="py-8 items-center justify-center border border-slate-100 dark:border-slate-800 border-dashed rounded-3xl">
                  <Package color="#cbd5e1" size={48} className="mb-4" />
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No products listed</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'orders' && (
            <View className="mb-8">
              <Text className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter ml-2">Customer <Text className="text-primary">Orders</Text></Text>
              {orders.map((ord: any) => (
                <View key={ord._id} className="bg-white dark:bg-dark-card p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-4">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 pr-2">
                      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #{ord._id.slice(-8)}</Text>
                      <Text className="text-sm font-bold text-slate-900 dark:text-white mb-1">{ord.user?.firstName} {ord.user?.lastName}</Text>
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(ord.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-black text-primary mb-2">₹{ord.totalPrice}</Text>
                      <View className={`px-3 py-1 rounded-full ${ord.isDelivered ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                        <Text className={`text-[8px] uppercase font-black tracking-widest ${ord.isDelivered ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {ord.isDelivered ? 'Delivered' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              {orders.length === 0 && (
                <View className="py-8 items-center justify-center border border-slate-100 dark:border-slate-800 border-dashed rounded-3xl">
                  <ShoppingBag color="#cbd5e1" size={48} className="mb-4" />
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">No pending orders</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'payouts' && (
            <View className="mb-8">
              <View className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl mb-8 flex-row items-center gap-6">
                <View className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <CreditCard size={24} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Wallet Balance</Text>
                  <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{user?.walletBalance?.toLocaleString() || '0'}</Text>
                </View>
              </View>
              
              <Text className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter ml-2">Settlement <Text className="text-primary">History</Text></Text>
              {settlements.map((s: any) => (
                <View key={s._id} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl mb-4 flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs font-black text-slate-900 dark:text-white uppercase">#{s.order?._id?.slice(-6) || 'TRX'}</Text>
                    <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(s.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-black text-emerald-500 mb-1">+₹{s.amount}</Text>
                    <Text className={`text-[8px] uppercase font-black tracking-widest ${s.status === 'Settled' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {s.status}
                    </Text>
                  </View>
                </View>
              ))}
              {settlements.length === 0 && (
                <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center py-4">No settlements detected.</Text>
              )}
            </View>
          )}

          {activeTab === 'kyc' && (
            <View className="space-y-6 pb-12 mt-4">
              <View className="bg-white p-8 rounded-[2.5rem] border border-slate-100 items-center text-center shadow-xl">
                <View className="w-20 h-20 bg-blue-500/10 rounded-full items-center justify-center mb-6">
                  <ShieldCheck color="#3b82f6" size={40} />
                </View>
                <Text className="text-slate-900 font-black text-xl uppercase tracking-tighter mb-2">Identity Vault</Text>
                <Text className="text-slate-500 text-xs text-center mb-8 px-4 leading-relaxed">
                  Upload your official credentials to verify your Seller status and unlock inventory capabilities.
                </Text>
                <TouchableOpacity onPress={simulateUploadKYC} className="w-full bg-blue-600 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-lg shadow-blue-500/30">
                  <UploadCloud color="white" size={18} />
                  <Text className="text-white font-black text-xs uppercase tracking-widest">Upload Document</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-slate-900 font-black text-sm uppercase tracking-tight ml-2 mt-4">Vault Records</Text>
              {kycDocs.map((doc: any, i) => (
                <View key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center shadow-sm mb-2">
                  <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center mr-4">
                    <FileText color="#64748b" size={18} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-black text-xs tracking-wider">{doc.name || 'Credential'}</Text>
                    <Text className="text-orange-500 text-[10px] uppercase font-bold mt-1">Pending Admin Review</Text>
                  </View>
                  <CheckCircle2 color="#3b82f6" size={18} />
                </View>
              ))}
              {kycDocs.length === 0 && <Text className="text-slate-500 text-xs italic text-center py-4">No documents uploaded yet.</Text>}
            </View>
          )}

        </ScrollView>
      )}

      {/* Add Product Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-dark-card p-8 rounded-t-[2.5rem] border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Product</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deploy to global inventory</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center">
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Product Name" placeholderTextColor="#94a3b8"
                value={productForm.name} onChangeText={(t) => setProductForm({...productForm, name: t})}
              />
              <View className="flex-row gap-4">
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Price (₹)" placeholderTextColor="#94a3b8" keyboardType="numeric"
                  value={productForm.price} onChangeText={(t) => setProductForm({...productForm, price: t})}
                />
                <TextInput 
                  className="flex-1 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  placeholder="Stock" placeholderTextColor="#94a3b8" keyboardType="numeric"
                  value={productForm.countInStock} onChangeText={(t) => setProductForm({...productForm, countInStock: t})}
                />
              </View>
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Category" placeholderTextColor="#94a3b8"
                value={productForm.category} onChangeText={(t) => setProductForm({...productForm, category: t})}
              />
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                placeholder="Image URL" placeholderTextColor="#94a3b8"
                value={productForm.image} onChangeText={(t) => setProductForm({...productForm, image: t})}
              />
              <TouchableOpacity onPress={handleAddProduct} className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/30 mt-4">
                <Text className="text-white font-black uppercase tracking-widest text-xs">Deploy Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
