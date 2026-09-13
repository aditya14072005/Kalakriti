import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'admin'], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const supportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    category: { type: String, required: true }, // 'Cancel Order', 'Wrong Item', etc.
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    replies: { type: [replySchema], default: [] },
}, { timestamps: true });

const supportModel = mongoose.models.support || mongoose.model('support', supportSchema);
export default supportModel;
