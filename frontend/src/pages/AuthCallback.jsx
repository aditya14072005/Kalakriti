import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

// Landing page after Google OAuth redirect
const AuthCallback = () => {
    const [params] = useSearchParams()
    const { setToken, setRole, navigate } = useContext(ShopContext)

    useEffect(() => {
        const token = params.get('token')
        const role = params.get('role')
        const error = params.get('error')

        if (error || !token) { navigate('/login'); return; }

        setToken(token)
        setRole(role)

        if (role === 'admin') navigate('/admin')
        else if (role === 'vendor') navigate('/vendor-dashboard')
        else navigate('/')
    }, [])

    return <div className='text-center py-20 text-gray-500'>Signing you in...</div>
}

export default AuthCallback
