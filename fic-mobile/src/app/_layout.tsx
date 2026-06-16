import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_700Bold, Outfit_900Black } from '@expo-google-fonts/outfit';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { CartProvider } from '../context/CartContext';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  let [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Outfit_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
