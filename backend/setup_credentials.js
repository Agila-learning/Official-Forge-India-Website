require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Driver = require('./models/Driver');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const password = await bcrypt.hash('Password123!', 10);
    
    // 1. Admin
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({ firstName: 'Super', lastName: 'Admin', email: 'admin@example.com', password, mobile: '9999999999', role: 'Admin', isEmailVerified: true, isApproved: true });
    } else {
      admin.password = password; await admin.save();
    }

    // 2. Customer
    let customer = await User.findOne({ email: 'customer@example.com' });
    if (!customer) {
      customer = await User.create({ firstName: 'Test', lastName: 'Customer', email: 'customer@example.com', password, mobile: '8888888888', role: 'Customer', isEmailVerified: true, isApproved: true });
    } else {
      customer.password = password; await customer.save();
    }

    // 3. Driver (Cab)
    let driverCab = await User.findOne({ email: 'driver_cab@example.com' });
    if (!driverCab) {
      driverCab = await User.create({ firstName: 'Cab', lastName: 'Driver', email: 'driver_cab@example.com', password, mobile: '7777777777', role: 'Driver', isEmailVerified: true, isApproved: true });
      await Driver.create({ user: driverCab._id, driverType: 'Cab', vehicleOwnership: 'Own Vehicle', verificationStatus: 'Verified', shiftStatus: 'Online', activeVehicle: new mongoose.Types.ObjectId() });
    } else {
      driverCab.password = password; await driverCab.save();
      await Driver.findOneAndUpdate({ user: driverCab._id }, { verificationStatus: 'Verified', shiftStatus: 'Online' });
    }
    
    // 4. Delivery Partner
    let driverDelivery = await User.findOne({ email: 'driver_delivery@example.com' });
    if (!driverDelivery) {
      driverDelivery = await User.create({ firstName: 'Delivery', lastName: 'Partner', email: 'driver_delivery@example.com', password, mobile: '6666666666', role: 'Delivery Partner', isEmailVerified: true, isApproved: true });
      await Driver.create({ user: driverDelivery._id, driverType: 'Delivery Partner', vehicleOwnership: 'Own Vehicle', verificationStatus: 'Verified', shiftStatus: 'Online', activeVehicle: new mongoose.Types.ObjectId() });
    } else {
      driverDelivery.password = password; await driverDelivery.save();
    }

    console.log('Credentials generated successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
