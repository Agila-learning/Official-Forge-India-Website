const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' }); // Adjusted path

const userSchema = new mongoose.Schema({
  role: String,
  shopCode: String,
  firstName: String,
  lastName: String,
  email: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

const fixShopCodes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const vendors = await User.find({
      role: { $in: ['Vendor', 'Seller', 'Service Provider', 'Rental Provider'] },
      $or: [
        { shopCode: { $exists: false } },
        { shopCode: null },
        { shopCode: '' }
      ]
    });

    console.log(`Found ${vendors.length} vendor(s) missing shopCode.`);

    const year = new Date().getFullYear();
    for (const vendor of vendors) {
      const random = Math.floor(10000 + Math.random() * 90000);
      const newShopCode = `FIC-SHOP-${year}-${random}`;
      vendor.shopCode = newShopCode;
      await vendor.save();
      console.log(`Assigned ${newShopCode} to ${vendor.email}`);
    }

    console.log('Fix complete.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

fixShopCodes();
