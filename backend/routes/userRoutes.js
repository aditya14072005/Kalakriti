import express from 'express';
import { registerUser, loginUser, registerVendor, getProfile, updateProfile, saveAddress, deleteAddress, submitVendorRequest, changePassword } from '../controllers/userController.js';
import { authUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/register-vendor', registerVendor);
router.get('/profile', authUser, getProfile);
router.post('/update-profile', authUser, updateProfile);
router.post('/save-address', authUser, saveAddress);
router.post('/delete-address', authUser, deleteAddress);
router.post('/vendor-request', submitVendorRequest);
router.post('/change-password', authUser, changePassword);

export default router;
