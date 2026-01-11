import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  CogIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

// Navigation untuk Admin (akses penuh)
const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'IKM Binaan', href: '/ikm-binaan', icon: BuildingOfficeIcon },
  { 
    name: 'Layanan IKM Juara', 
    icon: CogIcon,
    children: [
      { name: 'Pendaftaran HKI Merek', href: '/layanan/hki-merek' },
      { name: 'Pendaftaran Sertifikat Halal', href: '/layanan/sertifikat-halal' },
      { name: 'Pendaftaran TKDN IK', href: '/layanan/tkdn-ik' },
      { name: 'Pendaftaran dan Pendampingan SIINas', href: '/layanan/siinas' },
      { name: 'Pendaftaran Uji Nilai Gizi', href: '/layanan/uji-nilai-gizi' },
      { name: 'Kurasi Produk', href: '/layanan/kurasi-produk' },
    ]
  },
  { name: 'Pelatihan Pemberdayaan Industri', href: '/pelatihan', icon: AcademicCapIcon },
  { name: 'Laporan IKM JUARA', href: '/laporan', icon: DocumentTextIcon },
  { name: 'Log Aktivitas', href: '/log-aktivitas', icon: ClockIcon },
  { name: 'Penelusuran Data IKM Binaan', href: '/penelusuran', icon: MagnifyingGlassIcon },
  { name: 'Recycle Bin', href: '/recycle-bin', icon: TrashIcon },
]

// Navigation untuk User (hanya penelusuran)
const userNavigation = [
  { name: 'Penelusuran Data IKM Binaan', href: '/penelusuran', icon: MagnifyingGlassIcon },
]

export default function Layout({ children }) {
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [expandedMenu, setExpandedMenu] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role)
    
    // Redirect user ke penelusuran jika mencoba akses halaman lain
    if (role === 'user' && router.pathname !== '/penelusuran') {
      router.push('/penelusuran')
      return
    }
    
    // Auto expand menu if current path is in children (hanya untuk admin)
    if (role === 'admin') {
      adminNavigation.forEach(item => {
        if (item.children) {
          const isChildActive = item.children.some(child => router.pathname === child.href)
          if (isChildActive) {
            setExpandedMenu(item.name)
          }
        }
      })
    }
  }, [router.pathname])

  // Pilih navigation berdasarkan role
  const navigation = userRole === 'admin' ? adminNavigation : userNavigation

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName)
  }

  if (!userRole) return <div>Loading...</div>

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IKM</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Database IKM JUARA</h1>
              <p className="text-xs text-gray-500">DisnakerKUKM Kota Madiun</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Mode: <span className="font-medium capitalize">{userRole}</span><br />
            {userRole === 'user' && (
              <span className="text-blue-600 font-medium">Akses Terbatas - Penelusuran Data</span>
            )}
            {userRole === 'admin' && (
              <span className="text-gray-400">Kota Madiun</span>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedMenu === item.name
              const hasActiveChild = item.children.some(child => router.pathname === child.href)
              
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      hasActiveChild 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="bg-gray-50">
                      {item.children.map((child) => {
                        const isActive = router.pathname === child.href
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block px-12 py-2 text-sm transition-colors ${
                              isActive 
                                ? 'text-blue-700 bg-blue-100 border-r-2 border-blue-500' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'sidebar-active' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}