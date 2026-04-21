const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Delivery Partner') {
      query = { assignedTo: req.user._id };
    } else if (req.user.role !== 'Admin') {
      // Other roles shouldn't really see tasks unless they are admins
      // But we'll allow it if they aren't Delivery Partners for now or return empty
      query = { assignedTo: req.user._id };
    }
    const tasks = await Task.find(query).populate('assignedTo', 'firstName lastName email role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, location, images } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    if (status) task.status = status;
    if (location) task.location = location;
    if (images && images.length > 0) {
       task.images = [...task.images, ...images];
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = await Task.create({ title, description, assignedTo });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, updateTaskStatus, assignTask };
