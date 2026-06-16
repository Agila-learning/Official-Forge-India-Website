import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image, TextInput } from 'react-native';
import { ShoppingBag, Star, ShieldCheck, Menu, User, Search, X } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ServicesScreen() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      // Filter out duplicate IDs if any exist in the database, to prevent repeated cards
      const uniqueServices = Array.from(new Map((res.data || []).map((item: any) => [item._id, item])).values());
      setServices(uniqueServices as any[]);
    } catch (e) {
      console.warn("Could not fetch services, using fallback data.");
      setServices([
        { _id: '1', title: 'Plumbing Solutions', category: 'Home Services', provider: 'FIC Verified Pro', rating: 4.8, price: 1500, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
        { _id: '2', title: 'Electrical Repairs', category: 'Home Services', provider: 'ElectroTech', rating: 4.9, price: 2200, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
        { _id: '3', title: 'AC Servicing', category: 'Appliance Repair', provider: 'CoolBreeze', rating: 4.7, price: 1200, image: 'https://images.unsplash.com/photo-1590491024344-9f4a1fa62529?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
        { _id: '4', title: 'Deep Cleaning', category: 'Cleaning', provider: 'SparkleClean', rating: 4.9, price: 3500, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => (s.serviceName || s.title || s.name)?.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <Text className="text-xl font-black text-slate-900 uppercase tracking-tighter">Market<Text className="text-blue-500">place</Text></Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => alert('Global Cart functionality coming soon!')}
            className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center relative border border-blue-100"
          >
            <ShoppingBag color="#3b82f6" size={18} />
            <View className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-[8px] font-bold text-white">0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center overflow-hidden border border-blue-200">
             {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <User color="#3b82f6" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 pt-6 pb-2">
        <View className="flex-row items-center bg-white h-12 rounded-2xl px-4 border border-slate-200 shadow-sm">
          <Search color="#94a3b8" size={20} />
          <TextInput 
            className="flex-1 h-full ml-3 font-medium text-slate-700"
            placeholder="Search trusted services..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#94a3b8" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#eab308" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6 pt-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />}
        >
          <View className="flex-row flex-wrap justify-between">
            {filteredServices.map((service: any) => (
              <TouchableOpacity 
                key={service._id} 
                activeOpacity={0.8}
                onPress={() => router.push(`/(drawer)/services/${service._id}`)}
                className="w-[48%] bg-white rounded-3xl border border-slate-100 shadow-sm mb-4 overflow-hidden"
              >
                <View className="w-full h-32 bg-slate-100 relative">
                  {service.bannerImage || service.image ? (
                    <Image source={{ uri: service.bannerImage || service.image }} className="w-full h-full opacity-90" />
                  ) : (
                    <View className="w-full h-full items-center justify-center opacity-30">
                      <ShoppingBag size={40} color="#94a3b8" />
                    </View>
                  )}
                  <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex-row items-center shadow-sm">
                    <Star color="#eab308" size={10} fill="#eab308" className="mr-1" />
                    <Text className="text-slate-800 text-[10px] font-bold">{service.rating || 'New'}</Text>
                  </View>
                </View>
                
                <View className="p-4">
                  <Text className="text-xs text-blue-600 font-black uppercase tracking-widest mb-1">{service.category || 'Service'}</Text>
                  <Text className="text-slate-900 font-bold leading-tight mb-2" numberOfLines={2}>{service.serviceName || service.title || service.name}</Text>
                  
                  <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center gap-1 flex-1">
                      <ShieldCheck color="#10b981" size={12} />
                      <Text className="text-slate-500 text-[9px] uppercase font-bold" numberOfLines={1}>{service.provider || service.seller?.businessName || 'Verified Pro'}</Text>
                    </View>
                    {(service.basePrice !== undefined || service.price !== undefined) && (
                      <Text className="text-slate-900 font-black text-xs">₹{service.basePrice || service.price}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="h-10" />
        </ScrollView>
      )}
    </View>
  );
}
