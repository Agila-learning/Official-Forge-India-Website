const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/forge_india_connect').then(async () => {
    const db = mongoose.connection.db;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Admin@123', salt);
    await db.collection('users').updateMany({}, { $set: { password: hash } });
    console.log('Successfully hashed passwords to Admin@123');
    mongoose.connection.close();
}).catch(console.error);
