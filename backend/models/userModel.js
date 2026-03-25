import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    addresses: { type: Array, default: [] },
    vendorRequest: { type: Object, default: null }, // { status: 'pending'|'approved'|'rejected', data: {...}, submittedAt, reason }
}, { timestamps: true, minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
