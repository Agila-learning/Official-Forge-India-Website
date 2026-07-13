import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = user.role?.toLowerCase() || '';

  // Exact 1-to-1 routing map to the Enum in User.js
  if (role === 'admin' || role === 'superadmin' || role === 'sub-admin') {
    return <Redirect href="/(drawer)/admin" />;
  }

  if (role === 'seller') {
    return <Redirect href="/(drawer)/seller" />;
  }

  if (role === 'customer') {
    return <Redirect href="/(drawer)/customer" />;
  }

  if (role === 'vendor') {
    return <Redirect href="/(drawer)/vendor" />;
  }

  if (role === 'employer' || role === 'hr') {
    return <Redirect href="/(drawer)/hr" />;
  }

  if (role === 'candidate') {
    return <Redirect href="/(drawer)/candidate" />;
  }

  if (role === 'deliverypartner' || role === 'delivery partner') {
    return <Redirect href="/(drawer)/delivery" />;
  }

  if (role === 'agent') {
    return <Redirect href="/(drawer)/agent" />;
  }

  if (role === 'driver') {
    return <Redirect href="/(drawer)/driver" />;
  }

  if (role === 'serviceprovider' || role === 'service provider') {
    return <Redirect href="/(drawer)/serviceprovider" />;
  }

  if (role === 'staypartner' || role === 'rental provider') {
    return <Redirect href="/(drawer)/staypartner" />;
  }

  if (role === 'trainer') {
    return <Redirect href="/(drawer)/trainer" />;
  }

  // If role is undefined or not handled yet, fallback to customer
  return <Redirect href="/(drawer)/customer" />;
}
