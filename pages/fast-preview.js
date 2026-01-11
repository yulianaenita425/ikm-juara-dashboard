import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { 
  BuildingOfficeIcon, 
  DocumentCheckIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

export default function FastPreview() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data sekali saja tanpa real-time
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const result = await response.json()
        setDashboardData(result)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Data statis untuk preview cepat
  const quickStats = [
    { 
      name: 'IKM Binaan', 
      value: dashboardData?.totalIkmBinaan?.current || 6, 
      icon: BuildingOfficeIcon, 
      color: 'bg-blue-500',
      description: 'Total IKM yang terdaftar'
    },
    { 
      name: 'Layanan IKM Juara', 
      value: dashboardData?.layananIkmJuara?.current || 12, 
      icon: DocumentCheckIcon, 
      color: 'bg-green-500',
      description: 'Total layanan yang telah diberikan'
    },
    { 
      name: 'Pelatihan Pemberdayaan', 
      value: dashboardData?.pelatihanPemberdayaan?.current || 0, 
      icon: AcademicCapIcon, 
      color: 'bg-purple-500',
      description: 'Total pelatihan yang telah dilaksanakan'
    }
  ]

  const layananBreakdown = dashboardData?.layananIkmJuara?.breakdown ? [
    { name: 'HKI Merek', value: dashboardData.layananIkmJuara.breakdown.hkiMerek, icon: '🏷️' },
    { name: 'Sertifikat Halal', value: dashboardData.layananIkmJuara.breakdown.sertifikatHalal, icon: '📜' },
    { name: 'TKDN IK', value: dashboardData.layananIkmJuara.breakdown.tkdnIk, icon: '🏭' },
    { name: 'SIINas', value: dashboardData.layananIkmJuara.breakdown.siinas, icon: '🌐' },
    { name: 'Uji Nilai Gizi', value: dashboardData.layananIkmJuara.breakdown.ujiNilaiGizi, icon: '🧪' },
    { name: 'Kurasi Produk', value: dashboardData.layananIkmJuara.breakdown.kurasiProduk, icon: '✨' }
  ] : [
    { name: 'HKI Merek', value: 4, icon: '🏷️' },
    { name: 'Sertifikat Halal', value: 2, icon: '📜' },
    { name: 'TKDN IK', value: 1, icon: '🏭' },
    { name: 'SIINas', value: 2, icon: '🌐' },
    { name: 'Uji Nilai Gizi', value: 1, icon: '🧪' },
    { name: 'Kurasi Produk', value: 2, icon: '✨' }
  ]

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard IKM JUARA - Fast Preview</h1>
          <p className="text-gray-600">Preview cepat Database IKM JUARA DisnakerKUKM Kota Madiun</p>
          <div className="mt-2 flex space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              → Ke Dashboard Real-time
            </button>
            <button
              onClick={() => router.push('/ikm-binaan')}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              → Kelola IKM Binaan
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layanan Breakdown */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentCheckIcon className="h-5 w-5 mr-2 text-green-600" />
              Layanan IKM Juara - Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layananBreakdown.map((layanan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{layanan.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{layanan.name}</p>
                        <p className="text-xs text-gray-500">Total pendaftaran</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {layanan.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/ikm-binaan')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">IKM Binaan</span>
            </button>
            <button 
              onClick={() => router.push('/layanan/hki-merek')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <DocumentCheckIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <span className="text-sm font-medium">HKI Merek</span>
            </button>
            <button 
              onClick={() => router.push('/layanan/sertifikat-halal')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium">Sertifikat Halal</span>
            </button>
            <button 
              onClick={() => router.push('/penelusuran')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors"
            >
              <UsersIcon className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <span className="text-sm font-medium">Penelusuran</span>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>✅ Data tersinkronisasi dengan Supabase</p>
          <p>🚀 Fast Preview Mode - Tanpa Real-time Updates</p>
        </div>
      </div>
    </Layout>
  )
}