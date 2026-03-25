import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { ShopContext } from "../context/ShopContext"

export default function Vendor() {
  const { token, role, backendUrl, navigate } = useContext(ShopContext)
  const [requestStatus, setRequestStatus] = useState(null) // null | 'pending' | 'approved' | 'rejected'
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [accountAlert, setAccountAlert] = useState(null) // { email, isNew }
  const [formData, setFormData] = useState({
    companyName: "", businessType: "", contactPerson: "", phone: "", email: "",
    website: "", businessAddress: "", businessDescription: "", termsAccepted: false
  })

  const h = { headers: { token } }

  useEffect(() => {
    if (!token) { setLoading(false); return }
    if (role === 'vendor') { navigate('/vendor-dashboard'); return }
    if (role === 'admin') { navigate('/admin'); return }
    axios.get(`${backendUrl}/api/user/profile`, h).then(({ data }) => {
      if (data.success) setRequestStatus(data.user.vendorRequest?.status || null)
    }).finally(() => setLoading(false))
  }, [token, role])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.termsAccepted) { toast.error("Please accept the terms and conditions."); return }
    setSubmitting(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/vendor-request`, formData, token ? h : {})
      if (data.success) {
        if (!token) setAccountAlert({ email: data.email, isNew: data.accountCreated })
        else setRequestStatus('pending')
      } else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
    setSubmitting(false)
  }

  const handleAlertClose = () => { setAccountAlert(null); setRequestStatus('pending') }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>

  // Status screens
  if (requestStatus === 'pending') return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ed]">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-orange-100">
        <p className="text-5xl mb-4">⏳</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Prata']">Application Under Review</h2>
        <p className="text-gray-500 text-sm">Your vendor application has been submitted. Our admin team will review it and get back to you shortly.</p>
      </div>
    </div>
  )

  if (requestStatus === 'rejected') return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ed]">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-red-100">
        <p className="text-5xl mb-4">❌</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Prata']">Application Rejected</h2>
        <p className="text-gray-500 text-sm mb-6">Unfortunately your vendor application was not approved. You may contact support for more information.</p>
        <button onClick={() => setRequestStatus(null)} className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-orange-600 transition">Reapply</button>
      </div>
    </div>
  )

  return (
    <>
      {accountAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-orange-100 text-center">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-['Prata']">Application Submitted!</h2>
            <p className="text-gray-500 text-sm mb-5">
              You'll be notified once your application is approved by our admin team.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 mb-6 text-left">
              <p className="text-xs font-semibold text-orange-600 mb-3 uppercase tracking-wide">Your Account Details</p>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{accountAlert.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="text-gray-500">Password</span>
                <span className="font-medium font-mono">{accountAlert.isNew ? '11111111' : '(your existing password)'}</span>
              </div>
              {accountAlert.isNew && (
                <p className="text-xs text-orange-400 mt-2">Please change your password after logging in.</p>
              )}
            </div>
            <button onClick={handleAlertClose}
              className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
              Got it!
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-[#fff7ed] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 font-['Prata']">Become a Vendor</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Join Kalakriti's artisan marketplace. Submit your application and our team will review it within 2–3 business days.
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Brand / Company Name *</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your brand name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Business Type *</label>
                <select required name="businessType" value={formData.businessType} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                  <option value="">Select type</option>
                  {["Manufacturer", "Artisan / Craftsperson", "Wholesaler", "Retailer", "Startup", "Other"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Contact Person *</label>
                <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Full name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Business Email *</label>
                <input required type="text" name="email" value={formData.email} onChange={handleChange} placeholder="business@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Website (optional)</label>
                <input name="website" value={formData.website} onChange={handleChange} placeholder="https://yoursite.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Business Address *</label>
                <input required name="businessAddress" value={formData.businessAddress} onChange={handleChange} placeholder="City, State"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Tell us about your products *</label>
              <textarea required name="businessDescription" value={formData.businessDescription} onChange={handleChange}
                rows={3} placeholder="Describe what you sell, your craft, materials used..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-orange-500" />
              <span className="text-xs text-gray-500">I agree to Kalakriti's Terms of Service and understand my application will be reviewed before approval.</span>
            </label>
            <button type="submit" disabled={submitting}
              className="w-full bg-orange-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
