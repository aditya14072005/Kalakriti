import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { Link } from 'react-router-dom'

const Cart = () => {

    const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
    const [cartData, setCartData] = useState([])

    useEffect(() => {
        const items = []
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    items.push({ _id: itemId, size, quantity: cartItems[itemId][size] })
                }
            }
        }
        setCartData(items)
    }, [cartItems])

    if (cartData.length === 0) return (
        <div className='text-center py-20 border-t'>
            <p className='text-4xl mb-4'>🛒</p>
            <h2 className='text-2xl font-bold text-gray-700 mb-2'>Your cart is empty</h2>
            <p className='text-gray-500 mb-6'>Add some items before checking out.</p>
            <Link to='/collection' className='bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition'>Browse Products</Link>
        </div>
    )

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'YOUR'} text2={'CART'} />
            </div>

            <div>
                {cartData.map((item, index) => {
                    const product = products.find(p => p._id === item._id)
                    if (!product) return null
                    return (
                        <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                            <div className='flex items-start gap-6'>
                                <img src={product.image[0]} className='w-16 sm:w-20' alt="" />
                                <div>
                                    <p className='text-xs sm:text-lg font-medium'>{product.name}</p>
                                    <div className='flex items-center gap-5 mt-2'>
                                        <p>{currency}{product.price}</p>
                                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="number" min={1} defaultValue={item.quantity}
                                onChange={e => e.target.value === '' || e.target.value === '0'
                                    ? null
                                    : updateQuantity(item._id, item.size, Number(e.target.value))}
                                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                            />
                            <img onClick={() => updateQuantity(item._id, item.size, 0)}
                                src={assets.bin_icon} className='w-4 mr-4 sm:w-5 cursor-pointer' alt="" />
                        </div>
                    )
                })}
            </div>

            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigate('/place-order')}
                            className='bg-black text-white text-sm my-8 px-8 py-3'>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
