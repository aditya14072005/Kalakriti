import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    type: { type: String, enum: ['return', 'exchange'], required: true },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    items: { type: Array, required: true }, // items from the order
    vendorId: { type: String, default: null },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
    adminNote: { type: String, default: '' },
}, { timestamps: true });

const returnModel = mongoose.models.return || mongoose.model('return', returnSchema);
export default returnModel;
