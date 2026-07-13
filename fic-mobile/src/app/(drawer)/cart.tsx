import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import RazorpayCheckout from 'react-native-razorpay';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  } as Notifications.NotificationBehavior),
});
import api from '../../services/api';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return Alert.alert('Cart Empty', 'Please add items to your cart first.');
    if (!user) return Alert.alert('Authentication Required', 'Please log in to checkout.');

    if (Platform.OS === ('web' as any)) {
      Alert.alert('Web Payment', 'Web payment flow is not currently supported natively here.');
      return;
    }

    setLoading(true);
    try {
      const amount = getCartTotal();
      const options = {
        description: `Order for ${cart.length} items`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_placeholder',
        amount: amount * 100,
        name: 'Forge India Connect',
        prefill: {
          email: user?.email || '',
          contact: user?.mobile || '',
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : ''
        },
        theme: { color: '#f97316' }
      };

      if (!RazorpayCheckout) throw new Error('NATIVE_MODULE_NOT_FOUND');
      const data = await RazorpayCheckout.open(options);
      
      // Save order to backend
      const orderItems = cart.map((item: any) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      await api.post('/orders', {
        orderItems,
        paymentMethod: 'Razorpay',
        paymentResult: { id: data.razorpay_payment_id, status: 'Completed', update_time: new Date().toISOString() },
        itemsPrice: amount,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: amount,
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Confirmed! 🎉",
          body: `Your order for ₹${amount} has been successfully placed.`,
        },
        trigger: null,
      });

      Alert.alert('Payment Successful', `Order Placed Successfully! Payment ID: ${data.razorpay_payment_id}`);
      clearCart();
      router.canGoBack() ? router.back() : router.replace('/');
    } catch (error: any) {
      if (error?.description || (error?.code && error.code !== 'NATIVE_MODULE_NOT_FOUND')) {
         Alert.alert('Payment Cancelled', error.description || 'Transaction was not completed.');
      } else {
         if (Platform.OS === ('web' as any)) {
           Alert.alert('Web Error', 'Payment processing failed.');
         } else {
           Alert.alert(
            'Development Mode Fallback',
            'Native Razorpay is not supported in Expo Go. Would you like to simulate a successful payment?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Simulate Success', onPress: async () => {
                  try {
                    setLoading(true);
                    const amount = getCartTotal();
                    const orderItems = cart.map((item: any) => ({
                      name: item.name,
                      qty: item.quantity,
                      image: item.image,
                      price: item.price,
                      product: item._id,
                    }));

                    await api.post('/orders', {
                      orderItems,
                      paymentMethod: 'Simulated Razorpay',
                      paymentResult: { id: 'sim_' + Date.now(), status: 'Completed', update_time: new Date().toISOString() },
                      itemsPrice: amount,
                      taxPrice: 0,
                      shippingPrice: 0,
                      totalPrice: amount,
                    });

                    await Notifications.scheduleNotificationAsync({
                      content: {
                        title: "Order Confirmed! 🎉",
                        body: `Your order for ₹${amount} has been successfully placed (Simulated).`,
                      },
                      trigger: null,
                    });

                    Alert.alert('Payment Successful', 'Order Placed Successfully! (Simulated)');
                    clearCart();
                    router.canGoBack() ? router.back() : router.replace('/');
                  } catch (e) {
                     Alert.alert('Error', 'Simulation failed');
                  } finally {
                     setLoading(false);
                  }
              } }
            ]
          );
         }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="pt-14 pb-4 px-4 bg-white/90 backdrop-blur-xl border-b border-slate-100 z-10 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-200">
          <ArrowLeft color="#475569" size={20} />
        </TouchableOpacity>
        <Text className="text-lg font-black text-slate-900 uppercase tracking-tighter">Your <Text className="text-orange-500">Cart</Text></Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {cart.length === 0 ? (
          <View className="items-center justify-center pt-20">
            <View className="w-24 h-24 bg-orange-50 rounded-full items-center justify-center mb-6">
              <ShoppingBag color="#f97316" size={40} />
            </View>
            <Text className="text-xl font-black text-slate-900 tracking-tighter mb-2">Cart is empty</Text>
            <Text className="text-sm font-bold text-slate-500">Add products to see them here.</Text>
            <TouchableOpacity onPress={() => router.push('/(drawer)/products')} className="mt-8 px-8 py-4 bg-orange-500 rounded-2xl shadow-xl shadow-orange-500/30">
              <Text className="text-white font-black uppercase tracking-widest text-xs">Browse Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {cart.map((item: any) => (
              <View key={item._id} className="bg-white p-4 rounded-3xl border border-slate-100 flex-row items-center shadow-sm">
                <View className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden mr-4">
                  {item.image ? <Image source={{uri: item.image}} className="w-full h-full" /> : <View className="w-full h-full bg-slate-200" />}
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 text-sm mb-1" numberOfLines={2}>{item.name}</Text>
                  <Text className="text-lg font-black text-orange-500 tracking-tighter">₹{item.price}</Text>
                  
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200">
                      <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)} className="p-2">
                        <Minus size={14} color="#64748b" />
                      </TouchableOpacity>
                      <Text className="font-black text-slate-900 px-2">{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)} className="p-2">
                        <Plus size={14} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item._id)} className="p-2 bg-red-50 rounded-xl">
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Checkout Footer */}
      {cart.length > 0 && (
        <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Amount</Text>
            <Text className="text-2xl font-black text-slate-900 tracking-tighter">₹{getCartTotal()}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleCheckout}
            disabled={loading}
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center shadow-xl ${loading ? 'bg-slate-300' : 'bg-slate-900 shadow-slate-900/20'}`}
          >
            <CreditCard color="white" size={18} className="mr-2" />
            <Text className="text-white font-black uppercase tracking-widest text-sm">
              {loading ? 'Processing...' : 'Checkout Securely'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
