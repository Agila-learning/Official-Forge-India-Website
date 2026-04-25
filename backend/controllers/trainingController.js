const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const TrainingRegistration = require('../models/TrainingRegistration');

// @desc    Get all courses
// @route   GET /api/training/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true });
  res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/training/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Register for training
// @route   POST /api/training/register
// @access  Private (Candidate)
const registerForTraining = asyncHandler(async (req, res) => {
  const { 
    courseId, 
    candidateName, 
    email, 
    phone, 
    location, 
    preferredCourse,
    mode, 
    qualification, 
    preferredBatchTiming, 
    resumeUrl 
  } = req.body;

  const registration = await TrainingRegistration.create({
    candidate: req.user?._id,
    candidateName,
    email,
    phone,
    location,
    course: courseId,
    preferredCourse,
    preferredMode: mode,
    qualification,
    preferredBatchTiming,
    resumeUrl
  });

  if (registration) {
    res.status(201).json(registration);
  } else {
    res.status(400);
    throw new Error('Invalid registration data');
  }
});

// @desc    Get candidate's training enrollments
// @route   GET /api/training/my-training
// @access  Private (Candidate)
const getMyTraining = asyncHandler(async (req, res) => {
  const enrollments = await TrainingRegistration.find({ candidate: req.user._id })
    .populate('course')
    .populate('batch');
  res.json(enrollments);
});

// @desc    Get trainer's batches
// @route   GET /api/training/trainer/batches
// @access  Private (Trainer)
const getTrainerBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find({ trainer: req.user._id }).populate('course');
  res.json(batches);
});

module.exports = {
  getCourses,
  getCourseById,
  registerForTraining,
  getMyTraining,
  getTrainerBatches
};
