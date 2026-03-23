import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const VendorLogin = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to the new unified auth page
        navigate('/login')
    }, [navigate])

    return null
}

export default VendorLogin
