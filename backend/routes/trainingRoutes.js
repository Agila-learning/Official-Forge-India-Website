const express = require('express');
const router = express.Router();
const { 
    getCourses, 
    getCourseById, 
    registerForTraining, 
    getMyTraining,
    getTrainerBatches
} = require('../controllers/trainingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/register', registerForTraining);
router.get('/my-training', protect, getMyTraining);
router.get('/trainer/batches', protect, getTrainerBatches);

module.exports = router;
