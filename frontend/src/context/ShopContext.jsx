import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext();

const getRole = (token) => {
    try { return token ? jwtDecode(token).role : null; }
    catch { return null; }
};

const getUserId = (token) => {
    try { return token ? jwtDecode(token).id : null; }
    catch { return null; }
};

const getUserName = (token) => {
    try { return token ? jwtDecode(token).name : null; }
    catch { return null; }
};

const wishlistKey = (token) => {
    const id = getUserId(token);
    return id ? `wishlist_${id}` : null;
};

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(getRole(localStorage.getItem('token')));
    const [userName, setUserName] = useState(getUserName(localStorage.getItem('token')));
    const [userAvatar, setUserAvatar] = useState(null);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            const key = wishlistKey(token);
            if (!key) return [];
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    });
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState(() => {
        try { return JSON.parse(localStorage.getItem('recentlyViewed')) || []; } catch { return []; }
    });
    const navigate = useNavigate();

    // ── Products ──────────────────────────────────────────
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/list`);
            if (data.success) setProducts(data.products);
        } catch (error) {
            toast.error('Failed to load products');
        }
    };

    // ── Cart ──────────────────────────────────────────────
    const addToCart = async (itemId, size) => {
        if (!token) { toast.error('Please login to add items to cart'); navigate('/login'); return; }
        if (!size) { toast.error('Please select a size'); return; } // size is pre-validated by caller

        let cart = structuredClone(cartItems);
        cart[itemId] = cart[itemId] || {};
        cart[itemId][size] = (cart[itemId][size] || 0) + 1;
        setCartItems(cart);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cart = structuredClone(cartItems);
        cart[itemId][size] = quantity;
        setCartItems(cart);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) =>
            total + Object.values(sizes).reduce((s, q) => s + q, 0), 0);
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const product = products.find(p => p._id === itemId);
            if (!product) return total;
            return total + Object.entries(sizes).reduce((s, [, qty]) => s + product.price * qty, 0);
        }, 0);
    };

    const getUserCart = async (userToken) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
            if (data.success) setCartItems(data.cartData);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleWishlist = (itemId) => {
        if (!token) { toast.error('Please login to add items to wishlist'); navigate('/login'); return; }
        setWishlistItems(prev => {
            const exists = prev.includes(itemId);
            const next = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
            const key = wishlistKey(token);
            if (key) localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    };

    const isInWishlist = (itemId) => wishlistItems.includes(itemId);

    const getWishlistCount = () => wishlistItems.length;

    const getWishlistProducts = () => {
        return products.filter(p => wishlistItems.includes(p._id));
    };

    const trackBehavior = async (payload) => {
        if (!token) return;
        try {
            await axios.post(`${backendUrl}/api/behavior`, payload, { headers: { token } });
        } catch {}
    };

    const addToRecentlyViewed = (productId) => {
        setRecentlyViewed(prev => {
            const next = [productId, ...prev.filter(id => id !== productId)].slice(0, 8);
            localStorage.setItem('recentlyViewed', JSON.stringify(next));
            return next;
        });
    };

    const fetchAvatar = async (userToken) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token: userToken } });
            if (data.success) setUserAvatar(data.user.avatar || null);
        } catch {}
    };

    // ── Auth ──────────────────────────────────────────────
    const logout = () => {
        if (!window.confirm('Are you sure you want to logout?')) return
        setToken('');
        setRole(null);
        setUserName(null);
        setUserAvatar(null);
        localStorage.removeItem('token');
        setCartItems({});
        setWishlistItems([]);
        navigate('/login');
    };

    // track search queries
    useEffect(() => {
        if (!search.trim() || !token) return;
        const t = setTimeout(() => trackBehavior({ type: 'search', value: search.trim() }), 1000);
        return () => clearTimeout(t);
    }, [search, token]);

    // ── Effects ───────────────────────────────────────────
    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setRole(getRole(token));
            setUserName(getUserName(token));
            getUserCart(token);
            fetchAvatar(token);
            // restore this user's wishlist
            try {
                const key = wishlistKey(token);
                const saved = key ? JSON.parse(localStorage.getItem(key)) : null;
                if (Array.isArray(saved)) setWishlistItems(saved);
                else setWishlistItems([]);
            } catch { setWishlistItems([]); }
        }
    }, [token]);

    // persist wishlist keyed by user — only when token exists
    useEffect(() => {
        if (!token) return;
        const key = wishlistKey(token);
        if (key) localStorage.setItem(key, JSON.stringify(wishlistItems));
    }, [wishlistItems, token]);

    const value = {
        products, fetchProducts, currency, delivery_fee, backendUrl,
        token, setToken,
        role, setRole,
        userName, userAvatar, setUserAvatar,
        cartItems, setCartItems,
        wishlistItems, setWishlistItems,
        addToCart, updateQuantity,
        toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
        getCartCount, getCartAmount,
        navigate, logout,
        search, setSearch,
        showSearch, setShowSearch,
        recentlyViewed, addToRecentlyViewed, trackBehavior,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
