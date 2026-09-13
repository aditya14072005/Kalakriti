import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

// orderId + orderName: open a specific order ticket
// floating: show as floating panel (no orderId pre-selected)
const SupportChat = ({ orderId, orderName, onClose, orders = [] }) => {
    const { backendUrl, token } = useContext(ShopContext)
    const [tickets, setTickets] = useState([])
    const [activeTicket, setActiveTicket] = useState(null)
    const [reply, setReply] = useState('')
    const [newForm, setNewForm] = useState({ category: 'Cancel Order', message: '', orderId: orderId || '' })
    const [view, setView] = useState(orderId ? 'new' : 'list') // 'list' | 'new' | 'chat'
    const bottomRef = useRef(null)

    const h = { headers: { token } }

    const loadTickets = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/support/my`, h)
            if (data.success) {
                setTickets(data.tickets)
                // if orderId given, check if ticket already exists for this order
                if (orderId) {
                    const existing = data.tickets.find(t => t.orderId === orderId)
                    if (existing) { setActiveTicket(existing); setView('chat') }
                }
            }
        } catch {}
    }

    useEffect(() => { if (token) loadTickets() }, [token])

    useEffect(() => {
        if (view === 'chat') bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeTicket?.replies, view])

    const submitTicket = async () => {
        if (!newForm.message.trim()) return toast.error('Please describe your issue')
        if (!newForm.orderId) return toast.error('Please select an order')
        try {
            const { data } = await axios.post(`${backendUrl}/api/support/submit`, newForm, h)
            if (data.success) {
                toast.success('Support ticket created!')
                setActiveTicket(data.ticket)
                setView('chat')
                loadTickets()
            } else toast.error(data.message)
        } catch (e) { toast.error(e.message) }
    }

    const sendReply = async () => {
        if (!reply.trim()) return
        try {
            const { data } = await axios.post(`${backendUrl}/api/support/reply/user`,
                { ticketId: activeTicket._id, message: reply }, h)
            if (data.success) { setActiveTicket(data.ticket); setReply(''); loadTickets() }
            else toast.error(data.message)
        } catch (e) { toast.error(e.message) }
    }

    const statusColor = (s) => ({
        'Open': 'bg-blue-100 text-blue-600',
        'In Progress': 'bg-yellow-100 text-yellow-600',
        'Resolved': 'bg-green-100 text-green-600',
        'Closed': 'bg-gray-100 text-gray-500',
    }[s] || 'bg-gray-100 text-gray-500')

    return (
        <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 bg-orange-500 text-white rounded-t-2xl flex-shrink-0'>
                <div className='flex items-center gap-2'>
                    {view !== 'list' && (
                        <button onClick={() => { setView('list'); setActiveTicket(null) }} className='text-white/80 hover:text-white mr-1'>←</button>
                    )}
                    <span className='text-lg'>🎧</span>
                    <div>
                        <p className='font-semibold text-sm leading-none'>Support Chat</p>
                        <p className='text-[10px] text-orange-100'>
                            {view === 'chat' && activeTicket ? activeTicket.category : 'Kalakriti Help'}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className='text-white/80 hover:text-white text-xl leading-none'>✕</button>
            </div>

            {/* Body */}
            <div className='flex-1 overflow-y-auto'>

                {/* List view */}
                {view === 'list' && (
                    <div className='p-3 flex flex-col gap-2'>
                        <button onClick={() => { setNewForm(f => ({ ...f, orderId: orderId || '' })); setView('new') }}
                            className='w-full bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition'>
                            + New Support Request
                        </button>
                        {tickets.length === 0 && (
                            <p className='text-center text-gray-400 text-sm py-8'>No support tickets yet.</p>
                        )}
                        {tickets.map(t => (
                            <div key={t._id} onClick={() => { setActiveTicket(t); setView('chat') }}
                                className='border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-orange-50 transition'>
                                <div className='flex items-center justify-between mb-1'>
                                    <p className='text-sm font-medium text-gray-800'>{t.category}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>{t.status}</span>
                                </div>
                                <p className='text-xs text-gray-500 truncate'>{t.message}</p>
                                <p className='text-[10px] text-gray-400 mt-1'>{new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* New ticket form */}
                {view === 'new' && (
                    <div className='p-4 flex flex-col gap-3'>
                        <p className='text-sm font-semibold text-gray-700'>New Support Request</p>
                        <div>
                            <label className='text-xs text-gray-500 mb-1 block'>Category</label>
                            <select value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                <option>Cancel Order</option>
                                <option>Wrong Item</option>
                                <option>Delivery Issue</option>
                                <option>Payment Issue</option>
                                <option>Other</option>
                            </select>
                        </div>
                        {!orderId && (
                            <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Select Order</label>
                                <select value={newForm.orderId} onChange={e => setNewForm(f => ({ ...f, orderId: e.target.value }))}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'>
                                    <option value=''>-- Select an order --</option>
                                    {orders.map(o => (
                                        <option key={o._id} value={o._id}>
                                            {o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1}` : ''} — {new Date(o.date).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {orderId && orderName && (
                            <div className='bg-orange-50 rounded-lg px-3 py-2 text-xs text-orange-700'>
                                📦 Order: <span className='font-medium'>{orderName}</span>
                            </div>
                        )}
                        <div>
                            <label className='text-xs text-gray-500 mb-1 block'>Describe your issue</label>
                            <textarea rows={4} value={newForm.message} onChange={e => setNewForm(f => ({ ...f, message: e.target.value }))}
                                placeholder='Tell us what happened...'
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none' />
                        </div>
                        <button onClick={submitTicket}
                            className='bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition'>
                            Submit Request
                        </button>
                    </div>
                )}

                {/* Chat view */}
                {view === 'chat' && activeTicket && (
                    <div className='flex flex-col'>
                        <div className='px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between'>
                            <p className='text-xs text-gray-500'>Order: <span className='font-mono'>{activeTicket.orderId?.slice(-10)}</span></p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(activeTicket.status)}`}>{activeTicket.status}</span>
                        </div>
                        <div className='p-3 flex flex-col gap-2 min-h-[200px]'>
                            {/* Initial message */}
                            <div className='flex justify-end'>
                                <div className='bg-orange-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]'>
                                    <p className='font-medium mb-0.5 text-orange-100 text-[10px]'>{activeTicket.category}</p>
                                    {activeTicket.message}
                                </div>
                            </div>
                            {activeTicket.replies.map((r, i) => (
                                <div key={i} className={`flex ${r.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`text-xs rounded-2xl px-3 py-2 max-w-[80%] ${
                                        r.sender === 'user'
                                            ? 'bg-orange-500 text-white rounded-tr-sm'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                        {r.sender === 'admin' && <p className='text-[10px] text-gray-500 mb-0.5 font-medium'>Support Team</p>}
                                        {r.message}
                                    </div>
                                </div>
                            ))}
                            {activeTicket.replies.length === 0 && (
                                <p className='text-center text-xs text-gray-400 py-4'>Waiting for admin response...</p>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                )}
            </div>

            {/* Reply input */}
            {view === 'chat' && activeTicket && !['Resolved', 'Closed'].includes(activeTicket.status) && (
                <div className='flex gap-2 p-3 border-t border-gray-100 flex-shrink-0'>
                    <input value={reply} onChange={e => setReply(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendReply()}
                        placeholder='Type a message...'
                        className='flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400' />
                    <button onClick={sendReply}
                        className='bg-orange-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-orange-600 transition'>
                        ➤
                    </button>
                </div>
            )}
            {view === 'chat' && activeTicket && ['Resolved', 'Closed'].includes(activeTicket.status) && (
                <div className='px-4 py-3 bg-green-50 border-t border-green-100 text-center flex-shrink-0'>
                    <p className='text-xs text-green-600 font-medium'>✅ This ticket has been {activeTicket.status.toLowerCase()}</p>
                </div>
            )}
        </div>
    )
}

export default SupportChat
