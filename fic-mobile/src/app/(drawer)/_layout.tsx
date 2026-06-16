import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Home, Briefcase, Info, Phone, Search, Play, MessageSquare, X, ChevronRight, ShieldCheck, LayoutDashboard, ShoppingBag, ShoppingCart, Box, Calendar, Tag, Star, CreditCard, Zap, Users, TrendingUp, Settings, Bell, MessageCircle, HelpCircle, Edit3, Package } from 'lucide-react-native';
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router';

function CustomDrawerContent(props: any) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { tab } = useGlobalSearchParams();

  if (user?.role === 'Vendor') {
    return (
      <View className="flex-1 bg-[#0a0f16]">
        {/* Header Profile Section */}
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-white/5">
          <TouchableOpacity 
            onPress={() => props.navigation.closeDrawer()}
            className="absolute top-12 right-6 w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10 z-50"
          >
            <X color="#94a3b8" size={20} />
          </TouchableOpacity>
          
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-8 h-8 bg-[#0a0f16] border-2 border-yellow-500 rounded flex items-center justify-center">
              <Text className="text-blue-500 font-black text-sm tracking-tighter" style={{ marginTop: -2 }}>F</Text>
            </View>
            <View>
              <Text className="text-blue-500 font-black text-xs tracking-widest leading-tight">FORGE INDIA</Text>
              <Text className="text-slate-400 text-[6px] font-bold tracking-[0.2em] leading-tight">CONNECT PVT.LTD</Text>
            </View>
          </View>
          <Text className="text-slate-500 text-[6px] font-bold tracking-[0.3em] mt-1 ml-11">SHAPING FUTURE</Text>
        </View>

        {/* Navigation Links */}
        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <VendorDrawerLink icon={<LayoutDashboard color="#3b82f6" size={22} strokeWidth={1.5} />} label="Dashboard" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'overview' } }); }} active={pathname === '/(drawer)/vendor' && (!tab || tab === 'overview')} />
          <VendorDrawerLink icon={<ShoppingBag color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Bookings" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'bookings' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'bookings'} />
          <VendorDrawerLink icon={<Box color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Inventory" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'inventory' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'inventory'} />
          <VendorDrawerLink icon={<Calendar color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Availability" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'availability' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'availability'} />
          <VendorDrawerLink icon={<Tag color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Pricing" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'pricing' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'pricing'} />
          <VendorDrawerLink icon={<Star color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Reviews" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'reviews' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'reviews'} />
          <VendorDrawerLink icon={<CreditCard color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Payouts" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/vendor', params: { tab: 'payouts' } }); }} active={pathname === '/(drawer)/vendor' && tab === 'payouts'} />
          <VendorDrawerLink icon={<User color="#e2e8f0" size={22} strokeWidth={1.5} />} label="Profile" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />

          {/* Footer Actions */}
          <View className="pt-6 space-y-4 mt-8">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-white/5 border border-white/10 rounded-xl"
              onPress={() => { props.navigation.closeDrawer(); router.push('/'); }}
            >
              <Zap color="#475569" size={20} strokeWidth={1.5} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-500 text-sm">Landing Hub</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-red-900/30 border border-red-900/50 rounded-xl active:bg-red-900/50"
              onPress={() => logout()}
            >
              <LogOut color="#ef4444" size={20} strokeWidth={1.5} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-red-500 text-sm">Secure Exit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'HR') {
    return (
      <View className="flex-1 bg-white">
        {/* Header Profile Section */}
        <View className="relative items-center pt-14 pb-8 border-b border-slate-100">
          <TouchableOpacity 
            onPress={() => props.navigation.closeDrawer()}
            className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm"
          >
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          
          <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100">
             {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : 
             <View className="w-full h-full bg-blue-50 flex items-center justify-center">
                <Text className="text-3xl font-black text-blue-900">HR</Text>
             </View>}
          </View>
          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-900 text-xl tracking-tighter">
            {user?.firstName ? `${user.firstName} ${user.lastName}` : 'HR Executive'}
          </Text>
          <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-blue-500 text-[10px] mt-1 uppercase tracking-[0.2em]">
            EXECUTIVE INTEL
          </Text>
        </View>

        {/* Navigation Links */}
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <HRDrawerLink icon={<LayoutDashboard color="#64748b" size={20} />} label="OVERVIEW" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'overview' } }); }} active={pathname === '/(drawer)/hr' && (!tab || tab === 'overview')} />
          <HRDrawerLink icon={<Briefcase color="#64748b" size={20} />} label="JOB POSTINGS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'requisitions' } }); }} active={pathname === '/(drawer)/hr' && tab === 'requisitions'} />
          <HRDrawerLink icon={<Users color="#64748b" size={20} />} label="CANDIDATE PIPELINE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'pipeline' } }); }} active={pathname === '/(drawer)/hr' && tab === 'pipeline'} />
          <HRDrawerLink icon={<TrendingUp color="#64748b" size={20} />} label="ANALYTICS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'analytics' } }); }} active={pathname === '/(drawer)/hr' && tab === 'analytics'} />
          <HRDrawerLink icon={<Calendar color="#64748b" size={20} />} label="INTERVIEWS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'interviews' } }); }} active={pathname === '/(drawer)/hr' && tab === 'interviews'} />
          <HRDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <HRDrawerLink icon={<Settings color="#64748b" size={20} />} label="SETTINGS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/hr', params: { tab: 'settings' } }); }} active={pathname === '/(drawer)/hr' && tab === 'settings'} />

          {/* Footer Action */}
          <View className="pt-6 mt-4 border-t border-slate-100">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-red-50 rounded-xl"
              onPress={() => logout()}
            >
              <LogOut color="#ef4444" size={20} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-red-500 text-xs tracking-wider">LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  
  if (user?.role === 'Customer' || user?.role === 'User') {
    return (
      <View className="flex-1 bg-white">
        <View className="relative items-center pt-14 pb-8 border-b border-slate-100">
          <TouchableOpacity 
            onPress={() => props.navigation.closeDrawer()}
            className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm"
          >
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100 p-2">
            <Image source={require('../../../assets/images/logo.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-600 text-xl tracking-tighter uppercase">
            Forge India <Text className="text-orange-500">Connect</Text>
          </Text>
          <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-blue-500 text-[10px] mt-1 uppercase tracking-[0.2em]">
            Consumer Portal
          </Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <CandidateDrawerLink icon={<LayoutDashboard color="#64748b" size={20} />} label="CONTROL CENTER" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'overview' } }); }} active={pathname === '/(drawer)/customer' && (!tab || tab === 'overview')} />
          <CandidateDrawerLink icon={<Briefcase color="#eab308" size={20} />} label="JOB CONSULTING 🌟" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/jobs'); }} active={pathname === '/(drawer)/jobs'} />
          <CandidateDrawerLink icon={<ShoppingCart color="#64748b" size={20} />} label="BUY PRODUCTS" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/products'); }} active={pathname === '/(drawer)/products'} />
          <CandidateDrawerLink icon={<ShoppingBag color="#64748b" size={20} />} label="BOOK SERVICES" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/services'); }} active={pathname === '/(drawer)/services'} />
          <CandidateDrawerLink icon={<Box color="#64748b" size={20} />} label="MY BOOKINGS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'orders' } }); }} active={pathname === '/(drawer)/customer' && tab === 'orders'} />
          <CandidateDrawerLink icon={<Briefcase color="#64748b" size={20} />} label="JOB MARKETPLACE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'browse' } }); }} active={pathname === '/(drawer)/customer' && tab === 'browse'} />
          <CandidateDrawerLink icon={<Users color="#64748b" size={20} />} label="MY APPLICATIONS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'applications' } }); }} active={pathname === '/(drawer)/customer' && tab === 'applications'} />
          <CandidateDrawerLink icon={<Bell color="#64748b" size={20} />} label="ALERTS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'alerts' } }); }} active={pathname === '/(drawer)/customer' && tab === 'alerts'} />
          <CandidateDrawerLink icon={<MessageSquare color="#64748b" size={20} />} label="SUPPORT CHAT" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} active={pathname === '/(drawer)/chat'} />
          <CandidateDrawerLink icon={<MessageCircle color="#64748b" size={20} />} label="CHAT WITH QUIPPY" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} active={pathname === '/(drawer)/chat'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'profile' } }); }} active={pathname === '/(drawer)/customer' && tab === 'profile'} />

          <View className="pt-6 mt-4 border-t border-slate-100 space-y-3">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-white rounded-xl active:bg-slate-50"
              onPress={() => { props.navigation.closeDrawer(); router.push('/'); }}
            >
              <Zap color="#94a3b8" size={20} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-500 text-xs tracking-wider">LANDING HUB</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center p-4 bg-red-50 rounded-[2rem] shadow-sm shadow-red-500/10"
              onPress={() => logout()}
            >
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-4">
                <LogOut color="#ef4444" size={16} />
              </View>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">SECURE EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Candidate') {
    return (
      <View className="flex-1 bg-white">
        {/* Header Profile Section */}
        <View className="relative items-center pt-14 pb-8 border-b border-slate-100">
          <TouchableOpacity 
            onPress={() => props.navigation.closeDrawer()}
            className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm"
          >
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          
          <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100 p-2">
            <Image source={require('../../../assets/images/logo.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
          <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-600 text-xl tracking-tighter uppercase">
            Forge India <Text className="text-orange-500">Connect</Text>
          </Text>
          <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-blue-500 text-[10px] mt-1 uppercase tracking-[0.2em]">
            Candidate Partner
          </Text>
        </View>

        {/* Navigation Links */}
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <CandidateDrawerLink icon={<LayoutDashboard color="#64748b" size={20} />} label="CONTROL CENTER" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'overview' } }); }} active={pathname === '/(drawer)/candidate' && (!tab || tab === 'overview')} />
          <CandidateDrawerLink icon={<Briefcase color="#eab308" size={20} />} label="JOB CONSULTING 🌟" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/jobs'); }} active={pathname === '/(drawer)/jobs'} />
          <CandidateDrawerLink icon={<ShoppingCart color="#64748b" size={20} />} label="BUY PRODUCTS" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/products'); }} active={pathname === '/(drawer)/products'} />
          <CandidateDrawerLink icon={<ShoppingBag color="#64748b" size={20} />} label="BOOK SERVICES" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/services'); }} active={pathname === '/(drawer)/services'} />
          <CandidateDrawerLink icon={<Box color="#64748b" size={20} />} label="MY BOOKINGS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'orders' } }); }} active={pathname === '/(drawer)/candidate' && tab === 'orders'} />
          <CandidateDrawerLink icon={<Briefcase color="#64748b" size={20} />} label="JOB MARKETPLACE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'browse' } }); }} active={pathname === '/(drawer)/candidate' && tab === 'browse'} />
          <CandidateDrawerLink icon={<Users color="#64748b" size={20} />} label="MY APPLICATIONS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'applications' } }); }} active={pathname === '/(drawer)/candidate' && tab === 'applications'} />
          <CandidateDrawerLink icon={<Bell color="#64748b" size={20} />} label="ALERTS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'alerts' } }); }} active={pathname === '/(drawer)/candidate' && tab === 'alerts'} />
          <CandidateDrawerLink icon={<MessageSquare color="#64748b" size={20} />} label="SUPPORT CHAT" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} active={pathname === '/(drawer)/chat'} />
          <CandidateDrawerLink icon={<MessageCircle color="#64748b" size={20} />} label="CHAT WITH QUIPPY" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} active={pathname === '/(drawer)/chat'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="STRATEGY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/candidate', params: { tab: 'profile' } }); }} active={pathname === '/(drawer)/candidate' && tab === 'profile'} />

          {/* Footer Actions */}
          <View className="pt-6 mt-4 border-t border-slate-100 space-y-3">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-white rounded-xl active:bg-slate-50"
              onPress={() => { props.navigation.closeDrawer(); router.push('/'); }}
            >
              <Zap color="#94a3b8" size={20} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-500 text-xs tracking-wider">LANDING HUB</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center p-4 bg-red-50 rounded-[2rem] shadow-sm shadow-red-500/10"
              onPress={() => logout()}
            >
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-4">
                <LogOut color="#ef4444" size={16} />
              </View>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">SECURE EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Agent') {
    return (
      <View className="flex-1 bg-[#0f172a]">
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-white/5">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="absolute top-12 right-6 w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10 z-50">
            <X color="#94a3b8" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <ShieldCheck color="white" size={16} />
            </View>
            <View>
              <Text className="text-white font-black text-xs tracking-widest leading-tight">AGENT HUB</Text>
              <Text className="text-blue-500 text-[8px] font-bold tracking-[0.2em] leading-tight">AUTHORIZED ACCESS</Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-6">
          <VendorDrawerLink icon={<ShieldCheck color="#3b82f6" size={22} />} label="Command Center" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/agent'); }} active={pathname === '/(drawer)/agent'} />
          <VendorDrawerLink icon={<User color="#e2e8f0" size={22} />} label="Profile" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <View className="pt-6 mt-8">
            <TouchableOpacity className="flex-row items-center p-4 bg-red-900/30 rounded-xl" onPress={() => logout()}>
              <LogOut color="#ef4444" size={20} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-red-500 text-sm">Secure Exit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Delivery Partner') {
    return (
      <View className="flex-1 bg-white">
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-slate-100">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm">
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Package color="#ea580c" size={20} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-xs tracking-widest leading-tight uppercase">Fleet Operator</Text>
              <Text className="text-orange-500 text-[8px] font-bold tracking-[0.2em] leading-tight uppercase">Logistics Division</Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-4">
          <CandidateDrawerLink icon={<Package color="#ea580c" size={20} />} label="MISSIONS HUB" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/delivery'); }} active={pathname === '/(drawer)/delivery'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <View className="pt-6 mt-4 border-t border-slate-100">
            <TouchableOpacity className="flex-row items-center p-4 bg-red-50 rounded-[2rem]" onPress={() => logout()}>
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-4"><LogOut color="#ef4444" size={16} /></View>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">END SHIFT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Trainer') {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-teal-500/10">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm">
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Play color="white" size={20} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-xs tracking-widest leading-tight uppercase">Educator Hub</Text>
              <Text className="text-teal-500 text-[8px] font-bold tracking-[0.2em] leading-tight uppercase">Trainer Access</Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-4">
          <CandidateDrawerLink icon={<Play color="#14b8a6" size={20} />} label="COMMAND CENTER" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/trainer'); }} active={pathname === '/(drawer)/trainer'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <View className="pt-6 mt-4 border-t border-slate-200">
            <TouchableOpacity className="flex-row items-center p-4 bg-red-50 rounded-xl" onPress={() => logout()}>
              <LogOut color="#ef4444" size={16} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">SECURE EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Seller') {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-blue-500/10">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm">
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShoppingBag color="white" size={20} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-xs tracking-widest leading-tight uppercase">Seller Central</Text>
              <Text className="text-blue-500 text-[8px] font-bold tracking-[0.2em] leading-tight uppercase">E-Commerce Access</Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-4">
          <CandidateDrawerLink icon={<LayoutDashboard color="#3b82f6" size={20} />} label="DASHBOARD" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/seller'); }} active={pathname === '/(drawer)/seller'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <View className="pt-6 mt-4 border-t border-slate-200">
            <TouchableOpacity className="flex-row items-center p-4 bg-red-50 rounded-xl" onPress={() => logout()}>
              <LogOut color="#ef4444" size={16} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (user?.role === 'Service Provider' || user?.role === 'Stay Partner') {
    return (
      <View className="flex-1 bg-white">
        <View className="relative items-start px-6 pt-14 pb-8 border-b border-orange-500/10">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 z-50 shadow-sm">
            <X color="#64748b" size={20} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Briefcase color="white" size={20} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-xs tracking-widest leading-tight uppercase">Partner Hub</Text>
              <Text className="text-orange-500 text-[8px] font-bold tracking-[0.2em] leading-tight uppercase">Service Access</Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1 px-4 pt-4">
          <CandidateDrawerLink icon={<LayoutDashboard color="#ea580c" size={20} />} label="DASHBOARD" onPress={() => { props.navigation.closeDrawer(); router.push(user?.role === 'Stay Partner' ? '/(drawer)/staypartner' : '/(drawer)/serviceprovider'); }} active={pathname === '/(drawer)/staypartner' || pathname === '/(drawer)/serviceprovider'} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }} active={pathname === '/(drawer)/profile'} />
          <View className="pt-6 mt-4 border-t border-slate-200">
            <TouchableOpacity className="flex-row items-center p-4 bg-red-50 rounded-xl" onPress={() => logout()}>
              <LogOut color="#ef4444" size={16} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider">LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14 pb-4 bg-white border-b border-slate-100/50 rounded-b-3xl shadow-sm">
        <Image 
          source={require('../../../assets/images/logo.jpg')} 
          style={{ width: 120, height: 45 }} 
          resizeMode="contain" 
        />
        <TouchableOpacity 
          onPress={() => props.navigation.closeDrawer()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100"
        >
          <X color="#94a3b8" size={20} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View className="items-center mt-6 mb-8">
        <View className="relative">
          <View className="w-24 h-24 bg-slate-200 rounded-full items-center justify-center border-4 border-white shadow-sm">
            <User color="#94a3b8" size={48} strokeWidth={1.5} />
          </View>
          <View className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100">
            <Edit3 color="#3b82f6" size={16} strokeWidth={2} />
          </View>
        </View>
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-800 text-xl mt-4">
          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Super Admin'}
        </Text>
        <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-slate-500 text-sm mt-1">
          {user?.role === 'Admin' || user?.role === 'SuperAdmin' ? 'System Administrator' : 'User'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Quick Actions */}
        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-600 text-sm mb-3 ml-2">Quick Actions</Text>
        <View className="bg-white rounded-[1.5rem] mb-6 border border-slate-100 shadow-sm overflow-hidden">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-slate-100 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/admin'); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <LayoutDashboard color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Admin Dashboard</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-slate-100 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/jobs'); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <Briefcase color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Job Consulting</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/courses'); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <Play color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Learning Hub</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-600 text-sm mb-3 ml-2">Account</Text>
        <View className="bg-white rounded-[1.5rem] mb-6 border border-slate-100 shadow-sm overflow-hidden">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-slate-100 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/profile'); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <User color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">My Profile</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-slate-100 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/profile', params: { tab: 'settings' } }); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <Settings color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Settings</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/profile', params: { tab: 'privacy' } }); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <ShieldCheck color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Security & Privacy</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-600 text-sm mb-3 ml-2">Support</Text>
        <View className="bg-white rounded-[1.5rem] mb-10 border border-slate-100 shadow-sm overflow-hidden">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 active:bg-slate-50"
            onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/contact'); }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                <HelpCircle color="#3b82f6" size={20} strokeWidth={1.5} />
              </View>
              <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-800 text-[15px]">Help Center</Text>
            </View>
            <ChevronRight color="#cbd5e1" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={{ fontFamily: 'Outfit_500Medium' }} className="text-center text-slate-400 text-xs mb-4">App Version 2.0</Text>
        <TouchableOpacity 
          className="flex-row items-center justify-center p-4 bg-red-50/50 border border-red-300 rounded-[1rem] active:bg-red-100 mx-2"
          onPress={async () => {
            props.navigation.closeDrawer();
            await logout();
            router.replace('/');
          }}
        >
          <LogOut color="#ef4444" size={20} strokeWidth={2} className="mr-3" />
          <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-red-500 text-[15px]">Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function DrawerLink({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 mb-3"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-4">
        {icon}
        <Text style={{ fontFamily: 'Outfit_700Bold' }} className="text-slate-900 text-base">{label}</Text>
      </View>
      <ChevronRight color="#0f172a" size={18} strokeWidth={2} />
    </TouchableOpacity>
  );
}

