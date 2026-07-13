const express = require('express');
const { getUsers, updateUserApproval, getUserProfile, toggleFavorite, getUserFavorites, updateUserProfile, deleteUser, subscribeNewsletter, createSubAdmin, purchaseMembershipVault, verifyMembershipVaultPayment, updateBankDetails, updateUser, toggleOnlineStatus, getAgentReferrals, updateFcmToken, updateDriverOnboarding, getPendingDriverVerifications, updateDriverVerificationStatus, updateTrustedContacts } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Phase 2
router.route('/trusted-contacts').put(protect, updateTrustedContacts);

router.route('/subscribe').post(subscribeNewsletter);
router.route('/').get(protect, getUsers);
router.route('/subadmin').post(protect, admin, createSubAdmin);
router.route('/membership-vault').post(protect, purchaseMembershipVault);
router.route('/membership-vault/verify').post(protect, verifyMembershipVaultPayment);
router.route('/bank-details').put(protect, updateBankDetails);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/driver/status').put(protect, toggleOnlineStatus);
router.route('/driver/onboarding').put(protect, updateDriverOnboarding);
router.route('/agent/referrals').get(protect, getAgentReferrals);
router.route('/fcm-token').put(protect, updateFcmToken);
router.route('/favorites').get(protect, getUserFavorites);
router.route('/favorites/toggle').post(protect, toggleFavorite);
router.route('/admin/driver-verifications').get(protect, admin, getPendingDriverVerifications);
router.route('/admin/driver-verifications/:driverId').put(protect, admin, updateDriverVerificationStatus);

router.route('/:id/approve').put(protect, admin, updateUserApproval);
router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;

