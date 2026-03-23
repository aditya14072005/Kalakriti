import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const { backendUrl, token, cartItems, products, delivery_fee, getCartAmount, navigate, setCartItems } = useContext(ShopContext)
    const [method, setMethod] = useState('cod')
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    })

    const onChangeHandler = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const orderItems = []
            for (const itemId in cartItems) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        const product = products.find(p => p._id === itemId)
                        if (product) orderItems.push({ ...product, size, quantity: cartItems[itemId][size] })
                    }
                }
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            if (method === 'cod') {
                const { data } = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } })
                if (data.success) { setCartItems({}); navigate('/orders'); toast.success('Order placed!') }
                else toast.error(data.message)
            } else if (method === 'stripe') {
                const { data } = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } })
                if (data.success) window.location.replace(data.session_url)
                else toast.error(data.message)
            } else if (method === 'razorpay') {
                const { data } = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } })
                if (data.success) {
                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        amount: data.razorpayOrder.amount,
                        currency: 'INR',
                        name: 'KALAKRITI',
                        order_id: data.razorpayOrder.id,
                        handler: async (response) => {
                            const verify = await axios.post(`${backendUrl}/api/order/verifyRazorpay`,
                                { razorpay_order_id: response.razorpay_order_id }, { headers: { token } })
                            if (verify.data.success) { setCartItems({}); navigate('/orders'); toast.success('Payment successful!') }
                        }
                    }
                    new window.Razorpay(options).open()
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const inputClass = 'border border-gray-300 rounded py-1.5 px-3.5 w-full'

    return (
        <form onSubmit={onSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

            {/* Delivery Info */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} placeholder='First name' className={inputClass} />
                    <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} placeholder='Last name' className={inputClass} />
                </div>
                <input required name='email' onChange={onChangeHandler} value={formData.email} type='email' placeholder='Email address' className={inputClass} />
                <input required name='street' onChange={onChangeHandler} value={formData.street} placeholder='Street' className={inputClass} />
                <div className='flex gap-3'>
                    <input required name='city' onChange={onChangeHandler} value={formData.city} placeholder='City' className={inputClass} />
                    <input required name='state' onChange={onChangeHandler} value={formData.state} placeholder='State' className={inputClass} />
                </div>
                <div className='flex gap-3'>
                    <input required name='zipcode' onChange={onChangeHandler} value={formData.zipcode} placeholder='Zipcode' className={inputClass} />
                    <input required name='country' onChange={onChangeHandler} value={formData.country} placeholder='Country' className={inputClass} />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={formData.phone} placeholder='Phone' className={inputClass} />
            </div>

            {/* Right Side */}
            <div className='mt-8'>
                <CartTotal />

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : ''}`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-400' : ''}`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-400' : ''}`}>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
