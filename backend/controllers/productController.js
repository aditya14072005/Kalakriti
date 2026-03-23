import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'kalakriti' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const handleImageUpload = async (files) => {
    if (!files || Object.keys(files).length === 0) return [];
    return Promise.all(Object.values(files).flat().map(f => uploadToCloudinary(f.buffer)));
};

// POST /api/product/add  (vendor only) — direct add, approved immediately
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const imageUrls = await handleImageUpload(req.files);
        const product = await productModel.create({
            name, description,
            price: Number(price),
            category, subCategory,
            sizes: sizes ? JSON.parse(sizes) : [],
            bestseller: bestseller === 'true',
            image: imageUrls,
            date: Date.now(),
            status: 'approved',
            vendorId: req.userId,
        });
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/product/submit  (vendor) — submit for admin approval
const submitProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const imageUrls = await handleImageUpload(req.files);
        const vendor = await userModel.findById(req.userId).select('name');
        const product = await productModel.create({
            name, description,
            price: Number(price),
            category, subCategory,
            sizes: sizes ? JSON.parse(sizes) : [],
            bestseller: bestseller === 'true',
            image: imageUrls,
            date: Date.now(),
            status: 'pending',
            vendorId: req.userId.toString(),
            vendorName: vendor?.name || '',
        });
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/product/pending  (vendor sees own, admin sees all)
const getPendingProducts = async (req, res) => {
    try {
        const filter = req.role === 'admin'
            ? { status: 'pending' }
            : { status: 'pending', vendorId: req.userId.toString() };
        const products = await productModel.find(filter);
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/product/approve  (admin only)
const approveProduct = async (req, res) => {
    try {
        await productModel.findByIdAndUpdate(req.body.productId, { status: 'approved' });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/product/reject  (admin only)
const rejectProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.productId);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// DELETE /api/product/remove  (vendor only)
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Product removed' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/product/list  — only approved products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({ status: 'approved' });
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/product/single/:id
const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json({ success: true, product });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, submitProduct, getPendingProducts, approveProduct, rejectProduct, removeProduct, listProducts, getSingleProduct };
