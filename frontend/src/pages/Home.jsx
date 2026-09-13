import React, { useContext } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsLetterBox'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import Recommendations from '../components/Recommendations'

const Home = () => {
  const { recentlyViewed, products } = useContext(ShopContext)
  const recentProducts = recentlyViewed.map(id => products.find(p => p._id === id)).filter(Boolean)

  return (
    <div>
      <Hero/>
      {recentProducts.length > 0 && (
        <section className="relative my-6 py-6 bg-gradient-to-b from-[#fff7ed] via-[#fff1e6] to-[#fde68a] rounded-2xl shadow-sm">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>
          <div className="relative text-center py-3">
            <Title text1={'RECENTLY'} text2={'VIEWED'} />
            <div className="flex justify-center items-center gap-3 mt-2 mb-3">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              <span className="text-orange-400 text-sm">✦</span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>
          </div>
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
            {recentProducts.map(p => (
              <ProductItem key={p._id} id={p._id} image={p.image} name={p.name} price={p.price} />
            ))}
          </div>
        </section>
      )}
      <LatestCollection/>
      <Recommendations mode='home' />
      <BestSeller limit={5} />
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
