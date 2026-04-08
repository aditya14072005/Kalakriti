import express from 'express';
import { submitReturn, myReturns, vendorReturns, allReturns, updateReturn, updateStock } from '../controllers/returnController.js';
import { authUser, authVendor, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', authUser, submitReturn);
router.get('/my', authUser, myReturns);
router.get('/vendor', authVendor, vendorReturns);
router.get('/all', authAdmin, allReturns);
router.post('/update', authVendor, updateReturn);
router.post('/stock', authVendor, updateStock);

export default router;
