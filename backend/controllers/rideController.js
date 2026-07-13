const Ride = require('../models/Ride');
const Order = require('../models/Order'); // kept for backwards compat just in case
const User = require('../models/User');
const FareConfig = require('../models/FareConfig');
const { haversineKm, calculateFare } = require('./fareConfigController');
const { createNotification } = require('./notificationController');


// @desc    Estimate Fare (real Haversine)
// @route   POST /api/rides/estimate
// @access  Private
const estimateFare = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, vehicleType, origin, destination } = req.body;

    let distanceKm;
    if (originLat && originLng && destLat && destLng) {
      distanceKm = haversineKm(Number(originLat), Number(originLng), Number(destLat), Number(destLng));
    } else {
      // Fallback: address-based random (legacy support)
      distanceKm = Math.floor(Math.random() * 15) + 3;
    }

    const avgSpeedKmh = 30;
    const durationMin = Math.round((distanceKm / avgSpeedKmh) * 60);

    // Normalise vehicle type
    const vTypeMap = {
      'Bike Ride': 'Bike', 'Bike Taxi': 'Bike',
      'Auto Rickshaw': 'Auto', 'Auto': 'Auto',
      'Car': 'Mini', 'Mini': 'Mini',
      'Premium Taxi': 'Luxury', 'Luxury': 'Luxury',
      'SUV': 'SUV', 'Sedan': 'Sedan', 'Van': 'Van',
      'Pickup Truck': 'Pickup Truck',
      'Delivery Service': 'Delivery Service', 'Parcel Delivery': 'Delivery Service'
    };
    const normType = vTypeMap[vehicleType] || vehicleType || 'Mini';
    const config = await FareConfig.findOne({ vehicleType: normType }) ||
                   await FareConfig.findOne({ vehicleType: 'Mini' });

    if (!config) {
      // Fallback if no config at all
      const fallbackFare = 50 + distanceKm * 15;
      return res.json({ distance: `${distanceKm.toFixed(1)} km`, duration: `${durationMin} mins`, estimatedFare: Math.round(fallbackFare), distanceKm });
    }

    const result = calculateFare(config, distanceKm, durationMin);
    res.json({
      distance: `${distanceKm.toFixed(1)} km`,
      duration: `${durationMin} mins`,
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin,
      estimatedFare: result.fare,
      ...result.breakdown
    });
  } catch (err) {
    res.status(500).json({ message: 'Error estimating fare', error: err.message });
  }
};


// @desc    Request a Ride
// @route   POST /api/rides/request
// @access  Private
const requestRide = async (req, res) => {
  try {
    const pickup = req.body.origin || req.body.pickupLocation?.address || 'Pickup Address';
    const drop = req.body.destination || req.body.dropLocation?.address || 'Drop Address';
    const vType = req.body.vehicleType || req.body.rideType || 'Car';
    const fare = req.body.estimatedFare || req.body.fare || 50;
    const paymentMethod = req.body.paymentMethod || 'Cash';
    const distanceKm = req.body.distance || 5;
    const womenSafetyMode = req.body.womenSafetyMode || false;

    // Generate a 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const rideObj = new Ride({
      customer: req.user._id,
      pickupLocation: {
        lat: req.body.originLat || 0,
        lng: req.body.originLng || 0,
        address: pickup
      },
      dropLocation: {
        lat: req.body.destLat || 0,
        lng: req.body.destLng || 0,
        address: drop
      },
      vehicleType: vType,
      status: 'Requested',
      fareEstimate: fare,
      distanceKm: distanceKm,
      paymentMethod: paymentMethod,
      womenSafetyMode: womenSafetyMode,
      rideMetadata: { // Virtual/Extra field logic handled later if needed, but we keep OTP here for compatibility if frontend expects it inside rideMetadata
        otp,
        estimatedArrival: new Date(Date.now() + 15 * 60000)
      }
    });

    const createdRide = await rideObj.save();

    const io = req.app.get('io');
    if (io) {
      // 1. Broadcast raw ride request to all connected drivers (for the driver dashboard)
      io.emit('new_ride_request', {
        ...createdRide.toObject(),
        pickupAddress: pickup,
        dropAddress: drop,
        vehicleType: vType,
        fare,
        otp
      });

      // 2. Create a DB notification for the CUSTOMER (so the bell icon updates)
      await createNotification(io, {
        user: req.user._id,
        title: '🚖 Ride Requested!',
        message: `Searching for a ${vType} from ${pickup.split(',')[0]}. OTP: ${otp}`,
        type: 'Ride',
        link: `/track-mission/${createdRide._id}`
      });
    }

    res.status(201).json(createdRide);
  } catch (err) {
    console.error('requestRide error:', err.message, JSON.stringify(err.errors));
    res.status(500).json({ message: 'Error requesting ride', error: err.message });
  }
};

