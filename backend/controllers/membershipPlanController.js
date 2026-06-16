const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all membership plans
// @route   GET /api/membership-plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({});
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
    const { name, price, period, features, color, popular, status } = req.body;
    const plan = new MembershipPlan({
      name, price, period, features, color, popular, status
    });
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
    const { name, price, period, features, color, popular, status } = req.body;
    const plan = await MembershipPlan.findById(req.params.id);

    if (plan) {
      plan.name = name || plan.name;
      plan.price = price !== undefined ? price : plan.price;
      plan.period = period || plan.period;
      plan.features = features || plan.features;
      plan.color = color || plan.color;
      plan.popular = popular !== undefined ? popular : plan.popular;
      plan.status = status || plan.status;

      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
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

// Bootstrap function
const initializePlans = async () => {
  try {
    const count = await MembershipPlan.countDocuments();
    if (count === 0) {
      const defaultPlans = [
        {
          name: 'Free', price: 0, period: '/month', color: 'gray',
          features: ['3 Service Listings', 'Basic Analytics', 'Email Support', 'Standard Visibility'],
          popular: false
        },
        {
          name: 'Basic', price: 999, period: '/month', color: 'blue',
          features: ['10 Service Listings', 'Order Management', 'Priority Listing', 'Chat Support', 'Monthly Reports'],
          popular: false
        },
        {
          name: 'Premium', price: 2499, period: '/month', color: 'purple',
          features: ['Unlimited Listings', 'Advanced Analytics', 'Dedicated Manager', 'Featured Badge', 'Customer Insights', 'API Access'],
          popular: true
        },
        {
          name: 'Elite', price: 4999, period: '/month', color: 'yellow',
          features: ['All Premium features', 'White-label Portal', 'Custom Domain', 'SLA Guarantee', 'Bulk Imports', '24/7 Phone Support'],
          popular: false
        }
      ];
      await MembershipPlan.insertMany(defaultPlans);
      console.log('✅ Bootstrap: Default Membership Plans created successfully');
    }
  } catch (error) {
    console.error('❌ Bootstrap Membership Plans Error:', error.message);
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  initializePlans
};
