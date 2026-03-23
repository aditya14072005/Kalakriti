import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Auth = () => {
    const [userType, setUserType] = useState('customer') // 'customer' or 'vendor'
    const [mode, setMode] = useState('login') // 'login' or 'signup'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isFlipping, setIsFlipping] = useState(false)
    const [isSliding, setIsSliding] = useState(false)

    const { token, setToken, setRole, role, navigate, backendUrl } = useContext(ShopContext)

    const handleUserTypeChange = (type) => {
        if (type !== userType) {
            setIsFlipping(true)
            setTimeout(() => {
                setUserType(type)
                setMode('login') // Reset to login when switching user type
                setIsFlipping(false)
            }, 300)
        }
    }

    const handleModeChange = (newMode) => {
        if (newMode !== mode) {
            setIsSliding(true)
            setTimeout(() => {
                setMode(newMode)
                setIsSliding(false)
            }, 300)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            if (mode === 'signup') {
                const endpoint = userType === 'vendor' ? '/api/user/register-vendor' : '/api/user/register'
                const { data } = await axios.post(`${backendUrl}${endpoint}`, { name, email, password })
                if (data.success) {
                    setToken(data.token)
                    setRole(userType)
                    toast.success(`${userType === 'vendor' ? 'Vendor' : 'Customer'} account created!`)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
                if (!data.success) return toast.error(data.message)

                if (userType === 'vendor' && data.role !== 'vendor' && data.role !== 'admin') return toast.error('Not a vendor account')
                if (userType === 'customer' && (data.role === 'vendor')) return toast.error('Please use vendor login')

                setToken(data.token)
                setRole(data.role)

                if (data.role === 'vendor') navigate('/vendor-dashboard')
                else if (data.role === 'admin') navigate('/admin')
                else toast.success('Logged in!')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (!token) return
        if (role === 'admin') navigate('/admin')
        else if (role === 'vendor') navigate('/vendor-dashboard')
        else navigate('/')
    }, [token, role, navigate])

    const customerContent = (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl text-white">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Portal</h2>
                <p className="text-gray-600">Shop amazing products</p>
            </div>

            <div className="w-full max-w-md">
                <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
                    <button
                        onClick={() => handleModeChange('login')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                            mode === 'login'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-blue-500'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleModeChange('signup')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                            mode === 'signup'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-blue-500'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className={`transition-all duration-500 transform ${
                    isSliding ? (mode === 'login' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0') : 'translate-x-0 opacity-100'
                }`}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="animate-fade-in">
                                <input
                                    value={name} onChange={e => setName(e.target.value)}
                                    type="text" placeholder='Full Name' required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                                />
                            </div>
                        )}

                        <input
                            value={email} onChange={e => setEmail(e.target.value)}
                            type="email" placeholder='Email Address' required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />

                        <input
                            value={password} onChange={e => setPassword(e.target.value)}
                            type="password" placeholder='Password' required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        />

                        <button
                            type="submit"
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
                        >
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

    const vendorContent = (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-orange-50 to-red-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl text-white">🏪</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Vendor Portal</h2>
                <p className="text-gray-600">Manage your business</p>
            </div>

            <div className="w-full max-w-md">
                <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
                    <button
                        onClick={() => handleModeChange('login')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                            mode === 'login'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-orange-500'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleModeChange('signup')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                            mode === 'signup'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-orange-500'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className={`transition-all duration-500 transform ${
                    isSliding ? (mode === 'login' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0') : 'translate-x-0 opacity-100'
                }`}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="animate-fade-in">
                                <input
                                    value={name} onChange={e => setName(e.target.value)}
                                    type="text" placeholder='Business Name' required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                />
                            </div>
                        )}

                        <input
                            value={email} onChange={e => setEmail(e.target.value)}
                            type="email" placeholder='Business Email' required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                        />

                        <input
                            value={password} onChange={e => setPassword(e.target.value)}
                            type="password" placeholder='Password' required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                        />

                        <button
                            type="submit"
                            className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
                        >
                            {mode === 'login' ? 'Sign In as Vendor' : 'Create Vendor Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[600px] relative">
                {/* User Type Toggle */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
                        <button
                            onClick={() => handleUserTypeChange('customer')}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                userType === 'customer'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            Customer
                        </button>
                        <button
                            onClick={() => handleUserTypeChange('vendor')}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                userType === 'vendor'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-orange-500'
                            }`}
                        >
                            Vendor
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className={`w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
                    isFlipping ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}>
                    {userType === 'customer' ? customerContent : vendorContent}
                </div>
            </div>
        </div>
    )
}

export default Auth
