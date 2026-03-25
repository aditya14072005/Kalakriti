import React, { useContext, useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import Home from "./pages/Home"
import About from "./pages/About"
import Collection from "./pages/Collection"
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import PlaceOrder from "./pages/PlaceOrder"
import Orders from "./pages/Orders"
import Vendor from "./pages/Vendor"
import Verify from "./pages/Verify"
import VendorDashboard from "./pages/VendorDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Wishlist from "./pages/Wishlist"
import Profile from "./pages/Profile"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AnimatedBackground from "./components/AnimatedIndianBackground"
import ProtectedRoute from "./components/ProtectedRoute"
import IntroAnimation from "./components/IntroAnimation"
import { ShopContext } from "./context/ShopContext"



const App = () => {
  const { role, token } = useContext(ShopContext)
  const location = useLocation()
  const onDashboard = (role === 'vendor' || role === 'admin') && (location.pathname === '/admin' || location.pathname === '/vendor-dashboard')
  const [introDone, setIntroDone] = useState(false)
  if (token && !role) return null

  return (
    <div className="relative min-h-screen">
      {!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}
      <ToastContainer position="top-right" autoClose={2000} />

      <>
        {!onDashboard && <AnimatedBackground />}
        {!onDashboard && <Navbar />}
        <div className={`relative z-10 ${!onDashboard ? 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['customer']}><Wishlist /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
            <Route path="/place-order" element={<ProtectedRoute allowedRoles={['customer']}><PlaceOrder /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}><Profile /></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute allowedRoles={['customer']}><Verify /></ProtectedRoute>} />
            <Route path="/vendor-dashboard" element={<ProtectedRoute allowedRoles={['vendor', 'admin']}><VendorDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to='/' replace />} />
          </Routes>
          {!onDashboard && <Footer />}
        </div>
      </>
    </div>
  )
}

export default App
