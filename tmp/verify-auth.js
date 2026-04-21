const bcrypt = require('bcryptjs');

const verifyAuth = async () => {
    const password = 'admin123';
    // This matches what User.js does
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
    console.log('Original Header:', password);
    console.log('Hashed:', hashed);
    
    const isMatch = await bcrypt.compare(password, hashed);
    console.log('Is Match:', isMatch);
    
    if (isMatch) {
        console.log('AUTH LOGIC VERIFIED');
    } else {
        console.error('AUTH LOGIC FAILED');
    }
};

verifyAuth();
