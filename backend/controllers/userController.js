import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const createToken = (id, role, name) => {
    return jwt.sign({ id, role, name }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
        res.json({ success: true, token: createToken(user._id, 'customer', user.name), role: 'customer' });
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
        res.json({ success: true, token: createToken(user._id, user.role, user.name), role: user.role });
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
        res.json({ success: true, token: createToken(user._id, 'vendor', user.name), role: 'vendor' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/user/profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        if (!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/update-profile
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) return res.json({ success: false, message: 'Name is required' });
        await userModel.findByIdAndUpdate(req.userId, { name: name.trim() });
        res.json({ success: true, message: 'Profile updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/save-address
const saveAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await userModel.findById(req.userId);
        const addresses = user.addresses || [];
        addresses.push({ ...address, id: Date.now().toString() });
        await userModel.findByIdAndUpdate(req.userId, { addresses });
        res.json({ success: true, message: 'Address saved' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/delete-address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.body;
        const user = await userModel.findById(req.userId);
        const addresses = (user.addresses || []).filter(a => a.id !== addressId);
        await userModel.findByIdAndUpdate(req.userId, { addresses });
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/vendor-request  — anyone can submit a vendor application
const submitVendorRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: 'Email is required' });
        // try to identify logged-in user from token
        let userId = null;
        const tkn = req.headers.token;
        if (tkn) {
            try { const decoded = jwt.verify(tkn, process.env.JWT_SECRET); userId = decoded.id; } catch {}
        }
        if (userId) {
            const user = await userModel.findById(userId);
            if (user) {
                if (user.role === 'vendor') return res.json({ success: false, message: 'Already a vendor' });
                if (user.vendorRequest?.status === 'pending') return res.json({ success: false, message: 'Request already submitted, awaiting approval' });
                await userModel.findByIdAndUpdate(userId, {
                    vendorRequest: { status: 'pending', data: req.body, submittedAt: new Date() }
                });
                return res.json({ success: true, message: 'Vendor request submitted! Admin will review it shortly.' });
            }
        }
        // guest: find or create by email
        const existing = await userModel.findOne({ email });
        if (existing) {
            if (existing.role === 'vendor') return res.json({ success: false, message: 'This email is already a vendor' });
            if (existing.vendorRequest?.status === 'pending') return res.json({ success: false, message: 'Request already submitted for this email' });
            await userModel.findByIdAndUpdate(existing._id, {
                vendorRequest: { status: 'pending', data: req.body, submittedAt: new Date() }
            });
        } else {
            const hashed = await bcrypt.hash('11111111', 10);
            await userModel.create({
                name: req.body.contactPerson || email,
                email,
                password: hashed,
                role: 'customer',
                vendorRequest: { status: 'pending', data: req.body, submittedAt: new Date() }
            });
            return res.json({ success: true, message: 'Vendor request submitted! Admin will review it shortly.', accountCreated: true, email });
        }
        res.json({ success: true, message: 'Vendor request submitted! Admin will review it shortly.', accountCreated: false, email });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 8) return res.json({ success: false, message: 'New password must be at least 8 characters' });
        const user = await userModel.findById(req.userId);
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.json({ success: false, message: 'Current password is incorrect' });
        const hashed = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(req.userId, { password: hashed });
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, registerVendor, getProfile, updateProfile, saveAddress, deleteAddress, submitVendorRequest, changePassword };
