import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const STATUS_COLORS = {
    'Order Placed': 'bg-blue-100 text-blue-700',
    'Packing': 'bg-yellow-100 text-yellow-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
}

const STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered']

const TrackOrder = ({ status }) => {
    if (status === 'Cancelled') return (
        <div className='flex items-center gap-2 py-3 px-4 bg-red-50 rounded-lg'>
            <span className='text-red-500 text-lg'>✕</span>
            <p className='text-sm text-red-600 font-medium'>Order Cancelled</p>
        </div>
    )
    const activeIdx = STEPS.indexOf(status)
    return (
        <div className='py-3'>
            <p className='text-xs font-semibold text-gray-500 uppercase mb-3'>Order Tracking</p>
            <div className='flex items-center'>
                {STEPS.map((step, i) => {
                    const done = i <= activeIdx
                    const active = i === activeIdx
                    return (
                        <React.Fragment key={step}>
                            <div className='flex flex-col items-center gap-1'>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                    ${active ? 'bg-orange-500 border-orange-500 text-white scale-110 shadow-md shadow-orange-200'
                                    : done ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {done && !active ? '✓' : i + 1}
                                </div>
                                <p className={`text-[9px] text-center w-14 leading-tight
                                    ${active ? 'text-orange-600 font-semibold' : done ? 'text-green-600' : 'text-gray-400'}`}>
                                    {step}
                                </p>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${i < activeIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext)
    const location = useLocation()
    const [orders, setOrders] = useState([])
    const [expanded, setExpanded] = useState(null)
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'orders')
    const [returnForm, setReturnForm] = useState({ orderId: '', reason: '', details: '' })
    const [returnSubmitted, setReturnSubmitted] = useState(false)

    const loadOrders = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } })
            if (data.success) setOrders(data.orders.reverse())
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => { if (token) loadOrders() }, [token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl mb-4'><Title text1={'MY'} text2={'ACCOUNT'} /></div>

            {/* Tabs */}
            <div className='flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap'>
                {[
                    { id: 'orders', label: '📦 My Orders' },
                    { id: 'track', label: '🚚 Track Order' },
                    { id: 'address', label: '📍 Addresses' },
                    { id: 'returns', label: '↩️ Returns & Exchanges' },
                ].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === t.id ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className='flex flex-col gap-4'>
                    {orders.length === 0 && (
                        <div className='text-center py-20'>
                            <p className='text-4xl mb-4'>📦</p>
                            <p className='text-gray-500'>No orders yet.</p>
                        </div>
                    )}
                    {orders.map((order, i) => (
                        <div key={order._id || i} className='border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
                            <div
                                className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 cursor-pointer hover:bg-orange-50 transition'
                                onClick={() => setExpanded(expanded === i ? null : i)}
                            >
                                <div className='flex items-center gap-4'>
                                    <img src={order.items?.[0]?.image?.[0]} className='w-14 h-14 object-cover rounded-lg border' alt='' />
                                    <div>
                                        <p className='font-semibold text-gray-800 text-sm'>
                                            {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                                            {order.items?.length > 1 && <span className='text-gray-400 font-normal'> — {order.items[0]?.name} & more</span>}
                                            {order.items?.length === 1 && <span className='text-gray-400 font-normal'> — {order.items[0]?.name}</span>}
                                        </p>
                                        <p className='text-xs text-gray-400 mt-0.5'>Ordered: {new Date(order.date).toDateString()}</p>
                                        <p className='text-xs text-gray-400'>Payment: {order.paymentMethod} · {order.payment ? <span className='text-green-600'>Paid</span> : <span className='text-red-500'>Pending</span>}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <p className='font-bold text-orange-600'>{currency}{order.amount}</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                    <span className='text-gray-400 text-sm'>{expanded === i ? '▲' : '▼'}</span>
                                </div>
                            </div>
                            {expanded === i && (
                                <div className='p-4 border-t border-gray-100'>
                                    <TrackOrder status={order.status} />
                                    <div className='border-t border-gray-100 mt-2 pt-4'>
                                        <p className='text-xs font-semibold text-gray-500 uppercase mb-3'>Items</p>
                                        <div className='flex flex-col gap-3 mb-4'>
                                            {order.items?.map((item, j) => (
                                                <div key={j} className='flex items-center gap-4 bg-gray-50 rounded-lg p-3'>
                                                    <img src={item.image?.[0]} className='w-12 h-12 object-cover rounded-lg border' alt='' />
                                                    <div className='flex-1'>
                                                        <p className='font-medium text-sm text-gray-800'>{item.name}</p>
                                                        <p className='text-xs text-gray-500'>Size: {item.size} · Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className='font-semibold text-sm text-orange-600'>{currency}{item.price * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {order.address && (
                                            <div className='mb-4'>
                                                <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>Delivery Address</p>
                                                <p className='text-sm text-gray-700'>
                                                    {order.address.firstName} {order.address.lastName}<br />
                                                    {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}<br />
                                                    {order.address.country} · {order.address.phone}
                                                </p>
                                            </div>
                                        )}
                                        <div className='flex justify-between text-sm text-gray-600 border-t pt-3'>
                                            <span>Order ID: <span className='font-mono text-xs text-gray-400'>{order._id?.slice(-10)}</span></span>
                                            <span className='font-bold text-gray-800'>Total: {currency}{order.amount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Track Tab */}
            {activeTab === 'track' && (
                <div className='flex flex-col gap-4'>
                    {orders.length === 0 && <p className='text-gray-400 text-center py-10'>No orders to track.</p>}
                    {orders.map((order, i) => (
                        <div key={order._id || i} className='border border-gray-200 rounded-xl p-4 shadow-sm'>
                            <div className='flex items-center justify-between mb-3'>
                                <div>
                                    <p className='font-semibold text-gray-800 text-sm'>{order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}</p>
                                    <p className='text-xs text-gray-400'>Order ID: {order._id?.slice(-10)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                            </div>
                            <TrackOrder status={order.status} />
                        </div>
                    ))}
                </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
                <div className='max-w-lg'>
                    <p className='text-sm text-gray-500 mb-4'>Addresses used in your past orders:</p>
                    {orders.length === 0 && <p className='text-gray-400 text-center py-10'>No saved addresses yet. Place an order to save an address.</p>}
                    <div className='flex flex-col gap-3'>
                        {[...new Map(orders.filter(o => o.address).map(o => [
                            `${o.address.street}-${o.address.city}`, o.address
                        ])).values()].map((addr, i) => (
                            <div key={i} className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
                                <p className='font-semibold text-gray-800 text-sm'>{addr.firstName} {addr.lastName}</p>
                                <p className='text-sm text-gray-600 mt-1'>{addr.street}, {addr.city}, {addr.state} {addr.zipcode}</p>
                                <p className='text-sm text-gray-600'>{addr.country} · {addr.phone}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Returns Tab */}
            {activeTab === 'returns' && (
                <div className='max-w-lg'>
                    {returnSubmitted ? (
                        <div className='text-center py-12'>
                            <p className='text-4xl mb-3'>✅</p>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>Return Request Submitted!</h3>
                            <p className='text-sm text-gray-500 mb-4'>Our team will review your request and contact you within 2-3 business days.</p>
                            <button onClick={() => { setReturnSubmitted(false); setReturnForm({ orderId: '', reason: '', details: '' }) }}
                                className='bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600 transition'>
                                Submit Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className='text-sm text-gray-500 mb-5'>Fill in the form below to request a return or exchange. We accept returns within 7 days of delivery.</p>
                            <div className='flex flex-col gap-4'>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-1 block'>Select Order</label>
                                    <select value={returnForm.orderId} onChange={e => setReturnForm(p => ({ ...p, orderId: e.target.value }))}
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                        <option value=''>-- Select an order --</option>
                                        {orders.filter(o => o.status === 'Delivered').map(o => (
                                            <option key={o._id} value={o._id}>
                                                {o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length-1} more` : ''} — {new Date(o.date).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                    {orders.filter(o => o.status === 'Delivered').length === 0 && (
                                        <p className='text-xs text-gray-400 mt-1'>Only delivered orders are eligible for returns.</p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-1 block'>Reason</label>
                                    <select value={returnForm.reason} onChange={e => setReturnForm(p => ({ ...p, reason: e.target.value }))}
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                        <option value=''>-- Select reason --</option>
                                        <option>Wrong item received</option>
                                        <option>Damaged / defective product</option>
                                        <option>Size doesn't fit</option>
                                        <option>Not as described</option>
                                        <option>Changed my mind</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-600 mb-1 block'>Additional Details</label>
                                    <textarea rows={3} value={returnForm.details} onChange={e => setReturnForm(p => ({ ...p, details: e.target.value }))}
                                        placeholder='Describe the issue in detail...'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none' />
                                </div>
                                <button
                                    onClick={() => {
                                        if (!returnForm.orderId || !returnForm.reason) { toast.error('Please select an order and reason'); return }
                                        setReturnSubmitted(true)
                                        toast.success('Return request submitted!')
                                    }}
                                    className='bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-orange-600 transition font-medium'>
                                    Submit Return Request
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Orders
