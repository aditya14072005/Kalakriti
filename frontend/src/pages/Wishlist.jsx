import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Wishlist = () => {
    const { getWishlistProducts, toggleWishlist, addToCart, currency } = useContext(ShopContext)
    const wishlistProducts = getWishlistProducts()

    if (!wishlistProducts.length) {
        return (
            <div className='text-center py-20'>
                <h2 className='text-3xl font-bold text-gray-700 mb-4'>Your Wishlist is Empty</h2>
                <p className='text-gray-500'>Start adding favorites so you can shop them later.</p>
                <Link to='/collection' className='mt-5 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg'>Browse Products</Link>
            </div>
        )
    }

    return (
        <div className='py-10'>
            <h2 className='text-2xl font-bold mb-6'>Your Wishlist</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {wishlistProducts.map((product) => (
                    <div key={product._id} className='border p-4 rounded-xl shadow-sm'>
                        <Link to={`/product/${product._id}`}>
                            <img src={product.image[0]} className='w-full h-52 object-cover rounded-lg mb-4' alt={product.name} />
                        </Link>
                        <p className='font-medium'>{product.name}</p>
                        <p className='text-orange-500 font-semibold'>{currency}{product.price}</p>
                        <div className='mt-3 flex gap-2'>
                            <button
                                onClick={() => { addToCart(product._id, product.sizes[0]); toast.success('Added to cart!') }}
                                className='flex-1 bg-black text-white rounded-lg py-2 text-sm hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                                Add to Cart
                            </button>
                            <button
                                onClick={() => { toggleWishlist(product._id); toast.info('Removed from wishlist') }}
                                className='flex-1 border-2 border-pink-400 text-pink-600 rounded-lg py-2 text-sm hover:bg-pink-50 hover:border-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:animate-heartbeat'>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist