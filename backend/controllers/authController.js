import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { adminAuth } from '../config/firebase.js';

const createToken = (id, role, name) =>
    jwt.sign({ id, role, name }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/google/firebase
const googleFirebase = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.json({ success: false, message: 'No token provided' });

        const decoded = await adminAuth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decoded;

        let user = await userModel.findOne({ googleId: uid });
        if (!user) {
            user = email ? await userModel.findOne({ email }) : null;
            if (user) {
                user.googleId = uid;
                if (!user.avatar) user.avatar = picture;
                await user.save();
            } else {
                user = await userModel.create({
                    name: name || `User${uid.slice(-4)}`,
                    email: email || null,
                    googleId: uid,
                    avatar: picture || null,
                    password: null,
                    role: 'customer',
                });
            }
        }

        res.json({ success: true, token: createToken(user._id, user.role, user.name), role: user.role });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { googleFirebase };
