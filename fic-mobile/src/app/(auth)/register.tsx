import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, Network, Zap, UserCircle, Briefcase, Building2, ShoppingBag, Wrench, Truck, FileText, MapPin, X } from 'lucide-react-native';
import api from '../../services/api';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

let MapView: any = View;
let Marker: any = View;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn('react-native-maps not available');
  }
}

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', password: '', role: 'Customer',
    serviceInterest: 'General Shopping',
    domainInterest: 'IT',
    candidateType: 'Standard',
    businessName: '',
    gstNumber: '',
    propertyName: '',
    propertyType: 'PG',
    pricingMin: '',
    pricingMax: '',
    exactLocation: null,
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [mapRegion, setMapRegion] = useState<any>(null);

  const requestLocation = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Notice', 'Interactive maps are optimized for the mobile app. Please enter your address manually.');
      return;
    }
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location access to pin your shop.');
      return;
    }

    setMapModalVisible(true);
    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setCurrentLocation(region);
    setMapRegion(region);
  };

  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData(prev => ({ 
        ...prev, 
        profileDocuments: [{ url: base64Img, name: 'KYC Document', type: 'credential' }] 
      }));
      Alert.alert('Success', 'Document attached successfully');
    }
  };

  const handleRegister = async () => {
    console.log("Register Button Clicked");
    console.log("Form Data:", formData);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.mobile) {
      const msg = 'Please fill in all core fields';
      console.log("Validation Failed:", msg);
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
      return;
    }

    if (['Vendor', 'Seller', 'Service Provider'].includes(formData.role)) {
      if (!formData.businessName || !formData.gstNumber) {
        const msg = 'Business Name and GST are required for this role.';
        console.log("Validation Failed:", msg);
        if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
        return;
      }
    }
    
    setLoading(true);
    try {
      console.log("Sending request to /auth/register...");
      const res = await api.post('/auth/register', formData);
      console.log("Registration Response:", res.data);
      if (Platform.OS === 'web') window.alert('Registration Successful. Welcome to Forge India Connect!');
      else Alert.alert('Registration Successful', 'Welcome to Forge India Connect!');
      router.replace('/(auth)/login');
    } catch (err: any) {
      console.error("Registration Failed Error:", err.response?.data || err.message || err);
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      if (Platform.OS === 'web') window.alert('Registration Failed: ' + msg);
      else Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const roleIcons: any = {
    Customer: <UserCircle size={20} color="white" />,
    Candidate: <Briefcase size={20} color="white" />,
    Vendor: <Building2 size={20} color="white" />,
    Seller: <ShoppingBag size={20} color="white" />,
    'Service Provider': <Wrench size={20} color="white" />,
    HR: <Network size={20} color="white" />,
    'Delivery Partner': <Truck size={20} color="white" />,
    'Rental Provider': <Building2 size={20} color="white" />
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50 dark:bg-dark-bg relative">
      <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 px-4 pt-16 relative" contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}>
        {/* Background Gradients */}
        <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]"></View>
        <View className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></View>

        <View className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
          
          <View className="flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <View>
              <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</Text>
              <View className="h-1.5 w-12 bg-primary rounded-full mt-1"></View>
            </View>
            <View className="flex-row items-center gap-3 p-2 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800 pr-4">
              <View className="w-10 h-10 bg-primary rounded-xl justify-center items-center">
                {roleIcons[formData.role] || <UserCircle size={20} color="white" />}
              </View>
              <View>
                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joining as</Text>
                <Text className="text-[11px] font-black text-primary uppercase">{formData.role}</Text>
              </View>
            </View>
          </View>

          <View className="space-y-5">
            
            <View className="flex-row gap-4">
              <View className="flex-1 space-y-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</Text>
                <TextInput 
                  className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                  placeholder="John" placeholderTextColor="#94a3b8"
                  value={formData.firstName} onChangeText={t => setFormData({...formData, firstName: t})}
                />
              </View>
              <View className="flex-1 space-y-1">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</Text>
                <TextInput 
                  className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                  placeholder="Doe" placeholderTextColor="#94a3b8"
                  value={formData.lastName} onChangeText={t => setFormData({...formData, lastName: t})}
                />
              </View>
            </View>

            <View className="space-y-1">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                placeholder="john@example.com" placeholderTextColor="#94a3b8"
                keyboardType="email-address" autoCapitalize="none"
                value={formData.email} onChangeText={t => setFormData({...formData, email: t})}
              />
            </View>

            <View className="space-y-1">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                placeholder="10-digit number" placeholderTextColor="#94a3b8"
                keyboardType="phone-pad" maxLength={10}
                value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t.replace(/\D/g, '')})}
              />
            </View>

            <View className="space-y-1">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</Text>
              {Platform.OS === 'web' ? (
                <View className="relative justify-center">
                  <select 
                    value={formData.role} 
                    onChange={(e: any) => setFormData({...formData, role: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium appearance-none"
                  >
                    <option value="Customer">Customer / Individual</option>
                    <option value="Candidate">Job Seeker / Candidate</option>
                    <option value="Vendor">Vendor (Bulk/B2B)</option>
                    <option value="Seller">Direct Product Seller</option>
                    <option value="Service Provider">Local Service Provider</option>
                    <option value="HR">HR / Recruiter</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                    <option value="Rental Provider">Rental Provider</option>
                  </select>
                  <View className="absolute right-4 z-10 pointer-events-none">
                    <ChevronDown size={18} color="#94a3b8" />
                  </View>
                </View>
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {['Customer', 'Candidate', 'Vendor', 'Seller', 'Service Provider', 'HR', 'Rental Provider', 'Delivery Partner'].map(r => (
                    <TouchableOpacity 
                      key={r} onPress={() => setFormData({...formData, role: r})}
                      className={`px-3 py-2 rounded-xl border ${formData.role === r ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg'}`}
                    >
                      <Text className={`text-[10px] font-black uppercase tracking-widest ${formData.role === r ? 'text-primary' : 'text-slate-500'}`}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="space-y-1">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                placeholder="••••••••" placeholderTextColor="#94a3b8"
                secureTextEntry
                value={formData.password} onChangeText={t => setFormData({...formData, password: t})}
              />
            </View>

            {/* DYNAMIC ROLE FIELDS */}
            {['Vendor', 'Seller', 'Service Provider'].includes(formData.role) && (
              <View className="space-y-5 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</Text>
                  <TextInput 
                    className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                    placeholder="FIC Enterprises" placeholderTextColor="#94a3b8"
                    value={formData.businessName} onChangeText={t => setFormData({...formData, businessName: t})}
                  />
                </View>
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST / TAX ID</Text>
                  <TextInput 
                    className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                    placeholder="29XXXX..." placeholderTextColor="#94a3b8"
                    value={formData.gstNumber} onChangeText={t => setFormData({...formData, gstNumber: t})}
                  />
                </View>
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location on Map</Text>
                  <TouchableOpacity 
                    onPress={requestLocation}
                    className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <MapPin size={18} color={formData.exactLocation ? "#10b981" : "#94a3b8"} />
                      <Text className={`text-xs font-bold ${formData.exactLocation ? "text-emerald-500" : "text-slate-400"}`}>
                        {formData.exactLocation ? 'Location Pinned Successfully' : 'Tap to Pin Exact Location'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {Platform.OS === 'web' && (
                  <View className="space-y-1">
                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manual Address (Web Fallback)</Text>
                    <TextInput 
                      className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                      placeholder="123 Main St, City, State" placeholderTextColor="#94a3b8"
                      value={formData.address} onChangeText={t => setFormData({...formData, address: t})}
                    />
                  </View>
                )}
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KYC Documents</Text>
                  <TouchableOpacity onPress={pickDocument} className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <FileText size={18} color={(formData as any).profileDocuments ? "#10b981" : "#94a3b8"} />
                      <Text className={`text-xs font-bold ${(formData as any).profileDocuments ? "text-emerald-500" : "text-slate-400"}`}>
                        {(formData as any).profileDocuments ? 'Document Attached' : 'Upload Aadhaar/PAN/GST'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {formData.role === 'Candidate' && (
              <View className="space-y-5 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Protocol</Text>
                  <View className="flex-row gap-2">
                    {['Standard', 'Premium'].map(tier => (
                      <TouchableOpacity 
                        key={tier} onPress={() => setFormData({...formData, candidateType: tier})}
                        className={`flex-1 py-3 px-3 rounded-xl border items-center ${formData.candidateType === tier ? 'border-primary bg-primary' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg'}`}
                      >
                        <Text className={`text-[10px] font-black uppercase tracking-widest ${formData.candidateType === tier ? 'text-white' : 'text-slate-500'}`}>
                          {tier === 'Standard' ? 'Standard (Free)' : 'Elite (Paid)'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resume Upload (PDF)</Text>
                  <TouchableOpacity className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <FileText size={18} color="#94a3b8" />
                      <Text className="text-xs font-bold text-slate-400">Select PDF Document</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {formData.role === 'Rental Provider' && (
              <View className="space-y-5 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Name</Text>
                  <TextInput 
                    className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                    placeholder="Green Valley PG" placeholderTextColor="#94a3b8"
                    value={formData.propertyName} onChangeText={t => setFormData({...formData, propertyName: t})}
                  />
                </View>
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Pricing</Text>
                  <View className="flex-row gap-4">
                    <TextInput 
                      className="flex-1 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                      placeholder="Min ₹" placeholderTextColor="#94a3b8" keyboardType="numeric"
                      value={formData.pricingMin} onChangeText={t => setFormData({...formData, pricingMin: t})}
                    />
                    <TextInput 
                      className="flex-1 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-medium"
                      placeholder="Max ₹" placeholderTextColor="#94a3b8" keyboardType="numeric"
                      value={formData.pricingMax} onChangeText={t => setFormData({...formData, pricingMax: t})}
                    />
                  </View>
                </View>
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Map Location</Text>
                  <TouchableOpacity 
                    onPress={requestLocation}
                    className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <MapPin size={18} color={formData.exactLocation ? "#10b981" : "#94a3b8"} />
                      <Text className={`text-xs font-bold ${formData.exactLocation ? "text-emerald-500" : "text-slate-400"}`}>
                        {formData.exactLocation ? 'Location Pinned Successfully' : 'Tap to Pin Property Location'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              className="bg-primary py-5 rounded-2xl flex-row justify-center items-center gap-2 shadow-lg shadow-primary/30 mt-6 active:scale-95 transition-transform"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <Text className="text-white font-black uppercase tracking-widest text-sm">Processing...</Text> : (
                <>
                  <Text className="text-white font-black uppercase tracking-widest text-sm">Finalize Registration</Text>
                  <ArrowRight size={18} color="white" />
                </>
              )}
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center">
              <Text className="text-slate-500 font-bold text-sm">Already a member? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-primary font-black uppercase tracking-widest text-[11px] underline">Sign In</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>

      {/* Map Modal */}
      {Platform.OS !== 'web' && (
        <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
          <View className="flex-1 bg-white dark:bg-dark-bg">
            <View className="px-6 pt-16 pb-4 flex-row justify-between items-center shadow-sm z-10 bg-white dark:bg-dark-bg">
              <Text className="text-xl font-black text-slate-900 dark:text-white">Pin Location</Text>
              <TouchableOpacity onPress={() => setMapModalVisible(false)} className="bg-slate-100 dark:bg-dark-card p-2 rounded-full">
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-1 relative">
              {!currentLocation ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#2563eb" />
                  <Text className="text-slate-400 font-bold mt-4 text-xs">Locating satellite...</Text>
                </View>
              ) : (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={currentLocation}
                  onRegionChangeComplete={(region: any) => setMapRegion(region)}
                  showsUserLocation={true}
                >
                  <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                </MapView>
              )}

              {/* Confirm Button Overlay */}
              <View className="absolute bottom-10 left-6 right-6">
                <View className="bg-white dark:bg-dark-card p-4 rounded-3xl shadow-2xl mb-4 items-center">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Drag map to position pin</Text>
                  <Text className="text-xs font-bold text-slate-900 dark:text-white text-center">
                    {mapRegion ? `${mapRegion.latitude.toFixed(4)}, ${mapRegion.longitude.toFixed(4)}` : 'Waiting...'}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => {
                    setFormData({...formData, exactLocation: mapRegion});
                    setMapModalVisible(false);
                  }}
                  className="bg-primary py-5 rounded-2xl flex-row justify-center items-center gap-2 shadow-lg shadow-primary/30"
                >
                  <Text className="text-white font-black uppercase tracking-widest text-sm">Confirm Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}
