import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const RecentlyViewed = () => {
  const { recentlyViewed, products, currency } = useContext(ShopContext)
  const [open, setOpen] = useState(false)

  const items = recentlyViewed.map(id => products.find(p => p._id === id)).filter(Boolean)
  if (items.length === 0) return null

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">

      {/* Panel */}
      {open && (
        <div className="w-64 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-orange-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <p className="text-xs font-semibold text-orange-700 tracking-wide uppercase">Recently Viewed</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          <div className="overflow-y-auto flex flex-col divide-y divide-gray-100">
            {items.map(p => (
              <Link key={p._id} to={`/product/${p._id}`} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 transition">
                <img src={p.image[0]} alt={p.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 font-medium truncate">{p.name}</p>
                  <p className="text-xs text-orange-600 font-semibold mt-0.5">{currency}{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all">
        <span className="text-base">🕐</span>
        Recently Viewed
        <span className="bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">{items.length}</span>
      </button>

    </div>
  )
}

export default RecentlyViewed
