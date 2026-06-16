const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderActivity,
  updateOrderStatus,
  assignPartner,
  rescheduleOrder,
  cancelOrder,
  deleteOrder,
  updateOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/activity').get(getOrderActivity);
router.route('/config/razorpay').post(protect, require('../controllers/orderController').createRazorpayOrder);
router.route('/').post(protect, addOrderItems).get(protect, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/partner/me').get(protect, require('../controllers/orderController').getPartnerOrders);
router.route('/vendor/me').get(protect, require('../controllers/orderController').getVendorOrders);
router.route('/:id/track').get(require('../controllers/orderController').trackOrderById);
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder)
  .put(protect, admin, updateOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/:id/assign').put(protect, assignPartner);
router.route('/:id/reschedule').put(protect, rescheduleOrder);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/return').put(protect, require('../controllers/orderController').requestReturn);

module.exports = router;
