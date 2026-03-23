import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { products as localProducts } from "../assets/assets";
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext();

const getRole = (token) => {
    try { return token ? jwtDecode(token).role : null; }
    catch { return null; }
};

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(getRole(localStorage.getItem('token')));
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch {
            return [];
        }
    });
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    // ── Products ──────────────────────────────────────────
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/list`);
            if (data.success && data.products.length > 0) {
                // merge DB products with local — DB products appear first
                const dbIds = new Set(data.products.map(p => p._id));
                const merged = [...data.products, ...localProducts.filter(p => !dbIds.has(p._id))];
                setProducts(merged);
            } else {
                setProducts(localProducts);
            }
        } catch (error) {
            setProducts(localProducts);
        }
    };

    // ── Cart ──────────────────────────────────────────────
    const addToCart = async (itemId, size) => {
        if (!size) { toast.error('Please select a size'); return; }

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
        setWishlistItems(prev => {
            const exists = prev.includes(itemId);
            const next = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
            localStorage.setItem('wishlist', JSON.stringify(next));
            return next;
        });
    };

    const isInWishlist = (itemId) => wishlistItems.includes(itemId);

    const getWishlistCount = () => wishlistItems.length;

    const getWishlistProducts = () => {
        return products.filter(p => wishlistItems.includes(p._id));
    };

    // ── Auth ──────────────────────────────────────────────
    const logout = () => {
        setToken('');
        setRole(null);
        localStorage.removeItem('token');
        setCartItems({});
        navigate('/login');
    };

    // ── Effects ───────────────────────────────────────────
    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setRole(getRole(token));
            getUserCart(token);
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const value = {
        products, currency, delivery_fee, backendUrl,
        token, setToken,
        role, setRole,
        cartItems, setCartItems,
        wishlistItems, setWishlistItems,
        addToCart, updateQuantity,
        toggleWishlist, isInWishlist, getWishlistCount, getWishlistProducts,
        getCartCount, getCartAmount,
        navigate, logout,
        search, setSearch,
        showSearch, setShowSearch,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
