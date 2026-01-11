import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/website-preview')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white font-bold text-2xl">IKM</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Database IKM JUARA</h1>
        <p className="text-gray-600 mb-6">DisnakerKUKM Kota Madiun</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Memuat preview website...</p>
        </div>
      </div>
    </div>
  )
}