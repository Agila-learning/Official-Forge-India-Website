const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { industry: { $regex: req.query.keyword, $options: 'i' } },
        { firstName: { $regex: req.query.keyword, $options: 'i' } },
        { lastName: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};
    
    let roleFilter = {};
    if (req.user.role === 'Vendor') {
      roleFilter = { role: 'Delivery Partner' };
    } else if (req.user.role === 'HR') {
      roleFilter = { role: { $in: ['Candidate', 'Delivery Partner'] } };
    } else if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access Denied: Insufficient Role Clearance' });
    }

    const users = await User.find({ ...keyword, ...roleFilter }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserApproval = async (req, res) => {
  const approvalStatus = req.body.approvalStatus || req.body.status;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    user.approvalStatus = approvalStatus;
    await user.save();
    
    res.json({ message: `User status updated to ${approvalStatus}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubAdmin = async (req, res) => {
  const { firstName, lastName, email, password, mobile, level, assignedRegion, pincode, taluk, adminRole } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const subAdmin = await User.create({
      firstName,
      lastName,
      email,
      password,
      mobile,
      role: 'Admin',
      approvalStatus: 'Approved',
      isSubAdmin: true,
      subAdminConfig: { level, assignedRegion, taluk, pincode }
    });

    if (subAdmin) {
      res.status(201).json({ message: `${adminRole || 'Sub-Admin'} Created Successfully!`, subAdmin });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('favorites');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.body.productId;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const isFavorite = user.favorites.some(id => id && id.toString() === productId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id && id.toString() !== productId);
    } else {
      user.favorites.push(productId);
    }
    
    await user.save();
    res.json({ message: isFavorite ? 'Removed from favorites' : 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Filter out nulls in case some products were deleted
    const validFavorites = (user.favorites || []).filter(item => item !== null);
    res.json(validFavorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { firstName, lastName, mobile, vehicleDetails, licenseNumber, businessName, gstNumber, isSubscribed, resumeUrl, subscriptionLevel, referredByAgentName, agentMobile, agentReference, additionalComments } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (mobile) user.mobile = mobile;
    if (vehicleDetails) user.vehicleDetails = vehicleDetails;
    if (licenseNumber) user.licenseNumber = licenseNumber;
    if (businessName) user.businessName = businessName;
    if (gstNumber) user.gstNumber = gstNumber;
    if (resumeUrl) user.resumeUrl = resumeUrl;
    if (subscriptionLevel) user.subscriptionLevel = subscriptionLevel;
    if (referredByAgentName) user.referredByAgentName = referredByAgentName;
    if (agentMobile) user.agentMobile = agentMobile;
    if (agentReference) user.agentReference = agentReference;
    if (additionalComments) user.additionalComments = additionalComments;
    if (typeof isSubscribed !== 'undefined') user.isSubscribed = isSubscribed;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const Subscriber = require('../models/Subscriber');
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }

        await Subscriber.create({ email });
        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const purchaseMembershipVault = async (req, res) => {
  const { planValue, planTier } = req.body;
  const VALID_PLANS = [5000, 10000, 25000];

  if (!VALID_PLANS.includes(Number(planValue))) {
    return res.status(400).json({ message: 'Invalid plan value. Choose ₹5,000, ₹10,000, or ₹25,000.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    const cycleEnd = new Date(now);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    user.membershipVault = {
      balance: Number(planValue),
      planValue: Number(planValue),
      planTier,
      cycleStartDate: now,
      cycleEndDate: cycleEnd,
      savingsThisMonth: 0,
    };
    user.isMember = true;

    await user.save();
    res.json({ message: `${planTier} activated successfully!`, vault: user.membershipVault });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUserApproval, getUserProfile, toggleFavorite, getUserFavorites, updateUserProfile, deleteUser, subscribeNewsletter, createSubAdmin, purchaseMembershipVault };

