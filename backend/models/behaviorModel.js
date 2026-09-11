import mongoose from 'mongoose';

const behaviorSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    categoryClicks: { type: Map, of: Number, default: {} },   // category -> count
    subCategoryClicks: { type: Map, of: Number, default: {} },
    searchQueries: { type: [String], default: [] },           // last 20 searches
    timeSpent: { type: Map, of: Number, default: {} },        // productId -> seconds
}, { timestamps: true });

const behaviorModel = mongoose.models.behavior || mongoose.model('behavior', behaviorSchema);
export default behaviorModel;
