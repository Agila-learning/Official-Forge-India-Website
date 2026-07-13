import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldAlert, FileText, Car, Clock, XCircle, CheckCircle, UploadCloud } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

export default function DriverOnboardingScreen() {
  const { step } = useLocalSearchParams();
  const router = useRouter();
  
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [documents, setDocuments] = useState({
    aadhaar: '',
    pan: '',
    drivingLicense: ''
  });

  const [vehicleDocuments, setVehicleDocuments] = useState({
    rcDocument: '',
    insuranceDocument: ''
  });

  useEffect(() => {
    fetchDriverProfile();
  }, [step]);

  const fetchDriverProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      if (data && data.driverProfile) {
        setDriver(data.driverProfile);
        
        const status = data.driverProfile.verificationStatus;
        if (status === 'Pending' && !['setup', 'documents', 'vehicle'].includes(step as string)) {
          router.replace('/onboarding/setup' as any);
        } else if (status === 'Under Review' && step !== 'review') {
          router.replace('/onboarding/review' as any);
        } else if (status === 'Verified') {
          router.replace('/(drawer)/driver' as any);
        }
      }
    } catch (error) {
      if (Platform.OS === 'web') window.alert('Failed to load profile');
      else Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type: string, category: 'identity' | 'vehicle') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        const asset = result.assets[0];
        
        if (Platform.OS === 'web') {
          const res = await fetch(asset.uri);
          const blob = await res.blob();
          formData.append('file', blob, 'upload.jpg');
        } else {
          const localUri = asset.uri;
          const filename = localUri.split('/').pop() || 'upload.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const typeMatch = match ? `image/${match[1]}` : `image`;
          
          formData.append('file', { uri: localUri, name: filename, type: typeMatch } as any);
        }

        const { data } = await api.post(`/upload?documentType=${type}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const url = typeof data === 'string' ? (data.startsWith('/') ? `http://192.168.1.37:5001${data}` : data) : data.url || data;

        if (category === 'identity') {
          setDocuments(prev => ({ ...prev, [type]: url }));
        } else {
          setVehicleDocuments(prev => ({ ...prev, [type]: url }));
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Upload failed';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Error', msg);
      } finally {
        setUploading(false);
      }
    }
  };

  const submitIdentityDocuments = async () => {
    if (!documents.aadhaar || !documents.pan || !documents.drivingLicense) {
      if (Platform.OS === 'web') window.alert('Please upload all required identity documents');
      else Alert.alert('Missing Documents', 'Please upload all required identity documents');
      return;
    }
    
    try {
      await api.put('/users/driver/onboarding', { documents, step: 'documents' });
      if (driver?.vehicleOwnership === 'Own Vehicle') {
        router.replace('/onboarding/vehicle' as any);
      } else {
        router.replace('/onboarding/review' as any);
      }
    } catch (err) {
      if (Platform.OS === 'web') window.alert('Submission failed');
      else Alert.alert('Error', 'Submission failed');
    }
  };

  const submitVehicleDocuments = async () => {
    if (!vehicleDocuments.rcDocument || !vehicleDocuments.insuranceDocument) {
      if (Platform.OS === 'web') window.alert('Please upload all required vehicle documents');
      else Alert.alert('Missing Documents', 'Please upload all required vehicle documents');
      return;
    }

    try {
      await api.put('/users/driver/onboarding', { vehicleDocuments, step: 'vehicle' });
      router.replace('/onboarding/review' as any);
    } catch (err) {
      if (Platform.OS === 'web') window.alert('Submission failed');
      else Alert.alert('Error', 'Submission failed');
    }
  };

  const renderFileUploader = (label: string, type: string, category: 'identity' | 'vehicle', currentValue: string) => (
    <View className="mb-4">
      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">{label}</Text>
      <TouchableOpacity 
        onPress={() => handleFileUpload(type, category)}
        disabled={uploading}
        className={`w-full p-6 rounded-2xl border-2 border-dashed items-center justify-center ${currentValue ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-card'}`}
      >
        {currentValue ? (
          <>
            <CheckCircle color="#10b981" size={32} />
            <Text className="text-sm font-bold text-green-600 mt-2">Document Uploaded</Text>
          </>
        ) : (
          <>
            <UploadCloud color="#94a3b8" size={32} />
            <Text className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-2">Tap to Upload</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-dark-bg justify-center items-center">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'setup':
        return (
          <View className="items-center py-10">
            <ShieldAlert size={64} color="#3b82f6" />
            <Text className="text-3xl font-black text-slate-900 dark:text-white mt-6 mb-4 text-center tracking-tight">Complete Profile</Text>
            <Text className="text-center text-slate-500 dark:text-slate-400 mb-8 px-4 text-base">We need a few documents to verify your identity before you can start accepting rides.</Text>
            <TouchableOpacity onPress={() => router.replace('/onboarding/documents' as any)} className="w-full py-4 bg-blue-600 rounded-xl items-center shadow-lg shadow-blue-600/30">
              <Text className="text-white font-black uppercase tracking-widest">Start Verification</Text>
            </TouchableOpacity>
          </View>
        );

      case 'documents':
        return (
          <View className="w-full">
            <View className="items-center mb-8">
              <FileText size={48} color="#f97316" />
              <Text className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">Identity Verification</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center px-4">Upload clear photos of your original documents</Text>
            </View>
            
            {renderFileUploader('Aadhaar Card (Front & Back)', 'aadhaar', 'identity', documents.aadhaar)}
            {renderFileUploader('PAN Card', 'pan', 'identity', documents.pan)}
            {renderFileUploader('Driving License', 'drivingLicense', 'identity', documents.drivingLicense)}

            <TouchableOpacity 
              onPress={submitIdentityDocuments} 
              disabled={uploading} 
              className="w-full py-4 bg-orange-500 rounded-xl items-center mt-6 shadow-lg shadow-orange-500/30 flex-row justify-center gap-2"
            >
              {uploading && <ActivityIndicator color="white" />}
              <Text className="text-white font-black uppercase tracking-widest">Submit Identity Docs</Text>
            </TouchableOpacity>
          </View>
        );

      case 'vehicle':
        if (driver?.vehicleOwnership !== 'Own Vehicle') {
          router.replace('/onboarding/review' as any);
          return null;
        }
        return (
          <View className="w-full">
            <View className="items-center mb-8">
              <Car size={48} color="#a855f7" />
              <Text className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2 tracking-tight">Vehicle Documents</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center px-4">Upload RC and Insurance for your {driver?.driverType}</Text>
            </View>
            
            {renderFileUploader('Registration Certificate (RC)', 'rcDocument', 'vehicle', vehicleDocuments.rcDocument)}
            {renderFileUploader('Valid Insurance', 'insuranceDocument', 'vehicle', vehicleDocuments.insuranceDocument)}

            <TouchableOpacity 
              onPress={submitVehicleDocuments} 
              disabled={uploading} 
              className="w-full py-4 bg-purple-600 rounded-xl items-center mt-6 shadow-lg shadow-purple-600/30 flex-row justify-center gap-2"
            >
              {uploading && <ActivityIndicator color="white" />}
              <Text className="text-white font-black uppercase tracking-widest">Submit Vehicle Docs</Text>
            </TouchableOpacity>
          </View>
        );

      case 'review':
        return (
          <View className="items-center py-10">
            <Clock size={64} color="#eab308" />
            <Text className="text-3xl font-black text-slate-900 dark:text-white mt-6 mb-4 text-center tracking-tight">Under Review</Text>
            <Text className="text-center text-slate-500 dark:text-slate-400 mb-8 px-4 text-base">
              Your profile is currently under review. 
              {driver?.vehicleOwnership === 'Company Assigned Vehicle' && " Our admin will assign a vehicle to you shortly."}
            </Text>
            <TouchableOpacity onPress={fetchDriverProfile} className="w-full py-4 bg-yellow-500 rounded-xl items-center shadow-lg shadow-yellow-500/30">
              <Text className="text-white font-black uppercase tracking-widest">Refresh Status</Text>
            </TouchableOpacity>
          </View>
        );

      case 'suspended':
        return (
          <View className="items-center py-10">
            <XCircle size={64} color="#dc2626" />
            <Text className="text-3xl font-black text-slate-900 dark:text-white mt-6 mb-4 text-center tracking-tight">Account Suspended</Text>
            <Text className="text-center text-slate-500 dark:text-slate-400 mb-8 px-4 text-base">Your driver account is currently suspended due to policy violations. Contact support for more information.</Text>
            <TouchableOpacity className="w-full py-4 bg-red-600 rounded-xl items-center shadow-lg shadow-red-600/30">
              <Text className="text-white font-black uppercase tracking-widest">Contact Support</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-dark-bg" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      <View className="bg-white dark:bg-dark-card rounded-[32px] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        {renderContent()}
      </View>
    </ScrollView>
  );
}
