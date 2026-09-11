import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';
import behaviorModel from '../models/behaviorModel.js';

// GET /api/recommendations  (auth optional — works for guests too via viewedIds)
// Query params: viewedIds (comma-separated), limit (default 10)
const getRecommendations = async (req, res) => {
    try {
        const userId = req.userId || null;
        const viewedIds = req.query.viewedIds ? req.query.viewedIds.split(',').filter(id => /^[a-f\d]{24}$/i.test(id)) : [];
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        // --- gather signals ---
        const categoryScore = {};   // category -> score
        const subCategoryScore = {}; // subCategory -> score
        const excludeIds = new Set(viewedIds); // exclude already-viewed

        // Signal 1: recently viewed products -> boost their category/subCategory
        if (viewedIds.length) {
            const viewed = await productModel.find({ _id: { $in: viewedIds }, status: 'approved' }).select('category subCategory').lean();
            viewed.forEach(p => {
                categoryScore[p.category] = (categoryScore[p.category] || 0) + 2;
                if (p.subCategory) subCategoryScore[p.subCategory] = (subCategoryScore[p.subCategory] || 0) + 3;
            });
        }

        // Signal 2: order history (logged-in users)
        if (userId) {
            const orders = await orderModel.find({ userId, payment: true }).lean();
            const orderedProductIds = [];
            orders.forEach(order => {
                order.items?.forEach(item => {
                    const pid = item._id?.toString();
                    if (pid && /^[a-f\d]{24}$/i.test(pid)) {
                        orderedProductIds.push(pid);
                        excludeIds.add(pid);
                    }
                });
            });
            if (orderedProductIds.length) {
                const orderedProducts = await productModel.find({ _id: { $in: orderedProductIds } }).select('category subCategory').lean();
                orderedProducts.forEach(p => {
                    categoryScore[p.category] = (categoryScore[p.category] || 0) + 5;
                    if (p.subCategory) subCategoryScore[p.subCategory] = (subCategoryScore[p.subCategory] || 0) + 4;
                });
            }

            // Signal 3: cart items
            const userModel = (await import('../models/userModel.js')).default;
            const user = await userModel.findById(userId).select('cartData').lean();
            if (user?.cartData) {
                const cartIds = Object.keys(user.cartData).filter(id => /^[a-f\d]{24}$/i.test(id));
                if (cartIds.length) {
                    const cartProducts = await productModel.find({ _id: { $in: cartIds } }).select('category subCategory').lean();
                    cartProducts.forEach(p => {
                        categoryScore[p.category] = (categoryScore[p.category] || 0) + 3;
                        if (p.subCategory) subCategoryScore[p.subCategory] = (subCategoryScore[p.subCategory] || 0) + 4;
                    });
                }
            }
        }

        // Signal 4: stored behavior (category clicks, search, time spent)
        if (userId) {
            const behavior = await behaviorModel.findOne({ userId }).lean();
            if (behavior) {
                // category clicks
                if (behavior.categoryClicks) {
                    for (const [cat, count] of Object.entries(behavior.categoryClicks)) {
                        categoryScore[cat] = (categoryScore[cat] || 0) + Math.min(count, 10) * 1.5;
                    }
                }
                // subCategory clicks
                if (behavior.subCategoryClicks) {
                    for (const [sub, count] of Object.entries(behavior.subCategoryClicks)) {
                        subCategoryScore[sub] = (subCategoryScore[sub] || 0) + Math.min(count, 10) * 2;
                    }
                }
                // time spent on products — boost their category
                if (behavior.timeSpent) {
                    const spentIds = Object.keys(behavior.timeSpent).filter(id => /^[a-f\d]{24}$/i.test(id));
                    if (spentIds.length) {
                        const spentProducts = await productModel.find({ _id: { $in: spentIds } }).select('category subCategory').lean();
                        spentProducts.forEach(p => {
                            const secs = behavior.timeSpent[p._id.toString()] || 0;
                            if (secs >= 30) {
                                categoryScore[p.category] = (categoryScore[p.category] || 0) + 4;
                                if (p.subCategory) subCategoryScore[p.subCategory] = (subCategoryScore[p.subCategory] || 0) + 5;
                            } else if (secs >= 10) {
                                categoryScore[p.category] = (categoryScore[p.category] || 0) + 2;
                            }
                        });
                    }
                }
                // search queries — match against category/subCategory names
                if (behavior.searchQueries?.length) {
                    const cats = ['Women', 'Men', 'Kids', 'Home Decor'];
                    const subs = ['Kurtiwear', 'SareeWear', 'EthnicWear', 'WesternWear', 'Accessories', 'Footwear', 'Bottomwear', 'Toys', 'Wall Art', 'Lighting'];
                    behavior.searchQueries.forEach(q => {
                        const ql = q.toLowerCase();
                        cats.forEach(c => { if (c.toLowerCase().includes(ql) || ql.includes(c.toLowerCase())) categoryScore[c] = (categoryScore[c] || 0) + 1; });
                        subs.forEach(s => { if (s.toLowerCase().includes(ql) || ql.includes(s.toLowerCase())) subCategoryScore[s] = (subCategoryScore[s] || 0) + 1; });
                    });
                }
            }
        }

        // if no signals at all, return popular/bestseller products
        if (!Object.keys(categoryScore).length) {
            const popular = await productModel.find({ status: 'approved' })
                .sort({ bestseller: -1, date: -1 })
                .limit(limit)
                .lean();
            return res.json({ success: true, products: popular, type: 'popular' });
        }

        // --- score all approved products ---
        const allProducts = await productModel.find({
            status: 'approved',
            _id: { $nin: [...excludeIds] }
        }).lean();

        const scored = allProducts.map(p => {
            let score = 0;
            if (categoryScore[p.category]) score += categoryScore[p.category];
            if (p.subCategory && subCategoryScore[p.subCategory]) score += subCategoryScore[p.subCategory];
            if (p.bestseller) score += 1;
            return { ...p, _score: score };
        });

        // sort by score desc, then by date desc for ties
        scored.sort((a, b) => b._score - a._score || b.date - a.date);

        // return top N with score > 0 first, then fill with others if needed
        const relevant = scored.filter(p => p._score > 0).slice(0, limit);
        const result = relevant.length >= limit
            ? relevant
            : [...relevant, ...scored.filter(p => p._score === 0).slice(0, limit - relevant.length)];

        res.json({ success: true, products: result.slice(0, limit), type: 'personalized' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getRecommendations };
