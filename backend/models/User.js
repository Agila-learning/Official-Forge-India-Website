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
      enum: ['Admin', 'Sub-Admin', 'Vendor', 'Customer', 'HR', 'Delivery Partner', 'Candidate', 'Seller', 'Service Provider', 'Trainer'], 
      default: 'Customer' 
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved'
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Onboarding Request Metadata
    businessName: { type: String },
    gstNumber: { type: String },
    profileDocuments: [{ 
      url: { type: String },
      name: { type: String },
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
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    registrationFee: { type: Number, default: 0 },
    subscriptionLevel: { 
      type: String, 
      enum: ['Basic', 'Premium', 'Elite'], 
      default: 'Basic' 
    },
    referredByAgentName: { type: String }, // Mandatory for vendors during reg
    agentMobile: { type: String },
    agentReference: { type: String },
    additionalComments: { type: String },
    isSubscribed: { type: Boolean, default: false },
    isSubAdmin: { type: Boolean, default: false },
    subAdminConfig: {
      level: { type: String, enum: ['State', 'District', 'Division', 'Pincode', 'All'] },
      assignedRegion: { type: String }
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
