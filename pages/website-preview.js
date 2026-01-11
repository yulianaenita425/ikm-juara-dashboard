import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  BuildingOfficeIcon, 
  DocumentCheckIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function WebsitePreview() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const result = await response.json()
        setStats(result)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'IKM Binaan Management',
      description: 'Kelola data IKM Binaan dengan sistem validasi NIB dan NIK yang terintegrasi',
      color: 'bg-blue-500',
      stats: stats?.totalIkmBinaan?.current || 6
    },
    {
      icon: DocumentCheckIcon,
      title: 'Layanan IKM Juara',
      description: 'Pendaftaran HKI Merek, Sertifikat Halal, TKDN IK, SIINas, dan layanan lainnya',
      color: 'bg-green-500',
      stats: stats?.layananIkmJuara?.current || 12
    },
    {
      icon: AcademicCapIcon,
      title: 'Pelatihan Pemberdayaan',
      description: 'Manajemen pelatihan industri dengan tracking sertifikat dan peserta',
      color: 'bg-purple-500',
      stats: stats?.pelatihanPemberdayaan?.current || 0
    },
    {
      icon: ChartBarIcon,
      title: 'Dashboard Real-time',
      description: 'Monitoring statistik dan aktivitas dengan update otomatis',
      color: 'bg-orange-500',
      stats: 'Live'
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Laporan & Export',
      description: 'Generate laporan komprehensif dengan export PDF dan Excel',
      color: 'bg-indigo-500',
      stats: 'PDF'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Keamanan Data',
      description: 'Sistem autentikasi dan otorisasi dengan role-based access',
      color: 'bg-red-500',
      stats: 'Secure'
    }
  ]

  const layananBreakdown = [
    { name: 'Pendaftaran HKI Merek', count: stats?.layananIkmJuara?.breakdown?.hkiMerek || 4, icon: '🏷️', color: 'text-blue-600' },
    { name: 'Sertifikat Halal', count: stats?.layananIkmJuara?.breakdown?.sertifikatHalal || 2, icon: '📜', color: 'text-green-600' },
    { name: 'TKDN IK', count: stats?.layananIkmJuara?.breakdown?.tkdnIk || 1, icon: '🏭', color: 'text-orange-600' },
    { name: 'SIINas', count: stats?.layananIkmJuara?.breakdown?.siinas || 2, icon: '🌐', color: 'text-indigo-600' },
    { name: 'Uji Nilai Gizi', count: stats?.layananIkmJuara?.breakdown?.ujiNilaiGizi || 1, icon: '🧪', color: 'text-red-600' },
    { name: 'Kurasi Produk', count: stats?.layananIkmJuara?.breakdown?.kurasiProduk || 2, icon: '✨', color: 'text-purple-600' }
  ]

  const techStack = [
    { name: 'Next.js 14', description: 'React Framework', icon: '⚛️' },
    { name: 'Supabase', description: 'PostgreSQL Database', icon: '🗄️' },
    { name: 'Tailwind CSS', description: 'Styling Framework', icon: '🎨' },
    { name: 'Real-time API', description: 'Live Data Sync', icon: '🔄' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">IKM JUARA</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login System
              </button>
              <button
                onClick={() => router.push('/fast-preview')}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Live Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistem Manajemen
            <span className="text-blue-600 block">IKM JUARA</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform digital terintegrasi untuk mengelola data IKM Binaan dan layanan pemberdayaan industri 
            di DisnakerKUKM Kota Madiun dengan teknologi real-time dan interface yang user-friendly.
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loading ? '...' : stats?.totalIkmBinaan?.current || 6}
              </div>
              <div className="text-gray-600">IKM Binaan Terdaftar</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : stats?.layananIkmJuara?.current || 12}
              </div>
              <div className="text-gray-600">Total Layanan</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Data Tersinkronisasi</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/demo-interactive')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Demo Interaktif
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/fast-preview')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Akses Sistem Langsung
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Fitur Unggulan</h3>
            <p className="text-xl text-gray-600">Solusi lengkap untuk manajemen IKM dengan teknologi modern</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className={`${feature.color} p-3 rounded-lg w-fit mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Data: {feature.stats}</span>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan Breakdown */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Layanan IKM JUARA</h3>
            <p className="text-xl text-gray-600">Berbagai layanan pemberdayaan industri yang tersedia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layananBreakdown.map((layanan, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{layanan.icon}</span>
                  <span className={`text-2xl font-bold ${layanan.color}`}>{layanan.count}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{layanan.name}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${layanan.color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min(layanan.count * 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Teknologi Modern</h3>
            <p className="text-xl text-gray-600">Dibangun dengan teknologi terdepan untuk performa optimal</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{tech.name}</h4>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Keunggulan Sistem</h3>
            <p className="text-xl opacity-90">Mengapa memilih IKM JUARA Management System?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Real-time Updates', desc: 'Data selalu terbaru dengan sinkronisasi otomatis' },
              { icon: '🔒', title: 'Keamanan Tinggi', desc: 'Sistem autentikasi dan enkripsi data yang kuat' },
              { icon: '📱', title: 'Responsive Design', desc: 'Dapat diakses dari desktop, tablet, dan mobile' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Visualisasi data dan laporan yang komprehensif' },
              { icon: '🔄', title: 'Auto Backup', desc: 'Backup otomatis dan recovery data yang handal' },
              { icon: '🎯', title: 'User Friendly', desc: 'Interface intuitif dan mudah digunakan' }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{benefit.title}</h4>
                <p className="opacity-90">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Siap Mencoba Sistem?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Akses demo live atau login ke sistem untuk melihat semua fitur yang tersedia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/demo-interactive')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <StarIcon className="h-5 w-5 mr-2" />
              Demo Interaktif
            </button>
            <button
              onClick={() => router.push('/fast-preview')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Akses Sistem
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-bold">IKM JUARA</h4>
                  <p className="text-sm text-gray-400">Management System</p>
                </div>
              </div>
              <p className="text-gray-400">
                Sistem manajemen digital untuk pemberdayaan IKM di Kota Madiun
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• IKM Binaan Management</li>
                <li>• Layanan IKM Juara</li>
                <li>• Dashboard Real-time</li>
                <li>• Laporan & Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Teknologi</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Next.js 14</li>
                <li>• Supabase PostgreSQL</li>
                <li>• Tailwind CSS</li>
                <li>• Real-time API</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IKM JUARA Management System - DisnakerKUKM Kota Madiun</p>
            <p className="mt-2">Dikembangkan dengan ❤️ menggunakan teknologi modern</p>
          </div>
        </div>
      </footer>
    </div>
  )
}