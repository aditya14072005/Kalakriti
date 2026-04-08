import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const AdminDashboard = () => {
    const { backendUrl, token, role, navigate, logout } = useContext(ShopContext)
    const location = useLocation()
    const [tab, setTab] = useState(location.state?.tab || 'overview')
    const [productSubTab, setProductSubTab] = useState('approved')
    const [addForm, setAddForm] = useState({ name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false })
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
    const [productModal, setProductModal] = useState(null) // product object
    const [vendorRequests, setVendorRequests] = useState([])
    const [returnRequests, setReturnRequests] = useState([])

    const h = { headers: { token } }

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
                fd.append(k, k === 'sizes' ? JSON.stringify(v) : v)
            )
            Object.entries(addImages).forEach(([k, v]) => { if (v) fd.append(k, v) })
            const { data } = await axios.post(`${backendUrl}/api/product/add`, fd, h)
            if (data.success) {
                toast.success('Product added!')
                setAddForm({ name: '', description: '', price: '', category: 'Women', subCategory: 'Kurtiwear', sizes: [], bestseller: false })
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
        { id: 'returns', label: '↩️ Returns' },
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
                            <div className='p-4 border-b border-gray-100'>
                                <p className='font-semibold text-gray-700'>All Approved Products ({products.length})</p>
                            </div>
                            <div className='flex flex-col divide-y divide-gray-50'>
                                {products.map((p, i) => (
                                    <div key={i} className='flex items-center gap-4 px-4 py-3 hover:bg-orange-50/30 transition cursor-pointer' onClick={() => setProductModal(p)}>
                                        <img src={p.image?.[0]} className='w-12 h-12 object-cover rounded-lg border border-gray-100' alt='' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-800 text-sm truncate'>{p.name}</p>
                                            <p className='text-xs text-gray-400'>{p.category} · {p.subCategory}</p>
                                            {p.vendorName && <p className='text-xs text-blue-400'>by {p.vendorName}</p>}
                                        </div>
                                        <p className='font-semibold text-orange-600 text-sm'>₹{p.price}</p>
                                        {p.bestseller && <span className='bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full'>⭐ Best</span>}
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
            {tab === 'orders' && (
                <div className='bg-white rounded-2xl border border-gray-100 shadow overflow-hidden'>
                    <div className='p-4 border-b border-gray-100'>
                        <p className='font-semibold text-gray-700'>All Orders ({orders.length})</p>
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
                                {orders.map((o, i) => (
                                    <React.Fragment key={i}>
                                        <tr className='hover:bg-orange-50/30 transition cursor-pointer' onClick={() => setExpandedOrder(expandedOrder === i ? null : i)}>
                                            <td className='px-4 py-3 text-gray-400 text-xs font-mono'>{o._id.slice(-8)} <span className='text-gray-300'>{expandedOrder === i ? '▲' : '▼'}</span></td>
                                            <td className='px-4 py-3 text-gray-600'>{o.items?.length || 0} items</td>
                                            <td className='px-4 py-3 font-semibold text-orange-600'>₹{o.amount}</td>
                                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => updateOrderPayment(o._id, !o.payment)}
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer border transition ${
                                                        o.payment
                                                            ? 'bg-green-100 text-green-600 border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                                            : 'bg-red-100 text-red-500 border-red-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                                                    }`}>
                                                    {o.payment ? 'Paid ✓' : 'Unpaid ✗'}
                                                </button>
                                            </td>
                                            <td className='px-4 py-3 text-gray-500 text-xs'>{o.paymentMethod}</td>
                                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                                <select value={o.status || 'Order Placed'} onChange={e => updateOrderStatus(o._id, e.target.value)}
                                                    className='text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400'>
                                                    {['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='px-4 py-3 text-gray-400 text-xs'>{new Date(o.date).toLocaleDateString()}</td>
                                            <td className='px-4 py-3' onClick={e => e.stopPropagation()}>
                                                <button onClick={() => deleteOrder(o._id)}
                                                    className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition'>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrder === i && (
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
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && <p className='text-center py-10 text-gray-400'>No orders yet</p>}
                    </div>
                </div>
            )}
            {/* Returns */}
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
        </div>
    )
}

export default AdminDashboard
