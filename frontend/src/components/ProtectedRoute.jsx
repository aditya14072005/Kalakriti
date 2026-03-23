import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useContext(ShopContext)
    if (!token) return <Navigate to='/login' replace />
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to='/' replace />
    return children
}

export default ProtectedRoute
