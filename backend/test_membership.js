const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@forgeindiaconnect.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('Logged in');
    
    const verifyRes = await axios.post('http://localhost:5001/api/users/membership-vault/verify', {
        razorpay_order_id: 'order_mock_' + Date.now(),
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_signature: 'simulated_signature',
        planValue: 5000,
        planTier: 'Starter'
    }, { headers: { Authorization: 'Bearer ' + token }});
    console.log('Membership Verify OK:', verifyRes.data);
    
  } catch(e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
test();
