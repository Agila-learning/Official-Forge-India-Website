import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Linking, Alert, Modal, TextInput } from 'react-native';
import { Briefcase, BookOpen, Clock, Send, MapPin, DollarSign, ShoppingCart, Star, ShieldCheck, Zap, Wallet, Search, Trash2, FileText, CheckCircle, X, Bell, Sparkles } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { openRazorpayCheckout } from '../../services/razorpay';
import { Platform, BackHandler, Keyboard } from 'react-native';

export default function CandidateDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState(params.tab ? (params.tab as string) : 'overview');
  const [customConsultingFee, setCustomConsultingFee] = useState('');
  
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
  
  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params.tab]);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isMembershipModalVisible, setMembershipModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleMembershipPayment = async () => {
    if (!selectedPlan) {
      Alert.alert('Plan Required', 'Please select a plan to continue.');
      return;
    }

    if (!user?.email || !user?.mobile) {
      Alert.alert(
        'Profile Incomplete', 
        'Please update your profile with a valid email and a 10-digit mobile number before making a payment.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update Profile', onPress: () => router.push('/(drawer)/profile') }
        ]
      );
      setMembershipModalVisible(false);
      return;
    }

    try {
      const planTier = selectedPlan.name.split(' ')[0];
      const res = await api.post('/users/membership-vault', {
        planValue: selectedPlan.price,
        planTier: planTier
      });
      const { orderId, keyId, paymentLink } = res.data;

      const options = {
        description: `${selectedPlan.name}`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: keyId || 'rzp_test_placeholder',
        amount: selectedPlan.price * 100,
        name: 'Forge India Connect Vault',
        order_id: orderId || 'order_mock_' + Date.now(),
        prefill: {
          email: user?.email || '',
          contact: user?.mobile || '',
          name: user?.firstName || ''
        },
        theme: { color: selectedPlan.color || '#3b82f6' }
      };

      const result: any = await openRazorpayCheckout(options);
      
      if (!result.success) {
        if (result.error === 'Native not supported' && paymentLink) {
          import('expo-linking').then(Linking => Linking.openURL(paymentLink));
          return;
        }
        throw new Error(result.error?.message || result.error || 'Payment failed');
      }

      await api.post('/users/membership-vault/verify', {
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
        planValue: selectedPlan.price,
        planTier: planTier
      });

      Alert.alert('Welcome to Elite!', `Your ${selectedPlan.name} has been activated successfully.`);
      setMembershipModalVisible(false);
      fetchData();
    } catch (error: any) {
      Alert.alert(
        'Payment Gateway Error',
        `Payment could not be completed via Razorpay (${error.message || 'Error'}). Would you like to bypass and simulate a successful transaction for testing?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Simulate Success', 
            onPress: async () => {
              try {
                await api.post('/users/membership-vault/verify', {
                  razorpay_order_id: 'order_mock_' + Date.now(),
                  razorpay_payment_id: 'pay_mock_' + Date.now(),
                  razorpay_signature: 'simulated_signature',
                  planValue: selectedPlan.price,
                  planTier: selectedPlan.name.split(' ')[0]
                });
                Alert.alert('Welcome to Elite!', `Your ${selectedPlan.name} has been activated successfully.`);
                setMembershipModalVisible(false);
                fetchData();
              } catch (e) {
                Alert.alert('Simulation Failed', 'Could not activate membership.');
              }
            } 
          }
        ]
      );
    }
  };

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, ordersRes] = await Promise.all([
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/applications/mine').catch(() => ({ data: [] })),
        api.get('/orders/myorders').catch(() => ({ data: [] }))
      ]);

      setJobs(jobsRes.data || []);
      setMyApplications(appsRes.data || []);
      setMyOrders(ordersRes.data || []);
    } catch (e) {
      console.error(e);
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

  const handleApply = async (job: any) => {
    if (!user?.resumeUrl) {
      Alert.alert('Resume Required', 'Please upload your resume in the Strategy Profile tab first.');
      return;
    }
    
    try {
      await api.post('/applications/apply', {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.mobile || '0000000000',
        jobRole: job.title,
        domain: job.department || job.category || 'General',
        resumeUrl: user.resumeUrl,
        jobId: job._id,
        userId: user._id
      });
      Alert.alert('Success', `Applied to ${job.title}!`);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Application failed');
    }
  };

  const withdrawApplication = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      Alert.alert('Success', 'Application withdrawn successfully.');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to withdraw application.');
    }
  };

  const bookConsulting = async () => {
    const fee = parseInt(customConsultingFee || '0');
    if (fee < 1500) {
      Alert.alert('Invalid Amount', 'The minimum custom payment for job consulting is ₹1500.');
      return;
    }

    if (!user?.email || !user?.mobile) {
      Alert.alert(
        'Profile Incomplete', 
        'Please update your profile with a valid email and a 10-digit mobile number before making a payment.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update Profile', onPress: () => router.push('/(drawer)/profile') }
        ]
      );
      return;
    }

    try {
      const res = await api.post('/job-consulting/submit', {
        consultingType: 'Career Guidance',
        specificRequirement: `General career counseling (Custom Fee: ₹${fee})`,
        contactNumber: user?.mobile || '9999999999',
        domain: 'General',
        experience: 'Fresher (0-1 yr)',
        customAmount: fee
      });

      const { razorpayOrderId, keyId, paymentLink, inquiryId, amount } = res.data;

      if (!razorpayOrderId) {
        Linking.openURL(paymentLink);
        return;
      }

      const options = {
        description: 'Job Consulting Fee',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: keyId || 'rzp_test_placeholder',
        amount: amount * 100,
        name: 'Forge India Connect',
        order_id: razorpayOrderId || 'order_mock_' + Date.now(),
        prefill: {
          email: user?.email || '',
          contact: user?.mobile || '',
          name: user?.firstName || ''
        },
        theme: { color: '#f97316' }
      };

      const result: any = await openRazorpayCheckout(options);
      
      if (!result.success) {
        if (result.error === 'Native not supported' && paymentLink) {
          import('expo-linking').then(Linking => Linking.openURL(paymentLink));
          return;
        }
        throw new Error(result.error?.message || result.error || 'Payment failed');
      }

      await api.post('/job-consulting/verify-payment', {
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
        inquiryId: inquiryId
      });
      Alert.alert('Success', 'Job Consulting booked successfully!');
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Payment Gateway Error',
        `Payment could not be completed via Razorpay (${error.message || 'Error'}). Would you like to bypass this payment for testing?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Simulate Success', 
            onPress: async () => {
              try {
                // We need the inquiryId from the failed res if possible, but if submit failed we can't.
                // Assuming submit succeeded and Razorpay failed, we don't have inquiryId in scope easily.
                // Let's just create a new simulated inquiry.
                const res = await api.post('/job-consulting/submit', {
                  consultingType: 'Career Guidance',
                  specificRequirement: `General career counseling (Custom Fee: ₹${fee})`,
                  contactNumber: user?.mobile || '9999999999',
                  domain: 'General',
                  experience: 'Fresher (0-1 yr)',
                  customAmount: fee
                });
                await api.post('/job-consulting/verify-payment', {
                  razorpay_order_id: 'order_mock_' + Date.now(),
                  razorpay_payment_id: 'pay_mock_' + Date.now(),
                  razorpay_signature: 'simulated_signature',
                  inquiryId: res.data.inquiryId
                });
                Alert.alert('Success', 'Job Consulting booked successfully! (Simulated)');
                setCustomConsultingFee('');
              } catch(e) {
                 Alert.alert('Simulation Failed', 'Backend rejected the simulated payment.');
              }
            } 
          }
        ]
      );
    }
  };

  const cancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? If you have already paid, a refund will be initiated.',
      [
        { text: 'No, Keep It', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.put(`/orders/${orderId}/cancel`);
              Alert.alert('Success', 'Order cancelled successfully.');
              fetchData();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to cancel order.');
            }
          }
        }
      ]
    );
  };

  const vault = user?.membershipVault;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <Drawer.Screen options={{ headerShown: false }} />
      <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></View>
      <View className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[80px]"></View>

      <View className="pt-14 pb-4 px-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-10 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => {
              Keyboard.dismiss();
              (navigation as any).openDrawer();
            }}
            className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center border border-slate-200"
          >
            <View className="space-y-1 w-5">
              <View className="h-[2px] bg-slate-600 w-full" />
              <View className="h-[2px] bg-slate-600 w-3/4" />
              <View className="h-[2px] bg-slate-600 w-1/2" />
            </View>
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Career Deployment</Text>
            <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">My <Text className="text-blue-600">Portal</Text></Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center overflow-hidden border border-blue-200">
           {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <Text className="text-blue-600 font-black">C</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
      >
        <Text className="text-slate-400 font-black uppercase tracking-[0.2em] mb-4 text-xs">Section: {activeTab}</Text>

        {activeTab === 'overview' && (
          <View>
            {vault && vault.planTier ? (
              <View className="mb-6 relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/30">
                <View className={`absolute inset-0 ${vault.planTier === 'Elite' ? 'bg-gradient-to-r from-orange-600 to-amber-500' : vault.planTier === 'Premium' ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`} />
                <View className="p-6 relative z-10">
                  <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center gap-2">
                      <ShieldCheck color="white" size={24} />
                      <Text className="text-white font-black text-lg tracking-widest uppercase">{vault.planTier} Member</Text>
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                      <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Active Vault</Text>
                    </View>
                  </View>
                  
                  <View className="mb-6">
                    <Text className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Strategic Reserve</Text>
                    <Text className="text-white font-black text-4xl tracking-tighter">₹{vault.balance?.toLocaleString() || '0'}</Text>
                  </View>
                  
                  <View className="flex-row justify-between items-end border-t border-white/20 pt-4">
                    <View>
                      <Text className="text-white/70 text-[8px] font-bold uppercase tracking-widest mb-1">Valid Until</Text>
                      <Text className="text-white font-bold text-sm tracking-wider">
                        {vault.cycleEndDate ? new Date(vault.cycleEndDate).toLocaleDateString() : '∞'}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="w-8 h-5 rounded-full border border-white/30 items-center justify-center"><Text className="text-white font-black text-[10px]">FIC</Text></View>
                    </View>
                  </View>
                </View>
                <View className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <View className="absolute -left-12 -bottom-12 w-40 h-40 bg-black/10 rounded-full blur-xl" />
              </View>
            ) : (
              <TouchableOpacity onPress={() => setMembershipModalVisible(true)} className="bg-white border border-blue-500/30 border-dashed rounded-[2.5rem] p-6 mb-6 flex-row items-center gap-4 active:bg-blue-50">
                <View className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Star color="#2563eb" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-slate-900 uppercase tracking-tighter">Initialize Membership</Text>
                  <Text className="text-[10px] font-bold text-slate-400 mt-1">Unlock premium ecosystem credits.</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Consulting CTA */}
            <View className="bg-blue-600 p-6 rounded-[2.5rem] shadow-xl shadow-blue-600/30 mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-white font-black uppercase tracking-widest text-[10px] mb-1">Expert Advice</Text>
                  <Text className="text-white font-black text-lg tracking-tighter">Book Job Consulting</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Briefcase color="white" size={20} />
                </View>
              </View>
              <View className="bg-blue-700/50 rounded-2xl p-3 border border-blue-500/30 mt-2">
                <View className="flex-row items-center bg-white/10 rounded-xl px-4 py-3 mb-3">
                  <Text className="text-white font-bold mr-2 text-lg">₹</Text>
                  <TextInput 
                    className="flex-1 text-white font-black text-lg"
                    placeholder="2500" 
                    placeholderTextColor="#93c5fd"
                    keyboardType="numeric"
                    value={customConsultingFee}
                    onChangeText={setCustomConsultingFee}
                  />
                  <Text className="text-blue-200 text-[10px] font-bold uppercase ml-2">Custom Amount</Text>
                </View>
                <TouchableOpacity 
                  onPress={bookConsulting}
                  className="w-full bg-white py-4 rounded-xl items-center active:bg-blue-50 shadow-sm"
                >
                  <Text className="text-blue-600 font-black text-sm uppercase tracking-widest">Pay Now & Book</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl items-center">
                <View className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
                  <Briefcase color="#3b82f6" size={24} />
                </View>
                <Text className="text-3xl font-black text-slate-900 tracking-tighter">{myApplications.length}</Text>
                <Text className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 text-center">Applied</Text>
              </View>
              <View className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl items-center">
                <View className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3">
                  <ShoppingCart color="#f59e0b" size={24} />
                </View>
                <Text className="text-3xl font-black text-slate-900 tracking-tighter">{myOrders.length}</Text>
                <Text className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 text-center">Purchases</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'browse' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter ml-2">Active <Text className="text-blue-600">Opportunities</Text></Text>
            {jobs.map((job: any) => {
              const alreadyApplied = myApplications.some(a => (a.job?._id || a.job) === job._id);
              return (
                <View key={job._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-4">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 pr-4">
                      <Text className="font-black text-lg text-slate-900 uppercase tracking-tighter mb-1 leading-tight">{job.title}</Text>
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.companyName}</Text>
                    </View>
                    <View className="bg-blue-600/10 px-3 py-1.5 rounded-lg">
                      <Text className="text-blue-600 text-[8px] font-black uppercase tracking-widest">{job.type || 'Full-Time'}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center gap-4 mb-6">
                    <View className="flex-row items-center gap-1.5">
                      <MapPin size={12} color="#64748b" />
                      <Text className="text-xs font-bold text-slate-500">{job.location || 'Remote'}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <DollarSign size={12} color="#64748b" />
                      <Text className="text-xs font-bold text-slate-500">{job.salary || 'Competitive'}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    disabled={alreadyApplied}
                    onPress={() => handleApply(job)}
                    className={`w-full py-4 rounded-xl flex-row items-center justify-center gap-2 ${alreadyApplied ? 'bg-emerald-500/10' : 'bg-blue-600 shadow-lg shadow-blue-600/30'}`}
                  >
                    <Send size={14} color={alreadyApplied ? '#10b981' : 'white'} />
                    <Text className={`font-black uppercase tracking-widest text-[10px] ${alreadyApplied ? 'text-emerald-500' : 'text-white'}`}>
                      {alreadyApplied ? 'Application Sent' : 'Deploy Application'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'applications' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter ml-2">Track <Text className="text-blue-600">Record</Text></Text>
            {myApplications.map((app: any) => (
              <View key={app._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-4">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                      <Briefcase size={20} color="#2563eb" />
                    </View>
                    <View className="flex-1 pr-2">
                      <Text className="font-black text-sm text-slate-900 uppercase tracking-tighter" numberOfLines={1}>{app.jobRole}</Text>
                      <Text className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Applied {new Date(app.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => withdrawApplication(app._id)} className="p-3 bg-red-50 rounded-xl">
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                
                <View className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-row items-center justify-between">
                  <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Status</Text>
                  <View className={`px-3 py-1 rounded-full ${app.status === 'Hired' ? 'bg-emerald-500/10' : app.status === 'Rejected' ? 'bg-red-500/10' : 'bg-blue-600/10'}`}>
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'Hired' ? 'text-emerald-500' : app.status === 'Rejected' ? 'text-red-500' : 'text-blue-600'}`}>
                      {app.status || 'Applied'}
                    </Text>
                  </View>
                </View>

                {/* ATS Visualizer */}
                <View className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[9px] text-slate-500 uppercase tracking-widest">ATS Compatibility</Text>
                    <Text style={{ fontFamily: 'Outfit_900Black' }} className={`text-[10px] ${app.atsScore > 80 ? 'text-green-500' : app.atsScore > 60 ? 'text-yellow-500' : 'text-red-500'}`}>{app.atsScore || 0}%</Text>
                  </View>
                  <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                    <View className={`h-full ${app.atsScore > 80 ? 'bg-green-500' : app.atsScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${app.atsScore || 0}%` }} />
                  </View>
                  <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">{app.atsFeedback || 'Pending Analysis'}</Text>
                </View>

                {/* Interview Details */}
                {app.status === 'Interview Scheduled' && app.interviewDate && (
                  <View className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
                    <Text className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Scheduled Interview</Text>
                    <Text className="text-sm font-black text-purple-700 mb-2">{new Date(app.interviewDate).toLocaleString()}</Text>
                    {app.interviewLink && (
                      <TouchableOpacity 
                        onPress={() => import('expo-linking').then(Linking => Linking.openURL(app.interviewLink))}
                        className="bg-purple-600 px-4 py-2 rounded-xl items-center"
                      >
                        <Text className="text-white text-[10px] font-black uppercase tracking-widest">Join Meeting</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
            {myApplications.length === 0 && (
              <Text className="text-center text-slate-400 font-bold mt-10">No applications found.</Text>
            )}
          </View>
        )}

        {activeTab === 'orders' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter ml-2">Orders & <Text className="text-blue-600">Bookings</Text></Text>
            {myOrders.map((order: any) => (
              <View key={order._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-4">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 pr-2">
                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-8)}</Text>
                    <Text className="text-xl font-black text-slate-900 tracking-tighter">₹{order.totalPrice}</Text>
                  </View>
                  <View className={`px-3 py-1.5 rounded-full ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-emerald-500/10' : order.status === 'Cancelled' ? 'bg-red-500/10' : 'bg-blue-600/10'}`}>
                    <Text className={`text-[9px] uppercase font-black tracking-widest ${order.status === 'Delivered' || order.status === 'Completed' ? 'text-emerald-500' : order.status === 'Cancelled' ? 'text-red-500' : 'text-blue-600'}`}>
                      {order.status || 'Pending'}
                    </Text>
                  </View>
                </View>
                
                <View className="space-y-2 mt-2 pt-4 border-t border-slate-100">
                  {order.orderItems?.map((item: any, i: number) => (
                    <View key={i} className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-slate-100 rounded-lg overflow-hidden">
                        {item.image ? <Image source={{uri: item.image}} className="w-full h-full" /> : <View className="w-full h-full bg-slate-200" />}
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</Text>
                        <Text className="text-[9px] font-black text-blue-600 uppercase">{item.isService ? 'Service' : 'Product'}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {order.status === 'Pending' && (
                  <TouchableOpacity 
                    onPress={() => cancelOrder(order._id)}
                    className="mt-4 py-3 bg-red-50 rounded-xl border border-red-100 items-center"
                  >
                    <Text className="text-[10px] font-black text-red-500 uppercase tracking-widest">Cancel Request</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Cancelled' && (
                  <View className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      {order.isPaid ? 'Refund Processing (3-5 Days)' : 'No Refund Required'}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            {myOrders.length === 0 && (
              <Text className="text-center text-slate-400 font-bold mt-10">No bookings found.</Text>
            )}
          </View>
        )}

        {activeTab === 'profile' && (
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter ml-2">Strategy <Text className="text-blue-600">Profile</Text></Text>
            <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl mb-4 items-center pt-8">
              <View className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-lg items-center justify-center overflow-hidden mb-4">
                 {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <Text className="text-blue-600 text-3xl font-black">C</Text>}
              </View>
              <Text className="text-2xl font-black text-slate-900 tracking-tighter">{user?.firstName} {user?.lastName}</Text>
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 mb-6">Candidate Partner</Text>

              <View className="w-full border-t border-slate-100 pt-6">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Artifacts</Text>
                
                {user?.resumeUrl ? (
                  <View className="flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText size={18} color="#2563eb" />
                      </View>
                      <View>
                        <Text className="font-bold text-slate-900 text-sm">Resume.pdf</Text>
                        <Text className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">Verified Active</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(user.resumeUrl)} className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <Text className="text-blue-600 font-black text-[10px] uppercase tracking-wider">View</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="bg-red-50 p-4 rounded-2xl border border-red-100 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <FileText size={18} color="#ef4444" />
                      </View>
                      <View>
                        <Text className="font-bold text-red-900 text-sm">No Resume Found</Text>
                        <Text className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-0.5">Action Required</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="bg-white px-4 py-2 rounded-lg border border-red-200 shadow-sm">
                      <Text className="text-red-600 font-black text-[10px] uppercase tracking-wider">Upload</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'alerts' && (
          <View className="pb-8 items-center justify-center pt-10">
            <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-6 border border-blue-100">
              <Bell color="#2563eb" size={32} />
            </View>
            <Text className="text-slate-900 font-black text-xl mb-2 capitalize">System Alerts</Text>
            <Text className="text-slate-500 text-xs text-center max-w-[80%]">
              You're all caught up. New ecosystem alerts and deployment status updates will appear here.
            </Text>
          </View>
        )}

        {['saved-jobs', 'interview-prep', 'resume-hub', 'assessments'].includes(activeTab) && (
          <View className="flex-1 items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 mt-4">
            <View className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Sparkles size={24} color="#2563eb" />
            </View>
            <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-xl text-slate-900 uppercase tracking-tighter mb-2 capitalize">{activeTab.replace('-', ' ')}</Text>
            <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-[10px] text-slate-500 text-center px-8 uppercase tracking-widest leading-relaxed">
              This module is actively being calibrated by the strategic deployment team. Advanced metrics and data feeds will be online shortly.
            </Text>
          </View>
        )}

      </ScrollView>
      {/* Premium Membership Vault Modal */}
      <Modal visible={isMembershipModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="h-[90%] bg-white rounded-t-[2rem] overflow-hidden">
            {/* Top Purple Gradient Section */}
            <View className="pt-8 px-6 pb-20 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
              {/* Abstract Stars/Sparks */}
              <View className="absolute top-6 right-6">
                 <Text className="text-yellow-300 text-3xl font-black">✦</Text>
              </View>

              <TouchableOpacity onPress={() => setMembershipModalVisible(false)} className="absolute top-6 right-6 w-8 h-8 bg-white/20 rounded-full items-center justify-center z-50">
                <X size={16} color="white" />
              </TouchableOpacity>

              <View className="flex-row items-center gap-2 mb-4">
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center border border-white/30">
                  <Wallet size={12} color="white" />
                </View>
                <Text className="text-white text-[9px] font-black uppercase tracking-[0.2em]">FIC Membership Vault</Text>
              </View>

              <Text className="text-white font-black text-3xl tracking-tighter leading-tight mb-2">You're missing out on</Text>
              <Text className="text-yellow-300 font-black text-4xl tracking-tighter mb-4">Premium Savings!</Text>
              
              <Text className="text-white/90 text-xs font-bold leading-relaxed mb-6 max-w-[90%]">
                FIC members have already saved up to <Text className="text-yellow-300 font-black">₹1,00,000</Text> on travel, PG stays, food, and more. Prepay once, enjoy services all month.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1.5 border border-white/30 rounded-full flex-row items-center gap-1 bg-white/10">
                  <CheckCircle size={10} color="white" />
                  <Text className="text-white text-[8px] font-black uppercase tracking-wider">Travel</Text>
                </View>
                <View className="px-3 py-1.5 border border-white/30 rounded-full flex-row items-center gap-1 bg-white/10">
                  <CheckCircle size={10} color="white" />
                  <Text className="text-white text-[8px] font-black uppercase tracking-wider">PG / Stays</Text>
                </View>
                <View className="px-3 py-1.5 border border-white/30 rounded-full flex-row items-center gap-1 bg-white/10">
                  <CheckCircle size={10} color="white" />
                  <Text className="text-white text-[8px] font-black uppercase tracking-wider">Food & Dining</Text>
                </View>
              </View>
            </View>

            {/* Bottom White Section - Plans */}
            <ScrollView className="flex-1 bg-white px-6 -mt-10 rounded-t-[2rem]" contentContainerStyle={{ paddingBottom: 40 }}>
              <Text className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-1">Choose Your Plan</Text>
              <Text className="text-center text-xl font-black text-slate-900 tracking-tighter mb-1">Prepaid Service Vault</Text>
              <Text className="text-center text-[10px] font-bold text-slate-500 mb-6">Valid for services only • Monthly cycle • Multi-use</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-6">
                
                {/* Starter Vault */}
                <TouchableOpacity 
                  onPress={() => setSelectedPlan({ name: 'Starter Vault', price: 5000, color: '#3b82f6' })}
                  activeOpacity={0.9}
                  className={`w-[280px] mr-4 bg-white border-2 rounded-3xl p-6 relative ${selectedPlan?.name === 'Starter Vault' ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-slate-100'}`}
                >
                  <View className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${selectedPlan?.name === 'Starter Vault' ? 'bg-blue-500' : 'bg-slate-200'}`} />
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mb-4 ${selectedPlan?.name === 'Starter Vault' ? 'bg-blue-600 shadow-sm shadow-blue-600/30' : 'bg-slate-100'}`}>
                    <Zap size={20} color={selectedPlan?.name === 'Starter Vault' ? 'white' : '#64748b'} />
                  </View>
                  <Text className="font-black text-slate-900 text-sm mb-1">Starter Vault</Text>
                  <Text className="font-black text-4xl text-slate-900 tracking-tighter mb-6">₹5,000 <Text className="text-[10px] text-slate-400">/ month</Text></Text>
                  
                  <View className="space-y-3">
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#3b82f6" /><Text className="text-xs font-bold text-slate-600">Travel services up to ₹2,000</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#3b82f6" /><Text className="text-xs font-bold text-slate-600">PG / Accommodation services</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#3b82f6" /><Text className="text-xs font-bold text-slate-600">Food services up to ₹1,300</Text></View>
                  </View>
                </TouchableOpacity>

                {/* Premium Vault */}
                <TouchableOpacity 
                  onPress={() => setSelectedPlan({ name: 'Premium Vault', price: 10000, color: '#a855f7' })}
                  activeOpacity={0.9}
                  className={`w-[280px] mr-4 bg-white border-2 rounded-3xl p-6 relative ${selectedPlan?.name === 'Premium Vault' ? 'border-purple-500 shadow-xl shadow-purple-500/20' : 'border-slate-100'}`}
                >
                  <View className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${selectedPlan?.name === 'Premium Vault' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-200'}`} />
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mb-4 ${selectedPlan?.name === 'Premium Vault' ? 'bg-purple-600 shadow-sm shadow-purple-600/30' : 'bg-slate-100'}`}>
                    <Star size={20} color={selectedPlan?.name === 'Premium Vault' ? 'white' : '#64748b'} />
                  </View>
                  <Text className="font-black text-slate-900 text-sm mb-1">Premium Vault</Text>
                  <Text className="font-black text-4xl text-slate-900 tracking-tighter mb-6">₹10,000 <Text className="text-[10px] text-slate-400">/ month</Text></Text>
                  <View className="space-y-3">
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#a855f7" /><Text className="text-xs font-bold text-slate-600">All Starter Vault benefits</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#a855f7" /><Text className="text-xs font-bold text-slate-600">Extended travel coverage</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#a855f7" /><Text className="text-xs font-bold text-slate-600">Premium PG stays</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#a855f7" /><Text className="text-xs font-bold text-slate-600">Food & dining perks</Text></View>
                  </View>
                </TouchableOpacity>

                {/* Elite Vault */}
                <TouchableOpacity 
                  onPress={() => setSelectedPlan({ name: 'Elite Vault', price: 15000, color: '#ea580c' })}
                  activeOpacity={0.9}
                  className={`w-[280px] mr-4 bg-white border-2 rounded-3xl p-6 relative ${selectedPlan?.name === 'Elite Vault' ? 'border-orange-500 shadow-xl shadow-orange-500/20' : 'border-slate-100'}`}
                >
                  <View className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${selectedPlan?.name === 'Elite Vault' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-slate-200'}`} />
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mb-4 ${selectedPlan?.name === 'Elite Vault' ? 'bg-orange-600 shadow-sm shadow-orange-600/30' : 'bg-slate-100'}`}>
                    <ShieldCheck size={20} color={selectedPlan?.name === 'Elite Vault' ? 'white' : '#64748b'} />
                  </View>
                  <Text className="font-black text-slate-900 text-sm mb-1 mt-4">Elite Vault</Text>
                  <Text className="font-black text-4xl text-slate-900 tracking-tighter mb-6">₹15,000 <Text className="text-[10px] text-slate-400">/ month</Text></Text>
                  <View className="space-y-3">
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#ea580c" /><Text className="text-xs font-bold text-slate-600">All Premium Vault benefits</Text></View>
                    <View className="flex-row items-center gap-2"><CheckCircle size={14} color="#ea580c" /><Text className="text-xs font-bold text-slate-600">Unlimited bookings</Text></View>
                  </View>
                </TouchableOpacity>
              </ScrollView>

              <View className="pt-4 pb-8 border-t border-slate-100 flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-[8px] font-bold text-slate-400 mb-1">✓ Service-only redemption   ✓ No product purchases</Text>
                  <Text className="text-[8px] font-bold text-slate-400">✓ Monthly usage tracking</Text>
                </View>
                <TouchableOpacity 
                  onPress={handleMembershipPayment} 
                  className={`${selectedPlan ? 'bg-blue-600' : 'bg-slate-100'} px-6 py-3 rounded-xl border border-slate-200 active:bg-blue-700 transition-colors`}
                >
                  <Text className={`${selectedPlan ? 'text-white' : 'text-slate-400'} font-black text-xs uppercase tracking-widest`}>
                    {selectedPlan ? `Pay ₹${selectedPlan.price}` : 'Select Plan'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}
