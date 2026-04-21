const express = require('express');
const { getTasks, updateTaskStatus, assignTask } = require('../controllers/taskController');
const { protect, admin, delivery } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, delivery, getTasks)
  .post(protect, admin, assignTask);

router.route('/:id').put(protect, delivery, updateTaskStatus);

module.exports = router;
