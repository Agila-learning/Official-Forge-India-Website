const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const JobPost = require('../models/JobPost');

const getJobs = async (req, res) => {
  try {
    let query = { status: 'Active' }; // Public view default
    
    // Manually extract token to isolate jobs if user is logged in
    let user;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'forge_secret_key_123');
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Suppress error since this is a public GET endpoint
      }
    }

    if (user) {
      if (user.role === 'HR') {
        query = { hrId: user._id };
      } else if (user.role === 'Admin') {
        query = {};
      }
    }
    const jobs = await JobPost.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  // Validation schema
  const schema = Joi.object({
    title: Joi.string().required(),
    companyName: Joi.string().optional().allow(''),
    location: Joi.string().required(),
    salary: Joi.string().optional().allow(''),
    description: Joi.string().optional().allow(''),
    responsibilities: Joi.string().optional().allow(''),
    requirements: Joi.string().optional().allow(''),
    education: Joi.string().optional().allow(''),
    experience: Joi.string().optional().allow(''),
    openings: Joi.number().integer().min(1).optional().allow('', null),
    expiryDate: Joi.date().optional().allow('', null),
    companyWebsite: Joi.string().uri().optional().allow(''),
    hrId: Joi.string().optional().allow(''),
    recruitmentStatus: Joi.string().optional().allow(''),
    status: Joi.string().optional().allow('')
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
  }
  const {
    title,
    companyName,
    location,
    salary,
    description,
    responsibilities,
    requirements,
    education,
    experience,
    openings,
    expiryDate,
    companyWebsite,
    hrId
  } = value;

  try {
    let targetHrId = req.user._id;
    if (req.user.role === 'Admin' && hrId && hrId !== "") {
      targetHrId = hrId;
    }
    const job = await JobPost.create({
      title,
      companyName: companyName || 'Forge India Connect Partner',
      location,
      salary,
      description,
      responsibilities,
      requirements,
      education,
      experience,
      openings: openings || 1,
      companyWebsite,
      expiryDate,
      hrId: targetHrId
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Authorization check
    if (req.user.role !== 'Admin' && job.hrId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const { 
      title, companyName, location, salary, description, 
      requirements, responsibilities, education, experience, openings, expiryDate, status, companyWebsite, hrId 
    } = req.body;

    job.title = title || job.title;
    job.companyName = companyName || job.companyName;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.responsibilities = responsibilities || job.responsibilities;
    job.education = education || job.education;
    job.experience = experience || job.experience;
    job.openings = openings || job.openings;
    job.expiryDate = expiryDate || job.expiryDate;
    job.status = status || job.status;
    job.companyWebsite = companyWebsite || job.companyWebsite;
    if (req.user.role === 'Admin' && hrId && hrId !== "") {
      job.hrId = hrId;
    }

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Authorization check
    if (req.user.role !== 'Admin' && job.hrId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };
