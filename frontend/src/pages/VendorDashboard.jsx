import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const VendorDashboard = () => {
    const { backendUrl, token, logout, navigate } = useContext(ShopContext)
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview')
    const [productSubTab, setProductSubTab] = useState('approved')
    const [products, setProducts] = useState([])
    const [pendingProducts, setPendingProducts] = useState([])
    const [rejectedProducts, setRejectedProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, monthlyGrowth: 0 })
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwLoading, setPwLoading] = useState(false)

    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false
    })
    const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null })
    const [productModal, setProductModal] = useState(null)

    const categories = ['Women', 'Men', 'Kids', 'Home Decor']
    const subCategories = {
        'Women': ['Kurtiwear', 'SareeWear', 'EthnicWear', 'WesternWear', 'Accessories'],
        'Men': ['EthnicWear', 'WesternWear', 'Accessories', 'Footwear'],
        'Kids': ['EthnicWear', 'WesternWear', 'Accessories', 'Toys'],
        'Home Decor': ['Wall Art', 'Lighting', 'Accessories']
    }

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/rejected`, { headers: { token } })
            if (data.success) setRejectedProducts(data.products)
        } catch (error) { console.error('Rejected fetch error:', error) }

        try {
            const { data } = await axios.get(`${backendUrl}/api/product/pending`, { headers: { token } })
            if (data.success) setPendingProducts(data.products)
        } catch (error) {
            console.error('Pending fetch error:', error)
        }

        try {
            const { data } = await axios.get(`${backendUrl}/api/product/my-products`, { headers: { token } })
            if (data.success) setProducts(data.products)
        } catch (error) { console.error('Products fetch error:', error) }

        try {
            const { data } = await axios.get(`${backendUrl}/api/order/vendor-orders`, { headers: { token } })
            if (data.success) setOrders(data.orders)
        } catch (error) {
            console.error('Orders fetch error:', error)
        }

        try {
            const { data } = await axios.get(`${backendUrl}/api/order/vendor-analytics`, { headers: { token } })
            if (data.success) setAnalytics(data.analytics)
        } catch (error) {
            console.error('Analytics fetch error:', error)
        }
    }

    const onProductSubmit = async (e) => {
        e.preventDefault()
        try {
            const fd = new FormData()
            Object.entries(productForm).forEach(([k, v]) =>
                fd.append(k, k === 'sizes' ? JSON.stringify(v) : v)
            )
            Object.entries(images).forEach(([k, v]) => { if (v) fd.append(k, v) })
            const { data } = await axios.post(`${backendUrl}/api/product/submit`, fd, { headers: { token } })
            if (data.success) {
                toast.success('Product submitted for admin approval!')
                setProductForm({ name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false })
                setImages({ image1: null, image2: null, image3: null, image4: null })
                await fetchDashboardData()
                setProductSubTab('pending')
            } else toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const toggleSize = (size) => {
        setProductForm(p => ({
            ...p,
            sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size]
        }))
    }

    const removeProduct = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/product/remove`, { data: { id }, headers: { token } })
            if (data.success) {
                toast.success('Product removed')
                fetchDashboardData()
            } else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/order/update-status`, { orderId, status }, { headers: { token } })
            if (data.success) {
                toast.success('Order status updated')
                fetchDashboardData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changePassword = async (e) => {
        e.preventDefault()
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return }
        setPwLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/change-password`, {
                currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword
            }, { headers: { token } })
            if (data.success) { toast.success(data.message); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
            else toast.error(data.message)
        } catch (error) { toast.error(error.message) }
        setPwLoading(false)
    }

    useEffect(() => { fetchDashboardData() }, [])

