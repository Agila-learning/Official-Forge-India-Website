import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck, MapPin, Truck, Lock, Building2 } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { openRazorpayCheckout } from '../../services/razorpay';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  
  // Params can be for a product or a consulting session
  // e.g., ?type=consulting&domain=Banking&price=2500
  // or ?type=product&productId=123&price=1500&name=Laptop
  const { type, domain, productId, price, name, image } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const isProduct = type === 'product';
  const basePrice = parseInt(price as string) || 2500;
  
  const handlePayment = async () => {
    if (isProduct && (!address || !city || !postalCode)) {
      Alert.alert('Missing Info', 'Please provide full shipping details.');
      return;
    }

    import('react-native').then(({ Linking }) => {
      Linking.openURL('https://pages.razorpay.com/pl_Snw500bx72cgkb/view');
    });
  };

  return (
    <View className="flex-1 bg-dark-bg p-6 pt-16">
      <ScrollView className="flex-1">
        <Text className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Secure <Text className="text-primary">Checkout</Text></Text>
        <Text className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">Protected by Razorpay 256-bit Encryption</Text>

        <View className="bg-dark-card p-6 rounded-3xl border border-slate-800 shadow-xl mb-6">
          <Text className="text-white font-black uppercase tracking-widest text-sm mb-4">Order Summary</Text>
          <View className="flex-row items-center gap-4 mb-4">
            {isProduct ? (
              <Image source={{ uri: image as string }} className="w-16 h-16 rounded-xl bg-slate-800" />
            ) : (
              <View className="w-16 h-16 bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-900/50">
                <Building2 color="#3b82f6" size={24} />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-white font-black text-lg">{isProduct ? name : `FIC ${domain} Consulting`}</Text>
              <Text className="text-primary font-bold">₹{basePrice}</Text>
            </View>
          </View>
          <View className="h-px bg-slate-800 my-4" />
          {isProduct && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-400">Shipping</Text>
              <Text className="text-white font-bold">₹50</Text>
            </View>
          )}
          <View className="flex-row justify-between">
            <Text className="text-white font-black text-lg">Total Payable</Text>
            <Text className="text-primary font-black text-lg">₹{basePrice + (isProduct ? 50 : 0)}</Text>
          </View>
        </View>

        {isProduct && (
          <View className="space-y-4 mb-8">
            <Text className="text-slate-400 font-black uppercase tracking-widest text-xs ml-2">Shipping Details</Text>
            
            <View className="bg-[#0f172a] border border-slate-800 rounded-2xl p-2 flex-row items-center">
              <View className="w-12 h-12 items-center justify-center"><MapPin color="#64748b" size={20} /></View>
              <TextInput 
                className="flex-1 text-white h-full pr-4 font-medium"
                placeholder="Full Address" placeholderTextColor="#64748b"
                value={address} onChangeText={setAddress}
              />
            </View>
            <View className="bg-[#0f172a] border border-slate-800 rounded-2xl p-2 flex-row items-center">
              <View className="w-12 h-12 items-center justify-center"><MapPin color="#64748b" size={20} /></View>
              <TextInput 
                className="flex-1 text-white h-full pr-4 font-medium"
                placeholder="City" placeholderTextColor="#64748b"
                value={city} onChangeText={setCity}
              />
            </View>
            <View className="bg-[#0f172a] border border-slate-800 rounded-2xl p-2 flex-row items-center">
              <View className="w-12 h-12 items-center justify-center"><MapPin color="#64748b" size={20} /></View>
              <TextInput 
                className="flex-1 text-white h-full pr-4 font-medium"
                placeholder="Postal Code" placeholderTextColor="#64748b"
                value={postalCode} onChangeText={setPostalCode}
              />
            </View>
          </View>
        )}

        <View className="p-4 bg-green-900/10 rounded-2xl border border-green-900/20 flex-row items-center gap-3 mb-8">
          <ShieldCheck size={20} className="text-green-600" />
          <View>
            <Text className="text-xs font-black text-white uppercase">Secure Payment</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase">Your payment is processed by Razorpay.</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        className="w-full bg-primary py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/30 mt-auto mb-10"
        onPress={handlePayment} disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" size="small" /> : (
          <>
            <Lock color="white" size={18} />
            <Text className="text-white font-black uppercase tracking-widest text-sm">Pay ₹{basePrice + (isProduct ? 50 : 0)} securely</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
