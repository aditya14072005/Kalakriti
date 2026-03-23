import React, { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { data } = await axios.post(`${backendUrl}/api/order/verifyStripe`,
                    { success, orderId }, { headers: { token } })
                if (data.success) {
                    setCartItems({})
                    toast.success('Payment successful!')
                    navigate('/orders')
                } else {
                    toast.error('Payment failed')
                    navigate('/cart')
                }
            } catch (error) {
                toast.error(error.message)
                navigate('/cart')
            }
        }
        if (token) verifyPayment()
    }, [token])

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center'>
                <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-gray-600'>Verifying your payment...</p>
            </div>
        </div>
    )
}

export default Verify
