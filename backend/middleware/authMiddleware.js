import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.json({ success: false, message: 'Not authorized, login again' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const authVendor = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.json({ success: false, message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'vendor' && decoded.role !== 'admin')
            return res.json({ success: false, message: 'Vendor access required' });
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const authAdmin = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.json({ success: false, message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin')
            return res.json({ success: false, message: 'Admin access required' });
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { authUser, authVendor, authAdmin };
