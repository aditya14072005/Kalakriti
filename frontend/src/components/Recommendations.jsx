import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'

// mode: 'home' | 'product'
// excludeId: current product id (for product page)
const Recommendations = ({ mode = 'home', excludeId = null }) => {
    const { backendUrl, token, recentlyViewed } = useContext(ShopContext)
    const [products, setProducts] = useState([])
    const [type, setType] = useState('popular')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const viewedIds = recentlyViewed.filter(id => id !== excludeId).slice(0, 10).join(',')
                const params = new URLSearchParams()
                if (viewedIds) params.set('viewedIds', viewedIds)
                params.set('limit', mode === 'home' ? '10' : '6')

                const { data } = await axios.get(
                    `${backendUrl}/api/recommendations?${params.toString()}`,
                    token ? { headers: { token } } : {}
                )
                if (data.success) {
                    setProducts(data.products.filter(p => p._id !== excludeId))
                    setType(data.type)
                }
            } catch {}
            setLoading(false)
        }
        load()
    }, [recentlyViewed, token, excludeId, backendUrl])

    if (loading) return null
    if (!products.length) return null

    const isPersonalized = type === 'personalized'

    if (mode === 'product') {
        return (
            <div className='mt-16'>
                <div className='text-center mb-6'>
                    <Title text1='YOU MAY' text2='ALSO LIKE' />
                    {isPersonalized && (
                        <p className='text-xs text-orange-500 mt-1'>✨ Based on your browsing</p>
                    )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
                    {products.map(p => (
                        <ProductItem key={p._id} id={p._id} image={p.image} name={p.name} price={p.price} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <section className='relative my-6 py-6 bg-gradient-to-b from-[#fff7f0] via-[#fff1e6] to-[#fde8d0] rounded-2xl shadow-sm'>
            <div className='absolute top-6 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-200 opacity-20 blur-3xl rounded-full' />
            <div className='relative text-center py-3 text-3xl'>
                <Title text1={isPersonalized ? 'PICKED' : 'YOU MAY'} text2={isPersonalized ? 'FOR YOU' : 'ALSO LIKE'} />
                <div className='flex justify-center items-center gap-3 mt-2 mb-3'>
                    <div className='w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent' />
                    <span className='text-orange-400 text-sm'>✦</span>
                    <div className='w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent' />
                </div>
                {isPersonalized && (
                    <p className='text-xs text-orange-500 -mt-1'>✨ Personalized for you</p>
                )}
            </div>
            <div className='relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4'>
                {products.map(p => (
                    <ProductItem key={p._id} id={p._id} image={p.image} name={p.name} price={p.price} />
                ))}
            </div>
        </section>
    )
}

export default Recommendations
