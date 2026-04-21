const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'forge_secret_key_123');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Sub-Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Administrative clearance required' });
  }
};

const vendor = (req, res, next) => {
  if (req.user && (req.user.role === 'Vendor' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Vendor privileges required' });
  }
};

const hr = (req, res, next) => {
  if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: HR clearance required' });
  }
};

const delivery = (req, res, next) => {
  if (req.user && (req.user.role === 'Delivery Partner' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Delivery authorization required' });
  }
};

// Candidate guard — allows Candidates and Admins
const candidate = (req, res, next) => {
  if (req.user && (req.user.role === 'Candidate' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Candidate clearance required' });
  }
};

module.exports = { protect, admin, vendor, hr, delivery, candidate };
