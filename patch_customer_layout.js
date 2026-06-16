const fs = require('fs');
const file = 'c:/FORGE_INDIA_CONNECT/FIC_Official-website/fic-mobile/src/app/(drawer)/_layout.tsx';

let content = fs.readFileSync(file, 'utf8');

content = content.replace("if (user?.role === 'Candidate' || user?.role === 'Customer') {", "if (user?.role === 'Candidate') {");

const customerBlock = `
  if (user?.role === 'Customer') {
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
          <CandidateDrawerLink icon={<LayoutDashboard color="#64748b" size={20} />} label="CONTROL CENTER" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'overview' } }); }} active />
          <CandidateDrawerLink icon={<Briefcase color="#eab308" size={20} />} label="JOB CONSULTING 🌟" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/jobs'); }} />
          <CandidateDrawerLink icon={<ShoppingBag color="#64748b" size={20} />} label="EXPLORE SHOP" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/services'); }} />
          <CandidateDrawerLink icon={<Box color="#64748b" size={20} />} label="MY BOOKINGS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'orders' } }); }} />
          <CandidateDrawerLink icon={<Briefcase color="#64748b" size={20} />} label="JOB MARKETPLACE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'browse' } }); }} />
          <CandidateDrawerLink icon={<Users color="#64748b" size={20} />} label="MY APPLICATIONS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'applications' } }); }} />
          <CandidateDrawerLink icon={<Bell color="#64748b" size={20} />} label="ALERTS" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'alerts' } }); }} />
          <CandidateDrawerLink icon={<MessageSquare color="#64748b" size={20} />} label="SUPPORT CHAT" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} />
          <CandidateDrawerLink icon={<MessageCircle color="#64748b" size={20} />} label="CHAT WITH QUIPPY" onPress={() => { props.navigation.closeDrawer(); router.push('/(drawer)/chat'); }} />
          <CandidateDrawerLink icon={<User color="#64748b" size={20} />} label="MY PROFILE" onPress={() => { props.navigation.closeDrawer(); router.push({ pathname: '/(drawer)/customer', params: { tab: 'profile' } }); }} />

          <View className="pt-6 mt-4 border-t border-slate-100 space-y-3">
            <TouchableOpacity 
              className="flex-row items-center p-4 bg-white rounded-xl active:bg-slate-50"
              onPress={() => { props.navigation.closeDrawer(); router.push('/'); }}
            >
              <Zap color="#94a3b8" size={20} className="mr-4" />
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-slate-500 text-xs tracking-wider">LANDING HUB</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center p-4 bg-blue-600 rounded-[2rem] shadow-sm shadow-blue-600/30"
              onPress={() => logout()}
            >
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-4">
                <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-blue-600">?</Text>
              </View>
              <Text style={{ fontFamily: 'Outfit_900Black' }} className="text-red-500 text-xs tracking-wider bg-white px-2 py-1 rounded">SECURE EXIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
`;

if (!content.includes("if (user?.role === 'Customer') {")) {
  content = content.replace("if (user?.role === 'Candidate') {", customerBlock + "\n  if (user?.role === 'Candidate') {");
  fs.writeFileSync(file, content);
  console.log('Customer block added');
} else {
  console.log('Already exists');
}
