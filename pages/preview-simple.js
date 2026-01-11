import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  BuildingOfficeIcon, 
  DocumentCheckIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

export default function PreviewSimplePage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPreviewData()
  }, [])

  const loadPreviewData = async () => {
    try {
      console.log('Loading preview data...')
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Preview data loaded:', data)
      setStats(data)
    } catch (error) {
      console.error('Error loading preview data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      title: 'Dashboard Real-time',
      description: 'Monitoring statistik IKM JUARA dengan update real-time setiap 15 detik',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      path: '/dashboard',
      status: 'active'
    },
    {
      title: 'Manajemen IKM Binaan',
      description: 'CRUD lengkap untuk data IKM Binaan dengan validasi NIB dan NIK',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      path: '/ikm-binaan',
      status: 'active'
    },
    {
      title: 'HKI Merek',
      description: 'Pengelolaan pendaftaran dan sertifikat HKI Merek',
      icon: DocumentCheckIcon,
      color: 'bg-purple-500',
      path: '/layanan/hki-merek',
      status: 'active'
    },
    {
      title: 'Sertifikat Halal',
      description: 'Manajemen sertifikat halal untuk produk IKM',
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      path: '/layanan/sertifikat-halal',
      status: 'active'
    }
  ]

  const handleFeatureClick = (feature) => {
    if (feature.status === 'active') {
      router.push(feature.path)
    } else {
      alert(`Fitur ${feature.title} sedang dalam pengembangan`)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Error Loading Preview</h1>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Preview Aplikasi IKM JUARA
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Database IKM JUARA DisnakerKUKM Kota Madiun
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Migrasi Supabase Selesai - Zero Duplikasi Data
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data statistik...</p>
        </div>
      )}

      {/* Statistics Overview */}
      {!loading && stats && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Statistik Real-time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total IKM Binaan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIkmBinaan.current}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-lg">
                  <DocumentCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">HKI Merek</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sertifikat Halal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-500 p-3 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Layanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.layananStats?.reduce((sum, l) => sum + l.total, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Fitur Aplikasi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature)}
              className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                feature.status === 'active' ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`${feature.color} p-3 rounded-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feature.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feature.status === 'active' ? 'Aktif' : 'Pengembangan'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              {feature.status === 'active' && (
                <div className="mt-4 flex items-center text-blue-600 text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  Klik untuk mengakses
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Highlights */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Highlights Teknis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Duplikasi Data</h3>
            <p className="text-gray-600 text-sm">
              Single source of truth dengan Supabase PostgreSQL
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BoltIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600 text-sm">
              Auto-refresh setiap 15 detik untuk data terkini
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CogIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Lengkap</h3>
            <p className="text-gray-600 text-sm">
              CRUD operations dengan validasi dan error handling
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Scalable</h3>
            <p className="text-gray-600 text-sm">
              Row Level Security dan arsitektur yang scalable
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      {!loading && stats?.recentActivities && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {stats.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{activity.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center mt-12">
        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Masuk ke Aplikasi
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Lihat Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}