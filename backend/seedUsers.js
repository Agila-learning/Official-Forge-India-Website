const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    firstName: 'FIC',
    lastName: 'Admin',
    email: 'admin@forgeindia.com',
    password: 'Admin@123',
    role: 'Admin',
    approvalStatus: 'Approved'
  },
  {
    firstName: 'FIC',
    lastName: 'HR',
    email: 'hr@forgeindia.com',
    password: 'HR@123',
    role: 'HR',
    approvalStatus: 'Approved'
  },
  {
    firstName: 'FIC',
    lastName: 'Vendor',
    email: 'vendor@forgeindia.com',
    password: 'Vendor@123',
    role: 'Vendor',
    approvalStatus: 'Approved'
  },
  {
    firstName: 'FIC',
    lastName: 'Candidate',
    email: 'candidate@forgeindia.com',
    password: 'Candidate@123',
    role: 'Candidate',
    approvalStatus: 'Approved'
  },
  {
    firstName: 'FIC',
    lastName: 'Delivery',
    email: 'delivery@forgeindia.com',
    password: 'Delivery@123',
    role: 'Delivery Partner',
    approvalStatus: 'Approved'
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/forge_india';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    for (const u of users) {
      const userExists = await User.findOne({ email: u.email });
      if (!userExists) {
        await User.create(u);
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
