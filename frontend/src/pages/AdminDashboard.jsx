import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const AdminDashboard = () => {
    const { backendUrl, token, role, navigate, logout, products: allProducts, fetchProducts } = useContext(ShopContext)
    const location = useLocation()
    const [tab, setTab] = useState(location.state?.tab || 'overview')
    const [productSubTab, setProductSubTab] = useState('approved')
    const [addForm, setAddForm] = useState({ name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false, tags: [] })
    const [tagInput, setTagInput] = useState('')
    const [addImages, setAddImages] = useState({ image1: null, image2: null, image3: null, image4: null })
    const [stats, setStats] = useState({})
    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [pendingProducts, setPendingProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'vendor' })
    const [showCreate, setShowCreate] = useState(false)
    const [rejectModal, setRejectModal] = useState(null) // productId
    const [rejectReason, setRejectReason] = useState('')
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [orderPage, setOrderPage] = useState(1)
    const [orderSubTab, setOrderSubTab] = useState('active')
    const [orderSearch, setOrderSearch] = useState('')
    const [ticketOrderModal, setTicketOrderModal] = useState(null)
    const ORDER_PAGE_SIZE = 10
    const [productModal, setProductModal] = useState(null) // product object
    const [vendorRequests, setVendorRequests] = useState([])
    const [returnRequests, setReturnRequests] = useState([])
    const [supportTickets, setSupportTickets] = useState([])
    const [activeTicket, setActiveTicket] = useState(null)
    const [adminReply, setAdminReply] = useState('')
    const [deals, setDeals] = useState([])
    const [dealForm, setDealForm] = useState({ productId: '', dealPrice: '', hours: 24 })
    const [dealSearch, setDealSearch] = useState('')
    const [bestsellers, setBestsellers] = useState([])
    const [bsRecommendations, setBsRecommendations] = useState([])
    const [bsSearch, setBsSearch] = useState('')
    const [bsTab, setBsTab] = useState('current')
    const [productSearch, setProductSearch] = useState('')

    const [editModal, setEditModal] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [editTagInput, setEditTagInput] = useState('')
    const [editImages, setEditImages] = useState({ image1: null, image2: null, image3: null, image4: null })

    const h = { headers: { token } }

    const openEdit = (p) => {
        setEditModal(p)
        setEditForm({ name: p.name, description: p.description, price: p.price, category: p.category, subCategory: p.subCategory, sizes: p.sizes || [], bestseller: p.bestseller || false, tags: p.tags || [] })
        setEditTagInput('')
        setEditImages({ image1: null, image2: null, image3: null, image4: null })
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('productId', editModal._id)
        Object.entries(editForm).forEach(([k, v]) => fd.append(k, k === 'sizes' || k === 'tags' ? JSON.stringify(v) : v))
        Object.entries(editImages).forEach(([k, v]) => { if (v) fd.append(k, v) })
        const { data } = await axios.put(`${backendUrl}/api/product/edit`, fd, h)
        if (data.success) { toast.success('Product updated!'); setEditModal(null); fetchAll() }
        else toast.error(data.message)
    }

    useEffect(() => {
        if (role !== 'admin') { navigate('/'); return }
        fetchAll()
    }, [role])

    const fetchAll = async () => {
        try {
            const [s, u, p, o, pending, vr] = await Promise.all([
                axios.get(`${backendUrl}/api/admin/stats`, h),
                axios.get(`${backendUrl}/api/admin/users`, h),
                axios.get(`${backendUrl}/api/admin/products`, h),
                axios.get(`${backendUrl}/api/admin/orders`, h),
                axios.get(`${backendUrl}/api/product/pending`, h),
                axios.get(`${backendUrl}/api/admin/vendor-requests`, h),
            ])
            if (s.data.success) setStats(s.data.stats)
            if (u.data.success) setUsers(u.data.users)
            if (p.data.success) setProducts(p.data.products)
            if (o.data.success) setOrders(o.data.orders)
            if (pending.data.success) setPendingProducts(pending.data.products)
            if (vr.data.success) setVendorRequests(vr.data.requests)
            const rr = await axios.get(`${backendUrl}/api/return/all`, h)
            if (rr.data.success) setReturnRequests(rr.data.requests)
            const st = await axios.get(`${backendUrl}/api/support/all`, h)
            if (st.data.success) setSupportTickets(st.data.tickets)
            const dr = await axios.get(`${backendUrl}/api/admin/deals`, h)
            if (dr.data.success) setDeals(dr.data.deals)
            const bs = await axios.get(`${backendUrl}/api/bestsellers`)
            if (bs.data.success) { setBestsellers(bs.data.products); setBsRecommendations(bs.data.recommendations || []) }
            fetchProducts()
        } catch (e) { toast.error(e.message) }
    }

    const approveVendorReq = async (userId) => {
        const { data } = await axios.post(`${backendUrl}/api/admin/vendor-request/approve`, { userId }, h)
        if (data.success) { toast.success('Vendor approved!'); fetchAll() }
        else toast.error(data.message)
    }

    const rejectVendorReq = async (userId) => {
        const reason = prompt('Reason for rejection (optional):')
        const { data } = await axios.post(`${backendUrl}/api/admin/vendor-request/reject`, { userId, reason }, h)
        if (data.success) { toast.success('Request rejected'); fetchAll() }
        else toast.error(data.message)
    }

    const approveProduct = async (productId) => {
        const { data } = await axios.post(`${backendUrl}/api/product/approve`, { productId }, h)
        if (data.success) { toast.success('Product approved'); fetchAll() }
        else toast.error(data.message)
    }

    const rejectProduct = async (productId) => {
        setRejectModal(productId)
    }

    const confirmReject = async () => {
        const { data } = await axios.post(`${backendUrl}/api/product/reject`, { productId: rejectModal, reason: rejectReason }, h)
        if (data.success) { toast.success('Product rejected'); setRejectModal(null); setRejectReason(''); fetchAll() }
        else toast.error(data.message)
    }

    const addProduct = async (e) => {
        e.preventDefault()
        try {
            const fd = new FormData()
            Object.entries(addForm).forEach(([k, v]) =>
                fd.append(k, k === 'sizes' || k === 'tags' ? JSON.stringify(v) : v)
            )
            Object.entries(addImages).forEach(([k, v]) => { if (v) fd.append(k, v) })
            const { data } = await axios.post(`${backendUrl}/api/product/add`, fd, h)
            if (data.success) {
                toast.success('Product added!')
                setAddForm({ name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false, tags: [] })
                setTagInput('')
                setAddImages({ image1: null, image2: null, image3: null, image4: null })
                fetchAll()
            } else toast.error(data.message)
        } catch (e) { toast.error(e.response?.data?.message || e.message) }
    }

    const toggleSize = (size) => {
        setAddForm(p => ({
            ...p,
            sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size]
        }))
    }

    const updateRole = async (userId, role) => {
        const { data } = await axios.post(`${backendUrl}/api/admin/user/role`, { userId, role }, h)
        if (data.success) { toast.success('Role updated'); fetchAll() }
        else toast.error(data.message)
    }

    const deleteUser = async (userId) => {
        if (!confirm('Delete this user?')) return
        const { data } = await axios.delete(`${backendUrl}/api/admin/user/delete`, { data: { userId }, headers: { token } })
        if (data.success) { toast.success('User deleted'); fetchAll() }
        else toast.error(data.message)
    }

    const deleteProduct = async (productId) => {
        if (!confirm('Delete this product?')) return
        const { data } = await axios.delete(`${backendUrl}/api/admin/product/delete`, { data: { productId }, headers: { token } })
        if (data.success) { toast.success('Product deleted'); fetchAll() }
        else toast.error(data.message)
    }

    const updateOrderStatus = async (orderId, status) => {
        const { data } = await axios.post(`${backendUrl}/api/admin/order/status`, { orderId, status }, h)
        if (data.success) { toast.success('Status updated'); fetchAll() }
        else toast.error(data.message)
    }

    const updateOrderPayment = async (orderId, payment) => {
        const { data } = await axios.post(`${backendUrl}/api/order/update-payment`, { orderId, payment }, h)
        if (data.success) { toast.success('Payment updated'); fetchAll() }
        else toast.error(data.message)
    }

    const deleteOrder = async (orderId) => {
        if (!confirm('Delete this order?')) return
        const { data } = await axios.delete(`${backendUrl}/api/admin/order/delete`, { data: { orderId }, headers: { token } })
        if (data.success) { toast.success('Order deleted'); fetchAll() }
        else toast.error(data.message)
    }

    const createAccount = async (e) => {
        e.preventDefault()
        const { data } = await axios.post(`${backendUrl}/api/admin/create`, createForm, h)
        if (data.success) {
            toast.success(data.message)
            setCreateForm({ name: '', email: '', password: '', role: 'vendor' })
            setShowCreate(false)
            fetchAll()
        } else toast.error(data.message)
    }

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'vendor-requests', label: `🏪 Vendor Requests${vendorRequests.length > 0 ? ` (${vendorRequests.length})` : ''}` },
        { id: 'users', label: '👥 Users' },
        { id: 'products', label: `📦 Products ${pendingProducts.length > 0 ? `(${pendingProducts.length} pending)` : ''}` },
        { id: 'orders', label: '🛒 Orders' },
        { id: 'support', label: `🎧 Support${supportTickets.filter(t => t.status === 'Open').length > 0 ? ` (${supportTickets.filter(t => t.status === 'Open').length})` : ''}` },
        { id: 'returns', label: '↩️ Returns' },
        { id: 'deals', label: `🏷️ Daily Deals${deals.length > 0 ? ` (${deals.length})` : ''}` },
        { id: 'bestsellers', label: `⭐ Best Sellers (${bestsellers.length})` },
    ]

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: '👥', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { label: 'Total Products', value: stats.products, icon: '📦', color: 'bg-orange-50 border-orange-200 text-orange-700',
          sub: stats.products ? `✅ ${stats.approvedProducts} approved · ⏳ ${stats.pendingProducts} pending · ❌ ${stats.rejectedProducts} rejected` : null },
        { label: 'Total Orders', value: stats.orders, icon: '🛒', color: 'bg-green-50 border-green-200 text-green-700' },
        { label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
        { label: 'Pending Payments', value: stats.pending, icon: '⏳', color: 'bg-red-50 border-red-200 text-red-700' },
    ]

    const roleBadge = (r) => {
        const map = { admin: 'bg-red-100 text-red-600', vendor: 'bg-blue-100 text-blue-600', customer: 'bg-green-100 text-green-600' }
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[r] || 'bg-gray-100 text-gray-600'}`}>{r}</span>
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Admin Navbar */}
            <div className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40'>
                <div className='max-w-7xl mx-auto px-6 py-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition' onClick={() => navigate('/')}>
                        <span className='text-2xl'>⚙️</span>
                        <div>
                            <p className='font-bold text-gray-800 text-sm leading-none'>KALAKRITI</p>
                            <p className='text-xs text-orange-500 font-medium'>Admin Panel</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className='text-xs text-gray-400 hidden sm:block'>Logged in as Admin</span>
                        <button onClick={() => setShowCreate(!showCreate)}
                            className='bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-orange-700 transition'>
                            + Create Account
                        </button>
                        <button onClick={logout}
                            className='text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition'>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 pt-6 pb-16'>

            {/* Edit Product Modal */}
            {editModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4' onClick={() => setEditModal(null)}>
                    <form onSubmit={saveEdit} className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800'>Edit Product</h3>
                            <button type='button' onClick={() => setEditModal(null)} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>✕</button>
                        </div>
                        <div className='grid sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Name *</label>
                                <input required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Price (₹) *</label>
                                <input required type='number' value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                            </div>
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 mb-1 block'>Description *</label>
                            <textarea required rows={3} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none' />
                        </div>
                        <div className='grid sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Category</label>
                                <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                    {['Women','Men','Kids','Home Decor'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Sub Category</label>
                                <select value={editForm.subCategory} onChange={e => setEditForm(p => ({ ...p, subCategory: e.target.value }))} className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                    {['Kurtiwear','SareeWear','EthnicWear','WesternWear','Accessories','Footwear','Bottomwear','Toys','Wall Art','Lighting'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 mb-2 block'>Sizes</label>
                            <div className='flex gap-2 flex-wrap'>
                                {['XS','S','M','L','XL','XXL'].map(size => (
                                    <button type='button' key={size}
                                        onClick={() => setEditForm(p => ({ ...p, sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size] }))}
                                        className={`px-3 py-1 rounded-lg text-xs border transition ${editForm.sizes?.includes(size) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-300'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 mb-2 block'>Tags <span className='text-gray-400 font-normal'>(press Enter)</span></label>
                            <div className='flex flex-wrap gap-1.5 mb-2'>
                                {editForm.tags?.map((tag, i) => (
                                    <span key={i} className='flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full'>
                                        #{tag}
                                        <button type='button' onClick={() => setEditForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} className='hover:text-red-500'>×</button>
                                    </span>
                                ))}
                            </div>
                            <input placeholder='Add tag...' value={editTagInput} onChange={e => setEditTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const t = editTagInput.trim().toLowerCase(); if (t && !editForm.tags?.includes(t)) setEditForm(p => ({ ...p, tags: [...(p.tags||[]), t] })); setEditTagInput('') }}}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 mb-2 block'>Replace Images (optional)</label>
                            <div className='flex gap-2 flex-wrap'>
                                {['image1','image2','image3','image4'].map((key, i) => (
                                    <label key={key} className='cursor-pointer'>
                                        <div className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition'>
                                            {editImages[key]
                                                ? <img src={URL.createObjectURL(editImages[key])} className='w-full h-full object-cover' alt='' />
                                                : editModal.image?.[i]
                                                ? <img src={editModal.image[i]} className='w-full h-full object-cover' alt='' />
                                                : <span className='text-xl text-gray-400'>+</span>}
                                        </div>
                                        <input type='file' accept='image/*' hidden onChange={e => setEditImages(prev => ({ ...prev, [key]: e.target.files[0] }))} />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={editForm.bestseller} onChange={e => setEditForm(p => ({ ...p, bestseller: e.target.checked }))} className='w-4 h-4' />
                            <span className='text-sm text-gray-600'>Mark as Bestseller</span>
                        </label>
                        <button type='submit' className='bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition'>Save Changes</button>
                    </form>
                </div>
            )}

            {/* Product Detail Modal */}
            {productModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4' onClick={() => setProductModal(null)}>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4' onClick={e => e.stopPropagation()}>
                        <div className='flex items-start justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800'>{productModal.name}</h3>
                            <button onClick={() => setProductModal(null)} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>✕</button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            {productModal.image?.map((img, i) => (
                                <img key={i} src={img} className='w-20 h-20 object-cover rounded-lg border border-gray-100' alt='' />
                            ))}
                        </div>
                        <div className='grid grid-cols-2 gap-3 text-sm'>
                            <div><p className='text-xs text-gray-400'>Category</p><p className='font-medium text-gray-700'>{productModal.category}</p></div>
                            <div><p className='text-xs text-gray-400'>Sub Category</p><p className='font-medium text-gray-700'>{productModal.subCategory}</p></div>
                            <div><p className='text-xs text-gray-400'>Price</p><p className='font-bold text-orange-600'>₹{productModal.price}</p></div>
                            <div><p className='text-xs text-gray-400'>Vendor</p><p className='font-medium text-gray-700'>{productModal.vendorName || 'Admin'}</p></div>
                            <div><p className='text-xs text-gray-400'>Sizes</p><p className='font-medium text-gray-700'>{productModal.sizes?.join(', ') || '—'}</p></div>
                            <div><p className='text-xs text-gray-400'>Bestseller</p><p className='font-medium text-gray-700'>{productModal.bestseller ? '⭐ Yes' : 'No'}</p></div>
                            <div><p className='text-xs text-gray-400'>Status</p><p className='font-medium text-gray-700 capitalize'>{productModal.status}</p></div>
                            <div><p className='text-xs text-gray-400'>Added</p><p className='font-medium text-gray-700'>{new Date(productModal.date || productModal.createdAt).toLocaleDateString()}</p></div>
                        </div>
                        {productModal.description && (
                            <div><p className='text-xs text-gray-400 mb-1'>Description</p><p className='text-sm text-gray-600 leading-relaxed'>{productModal.description}</p></div>
                        )}
                        {productModal.tags?.length > 0 && (
                            <div>
                                <p className='text-xs text-gray-400 mb-1'>Tags</p>
                                <div className='flex flex-wrap gap-1.5'>
                                    {productModal.tags.map((tag, i) => (
                                        <span key={i} className='bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full'>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {productModal.rejectReason && (
                            <div className='bg-red-50 rounded-lg p-3'><p className='text-xs text-red-400 mb-1'>Reject Reason</p><p className='text-sm text-red-600'>{productModal.rejectReason}</p></div>
                        )}
                    </div>
                </div>
            )}

            {/* Reject Reason Modal */}
            {rejectModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4'>
                        <h3 className='text-lg font-semibold text-gray-700'>Reject Product</h3>
                        <p className='text-sm text-gray-500'>Provide a reason so the vendor knows what to fix.</p>
                        <textarea
                            rows={3} placeholder='Reason for rejection...'
                            value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none'
                        />
                        <div className='flex gap-3'>
                            <button onClick={confirmReject} className='flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition'>Reject</button>
                            <button onClick={() => { setRejectModal(null); setRejectReason('') }} className='flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 transition'>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Account Modal */}
            {showCreate && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
                    <form onSubmit={createAccount} className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-4'>
                        <h3 className='text-lg font-semibold text-gray-700'>Create New Account</h3>
                        <input required placeholder='Name' value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                        <input required type='email' placeholder='Email' value={createForm.email} onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                        <input required type='password' placeholder='Password' value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))}
                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                        <select value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}
                            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400'>
                            <option value='vendor'>Vendor</option>
                            <option value='admin'>Admin</option>
                        </select>
                        <div className='flex gap-3'>
                            <button type='submit' className='flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm hover:bg-orange-700 transition'>Create</button>
                            <button type='button' onClick={() => setShowCreate(false)} className='flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 transition'>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            <div className='flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto'>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`pb-3 px-4 text-sm font-medium transition border-b-2 -mb-px ${tab === t.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>


            {tab === 'overview' && (
                <div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10'>
                        {statCards.map((s, i) => (
                            <div key={i} className={`border rounded-2xl p-5 ${s.color}`}>
                                <p className='text-2xl mb-2'>{s.icon}</p>
                                <p className='text-2xl font-bold'>{s.value ?? '—'}</p>
                                <p className='text-xs mt-1 opacity-70'>{s.label}</p>
                                {s.sub && <p className='text-[10px] mt-1.5 opacity-60 leading-relaxed'>{s.sub}</p>}
                            </div>
                        ))}
                    </div>

                    <div className='grid sm:grid-cols-2 gap-6'>
                        {/* Recent Orders */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow p-5'>
                            <h3 className='font-semibold text-gray-700 mb-4'>🕐 Recent Orders</h3>
                            <div className='flex flex-col gap-3'>
                                {orders.slice(0, 5).map((o, i) => (
                                    <div key={i} className='flex items-center justify-between text-sm'>
                                        <span className='text-gray-500 truncate w-32'>{o._id.slice(-8)}</span>
                                        <span className='text-orange-600 font-medium'>₹{o.amount}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${o.payment ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                            {o.payment ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                ))}
                                {orders.length === 0 && <p className='text-gray-400 text-sm'>No orders yet</p>}
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow p-5'>
                            <h3 className='font-semibold text-gray-700 mb-4'>🆕 Recent Users</h3>
                            <div className='flex flex-col gap-3'>
                                {users.slice(0, 5).map((u, i) => (
                                    <div key={i} className='flex items-center justify-between text-sm'>
                                        <span className='text-gray-700 font-medium truncate w-28'>{u.name}</span>
                                        <span className='text-gray-400 truncate w-32 text-xs'>{u.email}</span>
                                        {roleBadge(u.role)}
                                    </div>
                                ))}
                                {users.length === 0 && <p className='text-gray-400 text-sm'>No users yet</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vendor Requests */}
            {tab === 'vendor-requests' && (
                <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                    <div className='p-4 border-b border-gray-100'>
                        <p className='font-semibold text-gray-700'>Pending Vendor Requests ({vendorRequests.length})</p>
                    </div>
                    <div className='flex flex-col divide-y divide-gray-50'>
                        {vendorRequests.map((u, i) => (
                            <div key={i} className='flex items-start gap-4 px-4 py-4 hover:bg-orange-50/30 transition'>
                                <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg flex-shrink-0'>
                                    {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-gray-800 text-sm'>{u.name}</p>
                                    <p className='text-xs text-gray-400'>{u.email}</p>
                                    {u.vendorRequest?.data && (
                                        <div className='mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500'>
                                            {u.vendorRequest.data.companyName && <span>🏢 {u.vendorRequest.data.companyName}</span>}
                                            {u.vendorRequest.data.businessType && <span>📋 {u.vendorRequest.data.businessType}</span>}
                                            {u.vendorRequest.data.phone && <span>📞 {u.vendorRequest.data.phone}</span>}
                                            {u.vendorRequest.data.businessAddress && <span>📍 {u.vendorRequest.data.businessAddress}</span>}
                                            {u.vendorRequest.data.businessDescription && (
                                                <span className='col-span-2 text-gray-400 italic'>"{u.vendorRequest.data.businessDescription}"</span>
                                            )}
                                        </div>
                                    )}
                                    <p className='text-[10px] text-gray-300 mt-1'>Submitted: {new Date(u.vendorRequest?.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div className='flex gap-2 flex-shrink-0'>
                                    <button onClick={() => approveVendorReq(u._id)}
                                        className='text-green-600 text-xs border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition font-medium'>
                                        Approve
                                    </button>
                                    <button onClick={() => rejectVendorReq(u._id)}
                                        className='text-red-400 text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition'>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {vendorRequests.length === 0 && (
                            <div className='text-center py-16 text-gray-400'>
                                <p className='text-4xl mb-3'>🏪</p>
                                <p className='text-sm font-medium text-gray-500'>No pending vendor requests</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Users */}
            {tab === 'users' && (
                <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                    <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                        <p className='font-semibold text-gray-700'>All Users ({users.length})</p>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-50 text-gray-500 text-xs uppercase'>
                                <tr>
                                    <th className='px-4 py-3 text-left'>Name</th>
                                    <th className='px-4 py-3 text-left'>Email</th>
                                    <th className='px-4 py-3 text-left'>Role</th>
                                    <th className='px-4 py-3 text-left'>Joined</th>
                                    <th className='px-4 py-3 text-left'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50'>
                                {users.map((u, i) => (
                                    <tr key={i} className='hover:bg-orange-50/30 transition'>
                                        <td className='px-4 py-3 font-medium text-gray-800'>{u.name}</td>
                                        <td className='px-4 py-3 text-gray-500'>{u.email}</td>
                                        <td className='px-4 py-3'>
                                            <select value={u.role} onChange={e => updateRole(u._id, e.target.value)}
                                                className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400'>
                                                <option value='customer'>customer</option>
                                                <option value='vendor'>vendor</option>
                                                <option value='admin'>admin</option>
                                            </select>
                                        </td>
                                        <td className='px-4 py-3 text-gray-400 text-xs'>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className='px-4 py-3'>
                                            <button onClick={() => deleteUser(u._id)}
                                                className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition'>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <p className='text-center py-10 text-gray-400'>No users found</p>}
                    </div>
                </div>
            )}

            {/* Products */}
            {tab === 'products' && (
                <div className='space-y-4'>
                    {/* Product Sub-tabs */}
                    <div className='flex gap-1 bg-gray-100 p-1 rounded-xl w-fit'>
                        {[
                            { id: 'approved', label: `✅ Approved (${products.length})` },
                            { id: 'add', label: '➕ Add Product' },
                            { id: 'pending', label: `⏳ Pending (${pendingProducts.length})` },
                        ].map(st => (
                            <button key={st.id} onClick={() => setProductSubTab(st.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    productSubTab === st.id ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'
                                }`}>
                                {st.label}
                            </button>
                        ))}
                    </div>

                    {/* Approved Products */}
                    {productSubTab === 'approved' && (
                        <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                            <div className='p-4 border-b border-gray-100 flex items-center gap-3'>
                                <p className='font-semibold text-gray-700 flex-shrink-0'>All Approved Products ({products.length})</p>
                                <input
                                    placeholder='Search products...'
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className='ml-auto w-56 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400'
                                />
                            </div>
                            <div className='flex flex-col divide-y divide-gray-50'>
                                {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map((p, i) => (
                                    <div key={i} className='flex items-center gap-4 px-4 py-3 hover:bg-orange-50/30 transition cursor-pointer' onClick={() => setProductModal(p)}>
                                        <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                            <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                                            {p.vendorName && <p className='text-xs text-blue-400'>by {p.vendorName}</p>}
                                        </div>
                                        <p className='font-semibold text-orange-600 text-sm'>₹{p.price}</p>
                                        {p.bestseller && <span className='bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full'>⭐ Best</span>}
                                        <button onClick={e => { e.stopPropagation(); openEdit(p) }}
                                            className='text-blue-500 hover:text-blue-700 text-xs border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition'>
                                            Edit
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); deleteProduct(p._id) }}
                                            className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition'>
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {products.length === 0 && <p className='text-center py-10 text-gray-400'>No approved products</p>}
                            </div>
                        </div>
                    )}

                    {/* Add Product */}
                    {productSubTab === 'add' && (
                        <div className='bg-white rounded-2xl border border-gray-100 shadow p-6'>
                            <p className='font-semibold text-gray-700 mb-5'>Add New Product</p>
                            <form onSubmit={addProduct} className='space-y-4'>
                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-1 block'>Product Name *</label>
                                        <input required placeholder='Product name' value={addForm.name}
                                            onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-1 block'>Price (₹) *</label>
                                        <input required type='number' placeholder='0' value={addForm.price}
                                            onChange={e => setAddForm(p => ({ ...p, price: e.target.value }))}
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                                    </div>
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-1 block'>Description *</label>
                                    <textarea required rows={3} placeholder='Product description' value={addForm.description}
                                        onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none' />
                                </div>
                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-1 block'>Category</label>
                                        <select value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))}
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                            {['Women', 'Men', 'Kids', 'Home Decor'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-600 mb-1 block'>Sub Category</label>
                                        <select value={addForm.subCategory} onChange={e => setAddForm(p => ({ ...p, subCategory: e.target.value }))}
                                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                            {['Kurtiwear', 'SareeWear', 'EthnicWear', 'WesternWear', 'Accessories', 'Footwear', 'Bottomwear', 'Toys', 'Wall Art', 'Lighting'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-2 block'>Sizes</label>
                                    <div className='flex gap-2 flex-wrap'>
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                            <button type='button' key={size} onClick={() => toggleSize(size)}
                                                className={`px-3 py-1 rounded-lg text-xs border transition ${
                                                    addForm.sizes.includes(size)
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'border-gray-300 text-gray-600 hover:border-orange-300'
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
                                                    {addImages[key]
                                                        ? <img src={URL.createObjectURL(addImages[key])} className='w-full h-full object-cover' alt='' />
                                                        : <span className='text-2xl text-gray-400'>+</span>}
                                                </div>
                                                <input type='file' accept='image/*' hidden
                                                    onChange={e => setAddImages(prev => ({ ...prev, [key]: e.target.files[0] }))} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-2 block'>Tags <span className='text-gray-400 font-normal'>(press Enter to add)</span></label>
                                    <div className='flex flex-wrap gap-1.5 mb-2'>
                                        {addForm.tags.map((tag, i) => (
                                            <span key={i} className='flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full'>
                                                #{tag}
                                                <button type='button' onClick={() => setAddForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} className='hover:text-red-500 leading-none'>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        placeholder='e.g. birthday gift, festive, summer...'
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const t = tagInput.trim().toLowerCase()
                                                if (t && !addForm.tags.includes(t)) setAddForm(p => ({ ...p, tags: [...p.tags, t] }))
                                                setTagInput('')
                                            }
                                        }}
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                                </div>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type='checkbox' checked={addForm.bestseller}
                                        onChange={e => setAddForm(p => ({ ...p, bestseller: e.target.checked }))}
                                        className='w-4 h-4' />
                                    <span className='text-sm text-gray-600'>Mark as Bestseller</span>
                                </label>
                                <button type='submit' className='bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-orange-700 transition font-medium'>
                                    Add Product
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Pending Approval */}
                    {productSubTab === 'pending' && (
                        <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                            <div className='p-4 border-b border-gray-100'>
                                <p className='font-semibold text-gray-700'>Pending Vendor Products ({pendingProducts.length})</p>
                            </div>
                            <div className='flex flex-col divide-y divide-gray-50'>
                                {pendingProducts.map((p, i) => (
                                    <div key={i} className='flex items-center gap-4 px-4 py-3 hover:bg-orange-50/30 transition cursor-pointer' onClick={() => setProductModal(p)}>
                                        <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                            <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                                            <p className='text-xs text-blue-400'>by {p.vendorName || p.vendorId}</p>
                                        </div>
                                        <p className='font-semibold text-orange-600 text-sm'>₹{p.price}</p>
                                        <button onClick={e => { e.stopPropagation(); approveProduct(p._id) }}
                                            className='text-green-600 text-xs border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition'>
                                            Approve
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); rejectProduct(p._id) }}
                                            className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition'>
                                            Reject
                                        </button>
                                    </div>
                                ))}
                                {pendingProducts.length === 0 && <p className='text-center py-10 text-gray-400'>No pending products</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (() => {
                const activeOrders = orders.filter(o => o.status !== 'Cancelled')
                const cancelledOrders = orders.filter(o => o.status === 'Cancelled')
                const pool = orderSubTab === 'active' ? activeOrders : cancelledOrders
                const filtered = pool.filter(o =>
                    o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.items?.some(i => i.name?.toLowerCase().includes(orderSearch.toLowerCase()))
                )
                const totalPages = Math.max(1, Math.ceil(filtered.length / ORDER_PAGE_SIZE))
                const page = Math.min(orderPage, totalPages)
                const pageOrders = filtered.slice((page - 1) * ORDER_PAGE_SIZE, page * ORDER_PAGE_SIZE)

                const OrderRow = ({ o, i }) => (
                    <React.Fragment>
                        <tr className='hover:bg-orange-50/30 transition cursor-pointer' onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                            <td className='px-4 py-3 text-gray-400 text-xs font-mono'>{o._id.slice(-8)} <span className='text-gray-300'>{expandedOrder === o._id ? '▲' : '▼'}</span></td>
                            <td className='px-4 py-3 text-gray-600 text-xs'>{o.items?.length || 0} items</td>
                            <td className='px-4 py-3 font-semibold text-orange-600 text-xs'>₹{o.amount}</td>
                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                <button onClick={() => updateOrderPayment(o._id, !o.payment)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer border transition ${
                                        o.payment ? 'bg-green-100 text-green-600 border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                        : 'bg-red-100 text-red-500 border-red-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                                    }`}>{o.payment ? 'Paid ✓' : 'Unpaid ✗'}</button>
                            </td>
                            <td className='px-4 py-3 text-gray-500 text-xs'>{o.paymentMethod}</td>
                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                {orderSubTab === 'cancelled'
                                    ? <span className='px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600'>Cancelled</span>
                                    : <select value={o.status || 'Order Placed'} onChange={e => updateOrderStatus(o._id, e.target.value)}
                                        className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400'>
                                        {['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                }
                            </td>
                            <td className='px-4 py-3 text-gray-400 text-xs'>{new Date(o.date).toLocaleDateString()}</td>
                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                <button onClick={() => deleteOrder(o._id)}
                                    className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition'>Delete</button>
                            </td>
                        </tr>
                        {expandedOrder === o._id && (
                            <tr>
                                <td colSpan={8} className='bg-orange-50/40 px-6 py-4'>
                                    <div className='grid sm:grid-cols-2 gap-4'>
                                        <div>
                                            <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>Items</p>
                                            <div className='flex flex-col gap-2'>
                                                {o.items?.map((item, j) => (
                                                    <div key={j} className='flex items-center gap-3 bg-white rounded-lg p-2 border border-gray-100'>
                                                        <img src={item.image?.[0]} className='w-10 h-10 object-cover rounded border' alt='' />
                                                        <div className='flex-1'>
                                                            <p className='text-xs font-medium text-gray-800'>{item.name}</p>
                                                            <p className='text-xs text-gray-400'>Size: {item.size} · Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className='text-xs font-semibold text-orange-600'>₹{item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>Delivery Address</p>
                                            {o.address && (
                                                <p className='text-xs text-gray-600 leading-relaxed'>
                                                    {o.address.firstName} {o.address.lastName}<br/>
                                                    {o.address.street}, {o.address.city}<br/>
                                                    {o.address.state} {o.address.zipcode}, {o.address.country}<br/>
                                                    📞 {o.address.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )

                return (
                    <div className='space-y-4'>
                        {/* Sub-tabs + search */}
                        <div className='flex flex-wrap items-center gap-3'>
                            <div className='flex gap-1 bg-gray-100 p-1 rounded-xl'>
                                {[{ id: 'active', label: `🛒 Active (${activeOrders.length})` }, { id: 'cancelled', label: `✕ Cancelled (${cancelledOrders.length})` }].map(st => (
                                    <button key={st.id} onClick={() => { setOrderSubTab(st.id); setOrderPage(1); setExpandedOrder(null) }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            orderSubTab === st.id ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}>{st.label}</button>
                                ))}
                            </div>
                            <input placeholder='Search by order ID or item name...'
                                value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(1) }}
                                className='ml-auto w-64 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400' />
                        </div>

                        <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                            <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                                <p className='font-semibold text-gray-700 text-sm'>
                                    {orderSubTab === 'active' ? '🛒' : '✕'} {orderSubTab === 'active' ? 'Active' : 'Cancelled'} Orders
                                    <span className='text-gray-400 font-normal ml-1'>({filtered.length})</span>
                                </p>
                                <p className='text-xs text-gray-400'>Page {page} of {totalPages}</p>
                            </div>
                            <div className='overflow-x-auto'>
                                <table className='w-full text-sm'>
                                    <thead className='bg-gray-50 text-gray-500 text-xs uppercase'>
                                        <tr>
                                            <th className='px-4 py-3 text-left'>Order ID</th>
                                            <th className='px-4 py-3 text-left'>Items</th>
                                            <th className='px-4 py-3 text-left'>Amount</th>
                                            <th className='px-4 py-3 text-left'>Payment</th>
                                            <th className='px-4 py-3 text-left'>Method</th>
                                            <th className='px-4 py-3 text-left'>Status</th>
                                            <th className='px-4 py-3 text-left'>Date</th>
                                            <th className='px-4 py-3 text-left'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-50'>
                                        {pageOrders.map((o, i) => <OrderRow key={o._id} o={o} i={i} />)}
                                    </tbody>
                                </table>
                                {filtered.length === 0 && <p className='text-center py-10 text-gray-400'>No orders found</p>}
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='flex items-center justify-center gap-2 p-4 border-t border-gray-100'>
                                    <button onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className='px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition'>← Prev</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                        <button key={n} onClick={() => setOrderPage(n)}
                                            className={`w-8 h-8 text-xs rounded-lg border transition ${
                                                n === page ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 hover:bg-gray-50'
                                            }`}>{n}</button>
                                    ))}
                                    <button onClick={() => setOrderPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                        className='px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition'>Next →</button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })()}
            {/* Daily Deals */}
            {tab === 'deals' && (
                <div className='space-y-6'>
                    {/* Set Deal Form */}
                    <div className='bg-white rounded-2xl border border-gray-100 shadow p-6'>
                        <p className='font-semibold text-gray-700 mb-4'>🏷️ Set a Deal on a Product</p>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <div className='flex-1'>
                                <label className='text-xs text-gray-500 mb-1 block'>Search & Select Product</label>
                                <input
                                    placeholder='Type product name...'
                                    value={dealSearch}
                                    onChange={e => setDealSearch(e.target.value)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'
                                />
                                {dealSearch && (
                                    <div className='border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-sm'>
                                        {products.filter(p => p.name.toLowerCase().includes(dealSearch.toLowerCase())).slice(0, 8).map(p => (
                                            <div key={p._id}
                                                onClick={() => { setDealForm(f => ({ ...f, productId: p._id })); setDealSearch(p.name) }}
                                                className='flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm'>
                                                <img src={p.image?.[0]} className='w-8 h-8 object-cover rounded' alt='' />
                                                <span className='flex-1 truncate'>{p.name}</span>
                                                <span className='text-orange-600 font-medium text-xs'>₹{p.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='w-32'>
                                <label className='text-xs text-gray-500 mb-1 block'>Deal Price (₹)</label>
                                <input type='number' placeholder='e.g. 499'
                                    value={dealForm.dealPrice}
                                    onChange={e => setDealForm(f => ({ ...f, dealPrice: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'
                                />
                            </div>
                            <div className='w-32'>
                                <label className='text-xs text-gray-500 mb-1 block'>Duration (hours)</label>
                                <input type='number' min='1' max='72'
                                    value={dealForm.hours}
                                    onChange={e => setDealForm(f => ({ ...f, hours: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'
                                />
                            </div>
                            <div className='flex items-end'>
                                <button
                                    onClick={async () => {
                                        if (!dealForm.productId || !dealForm.dealPrice) return toast.error('Select a product and set a deal price')
                                        const { data } = await axios.post(`${backendUrl}/api/admin/deals/set`, dealForm, h)
                                        if (data.success) { toast.success('Deal set!'); setDealForm({ productId: '', dealPrice: '', hours: 24 }); setDealSearch(''); fetchAll() }
                                        else toast.error(data.message)
                                    }}
                                    className='bg-orange-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-600 transition font-medium'>
                                    Set Deal
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Deals */}
                    <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                        <div className='p-4 border-b border-gray-100'>
                            <p className='font-semibold text-gray-700'>Active Deals ({deals.length})</p>
                        </div>
                        <div className='flex flex-col divide-y divide-gray-50'>
                            {deals.map((p, i) => {
                                const pct = Math.round(((p.price - p.dealPrice) / p.price) * 100)
                                const remaining = Math.max(0, new Date(p.dealEndsAt) - Date.now())
                                const hrs = Math.floor(remaining / 3600000)
                                const mins = Math.floor((remaining % 3600000) / 60000)
                                return (
                                    <div key={i} className='flex items-center gap-4 px-4 py-3 hover:bg-orange-50/30 transition'>
                                        <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                            <p className='text-xs text-gray-400'>{p.category}</p>
                                        </div>
                                        <div className='text-center'>
                                            <p className='text-xs text-gray-400 line-through'>₹{p.price}</p>
                                            <p className='text-sm font-bold text-orange-600'>₹{p.dealPrice}</p>
                                        </div>
                                        <span className='bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full'>{pct}% OFF</span>
                                        <span className='text-xs text-gray-400'>⏱ {hrs}h {mins}m left</span>
                                        <button
                                            onClick={async () => {
                                                const { data } = await axios.post(`${backendUrl}/api/admin/deals/remove`, { productId: p._id }, h)
                                                if (data.success) { toast.success('Deal removed'); fetchAll() }
                                                else toast.error(data.message)
                                            }}
                                            className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition'>
                                            Remove
                                        </button>
                                    </div>
                                )
                            })}
                            {deals.length === 0 && (
                                <div className='text-center py-16 text-gray-400'>
                                    <p className='text-4xl mb-3'>🏷️</p>
                                    <p className='text-sm'>No active deals. Set one above!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'bestsellers' && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                    {/* Left: Search + Tabbed Panel */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Search & Mark */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow p-6'>
                            <p className='font-semibold text-gray-700 mb-3'>⭐ Mark a Product as Bestseller</p>
                            <input
                                placeholder='Type to search all products...'
                                value={bsSearch}
                                onChange={e => setBsSearch(e.target.value)}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'
                            />
                            {bsSearch.trim() ? (
                                <div className='mt-2 border border-gray-200 rounded-lg overflow-hidden'>
                                    {(() => {
                                        const filtered = allProducts.filter(p =>
                                            p.name.toLowerCase().includes(bsSearch.toLowerCase())
                                        )
                                        return filtered.length === 0 ? (
                                            <p className='px-4 py-3 text-sm text-gray-400'>No products found</p>
                                        ) : filtered.map(p => (
                                            <div key={p._id} className='flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 border-b border-gray-50 last:border-0'>
                                                <img src={p.image?.[0]} className='w-9 h-9 object-cover rounded flex-shrink-0' alt='' />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-sm font-medium text-gray-800 truncate'>{p.name}</p>
                                                    <p className='text-xs text-gray-400'>{p.category} · ₹{p.price}</p>
                                                </div>
                                                {p.bestseller
                                                    ? <span className='text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full flex-shrink-0'>⭐ Bestseller</span>
                                                    : /^[a-f\d]{24}$/i.test(p._id) && <button
                                                        onClick={async () => {
                                                            const { data } = await axios.post(`${backendUrl}/api/admin/bestseller/set`, { productId: p._id }, h)
                                                            if (data.success) { toast.success('Marked as bestseller'); setBsSearch(''); fetchAll() }
                                                            else toast.error(data.message)
                                                        }}
                                                        className='text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition flex-shrink-0'>
                                                        Mark ⭐
                                                    </button>
                                                }
                                            </div>
                                        ))
                                    })()}
                                </div>
                            ) : (
                                <p className='text-xs text-gray-400 mt-2'>Start typing to search from {allProducts.length} products</p>
                            )}
                        </div>

                        {/* Tabbed: Current Bestsellers / Recommended */}
                        <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                            <div className='flex border-b border-gray-100'>
                                <button
                                    onClick={() => setBsTab('current')}
                                    className={`flex-1 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                                        bsTab === 'current' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}>
                                    ⭐ Current Bestsellers ({bestsellers.length})
                                </button>
                                <button
                                    onClick={() => setBsTab('recommended')}
                                    className={`flex-1 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                                        bsTab === 'recommended' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}>
                                    💡 Recommended ({bsRecommendations.length})
                                </button>
                            </div>

                            {bsTab === 'current' && (
                                <div className='flex flex-col divide-y divide-gray-50'>
                                    {bestsellers.map((p, i) => (
                                        <div key={i} className='flex items-center gap-3 px-4 py-3 hover:bg-orange-50/30 transition'>
                                            <span className='text-gray-300 text-xs font-bold w-5'>#{i + 1}</span>
                                            <img src={p.image?.[0]} className='w-11 h-11 object-cover rounded-lg border border-gray-100' alt='' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                                <p className='text-xs text-gray-400'>{p.category} · ₹{p.price}</p>
                                            </div>
                                            {p.bestseller
                                                ? <span className='bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full'>⭐ Admin</span>
                                                : <span className='bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full'>📦 Top Ordered</span>
                                            }
                                            {p.bestseller && (
                                                <button
                                                    onClick={async () => {
                                                        const { data } = await axios.post(`${backendUrl}/api/admin/bestseller/remove`, { productId: p._id }, h)
                                                        if (data.success) { toast.success('Removed'); fetchAll() }
                                                        else toast.error(data.message)
                                                    }}
                                                    className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition'>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {bestsellers.length === 0 && (
                                        <div className='text-center py-12 text-gray-400'>
                                            <p className='text-3xl mb-2'>⭐</p>
                                            <p className='text-sm'>No bestsellers yet</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {bsTab === 'recommended' && (
                                <div className='flex flex-col divide-y divide-gray-50'>
                                    {bsRecommendations.length === 0 ? (
                                        <div className='text-center py-12 text-gray-400'>
                                            <p className='text-3xl mb-2'>💡</p>
                                            <p className='text-sm'>No recommendations yet</p>
                                        </div>
                                    ) : bsRecommendations.map((p, i) => (
                                        <div key={p._id} className='flex items-center gap-3 px-4 py-3 hover:bg-amber-50/30 transition'>
                                            <span className='text-amber-400 font-bold text-xs w-5'>#{i + 1}</span>
                                            <img src={p.image?.[0]} className='w-11 h-11 object-cover rounded-lg border border-gray-100' alt='' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                                <p className='text-xs text-gray-400'>{p.category} · ₹{p.price}</p>
                                            </div>
                                            <span className='bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full'>{p.orderCount} orders</span>
                                            <button
                                                onClick={async () => {
                                                    const { data } = await axios.post(`${backendUrl}/api/admin/bestseller/set`, { productId: p._id }, h)
                                                    if (data.success) { toast.success('Marked!'); fetchAll() }
                                                    else toast.error(data.message)
                                                }}
                                                className='text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition'>
                                                Mark ⭐
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: sticky info */}
                    <div className='lg:col-span-1 sticky top-24'>
                        <div className='bg-amber-50 border border-amber-200 rounded-2xl p-5'>
                            <p className='font-semibold text-amber-800 mb-1'>ℹ️ How it works</p>
                            <ul className='text-xs text-amber-700 space-y-2 mt-3'>
                                <li>⭐ Admin-marked products always appear first</li>
                                <li>📦 Remaining slots filled by top-ordered products</li>
                                <li>🔢 Max 5 bestsellers shown on the site</li>
                                <li>💡 Recommended tab shows non-bestseller products sorted by order count</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'support' && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                    {/* Ticket List */}
                    <div className='lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                        <div className='p-4 border-b border-gray-100'>
                            <p className='font-semibold text-gray-700'>🎧 Support Tickets ({supportTickets.length})</p>
                        </div>
                        <div className='flex flex-col divide-y divide-gray-50 max-h-[600px] overflow-y-auto'>
                            {supportTickets.map((t, i) => (
                                <div key={i} onClick={() => setActiveTicket(t)}
                                    className={`px-4 py-3 cursor-pointer hover:bg-orange-50/40 transition ${
                                        activeTicket?._id === t._id ? 'bg-orange-50 border-l-2 border-orange-400' : ''
                                    }`}>
                                    <div className='flex items-center justify-between mb-1'>
                                        <p className='text-sm font-medium text-gray-800 truncate'>{t.category}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-1 ${
                                            t.status === 'Open' ? 'bg-blue-100 text-blue-600' :
                                            t.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                                            t.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>{t.status}</span>
                                    </div>
                                    <p className='text-xs text-gray-500 truncate'>{t.message}</p>
                                    <p className='text-[10px] text-gray-400 mt-1'>Order: {t.orderId?.slice(-8)} · {new Date(t.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {supportTickets.length === 0 && (
                                <div className='text-center py-16 text-gray-400'>
                                    <p className='text-3xl mb-2'>🎧</p>
                                    <p className='text-sm'>No support tickets yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Panel */}
                    <div className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow overflow-hidden flex flex-col' style={{ minHeight: 480 }}>
                        {!activeTicket ? (
                            <div className='flex-1 flex items-center justify-center text-gray-400'>
                                <div className='text-center'>
                                    <p className='text-4xl mb-3'>💬</p>
                                    <p className='text-sm'>Select a ticket to view the conversation</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Ticket Header */}
                                <div className='px-5 py-4 border-b border-gray-100 flex items-center justify-between'>
                                    <div>
                                        <p className='font-semibold text-gray-800'>{activeTicket.category}</p>
                                        <p className='text-xs text-gray-400'>Order: <span className='font-mono'>{activeTicket.orderId?.slice(-10)}</span> · User: {activeTicket.userId?.slice(-8)}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            onClick={() => {
                                                const o = orders.find(x => x._id === activeTicket.orderId)
                                                setTicketOrderModal(o || { _id: activeTicket.orderId, _notFound: true })
                                            }}
                                            className='text-xs border border-blue-200 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition'>
                                            📦 View Order
                                        </button>
                                        <select
                                            value={activeTicket.status}
                                            onChange={async (e) => {
                                                const { data } = await axios.post(`${backendUrl}/api/support/reply/admin`,
                                                    { ticketId: activeTicket._id, message: `Status updated to: ${e.target.value}`, status: e.target.value }, h)
                                                if (data.success) { setActiveTicket(data.ticket); fetchAll() }
                                                else toast.error(data.message)
                                            }}
                                            className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400'>
                                            <option>Open</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                            <option>Closed</option>
                                        </select>
                                        {activeTicket.category === 'Cancel Order' && activeTicket.status !== 'Resolved' && (
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Cancel this order and resolve the ticket?')) return
                                                    const { data } = await axios.post(`${backendUrl}/api/support/reply/admin`,
                                                        { ticketId: activeTicket._id, message: 'Your order has been cancelled as requested. Refund (if applicable) will be processed within 5-7 business days.', status: 'Resolved', cancelOrder: true }, h)
                                                    if (data.success) { toast.success('Order cancelled & ticket resolved'); setActiveTicket(data.ticket); fetchAll() }
                                                    else toast.error(data.message)
                                                }}
                                                className='text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition'>
                                                ✕ Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
                                    <div className='flex justify-end'>
                                        <div className='bg-orange-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[70%]'>
                                            <p className='font-medium mb-0.5 text-orange-100 text-[10px]'>{activeTicket.category}</p>
                                            {activeTicket.message}
                                        </div>
                                    </div>
                                    {activeTicket.replies.map((r, i) => (
                                        <div key={i} className={`flex ${r.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`text-xs rounded-2xl px-3 py-2 max-w-[70%] ${
                                                r.sender === 'user'
                                                    ? 'bg-orange-500 text-white rounded-tr-sm'
                                                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                            }`}>
                                                {r.sender === 'admin' && <p className='text-[10px] text-gray-500 mb-0.5 font-medium'>You (Admin)</p>}
                                                {r.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Input */}
                                {!['Resolved', 'Closed'].includes(activeTicket.status) && (
                                    <div className='flex gap-2 p-3 border-t border-gray-100'>
                                        <input value={adminReply} onChange={e => setAdminReply(e.target.value)}
                                            onKeyDown={async (e) => {
                                                if (e.key !== 'Enter' || !adminReply.trim()) return
                                                const { data } = await axios.post(`${backendUrl}/api/support/reply/admin`,
                                                    { ticketId: activeTicket._id, message: adminReply, status: 'In Progress' }, h)
                                                if (data.success) { setActiveTicket(data.ticket); setAdminReply(''); fetchAll() }
                                                else toast.error(data.message)
                                            }}
                                            placeholder='Type reply and press Enter...'
                                            className='flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                                        <button
                                            onClick={async () => {
                                                if (!adminReply.trim()) return
                                                const { data } = await axios.post(`${backendUrl}/api/support/reply/admin`,
                                                    { ticketId: activeTicket._id, message: adminReply, status: 'In Progress' }, h)
                                                if (data.success) { setActiveTicket(data.ticket); setAdminReply(''); fetchAll() }
                                                else toast.error(data.message)
                                            }}
                                            className='bg-orange-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-orange-600 transition'>➤</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {tab === 'returns' && (
                <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                    <div className='p-4 border-b border-gray-100'>
                        <p className='font-semibold text-gray-700'>↩️ Returns & Exchanges ({returnRequests.length})</p>
                    </div>
                    <div className='flex flex-col divide-y divide-gray-50'>
                        {returnRequests.map((r, i) => (
                            <div key={i} className='px-5 py-4 hover:bg-orange-50/30 transition'>
                                <div className='flex items-center justify-between mb-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            r.type === 'return' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                        }`}>{r.type === 'return' ? '↩️ Return' : '🔄 Exchange'}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            r.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                            r.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                            r.status === 'Completed' ? 'bg-purple-100 text-purple-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>{r.status}</span>
                                    </div>
                                    <p className='text-xs text-gray-400'>{new Date(r.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className='text-sm text-gray-700 mb-1'>Reason: {r.reason}</p>
                                {r.details && <p className='text-xs text-gray-500 mb-1'>{r.details}</p>}
                                <p className='text-xs text-gray-400 mb-3'>Order: {r.orderId?.slice(-10)} · User: {r.userId?.slice(-8)}</p>
                                <div className='flex items-center gap-2'>
                                    <select value={r.status}
                                        onChange={async (e) => {
                                            const { data } = await axios.post(`${backendUrl}/api/return/update`,
                                                { requestId: r._id, status: e.target.value }, h)
                                            if (data.success) { toast.success('Status updated'); fetchAll() }
                                            else toast.error(data.message)
                                        }}
                                        className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400'>
                                        <option>Pending</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                        <option>Completed</option>
                                    </select>
                                    <input placeholder='Add note...' defaultValue={r.adminNote}
                                        onBlur={async (e) => {
                                            if (e.target.value === r.adminNote) return
                                            await axios.post(`${backendUrl}/api/return/update`,
                                                { requestId: r._id, status: r.status, adminNote: e.target.value }, h)
                                        }}
                                        className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 flex-1' />
                                </div>
                            </div>
                        ))}
                        {returnRequests.length === 0 && (
                            <div className='text-center py-16 text-gray-400'>
                                <p className='text-4xl mb-3'>↩️</p>
                                <p className='text-sm font-medium text-gray-500'>No return requests yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>

            {/* Ticket Order Modal */}
            {ticketOrderModal && (
                <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4' onClick={() => setTicketOrderModal(null)}>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800'>📦 Order Details</h3>
                            <button onClick={() => setTicketOrderModal(null)} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>✕</button>
                        </div>
                        {ticketOrderModal._notFound ? (
                            <p className='text-sm text-gray-500 text-center py-6'>Order not found in current data. It may have been deleted.</p>
                        ) : (
                            <>
                                <div className='grid grid-cols-2 gap-3 text-xs'>
                                    <div><p className='text-gray-400'>Order ID</p><p className='font-mono font-medium text-gray-700'>{ticketOrderModal._id?.slice(-10)}</p></div>
                                    <div><p className='text-gray-400'>Date</p><p className='font-medium text-gray-700'>{new Date(ticketOrderModal.date).toLocaleDateString()}</p></div>
                                    <div><p className='text-gray-400'>Amount</p><p className='font-bold text-orange-600'>₹{ticketOrderModal.amount}</p></div>
                                    <div><p className='text-gray-400'>Payment</p><p className='font-medium'>{ticketOrderModal.payment ? <span className='text-green-600'>Paid</span> : <span className='text-red-500'>Unpaid</span>}</p></div>
                                </div>
                                <div>
                                    <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>Items</p>
                                    <div className='flex flex-col gap-2'>
                                        {ticketOrderModal.items?.map((item, j) => (
                                            <div key={j} className='flex items-center gap-3 bg-gray-50 rounded-lg p-2'>
                                                <img src={item.image?.[0]} className='w-10 h-10 object-cover rounded border' alt='' />
                                                <div className='flex-1'>
                                                    <p className='text-xs font-medium text-gray-800'>{item.name}</p>
                                                    <p className='text-xs text-gray-400'>Size: {item.size} · Qty: {item.quantity}</p>
                                                </div>
                                                <p className='text-xs font-semibold text-orange-600'>₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {ticketOrderModal.address && (
                                    <div>
                                        <p className='text-xs font-semibold text-gray-500 uppercase mb-1'>Delivery Address</p>
                                        <p className='text-xs text-gray-600 leading-relaxed'>
                                            {ticketOrderModal.address.firstName} {ticketOrderModal.address.lastName}<br/>
                                            {ticketOrderModal.address.street}, {ticketOrderModal.address.city}, {ticketOrderModal.address.state} {ticketOrderModal.address.zipcode}<br/>
                                            {ticketOrderModal.address.country} · 📞 {ticketOrderModal.address.phone}
                                        </p>
                                    </div>
                                )}
                                <div className='border-t border-gray-100 pt-3 flex flex-wrap gap-2'>
                                    <p className='text-xs font-semibold text-gray-500 w-full mb-1'>Quick Actions</p>
                                    <select
                                        value={ticketOrderModal.status || 'Order Placed'}
                                        onChange={async (e) => {
                                            await updateOrderStatus(ticketOrderModal._id, e.target.value)
                                            setTicketOrderModal(o => ({ ...o, status: e.target.value }))
                                        }}
                                        className='text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400'>
                                        {['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <button
                                        onClick={async () => {
                                            await updateOrderPayment(ticketOrderModal._id, !ticketOrderModal.payment)
                                            setTicketOrderModal(o => ({ ...o, payment: !o.payment }))
                                        }}
                                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                            ticketOrderModal.payment
                                                ? 'border-red-200 text-red-500 hover:bg-red-50'
                                                : 'border-green-200 text-green-600 hover:bg-green-50'
                                        }`}>
                                        {ticketOrderModal.payment ? 'Mark Unpaid' : 'Mark Paid'}
                                    </button>
                                    <button
                                        onClick={() => { setTab('orders'); setTicketOrderModal(null) }}
                                        className='text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition'>
                                        Open in Orders Tab →
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