function VendorDrawerLink({ icon, label, onPress, active }: any) {
  return (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-2 mb-1"
      onPress={onPress}
    >
      <View className="mr-4 w-6 items-center justify-center">
        {icon}
      </View>
      <Text style={{ fontFamily: 'Outfit_700Bold' }} className={`text-base ${active ? 'text-blue-500' : 'text-slate-200'}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function HRDrawerLink({ icon, label, onPress, active }: any) {
  if (active) {
    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 bg-blue-600 rounded-2xl mb-2 shadow-sm shadow-blue-600/30"
        onPress={onPress}
      >
        <View className="mr-4">{React.cloneElement(icon, { color: '#ffffff' })}</View>
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs tracking-wider">{label}</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 rounded-2xl mb-2 active:bg-slate-50"
      onPress={onPress}
    >
      <View className="mr-4">{icon}</View>
      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-600 text-xs tracking-wider">{label}</Text>
    </TouchableOpacity>
  );
}


function CandidateDrawerLink({ icon, label, onPress, active }: any) {
  if (active) {
    return (
      <TouchableOpacity 
        className="flex-row items-center p-4 bg-blue-600 rounded-2xl mb-2 shadow-sm shadow-blue-600/30"
        onPress={onPress}
      >
        <View className="mr-4">{React.cloneElement(icon, { color: '#ffffff' })}</View>
        <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-white text-xs tracking-wider">{label}</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 rounded-2xl mb-2 active:bg-slate-50"
      onPress={onPress}
    >
      <View className="mr-4">{icon}</View>
      <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-600 text-xs tracking-wider">{label}</Text>
    </TouchableOpacity>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      backBehavior="none"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#ffffff', shadowOpacity: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold' },
        sceneStyle: { backgroundColor: '#f8fafc' },
        drawerStyle: { backgroundColor: '#ffffff', width: '85%' },
      })}
    >
      <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="services" options={{ title: 'Explore Services', headerShown: false }} />
      <Drawer.Screen name="jobs" options={{ title: 'Job Consulting', headerShown: false }} />
      <Drawer.Screen name="products" options={{ title: 'Atomy Shop', headerShown: false }} />
      <Drawer.Screen name="cart" options={{ title: 'Cart', headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="about" options={{ title: 'About Us' }} />
      <Drawer.Screen name="contact" options={{ title: 'Contact Us' }} />
      <Drawer.Screen name="courses" options={{ title: 'Learning Hub' }} />
      <Drawer.Screen name="profile" options={{ title: 'My Profile', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="chat" options={{ title: 'Support Chat', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="seller" options={{ title: 'Seller Dashboard', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="customer" options={{ title: 'Customer Dashboard', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="jobs/[id]" options={{ title: 'Job Details', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="services/[id]" options={{ title: 'Service Details', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin" options={{ title: 'Admin Dashboard', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="vendor" options={{ title: 'Vendor Hub', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="hr" options={{ title: 'HR Portal', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="candidate" options={{ title: 'Career Portal', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="delivery" options={{ title: 'Delivery Operations', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="agent" options={{ title: 'Agent Command Hub', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="serviceprovider" options={{ title: 'Service Provider', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="staypartner" options={{ title: 'Stay Partner', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="trainer" options={{ title: 'Trainer Dashboard', drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
