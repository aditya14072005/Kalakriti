import express from 'express';
import { registerUser, loginUser, registerVendor } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/register-vendor', registerVendor);

export default router;
