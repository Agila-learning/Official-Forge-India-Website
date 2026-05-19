const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Settlement = require('../models/Settlement');
const Transaction = require('../models/Transaction');
const { createPayout } = require('../utils/razorpay');
const { createNotification } = require('./notificationController');

/**
 * @desc    Initialize Settlement for a completed order
 * @access  Internal/Admin
 */
const initializeSettlement = async (orderId, bookingId = null) => {
    let sourceDoc = null;
    let isBooking = false;

    if (bookingId) {
        sourceDoc = await require('../models/Booking').findById(bookingId);
        isBooking = true;
    } else {
        sourceDoc = await Order.findById(orderId).populate('orderItems.product');
    }

    if (!sourceDoc || sourceDoc.status !== 'Completed') return;

    // Group items by vendor
    const vendorSales = {};
    if (isBooking) {
        // Bookings are typically assigned to a specific professional/vendor
        // Need to add vendor reference to Booking schema in the future if missing, assuming it's available or handled differently
        // For now, if we don't have a vendor directly on booking, we might skip or assign to system
    } else {
        for (const item of sourceDoc.orderItems) {
            const vendorId = item.product?.vendorId || item.product?.seller;
            if (!vendorId) continue;
            
            const vIdStr = vendorId.toString();
            if (!vendorSales[vIdStr]) {
                vendorSales[vIdStr] = { amount: 0, commission: 0 };
            }
            
            const itemTotal = item.price * item.qty;
            const commissionRate = 0.10; 
            const commission = itemTotal * commissionRate;
            
            vendorSales[vIdStr].amount += (itemTotal - commission);
            vendorSales[vIdStr].commission += commission;
        }
    }

    for (const [vendorId, data] of Object.entries(vendorSales)) {
        const query = isBooking ? { booking: bookingId, vendor: vendorId } : { order: orderId, vendor: vendorId };
        const existing = await Settlement.findOne(query);
        if (existing) continue;

        await Settlement.create({
            vendor: vendorId,
            order: orderId || undefined,
            booking: bookingId || undefined,
            amount: data.amount,
            totalRevenue: data.amount + data.commission,
            commission: data.commission,
            status: 'Pending'
        });
    }

    sourceDoc.settlementStatus = 'Pending';
    await sourceDoc.save();
};

/**
 * @desc    Approve and Trigger Payout
 * @route   POST /api/settlements/approve/:id
 * @access  Private/Admin
 */
const approveSettlement = asyncHandler(async (req, res) => {
    const settlement = await Settlement.findById(req.params.id).populate('vendor');
    
    if (!settlement) {
        res.status(404);
        throw new Error('Settlement record not found');
    }

    if (settlement.status !== 'Pending') {
        res.status(400);
        throw new Error('Settlement is not in pending state');
    }

    const vendor = settlement.vendor;
    if (!vendor.razorpayFundAccountId) {
        res.status(400);
        throw new Error('Vendor has not linked a fund account for payouts');
    }

    try {
        settlement.status = 'Processing';
        await settlement.save();

        const payout = await createPayout({
            fundAccountId: vendor.razorpayFundAccountId,
            amount: settlement.amount,
            referenceId: `SETTLE_${settlement._id.toString().slice(-8)}`,
            notes: {
                orderId: settlement.order.toString(),
                vendorId: vendor._id.toString()
            }
        });

        settlement.status = 'Settled';
        settlement.payoutId = payout.id;
        settlement.processedAt = Date.now();
        await settlement.save();

        // Create Transaction record for audit
        await Transaction.create({
            user: vendor._id,
            order: settlement.order,
            type: 'Payout',
            amount: settlement.amount,
            status: 'Success',
            gatewayId: payout.id,
            description: `Marketplace settlement for Order #${settlement.order.toString().slice(-6)}`
        });

        // Update Order settlement status if all related settlements are done
        const remaining = await Settlement.countDocuments({ order: settlement.order, status: { $ne: 'Settled' } });
        if (remaining === 0) {
            await Order.findByIdAndUpdate(settlement.order, { settlementStatus: 'Settled', status: 'Settled' });
        }

        res.json({ success: true, settlement });
    } catch (error) {
        settlement.status = 'Failed';
        settlement.failureReason = error.message;
        await settlement.save();
        
        res.status(500);
        throw new Error(`Payout Failed: ${error.message}`);
    }
});

/**
 * @desc    Get Pending Settlements
 * @route   GET /api/settlements/pending
 * @access  Private/Admin
 */
const getPendingSettlements = asyncHandler(async (req, res) => {
    const settlements = await Settlement.find({ status: 'Pending' })
        .populate('vendor', 'firstName lastName businessName email bankDetails')
        .populate('order', 'totalPrice createdAt status')
        .sort({ createdAt: -1 });
    res.json(settlements);
});

/**
 * @desc    Get Vendor Settlement History
 * @route   GET /api/settlements/vendor
 * @access  Private/Vendor
 */
const getVendorSettlements = asyncHandler(async (req, res) => {
    const settlements = await Settlement.find({ vendor: req.user._id })
        .populate('order', 'totalPrice createdAt status')
        .sort({ createdAt: -1 });
    res.json(settlements);
});

module.exports = {
    initializeSettlement,
    approveSettlement,
    getPendingSettlements,
    getVendorSettlements
};
