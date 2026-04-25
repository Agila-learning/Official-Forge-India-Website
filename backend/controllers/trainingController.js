const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const TrainingRegistration = require('../models/TrainingRegistration');
const Material = require('../models/Material');
const Message = require('../models/Message');
const Lecture = require('../models/Lecture');

// @desc    Get all courses
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true });
  res.json(courses);
});

// @desc    Create course
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

// @desc    Get course by ID
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
const registerForTraining = asyncHandler(async (req, res) => {
  const registration = await TrainingRegistration.create({
    ...req.body,
    candidate: req.user?._id
  });
  res.status(201).json(registration);
});

// @desc    Get candidate's training enrollments
const getMyTraining = asyncHandler(async (req, res) => {
  const enrollments = await TrainingRegistration.find({ candidate: req.user._id })
    .populate('course')
    .populate('batch');
  res.json(enrollments);
});

// @desc    Get trainer's batches
const getTrainerBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find({ trainer: req.user._id }).populate('course');
  res.json(batches);
});

// @desc    Get trainer's candidates
const getTrainerCandidates = asyncHandler(async (req, res) => {
  const batches = await Batch.find({ trainer: req.user._id });
  const batchIds = batches.map(b => b._id);
  const candidates = await TrainingRegistration.find({ batch: { $in: batchIds } }).populate('batch');
  res.json(candidates);
});

// @desc    Get all batches
const getBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find({}).populate('course').populate('trainer', 'firstName lastName');
  res.json(batches);
});

// @desc    Create batch
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
  const material = await Material.create({
    ...req.body,
    trainer: req.user._id
  });
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

// Lecture Controllers
const getLecturesByBatch = asyncHandler(async (req, res) => {
  const lectures = await Lecture.find({ batch: req.params.batchId }).sort({ order: 1 });
  res.json(lectures);
});

const createLecture = asyncHandler(async (req, res) => {
  const { title, description, type, url, batchId } = req.body;
  const lecture = await Lecture.create({
    title,
    description,
    type,
    url,
    batch: batchId,
    trainer: req.user._id
  });
  res.status(201).json(lecture);
});

const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (lecture) {
    if (lecture.trainer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await lecture.deleteOne();
    res.json({ message: 'Lecture removed' });
  } else {
    res.status(404);
    throw new Error('Lecture not found');
  }
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
  sendMessage,
  getLecturesByBatch,
  createLecture,
  deleteLecture
};
