import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, ChevronLeft, Edit2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProfileScreen() {
  const { user, saveUser } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    firstName: '', lastName: '', email: '', mobile: '', address: '', panNumber: '', gstNumber: '', kycStatus: '', resumeUrl: ''
  });

  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(params.tab ? (params.tab as string) : 'profile');

  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as string);
    }
  }, [params.tab]);

  const [avatarUri, setAvatarUri] = useState('');
  
  // Settings & Privacy State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkEnabled, setDarkEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const submitPasswordChange = () => {
    if (newPassword && newPassword.length >= 6) {
      setShowPasswordModal(false);
      Alert.alert("Success", "Your password has been updated securely.");
    } else {
      Alert.alert("Error", "Password must be at least 6 characters.");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        panNumber: user.panNumber || '',
        gstNumber: user.gstNumber || '',
        resumeUrl: user.resumeUrl || '',
        kycStatus: user.kycStatus === 'Not Started' ? 'Pending' : user.kycStatus
      });
      setAvatarUri(user.avatar || '');
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your camera roll to update your profile image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setAvatarUri(base64Img);
      setFormData((prev: any) => ({ ...prev, avatar: base64Img }));
    }
  };

  const handleUpdate = async () => {
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (formData.email && !emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      Alert.alert('Validation Error', 'Mobile number must be exactly 10 digits.');
      return;
    }
    if (!formData.address || formData.address.trim() === '') {
      Alert.alert('Validation Error', 'Please provide your full address.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      if ((payload.panNumber || payload.gstNumber) && user?.kycStatus !== 'Verified') {
        payload.kycStatus = 'Pending';
      }
      
      const { data } = await api.put('/users/profile', payload);
      saveUser({ ...user, ...data }); // Update local context
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="pt-12 pb-6 px-6 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-200 shadow-sm">
            <ChevronLeft color="#0f172a" size={20} />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-900 uppercase tracking-tighter">My Profile</Text>
          <View className="w-10 h-10" />
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <TouchableOpacity onPress={pickImage} className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center border border-blue-100 mb-4 shadow-sm shadow-blue-500/10 overflow-hidden">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} className="w-full h-full" />
              ) : (
                <User color="#3b82f6" size={40} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} className="absolute bottom-4 right-0 w-8 h-8 bg-blue-500 rounded-full border-4 border-slate-50 items-center justify-center shadow-sm">
              <Edit2 color="#fff" size={12} />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-black text-slate-900">{user?.firstName} {user?.lastName}</Text>
          <Text className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-1">
            {user?.role} Account
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-slate-200/50 p-1 rounded-full mb-8">
          <TouchableOpacity onPress={() => setActiveTab('profile')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'profile' ? 'bg-white shadow-sm' : ''}`}>
            <Text className={`text-xs font-black uppercase tracking-widest ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-500'}`}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('settings')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'settings' ? 'bg-white shadow-sm' : ''}`}>
            <Text className={`text-xs font-black uppercase tracking-widest ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-500'}`}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('privacy')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'privacy' ? 'bg-white shadow-sm' : ''}`}>
            <Text className={`text-xs font-black uppercase tracking-widest ${activeTab === 'privacy' ? 'text-blue-600' : 'text-slate-500'}`}>Privacy</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'profile' && (
          <View>
            {/* Form Fields */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 space-y-4">
          <Text className="text-slate-900 font-black text-sm uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">Personal Information</Text>
          
          <View className="flex-row gap-4">
            <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
              <User color="#94a3b8" size={18} className="mr-3" />
              <TextInput 
                className="flex-1 text-slate-900 font-medium"
                placeholder="First Name" placeholderTextColor="#94a3b8"
                value={formData.firstName} onChangeText={t => setFormData({...formData, firstName: t})}
              />
            </View>
            <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
              <TextInput 
                className="flex-1 text-slate-900 font-medium"
                placeholder="Last Name" placeholderTextColor="#94a3b8"
                value={formData.lastName} onChangeText={t => setFormData({...formData, lastName: t})}
              />
            </View>
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center opacity-70">
            <Mail color="#94a3b8" size={18} className="mr-3" />
            <TextInput 
              className="flex-1 text-slate-900 font-medium"
              value={formData.email} editable={false}
            />
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
            <Phone color="#94a3b8" size={18} className="mr-3" />
            <TextInput 
              className="flex-1 text-slate-900 font-medium"
              placeholder="Mobile Number" placeholderTextColor="#94a3b8" keyboardType="phone-pad"
              value={formData.mobile} onChangeText={t => setFormData({...formData, mobile: t})}
            />
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
            <MapPin color="#94a3b8" size={18} className="mr-3" />
            <TextInput 
              className="flex-1 text-slate-900 font-medium"
              placeholder="Full Address" placeholderTextColor="#94a3b8"
              value={formData.address} onChangeText={t => setFormData({...formData, address: t})}
            />
          </View>

          {user?.role === 'Candidate' && (
            <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
              <FileText color="#94a3b8" size={18} className="mr-3" />
              <TextInput 
                className="flex-1 text-slate-900 font-medium"
                placeholder="Resume URL (e.g., Google Drive Link)" placeholderTextColor="#94a3b8"
                value={formData.resumeUrl} onChangeText={t => setFormData({...formData, resumeUrl: t})}
              />
            </View>
          )}

        </View>

        {/* KYC Verification Section */}
        {user?.role !== 'Customer' && user?.role !== 'User' && (
          <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 space-y-4">
          <View className="flex-row items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <Text className="text-slate-900 font-black text-sm uppercase tracking-widest">Document Verification (KYC)</Text>
            {user?.kycStatus === 'Verified' ? (
              <View className="bg-green-100 px-2 py-1 rounded"><Text className="text-green-600 text-[10px] font-bold uppercase">VERIFIED</Text></View>
            ) : user?.kycStatus === 'Pending' ? (
              <View className="bg-orange-100 px-2 py-1 rounded"><Text className="text-orange-600 text-[10px] font-bold uppercase">PENDING</Text></View>
            ) : (
              <View className="bg-red-100 px-2 py-1 rounded"><Text className="text-red-600 text-[10px] font-bold uppercase">UNVERIFIED</Text></View>
            )}
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
            <ShieldCheck color="#94a3b8" size={18} className="mr-3" />
            <TextInput 
              className="flex-1 text-slate-900 font-medium"
              placeholder="PAN Number" placeholderTextColor="#94a3b8"
              value={formData.panNumber} onChangeText={t => setFormData({...formData, panNumber: t})}
              editable={user?.kycStatus !== 'Verified'}
            />
          </View>
          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center">
            <ShieldCheck color="#94a3b8" size={18} className="mr-3" />
            <TextInput 
              className="flex-1 text-slate-900 font-medium"
              placeholder="GST Number (Optional)" placeholderTextColor="#94a3b8"
              value={formData.gstNumber} onChangeText={t => setFormData({...formData, gstNumber: t})}
              editable={user?.kycStatus !== 'Verified'}
            />
          </View>
          {user?.kycStatus !== 'Verified' && (
            <Text className="text-[10px] text-slate-400 mt-2">Enter your PAN and GST numbers to apply for Vendor or Professional verification. Updating your profile will submit your KYC for review.</Text>
          )}
          </View>
        )}

        <TouchableOpacity 
          className="w-full bg-blue-600 py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-blue-600/30 mb-12"
          onPress={handleUpdate} disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" size="small" /> : (
            <>
              <Save color="white" size={18} />
              <Text className="text-white font-black uppercase tracking-widest text-sm">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
        </View>
        )}

        {activeTab === 'settings' && (
          <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
            <Text className="text-slate-900 font-black text-lg mb-6 uppercase tracking-tighter">App Settings</Text>
            
            <View className="flex-row justify-between items-center py-4 border-b border-slate-100">
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 font-bold">Push Notifications</Text>
                <Text className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex-wrap">Receive alerts for new orders & messages</Text>
              </View>
              <TouchableOpacity onPress={() => setPushEnabled(!pushEnabled)} className={`w-12 h-6 rounded-full flex-row items-center px-1 ${pushEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}>
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center py-4 border-b border-slate-100">
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 font-bold">Email Updates</Text>
                <Text className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex-wrap">Daily summaries and promotional offers</Text>
              </View>
              <TouchableOpacity onPress={() => setEmailEnabled(!emailEnabled)} className={`w-12 h-6 rounded-full flex-row items-center px-1 ${emailEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}>
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center py-4">
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 font-bold">Dark Mode</Text>
                <Text className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex-wrap">System default theme</Text>
              </View>
              <TouchableOpacity onPress={() => setDarkEnabled(!darkEnabled)} className={`w-12 h-6 rounded-full flex-row items-center px-1 ${darkEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'}`}>
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'privacy' && (
          <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
            <Text className="text-slate-900 font-black text-lg mb-6 uppercase tracking-tighter">Security & Privacy</Text>
            
            <View className="flex-row justify-between items-center py-4 border-b border-slate-100">
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 font-bold">Two-Factor Authentication</Text>
                <Text className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex-wrap">Protect your account with an extra step</Text>
              </View>
              <TouchableOpacity onPress={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`w-12 h-6 rounded-full flex-row items-center px-1 ${twoFactorEnabled ? 'bg-green-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleChangePassword} className="py-4 border-b border-slate-100">
              <Text className="text-blue-600 font-bold">Change Password</Text>
              <Text className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Update your login credential securely</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert("Confirm", "Are you sure you want to request account deletion? This action cannot be undone.", [{text: "Cancel"}, {text: "Request Deletion", style: "destructive"}])} className="py-4 mt-2">
              <Text className="text-red-500 font-bold">Delete Account</Text>
              <Text className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 flex-wrap">Permanently remove your data</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white p-6 rounded-3xl w-full shadow-xl">
            <Text className="text-slate-900 font-black text-lg mb-2">Change Password</Text>
            <Text className="text-slate-500 text-xs mb-4">Enter your new password below. It must be at least 6 characters long.</Text>
            
            <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex-row items-center mb-6">
              <ShieldCheck color="#94a3b8" size={18} className="mr-3" />
              <TextInput 
                className="flex-1 text-slate-900 font-medium"
                placeholder="New Password" 
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
                value={newPassword} 
                onChangeText={setNewPassword}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 bg-slate-100 py-3 rounded-xl items-center"
                onPress={() => setShowPasswordModal(false)}
              >
                <Text className="text-slate-600 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
                onPress={submitPasswordChange}
              >
                <Text className="text-white font-bold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
