import express from 'express';
import { addProduct, submitProduct, getPendingProducts, approveProduct, rejectProduct, removeProduct, listProducts, getSingleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { authVendor, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const imgUpload = upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }]);

router.post('/add', authVendor, imgUpload, addProduct);
router.post('/submit', authVendor, imgUpload, submitProduct);
router.get('/pending', authVendor, getPendingProducts);
router.post('/approve', authAdmin, approveProduct);
router.post('/reject', authAdmin, rejectProduct);
router.delete('/remove', authVendor, removeProduct);
router.get('/list', listProducts);
router.get('/single/:id', getSingleProduct);

export default router;
