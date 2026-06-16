import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Image, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Truck, Zap, BadgeCheck, Clock, Star, X } from 'lucide-react-native';
import api from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';
import { openRazorpayCheckout } from '../../../services/razorpay';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Checkout State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isCheckout, setIsCheckout] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Membership State
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [addMembership, setAddMembership] = useState(false);
  const membershipPrice = 999;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get('/services');
        const found = res.data?.find((s: any) => s._id === id);
        
        if (found) {
          setService(found);
        } else {
          Alert.alert("Error", "Service not found or unavailable.");
          router.canGoBack() ? router.back() : router.replace('/');
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleCheckout = async () => {
    if (!address || !phone) {
      Alert.alert('Missing Info', 'Please enter your service address and contact number.');
      return;
    }

    setBooking(true);
    try {
      // 1. Create booking in DB
      const bookingRes = await api.post('/bookings', {
        serviceSlug: service.slug || service._id,
        serviceName: service.serviceName,
        bookingData: { address, phone, hasMembership: addMembership },
        totalPrice: (service.basePrice || 500) + 50 + (addMembership ? membershipPrice : 0),
        name: user?.firstName || 'Guest',
        email: user?.email || '',
        contactNumber: phone,
        paymentMethod: 'Online'
      });

      const bookingId = bookingRes.data._id;

      // 2. Create Razorpay order
      const orderRes = await api.post('/payments/create-order', {
        bookingId: bookingId
      });

      // 3. Open Razorpay Checkout
      const rzpRes: any = await openRazorpayCheckout({
        description: `Booking for ${service.serviceName}`,
        image: service.bannerImage || 'https://forgeindiaconnect.com/logo.jpg',
        currency: 'INR',
        key: orderRes.data.keyId || 'rzp_test_placeholder',
        amount: orderRes.data.amount,
        name: 'Forge India Connect',
        order_id: orderRes.data.id,
        prefill: {
          email: user?.email || '',
          contact: phone,
          name: user?.firstName || 'Guest'
        },
        theme: { color: '#3b82f6' }
      });

      if (rzpRes.success) {
        // 4. Verify payment
        await api.post('/payments/verify', {
          razorpay_order_id: rzpRes.razorpay_order_id,
          razorpay_payment_id: rzpRes.razorpay_payment_id,
          razorpay_signature: rzpRes.razorpay_signature,
          bookingId: bookingId
        });

        setOrderId(bookingId);
        setShowInvoice(true);
      } else {
        Alert.alert('Payment Failed', rzpRes.error?.message || rzpRes.error?.description || 'Payment was cancelled or failed.');
      }
    } catch (err: any) {
      console.warn(err);
      Alert.alert('Checkout Error', err.response?.data?.message || 'Failed to process checkout. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  if (showInvoice) {
    return (
      <ScrollView className="flex-1 bg-dark-bg p-6 pt-16">
        <View className="bg-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          {/* Invoice Header */}
          <View className="flex-row justify-between items-start mb-10">
            <View>
              <Text className="text-3xl font-black tracking-tighter text-slate-900 leading-none">INVOICE</Text>
              <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Forge India Connect</Text>
            </View>
            <View className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paid / COD</Text>
            </View>
          </View>
          
          <View className="mb-8 flex-row justify-between">
            <View>
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice To</Text>
              <Text className="font-bold text-slate-800 text-sm">{address}</Text>
              <Text className="font-bold text-slate-500 text-xs mt-1">{phone}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice No.</Text>
              <Text className="font-bold text-slate-800 text-sm uppercase">#{orderId.slice(-8)}</Text>
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3 mb-1">Date</Text>
              <Text className="font-bold text-slate-500 text-xs">{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Line Items */}
          <View className="border-t border-b border-slate-100 py-4 mb-6">
            <View className="flex-row justify-between mb-4">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</Text>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-slate-800 text-sm">{service.serviceName}</Text>
              <Text className="font-black text-slate-900 text-sm">₹{service.basePrice}</Text>
            </View>
            {addMembership && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-blue-600 text-sm">FIC Premium Membership</Text>
                <Text className="font-black text-blue-600 text-sm">₹{membershipPrice}</Text>
              </View>
            )}
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-slate-500 text-xs">Dispatch & Fulfillment Fee</Text>
              <Text className="font-bold text-slate-500 text-xs">₹50</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
            <Text className="font-black text-slate-500 uppercase tracking-widest text-xs">Total Amount</Text>
            <Text className="font-black text-primary text-2xl tracking-tighter">₹{(service.basePrice || 500) + 50 + (addMembership ? membershipPrice : 0)}</Text>
          </View>

          <Text className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Thank you for trusting FIC.</Text>
        </View>

        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/30 mt-6 mb-12"
          onPress={() => router.replace('/')}
        >
          <Text className="text-white font-black uppercase tracking-widest text-sm">Return to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (isCheckout) {
    return (
      <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ padding: 24, paddingTop: 48, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setIsCheckout(false)} className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center border border-slate-800 mb-6">
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        
        <Text className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Checkout</Text>

        <View className="bg-dark-card p-5 rounded-3xl border border-slate-800 shadow-xl mb-6 flex-row gap-4">
          <Image source={{ uri: service.bannerImage || 'https://via.placeholder.com/150' }} className="w-20 h-20 rounded-2xl" />
          <View className="flex-1 justify-center">
            <Text className="text-white font-black text-lg leading-tight">{service.serviceName}</Text>
            <Text className="text-primary font-bold text-xs uppercase tracking-widest mt-1">₹{service.basePrice}</Text>
          </View>
        </View>

        <View className="space-y-4 mb-8">
          <Text className="text-slate-400 font-black uppercase tracking-widest text-xs ml-2">Service Details</Text>
          
          <View className="bg-[#0f172a] border border-slate-800 rounded-2xl p-2 flex-row items-center">
            <View className="w-12 h-12 items-center justify-center"><MapPin color="#64748b" size={20} /></View>
            <TextInput 
              className="flex-1 text-white h-full pr-4 font-medium"
              placeholder="Full Address (e.g. 123 Main St, Apt 4)" placeholderTextColor="#64748b"
              value={address} onChangeText={setAddress}
            />
          </View>

          <View className="bg-[#0f172a] border border-slate-800 rounded-2xl p-2 flex-row items-center">
            <View className="w-12 h-12 items-center justify-center"><CheckCircle2 color="#64748b" size={20} /></View>
            <TextInput 
              className="flex-1 text-white h-full pr-4 font-medium"
              placeholder="Contact Number" placeholderTextColor="#64748b" keyboardType="phone-pad"
              value={phone} onChangeText={setPhone}
            />
          </View>
        </View>

        <View className="bg-dark-card p-5 rounded-3xl border border-slate-800 mb-8 space-y-3">
          <View className="flex-row justify-between"><Text className="text-slate-400">Service Fee</Text><Text className="text-white font-bold">₹{service.basePrice}</Text></View>
          {addMembership && (
            <View className="flex-row justify-between"><Text className="text-blue-400 font-bold">Premium Membership</Text><Text className="text-blue-400 font-bold">₹{membershipPrice}</Text></View>
          )}
          <View className="flex-row justify-between"><Text className="text-slate-400">Dispatch Fee</Text><Text className="text-white font-bold">₹50</Text></View>
          <View className="h-px bg-slate-800 my-2" />
          <View className="flex-row justify-between"><Text className="text-white font-black text-lg">Total</Text><Text className="text-primary font-black text-lg">₹{(service.basePrice || 500) + 50 + (addMembership ? membershipPrice : 0)}</Text></View>
        </View>

        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/30 mt-6"
          onPress={handleCheckout} disabled={booking}
        >
          {booking ? <ActivityIndicator color="#fff" size="small" /> : (
            <>
              <Zap color="white" size={18} />
              <Text className="text-white font-black uppercase tracking-widest text-sm">Pay Now</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      <ScrollView className="flex-1">
        <View className="relative h-80">
          <Image source={{ uri: service.bannerImage || 'https://via.placeholder.com/400x300' }} className="w-full h-full" />
          <View className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent" />
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-xl items-center justify-center border border-white/10 backdrop-blur-md">
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        <View className="p-6 -mt-10">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">{service.category}</Text>
              <Text className="text-3xl font-black text-white leading-tight">{service.serviceName}</Text>
            </View>
            <View className="bg-dark-card px-4 py-2 rounded-2xl border border-slate-800 shadow-xl ml-4">
              <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center mb-1">Starting At</Text>
              <Text className="text-xl font-black text-white">₹{service.basePrice}</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-dark-card self-start px-4 py-2 rounded-full border border-slate-800 mb-8">
            <ShieldCheck color="#10b981" size={16} className="mr-2" />
            <Text className="text-slate-300 font-bold text-xs">{service.provider || 'FIC Verified Professional'}</Text>
          </View>

          <Text className="text-white font-black text-lg uppercase tracking-tight mb-4">Service Overview</Text>
          <Text className="text-slate-400 font-medium leading-relaxed mb-8">
            {service.description || 'Professional, high-quality service delivered directly to your doorstep by verified experts. We guarantee 100% satisfaction on all jobs.'}
          </Text>

          <View className="bg-dark-card p-5 rounded-3xl border border-slate-800 mb-8 space-y-4">
            <Text className="text-white font-black text-sm uppercase tracking-widest border-b border-slate-800 pb-2">What's Included</Text>
            {['Expert consultation', 'Professional tools & equipment', 'Post-service cleanup', '30-day service warranty'].map((item, i) => (
              <View key={i} className="flex-row items-center gap-3">
                <CheckCircle2 color="#22c55e" size={16} />
                <Text className="text-slate-300 text-sm font-medium">{item}</Text>
              </View>
            ))}
          </View>
          
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Floating Book Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-dark-bg/90 backdrop-blur-xl border-t border-slate-800">
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/30"
          onPress={() => {
            if (Platform.OS === 'web' && typeof document !== 'undefined') {
              (document.activeElement as any)?.blur();
            }
            if (!user?.membershipVault || user.membershipVault.planTier === 'None') {
              setShowPremiumPopup(true);
            } else {
              setIsCheckout(true);
            }
          }}
        >
          <ShoppingBag color="white" size={18} />
          <Text className="text-white font-black uppercase tracking-widest text-sm">Book Service Now</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Membership Modal */}
      <Modal visible={showPremiumPopup} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/80 backdrop-blur-md p-4">
          <View className="bg-slate-900 rounded-[2.5rem] border border-blue-500/30 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
            <View className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></View>
            
            <View className="p-8">
              <TouchableOpacity 
                onPress={() => { setShowPremiumPopup(false); setIsCheckout(true); }}
                className="absolute top-6 right-6 w-8 h-8 bg-white/5 rounded-full items-center justify-center border border-white/10 z-10"
              >
                <X color="#94a3b8" size={16} />
              </TouchableOpacity>

              <View className="self-start px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                <Text className="text-blue-400 text-[10px] font-black uppercase tracking-widest">✨ Premium Benefits</Text>
              </View>
              
              <Text className="text-3xl font-black text-white tracking-tighter leading-tight mb-2">
                Unlock <Text className="text-blue-500">Premium</Text>
              </Text>
              <Text className="text-sm text-slate-400 leading-relaxed mb-6">
                You're missing exclusive member pricing, zero convenience fees, priority booking access, and premium rewards.
              </Text>

              <View className="space-y-3 mb-8">
                {[
                  { label: 'Zero transaction fees', icon: Zap },
                  { label: 'Exclusive discounts', icon: BadgeCheck },
                  { label: 'Priority service booking', icon: Clock },
                  { label: 'Premium customer support', icon: ShieldCheck }
                ].map((item, i) => (
                  <View key={i} className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-blue-500/10 items-center justify-center">
                      <item.icon size={14} color="#3b82f6" />
                    </View>
                    <Text className="text-xs font-bold text-white uppercase tracking-widest">{item.label}</Text>
                  </View>
                ))}
              </View>

              <View className="gap-3">
                <TouchableOpacity 
                  className="w-full bg-blue-600 py-4 rounded-2xl items-center justify-center flex-row shadow-lg shadow-blue-500/30 mb-3"
                  onPress={() => { setAddMembership(true); setShowPremiumPopup(false); setIsCheckout(true); }}
                >
                  <Text className="text-white font-black uppercase tracking-widest text-sm">Add Basic Plan (₹999)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-full bg-slate-800 py-4 rounded-2xl items-center justify-center mb-3"
                  onPress={() => { setShowPremiumPopup(false); router.push('/(drawer)/customer'); }}
                >
                  <Text className="text-white font-bold uppercase tracking-widest text-xs">Explore All Plans</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="w-full py-4 items-center justify-center"
                  onPress={() => { setShowPremiumPopup(false); setIsCheckout(true); }}
                >
                  <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Skip & Pay Full Price</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
