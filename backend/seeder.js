// Run this once to seed products into MongoDB:  node seeder.js
import 'dotenv/config';
import mongoose from 'mongoose';
import productModel from './models/productModel.js';

const products = [
    { name: "Women Short Kurti", description: "A stylish and breathable women's short kurti.", price: 300, image: ["https://via.placeholder.com/400x500?text=p_img1"], category: "Women", subCategory: "Kurtiwear", sizes: ["S","M","L"], date: 1716634345448, bestseller: true },
    { name: "Women Long Kurti", description: "A graceful women's long kurti.", price: 500, image: ["https://via.placeholder.com/400x500?text=p_img2"], category: "Women", subCategory: "Kurtiwear", sizes: ["S","M","L"], date: 1716621345448, bestseller: true },
    { name: "Women Kurta Set", description: "A beautifully designed women's kurta set.", price: 750, image: ["https://via.placeholder.com/400x500?text=p_img3"], category: "Women", subCategory: "Kurtiwear", sizes: ["S","M","L"], date: 1716234545448, bestseller: true },
    { name: "Women Authentic Saree", description: "A timeless symbol of Indian tradition.", price: 990, image: ["https://via.placeholder.com/400x500?text=p_img4"], category: "Women", subCategory: "SareeWear", sizes: ["S","M","L","XL"], date: 1716621345448, bestseller: true },
    { name: "Women Indo-Western Dress", description: "A stunning blend of Indian tradition and contemporary fashion.", price: 1350, image: ["https://via.placeholder.com/400x500?text=p_img5"], category: "Women", subCategory: "WesternWear", sizes: ["S","M","L","XL"], date: 1716622345448, bestseller: true },
];

const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await productModel.deleteMany({});
    await productModel.insertMany(products);
    console.log('✅ Seeded', products.length, 'products');
    process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
