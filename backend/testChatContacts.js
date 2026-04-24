const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/forge_india_connect').then(async () => {
    try {
        const admin = await User.findOne({ role: 'Admin' });
        if (!admin) {
            console.log('No admin found');
            process.exit(0);
        }
        const allowedRoles = ['Vendor', 'HR', 'Admin', 'Sub-Admin', 'Delivery Partner', 'Customer', 'Candidate'];
        const contacts = await User.find({
            role: { $in: allowedRoles },
            _id: { $ne: admin._id },
            approvalStatus: 'Approved'
        });
        console.log('Admin Contacts Count:', contacts.length);
        console.log('Contacts:', contacts.map(c => `${c.firstName} (${c.role})`));
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
});
