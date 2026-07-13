import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image, Alert, Modal, TextInput } from 'react-native';
import { ShoppingBag, Star, ShieldCheck, CreditCard, Menu, Search, X, Heart, MessageSquare, Truck, User } from 'lucide-react-native';
import { useRouter, useNavigation } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { openRazorpayCheckout } from '../../services/razorpay';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export default function ProductsScreen() {
  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  // Search & Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      const filtered = (res.data || []).filter((p: any) => !p.isService && p.isActive !== false);
      const uniqueProducts = Array.from(new Map(filtered.map((item: any) => [item._id, item])).values());
      setProducts(uniqueProducts as any[]);
    } catch (e) {
      console.warn("Could not fetch products.", e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openProduct = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleBuyNow = async (product: any) => {
    if (product.countInStock <= 0) {
      Alert.alert('Out of Stock', 'This product is currently unavailable for purchase.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to purchase products.');
      router.push('/login');
      return;
    }

    addToCart(product);
    setModalVisible(false);
    router.push('/(drawer)/cart');
  };

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your global cart.`);
    setModalVisible(false);
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <Text className="text-xl font-black text-slate-900 uppercase tracking-tighter">Atomy <Text className="text-orange-500">Shop</Text></Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => router.push('/(drawer)/cart' as any)}
            className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center relative border border-orange-100"
          >
            <ShoppingBag color="#ea580c" size={18} />
            {cart.length > 0 && (
              <View className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full items-center justify-center border-2 border-white">
                <Text className="text-[8px] font-bold text-white">{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center overflow-hidden border border-orange-200">
             {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <User color="#ea580c" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 pt-6 pb-2">
        <View className="flex-row items-center bg-white h-12 rounded-2xl px-4 border border-slate-200 shadow-sm">
          <Search color="#94a3b8" size={20} />
          <TextInput 
            className="flex-1 h-full ml-3 font-medium text-slate-700"
            placeholder="Search premium products..."
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
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6 pt-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}
        >
          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product: any) => (
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => openProduct(product)}
                key={product._id} 
                className="w-[48%] bg-white rounded-3xl border border-slate-100 shadow-sm mb-4 overflow-hidden"
              >
                <View className="w-full h-36 bg-slate-100 relative p-2">
                  {product.image ? (
                    <Image source={{ uri: product.image }} className="w-full h-full rounded-2xl" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-full items-center justify-center opacity-30">
                      <ShoppingBag size={40} color="#94a3b8" />
                    </View>
                  )}
                  <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex-row items-center shadow-sm">
                    <Star color="#f97316" size={10} fill="#f97316" className="mr-1" />
                    <Text className="text-slate-800 text-[10px] font-bold">{product.rating || '4.9'}</Text>
                  </View>
                </View>
                
                <View className="p-4 pt-3 flex-1 flex-col justify-between">
                  <View>
                    <Text className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1">{product.category || 'Product'}</Text>
                    <Text className="text-slate-900 font-bold leading-tight mb-2 h-9" numberOfLines={2}>{product.name}</Text>
                  </View>
                  
                  <View>
                    <View className="flex-row items-end justify-between mb-3">
                      <Text className="text-slate-900 font-black text-lg leading-none">₹{product.price}</Text>
                      <View className={`px-2 py-1 rounded-md ${product.countInStock > 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        <Text className={`text-[8px] font-black uppercase tracking-widest ${product.countInStock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {product.countInStock > 0 ? 'In Stock' : 'Sold Out'}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity 
                      onPress={() => handleBuyNow(product)}
                      className={`w-full py-2.5 rounded-xl flex-row justify-center items-center gap-2 ${product.countInStock > 0 ? 'bg-slate-900' : 'bg-slate-100'}`}
                    >
                      <CreditCard size={14} color={product.countInStock > 0 ? 'white' : '#94a3b8'} />
                      <Text className={`font-black uppercase tracking-widest text-[10px] ${product.countInStock > 0 ? 'text-white' : 'text-slate-400'}`}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="h-20" />
        </ScrollView>
      )}

      {/* Product Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white h-[85%] rounded-t-[2.5rem] overflow-hidden shadow-2xl relative">
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full items-center justify-center z-50 border border-slate-200"
            >
              <X color="#64748b" size={20} />
            </TouchableOpacity>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
              <View className="w-full h-80 bg-slate-100 relative">
                {selectedProduct?.image ? (
                  <Image source={{ uri: selectedProduct.image }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="w-full h-full items-center justify-center opacity-30">
                    <ShoppingBag size={80} color="#94a3b8" />
                  </View>
                )}
                <View className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex-row items-center shadow-lg border border-white">
                  <Star color="#f97316" size={14} fill="#f97316" className="mr-1.5" />
                  <Text className="text-slate-800 text-xs font-black">{selectedProduct?.rating || '4.9'} <Text className="font-medium text-slate-500">({selectedProduct?.numReviews || 12} Reviews)</Text></Text>
                </View>
              </View>

              <View className="p-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100">
                    {selectedProduct?.category || 'Premium Product'}
                  </Text>
                  <TouchableOpacity onPress={() => selectedProduct && toggleWishlist(selectedProduct._id)} className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center">
                    <Heart size={20} color="#f43f5e" fill={selectedProduct && wishlist.includes(selectedProduct._id) ? "#f43f5e" : "none"} />
                  </TouchableOpacity>
                </View>

                <Text className="text-3xl font-black text-slate-900 tracking-tighter leading-tight mb-2">
                  {selectedProduct?.name}
                </Text>
                <Text className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">
                  By {selectedProduct?.brand || selectedProduct?.shopName || 'Forge India Official'}
                </Text>

                <View className="flex-row gap-4 mb-8">
                  <View className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center gap-3">
                    <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center">
                      <ShieldCheck size={16} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quality</Text>
                      <Text className="text-xs font-bold text-slate-700">Verified</Text>
                    </View>
                  </View>
                  <View className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center gap-3">
                    <View className="w-8 h-8 bg-emerald-100 rounded-lg items-center justify-center">
                      <Truck size={16} color="#10b981" />
                    </View>
                    <View>
                      <Text className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery</Text>
                      <Text className="text-xs font-bold text-slate-700">Fast Ship</Text>
                    </View>
                  </View>
                </View>

                <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Product Description</Text>
                <Text className="text-slate-600 font-medium leading-relaxed mb-8">
                  {selectedProduct?.description || "Experience the highest standard of quality with this premium Atomy product. Designed for excellence and everyday utility."}
                </Text>

                {/* Reviews Summary Stub */}
                <View className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <View className="flex-row items-center gap-3 mb-4">
                    <MessageSquare size={20} color="#475569" />
                    <Text className="text-sm font-black uppercase tracking-widest text-slate-700">Customer Reviews</Text>
                  </View>
                  <Text className="text-xs text-slate-500 font-medium italic">
                    "Absolutely love this product! The quality is exactly as described and delivery was super fast." - Verified Buyer
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-6 flex-row items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <View>
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Price</Text>
                <Text className="text-3xl font-black text-slate-900 tracking-tighter">₹{selectedProduct?.price}</Text>
              </View>
              
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={() => handleAddToCart(selectedProduct)}
                  className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center border border-orange-200"
                >
                  <ShoppingBag size={24} color="#ea580c" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleBuyNow(selectedProduct)}
                  className={`h-14 px-8 rounded-2xl flex-row items-center justify-center shadow-xl ${selectedProduct?.countInStock > 0 ? 'bg-slate-900 shadow-slate-900/20' : 'bg-slate-300'}`}
                >
                  <Text className={`font-black uppercase tracking-widest text-sm ${selectedProduct?.countInStock > 0 ? 'text-white' : 'text-slate-500'}`}>
                    {selectedProduct?.countInStock > 0 ? 'Buy Now' : 'Sold Out'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}
