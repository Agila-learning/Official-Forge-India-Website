const FareConfig = require('../models/FareConfig');

// Default seed data
const DEFAULT_CONFIGS = [
  { vehicleType: 'Bike',           displayName: 'Bike Taxi',      baseFare: 20,  perKmRate: 8,  perMinRate: 0.5, minimumFare: 30,  commissionPct: 18, iconEmoji: '🛵', colorHex: '#F59E0B' },
  { vehicleType: 'Auto',           displayName: 'Auto Rickshaw',  baseFare: 30,  perKmRate: 12, perMinRate: 1,   minimumFare: 40,  commissionPct: 15, iconEmoji: '🛺', colorHex: '#8B5CF6' },
  { vehicleType: 'Mini',           displayName: 'Mini Cab',       baseFare: 50,  perKmRate: 14, perMinRate: 1.5, minimumFare: 80,  commissionPct: 20, iconEmoji: '🚗', colorHex: '#3B82F6' },
  { vehicleType: 'Sedan',          displayName: 'Sedan Cab',      baseFare: 60,  perKmRate: 16, perMinRate: 2,   minimumFare: 100, commissionPct: 20, iconEmoji: '🚕', colorHex: '#06B6D4' },
  { vehicleType: 'SUV',            displayName: 'SUV / XL',       baseFare: 80,  perKmRate: 22, perMinRate: 2.5, minimumFare: 140, commissionPct: 22, iconEmoji: '🚙', colorHex: '#10B981' },
  { vehicleType: 'Luxury',         displayName: 'Premium Taxi',   baseFare: 100, perKmRate: 28, perMinRate: 3,   minimumFare: 200, commissionPct: 25, iconEmoji: '🚘', colorHex: '#6366F1' },
  { vehicleType: 'Van',            displayName: 'Van / Tempo',    baseFare: 70,  perKmRate: 18, perMinRate: 2,   minimumFare: 120, commissionPct: 20, iconEmoji: '🚐', colorHex: '#F97316' },
  { vehicleType: 'Pickup Truck',   displayName: 'Pickup / Mini Truck', baseFare: 90, perKmRate: 20, perMinRate: 2.5, minimumFare: 150, commissionPct: 20, iconEmoji: '🚚', colorHex: '#EF4444' },
  { vehicleType: 'Delivery Service', displayName: 'Parcel Delivery', baseFare: 40, perKmRate: 10, perMinRate: 1, minimumFare: 50, commissionPct: 18, iconEmoji: '📦', colorHex: '#84CC16' },
];

// ─── Haversine Distance (km) ───────────────────────────────────────────────────
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Surge multiplier based on current hour ───────────────────────────────────
const getSurgeMultiplier = (config) => {
  const hour = new Date().getHours();
  const isPeak = (hour >= config.peakHoursStart && hour <= config.peakHoursEnd);
  const isNight = (hour >= config.nightHoursStart || hour <= config.nightHoursEnd);
  if (isNight) return config.nightSurge || 1.5;
  if (!isPeak) return config.peakSurge || 1.3;
  return 1.0;
};

// ─── Calculate Fare ───────────────────────────────────────────────────────────
const calculateFare = (config, distanceKm, durationMin = 0) => {
  const surge = getSurgeMultiplier(config);
  const raw = config.baseFare
    + (config.perKmRate * distanceKm)
    + (config.perMinRate * durationMin);
  const withSurge = raw * surge;
  return {
    fare: Math.max(config.minimumFare, Math.round(withSurge)),
    surge,
    breakdown: {
      baseFare: config.baseFare,
      distanceCharge: Math.round(config.perKmRate * distanceKm),
      timeCharge: Math.round(config.perMinRate * durationMin),
      surgeMultiplier: surge,
      raw: Math.round(raw),
      commissionPct: config.commissionPct,
      driverEarnings: Math.round(Math.max(config.minimumFare, Math.round(withSurge)) * (1 - config.commissionPct / 100)),
      platformFee: Math.round(Math.max(config.minimumFare, Math.round(withSurge)) * (config.commissionPct / 100)),
    }
  };
};

// GET /api/fare-config — public
const getAllFareConfigs = async (req, res) => {
  try {
    const configs = await FareConfig.find({ isActive: true }).sort({ baseFare: 1 });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/fare-config/all — admin (includes inactive)
const getAllFareConfigsAdmin = async (req, res) => {
  try {
    const configs = await FareConfig.find().sort({ baseFare: 1 });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/fare-config/:type — admin update
const updateFareConfig = async (req, res) => {
  try {
    const config = await FareConfig.findOneAndUpdate(
      { vehicleType: req.params.type },
      { ...req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/fare-config/estimate — real fare estimate with Haversine
const estimateFareFromConfig = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, vehicleType } = req.body;

    let distanceKm;
    if (originLat && originLng && destLat && destLng) {
      distanceKm = haversineKm(
        Number(originLat), Number(originLng),
        Number(destLat), Number(destLng)
      );
    } else {
      distanceKm = req.body.distanceKm || 5;
    }

    const avgSpeedKmh = 30; // urban average
    const durationMin = Math.round((distanceKm / avgSpeedKmh) * 60);

    const config = await FareConfig.findOne({ vehicleType: vehicleType || 'Mini' });
    if (!config) return res.status(404).json({ message: 'Vehicle type not found in fare config' });

    const result = calculateFare(config, distanceKm, durationMin);

    res.json({
      vehicleType,
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin,
      ...result
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bootstrap — seed configs if empty
const initializeFareConfigs = async () => {
  try {
    const count = await FareConfig.countDocuments();
    if (count === 0) {
      await FareConfig.insertMany(DEFAULT_CONFIGS);
      console.log('✅ Bootstrap: Default Fare Configs seeded');
    }
  } catch (err) {
    console.error('❌ Fare Config bootstrap error:', err.message);
  }
};

module.exports = {
  getAllFareConfigs,
  getAllFareConfigsAdmin,
  updateFareConfig,
  estimateFareFromConfig,
  initializeFareConfigs,
  haversineKm,
  calculateFare,
};
