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
router.post('/courses', protect, admin, require('../controllers/trainingController').createCourse);
router.get('/courses/:id', getCourseById);
router.post('/register', registerForTraining);
router.get('/my-training', protect, getMyTraining);

// Trainer Routes
router.get('/trainer/batches', protect, getTrainerBatches);
router.get('/trainer/candidates', protect, require('../controllers/trainingController').getTrainerCandidates);

// Admin Routes (for batches)
router.get('/batches', protect, admin, require('../controllers/trainingController').getBatches);
router.post('/batches', protect, admin, require('../controllers/trainingController').createBatch);

// Materials Routes
router.get('/materials/batch/:batchId', protect, require('../controllers/trainingController').getMaterialsByBatch);
router.post('/materials', protect, require('../controllers/trainingController').createMaterial);
router.delete('/materials/:id', protect, require('../controllers/trainingController').deleteMaterial);

// Message/Chat Routes
router.get('/messages/batch/:batchId', protect, require('../controllers/trainingController').getBatchMessages);
router.post('/messages', protect, require('../controllers/trainingController').sendMessage);

// Lecture Routes
router.get('/lectures/batch/:batchId', protect, require('../controllers/trainingController').getLecturesByBatch);
router.post('/lectures', protect, require('../controllers/trainingController').createLecture);
router.delete('/lectures/:id', protect, require('../controllers/trainingController').deleteLecture);

module.exports = router;
