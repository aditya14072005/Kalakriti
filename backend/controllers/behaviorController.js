import behaviorModel from '../models/behaviorModel.js';

// POST /api/behavior  (auth required)
// body: { type: 'category'|'subCategory'|'search'|'timeSpent', value, productId, seconds }
const trackBehavior = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, value, productId, seconds } = req.body;

        let update = {};

        if (type === 'category' && value) {
            update = { $inc: { [`categoryClicks.${value}`]: 1 } };
        } else if (type === 'subCategory' && value) {
            update = { $inc: { [`subCategoryClicks.${value}`]: 1 } };
        } else if (type === 'search' && value?.trim()) {
            update = { $push: { searchQueries: { $each: [value.trim().toLowerCase()], $slice: -20 } } };
        } else if (type === 'timeSpent' && productId && seconds > 0) {
            update = { $inc: { [`timeSpent.${productId}`]: seconds } };
        } else {
            return res.json({ success: false, message: 'Invalid signal' });
        }

        await behaviorModel.findOneAndUpdate({ userId }, update, { upsert: true });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { trackBehavior };
