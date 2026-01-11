import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [loginMode, setLoginMode] = useState('admin') // 'admin' atau 'user'
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  })
  const [bukuTamuData, setBukuTamuData] = useState({
    nama_lengkap: '',
    alamat_lengkap: '',
    nomor_hp: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirect jika sudah login
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [router])

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulasi proses login
    setTimeout(() => {
      if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('username', adminCredentials.username)
        router.push('/dashboard')
      } else {
        alert('Username atau password salah!')
      }
      setLoading(false)
    }, 1000)
  }

  const handleUserAccess = async (e) => {
    e.preventDefault()
    
    if (!bukuTamuData.nama_lengkap || !bukuTamuData.alamat_lengkap || !bukuTamuData.nomor_hp) {
      alert('Mohon lengkapi semua data buku tamu')
      return
    }

    setLoading(true)

    try {
      // Simpan data buku tamu ke Supabase
      const response = await fetch('/api/buku-tamu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bukuTamuData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Set session untuk mode pengguna
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', 'user')
        localStorage.setItem('guestData', JSON.stringify(bukuTamuData))
        
        router.push('/penelusuran')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting buku tamu:', error)
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">IKM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Database IKM JUARA</h1>
          <p className="text-gray-600 mt-2">DisnakerKUKM Kota Madiun</p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setLoginMode('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mode Admin
            </button>
            <button
              onClick={() => setLoginMode('user')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'user'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mode Pengguna
            </button>
          </div>

          {/* Admin Login Form */}
          {loginMode === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan username admin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan password admin"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Login Admin'}
              </button>
            </form>
          )}

          {/* User Access Form */}
          {loginMode === 'user' && (
            <form onSubmit={handleUserAccess} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Buku Tamu Digital</h3>
                <p className="text-xs text-blue-700">
                  Silakan isi data buku tamu untuk mengakses fitur penelusuran data IKM Binaan
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={bukuTamuData.nama_lengkap}
                  onChange={(e) => setBukuTamuData({...bukuTamuData, nama_lengkap: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  value={bukuTamuData.alamat_lengkap}
                  onChange={(e) => setBukuTamuData({...bukuTamuData, alamat_lengkap: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan alamat lengkap Anda"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor HP *
                </label>
                <input
                  type="tel"
                  value={bukuTamuData.nomor_hp}
                  onChange={(e) => setBukuTamuData({...bukuTamuData, nomor_hp: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan & Akses Website'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 DisnakerKUKM Kota Madiun</p>
          <p className="mt-1">Sistem Database IKM JUARA</p>
        </div>
      </div>
    </div>
  )
}