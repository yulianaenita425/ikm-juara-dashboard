import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  BuildingOfficeIcon, 
  DocumentCheckIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function DemoInteractive() {
  const router = useRouter()
  const [currentDemo, setCurrentDemo] = useState('dashboard')
  const [isPlaying, setIsPlaying] = useState(false)
  const [stats, setStats] = useState({
    ikmBinaan: 6,
    layananTotal: 12,
    hkiMerek: 4,
    sertifikatHalal: 2,
    tkdnIk: 1,
    siinas: 2,
    ujiNilaiGizi: 1,
    kurasiProduk: 2
  })

  // Simulasi data real-time
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          layananTotal: prev.layananTotal + Math.floor(Math.random() * 2),
          hkiMerek: prev.hkiMerek + (Math.random() > 0.8 ? 1 : 0),
          sertifikatHalal: prev.sertifikatHalal + (Math.random() > 0.9 ? 1 : 0)
        }))
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Dashboard Real-time',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      description: 'Monitoring statistik dan data secara real-time'
    },
    {
      id: 'ikm-binaan',
      title: 'IKM Binaan',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      description: 'Manajemen data IKM dengan validasi NIB & NIK'
    },
    {
      id: 'layanan',
      title: 'Layanan IKM Juara',
      icon: DocumentCheckIcon,
      color: 'bg-purple-500',
      description: 'Berbagai layanan pemberdayaan industri'
    },
    {
      id: 'pelatihan',
      title: 'Pelatihan',
      icon: AcademicCapIcon,
      color: 'bg-orange-500',
      description: 'Manajemen pelatihan pemberdayaan industri'
    }
  ]

  const renderDemoContent = () => {
    switch (currentDemo) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">IKM Binaan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.ikmBinaan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <DocumentCheckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Layanan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.layananTotal}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pelatihan</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Breakdown Layanan IKM Juara</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'HKI Merek', count: stats.hkiMerek, icon: '🏷️' },
                  { name: 'Sertifikat Halal', count: stats.sertifikatHalal, icon: '📜' },
                  { name: 'TKDN IK', count: stats.tkdnIk, icon: '🏭' },
                  { name: 'SIINas', count: stats.siinas, icon: '🌐' },
                  { name: 'Uji Nilai Gizi', count: stats.ujiNilaiGizi, icon: '🧪' },
                  { name: 'Kurasi Produk', count: stats.kurasiProduk, icon: '✨' }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-lg font-bold text-blue-600">{item.count}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'ikm-binaan':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Data IKM Binaan</h3>
              <p className="text-gray-600">Kelola data IKM dengan validasi NIB & NIK</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Usaha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { nib: '1234567890123', nama: 'Budi Santoso', usaha: 'CV. Sumber Rejeki', status: 'Aktif' },
                    { nib: '2345678901234', nama: 'Siti Aminah', usaha: 'UD. Berkah Jaya', status: 'Aktif' },
                    { nib: '3456789012345', nama: 'Ahmad Wijaya', usaha: 'PT. Maju Bersama', status: 'Aktif' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono">{item.nib}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.nama}</td>
                      <td className="px-4 py-3 text-sm">{item.usaha}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      case 'layanan':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Pendaftaran HKI Merek', count: stats.hkiMerek, icon: '🏷️', color: 'bg-blue-100 text-blue-800' },
                { name: 'Sertifikat Halal', count: stats.sertifikatHalal, icon: '📜', color: 'bg-green-100 text-green-800' },
                { name: 'TKDN IK', count: stats.tkdnIk, icon: '🏭', color: 'bg-orange-100 text-orange-800' },
                { name: 'SIINas', count: stats.siinas, icon: '🌐', color: 'bg-indigo-100 text-indigo-800' }
              ].map((layanan, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{layanan.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-lg font-bold ${layanan.color}`}>
                      {layanan.count}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{layanan.name}</h4>
                  <p className="text-sm text-gray-600">Total pendaftaran yang telah diproses</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(layanan.count * 15, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'pelatihan':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Manajemen Pelatihan</h3>
            <div className="text-center py-12">
              <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Pelatihan</h4>
              <p className="text-gray-600 mb-6">Mulai tambahkan data pelatihan pemberdayaan industri</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Tambah Pelatihan
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/website-preview')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Demo Interaktif</h1>
                  <p className="text-sm text-gray-600">IKM JUARA Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isPlaying 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause Demo
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Demo
                  </>
                )}
              </button>
              <button
                onClick={() => router.push('/fast-preview')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Akses Sistem
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Demo Sections</h3>
              <nav className="space-y-2">
                {demoSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentDemo(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentDemo === section.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`${section.color} p-2 rounded-lg mr-3`}>
                        <section.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
              
              {/* Demo Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Demo Status</span>
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <p className="text-xs text-gray-600">
                  {isPlaying ? 'Real-time simulation aktif' : 'Demo dalam mode statis'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {demoSections.find(s => s.id === currentDemo)?.title}
                  </h2>
                  <p className="text-gray-600">
                    {demoSections.find(s => s.id === currentDemo)?.description}
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Reset Demo"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {renderDemoContent()}
          </div>
        </div>
      </div>
    </div>
  )
}