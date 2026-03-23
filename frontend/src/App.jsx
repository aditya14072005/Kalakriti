import React, { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
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

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AnimatedBackground from "./components/AnimatedIndianBackground"
import ProtectedRoute from "./components/ProtectedRoute"
import { ShopContext } from "./context/ShopContext"

// Redirects vendor/admin away from customer-only pages
const CustomerRoute = ({ children }) => {
  const { token, role } = useContext(ShopContext)
  if (token && role === 'vendor') return <Navigate to='/vendor-dashboard' replace />
  if (token && role === 'admin') return <Navigate to='/admin' replace />
  return children
}

const App = () => {
  const { role, token } = useContext(ShopContext)
  const isDashboardUser = token && (role === 'vendor' || role === 'admin')

  return (
    <div className="relative min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />

      {isDashboardUser ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/vendor-dashboard" element={<ProtectedRoute allowedRoles={['vendor', 'admin']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={role === 'admin' ? '/admin' : '/vendor-dashboard'} replace />} />
        </Routes>
      ) : (
        <>
          <AnimatedBackground />
          <Navbar />
          <div className='relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <Routes>
              <Route path="/" element={<CustomerRoute><Home /></CustomerRoute>} />
              <Route path="/about" element={<CustomerRoute><About /></CustomerRoute>} />
              <Route path="/collection" element={<CustomerRoute><Collection /></CustomerRoute>} />
              <Route path="/contact" element={<CustomerRoute><Contact /></CustomerRoute>} />
              <Route path="/product/:productId" element={<CustomerRoute><Product /></CustomerRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/vendor" element={<Vendor />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
              <Route path="/place-order" element={<ProtectedRoute allowedRoles={['customer']}><PlaceOrder /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
              <Route path="/verify" element={<ProtectedRoute allowedRoles={['customer']}><Verify /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to='/' replace />} />
            </Routes>
            <Footer />
          </div>
        </>
      )}
    </div>
  )
}

export default App
