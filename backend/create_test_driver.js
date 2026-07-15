const mongoose = require('mongoose');
const User = require('./models/User');
const Driver = require('./models/Driver');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/forge_india_connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const email = 'testdriver@example.com';
  const password = 'Password123!';
  
  await User.deleteOne({ email });
  
  const user = await User.create({
    firstName: 'Test',
    lastName: 'Driver',
    email: email,
    password: password,
    mobile: '9999999999',
    role: 'Driver',
    approvalStatus: 'Approved'
  });
  
  await Driver.create({
    user: user._id,
    driverType: 'Bike',
    vehicleOwnership: 'Own Vehicle',
    verificationStatus: 'Pending',
    shiftStatus: 'Offline'
  });
  
  console.log('Test Driver created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
