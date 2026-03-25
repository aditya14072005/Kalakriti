import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';
import bcrypt from 'bcryptjs';

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [users, allProducts, orders] = await Promise.all([
            userModel.countDocuments(),
            productModel.find({}).select('status').lean(),
            orderModel.find({})
        ]);
        const revenue = orders.filter(o => o.payment).reduce((s, o) => s + o.amount, 0);
        const pending = orders.filter(o => !o.payment).length;
        const products = allProducts.length;
        const approvedProducts = allProducts.filter(p => p.status === 'approved').length;
        const pendingProducts = allProducts.filter(p => p.status === 'pending').length;
        const rejectedProducts = allProducts.filter(p => p.status === 'rejected').length;
        res.json({ success: true, stats: { users, products, approvedProducts, pendingProducts, rejectedProducts, orders: orders.length, revenue, pending } });
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
        const { userId } = req.body;
        await productModel.deleteMany({ vendorId: userId.toString() });
        await userModel.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User and their products deleted' });
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

// GET /api/admin/vendor-requests
const getVendorRequests = async (req, res) => {
    try {
        const users = await userModel.find({ 'vendorRequest.status': 'pending' }).select('-password').lean();
        res.json({ success: true, requests: users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/admin/vendor-request/approve
const approveVendorRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        if (user.password && user.password.length > 0) {
            // Existing account — just promote to vendor
            await userModel.findByIdAndUpdate(userId, { role: 'vendor', 'vendorRequest.status': 'approved' });
        } else {
            // Guest submission — create a fresh vendor account with default password
            const existing = await userModel.findOne({ email: user.email, _id: { $ne: userId } });
            if (existing) {
                // A real account already exists for this email, promote that one
                await userModel.findByIdAndUpdate(existing._id, { role: 'vendor', 'vendorRequest.status': 'approved', vendorRequest: user.vendorRequest });
            } else {
                const hashed = await bcrypt.hash('11111111', 10);
                await userModel.create({
                    name: user.vendorRequest?.data?.contactPerson || user.name,
                    email: user.email,
                    password: hashed,
                    role: 'vendor',
                    vendorRequest: { ...user.vendorRequest?.toObject?.() ?? user.vendorRequest, status: 'approved' }
                });
            }
            // Remove the placeholder guest record
            await userModel.findByIdAndDelete(userId);
        }
        res.json({ success: true, message: 'Vendor approved. Default password: 11111111' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/admin/vendor-request/reject
const rejectVendorRequest = async (req, res) => {
    try {
        const { userId, reason } = req.body;
        await userModel.findByIdAndUpdate(userId, { 'vendorRequest.status': 'rejected', 'vendorRequest.reason': reason || 'Not approved' });
        res.json({ success: true, message: 'Request rejected' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getStats, getAllUsers, updateUserRole, deleteUser, getAllOrders, updateOrderStatus, deleteOrder, getAllProducts, deleteProduct, createUser, getVendorRequests, approveVendorRequest, rejectVendorRequest };
