import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import RealTimeIndicator from '../components/RealTimeIndicator'
import AnimatedCounter from '../components/AnimatedCounter'
import { useRealTimeStats } from '../hooks/useDashboardData'
// Deployment: 2026-01-11T13:18:19.462Z - All fixes applied
import { 
  BuildingOfficeIcon, 
  DocumentCheckIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const { data: dashboardData, loading, error, lastUpdated, refresh } = useRealTimeStats()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    setUserRole(role)
  }, [router])

  if (!userRole) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Format data untuk komponen stats utama
  const mainStats = dashboardData ? [
    { 
      name: 'IKM Binaan', 
      value: dashboardData.totalIkmBinaan?.current || 0, 
      icon: BuildingOfficeIcon, 
      color: 'bg-blue-500', 
      change: dashboardData.totalIkmBinaan?.change || '0%',
      description: 'Total IKM yang terdaftar'
    },
    { 
      name: 'Layanan IKM Juara', 
      value: dashboardData.layananIkmJuara?.current || 0, 
      icon: DocumentCheckIcon, 
      color: 'bg-green-500', 
      change: dashboardData.layananIkmJuara?.change || '0%',
      description: 'Total layanan yang telah diberikan'
    },
    { 
      name: 'Pelatihan Pemberdayaan Industri', 
      value: dashboardData.pelatihanPemberdayaan?.current || 0, 
      icon: AcademicCapIcon, 
      color: 'bg-purple-500', 
      change: dashboardData.pelatihanPemberdayaan?.change || '0%',
      description: 'Total pelatihan yang telah dilaksanakan'
    }
  ] : []

  // Format data untuk breakdown layanan IKM Juara
  const layananBreakdown = dashboardData?.layananIkmJuara?.breakdown ? [
    { 
      name: 'Pendaftaran HKI Merek', 
      value: dashboardData.layananIkmJuara.breakdown.hkiMerek, 
      icon: '🏷️', 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      name: 'Pendaftaran Sertifikat Halal', 
      value: dashboardData.layananIkmJuara.breakdown.sertifikatHalal, 
      icon: '📜', 
      color: 'bg-green-100 text-green-800' 
    },
    { 
      name: 'Pendaftaran TKDN IK', 
      value: dashboardData.layananIkmJuara.breakdown.tkdnIk, 
      icon: '🏭', 
      color: 'bg-orange-100 text-orange-800' 
    },
    { 
      name: 'Pendaftaran dan Pendampingan SIINas', 
      value: dashboardData.layananIkmJuara.breakdown.siinas, 
      icon: '🌐', 
      color: 'bg-indigo-100 text-indigo-800' 
    },
    { 
      name: 'Pendaftaran Uji Nilai Gizi', 
      value: dashboardData.layananIkmJuara.breakdown.ujiNilaiGizi, 
      icon: '🧪', 
      color: 'bg-red-100 text-red-800' 
    },
    { 
      name: 'Kurasi Produk', 
      value: dashboardData.layananIkmJuara.breakdown.kurasiProduk, 
      icon: '✨', 
      color: 'bg-yellow-100 text-yellow-800' 
    }
  ] : []

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard IKM JUARA</h1>
              <p className="text-gray-600">Selamat datang di Database IKM JUARA DisnakerKUKM Kota Madiun</p>
            </div>
            <div className="text-right">
              <RealTimeIndicator
                isConnected={!error}
                lastUpdated={lastUpdated}
                refreshInterval={15000}
                onRefresh={refresh}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">Gagal memuat data: {error}</span>
              <button 
                onClick={refresh}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Statistics Cards */}
        {!loading && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {mainStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <div className="flex items-center">
                        <AnimatedCounter 
                          value={stat.value} 
                          className="text-2xl font-bold text-gray-900"
                        />
                        <span className={`ml-2 text-sm font-medium ${
                          stat.change.startsWith('+') ? 'text-green-600' : 
                          stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Layanan IKM Juara Breakdown */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DocumentCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                  Layanan IKM Juara
                </h2>
                <p className="text-sm text-gray-600">Rincian layanan yang telah diberikan kepada IKM Binaan</p>
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
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${layanan.color}`}>
                          {layanan.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistik Detail dan Aktivitas Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statistik Layanan Detail */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Statistik Layanan IKM JUARA
                  </h2>
                </div>
                <div className="p-6">
                  {dashboardData.layananStats && dashboardData.layananStats.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.layananStats.map((layanan, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{layanan.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{layanan.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-blue-600">{layanan.total}</span>
                            <span className="text-xs text-gray-500">data</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Belum ada data layanan</p>
                  )}
                </div>
              </div>

              {/* Aktivitas Terbaru */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                </div>
                <div className="p-6">
                  {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.status === 'success' ? 'bg-green-400' : 
                            activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                            <p className="text-sm text-gray-600">{activity.message}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Belum ada aktivitas terbaru</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => router.push('/ikm-binaan')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Tambah IKM Binaan</span>
                </button>
                <button 
                  onClick={() => router.push('/layanan/hki-merek')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <DocumentCheckIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium">Daftar HKI Merek</span>
                </button>
                <button 
                  onClick={() => router.push('/pelatihan')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm font-medium">Kelola Pelatihan</span>
                </button>
                <button 
                  onClick={() => router.push('/penelusuran')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <UsersIcon className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <span className="text-sm font-medium">Telusuri Data</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
    </AdminRoute>
  )
}