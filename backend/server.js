import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import { getDeals, getBestsellers } from './controllers/adminController.js';
import { getRecommendations } from './controllers/recommendationController.js';
import { trackBehavior } from './controllers/behaviorController.js';
import { googleFirebase } from './controllers/authController.js';
import { authUser } from './middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean), credentials: true }));
app.use(express.json());


app.use('/api/user', userRoutes);
// Firebase Google
app.post('/api/auth/google/firebase', googleFirebase);app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/return', returnRoutes);
app.use('/api/support', supportRoutes);
app.get('/api/deals', getDeals);
app.get('/api/bestsellers', getBestsellers);
app.get('/api/recommendations', (req, res, next) => {
    const { token } = req.headers;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
        } catch {}
    }
    next();
}, getRecommendations);
app.post('/api/behavior', authUser, trackBehavior);

app.get('/', (req, res) => res.send('KALAKRITI API running'));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