return (
        <div className='min-h-screen bg-gray-50'>
            {/* Product Detail Modal */}
            {productModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4' onClick={() => setProductModal(null)}>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4' onClick={e => e.stopPropagation()}>
                        <div className='flex items-start justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800'>{productModal.name}</h3>
                            <button onClick={() => setProductModal(null)} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>×</button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            {productModal.image?.map((img, i) => (
                                <img key={i} src={img} className='w-20 h-20 object-cover rounded-lg border border-gray-100' alt='' />
                            ))}
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm'>
                            <div><p className='text-xs text-gray-400'>Category</p><p className='font-medium text-gray-700'>{productModal.category}</p></div>
                            <div><p className='text-xs text-gray-400'>Sub Category</p><p className='font-medium text-gray-700'>{productModal.subCategory}</p></div>
                            <div><p className='text-xs text-gray-400'>Price</p><p className='font-bold text-blue-600'>₹{productModal.price}</p></div>
                            <div><p className='text-xs text-gray-400'>Sizes</p><p className='font-medium text-gray-700'>{productModal.sizes?.join(', ') || '—'}</p></div>
                            <div><p className='text-xs text-gray-400'>Bestseller</p><p className='font-medium text-gray-700'>{productModal.bestseller ? '⭐ Yes' : 'No'}</p></div>
                            <div><p className='text-xs text-gray-400'>Status</p><p className='font-medium text-gray-700 capitalize'>{productModal.status}</p></div>
                        </div>
                        {productModal.description && (
                            <div><p className='text-xs text-gray-400 mb-1'>Description</p><p className='text-sm text-gray-600 leading-relaxed'>{productModal.description}</p></div>
                        )}
                        {productModal.rejectReason && (
                            <div className='bg-red-50 rounded-lg p-3'><p className='text-xs text-red-400 mb-1'>Reject Reason</p><p className='text-sm text-red-600'>{productModal.rejectReason}</p></div>
                        )}
                    </div>
                </div>
            )}
            {/* Vendor Navbar */}
            <div className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40'>
                <div className='max-w-7xl mx-auto px-6 py-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition' onClick={() => navigate('/')}>
                        <span className='text-2xl'>🏪</span>
                        <div>
                            <p className='font-bold text-gray-800 text-sm leading-none'>KALAKRITI</p>
                            <p className='text-xs text-blue-500 font-medium'>Vendor Dashboard</p>
                        </div>
                    </div>
                    <button onClick={logout}
                        className='text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition'>
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-6 py-4'>
                    <h1 className='text-2xl font-bold text-gray-800'>Business Dashboard</h1>
                    <p className='text-gray-600'>Manage your B2C operations and analytics</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className='bg-white shadow-sm'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='flex space-x-8 border-b border-gray-200'>
                        {[
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'products', label: 'Products', icon: '📦' },
                            { id: 'orders', label: 'Orders', icon: '📋' },
                            { id: 'analytics', label: 'Analytics', icon: '📈' },
                            { id: 'inventory', label: 'Inventory', icon: '🏭' },
                            { id: 'returns', label: 'Returns', icon: '↩️' },
                            { id: 'account', label: 'Account', icon: '🔒' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-8'>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className='space-y-8'>
                        {/* Key Metrics */}
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
                                        <p className='text-2xl font-bold text-gray-900'>₹{analytics.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                                        <span className='text-2xl'>💰</span>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Total Orders</p>
                                        <p className='text-2xl font-bold text-gray-900'>{analytics.totalOrders}</p>
                                    </div>
                                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                                        <span className='text-2xl'>📦</span>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Active Products</p>
                                        <p className='text-2xl font-bold text-gray-900'>{analytics.totalProducts}</p>
                                    </div>
                                    <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                                        <span className='text-2xl'>🏷️</span>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-medium text-gray-600'>Growth</p>
                                        <p className='text-2xl font-bold text-gray-900'>{analytics.monthlyGrowth}%</p>
                                    </div>
                                    <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <span className='text-2xl'>📈</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='p-6 border-b border-gray-200'>
                                <h3 className='text-lg font-semibold text-gray-800'>Recent Orders</h3>
                            </div>
                            <div className='p-6'>
                                {orders.slice(0, 5).length > 0 ? (
                                    <div className='space-y-4'>
                                        {orders.slice(0, 5).map(order => (
                                            <div key={order._id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                                <div>
                                                    <p className='font-medium text-gray-800'>Order #{order._id.slice(-8)}</p>
                                                    <p className='text-sm text-gray-600'>{order.date}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-semibold text-gray-800'>₹{order.amount}</p>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-gray-500 text-center py-8'>No orders yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className='space-y-4'>
                        {/* Sub-tabs */}
                        <div className='flex gap-1 bg-gray-100 p-1 rounded-xl w-fit'>
                            {[
                                { id: 'approved', label: `✅ Approved (${products.length})` },
                                { id: 'add', label: '➕ Add Product' },
                                { id: 'pending', label: `⏳ Pending (${pendingProducts.length})` },
                                { id: 'rejected', label: `❌ Rejected (${rejectedProducts.length})` },
                            ].map(st => (
                                <button key={st.id} onClick={() => setProductSubTab(st.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        productSubTab === st.id ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        {/* Approved Products */}
                        {productSubTab === 'approved' && (
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                                <div className='p-5 border-b border-gray-200'>
                                    <p className='font-semibold text-gray-800'>Your Approved Products ({products.length})</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5'>
                                    {products.map(p => (
                                        <div key={p._id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer' onClick={() => setProductModal(p)}>
                                            <img src={p.image?.[0]} className='w-full h-32 object-cover rounded-lg mb-3' alt='' />
                                            <p className='font-semibold text-gray-800 text-sm mb-1'>{p.name}</p>
                                            <p className='text-xs text-gray-500 mb-2'>{p.category} • {p.subCategory}</p>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-bold text-blue-600'>₹{p.price}</span>
                                                <button onClick={e => { e.stopPropagation(); removeProduct(p._id) }}
                                                    className='text-red-500 text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition'>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <div className='col-span-3 text-center py-12 text-gray-400'>
                                            <p className='text-4xl mb-2'>📦</p>
                                            <p>No approved products yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add Product */}
                        {productSubTab === 'add' && (
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                <p className='font-semibold text-gray-800 mb-1'>Submit New Product</p>
                                <p className='text-xs text-gray-400 mb-5'>Product will be reviewed by admin before going live.</p>
                                <form onSubmit={onProductSubmit} className='space-y-4'>
                                    <div className='grid sm:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='text-xs font-medium text-gray-600 mb-1 block'>Product Name *</label>
                                            <input required placeholder='Product name' value={productForm.name}
                                                onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400' />
                                        </div>
                                        <div>
                                            <label className='text-xs font-medium text-gray-600 mb-1 block'>Price (₹) *</label>
                                            <input required type='number' placeholder='0' value={productForm.price}
                                                onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400' />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-1 block'>Description *</label>
                                        <textarea required rows={3} placeholder='Product description' value={productForm.description}
                                            onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none' />
                                    </div>
                                    <div className='grid sm:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='text-xs font-medium text-gray-600 mb-1 block'>Category</label>
                                            <select value={productForm.category}
                                                onChange={e => setProductForm(p => ({ ...p, category: e.target.value, subCategory: subCategories[e.target.value][0] }))}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'>
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className='text-xs font-medium text-gray-600 mb-1 block'>Sub Category</label>
                                            <select value={productForm.subCategory}
                                                onChange={e => setProductForm(p => ({ ...p, subCategory: e.target.value }))}
                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'>
                                                {subCategories[productForm.category]?.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-2 block'>Sizes</label>
                                        <div className='flex gap-2 flex-wrap'>
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                                <button type='button' key={size} onClick={() => toggleSize(size)}
                                                    className={`px-3 py-1 rounded-lg text-xs border transition ${
                                                        productForm.sizes.includes(size)
                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                            : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                                    }`}>
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-2 block'>Images (up to 4)</label>
                                        <div className='flex gap-3 flex-wrap'>
                                            {['image1', 'image2', 'image3', 'image4'].map(key => (
                                                <label key={key} className='cursor-pointer'>
                                                    <div className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition'>
                                                        {images[key]
                                                            ? <img src={URL.createObjectURL(images[key])} className='w-full h-full object-cover' alt='' />
                                                            : <span className='text-2xl text-gray-400'>+</span>}
                                                    </div>
                                                    <input type='file' accept='image/*' hidden
                                                        onChange={e => setImages(prev => ({ ...prev, [key]: e.target.files[0] }))} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <label className='flex items-center gap-2 cursor-pointer'>
                                        <input type='checkbox' checked={productForm.bestseller}
                                            onChange={e => setProductForm(p => ({ ...p, bestseller: e.target.checked }))} />
                                        <span className='text-sm text-gray-600'>Mark as Bestseller</span>
                                    </label>
                                    <button type='submit' className='bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium'>
                                        Submit for Approval
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Rejected */}
                        {productSubTab === 'rejected' && (
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                                <div className='p-5 border-b border-gray-200'>
                                    <p className='font-semibold text-gray-800'>Rejected Products ({rejectedProducts.length})</p>
                                    <p className='text-xs text-gray-400 mt-1'>These products were rejected by admin. Fix the issues and resubmit.</p>
                                </div>
                                <div className='flex flex-col divide-y divide-gray-100'>
                                    {rejectedProducts.map(p => (
                                        <div key={p._id} className='flex items-center gap-4 px-5 py-3'>
                                            <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                                <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                                                {p.rejectReason && <p className='text-xs text-red-500 mt-1'>Reason: {p.rejectReason}</p>}
                                            </div>
                                            <p className='font-semibold text-gray-500 text-sm'>₹{p.price}</p>
                                            <span className='bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full'>❌ Rejected</span>
                                        </div>
                                    ))}
                                    {rejectedProducts.length === 0 && (
                                        <p className='text-center py-10 text-gray-400 text-sm'>No rejected products</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pending */}
                        {productSubTab === 'pending' && (
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                                <div className='p-5 border-b border-gray-200'>
                                    <p className='font-semibold text-gray-800'>Pending Approval ({pendingProducts.length})</p>
                                    <p className='text-xs text-gray-400 mt-1'>These products are waiting for admin review.</p>
                                </div>
                                <div className='flex flex-col divide-y divide-gray-100'>
                                    {pendingProducts.map(p => (
                                        <div key={p._id} className='flex items-center gap-4 px-5 py-3'>
                                            <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                                <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                                            </div>
                                            <p className='font-semibold text-blue-600 text-sm'>₹{p.price}</p>
                                            <span className='bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full'>⏳ Pending</span>
                                        </div>
                                    ))}
                                    {pendingProducts.length === 0 && (
                                        <p className='text-center py-10 text-gray-400 text-sm'>No products pending approval</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                        <div className='p-6 border-b border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-800'>Order Management</h3>
                        </div>
                        <div className='p-6'>
                            {orders.length > 0 ? (
                                <div className='space-y-4'>
                                    {orders.map(order => (
                                        <div key={order._id} className='border border-gray-200 rounded-lg p-6'>
                                            <div className='flex items-center justify-between mb-4'>
                                                <div>
                                                    <h4 className='font-semibold text-gray-800'>Order #{order._id.slice(-8)}</h4>
                                                    <p className='text-sm text-gray-600'>{order.date}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-bold text-gray-800'>₹{order.amount}</p>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        className='mt-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    >
                                                        <option value='Processing'>Processing</option>
                                                        <option value='Shipped'>Shipped</option>
                                                        <option value='Delivered'>Delivered</option>
                                                        <option value='Cancelled'>Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className='flex items-center space-x-4 text-sm'>
                                                        <img src={item.image} className='w-12 h-12 object-cover rounded' alt="" />
                                                        <div className='flex-1'>
                                                            <p className='font-medium text-gray-800'>{item.name}</p>
                                                            <p className='text-gray-600'>Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className='font-semibold text-gray-800'>₹{item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-12 text-gray-500'>
                                    <span className='text-6xl mb-4 block'>📋</span>
                                    <p className='text-lg'>No orders yet</p>
                                    <p className='text-sm'>Orders from your business customers will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className='space-y-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {/* Revenue Chart Placeholder */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Revenue Trends</h3>
                                <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                                    <span className='text-gray-500'>📊 Revenue Chart Coming Soon</span>
                                </div>
                            </div>

                            {/* Top Products */}
                            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Top Performing Products</h3>
                                <div className='space-y-4'>
                                    {products.slice(0, 5).map((product, idx) => (
                                        <div key={product._id} className='flex items-center space-x-4'>
                                            <span className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600'>
                                                {idx + 1}
                                            </span>
                                            <img src={product.image?.[0]} className='w-12 h-12 object-cover rounded' alt="" />
                                            <div className='flex-1'>
                                                <p className='font-medium text-gray-800 text-sm'>{product.name}</p>
                                                <p className='text-xs text-gray-600'>₹{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
                        <div className='p-6 border-b border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-800'>Inventory Management</h3>
                        </div>
                        <div className='p-6'>
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='px-4 py-3 text-left font-medium text-gray-700'>Product</th>
                                            <th className='px-4 py-3 text-left font-medium text-gray-700'>SKU</th>
                                            <th className='px-4 py-3 text-left font-medium text-gray-700'>Stock</th>
                                            <th className='px-4 py-3 text-left font-medium text-gray-700'>Status</th>
                                            <th className='px-4 py-3 text-left font-medium text-gray-700'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {products.map(product => (
                                            <tr key={product._id} className='hover:bg-gray-50'>
                                                <td className='px-4 py-3'>
                                                    <div className='flex items-center space-x-3'>
                                                        <img src={product.image?.[0]} className='w-10 h-10 object-cover rounded' alt="" />
                                                        <span className='font-medium text-gray-800'>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-3 text-gray-600'>{product.sku || 'N/A'}</td>
                                                <td className='px-4 py-3'>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                                                        (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.stock || 0} units
                                                    </span>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                                                        (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {(product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                                                        Update Stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Returns Tab */}
                {activeTab === 'returns' && (
                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-1'>↩️ Returns & Exchanges</h3>
                        <p className='text-xs text-gray-400 mb-6'>Customer return requests for your products.</p>
                        <div className='text-center py-16 text-gray-400'>
                            <p className='text-4xl mb-3'>↩️</p>
                            <p className='text-sm font-medium text-gray-500'>No return requests yet</p>
                            <p className='text-xs mt-1'>When customers request returns for your products, they will appear here.</p>
                        </div>
                    </div>
                )}

                {/* Account / Change Password Tab */}
                {activeTab === 'account' && (
                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-1'>🔒 Change Password</h3>
                        <p className='text-xs text-gray-400 mb-5'>Enter your current password and choose a new one.</p>
                        <form onSubmit={changePassword} className='space-y-4'>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>Current Password</label>
                                <input required type='password' value={pwForm.currentPassword}
                                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400' />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>New Password</label>
                                <input required type='password' value={pwForm.newPassword}
                                    onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400' />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>Confirm New Password</label>
                                <input required type='password' value={pwForm.confirmPassword}
                                    onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400' />
                            </div>
                            <button type='submit' disabled={pwLoading}
                                className='bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium disabled:opacity-50'>
                                {pwLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VendorDashboard
