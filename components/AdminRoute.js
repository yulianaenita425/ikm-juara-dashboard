import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminRoute({ children }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole')
      const isLoggedIn = localStorage.getItem('isLoggedIn')

      if (!isLoggedIn) {
        router.push('/login')
        return
      }

      if (userRole !== 'admin') {
        // Redirect user ke penelusuran
        router.push('/penelusuran')
        return
      }

      setIsAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}