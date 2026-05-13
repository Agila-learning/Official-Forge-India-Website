const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

/**
 * Create a Razorpay Contact for a Vendor
 */
const createContact = async (user) => {
  try {
    const contact = await razorpay.items.create({ // Using items as proxy for X if SDK is standard, or direct fetch
      // Note: Razorpay X often requires direct API calls if using the standard 'razorpay' npm package
      // For this implementation, we'll use a fetch-based approach for Payouts if needed, 
      // but let's try the official SDK structure if supported.
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: user.mobile,
      type: "vendor",
      reference_id: user._id.toString(),
    }, 'contacts'); 
    return contact;
  } catch (error) {
    console.error('Razorpay Contact Creation Error:', error);
    throw error;
  }
};

/**
 * Create a Fund Account (Bank) for a Contact
 */
const createFundAccount = async (contactId, bankDetails) => {
  try {
    // Standard Razorpay SDK might not have X endpoints directly. 
    // We'll use the generic request method if available.
    const response = await razorpay.api('POST', '/fund_accounts', {
      contact_id: contactId,
      account_type: "bank_account",
      bank_account: {
        name: bankDetails.holderName,
        ifsc: bankDetails.ifscCode,
        account_number: bankDetails.accountNumber,
      }
    });
    return response;
  } catch (error) {
    console.error('Razorpay Fund Account Error:', error);
    throw error;
  }
};

/**
 * Create a Payout to a Vendor
 */
const createPayout = async (options) => {
  try {
    const { fundAccountId, amount, referenceId, notes } = options;
    const response = await razorpay.api('POST', '/payouts', {
      account_number: process.env.RAZORPAY_X_ACCOUNT_NUMBER, // Platform X account
      fund_account_id: fundAccountId,
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      mode: "IMPS",
      purpose: "vendor bill",
      queue_if_low_balance: true,
      reference_id: referenceId,
      notes: notes || {}
    });
    return response;
  } catch (error) {
    console.error('Razorpay Payout Error:', error);
    throw error;
  }
};

/**
 * Verify Webhook Signature
 */
const verifyWebhook = (body, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  return expectedSignature === signature;
};

module.exports = {
  razorpay,
  createContact,
  createFundAccount,
  createPayout,
  verifyWebhook
};
