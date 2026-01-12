import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'

export default function PelatihanTestPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jenis')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          </div>
        </Layout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <Layout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pelatihan Test</h1>
            <p className="text-gray-600">Test halaman pelatihan dengan fitur baru</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('jenis')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'jenis'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Jenis Pelatihan
                </button>
                <button
                  onClick={() => setActiveTab('peserta')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'peserta'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Peserta Pelatihan
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'jenis' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Tab Jenis Pelatihan</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Tambah Jenis Pelatihan
              </button>
              <p className="mt-4 text-gray-600">Fitur jenis pelatihan akan ditampilkan di sini</p>
            </div>
          )}

          {activeTab === 'peserta' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Tab Peserta Pelatihan</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Tambah Peserta Pelatihan
              </button>
              <p className="mt-4 text-gray-600">Fitur peserta pelatihan akan ditampilkan di sini</p>
            </div>
          )}
        </div>
      </Layout>
    </AdminRoute>
  )
}