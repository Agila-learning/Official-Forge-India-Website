const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { createNotification } = require('./notificationController');
const { initializeSettlement } = require('./settlementController');

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
        // If it's a valid product, validate against DB
        if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
          const product = dbProducts.find(p => p._id.toString() === item.product.toString());
          if (product) {
            const itemPrice = product.discountPrice || product.price;
            calculatedTotalPrice += itemPrice * (item.qty || 1);
            return {
              ...item,
              price: itemPrice // Force DB price
            };
          }
        }
        
        // If not found in Product DB or not a valid ObjectId, trust frontend price (for services/memberships)
        // In a real prod env, you'd validate services against a Service model here.
        calculatedTotalPrice += (item.price || 0) * (item.qty || 1);
        return item;
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

    // Identify unique products to notify vendors
    const vendorProductIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: vendorProductIds } });
    const vendorIds = new Set();
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
        link: '/vendor/orders'
      });
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
      // Note: We'd ideally fetch the product from DB to verify category, but using item data for now
      // assuming the frontend passes the correct category/flag
      if (item.category === 'Membership' || item.name?.toLowerCase().includes('membership')) {
        membershipActivated = true;
        planValue = item.price;
        if (planValue >= 5000) planTier = 'Elite';
        else if (planValue >= 2999) planTier = 'Premium';
        else if (planValue >= 999) planTier = 'Basic';
      }
    }

    if (membershipActivated) {
      const cycleStartDate = new Date();
      const cycleEndDate = new Date();
      cycleEndDate.setDate(cycleEndDate.getDate() + 30);

      await User.findByIdAndUpdate(req.user._id, {
        isMember: true,
        membershipVault: {
          planTier,
          planValue,
          cycleStartDate,
          cycleEndDate,
          balance: 0,
          savingsThisMonth: 0
        }
      });

      await createNotification(io, {
        user: req.user._id,
        title: 'Membership Activated!',
        message: `Welcome to the ${planTier} tier. You now have unlimited access to services below ₹${planValue}.`,
        type: 'membership',
        link: '/profile'
      });
    }

    res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Order Creation Failure:', error);
    res.status(400).json({ 
      message: 'Strategic Failure: Order sequence rejected by command center.', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : []
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'firstName lastName email'
  ).populate({
    path: 'orderItems.product',
    populate: { path: 'vendorId', select: 'businessName gstNumber exactLocation' }
  });

  if (order) {
    // Security check: Only owner, Admin, or Vendor of product can see order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdminSnippet = req.user.role === 'Admin';
    const isVendorSnippet = req.user.role === 'Vendor' && order.orderItems.some(item => 
        item.product?.vendorId?.toString() === req.user._id.toString()
    );

    if (!isOwner && !isAdminSnippet && !isVendorSnippet) {
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
        $or: [{ user: req.user._id }, { seller: req.user._id }] 
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
  const order = await Order.findById(req.params.id);

  if (order) {
    // Security check: Only Admin or Vendor of product can update status
    const isVendorSnippet = req.user.role === 'Vendor' && order.orderItems.some(item => 
        item.product?.vendorId?.toString() === req.user._id.toString()
    );
    
    if (req.user.role !== 'Admin' && !isVendorSnippet) {
        return res.status(403).json({ message: 'Permission Denied: Operational clearance required' });
    }

    order.status = req.body.status || order.status;
    if (order.status === 'Delivered' || order.status === 'Completed') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 'Completed';
    }
    const updatedOrder = await order.save();

    // Trigger Financial Settlement Engine if completed
    if (updatedOrder.status === 'Completed') {
        try {
            await initializeSettlement(updatedOrder._id);
        } catch (err) {
            console.error('Settlement Initialization Failed:', err);
        }
    }

    // Notify User about Status Change
    const io = req.app.get('io');
    const notification = await createNotification(io, {
      user: order.user,
      title: 'Order Status Update',
      message: `Strategic Update: Your order #${order._id.toString().slice(-6).toUpperCase()} has transitioned to: ${order.status}`,
      type: 'Order',
      link: '/candidate/dashboard'
    });

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
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
            // Security check: Only Admin can assign partners (as per FIC logic)
            if (req.user.role !== 'Admin' && req.user.role !== 'Vendor') {
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
};
