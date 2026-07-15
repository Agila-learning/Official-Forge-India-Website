const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Razorpay = require('razorpay');
const { createNotification } = require('./notificationController');
const { initializeSettlement } = require('./settlementController');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      instructions,
      fulfillmentType
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // 1. HARDENING: Calculate total price server-side to prevent tampering
      let calculatedTotalPrice = 0;
      
      // Filter out items that don't have a valid ObjectId for 'product'
      // These are likely digital services or memberships
      const validProductIds = orderItems
        .map(item => item.product)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));
      
      const dbProducts = await Product.find({ _id: { $in: validProductIds } });

      const validatedOrderItems = orderItems.map(item => {
        let processedItem = { ...item };
        
        // If it's a valid product, validate against DB
        if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
          const product = dbProducts.find(p => p._id.toString() === item.product.toString());
          if (product) {
            const itemPrice = product.discountPrice || product.price;
            calculatedTotalPrice += itemPrice * (item.qty || 1);
            processedItem.price = itemPrice; // Force DB price
          }
        } else {
          // If not found in Product DB or not a valid ObjectId, trust frontend price (for services/memberships)
          calculatedTotalPrice += (item.price || 0) * (item.qty || 1);
        }
        
        if (processedItem.product && !mongoose.Types.ObjectId.isValid(processedItem.product)) {
            delete processedItem.product;
        }
        
        // Sanitize sub-document _id if it's not a valid mongoose ObjectId to prevent CastError
        if (processedItem._id && !mongoose.Types.ObjectId.isValid(processedItem._id)) {
            delete processedItem._id;
        }
        
        return processedItem;
      });

      // Handle delivery charges
      let maxDeliveryCharge = 0;
      dbProducts.forEach(p => {
          if (p.deliveryCharge > maxDeliveryCharge) {
              const threshold = p.freeDeliveryThreshold || 0;
              if (threshold === 0 || calculatedTotalPrice < threshold) {
                  maxDeliveryCharge = p.deliveryCharge;
              }
          }
      });
      
      calculatedTotalPrice += maxDeliveryCharge;

      // 2. PREMIUM MEMBERSHIP DISCOUNT ENGINE
      const currentUser = await User.findById(req.user._id).populate('membershipVault.planId');
      let discountAmount = 0;
      let appliedPlan = null;

      if (currentUser?.membershipVault?.status === 'Active' && currentUser.membershipVault.planId) {
        appliedPlan = currentUser.membershipVault.planId;
        
        // Check if items match eligibleCategories (For now we assume 'All' or specific categories)
        // Apply discount percentage
        if (appliedPlan.discountPercentage > 0) {
          let rawDiscount = calculatedTotalPrice * (appliedPlan.discountPercentage / 100);
          
          // Apply Max Discount Limit
          if (appliedPlan.maxDiscountPerBooking > 0 && rawDiscount > appliedPlan.maxDiscountPerBooking) {
             rawDiscount = appliedPlan.maxDiscountPerBooking;
          }
          
          discountAmount = rawDiscount;
          calculatedTotalPrice -= discountAmount;
          
          // Track savings
          currentUser.membershipVault.totalSavings += discountAmount;
          currentUser.membershipVault.savingsThisMonth += discountAmount;
          await currentUser.save();
        }
      }

      const order = new Order({
        orderItems: validatedOrderItems,
        user: req.user._id,
        shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice, // Use server-calculated price
      instructions,
      fulfillmentType
    });

    const createdOrder = await order.save();

    // Notify User
    const io = req.app.get('io');
    await createNotification(io, {
        user: req.user._id,
        title: 'Order Deployment Confirmed',
        message: `Your order #${createdOrder._id.toString().slice(-6).toUpperCase()} has been successfully processed and added to our fulfillment queue.`,
        type: 'order',
        link: '/profile'
    });

    // Fetch Admins and notify them
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await createNotification(io, {
        user: admin._id,
        title: 'New Order Received',
        message: `Strategic Alert: A new order #${createdOrder._id.toString().slice(-6).toUpperCase()} has been placed by ${req.user.firstName || 'a customer'}.`,
        type: 'order',
        link: '/admin/orders'
      });
    }

    // Identify unique products to notify vendors and update stock
    const vendorProductIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: vendorProductIds } });
    const vendorIds = new Set();
    
    for (const item of orderItems) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        const product = products.find(p => p._id.toString() === item.product.toString());
        if (product && !product.isService && product.category !== 'Membership') {
          // Decrement stock
          product.countInStock = Math.max(0, (product.countInStock || 0) - (item.qty || 1));
          if (product.countInStock === 0) {
            product.inStock = false;
          }
          await product.save();

          // Trigger Low Stock Alert if <= 5
          if (product.countInStock <= 5) {
            const ownerId = product.vendorId || product.seller;
            if (ownerId) {
              await createNotification(io, {
                user: ownerId,
                title: 'CRITICAL: Low Stock Alert',
                message: `Inventory for "${product.name}" has dropped to ${product.countInStock}. Restock immediately to prevent downtime.`,
                type: 'inventory',
                link: '/vendor/dashboard?tab=inventory'
              });
            }
          }
        }
      }
    }

    products.forEach(p => {
      if (p.vendorId) vendorIds.add(p.vendorId.toString());
      if (p.seller) vendorIds.add(p.seller.toString()); // Also check seller just in case
    });

    for (const vId of vendorIds) {
      await createNotification(io, {
        user: vId,
        title: 'New Mission Assigned (Order)',
        message: `Action Required: Your product/service has been booked in Order #${createdOrder._id.toString().slice(-6).toUpperCase()}.`,
        type: 'order',
        link: '/vendor/dashboard?tab=bookings'
      });
    }

    }

    // ─── AUTO-ASSIGNMENT LOGIC FOR DELIVERY PARTNERS ───
    // If the order contains physical products, we auto-assign an online Delivery Partner
    const physicalProducts = orderItems.filter(item => item.product && item.category !== 'Membership' && !item.name?.toLowerCase().includes('membership') && !item.isService);
    let autoAssignedPartner = null;
    
    if (physicalProducts.length > 0) {
      // Fetch available online delivery partners
      const availablePartners = await User.find({ role: 'Delivery Partner', isOnline: true });
      if (availablePartners.length > 0) {
        // Assign a random online partner (this simulates a dispatch queue)
        autoAssignedPartner = availablePartners[Math.floor(Math.random() * availablePartners.length)];
        
        createdOrder.deliveryPartner = autoAssignedPartner._id;
        createdOrder.status = 'Partner Assigned';
        await createdOrder.save();

        // Notify the newly assigned delivery partner
        await createNotification(io, {
          user: autoAssignedPartner._id,
          title: 'New Mission Auto-Assigned',
          message: `Strategic Deployment: Order #${createdOrder._id.toString().slice(-6).toUpperCase()} has been assigned to your fleet.`,
          type: 'order',
          link: '/delivery/dashboard'
        });

        // Notify the customer about the assignment
        await createNotification(io, {
          user: req.user._id,
          title: 'Delivery Partner Assigned',
          message: `Fleet Operator ${autoAssignedPartner.firstName} has been assigned to deliver your order!`,
          type: 'order',
          link: '/profile'
        });
      }
    }

    // ─── Notify relevant partners for ad-hoc services (Rides/Delivery) ───
    const adHocServices = orderItems.filter(item => item.isService && !item.product);
    if (adHocServices.length > 0) {
      // Find all partners with relevant roles
      const relevantRoles = [];
      if (adHocServices.some(s => s.name.toLowerCase().includes('ride') || s.name.toLowerCase().includes('taxi'))) {
        relevantRoles.push('Ride Provider');
      }
      if (adHocServices.some(s => s.name.toLowerCase().includes('delivery') || s.name.toLowerCase().includes('parcel'))) {
        relevantRoles.push('Delivery Partner');
      }
      if (adHocServices.some(s => s.name.toLowerCase().includes('stay') || s.name.toLowerCase().includes('pg') || s.name.toLowerCase().includes('villa'))) {
        relevantRoles.push('Stay Provider');
      }

      if (relevantRoles.length > 0) {
        const targetPartners = await User.find({ role: { $in: relevantRoles } });
        for (const partner of targetPartners) {
          await createNotification(io, {
            user: partner._id,
            title: 'New Ad-Hoc Service Alert!',
            message: `Strategic Broadcast: A new ${relevantRoles.join('/')} request #${createdOrder._id.toString().slice(-6).toUpperCase()} is available for fulfillment.`,
            type: 'order',
            link: '/delivery/dashboard' // Common entry point for service partners
          });
        }
      }
    }

    // Mark slots as unavailable if they are service bookings
    // AND Handle Membership Activation logic
    let membershipActivated = false;
    let planTier = 'None';
    let planValue = 0;

    for (const item of orderItems) {
      if (item.slot && item.slot.date && item.slot.time) {
        await Product.updateOne(
          { _id: item.product, "slots.date": item.slot.date },
          { $set: { "slots.$.isAvailable": false } }
        );
      }

      // Check if this item is a membership plan (convention: category === 'Membership')
      if (item.category === 'Membership' || item.name?.toLowerCase().includes('membership')) {
        membershipActivated = true;
        planValue = item.price;
        
        // Extract exact plan name from format "FIC <PlanName> Membership"
        const match = item.name.match(/FIC (.*) Membership/i);
        if (match && match[1]) {
          planTier = match[1];
        } else {
          // Fallback parsing
          planTier = item.name.replace(/ Membership/i, '').replace(/FIC /i, '').trim();
          if (!planTier) planTier = 'Basic';
        }
      }
    }

    if (membershipActivated) {
      const cycleStartDate = new Date();
      const cycleEndDate = new Date();
      cycleEndDate.setDate(cycleEndDate.getDate() + 30);
      
      const generatedMembershipId = req.user.membershipId || ('FIC-PLT-' + Math.floor(1000 + Math.random() * 9000));

      await User.findByIdAndUpdate(req.user._id, {
        isMember: true,
        subscriptionLevel: planTier,
        membershipId: generatedMembershipId,
        membershipVault: {
          planTier,
          planValue,
          cycleStartDate,
          cycleEndDate,
          balance: 0,
          savingsThisMonth: 0
        }
      });

      const io = req.app.get('io');
      await createNotification(io, {
        user: req.user._id,
        title: 'Membership Activated!',
        message: `Welcome to the ${planTier} tier. You now have unlimited access to platform benefits.`,
        type: 'membership',
        link: '/profile'
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Creation Failure:', error);
    const missingFields = error.errors ? Object.keys(error.errors).join(', ') : '';
    res.status(400).json({ 
      message: missingFields ? `Validation Error: Missing or invalid fields (${missingFields})` : 'Strategic Failure: Order sequence rejected by command center.', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : []
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email mobile')
    .populate('deliveryPartner', 'firstName lastName mobile')
    .populate({
      path: 'orderItems.product',
      populate: { path: 'vendorId', select: 'businessName gstNumber exactLocation' }
    });

  if (order) {
    // Security check: Only owner, Admin, deliveryPartner (driver), or Vendor of product can see order
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    const isAdminSnippet = req.user.role === 'Admin';
    const isDeliveryPartner = order.deliveryPartner && order.deliveryPartner._id.toString() === req.user._id.toString();
    const isVendorSnippet = req.user.role === 'Vendor' && order.orderItems.some(item => 
        item.product?.vendorId?.toString() === req.user._id.toString()
    );

    if (!isOwner && !isAdminSnippet && !isVendorSnippet && !isDeliveryPartner) {
        return res.status(403).json({ message: 'Access Denied: Order details restricted' });
    }

    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Security check: Only owner or Admin can pay
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Authorization Failure: Cannot process payment for another user' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    order.status = 'Paid';

    const updatedOrder = await order.save();
    
    const io = req.app.get('io');
    await createNotification(io, {
        user: order.user,
        title: 'Payment Verification Successful',
        message: `Transaction verified for Order #${order._id.toString().slice(-6).toUpperCase()}. Your service/product is now authorized for fulfillment.`,
        type: 'payment',
        link: '/track-mission'
    });

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Completed';

    const updatedOrder = await order.save();
    
    // Trigger Financial Settlement Engine
    try {
        await initializeSettlement(updatedOrder._id);
    } catch (err) {
        console.error('Settlement Initialization Failed:', err);
    }

    const io = req.app.get('io');
    await createNotification(io, {
        user: order.user,
        title: 'Mission Accomplished',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} has been marked as fully delivered/completed. Thank you for choosing Forge India Connect.`,
        type: 'delivery',
        link: '/profile'
    });

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin/Vendor)
const getOrders = async (req, res) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    let query = {};
    if (req.user.role === 'Vendor') {
      // Find orders that contain at least one product owned by this vendor
      // First, get all products belonging to this vendor
      const vendorProducts = await Product.find({ 
        $or: [
          { vendorId: req.user._id },
          { user: req.user._id },
          { seller: req.user._id }
        ] 
      }).select('_id');
      
      const productIds = vendorProducts.map(p => p._id);
      
      query = { "orderItems.product": { $in: productIds } };
    } else if (req.user.role !== 'Admin' && req.user.role !== 'Delivery Partner') {
      return res.status(403).json({ message: 'Access denied: Strategic clearance required' });
    }

    const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .populate({
      path: 'orderItems.product',
      populate: { path: 'vendorId', select: 'businessName gstNumber exactLocation' }
    })
    .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get recent orders for public activity feed
// @route   GET /api/orders/activity
// @access  Public
const getOrderActivity = async (req, res) => {
  try {
    const orders = await Order.find({})
      .select('shippingAddress.city orderItems createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Clean up data for public view
    const activity = orders.map(order => ({
      shippingAddress: {
        city: order.shippingAddress.city
      },
      orderItems: order.orderItems.map(item => ({
        name: item.name
      })),
      createdAt: order.createdAt
    }));

    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor/Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Security check: Admin, Vendor of product, or Assigned Delivery Partner
      const isVendorSnippet = req.user.role === 'Vendor' && order.orderItems.some(item => 
          item.product?.vendorId?.toString() === req.user._id.toString()
      );
      const isAssignedPartner = (req.user.role === 'Delivery Partner' || req.user.role === 'User') && order.deliveryPartner?.toString() === req.user._id.toString();
      
      if (req.user.role !== 'Admin' && !isVendorSnippet && !isAssignedPartner) {
          return res.status(403).json({ message: 'Permission Denied: Operational clearance required' });
      }

      order.status = req.body.status || order.status;
      
      // Generate OTP when Out for Delivery
      if (req.body.status === 'Out for Delivery') {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        if (!order.rideMetadata) order.rideMetadata = {};
        order.rideMetadata.otp = generatedOtp;
        
        // Notify user about the OTP
        const io = req.app.get('io');
        if (io) {
          createNotification(io, {
            user: order.user,
            title: 'Delivery OTP Generated',
            message: `Your secure PIN for delivery of Order #${order._id.toString().slice(-6).toUpperCase()} is ${generatedOtp}. Please share this with the delivery partner only upon receiving your package.`,
            type: 'Order',
            link: '/profile'
          }).catch(err => console.error('Failed to send OTP notification:', err));
        }
      }

      // OTP Verification if marking as delivered
      if (req.body.status === 'Delivered') {
         if (!order.rideMetadata?.otp) {
             return res.status(400).json({ message: 'Error: No OTP was generated for this order.' });
         }
         if (req.body.otp !== order.rideMetadata.otp) {
             return res.status(400).json({ message: 'Invalid Delivery PIN' });
         }
      }

      if (order.status === 'Delivered' || order.status === 'Completed') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Completed';
        
        // If it's a Logistics / Delivery Partner fulfillment order, handle pocket math
        if (order.fulfillmentType === 'Delivery Partner' || isAssignedPartner) {
          const platformFee = order.totalPrice * 0.2;
          const driverEarning = order.totalPrice * 0.8;
          
          let walletDelta = 0;
          if (order.paymentMethod === 'Cash' || !order.isPaid) {
            // Driver collected full cash, owes platform fee
            walletDelta = -platformFee;
          } else {
            // Platform collected money, owes driver 80%
            walletDelta = driverEarning;
          }

          await require('../models/User').findByIdAndUpdate(order.deliveryPartner, {
            $inc: { 
              walletBalance: walletDelta || 0,
              'driverStats.totalRides': 1,
              'driverStats.earningsTotal': driverEarning || 0
            }
          });
        }
      }
      const updatedOrder = await order.save();

      // Trigger Financial Settlement Engine if completed
      if (updatedOrder.status === 'Completed') {
          try {
              await initializeSettlement(updatedOrder._id);
          } catch (err) {
              console.error('Settlement Initialization Failed:', err);
          }
          
          // PREMIUM MEMBERSHIP REWARDS ENGINE
          try {
            const customer = await User.findById(updatedOrder.user).populate('membershipVault.planId');
            if (customer?.membershipVault?.status === 'Active' && customer.membershipVault.planId) {
              const plan = customer.membershipVault.planId;
              let walletUpdate = 0;
              let pointsUpdate = 0;
              
              // Calculate Cashback
              if (plan.cashbackPercentage > 0) {
                 walletUpdate = updatedOrder.totalPrice * (plan.cashbackPercentage / 100);
                 customer.membershipVault.balance += walletUpdate;
                 customer.membershipVault.cashbackEarned += walletUpdate;
              }
              
              // Calculate Points (e.g. 1 point per 100 Rs multiplied by multiplier)
              if (plan.rewardPointsMultiplier > 0) {
                 pointsUpdate = Math.floor(updatedOrder.totalPrice / 100) * plan.rewardPointsMultiplier;
                 customer.membershipVault.rewardPoints += pointsUpdate;
              }
              
              if (walletUpdate > 0 || pointsUpdate > 0) {
                await customer.save();
                // Notify User about Cashback/Points
                const io = req.app.get('io');
                if (io) {
                  await createNotification(io, {
                    user: customer._id,
                    title: 'Membership Vault Rewards Credited',
                    message: `You earned ${walletUpdate > 0 ? '₹' + walletUpdate.toFixed(2) + ' Cashback ' : ''}${pointsUpdate > 0 ? 'and ' + pointsUpdate + ' Reward Points' : ''} for your recent booking!`,
                    type: 'Wallet',
                    link: '/membership'
                  });
                }
              }
            }
          } catch (err) {
              console.error('Failed to grant membership rewards:', err);
          }
      }

      // Notify User about Status Change
      const io = req.app.get('io');
      if (io) {
        await createNotification(io, {
          user: order.user,
          title: 'Order Status Update',
          message: `Strategic Update: Your order #${order._id.toString().slice(-6).toUpperCase()} has transitioned to: ${order.status}`,
          type: 'Order',
          link: '/candidate/dashboard'
        });
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(400).json({ message: error.message || 'Server error during status update' });
  }
};

// @desc    Assign partner to order
// @route   PUT /api/orders/:id/assign
// @access  Private (Admin/Vendor)
const assignPartner = async (req, res) => {
    try {
        const { partnerId } = req.body;
        const mongoose = require('mongoose');

        if (!partnerId || !mongoose.Types.ObjectId.isValid(partnerId)) {
            return res.status(400).json({ message: 'Invalid or missing Partner Identity' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            // Security check: Only Admin, Vendor, or the Delivery Partner themselves can assign
            if (req.user.role !== 'Admin' && req.user.role !== 'Vendor' && !(req.user.role === 'Delivery Partner' && partnerId === req.user._id.toString())) {
                return res.status(403).json({ message: 'Permission Denied: Mission authorization required' });
            }

            order.deliveryPartner = partnerId;
            order.status = 'Partner Assigned';
            const updatedOrder = await order.save();

            const io = req.app.get('io');

            // Notify Candidate
            await createNotification(io, {
                user: order.user,
                title: 'Operation Specialist Assigned',
                message: `An FIC partner has been dispatched for order #${order._id.toString().slice(-6).toUpperCase()}.`,
                type: 'Order',
                link: '/candidate/dashboard'
            });

            // Notify Partner
            await createNotification(io, {
                user: partnerId,
                title: 'New Mission Protocol!',
                message: `Strategic assignment: Order #${order._id.toString().slice(-6).toUpperCase()} is now under your jurisdiction.`,
                type: 'Order',
                link: '/delivery/dashboard'
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order sequence not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Mission Control Error', error: error.message });
    }
};

// @desc    Reschedule order slot
// @route   PUT /api/orders/:id/reschedule
// @access  Private
const rescheduleOrder = async (req, res) => {
  const { newSlot } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized for this mission modification' });
    }

    // Check 12-hour window
    // We assume orderItems[0] contains the primary service slot
    const currentSlot = order.orderItems[0].slot;
    if (currentSlot && currentSlot.date) {
        const slotDateTime = new Date(`${currentSlot.date} ${currentSlot.time.split(' - ')[0]}`);
        const now = new Date();
        const diffInHours = (slotDateTime - now) / (1000 * 60 * 60);

        if (diffInHours < 12) {
            return res.status(400).json({ message: 'Rescheduling denied: Must be requested >12 hours before execution window' });
        }
    }

    // Capture previous slot for audit
    order.previousSlot = currentSlot;
    order.orderItems[0].slot = newSlot;
    order.status = 'Rescheduled';
    order.rescheduledAt = Date.now();

    const updatedOrder = await order.save();

    // Re-mark slots in Product model
    // 1. Release old slot
    if (currentSlot && currentSlot.date) {
        await Product.updateOne(
            { _id: order.orderItems[0].product, "slots.date": currentSlot.date },
            { $set: { "slots.$.isAvailable": true } }
        );
    }
    // 2. Occupy new slot
    if (newSlot && newSlot.date) {
        await Product.updateOne(
            { _id: order.orderItems[0].product, "slots.date": newSlot.date },
            { $set: { "slots.$.isAvailable": false } }
        );
    }

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized for cancellation' });
    }

    if (order.status === 'Delivered' || order.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot cancel a completed or delivered order' });
    }

    if (order.status === 'Cancelled' || order.status === 'Refund Processing') {
        return res.status(400).json({ message: 'Order is already cancelled' });
    }

    const { reason } = req.body;
    const previousStatus = order.status;
    order.status = order.isPaid ? 'Refund Processing' : 'Cancelled';
    if (reason) order.cancellationReason = reason;

    const updatedOrder = await order.save();

    // Release slots in Product model
    for (const item of order.orderItems) {
      if (item.slot && item.slot.date) {
        await Product.updateOne(
            { _id: item.product, "slots.date": item.slot.date },
            { $set: { "slots.$.isAvailable": true } }
        );
      }
    }

    const io = req.app.get('io');
    
    // Notify User
    await createNotification(io, {
        user: order.user,
        title: order.isPaid ? 'Refund Initiated' : 'Order Cancelled',
        message: order.isPaid 
            ? `Order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled. Refund processing has started.`
            : `Order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled successfully.`,
        type: 'order',
        link: '/profile'
    });

    // Notify Admins
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
      await createNotification(io, {
        user: admin._id,
        title: 'Order Cancelled Alert',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} was cancelled. Reason: ${reason || 'Not specified'}.${order.isPaid ? ' Requires refund.' : ''}`,
        type: 'order',
        link: '/admin/orders'
      });
    }

    // Notify Vendors
    const productIds = order.orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const vendorIds = new Set();
    products.forEach(p => {
      if (p.vendorId) vendorIds.add(p.vendorId.toString());
      if (p.seller) vendorIds.add(p.seller.toString());
    });

    for (const vId of vendorIds) {
      await createNotification(io, {
        user: vId,
        title: 'Mission Aborted (Order Cancelled)',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled. Reason: ${reason || 'Not specified'}. Release resources.`,
        type: 'order',
        link: '/vendor/orders'
      });
    }

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get partner orders
// @route   GET /api/orders/partner/me
// @access  Private/Partner
const getPartnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id })
      .populate('user', 'id firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching partner orders' });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor/me
