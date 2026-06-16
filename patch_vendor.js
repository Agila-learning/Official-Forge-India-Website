const fs = require('fs');
const file = 'c:/FORGE_INDIA_CONNECT/FIC_Official-website/fic-mobile/src/app/(drawer)/vendor.tsx';

let content = fs.readFileSync(file, 'utf8');

// Replacements in vendor.tsx

// 1. Add imports
content = content.replace(
  "import { Drawer } from 'expo-router/drawer';",
  "import { Drawer } from 'expo-router/drawer';\nimport { useNavigation, useRouter } from 'expo-router';\nimport { TextInput, Modal, Alert } from 'react-native';\nimport { Edit3, Trash2, X, Plus } from 'lucide-react-native';"
);

// 2. Add state hooks inside component
content = content.replace(
  "  const { user } = useContext(AuthContext);",
  \`  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const router = useRouter();
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'General', description: '' });
  \`
);

// 3. Add handleSaveProduct and deleteProduct functions
content = content.replace(
  "  useEffect(() => {",
  \`
  const handleSaveProduct = async () => {
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        vendorId: user._id
      });
      Alert.alert('Success', 'Product created successfully');
      setModalVisible(false);
      setFormData({ name: '', price: '', category: 'General', description: '' });
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(\`/products/\${id}\`);
      Alert.alert('Success', 'Product deleted');
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  useEffect(() => {\`
);

// 4. Update Header hamburger & avatar actions
content = content.replace(
  "          <TouchableOpacity \n            className=\"w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10\"\n            // Drawer toggle can be hooked up here later if navigation prop is passed, or handled by layout header.\n          >",
  \`          <TouchableOpacity 
            onPress={() => (navigation as any).openDrawer()}
            className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
          >\`
);

content = content.replace(
  "            <View className=\"w-12 h-12 bg-[#1a2333] rounded-xl items-center justify-center border border-blue-500/30\">\n              <Text className=\"text-blue-500 font-black text-xl\">V</Text>\n            </View>",
  \`            <TouchableOpacity onPress={() => router.push('/(drawer)/profile')} className="w-12 h-12 bg-[#1a2333] rounded-xl items-center justify-center border border-blue-500/30 overflow-hidden">
              {user?.avatar ? <Image source={{uri: user.avatar}} className="w-full h-full" /> : <Text className="text-blue-500 font-black text-xl">V</Text>}
            </TouchableOpacity>\`
);

// 5. Update '+ Product' action pill to open modal
content = content.replace(
  "          <TouchableOpacity className=\"bg-blue-600 px-6 py-3 rounded-full flex-row items-center gap-2\">\n            <Text className=\"text-white font-light text-lg\">+</Text>\n            <Text className=\"text-white font-black tracking-widest text-xs\">Product</Text>\n          </TouchableOpacity>",
  \`          <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center gap-2">
            <Plus color="white" size={14} />
            <Text className="text-white font-black tracking-widest text-xs">Product</Text>
          </TouchableOpacity>\`
);

// 6. Wrap content in activeTab rendering and Add Inventory tab
content = content.replace(
  "        {/* Profile Card */}",
  \`        <View className="flex-row mb-6 border-b border-white/10 pb-2">
          <TouchableOpacity onPress={() => setActiveTab('overview')} className={\`mr-6 \${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}\`}>
             <Text className={\`font-bold \${activeTab === 'overview' ? 'text-blue-500' : 'text-slate-400'}\`}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('inventory')} className={\`mr-6 \${activeTab === 'inventory' ? 'border-b-2 border-blue-500' : ''}\`}>
             <Text className={\`font-bold \${activeTab === 'inventory' ? 'text-blue-500' : 'text-slate-400'}\`}>Inventory</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <>
        {/* Profile Card */}\`
);

// Close the activeTab condition before the end of the scroll view
content = content.replace(
  "      </ScrollView>",
  \`          </>
        )}

        {activeTab === 'inventory' && (
          <View className="pb-8">
            <Text className="text-white font-bold text-sm mb-6">Manage Products</Text>
            {products.map((p: any) => (
              <View key={p._id} className="bg-[#111620] p-4 rounded-2xl border border-white/5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-white rounded-xl overflow-hidden mr-4 border border-slate-700">
                    <Image source={{uri: p.image || 'https://via.placeholder.com/150'}} className="w-full h-full" style={{ resizeMode: 'cover' }} />
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-white font-bold text-sm mb-1" numberOfLines={1}>{p.name}</Text>
                    <Text className="text-[10px] text-slate-400">₹{p.price} • {p.category}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteProduct(p._id)} className="bg-red-900/30 p-3 rounded-xl border border-red-900/50">
                  <Trash2 color="#ef4444" size={16} />
                </TouchableOpacity>
              </View>
            ))}
            {products.length === 0 && (
               <Text className="text-slate-500 text-center mt-10">No products found. Tap + Product to add.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Product Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#111620] p-6 rounded-t-[2rem] h-[80%] border-t border-white/10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg text-white font-black uppercase tracking-widest">New Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-white/5 rounded-full">
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4">
              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Product Name</Text>
              <TextInput 
                value={formData.name} 
                onChangeText={t => setFormData({...formData, name: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5"
                placeholderTextColor="#475569"
                placeholder="e.g. Premium Security Cam"
              />

              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Price (₹)</Text>
              <TextInput 
                value={formData.price} 
                onChangeText={t => setFormData({...formData, price: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5"
                placeholderTextColor="#475569"
                placeholder="e.g. 5000"
                keyboardType="numeric"
              />

              <Text className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">Category</Text>
              <TextInput 
                value={formData.category} 
                onChangeText={t => setFormData({...formData, category: t})}
                className="bg-[#0a0f16] text-white p-4 rounded-xl border border-white/10 mb-5"
                placeholderTextColor="#475569"
                placeholder="e.g. Electronics"
              />
            </ScrollView>

            <TouchableOpacity 
              onPress={handleSaveProduct} 
              className="bg-blue-600 p-4 rounded-xl items-center mb-6"
            >
              <Text className="text-white font-black text-sm uppercase tracking-widest">Publish Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>\`
);

fs.writeFileSync(file, content);
console.log('vendor.tsx patched successfully');
