const express = require('express');
const router = express.Router();
const { 
  getHomeCategories, 
  createHomeCategory, 
  updateHomeCategory, 
  deleteHomeCategory,
  getHomeSubCategories,
  createHomeSubCategory,
  updateHomeSubCategory,
  deleteHomeSubCategory,
  getSubCategoriesByCategory
} = require('../controllers/homeCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getHomeCategories)
  .post(protect, admin, createHomeCategory);

router.route('/sub')
  .get(getHomeSubCategories)
  .post(protect, admin, createHomeSubCategory);

router.route('/sub/:id')
  .put(protect, admin, updateHomeSubCategory)
  .delete(protect, admin, deleteHomeSubCategory);

router.route('/:categoryId/sub')
  .get(getSubCategoriesByCategory);

router.route('/:id')
  .put(protect, admin, updateHomeCategory)
  .delete(protect, admin, deleteHomeCategory);

module.exports = router;