// @desc    Get nearby rides for driver
// @route   GET /api/rides/nearby
// @access  Private
const getNearbyRides = async (req, res) => {
  try {
    const driver = req.driverContext;
    if (!driver) return res.status(403).json({ message: 'Driver context missing' });

    if (driver.shiftStatus !== 'Online') {
      return res.json([]); // Return empty if offline or on break
    }

    // Build allowed service types based on driver type
    let allowedServiceTypes = [];
    if (driver.driverType === 'Bike') {
      allowedServiceTypes = ['Bike', 'Bike Ride', 'Bike Taxi', 'Food Delivery', 'Parcel Delivery'];
    } else if (['Taxi', 'Cab', 'Car'].includes(driver.driverType)) {
      // Accept all car/cab/taxi bookings regardless of subtype
      allowedServiceTypes = ['Car', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Van', 'Cab', 'Taxi', 'Premium Taxi'];
    } else if (driver.driverType === 'Auto') {
      allowedServiceTypes = ['Auto'];
    } else if (driver.driverType === 'Logistics Driver') {
      allowedServiceTypes = ['Shipment', 'Pickup Truck', 'Mini Truck', 'Van'];
    } else if (driver.driverType === 'Delivery Partner') {
      allowedServiceTypes = ['Food Delivery', 'Parcel Delivery', 'Grocery', 'Delivery Service'];
    } else {
      // Fallback: show all pending rides
      allowedServiceTypes = ['Bike', 'Auto', 'Car', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Van', 'Cab', 'Taxi', 
        'Bike Ride', 'Food Delivery', 'Parcel Delivery', 'Grocery', 'Delivery Service', 'Pickup Truck'];
    }

    const rides = await Ride.find({ 
      status: 'Requested',
      serviceType: { $in: allowedServiceTypes }
    }).populate('user', 'firstName lastName mobile').sort('-createdAt');
    
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching nearby rides', error: err.message });
  }
};

// @desc    Get pending rides (lighter check - no doc validation required)
// @route   GET /api/rides/pending
// @access  Private (Driver/Delivery Partner only)
const getPendingRides = async (req, res) => {
  try {
    if (req.user.role !== 'Driver' && req.user.role !== 'Delivery Partner') {
      return res.status(403).json({ message: 'Only drivers can access pending rides' });
    }

    const Driver = require('../models/Driver');
    const driver = await Driver.findOne({ user: req.user._id });
    
    if (!driver) {
      return res.json([]); // No driver profile yet
    }

    if (driver.shiftStatus !== 'Online') {
      return res.json([]); // Must be online to receive rides
    }

    // Build allowed type list based on driver category
    const CAB_TYPES = ['Car', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Taxi', 'Cab', 'Premium Taxi',
      'Auto', 'Bike', 'Bike Ride', 'Bike Taxi', 'Van', 'Parcel Delivery'];
    const DELIVERY_TYPES = ['Food Delivery', 'Parcel Delivery', 'Grocery', 'Delivery Service', 'Delivery Partner'];
    const BIKE_TYPES = ['Bike', 'Bike Ride', 'Bike Taxi', 'Food Delivery', 'Parcel Delivery'];
    const LOGISTICS_TYPES = ['Pickup Truck', 'Mini Truck', 'Van', 'Shipment'];

    let allowedTypes;
    if (driver.driverType === 'Bike') {
      allowedTypes = BIKE_TYPES;
    } else if (driver.driverType === 'Auto') {
      allowedTypes = ['Auto'];
    } else if (driver.driverType === 'Delivery Partner') {
      allowedTypes = DELIVERY_TYPES;
    } else if (driver.driverType === 'Logistics Driver') {
      allowedTypes = LOGISTICS_TYPES;
    } else {
      // Cab/Taxi/Car — accept all ride types
      allowedTypes = CAB_TYPES;
    }

    const rides = await Ride.find({
      status: 'Requested',
      serviceType: { $in: allowedTypes }
    }).populate('user', 'firstName lastName mobile').sort('-createdAt').limit(10);

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending rides', error: err.message });
  }
};

// @desc    Accept a Ride
// @route   PUT /api/rides/:id/accept
// @access  Private
const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'Requested') {
      return res.status(400).json({ message: 'Ride has already been accepted by another partner.' });
    }

    const Driver = require('../models/Driver');
    const driverProfile = await Driver.findOne({ user: req.user._id });

    ride.driver = req.user._id;
    ride.status = 'Accepted';
    
    // Assign driver details from real profile
    ride.rideMetadata = {
      ...ride.rideMetadata,
      driverName: `${req.user.firstName} ${req.user.lastName}`,
      driverRating: driverProfile?.stats?.rating || 4.8,
      driverPhone: req.user.mobile,
      vehicleNumber: req.user.vehicleRC || 'TN 07 AB 1234',
      vehicleModel: req.user.vehicleModel || 'Swift Dzire'
    };

    const updatedRide = await ride.save();
    const populatedRide = await Ride.findById(updatedRide._id).populate('user', 'firstName lastName mobile').populate('deliveryPartner', 'firstName lastName mobile');

    const io = req.app.get('io');
    await createNotification(io, {
      user: ride.customer,
      title: '🚗 Driver Assigned!',
      message: `${req.user.firstName} is on the way to pick you up.`,
      type: 'ride',
      link: `/rides/tracking/${ride._id}`
    });

    if (io) {
      io.to(ride.customer.toString()).emit('ride_accepted', populatedRide);
      io.to(req.user._id.toString()).emit('ride_assigned', populatedRide);
    }

    res.json(populatedRide);
  } catch (err) {
    res.status(500).json({ message: 'Error accepting ride', error: err.message });
  }
};

