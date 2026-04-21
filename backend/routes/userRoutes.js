const express = require('express');
const { getUsers, updateUserApproval, getUserProfile, toggleFavorite, getUserFavorites, updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getUsers);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/favorites').get(protect, getUserFavorites);
router.route('/favorites/toggle').post(protect, toggleFavorite);
router.route('/:id/approve').put(protect, admin, updateUserApproval);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
