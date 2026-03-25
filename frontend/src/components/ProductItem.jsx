import React, {useContext, useState} from 'react'
import {ShopContext} from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {
    const {currency, toggleWishlist, isInWishlist} = useContext(ShopContext);
    const inWishlist = isInWishlist(id);
    const [isHovered, setIsHovered] = useState(false);
  return (
    <Link className='text-gray-700 cursor-pointer relative' to={`/product/${id}`}>
        <div className='overflow-hidden aspect-[3/4] w-full bg-gray-100 rounded-lg relative'>
          <img className='w-full h-full object-cover hover:scale-110 transition ease-in-out duration-300' src={image[0]} alt={name} />
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(id); }}
            className={`absolute top-3 right-3 p-2 rounded-full border-2 text-2xl transition-all duration-300 transform ${inWishlist ? 'bg-pink-500 border-pink-500 text-white scale-110' : 'bg-white border-gray-300 text-gray-600 hover:bg-pink-100 hover:border-pink-400'} ${isHovered ? 'animate-heartbeat scale-125' : ''} shadow-lg`}>
            {inWishlist ? '♥' : '♡'}
          </button>
        </div>
        <p className='pt-3 pb-1 text-sm truncate'>{name}</p>
        <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  )
}

export default ProductItem