// @desc    Update Ride Status
// @route   PUT /api/rides/:id/status
// @access  Private
const updateRideStatus = async (req, res) => {
  try {
    const { status, otp, cancellationReason } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    
    const isCustomer = ride.customer.toString() === req.user._id.toString();
    const isDriver = ride.driver && ride.driver.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCustomer && !isDriver && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this ride' });
    }

    // Customer constraints
    if (isCustomer && !isAdmin) {
      if (status !== 'Cancelled') {
        return res.status(400).json({ message: 'Customers can only cancel rides' });
      }
      if (!['Requested', 'Accepted'].includes(ride.status)) {
        return res.status(400).json({ message: 'Cannot cancel a ride that is already in progress' });
      }
    }

    // Verify OTP when starting trip
    if (status === 'Ride Started' && !isAdmin) {
      if (ride.rideMetadata?.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP. Cannot start trip.' });
      }
    }

    ride.status = status;
    if (status === 'Ride Started') {
      if (ride.rideMetadata?.otp && String(otp) !== String(ride.rideMetadata.otp)) {
        return res.status(400).json({ message: 'Invalid OTP. Please verify with the customer.' });
      }
      ride.startedAt = new Date();
    }
    if (status === 'Cancelled') {
      ride.rideMetadata = {
        ...ride.rideMetadata,
        cancelledBy: isCustomer ? 'Customer' : isDriver ? 'Driver' : 'Admin',
        cancellationReason: cancellationReason || 'No reason provided'
      };
    }
    
    if (status === 'Completed') {
      ride.isDelivered = true;
      ride.deliveredAt = Date.now();
      ride.completedAt = new Date();

      // Real fare calculation
      const startTime = ride.startedAt ? new Date(ride.startedAt) : new Date(Date.now() - 20 * 60000);
      const durationMin = Math.round((Date.now() - startTime.getTime()) / 60000);
      const distKm = ride.rideMetadata?.distanceKm || 5;
      const vType = ride.serviceType || 'Mini';
      const vTypeMap = {
        'Bike Ride': 'Bike', 'Bike Taxi': 'Bike',
        'Auto Rickshaw': 'Auto', 'Auto': 'Auto',
        'Car': 'Mini', 'Mini': 'Mini',
        'Premium Taxi': 'Luxury', 'Luxury': 'Luxury',
        'SUV': 'SUV', 'Sedan': 'Sedan',
        'Delivery Service': 'Delivery Service', 'Parcel Delivery': 'Delivery Service'
      };
      const fareConf = await FareConfig.findOne({ vehicleType: vTypeMap[vType] || vType });
      let finalFare = ride.totalPrice;
      let commission = ride.totalPrice * 0.2;
      if (fareConf) {
        const result = calculateFare(fareConf, distKm, durationMin);
        finalFare = result.fare;
        commission = result.breakdown.platformFee;
      }

      ride.totalPrice = finalFare;
      ride.rideMetadata = { ...ride.rideMetadata, finalFare, commission, durationMin };
      
      const driverEarning = finalFare - commission;
      let walletDelta = 0;
      if (ride.paymentMethod === 'Cash' || !ride.isPaid) {
        walletDelta = -commission; // Driver collected cash, owes commission
      } else {
        walletDelta = driverEarning;
      }

      if (ride.driver) {
        await User.findByIdAndUpdate(ride.driver, {
          $inc: { 
            walletBalance: walletDelta,
            'driverStats.totalRides': 1,
            'driverStats.earningsTotal': driverEarning
          }
        });
      }
    }

    const updatedRide = await ride.save();

    const io = req.app.get('io');
    await createNotification(io, {
      user: ride.customer,
      title: `Ride Status: ${status}`,
      message: `Your ride status is now: ${status}`,
      type: 'ride',
      link: '/customer/ride'
    });

    if (io) {
      io.to(ride.customer.toString()).emit('ride_status_updated', updatedRide);
      if (ride.driver) {
        io.to(ride.driver.toString()).emit('ride_status_updated', updatedRide);
      }
    }

    res.json(updatedRide);
  } catch (err) {
    res.status(500).json({ message: 'Error updating ride status', error: err.message });
  }
};

