import express from 'express';
import { submitTicket, myTickets, userReply, allTickets, adminReply } from '../controllers/supportController.js';
import { authUser, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', authUser, submitTicket);
router.get('/my', authUser, myTickets);
router.post('/reply/user', authUser, userReply);
router.get('/all', authAdmin, allTickets);
router.post('/reply/admin', authAdmin, adminReply);

export default router;
