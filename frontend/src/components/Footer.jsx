import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='mt-20 border-t border-orange-100 pt-10'>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm'>

        {/* Logo + description */}
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-relaxed'>
            KALAKRITI celebrates the rich heritage of Indian craftsmanship. We connect skilled artisans with customers who appreciate authentic, handcrafted products made with love and tradition.
          </p>
          <div className='flex gap-4 mt-5'>
            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
              <span key={i} className='text-xl cursor-pointer hover:scale-110 transition'>{icon}</span>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><Link to='/' className='hover:text-orange-600 transition'>Home</Link></li>
            <li><Link to='/about' className='hover:text-orange-600 transition'>About Us</Link></li>
            <li><Link to='/collection' className='hover:text-orange-600 transition'>Collection</Link></li>
            <li><Link to='/vendor' className='hover:text-orange-600 transition'>Become a Vendor</Link></li>
            <li><Link to='/contact' className='hover:text-orange-600 transition'>Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@kalakriti.in</li>
            <li>📍 Jaipur, Rajasthan, India</li>
            <li className='mt-2 text-xs text-gray-400'>Mon–Sat: 9AM – 6PM</li>
          </ul>
        </div>

      </div>

      <div>
        <hr className='mt-10 border-orange-100' />
        <p className='py-5 text-sm text-center text-gray-500'>
          © 2024 KALAKRITI — All Rights Reserved. Made with ❤️ for Indian Artisans.
        </p>
      </div>

    </div>
  )
}

export default Footer