// @desc    Rate a Driver after ride completes
// @route   PUT /api/rides/:id/rate
// @access  Private
const rateRide = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    
    const isCustomer = ride.customer.toString() === req.user._id.toString();
    const isDriver = ride.driver && ride.driver.toString() === req.user._id.toString();

    if (!isCustomer && !isDriver) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (isCustomer) {
      // Update Driver Rating
      const driver = await User.findById(ride.driver);
      if (driver) {
        const currentStats = driver.driverStats || { totalRides: 1, averageRating: 5.0 };
        const totalRatingPoints = (currentStats.averageRating * (currentStats.totalRides - 1)) + Number(rating);
        const newAverage = totalRatingPoints / currentStats.totalRides;
        
        await User.findByIdAndUpdate(driver._id, {
          $set: { 'driverStats.averageRating': Number(newAverage.toFixed(1)) }
        });
      }
      ride.rideMetadata = {
        ...ride.rideMetadata,
        customerRating: rating,
        customerFeedback: feedback
      };
    } else if (isDriver) {
      // (Optional) Update Customer average rating here if we store it
      ride.rideMetadata = {
        ...ride.rideMetadata,
        driverRating: rating,
        driverFeedback: feedback
      };
    }
    
    await ride.save();
    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting rating', error: err.message });
  }
};

