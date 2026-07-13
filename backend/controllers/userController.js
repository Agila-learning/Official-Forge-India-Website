const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const { createContact, createFundAccount } = require('../utils/razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

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
      roleFilter = { role: req.query.role || { $in: ['Candidate', 'Delivery Partner'] } };
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
      const userObj = user.toObject();
      if (user.role === 'Driver' || user.role === 'Delivery Partner') {
        const Driver = require('../models/Driver');
        const driverProfile = await Driver.findOne({ user: user._id }).populate('activeVehicle');
        if (driverProfile) {
          userObj.driverProfile = driverProfile;
          userObj.isOnline = driverProfile.shiftStatus === 'Online';

          const DriverDocument = require('../models/DriverDocument');
          const driverDocs = await DriverDocument.findOne({ driverId: driverProfile._id });
          if (driverDocs) {
            userObj.driverDocuments = driverDocs;
          }
        }
      }
      res.json(userObj);
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

    const { 
      firstName, lastName, mobile, address, city, pincode,
      vehicleDetails, licenseNumber, businessName, gstNumber, isSubscribed, 
      resumeUrl, subscriptionLevel, referredByAgentName, agentMobile, 
      agentReference, additionalComments, profileDocuments, kycStatus, panNumber,
      password
    } = req.body;
    
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (mobile !== undefined) user.mobile = mobile;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (pincode !== undefined) user.pincode = pincode;
    if (vehicleDetails !== undefined) user.vehicleDetails = vehicleDetails;
    if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
    if (businessName !== undefined) user.businessName = businessName;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (subscriptionLevel !== undefined) user.subscriptionLevel = subscriptionLevel;
    if (referredByAgentName !== undefined) user.referredByAgentName = referredByAgentName;
    if (agentMobile !== undefined) user.agentMobile = agentMobile;
    if (agentReference !== undefined) user.agentReference = agentReference;
    if (additionalComments !== undefined) user.additionalComments = additionalComments;
    if (profileDocuments !== undefined) user.profileDocuments = profileDocuments;
    if (kycStatus !== undefined) user.kycStatus = kycStatus;
    if (panNumber !== undefined) user.panNumber = panNumber;
    if (typeof isSubscribed !== 'undefined') user.isSubscribed = isSubscribed;
    if (password !== undefined && password !== '') user.password = password;

    const updatedUser = await user.save();

    if (user.role === 'Driver' || user.role === 'Delivery Partner') {
      const Driver = require('../models/Driver');
      const DriverDocument = require('../models/DriverDocument');
      const Vehicle = require('../models/Vehicle');

      let driver = await Driver.findOne({ user: user._id });
      if (!driver) {
        driver = new Driver({
          user: user._id,
          driverType: req.body.driverType || 'Bike',
          vehicleOwnership: req.body.vehicleOwnership || 'Own Vehicle',
        });
      }
      if (req.body.driverType) driver.driverType = req.body.driverType;
      if (req.body.vehicleOwnership) driver.vehicleOwnership = req.body.vehicleOwnership;
      await driver.save();

      // Update Driver Documents
      let doc = await DriverDocument.findOne({ driverId: driver._id });
      if (!doc) doc = new DriverDocument({ driverId: driver._id });

      if (req.body.aadhaarNumber !== undefined) {
        if (!doc.aadhaar) doc.aadhaar = {};
        doc.aadhaar.number = req.body.aadhaarNumber;
      }
      if (req.body.aadhaarFrontImage !== undefined) {
        if (!doc.aadhaar) doc.aadhaar = {};
        doc.aadhaar.frontImageUrl = req.body.aadhaarFrontImage;
        doc.aadhaar.status = 'Pending';
      }
      if (req.body.panNumberValue !== undefined) {
        if (!doc.pan) doc.pan = {};
        doc.pan.number = req.body.panNumberValue;
      }
      if (req.body.panImage !== undefined) {
        if (!doc.pan) doc.pan = {};
        doc.pan.imageUrl = req.body.panImage;
        doc.pan.status = 'Pending';
      }
      if (req.body.licenseNumberValue !== undefined) {
        if (!doc.drivingLicense) doc.drivingLicense = {};
        doc.drivingLicense.number = req.body.licenseNumberValue;
      }
      if (req.body.licenseExpiry !== undefined) {
        if (!doc.drivingLicense) doc.drivingLicense = {};
        doc.drivingLicense.expiryDate = req.body.licenseExpiry ? new Date(req.body.licenseExpiry) : null;
      }
      if (req.body.licenseFrontImage !== undefined) {
        if (!doc.drivingLicense) doc.drivingLicense = {};
        doc.drivingLicense.frontImageUrl = req.body.licenseFrontImage;
        doc.drivingLicense.status = 'Pending';
      }
      await doc.save();

      // Update Vehicle Details
      if (driver.vehicleOwnership === 'Own Vehicle') {
        let vehicle = await Vehicle.findOne({ ownerId: user._id, ownerModel: 'User' });
        if (!vehicle) {
          vehicle = new Vehicle({
            ownerId: user._id,
            ownerModel: 'User',
            vehicleCategory: driver.driverType || 'Bike',
            registrationNumber: req.body.registrationNumber || `PENDING-${Date.now()}`
          });
        }
        if (req.body.vehicleCategory) vehicle.vehicleCategory = req.body.vehicleCategory;
        if (req.body.registrationNumber) vehicle.registrationNumber = req.body.registrationNumber;
        if (req.body.make) vehicle.make = req.body.make;
        if (req.body.model) vehicle.model = req.body.model;
        if (req.body.year) vehicle.year = Number(req.body.year);
        if (req.body.color) vehicle.color = req.body.color;
        
        if (req.body.rcDocumentImage !== undefined) {
          if (!vehicle.rcDocument) vehicle.rcDocument = {};
          vehicle.rcDocument.url = req.body.rcDocumentImage;
          vehicle.rcDocument.status = 'Pending';
        }
        if (req.body.rcExpiry !== undefined) {
          if (!vehicle.rcDocument) vehicle.rcDocument = {};
          vehicle.rcDocument.expiryDate = req.body.rcExpiry ? new Date(req.body.rcExpiry) : null;
        }
        if (req.body.insuranceDocumentImage !== undefined) {
          if (!vehicle.insuranceDocument) vehicle.insuranceDocument = {};
          vehicle.insuranceDocument.url = req.body.insuranceDocumentImage;
          vehicle.insuranceDocument.status = 'Pending';
        }
        if (req.body.insuranceExpiry !== undefined) {
          if (!vehicle.insuranceDocument) vehicle.insuranceDocument = {};
          vehicle.insuranceDocument.expiryDate = req.body.insuranceExpiry ? new Date(req.body.insuranceExpiry) : null;
        }

        await vehicle.save();
        driver.activeVehicle = vehicle._id;
        if (req.body.aadhaarFrontImage || req.body.panImage || req.body.licenseFrontImage || req.body.rcDocumentImage || req.body.insuranceDocumentImage) {
          driver.verificationStatus = 'Under Review';
        }
        await driver.save();
      }
    }

    const updatedUserObj = updatedUser.toObject();
    delete updatedUserObj.password;

    if (user.role === 'Driver' || user.role === 'Delivery Partner') {
      const Driver = require('../models/Driver');
      const driverProfile = await Driver.findOne({ user: updatedUser._id }).populate('activeVehicle');
      if (driverProfile) {
        updatedUserObj.driverProfile = driverProfile;
        updatedUserObj.isOnline = driverProfile.shiftStatus === 'Online';
        
        const DriverDocument = require('../models/DriverDocument');
        const driverDocs = await DriverDocument.findOne({ driverId: driverProfile._id });
        if (driverDocs) {
          updatedUserObj.driverDocuments = driverDocs;
        }
      }
    }

    res.json(updatedUserObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

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
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ message: 'planId is required.' });
  }

  try {
    const MembershipPlan = require('../models/MembershipPlan');
    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Membership plan not found.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const amountInPaise = Math.round(plan.price * 100);

    // Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `mem_${user._id.toString().slice(-6)}_${Date.now()}`,
      notes: {
        planId: plan._id.toString(),
        planName: plan.name,
        userId: user._id.toString(),
        type: 'MembershipPlan'
      }
    };

    const rzpOrder = await razorpay.orders.create(options);

    res.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planId: plan._id,
      planName: plan.name,
      planPrice: plan.price,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const verifyMembershipVaultPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

  try {
    const isMockOrder = razorpay_order_id && razorpay_order_id.startsWith('order_mock_');

    if (!isMockOrder) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
        .update(body.toString())
        .digest('hex');

      if (razorpay_signature !== expectedSignature) {
        return res.status(400).json({ message: 'Invalid Payment Signature' });
      }
    }

    // Fetch plan details
    const MembershipPlan = require('../models/MembershipPlan');
    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Membership plan not found.' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    const cycleEnd = new Date(now);
    cycleEnd.setDate(cycleEnd.getDate() + (plan.validityDays || 30));

    // Generate membership number: FIC-STR-XXXXXX
    const codeMap = { starter: 'STR', premium: 'PRM', elite: 'ELT' };
    const code = codeMap[(plan.planCode || plan.name).toLowerCase()] || 'MBR';
    const memNumber = `FIC-${code}-${Math.floor(100000 + Math.random() * 900000)}`;

    user.membershipVault = {
      status: 'Active',
      membershipNumber: memNumber,
      planId: plan._id,
      planTier: plan.planCode || plan.name,
      planName: plan.name,
      planValue: plan.price,
      balance: 0,
      rewardPoints: plan.welcomeBonusPoints || 0,
      cashbackEarned: 0,
      totalSavings: 0,
      savingsThisMonth: 0,
      cycleStartDate: now,
      cycleEndDate: cycleEnd,
      // Reset usage counters on plan activation
      cabRidesUsed: 0,
      bikeBookingsUsed: 0,
      hotelBookingsUsed: 0,
      cleaningServicesUsed: 0,
      freeCancellationsUsed: 0,
    };
    user.isMember = true;

    await user.save();
    res.json({
      message: `${plan.name} membership activated successfully!`,
      vault: user.membershipVault,
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateBankDetails = async (req, res) => {
  const { accountNumber, ifscCode, bankName, holderName, panNumber } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bankDetails = { accountNumber, ifscCode, bankName, holderName };
    if (panNumber) user.panNumber = panNumber;
    user.kycStatus = 'Pending'; // Mark as pending for admin review or auto-verify

    // 1. Create/Update Razorpay Contact
    if (!user.razorpayContactId) {
        try {
            const contact = await createContact(user);
            user.razorpayContactId = contact.id;
        } catch (err) {
            console.error('Contact Creation failed, proceeding anyway:', err.message);
        }
    }

    // 2. Create/Update Razorpay Fund Account
    if (user.razorpayContactId) {
        try {
            const fundAccount = await createFundAccount(user.razorpayContactId, user.bankDetails);
            user.razorpayFundAccountId = fundAccount.id;
            user.kycStatus = 'Verified'; // Auto-verify if fund account created successfully
        } catch (err) {
            console.error('Fund Account Creation failed:', err.message);
        }
    }

    const updatedUser = await user.save();
    res.json({ message: 'Bank details synchronized successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAgentReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'Agent') {
      return res.status(403).json({ message: 'Unauthorized access. Agent clearance required.' });
    }

    // Find all users who used this agent's reference code or name
    const referrals = await User.find({
      $or: [
        { agentReference: user.agentCode },
        { referredByAgentName: user.firstName }
      ]
    }).select('firstName lastName email role createdAt subscriptionLevel isMember paymentStatus');

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFcmToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (req.body.fcmToken) {
      user.fcmToken = req.body.fcmToken;
      await user.save();
      res.json({ message: 'FCM Token updated successfully' });
    } else {
      res.status(400).json({ message: 'FCM Token is required' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const { isOnline, mood } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Phase 2: Log Driver Mood
    if (isOnline && mood) {
      if (!user.moodLogs) user.moodLogs = [];
      user.moodLogs.push({ mood, timestamp: new Date() });
      await user.save();
    }

    if (user.role === 'Driver' || user.role === 'Delivery Partner') {
      const Driver = require('../models/Driver');
      const driver = await Driver.findOne({ user: user._id });
      if (!driver) {
        return res.status(404).json({ message: 'Driver profile setup is incomplete.' });
      }

      if (isOnline) {
        if (driver.verificationStatus === 'Suspended') {
          return res.status(403).json({ code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended by Admin.' });
        }
        if (driver.verificationStatus === 'Pending' || driver.verificationStatus === 'Under Review') {
          return res.status(403).json({ code: 'DOCS_PENDING', message: 'Your documents are pending verification.' });
        }
        if (!driver.activeVehicle) {
          return res.status(403).json({ code: 'VEHICLE_UNASSIGNED', message: 'No active vehicle registered/assigned.' });
        }
      }

      driver.shiftStatus = isOnline ? 'Online' : 'Offline';
      await driver.save();
    }
    
    // We still update the user payload in case legacy frontend relies on it
    res.json({ isOnline, moodLogged: !!mood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDriverOnboarding = async (req, res) => {
  try {
    const { documents, vehicleDocuments, step } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const Driver = require('../models/Driver');
    let driver = await Driver.findOne({ user: user._id });
    if (!driver) {
      // Auto-create for legacy accounts
      driver = new Driver({
        user: user._id,
        driverType: user.driverType || 'Bike',
        vehicleOwnership: user.vehicleOwnership || 'Own Vehicle',
        verificationStatus: 'Pending',
        shiftStatus: 'Offline'
      });
      await driver.save();
    }

    if (step === 'documents') {
      const DriverDocument = require('../models/DriverDocument');
      let doc = await DriverDocument.findOne({ driverId: driver._id });
      if (!doc) doc = new DriverDocument({ driverId: driver._id });
      
      if (documents.aadhaar) {
        if (!doc.aadhaar) doc.aadhaar = {};
        doc.aadhaar.frontImageUrl = documents.aadhaar;
        doc.aadhaar.status = 'Pending';
      }
      if (documents.pan) {
        if (!doc.pan) doc.pan = {};
        doc.pan.imageUrl = documents.pan;
        doc.pan.status = 'Pending';
      }
      if (documents.drivingLicense) {
        if (!doc.drivingLicense) doc.drivingLicense = {};
        doc.drivingLicense.frontImageUrl = documents.drivingLicense;
        doc.drivingLicense.status = 'Pending';
      }

      await doc.save();

      driver.verificationStatus = driver.vehicleOwnership === 'Own Vehicle' ? 'Pending' : 'Under Review';
      await driver.save();
    } else if (step === 'vehicle') {
      if (driver.vehicleOwnership !== 'Own Vehicle') {
        return res.status(400).json({ message: 'Company Assigned drivers cannot register their own vehicle' });
      }
      const Vehicle = require('../models/Vehicle');
      let vehicle = await Vehicle.findOne({ ownerId: user._id, ownerModel: 'User' });
      if (!vehicle) {
        vehicle = new Vehicle({ 
          ownerId: user._id, 
          ownerModel: 'User',
          vehicleCategory: driver.driverType === 'Delivery Partner' || driver.driverType === 'Logistics Driver' ? 'Other' : driver.driverType || 'Bike',
          registrationNumber: `PENDING-${Date.now()}` // Dummy until actual RC details form is filled
        });
      }
      
      if (vehicleDocuments.rcDocument) {
        if (!vehicle.rcDocument) vehicle.rcDocument = {};
        vehicle.rcDocument.url = vehicleDocuments.rcDocument;
        vehicle.rcDocument.status = 'Pending';
      }
      
      if (vehicleDocuments.insuranceDocument) {
        if (!vehicle.insuranceDocument) vehicle.insuranceDocument = {};
        vehicle.insuranceDocument.url = vehicleDocuments.insuranceDocument;
        vehicle.insuranceDocument.status = 'Pending';
      }
      
      await vehicle.save();

      driver.activeVehicle = vehicle._id;
      driver.verificationStatus = 'Under Review';
      await driver.save();
    }

    res.json({ message: 'Onboarding step completed', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingDriverVerifications = async (req, res) => {
  try {
    const Driver = require('../models/Driver');
    
    // Fetch all drivers under review, populate their User details
    const drivers = await Driver.find({ verificationStatus: 'Under Review' })
      .populate('user', 'firstName lastName email mobile approvalStatus role')
      .populate('activeVehicle');

    const DriverDocument = require('../models/DriverDocument');
    
    // Fetch associated documents for each driver
    const results = [];
    for (const driver of drivers) {
      const docs = await DriverDocument.findOne({ driverId: driver._id });
      results.push({
        driver,
        documents: docs || null
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDriverVerificationStatus = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, remarks } = req.body; // status should be 'Verified' or 'Rejected'

    if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const Driver = require('../models/Driver');
    const driver = await Driver.findById(driverId).populate('user');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.verificationStatus = status;
    await driver.save();

    // If verified, also approve the User profile
    if (status === 'Verified' && driver.user) {
      driver.user.approvalStatus = 'Approved';
      await driver.user.save();
      
      // Update all nested doc statuses to Verified
      const DriverDocument = require('../models/DriverDocument');
      const docs = await DriverDocument.findOne({ driverId: driver._id });
      if (docs) {
        if (docs.aadhaar) docs.aadhaar.status = 'Verified';
        if (docs.pan) docs.pan.status = 'Verified';
        if (docs.drivingLicense) docs.drivingLicense.status = 'Verified';
        await docs.save();
      }

      if (driver.activeVehicle) {
        const Vehicle = require('../models/Vehicle');
        const vehicle = await Vehicle.findById(driver.activeVehicle);
        if (vehicle) {
          if (vehicle.rcDocument) vehicle.rcDocument.status = 'Verified';
          if (vehicle.insuranceDocument) vehicle.insuranceDocument.status = 'Verified';
          await vehicle.save();
        }
      }
    } else if (status === 'Rejected' && driver.user) {
      driver.user.approvalStatus = 'Rejected';
      await driver.user.save();
    }

    res.json({ message: `Driver status updated to ${status}`, driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Phase 2: Trusted Contacts ─────────────────────────────
const updateTrustedContacts = async (req, res) => {
  try {
    const { contacts } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.trustedContacts = contacts;
    await user.save();

    res.json({ message: 'Trusted contacts updated successfully', trustedContacts: user.trustedContacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getUsers, 
  updateUserApproval, 
  getUserProfile, 
  toggleFavorite, 
  getUserFavorites, 
  updateUserProfile, 
  deleteUser, 
  subscribeNewsletter, 
  createSubAdmin, 
  purchaseMembershipVault, 
  verifyMembershipVaultPayment,
  updateBankDetails,
  updateUser,
  toggleOnlineStatus,
  getAgentReferrals,
  updateFcmToken,
  updateDriverOnboarding,
  getPendingDriverVerifications,
  updateDriverVerificationStatus,
  updateTrustedContacts
};
