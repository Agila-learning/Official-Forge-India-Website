const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String },
    industry: { type: String }, // Optional now since some roles might not need it
    role: { 
      type: String, 
      enum: ['Admin', 'Sub-Admin', 'Vendor', 'Customer', 'HR', 'Delivery Partner', 'Candidate', 'Seller', 'Service Provider', 'Trainer', 'Rental Provider', 'Agent', 'Driver'], 
      default: 'Customer' 
    },
    address: { type: String },
    city: { type: String },
    pincode: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''] },
    dob: { type: String },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved'
    },
    fcmToken: { type: String }, // For Firebase Cloud Messaging
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Onboarding Request Metadata
    agentCode: { type: String, unique: true, sparse: true }, // For Agents to refer others
    businessName: { type: String },
    shopCode: { type: String, unique: true, sparse: true },
    hrCode: { type: String, unique: true, sparse: true },
    gstNumber: { type: String },
    profileDocuments: [{ 
      url: { type: String },
      name: { type: String },
      type: { type: String, enum: ['credential', 'id_wallet'], default: 'credential' },
      uploadedAt: { type: Date, default: Date.now }
    }], // Secure Vault Documents
    vehicleDetails: { type: String },
    licenseNumber: { type: String },
    resumeUrl: { type: String }, // For Candidates - stored resume PDF URL
    companyName: { type: String }, // For HR
    vendorType: { 
      type: String, 
      enum: ['Product Seller', 'Service Provider', 'Both'],
      default: 'Product Seller'
    },
    assignedCategories: [{ type: String }], // Restricts which categories a vendor can create services in
    businessMotive: { type: String }, // For Vendors - "What products they sell"
    otp: { type: String },
    otpExpires: { type: Date },
    deliverySupport: { 
      type: String, 
      enum: ['With Delivery', 'Without Delivery'], 
      default: 'Without Delivery' 
    },
    deliverySettings: {
      radius: { type: Number },
      cities: [{ type: String }],
      pincodes: [{ type: String }],
      timing: { type: String },
      baseCharge: { type: Number },
      sameDaySupport: { type: Boolean, default: false }
    },
    // New Vendor Onboarding Fields
    distanceLimit: { type: Number }, // Max delivery/service distance in kms
    exactLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    branches: [{
      name: { type: String },
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    }],
    strictPolicy: { type: String }, // For Service Providers
    refundPolicy: { type: String }, // For Product Sellers
    // Candidate Membership Specs
    domainInterest: { type: String, enum: ['Banking', 'IT', 'Non-IT', 'Manufacturing', 'Automobile', 'Other'] },
    isMember: { type: Boolean, default: false },
    membershipId: { type: String }, // FIC-CAND-YYYY-XXXX
    membershipVault: {
      status: { type: String, enum: ['Active', 'Expired', 'Pending', 'None'], default: 'None' },
      membershipNumber: { type: String }, // e.g., FIC-STR-1234
      planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
      planTier: { type: String, default: 'None' },     // 'Starter' | 'Premium' | 'Elite'
      planName: { type: String, default: 'None' },
      planValue: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
      rewardPoints: { type: Number, default: 0 },
      cashbackEarned: { type: Number, default: 0 },
      totalSavings: { type: Number, default: 0 },
      savingsThisMonth: { type: Number, default: 0 },
      cycleStartDate: { type: Date },
      cycleEndDate: { type: Date },
      // ── Usage counters (reset each cycle) ─────────────────────────────
      cabRidesUsed:          { type: Number, default: 0 },
      bikeBookingsUsed:      { type: Number, default: 0 },
      hotelBookingsUsed:     { type: Number, default: 0 },
      cleaningServicesUsed:  { type: Number, default: 0 },
      freeCancellationsUsed: { type: Number, default: 0 },
    },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    registrationFee: { type: Number, default: 0 },
    subscriptionLevel: { 
      type: String, 
      default: 'Free' 
    },
    referredByAgentName: { type: String }, // Mandatory for vendors during reg
    agentMobile: { type: String },
    agentReference: { type: String },
    additionalComments: { type: String },
    isSubscribed: { type: Boolean, default: false },
    // ─── Ride / Service Provider Fields ───────────────────────────────
    // Note: Driver-specific fields (vehicle, license, isOnline) have been moved to the normalized Driver and Vehicle models.
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      holderName: { type: String }
    },
    razorpayContactId: { type: String }, // For Settlements
    razorpayFundAccountId: { type: String }, // For Settlements
    panNumber: { type: String },
    kycStatus: { 
      type: String, 
      enum: ['Not Started', 'Pending', 'Verified', 'Rejected'], 
      default: 'Not Started' 
    },
    walletBalance: { type: Number, default: 0 },
    // ─── Rental Provider Fields ──────────────────────────────────────
    propertyName: { type: String },
    propertyType: { 
      type: String, 
      enum: ['PG', 'Hotel', 'Room', 'Villa', 'Office Space', 'Vehicle Rental', 'None'],
      default: 'None'
    },
    amenities: [{ type: String }],
    pricingRange: {
      min: { type: Number },
      max: { type: Number },
      unit: { type: String, default: 'Month' }
    },
    
    // ─── Phase 2: Safety & Real-time Integration ─────────────────────
    trustedContacts: [{
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
      notifyOnEmergency: { type: Boolean, default: true }
    }],
    safetyScore: { type: Number, default: 100 }, // For Drivers
    moodLogs: [{
      mood: { type: String },
      timestamp: { type: Date, default: Date.now }
    }],

    // ─── Sub-Admin Configuration ─────────────────────────────────────
    isSubAdmin: { type: Boolean, default: false },
    subAdminConfig: {
      level: { type: String, enum: ['State', 'District', 'Division', 'Pincode', 'All'] },
      assignedRegion: { type: String },
      taluk: { type: String },
      pincode: { type: String }
    }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