// @desc    Get Rides for User/Driver
// @route   GET /api/rides
// @access  Private
const getRides = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query = {
        $or: [
          { customer: req.user._id },
          { driver: req.user._id }
        ]
      };
    }
    const rides = await Ride.find({
      ...query,
      vehicleType: { $in: ['Bike', 'Auto', 'Car', 'SUV', 'Parcel Delivery', 'Bike Ride', 'Premium Taxi', 'Delivery Service'] }
    })
    .populate('customer', 'firstName lastName avatar mobile')
    .populate('driver', 'firstName lastName avatar mobile')
    .sort({ createdAt: -1 });
    
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rides', error: err.message });
  }
};

// ─── Phase 2: Safety Features ─────────────────────────────

// @desc    Log Emergency Event (SOS, Route Deviation)
// @route   POST /api/rides/:id/emergency
// @access  Private
const logEmergency = async (req, res) => {
  try {
    const { eventType, location } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (!ride.rideMetadata) ride.rideMetadata = {};
    if (!ride.rideMetadata.emergencyEvents) ride.rideMetadata.emergencyEvents = [];

    ride.rideMetadata.emergencyEvents.push({
      eventType: eventType || 'SOS Alert',
      location: location || { lat: 0, lng: 0 }
    });

    await ride.save();

    // Alert Admin or Trusted Contacts via Socket
    const io = req.app.get('io');
    if (io) {
      io.emit('admin_emergency_alert', {
        rideId: ride._id,
        user: req.user.firstName,
        eventType: eventType || 'SOS Alert',
        location
      });
    }

    res.json({ message: 'Emergency event logged successfully', ride });
  } catch (err) {
    res.status(500).json({ message: 'Error logging emergency', error: err.message });
  }
};

// @desc    Submit Safety Score
// @route   POST /api/rides/:id/safety-score
// @access  Private
const submitSafetyScore = async (req, res) => {
  try {
    const { score } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (!ride.rideMetadata) ride.rideMetadata = {};
    ride.rideMetadata.safetyScore = score;
    await ride.save();

    // Update Driver's overall safety score
    if (ride.driver) {
      const driver = await User.findById(ride.driver);
      if (driver) {
        // Simple moving average logic or just save latest
        const currentScore = driver.safetyScore || 100;
        driver.safetyScore = Math.round((currentScore + score) / 2);
        await driver.save();
      }
    }

    res.json({ message: 'Safety score updated successfully', ride });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting safety score', error: err.message });
  }
};

