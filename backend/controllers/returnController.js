import returnModel from '../models/returnModel.js';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';

// POST /api/return/submit  (customer)
const submitReturn = async (req, res) => {
    try {
        const { orderId, type, reason, details } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: 'Order not found' });
        if (order.userId !== req.userId.toString()) return res.json({ success: false, message: 'Unauthorized' });
        if (order.status !== 'Delivered') return res.json({ success: false, message: 'Only delivered orders can be returned' });

        const existing = await returnModel.findOne({ orderId, userId: req.userId });
        if (existing) return res.json({ success: false, message: 'Return request already submitted for this order' });

        const vendorId = order.items?.[0]?.vendorId || null;
        const request = await returnModel.create({
            userId: req.userId, orderId, type, reason, details,
            items: order.items, vendorId,
        });
        res.json({ success: true, request });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/return/my  (customer)
const myReturns = async (req, res) => {
    try {
        const requests = await returnModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/return/vendor  (vendor)
const vendorReturns = async (req, res) => {
    try {
        const requests = await returnModel.find({ vendorId: req.userId.toString() }).sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/return/all  (admin)
const allReturns = async (req, res) => {
    try {
        const requests = await returnModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/return/update  (admin or vendor)
const updateReturn = async (req, res) => {
    try {
        const { requestId, status, adminNote } = req.body;
        await returnModel.findByIdAndUpdate(requestId, { status, adminNote: adminNote || '' });
        res.json({ success: true, message: 'Return status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/return/stock  (vendor or admin — update product stock)
const updateStock = async (req, res) => {
    try {
        const { productId, stock } = req.body;
        const product = await productModel.findById(productId);
        if (!product) return res.json({ success: false, message: 'Product not found' });
        if (req.role === 'vendor' && product.vendorId !== req.userId.toString())
            return res.json({ success: false, message: 'Unauthorized' });
        await productModel.findByIdAndUpdate(productId, { stock: Number(stock) });
        res.json({ success: true, message: 'Stock updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { submitReturn, myReturns, vendorReturns, allReturns, updateReturn, updateStock };
