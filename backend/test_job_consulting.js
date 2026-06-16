const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@forgeindiaconnect.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('Logged in');
    
    // Test Job Consulting Submit
    const res = await axios.post('http://localhost:5001/api/job-consulting/submit', {
        consultingType: 'Career Guidance',
        specificRequirement: 'General career counseling',
        contactNumber: '9999999999',
        domain: 'General',
        experience: 'Fresher (0-1 yr)'
    }, { headers: { Authorization: 'Bearer ' + token }});
    console.log('Submit OK:', res.data.inquiryId);
    
    const verifyRes = await axios.post('http://localhost:5001/api/job-consulting/verify-payment', {
        razorpay_order_id: 'order_mock_' + Date.now(),
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_signature: 'simulated_signature',
        inquiryId: res.data.inquiryId
    }, { headers: { Authorization: 'Bearer ' + token }});
    console.log('Verify OK:', verifyRes.data);
    
  } catch(e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
test();
