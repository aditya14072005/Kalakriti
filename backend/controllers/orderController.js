import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const clearCart = async (userId) => {
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
};

// POST /api/order/place  (COD)
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;
        await orderModel.create({ userId, items, amount, address, paymentMethod: 'COD', payment: false, date: Date.now() });
        await clearCart(userId);
        res.json({ success: true, message: 'Order placed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/stripe
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;
        const { origin } = req.headers;

        const order = await orderModel.create({ userId, items, amount, address, paymentMethod: 'Stripe', payment: false, date: Date.now() });

        const line_items = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: { name: 'Delivery Fee' },
                unit_amount: 1000,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;
        const order = await orderModel.create({ userId, items, amount, address, paymentMethod: 'Razorpay', payment: false, date: Date.now() });

        const options = { amount: amount * 100, currency: 'INR', receipt: order._id.toString() };
        const razorpayOrder = await razorpay.orders.create(options);

        res.json({ success: true, razorpayOrder });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/verifyRazorpay
const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await clearCart(userId);
            res.json({ success: true, message: 'Payment successful' });
        } else {
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/verifyStripe
const verifyStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId, success } = req.body;
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await clearCart(userId);
            res.json({ success: true, message: 'Payment successful' });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/userorders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/order/list  (vendor - all orders)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/order/status  (vendor - update status)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, verifyRazorpay, verifyStripe, userOrders, allOrders, updateStatus };
