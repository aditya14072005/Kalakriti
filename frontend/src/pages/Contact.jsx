import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Contact = () => {

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Message sent! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <div className='border-t pt-10'>

      <div className='text-center mb-10'>
        <div className='text-2xl'>
          <Title text1={'CONTACT'} text2={'US'} />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-12 mb-16'>

        {/* Left - Info */}
        <div className='md:w-[40%] flex flex-col gap-6'>
          <img src={assets.contact_img} className='rounded-xl shadow-lg w-full' alt="contact" />

          <div className='bg-white rounded-xl p-6 shadow border border-orange-100 flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
              <span className='text-2xl'>📍</span>
              <div>
                <p className='font-semibold text-gray-800'>Our Store</p>
                <p className='text-gray-500 text-sm'>123 Business District, Mumbai, Maharashtra, India - 400001</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <span className='text-2xl'>📞</span>
              <div>
                <p className='font-semibold text-gray-800'>Phone</p>
                <p className='text-gray-500 text-sm'>+91 98765 43210</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <span className='text-2xl'>✉️</span>
              <div>
                <p className='font-semibold text-gray-800'>Email</p>
                <p className='text-gray-500 text-sm'>support@kalakriti.in</p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <span className='text-2xl'>🕐</span>
              <div>
                <p className='font-semibold text-gray-800'>Working Hours</p>
                <p className='text-gray-500 text-sm'>Mon – Sat: 9:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className='flex-1 bg-white rounded-xl shadow p-8 border border-orange-100'>
          <h3 className='text-xl font-serif text-orange-700 mb-6'>Send us a Message</h3>
          <form onSubmit={onSubmit} className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <input name='name' value={formData.name} onChange={onChange} required
                placeholder='Your Name' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-300' />
              <input name='email' value={formData.email} onChange={onChange} required type='email'
                placeholder='Email Address' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-300' />
            </div>
            <input name='subject' value={formData.subject} onChange={onChange} required
              placeholder='Subject' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-300' />
            <textarea name='message' value={formData.message} onChange={onChange} required rows={5}
              placeholder='Your message...' className='border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none' />
            <button type='submit' disabled={loading}
              className='bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-medium'>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>

      {/* FAQ */}
      <div className='mb-16'>
        <h3 className='text-2xl font-serif text-center text-gray-800 mb-8'>Frequently Asked Questions</h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {[
            { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days. Express and bulk delivery options available for business orders.' },
            { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy for all business products in original condition.' },
            { q: 'Are all suppliers verified?', a: 'Yes! All vendors on KALAKRITI undergo thorough verification and quality checks.' },
            { q: 'How can I track my order?', a: 'Business customers receive dedicated tracking with real-time updates and account manager support.' },
          ].map((faq, i) => (
            <div key={i} className='bg-white rounded-xl p-5 shadow border border-blue-100'>
              <p className='font-semibold text-gray-800 mb-2'>❓ {faq.q}</p>
              <p className='text-gray-500 text-sm'>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Contact
