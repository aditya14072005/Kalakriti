import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import axios from 'axios'

const pad = (n) => String(n).padStart(2, '0')

const Countdown = ({ endsAt }) => {
  const calc = () => {
    const diff = Math.max(0, new Date(endsAt) - Date.now())
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return (
    <div className="flex justify-center gap-3 mt-3">
      {[['h', 'HRS'], ['m', 'MIN'], ['s', 'SEC']].map(([k, label]) => (
        <div key={k} className="bg-orange-500 text-white rounded-xl px-4 py-2 min-w-[56px] text-center shadow">
          <p className="text-xl font-bold leading-none">{pad(t[k])}</p>
          <p className="text-[9px] mt-0.5 opacity-80">{label}</p>
        </div>
      ))}
    </div>
  )
}

const DailyDeals = () => {
  const { backendUrl, currency } = useContext(ShopContext)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${backendUrl}/api/deals`)
      .then(({ data }) => { if (data.success) setDeals(data.deals) })
      .finally(() => setLoading(false))
  }, [])

  // Use the earliest ending deal for the main countdown
  const soonest = deals.reduce((a, b) => (!a || new Date(b.dealEndsAt) < new Date(a.dealEndsAt) ? b : a), null)

  return (
    <div className="border-t pt-10">
      <section className="relative my-4 py-6 bg-gradient-to-b from-[#fff7ed] via-[#fff1e6] to-[#fde68a] rounded-2xl shadow-sm">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>
        <div className="relative text-center">
          <Title text1={'DAILY'} text2={'DEALS'} />
          <div className="flex justify-center items-center gap-3 mt-2 mb-1">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            <span className="text-orange-500 text-sm">✦</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          </div>
          <p className="text-xs text-gray-500 mb-2">Handpicked deals — refreshed by admin daily</p>
          {soonest && <Countdown endsAt={soonest.dealEndsAt} />}
        </div>
      </section>

      {loading ? (
        <p className="text-center text-gray-400 py-20">Loading deals...</p>
      ) : deals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="text-sm">No deals available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          {deals.map(p => (
            <div key={p._id} className="relative">
              <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                {Math.round(((p.price - p.dealPrice) / p.price) * 100)}% OFF
              </span>
              <ProductItem id={p._id} image={p.image} name={p.name} price={p.dealPrice} />
              <p className="text-xs text-gray-400 line-through text-center -mt-1">{currency}{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DailyDeals
