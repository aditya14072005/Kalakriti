import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className='border-t pt-10'>

      {/* Header */}
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-blue-700 mb-3'>About <span className='text-gray-800'>KALAKRITI</span></h2>
        <div className='flex justify-center items-center gap-4 mt-3'>
          <div className='w-16 h-0.5 bg-blue-400'></div>
          <span className='text-blue-500 text-xl'>✦</span>
          <div className='w-16 h-0.5 bg-blue-400'></div>
        </div>
      </div>

      {/* Story Section */}
      <div className='flex flex-col md:flex-row gap-12 items-center mb-16'>
        <img src={assets.about_img} className='w-full md:w-[45%] rounded-xl shadow-lg' alt="about" />
        <div className='flex flex-col gap-6 text-gray-600'>
          <p>KALAKRITI is India's premier B2C marketplace, connecting businesses across the nation with quality products and reliable suppliers. Founded with a vision to streamline business procurement and foster growth in the Indian marketplace.</p>
          <p>Our platform serves manufacturers, wholesalers, retailers, and service providers, offering a comprehensive solution for business-to-business transactions. From industrial equipment to office supplies, we provide access to a wide range of products essential for business operations.</p>
          <p>We are committed to building trust, ensuring quality, and facilitating seamless business relationships. Our advanced platform combines technology with business expertise to create India's most efficient B2C ecosystem.</p>
          <div className='border-l-4 border-blue-400 pl-4 italic text-blue-700'>
            "Empowering businesses, connecting commerce."
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
        {[
          { number: '1000+', label: 'Business Partners' },
          { number: '50K+', label: 'Products Listed' },
          { number: '25+', label: 'Industry Categories' },
          { number: '500+', label: 'Cities Served' },
        ].map((stat, i) => (
          <div key={i} className='text-center bg-white rounded-xl shadow p-6 border border-blue-100'>
            <p className='text-3xl font-bold text-blue-600'>{stat.number}</p>
            <p className='text-gray-500 mt-1 text-sm'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className='mb-16'>
        <h3 className='text-2xl font-bold text-center text-gray-800 mb-8'>Why Choose KALAKRITI B2C?</h3>
        <div className='grid md:grid-cols-3 gap-6'>
          {[
            { icon: '🏭', title: 'Bulk Procurement', desc: 'Streamlined bulk ordering with competitive pricing and volume discounts.' },
            { icon: '📊', title: 'Business Analytics', desc: 'Advanced analytics and insights to optimize your procurement decisions.' },
            { icon: '🔒', title: 'Verified Suppliers', desc: 'All vendors are thoroughly vetted and verified for quality and reliability.' },
            { icon: '🚚', title: 'Logistics Support', desc: 'Integrated logistics solutions for efficient delivery across India.' },
            { icon: '💳', title: 'Flexible Payment', desc: 'Multiple payment options including credit terms for established businesses.' },
            { icon: '🎯', title: 'Industry Focus', desc: 'Specialized categories and expert support for different business sectors.' },
          ].map((item, i) => (
            <div key={i} className='bg-white rounded-xl p-6 shadow border border-blue-100 flex gap-4 hover:shadow-lg transition-shadow'>
              <span className='text-3xl'>{item.icon}</span>
              <div>
                <p className='font-semibold text-gray-800'>{item.title}</p>
                <p className='text-gray-500 text-sm mt-1'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='text-center bg-blue-50 rounded-2xl p-10 border border-blue-200 mb-10'>
        <h3 className='text-2xl font-bold text-blue-700 mb-3'>Ready to Scale Your Business?</h3>
        <p className='text-gray-600 mb-6'>Join India's leading B2C marketplace and connect with thousands of businesses nationwide.</p>
        <Link to='/vendor'>
          <button className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold'>
            Join as a Vendor →
          </button>
        </Link>
      </div>

    </div>
  )
}

export default About
