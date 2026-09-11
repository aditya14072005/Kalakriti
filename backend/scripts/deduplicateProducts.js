/**
 * One-time script: removes duplicate products from MongoDB.
 * Keeps the doc that has a Cloudinary image; if both/neither do, keeps the latest (_id is newer).
 *
 * Run from backend folder:
 *   node scripts/deduplicateProducts.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB connected');

const productModel = (await import('../models/productModel.js')).default;

const all = await productModel.find({}).lean();
console.log(`Total products: ${all.length}`);

// Group by name (case-insensitive trim)
const groups = {};
for (const p of all) {
    const key = p.name.trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
}

let deleted = 0;
for (const [name, docs] of Object.entries(groups)) {
    if (docs.length === 1) continue;

    // Sort: prefer Cloudinary image, then newest _id
    docs.sort((a, b) => {
        const aCloud = a.image?.[0]?.includes('cloudinary') ? 1 : 0;
        const bCloud = b.image?.[0]?.includes('cloudinary') ? 1 : 0;
        if (bCloud !== aCloud) return bCloud - aCloud;
        return b._id.toString() > a._id.toString() ? 1 : -1;
    });

    const [keep, ...remove] = docs;
    const removeIds = remove.map(d => d._id);
    await productModel.deleteMany({ _id: { $in: removeIds } });
    console.log(`"${keep.name}" — kept 1, removed ${remove.length}`);
    deleted += remove.length;
}

console.log(`\nDone. Removed ${deleted} duplicate(s).`);
await mongoose.disconnect();
