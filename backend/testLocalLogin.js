const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@forgeindiaconnect.com',
            password: 'admin123'
        });
        console.log('Login successful:', response.data.email, response.data.role);
    } catch (err) {
        console.error('Login failed:', err.response?.status, err.response?.data?.message);
    }
}

testLogin();
