import userModel from '../models/userModel.js';

// POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size } = req.body;
        const user = await userModel.findById(userId);
        let cartData = user.cartData;

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/cart/update
const updateCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, size, quantity } = req.body;
        const user = await userModel.findById(userId);
        let cartData = user.cartData;

        cartData[itemId][size] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/cart/get
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
