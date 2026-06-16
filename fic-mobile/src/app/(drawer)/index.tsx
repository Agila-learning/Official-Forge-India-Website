import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function DrawerIndex() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect href="/" />;
  }

  // Redirect based on role
  switch (user.role) {
    case 'Admin':
      return <Redirect href="/(drawer)/admin" />;
    case 'Vendor':
      return <Redirect href="/(drawer)/vendor" />;
    case 'HR':
      return <Redirect href="/(drawer)/hr" />;
    case 'Agent':
      return <Redirect href="/(drawer)/agent" />;
    case 'Delivery':
      return <Redirect href="/(drawer)/delivery" />;
    case 'Candidate':
      return <Redirect href="/(drawer)/candidate" />;
    case 'Service Provider':
      return <Redirect href="/(drawer)/serviceprovider" />;
    case 'Trainer':
      return <Redirect href="/(drawer)/trainer" />;
    case 'Stay Partner':
      return <Redirect href="/(drawer)/staypartner" />;
    case 'Seller':
      return <Redirect href="/(drawer)/seller" />;
    default:
      return <Redirect href="/(drawer)/customer" />;
  }
}
