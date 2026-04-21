const JobPost = require('../models/JobPost');

const getJobs = async (req, res) => {
  try {
    let query = { status: 'Active' }; // Public view default
    if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
      // Show all jobs for HR and Admin in dashboard
      query = {};
    }
    const jobs = await JobPost.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  const { 
    requirements, responsibilities, education, experience, openings, expiryDate, companyWebsite 
  } = req.body;
  
  try {
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
      hrId: req.user._id
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
      requirements, responsibilities, education, experience, openings, expiryDate, status, companyWebsite 
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
