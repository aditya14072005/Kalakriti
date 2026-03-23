import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/user/register  (customers only)
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!validator.isEmail(email)) return res.json({ success: false, message: 'Invalid email' });
        if (password.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' });
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashed, role: 'customer' });
        res.json({ success: true, token: createToken(user._id, 'customer'), role: 'customer' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/login  (all roles)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ success: false, message: 'Invalid credentials' });
        res.json({ success: true, token: createToken(user._id, user.role), role: user.role });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/register-vendor  (vendor registration)
const registerVendor = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!validator.isEmail(email)) return res.json({ success: false, message: 'Invalid email' });
        if (password.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' });
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: 'Email already registered' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashed, role: 'vendor' });
        res.json({ success: true, token: createToken(user._id, 'vendor'), role: 'vendor' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, registerVendor };
