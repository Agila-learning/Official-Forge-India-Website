const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'forge_secret_key_123', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { 
    firstName, lastName, password, industry, mobile, role, address, city, pincode,
    businessName, gstNumber, profileDocuments, vehicleDetails, licenseNumber, companyName, vendorType,
    referredByAgentName, agentMobile, agentReference, additionalComments, subscriptionLevel
  } = req.body;
  const email = req.body.email?.toLowerCase().trim();
  
  // Auto-set approvalStatus: Customers and Candidates are instantly Approved. Others are Pending.
  const validRoles = ['Vendor', 'Customer', 'HR', 'Delivery Partner', 'Candidate', 'Seller', 'Service Provider'];
  const assignedRole = role && validRoles.includes(role) ? role : 'Customer';
  const approvalStatus = (assignedRole === 'Customer' || assignedRole === 'Candidate' || assignedRole === 'Trainer') ? 'Approved' : 'Pending';

  let membershipId = null;
  let isMember = false;
  let paymentStatus = 'Unpaid';
  let registrationFee = 0;
  let shopCode = undefined;

  if (['Vendor', 'Seller', 'Service Provider'].includes(assignedRole)) {
      const year = new Date().getFullYear();
      const random = Math.floor(10000 + Math.random() * 90000);
      shopCode = `FIC-SHOP-${year}-${random}`;
  }

  if (assignedRole === 'Candidate' && req.body.candidateType === 'Premium') {
      const { razorpay_payment_id } = req.body;
      if (!razorpay_payment_id) {
          return res.status(400).json({ message: 'Premium registration requires payment verification.' });
      }
      isMember = true;
      paymentStatus = 'Paid';
      registrationFee = 1500;
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      membershipId = `FIC-PREM-${year}-${random}`;
      
      // Send Confirmation Email
      const { sendRegistrationConfirmationEmail } = require('../utils/emailService');
      try {
          await sendRegistrationConfirmationEmail(email, `${firstName} ${lastName}`, membershipId);
      } catch (err) {
          console.error('Registration Email Error:', err);
      }
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      firstName, lastName, email, password, industry, mobile, role: assignedRole, approvalStatus,
      businessName, gstNumber, profileDocuments, vehicleDetails, licenseNumber, companyName, vendorType,
      distanceLimit: req.body.distanceLimit,
      exactLocation: req.body.exactLocation,
      branches: req.body.branches,
      strictPolicy: req.body.strictPolicy,
      refundPolicy: req.body.refundPolicy,
      // Candidate Specs
      resumeUrl: req.body.resumeUrl,
      domainInterest: req.body.domainInterest,
      referredByAgentName,
      agentMobile,
      agentReference,
      additionalComments,
      subscriptionLevel,
      isMember,
      membershipId,
      paymentStatus,
      registrationFee,
      shopCode,
      address,
      city,
      pincode
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        industry: user.industry,
        role: user.role,
        approvalStatus: user.approvalStatus,
        shopCode: user.shopCode,
        membershipId: user.membershipId,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase().trim();
  
  console.log(`Login attempt for normalized: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (await user.matchPassword(password)) {
        // ENFORCE APPROVAL STATUS GUARD
        if (user.approvalStatus === 'Pending') {
            console.log(`Login blocked: User ${email} is Pending`);
            return res.status(401).json({ message: 'Account pending admin approval' });
        }
        if (user.approvalStatus === 'Rejected') {
            console.log(`Login blocked: User ${email} is Rejected`);
            return res.status(401).json({ message: 'Account application rejected' });
        }

        console.log(`Login success for: ${email} (Role: ${user.role})`);
        res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        shopCode: user.shopCode,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const onboardUser = async (req, res) => {
    const { 
        firstName, lastName, email, password, mobile, role, industry, 
        address, city, pincode,
        businessName, gstNumber, vehicleDetails, licenseNumber, 
        companyName, vendorType, profileDocuments,
        distanceLimit, exactLocation, branches, strictPolicy, refundPolicy
    } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let shopCode = undefined;
        if (['Vendor', 'Seller', 'Service Provider'].includes(role)) {
            const year = new Date().getFullYear();
            const random = Math.floor(10000 + Math.random() * 90000);
            shopCode = `FIC-SHOP-${year}-${random}`;
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            mobile,
            role,
            industry,
            businessName,
            gstNumber,
            vehicleDetails,
            licenseNumber,
            companyName,
            vendorType,
            profileDocuments,
            distanceLimit,
            exactLocation,
            branches,
            strictPolicy,
            refundPolicy,
            shopCode,
            address,
            city,
            pincode,
            approvalStatus: 'Approved' // Onboarded users are usually pre-approved
        });

        if (user) {
            res.status(201).json({ message: 'Account Created Successfully!', user });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendOTP = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

  try {
    console.log(`OTP Request for mobile: ${mobile}`);
    const user = await User.findOne({ mobile });
    if (!user) {
      console.log(`OTP Failed: No user found for mobile ${mobile}`);
      return res.status(404).json({ message: 'User not found with this mobile number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // OTP sent (HIDDEN FROM RESPONSE FOR SECURITY)
    console.log(`[OTP] Generated ${otp} for ${mobile}. Expires: ${user.otpExpires}`);
    res.json({ message: 'OTP sent to your mobile number' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;
  console.log(`Verifying OTP: ${otp} for mobile: ${mobile}`);
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      console.log(`OTP Verify Failed: User ${mobile} not found`);
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    if (user.otp !== otp) {
      console.log(`OTP Verify Failed: Incorrect OTP for ${mobile}. Expected ${user.otp}, got ${otp}`);
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    if (user.otpExpires < Date.now()) {
      console.log(`OTP Verify Failed: OTP expired for ${mobile}`);
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    console.log(`OTP Verify Success: User ${mobile} authenticated`);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      shopCode: user.shopCode,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRegistrationPayment = async (req, res) => {
  const { email, name, mobile } = req.body;
  
  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 1500 * 100, // 1500 INR in paise
      currency: "INR",
      receipt: `reg_${Date.now()}`,
      notes: {
        email,
        name,
        type: 'PremiumRegistration'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, onboardUser, sendOTP, verifyOTP, createRegistrationPayment };
