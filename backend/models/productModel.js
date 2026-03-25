import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, default: [] },
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    vendorId: { type: String, default: null },
    vendorName: { type: String, default: null },
    rejectReason: { type: String, default: null },
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);
export default productModel;
