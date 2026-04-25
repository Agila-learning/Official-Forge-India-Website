const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createTrainer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forge_india_connect';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = 'trainer@test.com';
    const password = 'trainer123';
    
    let trainer = await User.findOne({ email });
    
    if (trainer) {
      console.log('Trainer already exists. Resetting password and role...');
      trainer.role = 'Trainer';
      trainer.approvalStatus = 'Approved';
      trainer.password = password; // pre-save hook will hash this
      await trainer.save();
    } else {
      trainer = await User.create({
        firstName: 'Master',
        lastName: 'Trainer',
        email,
        password, // pre-save hook will hash this
        role: 'Trainer',
        approvalStatus: 'Approved'
      });
      console.log('Trainer created successfully');
    }

    console.log(`Email: ${trainer.email}`);
    console.log(`Password: ${password} (Hashed via Model Hook)`);
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createTrainer();
