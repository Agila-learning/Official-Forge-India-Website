import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Shield, Target, Users, MapPin, ExternalLink } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-dark-bg">
      {/* Hero Section */}
      <View className="relative h-64 justify-end p-6 pb-10">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} 
          className="absolute inset-0 w-full h-full opacity-30"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent" />
        
        <View className="relative z-10">
          <Text className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Our Mission</Text>
          <Text className="text-slate-300 font-medium leading-relaxed">
            Connecting India's finest professionals with the people who need them most.
          </Text>
        </View>
      </View>

      <View className="px-6 pb-12">
        {/* Core Values */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-12 mt-4">
          <View className="w-[48%] bg-dark-card p-5 rounded-3xl border border-slate-800 shadow-xl items-center text-center">
            <Shield color="#2563eb" size={32} className="mb-3" />
            <Text className="text-white font-black text-sm uppercase tracking-widest mb-1">Trust</Text>
            <Text className="text-slate-400 text-[10px] text-center">100% verified network</Text>
          </View>
          <View className="w-[48%] bg-dark-card p-5 rounded-3xl border border-slate-800 shadow-xl items-center text-center">
            <Target color="#10b981" size={32} className="mb-3" />
            <Text className="text-white font-black text-sm uppercase tracking-widest mb-1">Impact</Text>
            <Text className="text-slate-400 text-[10px] text-center">Empowering local economy</Text>
          </View>
          <View className="w-full bg-primary/10 p-5 rounded-3xl border border-primary/20 shadow-xl items-center flex-row gap-4 mt-2">
            <Users color="#2563eb" size={32} />
            <View className="flex-1">
              <Text className="text-white font-black text-sm uppercase tracking-widest mb-1">Community First</Text>
              <Text className="text-slate-400 text-xs">Building an ecosystem where everyone thrives together.</Text>
            </View>
          </View>
        </View>

        {/* Office Location */}
        <Text className="text-lg font-black text-white mb-4 uppercase tracking-widest border-b border-slate-800 pb-2">
          Headquarters
        </Text>
        <View className="bg-dark-card rounded-3xl border border-slate-800 shadow-xl overflow-hidden mb-8">
          <View className="h-32 bg-slate-800 items-center justify-center relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1548345680-f5475ea90f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' }} 
              className="absolute inset-0 w-full h-full opacity-50"
            />
            <View className="bg-primary/20 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md">
              <MapPin color="#fff" size={24} />
            </View>
          </View>
          <View className="p-5">
            <Text className="text-white font-black text-base uppercase tracking-tighter mb-1">Tirupattur Branch</Text>
            <Text className="text-slate-400 text-xs leading-relaxed">
              No 83, Hyundai Showroom, 1st floor,{'\n'}
              Opp to Jio Petrol Bunk, Tirupattur,{'\n'}
              Tamil Nadu - 635853
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
