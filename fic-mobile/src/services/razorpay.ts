import { Alert, Platform } from 'react-native';

let RazorpayCheckout: any = null;
if (Platform.OS !== 'web') {
  try {
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch (e) {
    console.warn("react-native-razorpay not found");
  }
}

interface RazorpayOptions {
  description: string;
  image?: string;
  currency: string;
  key: string;
  amount: string | number; // Amount in paise
  name: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (options: RazorpayOptions) => {
  if (Platform.OS === 'web') {
    const res = await loadRazorpayScript();
    if (!res) {
      Alert.alert('Razorpay SDK failed to load', 'Are you online?');
      return { success: false, error: 'SDK load failed' };
    }

    return new Promise((resolve) => {
      const webOptions = {
        ...options,
        handler: function (response: any) {
          resolve({
            success: true,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            resolve({ success: false, error: { message: 'Payment cancelled by user' } });
          },
        },
      };
      const rzp = new (window as any).Razorpay(webOptions);
      rzp.on('payment.failed', function (response: any) {
        resolve({ success: false, error: response.error });
      });
      rzp.open();
    });
  }
  
  if (!RazorpayCheckout) {
    Alert.alert('Payment Unavailable', 'Native payment gateway cannot run. Please test on an Android emulator or physical device.');
    return { success: false, error: 'Native not supported' };
  }
  
  try {
    const data = await RazorpayCheckout.open(options);
    return {
      success: true,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_signature: data.razorpay_signature,
    };
  } catch (error: any) {
    console.warn("Razorpay Checkout Error:", error);
    Alert.alert('Payment Cancelled or Failed', error.description || error.message || 'The payment process was interrupted.');
    return {
      success: false,
      error
    };
  }
};