// @access  Private/Vendor
const getVendorOrders = async (req, res) => {
  try {
    const vendorProducts = await Product.find({ 
      $or: [
        { vendorId: req.user._id },
        { user: req.user._id },
        { seller: req.user._id }
      ] 
    }).select('_id');
    const productIds = vendorProducts.map(p => p._id);

    const orders = await Order.find({ 
      "orderItems.product": { $in: productIds }
    })
      .populate('user', 'id firstName lastName email')
      .populate({
        path: 'orderItems.product',
        select: 'name price image vendorId'
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching vendor orders' });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount) return res.status(400).json({ message: 'Amount is required' });

      const options = {
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);

      // Generate fallback payment link
      const user = req.user;
      let paymentLink = null;
      try {
        const pLink = await razorpay.paymentLink.create({
          amount: amount * 100,
          currency: "INR",
          accept_partial: false,
          description: `Product Purchase`,
          customer: {
            name: user ? user.firstName || 'User' : 'User',
            email: user ? user.email : 'test@example.com',
            contact: user ? user.mobile || '9999999999' : '9999999999'
          },
          notify: { sms: false, email: false },
          reminder_enable: false,
        });
        paymentLink = pLink.short_url;
      } catch(e) {
        console.warn('Failed to generate product payment link', e);
      }

      res.json({
        orderId: order.id,
        paymentLink,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // @desc    Request a return for a delivered order
  // @route   PUT /api/orders/:id/return
  // @access  Private
  const requestReturn = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (order) {
        if (order.status !== 'Delivered') {
          return res.status(400).json({ message: 'Only delivered orders can be returned' });
        }
        if (order.user.toString() !== req.user._id.toString()) {
           return res.status(401).json({ message: 'Not authorized' });
        }

        order.status = 'Return Requested';
        order.returnReason = req.body.reason || 'No reason provided';
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// @desc    Track public order status by ID
// @route   GET /api/orders/:id/track
// @access  Public
const trackOrderById = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Mission Sequence' });
    }

    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name image price')
      .select('-paymentResult -user'); // EXCLUDE sensitive info like user object and payment details

    if (order) {
      // Only return safe tracking details
      res.json(order);
    } else {
      res.status(404).json({ message: 'Mission Sequence not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  getOrderActivity,
  assignPartner,
  rescheduleOrder,
  cancelOrder,
  getPartnerOrders,
  getVendorOrders,
  deleteOrder,
  updateOrder,
  createRazorpayOrder,
  requestReturn,
  trackOrderById
};
