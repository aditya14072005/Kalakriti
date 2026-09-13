import supportModel from '../models/supportModel.js';
import orderModel from '../models/orderModel.js';


// POST /api/support/submit  (user)
const submitTicket = async (req, res) => {
    try {
        const { orderId, category, message } = req.body;
        const order = await orderModel.findOne({ _id: orderId, userId: req.userId });
        if (!order) return res.json({ success: false, message: 'Order not found' });
        const ticket = await supportModel.create({
            userId: req.userId, orderId, category, message,
        });
        res.json({ success: true, ticket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/support/my  (user)
const myTickets = async (req, res) => {
    try {
        const tickets = await supportModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/support/reply/user  (user replies to a ticket)
const userReply = async (req, res) => {
    try {
        const { ticketId, message } = req.body;
        const ticket = await supportModel.findOne({ _id: ticketId, userId: req.userId });
        if (!ticket) return res.json({ success: false, message: 'Ticket not found' });
        ticket.replies.push({ sender: 'user', message });
        ticket.status = 'In Progress';
        await ticket.save();
        res.json({ success: true, ticket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/support/all  (admin)
const allTickets = async (req, res) => {
    try {
        const tickets = await supportModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, tickets });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/support/reply/admin  (admin replies + optional order cancel)
const adminReply = async (req, res) => {
    try {
        const { ticketId, message, status, cancelOrder } = req.body;
        const ticket = await supportModel.findById(ticketId);
        if (!ticket) return res.json({ success: false, message: 'Ticket not found' });
        ticket.replies.push({ sender: 'admin', message });
        if (status) ticket.status = status;
        if (cancelOrder) {
            await orderModel.findByIdAndUpdate(ticket.orderId, { status: 'Cancelled' });
        }
        await ticket.save();
        res.json({ success: true, ticket });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { submitTicket, myTickets, userReply, allTickets, adminReply };
