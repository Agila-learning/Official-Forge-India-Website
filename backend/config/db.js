const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forge_india_connect');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to MongoDB: ${error.message}`);
    // Optional: process.exit(1);
    // Not exiting to keep server running locally if DB isn't setup yet.
  }
};

module.exports = connectDB;
