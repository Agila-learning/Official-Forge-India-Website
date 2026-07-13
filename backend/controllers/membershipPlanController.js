const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all membership plans
// @route   GET /api/membership-plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ status: 'Active' }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all plans (including inactive) — admin only
// @route   GET /api/membership-plans/all
// @access  Private/Admin
const getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({}).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a membership plan
// @route   POST /api/membership-plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const plan = new MembershipPlan({ ...req.body });
    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

// @desc    Update a membership plan
// @route   PUT /api/membership-plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const fields = [
      'name', 'planCode', 'description', 'price', 'period', 'validityDays',
      'cabDiscount', 'bikeDiscount', 'hotelDiscount', 'cleaningDiscount',
      'prioritySupport', 'premiumPartnerAccess', 'instantBooking',
      'freeCancellationCount', 'exclusiveOffers', 'referralBonus',
      'discountPercentage', 'cashbackPercentage', 'rewardPointsMultiplier',
      'renewalDiscount', 'priorityBooking', 'premiumSupport',
      'welcomeBonusPoints', 'features', 'color', 'popular', 'status'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) plan[field] = req.body[field];
    });

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/membership-plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Plan removed' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ─── Bootstrap function — seeds Starter/Premium/Elite on first run ──────────
const initializePlans = async () => {
  try {
    const count = await MembershipPlan.countDocuments();
    if (count === 0) {
      const defaultPlans = [
        {
          name: 'Starter',
          planCode: 'starter',
          description: 'Essential access to all FIC services with limited usage caps.',
          price: 199,
          period: '/month',
          validityDays: 30,
          color: 'blue',
          popular: false,
          // Cab
          cabDiscount:      { percentage: 5,  limit: 5  },
          // Bike
          bikeDiscount:     { percentage: 5,  limit: 5  },
          // Hotel
          hotelDiscount:    { percentage: 5,  limit: 2  },
          // Cleaning
          cleaningDiscount: { percentage: 5,  limit: 1  },
          prioritySupport: false,
          premiumPartnerAccess: false,
          instantBooking: true,
          freeCancellationCount: 1,
          exclusiveOffers: 'Monthly',
          referralBonus: 0,
          welcomeBonusPoints: 50,
          features: [
            'All Service Categories',
            '5% off on 5 cab rides',
            '5% off on 5 bike bookings',
            '5% off on 2 hotel bookings',
            '5% off on 1 cleaning service',
            '1 Free Cancellation',
            'Monthly Exclusive Offers',
          ],
        },
        {
          name: 'Premium',
          planCode: 'premium',
          description: 'Enjoy double the savings with 15 rides and priority support.',
          price: 499,
          period: '/month',
          validityDays: 30,
          color: 'purple',
          popular: true,
          cabDiscount:      { percentage: 10, limit: 15 },
          bikeDiscount:     { percentage: 10, limit: 15 },
          hotelDiscount:    { percentage: 10, limit: 5  },
          cleaningDiscount: { percentage: 10, limit: 3  },
          prioritySupport: true,
          premiumPartnerAccess: true,
          instantBooking: true,
          freeCancellationCount: 3,
          exclusiveOffers: 'Weekly',
          referralBonus: 50,
          welcomeBonusPoints: 150,
          features: [
            'All Service Categories',
            '10% off on 15 cab rides',
            '10% off on 15 bike bookings',
            '10% off on 5 hotel bookings',
            '10% off on 3 cleaning services',
            'Priority Support',
            'Premium Partner Access',
            '3 Free Cancellations',
            'Weekly Exclusive Offers',
            '₹50 Referral Bonus',
          ],
        },
        {
          name: 'Elite',
          planCode: 'elite',
          description: 'Unlimited discounts across all services with VIP access.',
          price: 999,
          period: '/month',
          validityDays: 30,
          color: 'yellow',
          popular: false,
          cabDiscount:      { percentage: 15, limit: -1 },   // -1 = unlimited
          bikeDiscount:     { percentage: 15, limit: -1 },
          hotelDiscount:    { percentage: 15, limit: -1 },
          cleaningDiscount: { percentage: 15, limit: -1 },
          prioritySupport: true,
          premiumPartnerAccess: true,
          instantBooking: true,
          freeCancellationCount: -1,    // unlimited
          exclusiveOffers: 'Weekly',
          referralBonus: 100,
          welcomeBonusPoints: 300,
          features: [
            'All Service Categories',
            '15% off — Unlimited cab rides',
            '15% off — Unlimited bike bookings',
            '15% off — Unlimited hotel bookings',
            '15% off — Unlimited cleaning services',
            'Priority Support',
            'Premium Partner Access',
            'Unlimited Free Cancellations',
            'Weekly Exclusive Offers',
            '₹100 Referral Bonus',
          ],
        },
      ];
      await MembershipPlan.insertMany(defaultPlans);
      console.log('✅ Bootstrap: Starter / Premium / Elite Membership Plans created');
    }
  } catch (error) {
    console.error('❌ Bootstrap Membership Plans Error:', error.message);
  }
};

module.exports = {
  getPlans,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  initializePlans
};
