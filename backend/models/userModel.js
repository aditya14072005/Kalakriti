import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true, default: null },
    password: { type: String, default: null },
    googleId: { type: String, sparse: true, unique: true, default: null },
    avatar: { type: String, default: null },
    cartData: { type: Object, default: {} },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    addresses: { type: Array, default: [] },
    vendorRequest: { type: Object, default: null },
}, { timestamps: true, minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
