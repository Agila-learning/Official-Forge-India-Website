const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const TrainingRegistration = require('../models/TrainingRegistration');
const Material = require('../models/Material');
const Message = require('../models/Message');

// @desc    Get all courses
// @route   GET /api/training/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true });
  res.json(courses);
});

// @desc    Create course
// @route   POST /api/training/courses
// @access  Private (Admin)
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
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
// @access  Public
const registerForTraining = asyncHandler(async (req, res) => {
  const registration = await TrainingRegistration.create({
    ...req.body,
    candidate: req.user?._id
  });
  res.status(201).json(registration);
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

// @desc    Get trainer's candidates
// @route   GET /api/training/trainer/candidates
// @access  Private (Trainer)
const getTrainerCandidates = asyncHandler(async (req, res) => {
  const batches = await Batch.find({ trainer: req.user._id });
  const batchIds = batches.map(b => b._id);
  const candidates = await TrainingRegistration.find({ batch: { $in: batchIds } }).populate('batch');
  res.json(candidates);
});

// @desc    Get all batches
// @route   GET /api/training/batches
// @access  Private (Admin)
const getBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find({}).populate('course').populate('trainer', 'firstName lastName');
  res.json(batches);
});

// @desc    Create batch
// @route   POST /api/training/batches
// @access  Private (Admin)
const createBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.create(req.body);
  res.status(201).json(batch);
});

// Materials Controllers
const getMaterialsByBatch = asyncHandler(async (req, res) => {
  const materials = await Material.find({ batch: req.params.batchId });
  res.json(materials);
});

const createMaterial = asyncHandler(async (req, res) => {
  const material = await Material.create(req.body);
  res.status(201).json(material);
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (material) {
    await material.deleteOne();
    res.json({ message: 'Material removed' });
  } else {
    res.status(404);
    throw new Error('Material not found');
  }
});

// Message Controllers
const getBatchMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ batch: req.params.batchId })
    .populate('sender', 'firstName lastName role')
    .sort({ createdAt: 1 });
  res.json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  const fullMessage = await Message.findById(message._id).populate('sender', 'firstName lastName role');
  res.status(201).json(fullMessage);
});

module.exports = {
  getCourses,
  createCourse,
  getCourseById,
  registerForTraining,
  getMyTraining,
  getTrainerBatches,
  getTrainerCandidates,
  getBatches,
  createBatch,
  getMaterialsByBatch,
  createMaterial,
  deleteMaterial,
  getBatchMessages,
  sendMessage
};
