import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Product = () => {

    const { productId } = useParams()
    const { products, currency, addToCart, toggleWishlist, isInWishlist, navigate } = useContext(ShopContext)

    const [product, setProduct] = useState(null)
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')

    useEffect(() => {
        const found = products.find(p => p._id === productId)
        if (found) { setProduct(found); setImage(found.image[0]) }
    }, [productId, products])

    if (!product) return <div className='text-center py-20'>Loading...</div>

    const hasSizes = product.sizes && product.sizes.length > 0

    const handleAddToCart = () => {
        if (hasSizes && !size) { toast.error('Please select a size'); return }
        addToCart(product._id, hasSizes ? size : 'one-size')
    }

    const handleBuyNow = () => {
        if (hasSizes && !size) { toast.error('Please select a size'); return }
        addToCart(product._id, hasSizes ? size : 'one-size')
        navigate('/cart')
    }

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

                {/* Images */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2'>
                        {product.image.map((img, i) => (
                            <img key={i} src={img} onClick={() => setImage(img)}
                                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border hover:border-orange-400' alt="" />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img src={image} className='w-full h-auto' alt="" />
                    </div>
                </div>

                {/* Info */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{product.name}</h1>

                    <div className='flex items-center gap-1 mt-2'>
                        {[...Array(4)].map((_, i) => <img key={i} src={assets.star_icon} className='w-3.5' alt="" />)}
                        <img src={assets.star_dull_icon} className='w-3.5' alt="" />
                        <p className='pl-2'>(122)</p>
                    </div>

                    <p className='mt-5 text-3xl font-medium'>{currency}{product.price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>

                    {hasSizes && (
                        <div className='flex flex-col gap-4 my-8'>
                            <p className='font-medium'>Select Size</p>
                            <div className='flex gap-2'>
                                {product.sizes.map((s, i) => (
                                    <button key={i} onClick={() => setSize(s)}
                                        className={`border py-2 px-4 bg-gray-100 ${size === s ? 'border-orange-500 bg-orange-50' : ''}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex items-center gap-3 mt-8 flex-wrap'>
                        <button
                            onClick={handleAddToCart}
                            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
                            ADD TO CART
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-sm transition active:bg-orange-700'>
                            BUY NOW
                        </button>
                        <button
                            onClick={() => toggleWishlist(product._id)}
                            className={`px-6 py-3 text-sm border-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isInWishlist(product._id) ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600' : 'bg-white text-pink-500 border-pink-300 hover:bg-pink-50 hover:border-pink-400'}`}>
                            {isInWishlist(product._id) ? <span className="text-2xl">♥</span> : <span className="text-2xl">♡</span>} {isInWishlist(product._id) ? 'Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
