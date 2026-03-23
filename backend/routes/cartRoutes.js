import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import { authUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authUser, addToCart);
router.post('/update', authUser, updateCart);
router.post('/get', authUser, getUserCart);

export default router;