// @desc    Get Safety Reports (Admin)
// @route   GET /api/rides/admin/safety-reports
// @access  Private/Admin
const getSafetyReports = async (req, res) => {
  try {
    const ridesWithEmergencies = await Ride.find({
      'rideMetadata.emergencyEvents': { $exists: true, $not: { $size: 0 } }
    }).populate('user', 'firstName lastName mobile').populate('deliveryPartner', 'firstName lastName mobile').sort({ createdAt: -1 });
    
    res.json(ridesWithEmergencies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching safety reports', error: err.message });
  }
};

// @desc    Get driver dashboard context (profile + vehicle + docs + stats)
// @route   GET /api/rides/driver/context
// @access  Private (Driver/Delivery Partner)
const getDriverContext = async (req, res) => {
  try {
    const Driver = require('../models/Driver');
    const DriverDocument = require('../models/DriverDocument');
    const Vehicle = require('../models/Vehicle');

    let driver = await Driver.findOne({ user: req.user._id }).populate('activeVehicle');

    if (!driver) {
      // Auto-provision test driver for dashboard testing
      const ProviderWallet = require('../models/ProviderWallet');
      driver = await Driver.create({
        user: req.user._id,
        driverType: 'Bike',
        vehicleOwnership: 'Own Vehicle',
        isVerified: true,
        isOnline: true,
        stats: { totalTrips: 45, totalEarnings: 8450, rating: 4.8, acceptanceRate: 95 }
      });
      const vehicle = await Vehicle.create({
        ownerId: req.user._id, ownerModel: 'User', vehicleCategory: 'Bike',
        model: 'Honda Activa', registrationNumber: 'TN-' + Math.floor(Math.random() * 90 + 10) + '-AB-1234', isActive: true
      });
      driver.activeVehicle = vehicle._id;
      await driver.save();
      await ProviderWallet.create({ user: req.user._id, balance: 4500, withdrawableAmount: 1200, transactions: [] });
      driver = await Driver.findOne({ user: req.user._id }).populate('activeVehicle');
    }

    const docs = await DriverDocument.findOne({ driverId: driver._id });
    const vehicles = await Vehicle.find({ ownerId: req.user._id, isActive: true });

    // Check document expiries
    const now = new Date();
    const warnings = [];
    if (docs?.drivingLicense?.expiryDate && new Date(docs.drivingLicense.expiryDate) < now) {
      warnings.push({ code: 'DL_EXPIRED', message: 'Driving License has expired' });
    }
    const vehicle = driver.activeVehicle;
    if (vehicle) {
      if (vehicle.rcDocument?.expiryDate && new Date(vehicle.rcDocument.expiryDate) < now) {
        warnings.push({ code: 'RC_EXPIRED', message: 'Vehicle RC has expired' });
      }
      if (vehicle.insuranceDocument?.expiryDate && new Date(vehicle.insuranceDocument.expiryDate) < now) {
        warnings.push({ code: 'INSURANCE_EXPIRED', message: 'Insurance has expired' });
      }
      if (vehicle.pollutionCertificate?.expiryDate && new Date(vehicle.pollutionCertificate.expiryDate) < now) {
        warnings.push({ code: 'PUC_EXPIRED', message: 'Pollution Certificate has expired' });
      }
    }

    // Earnings stats for today
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayRides = await Ride.find({
      deliveryPartner: req.user._id,
      status: 'Completed',
      completedAt: { $gte: todayStart }
    });
    const todayEarnings = todayRides.reduce((sum, r) => {
      const c = r.rideMetadata?.commission || r.totalPrice * 0.2;
      return sum + (r.totalPrice - c);
    }, 0);

    res.json({
      hasProfile: true,
      driver,
      docs,
      vehicles,
      warnings,
      todayStats: {
        trips: todayRides.length,
        earnings: Math.round(todayEarnings),
      },
      allTimeStats: {
        totalRides: driver.stats?.totalTrips || 0,
        totalEarnings: driver.stats?.totalEarnings || 0,
        rating: driver.stats?.rating || 5.0,
        acceptanceRate: driver.stats?.acceptanceRate || 100,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching driver context', error: err.message });
  }
};

// @desc    Update driver current location
// @route   PUT /api/rides/driver/location
// @access  Private
const updateDriverLocation = async (req, res) => {
  try {
    const Driver = require('../models/Driver');
    const { lat, lng, heading } = req.body;
    await Driver.findOneAndUpdate(
      { user: req.user._id },
      { currentLocation: { lat, lng, heading, updatedAt: new Date() } }
    );
    // Broadcast location to customers via Socket
    const io = req.app.get('socketio');
    if (io) {
      io.emit('driver_location_update', { driverId: req.user._id, lat, lng, heading });
    }
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err.message });
  }
};

// @desc    Update driver online status and active vehicle
// @route   PUT /api/rides/driver/status
// @access  Private
const updateDriverStatus = async (req, res) => {
  try {
    const Driver = require('../models/Driver');
    const { isOnline, activeVehicle } = req.body;
    
    const updateData = {};
    if (typeof isOnline === 'boolean') updateData.isOnline = isOnline;
    if (activeVehicle) updateData.activeVehicle = activeVehicle;

    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true }
    ).populate('activeVehicle');

    res.json({ message: 'Driver status updated', driver });
  } catch (err) {
    res.status(500).json({ message: 'Error updating driver status', error: err.message });
  }
};

module.exports = {
  estimateFare,
  requestRide,
  getNearbyRides,
  getPendingRides,
  acceptRide,
  updateRideStatus,
  rateRide,
  getRides,
  logEmergency,
  submitSafetyScore,
  getSafetyReports,
  getDriverContext,
  updateDriverLocation,
  updateDriverStatus
};
