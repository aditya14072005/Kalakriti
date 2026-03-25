import express from 'express';
import { getStats, getAllUsers, updateUserRole, deleteUser, getAllOrders, updateOrderStatus, deleteOrder, getAllProducts, deleteProduct, createUser, getVendorRequests, approveVendorRequest, rejectVendorRequest } from '../controllers/adminController.js';
import { authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authAdmin, getStats);
router.get('/users', authAdmin, getAllUsers);
router.post('/user/role', authAdmin, updateUserRole);
router.delete('/user/delete', authAdmin, deleteUser);
router.get('/orders', authAdmin, getAllOrders);
router.post('/order/status', authAdmin, updateOrderStatus);
router.delete('/order/delete', authAdmin, deleteOrder);
router.get('/products', authAdmin, getAllProducts);
router.delete('/product/delete', authAdmin, deleteProduct);
router.post('/create', authAdmin, createUser);
router.get('/vendor-requests', authAdmin, getVendorRequests);
router.post('/vendor-request/approve', authAdmin, approveVendorRequest);
router.post('/vendor-request/reject', authAdmin, rejectVendorRequest);

export default router;
