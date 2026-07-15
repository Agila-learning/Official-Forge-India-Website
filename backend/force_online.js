require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('./models/Driver');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const res = await Driver.updateMany({}, { 
      verificationStatus: 'Verified',
      shiftStatus: 'Online',
      activeVehicle: new mongoose.Types.ObjectId() // Fake vehicle ID just to pass the check
    });
    console.log('Updated Drivers:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
