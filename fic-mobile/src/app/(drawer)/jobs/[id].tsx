import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Briefcase, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle2, ChevronRight, FileText } from 'lucide-react-native';
import api from '../../../services/api';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get('/jobs');
        const foundJob = res.data.find((j: any) => j._id === id);
        setJob(foundJob);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post('/applications', { job: id });
      Alert.alert('Success', 'Your application has been successfully submitted to HR!');
      router.canGoBack() ? router.back() : router.replace('/');
    } catch (err: any) {
      Alert.alert('Application Failed', err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center p-6">
        <Text className="text-white text-xl font-bold">Job not found.</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="mt-4 px-6 py-3 bg-primary rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md z-10">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center border border-slate-800 mb-4">
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-white leading-tight">{job.title}</Text>
        <Text className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{job.companyName}</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Quick Details */}
        <View className="flex-row flex-wrap gap-3 mb-8">
          <View className="flex-row items-center bg-dark-card px-4 py-2 rounded-xl border border-slate-800">
            <MapPin color="#94a3b8" size={14} className="mr-2" />
            <Text className="text-slate-300 font-bold text-xs">{job.location || 'Remote'}</Text>
          </View>
          <View className="flex-row items-center bg-dark-card px-4 py-2 rounded-xl border border-slate-800">
            <Clock color="#94a3b8" size={14} className="mr-2" />
            <Text className="text-slate-300 font-bold text-xs">{job.jobType || 'Full-time'}</Text>
          </View>
          {job.salary && (
            <View className="flex-row items-center bg-dark-card px-4 py-2 rounded-xl border border-slate-800">
              <DollarSign color="#94a3b8" size={14} className="mr-2" />
              <Text className="text-slate-300 font-bold text-xs">{job.salary}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text className="text-white font-black text-lg uppercase tracking-tight mb-4">Job Description</Text>
          <Text className="text-slate-400 font-medium leading-relaxed">
            {job.description || 'Join our fast-growing ecosystem. We are looking for talented individuals to help scale the FIC network.'}
          </Text>
        </View>

        {/* Requirements */}
        <View className="mb-8">
          <Text className="text-white font-black text-lg uppercase tracking-tight mb-4">Requirements</Text>
          <View className="bg-dark-card p-5 rounded-3xl border border-slate-800">
            {job.requirements ? (
              <Text className="text-slate-400 font-medium leading-relaxed">{job.requirements}</Text>
            ) : (
              <View className="space-y-3">
                {['Minimum 2 years of relevant experience', 'Strong communication skills', 'Ability to work independently', 'Knowledge of the FIC ecosystem'].map((req, i) => (
                  <View key={i} className="flex-row items-start gap-3">
                    <View className="mt-0.5"><CheckCircle2 color="#22c55e" size={16} /></View>
                    <Text className="text-slate-300 text-sm font-medium flex-1">{req}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Floating Apply Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-dark-bg/90 backdrop-blur-xl border-t border-slate-800">
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-lg shadow-primary/30"
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FileText color="white" size={18} />
              <Text className="text-white font-black uppercase tracking-widest text-sm">Submit Application</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
