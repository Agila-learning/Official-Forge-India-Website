const Driver = require('../models/Driver');
const DriverDocument = require('../models/DriverDocument');
const Vehicle = require('../models/Vehicle');

const validateDriverReadiness = async (req, res, next) => {
  try {
    if (req.user.role !== 'Driver' && req.user.role !== 'Delivery Partner') {
      return next(); // Not a driver, skip validation
    }

    const driver = await Driver.findOne({ user: req.user._id });
    
    if (!driver) {
      return res.status(403).json({ 
        code: 'ACCOUNT_SETUP_PENDING', 
        message: 'Driver profile setup is incomplete.' 
      });
    }

    req.driverContext = driver; // Attach driver context

    if (driver.verificationStatus === 'Suspended') {
      return res.status(403).json({ 
        code: 'ACCOUNT_SUSPENDED', 
        message: 'Your account has been suspended by Admin.' 
      });
    }

    if (driver.verificationStatus === 'Pending' || driver.verificationStatus === 'Under Review') {
      return res.status(403).json({ 
        code: 'DOCS_PENDING', 
        message: 'Your documents are pending upload or verification.' 
      });
    }

    // Vehicle Assignment Check
    if (driver.vehicleOwnership === 'Company Assigned Vehicle' && !driver.activeVehicle) {
      return res.status(403).json({ 
        code: 'VEHICLE_UNASSIGNED', 
        message: 'Waiting for Admin to assign a company vehicle.' 
      });
    }

    if (driver.vehicleOwnership === 'Own Vehicle' && !driver.activeVehicle) {
      return res.status(403).json({ 
        code: 'VEHICLE_UNASSIGNED', 
        message: 'You need to register and activate your vehicle.' 
      });
    }

    // Active Vehicle Verification (Expiry checks)
    const vehicle = await Vehicle.findById(driver.activeVehicle);
    if (!vehicle) {
      // For verified drivers without a vehicle doc (e.g. test accounts), still allow
      // If verificationStatus is Verified, trust the admin approval
      if (driver.verificationStatus === 'Verified') {
        req.driverContext = driver;
        return next();
      }
      return res.status(403).json({ 
        code: 'VEHICLE_UNASSIGNED', 
        message: 'Assigned vehicle not found. Please register your vehicle.'
      });
    }

    const now = new Date();
    
    if (vehicle.rcDocument?.expiryDate && vehicle.rcDocument.expiryDate < now) {
      return res.status(403).json({ code: 'RC_EXPIRED', message: 'Vehicle RC has expired.' });
    }
    
    if (vehicle.insuranceDocument?.expiryDate && vehicle.insuranceDocument.expiryDate < now) {
      return res.status(403).json({ code: 'INSURANCE_EXPIRED', message: 'Vehicle Insurance has expired.' });
    }

    // Driver License Verification
    const docs = await DriverDocument.findOne({ driverId: driver._id });
    if (docs?.drivingLicense?.expiryDate && docs.drivingLicense.expiryDate < now) {
      return res.status(403).json({ code: 'LICENSE_EXPIRED', message: 'Driving License has expired.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Validation Error', error: err.message });
  }
};

module.exports = { validateDriverReadiness };
