import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import SupportChat from './SupportChat'
import { ShopContext } from '../context/ShopContext'

const FloatingSupport = () => {
    const { token, backendUrl, role } = useContext(ShopContext)
    const [open, setOpen] = useState(false)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (token && role === 'customer') {
            axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } })
                .then(({ data }) => {
                    if (data.success) setOrders(
                        data.orders.filter(o => o.paymentMethod === 'COD' || o.payment === true)
                    )
                }).catch(() => {})
        }
    }, [token, role])

    if (!token || role !== 'customer') return null

    return (
        <>
            <button
                onClick={() => setOpen(o => !o)}
                className='fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95'
                title='Support Chat'
            >
                {open ? '✕' : '🎧'}
            </button>

            {open && (
                <div className='fixed bottom-24 right-6 z-50 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden'>
                    <SupportChat
                        orders={orders}
                        onClose={() => setOpen(false)}
                    />
                </div>
            )}
        </>
    )
}

export default FloatingSupport
