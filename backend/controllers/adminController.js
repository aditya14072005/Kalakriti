import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';
import bcrypt from 'bcryptjs';

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [users, products, orders] = await Promise.all([
            userModel.countDocuments(),
            productModel.countDocuments(),
            orderModel.find({})
        ]);
        const revenue = orders.filter(o => o.payment).reduce((s, o) => s + o.amount, 0);
        const pending = orders.filter(o => !o.payment).length;
        res.json({ success: true, stats: { users, products, orders: orders.length, revenue, pending } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/admin/user/role
const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        await userModel.findByIdAndUpdate(userId, { role });
        res.json({ success: true, message: 'Role updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/user/delete
const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.userId);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/admin/order/status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/order/delete
const deleteOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.body.orderId);
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/admin/products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ status: 'approved' }).sort({ date: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/product/delete
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.productId);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/admin/create  — create admin/vendor account
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        await userModel.create({ name, email, password: hashed, role });
        res.json({ success: true, message: `${role} account created` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getStats, getAllUsers, updateUserRole, deleteUser, getAllOrders, updateOrderStatus, deleteOrder, getAllProducts, deleteProduct, createUser };
