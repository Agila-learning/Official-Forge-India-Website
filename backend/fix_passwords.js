require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const rawPassword = 'Password123!';
    
    // Fix all our test users
    const emails = ['admin@example.com', 'customer@example.com', 'driver_cab@example.com', 'driver_delivery@example.com'];
    for (const email of emails) {
      let user = await User.findOne({ email });
      if (user) {
        user.password = rawPassword; 
        await user.save(); // The pre('save') hook will correctly hash 'Password123!'
        console.log(`Reset password for ${email}`);
      }
    }

    console.log('Credentials fixed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
