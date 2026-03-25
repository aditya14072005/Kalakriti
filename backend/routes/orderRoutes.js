import express from 'express';
import { placeOrder, placeOrderStripe, placeOrderRazorpay, verifyRazorpay, verifyStripe, userOrders, allOrders, updateStatus, vendorOrders, updateOrderStatus, updatePayment } from '../controllers/orderController.js';
import { authUser, authVendor, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/place', authUser, placeOrder);
router.post('/stripe', authUser, placeOrderStripe);
router.post('/razorpay', authUser, placeOrderRazorpay);
router.post('/verifyStripe', authUser, verifyStripe);
router.post('/verifyRazorpay', authUser, verifyRazorpay);
router.post('/userorders', authUser, userOrders);

// Vendor routes
router.get('/list', authVendor, allOrders);
router.post('/status', authVendor, updateStatus);
router.get('/vendor-orders', authVendor, vendorOrders);
router.put('/update-status', authVendor, updateOrderStatus);

// Admin routes
router.post('/update-payment', authAdmin, updatePayment);

export default router;
