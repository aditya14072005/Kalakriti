import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const EMPTY_ADDR = { label: '', firstName: '', lastName: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' }

const Profile = () => {
    const { backendUrl, token, userName, setToken } = useContext(ShopContext)
    const location = useLocation()
    const [profile, setProfile] = useState(null)
    const [editName, setEditName] = useState(false)
    const [nameVal, setNameVal] = useState('')
    const [addresses, setAddresses] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newAddr, setNewAddr] = useState(EMPTY_ADDR)
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile')
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwLoading, setPwLoading] = useState(false)

    const h = { headers: { token } }

    const fetchProfile = async () => {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, h)
        if (data.success) { setProfile(data.user); setNameVal(data.user.name); setAddresses(data.user.addresses || []) }
    }

    useEffect(() => { if (token) fetchProfile() }, [token])

    const saveName = async () => {
        if (!nameVal.trim()) return toast.error('Name cannot be empty')
        const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, { name: nameVal }, h)
        if (data.success) {
            toast.success('Name updated!')
            setEditName(false)
            fetchProfile()
            // re-issue token not needed — name shown from profile state now
        } else toast.error(data.message)
    }

    const saveAddress = async () => {
        const required = ['firstName', 'lastName', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
        if (required.some(k => !newAddr[k].trim())) return toast.error('Please fill all required fields')
        const { data } = await axios.post(`${backendUrl}/api/user/save-address`, { address: newAddr }, h)
        if (data.success) {
            toast.success('Address saved!')
            setShowAddForm(false)
            setNewAddr(EMPTY_ADDR)
            fetchProfile()
        } else toast.error(data.message)
    }

    const deleteAddress = async (addressId) => {
        const { data } = await axios.post(`${backendUrl}/api/user/delete-address`, { addressId }, h)
        if (data.success) { toast.success('Address removed'); fetchProfile() }
        else toast.error(data.message)
    }

    const changePassword = async (e) => {
        e.preventDefault()
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return }
        setPwLoading(true)
        const { data } = await axios.post(`${backendUrl}/api/user/change-password`, {
            currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword
        }, h)
        if (data.success) { toast.success(data.message); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
        else toast.error(data.message)
        setPwLoading(false)
    }

    if (!profile) return <div className='border-t pt-16 text-center py-20 text-gray-400'>Loading...</div>

    const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400'

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl mb-4'><Title text1={'MY'} text2={'PROFILE'} /></div>

            {/* Tabs */}
            <div className='flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6'>
                {[{ id: 'profile', label: '👤 Profile Settings' }, { id: 'addresses', label: '📍 Manage Addresses' }, { id: 'password', label: '🔒 Change Password' }].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.id ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
                <div className='max-w-md'>
                    {/* Avatar */}
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold'>
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className='font-bold text-gray-800 text-lg'>{profile.name}</p>
                            <p className='text-sm text-orange-500 capitalize'>{profile.role}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {/* Name */}
                        <div className='bg-white border border-gray-200 rounded-xl p-4'>
                            <p className='text-xs text-gray-400 mb-1'>Full Name</p>
                            {editName ? (
                                <div className='flex gap-2 mt-1'>
                                    <input value={nameVal} onChange={e => setNameVal(e.target.value)}
                                        className={inputCls} autoFocus
                                        onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditName(false) }} />
                                    <button onClick={saveName} className='bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-600 transition'>Save</button>
                                    <button onClick={() => { setEditName(false); setNameVal(profile.name) }} className='border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition'>Cancel</button>
                                </div>
                            ) : (
                                <div className='flex items-center justify-between mt-1'>
                                    <p className='text-gray-800 font-medium'>{profile.name}</p>
                                    <button onClick={() => setEditName(true)} className='text-xs text-orange-500 hover:text-orange-600 border border-orange-200 px-2 py-1 rounded-lg transition'>✏️ Edit</button>
                                </div>
                            )}
                        </div>

                        {/* Email — read only */}
                        <div className='bg-white border border-gray-200 rounded-xl p-4'>
                            <p className='text-xs text-gray-400 mb-1'>Email Address</p>
                            <div className='flex items-center justify-between mt-1'>
                                <p className='text-gray-800 font-medium'>{profile.email}</p>
                                <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg'>Cannot change</span>
                            </div>
                        </div>

                        {/* Role */}
                        <div className='bg-white border border-gray-200 rounded-xl p-4'>
                            <p className='text-xs text-gray-400 mb-1'>Account Type</p>
                            <p className='text-gray-800 font-medium capitalize mt-1'>{profile.role}</p>
                        </div>

                        {/* Member since */}
                        <div className='bg-white border border-gray-200 rounded-xl p-4'>
                            <p className='text-xs text-gray-400 mb-1'>Member Since</p>
                            <p className='text-gray-800 font-medium mt-1'>{new Date(profile.createdAt).toDateString()}</p>
                        </div>

                        {/* Saved addresses count */}
                        <div className='bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition' onClick={() => setActiveTab('addresses')}>
                            <div>
                                <p className='text-xs text-gray-400 mb-1'>Saved Addresses</p>
                                <p className='text-gray-800 font-medium'>{addresses.length} address{addresses.length !== 1 ? 'es' : ''}</p>
                            </div>
                            <span className='text-orange-500 text-lg'>→</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Addresses Tab */}
            {activeTab === 'addresses' && (
                <div className='max-w-lg'>
                    <div className='flex items-center justify-between mb-4'>
                        <p className='text-sm text-gray-500'>{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                        <button onClick={() => setShowAddForm(!showAddForm)}
                            className='bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition'>
                            {showAddForm ? 'Cancel' : '+ Add New Address'}
                        </button>
                    </div>

                    {/* Add Address Form */}
                    {showAddForm && (
                        <div className='bg-white border border-orange-200 rounded-xl p-5 mb-4 flex flex-col gap-3'>
                            <p className='font-semibold text-gray-700 text-sm'>New Address</p>
                            <input placeholder='Label (e.g. Home, Work)' value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))} className={inputCls} />
                            <div className='flex gap-2'>
                                <input placeholder='First name *' value={newAddr.firstName} onChange={e => setNewAddr(p => ({ ...p, firstName: e.target.value }))} className={inputCls} />
                                <input placeholder='Last name *' value={newAddr.lastName} onChange={e => setNewAddr(p => ({ ...p, lastName: e.target.value }))} className={inputCls} />
                            </div>
                            <input placeholder='Street *' value={newAddr.street} onChange={e => setNewAddr(p => ({ ...p, street: e.target.value }))} className={inputCls} />
                            <div className='flex gap-2'>
                                <input placeholder='City *' value={newAddr.city} onChange={e => setNewAddr(p => ({ ...p, city: e.target.value }))} className={inputCls} />
                                <input placeholder='State *' value={newAddr.state} onChange={e => setNewAddr(p => ({ ...p, state: e.target.value }))} className={inputCls} />
                            </div>
                            <div className='flex gap-2'>
                                <input placeholder='Zipcode *' value={newAddr.zipcode} onChange={e => setNewAddr(p => ({ ...p, zipcode: e.target.value }))} className={inputCls} />
                                <input placeholder='Country *' value={newAddr.country} onChange={e => setNewAddr(p => ({ ...p, country: e.target.value }))} className={inputCls} />
                            </div>
                            <input placeholder='Phone *' value={newAddr.phone} onChange={e => setNewAddr(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
                            <button onClick={saveAddress} className='bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition font-medium'>Save Address</button>
                        </div>
                    )}

                    {/* Saved Addresses List */}
                    <div className='flex flex-col gap-3'>
                        {addresses.length === 0 && !showAddForm && (
                            <div className='text-center py-12 text-gray-400'>
                                <p className='text-3xl mb-2'>📍</p>
                                <p className='text-sm'>No saved addresses yet.</p>
                                <p className='text-xs mt-1'>Add an address to use it quickly while ordering.</p>
                            </div>
                        )}
                        {addresses.map((addr, i) => (
                            <div key={addr.id || i} className='bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3'>
                                <div>
                                    {addr.label && <span className='text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium mb-2 inline-block'>{addr.label}</span>}
                                    <p className='font-semibold text-gray-800 text-sm'>{addr.firstName} {addr.lastName}</p>
                                    <p className='text-sm text-gray-600 mt-0.5'>{addr.street}, {addr.city}, {addr.state} {addr.zipcode}</p>
                                    <p className='text-sm text-gray-600'>{addr.country} · {addr.phone}</p>
                                </div>
                                <button onClick={() => deleteAddress(addr.id)}
                                    className='text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 transition flex-shrink-0'>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Change Password Tab */}
            {activeTab === 'password' && (
                <div className='max-w-md'>
                    <div className='bg-white border border-gray-200 rounded-xl p-6'>
                        <p className='font-semibold text-gray-800 mb-1'>🔒 Change Password</p>
                        <p className='text-xs text-gray-400 mb-5'>Enter your current password and choose a new one.</p>
                        <form onSubmit={changePassword} className='flex flex-col gap-4'>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>Current Password</label>
                                <input required type='password' value={pwForm.currentPassword}
                                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                                    className={inputCls} />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>New Password</label>
                                <input required type='password' value={pwForm.newPassword}
                                    onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                                    className={inputCls} />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-gray-600 mb-1 block'>Confirm New Password</label>
                                <input required type='password' value={pwForm.confirmPassword}
                                    onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    className={inputCls} />
                            </div>
                            <button type='submit' disabled={pwLoading}
                                className='bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50'>
                                {pwLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
