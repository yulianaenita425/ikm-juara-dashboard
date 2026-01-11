import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { DocumentArrowDownIcon, CalendarIcon, UserIcon, ClockIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { exportLogAktivitasPDF } from '../lib/pdfExport'

// Data dummy log aktivitas admin
const logAktivitasAdmin = [
  {
    id: '1',
    user: 'admin',
    role: 'admin',
    aktivitas: 'Login ke sistem',
    detail: 'Admin berhasil login ke dashboard',
    timestamp: '2024-01-15T08:30:00Z',
    ip_address: '192.168.1.100'
  },
  {
    id: '2',
    user: 'admin',
    role: 'admin',
    aktivitas: 'Tambah IKM Binaan',
    detail: 'Menambahkan data IKM Binaan: CV. Sumber Rejeki',
    timestamp: '2024-01-15T09:15:00Z',
    ip_address: '192.168.1.100'
  },
  {
    id: '3',
    user: 'admin',
    role: 'admin',
    aktivitas: 'Edit HKI Merek',
    detail: 'Mengubah status HKI Merek menjadi Telah Didaftar',
    timestamp: '2024-01-15T10:20:00Z',
    ip_address: '192.168.1.100'
  },
  {
    id: '4',
    user: 'admin',
    role: 'admin',
    aktivitas: 'Tambah Pelatihan',
    detail: 'Menambahkan jenis pelatihan: Digital Marketing untuk UMKM',
    timestamp: '2024-01-15T11:45:00Z',
    ip_address: '192.168.1.100'
  },
  {
    id: '5',
    user: 'admin',
    role: 'admin',
    aktivitas: 'Export Laporan',
    detail: 'Export laporan HKI Merek tahun 2024 ke Excel',
    timestamp: '2024-01-15T14:30:00Z',
    ip_address: '192.168.1.100'
  }
]

// Data dummy buku tamu (pengunjung)
const logBukuTamu = [
  {
    id: '1',
    nama_lengkap: 'Andi Pratama',
    alamat_lengkap: 'Jl. Mawar No. 15, Kelurahan Taman, Kota Madiun',
    nomor_hp: '081234567890',
    aktivitas: 'Penelusuran Data',
    detail: 'Mencari data IKM dengan NIB 1234567890123',
    timestamp: '2024-01-15T09:00:00Z',
    ip_address: '192.168.1.101'
  },
  {
    id: '2',
    nama_lengkap: 'Sari Dewi',
    alamat_lengkap: 'Jl. Melati No. 22, Kelurahan Manguharjo, Kota Madiun',
    nomor_hp: '081234567891',
    aktivitas: 'Penelusuran Data',
    detail: 'Mencari data IKM dengan nama Ahmad Wijaya',
    timestamp: '2024-01-15T10:30:00Z',
    ip_address: '192.168.1.102'
  },
  {
    id: '3',
    nama_lengkap: 'Budi Setiawan',
    alamat_lengkap: 'Jl. Anggrek No. 8, Kelurahan Kartoharjo, Kota Madiun',
    nomor_hp: '081234567892',
    aktivitas: 'Penelusuran Data',
    detail: 'Mencari data IKM dengan NIK 3573012345678902',
    timestamp: '2024-01-15T13:15:00Z',
    ip_address: '192.168.1.103'
  },
  {
    id: '4',
    nama_lengkap: 'Maya Sari',
    alamat_lengkap: 'Jl. Kenanga No. 12, Kelurahan Oro-oro Ombo, Kota Madiun',
    nomor_hp: '081234567893',
    aktivitas: 'Penelusuran Data',
    detail: 'Mencari data IKM dengan nama CV. Berkah Jaya',
    timestamp: '2024-01-15T15:45:00Z',
    ip_address: '192.168.1.104'
  }
]

export default function LogAktivitasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('admin') // 'admin' atau 'pengunjung'
  const [filters, setFilters] = useState({
    tanggal_mulai: '',
    tanggal_selesai: '',
    user: ''
  })
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userRole = localStorage.getItem('userRole')
    
    if (!isLoggedIn || userRole !== 'admin') {
      router.push('/login')
      return
    }
    
    setLoading(false)
  }, [router])

  useEffect(() => {
    // Filter data berdasarkan tab dan kriteria
    let data = activeTab === 'admin' ? logAktivitasAdmin : logBukuTamu
    
    // Filter berdasarkan tanggal
    if (filters.tanggal_mulai) {
      data = data.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0]
        return itemDate >= filters.tanggal_mulai
      })
    }
    
    if (filters.tanggal_selesai) {
      data = data.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0]
        return itemDate <= filters.tanggal_selesai
      })
    }
    
    // Filter berdasarkan user (untuk admin) atau nama (untuk pengunjung)
    if (filters.user) {
      data = data.filter(item => {
        const searchField = activeTab === 'admin' ? item.user : item.nama_lengkap
        return searchField.toLowerCase().includes(filters.user.toLowerCase())
      })
    }
    
    setFilteredData(data)
  }, [activeTab, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      tanggal_mulai: '',
      tanggal_selesai: '',
      user: ''
    })
  }

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    let headers, csvContent
    
    if (activeTab === 'admin') {
      headers = ['No', 'User', 'Role', 'Aktivitas', 'Detail', 'Waktu', 'IP Address']
      csvContent = [
        headers,
        ...filteredData.map((item, index) => [
          index + 1,
          item.user,
          item.role,
          item.aktivitas,
          item.detail,
          new Date(item.timestamp).toLocaleString('id-ID'),
          item.ip_address
        ])
      ].map(row => row.join(',')).join('\n')
    } else {
      headers = ['No', 'Nama Lengkap', 'Alamat', 'No HP', 'Aktivitas', 'Detail', 'Waktu', 'IP Address']
      csvContent = [
        headers,
        ...filteredData.map((item, index) => [
          index + 1,
          item.nama_lengkap,
          item.alamat_lengkap,
          item.nomor_hp,
          item.aktivitas,
          item.detail,
          new Date(item.timestamp).toLocaleString('id-ID'),
          item.ip_address
        ])
      ].map(row => row.join(',')).join('\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `log_aktivitas_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    try {
      // Export to PDF
      await exportLogAktivitasPDF(filteredData, {
        startDate: startDate,
        endDate: endDate,
        user: selectedUser
      })

      console.log('PDF Log Aktivitas berhasil diekspor')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Gagal mengekspor PDF. Silakan coba lagi.')
    }
  }

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-600">Riwayat aktivitas admin dan pengunjung website</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserIcon className="h-4 w-4 inline mr-2" />
                Aktivitas Admin
              </button>
              <button
                onClick={() => setActiveTab('pengunjung')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pengunjung'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserIcon className="h-4 w-4 inline mr-2" />
                Buku Tamu Pengunjung
              </button>
            </nav>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter Data
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filters.tanggal_mulai}
                onChange={(e) => handleFilterChange('tanggal_mulai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={filters.tanggal_selesai}
                onChange={(e) => handleFilterChange('tanggal_selesai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'admin' ? 'Username' : 'Nama Pengunjung'}
              </label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'admin' ? 'Cari username...' : 'Cari nama pengunjung...'}
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'admin' ? 'Log Aktivitas Admin' : 'Log Buku Tamu Pengunjung'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredData.length} aktivitas ditemukan
              </p>
            </div>
            
            {filteredData.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2 text-sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada data aktivitas yang sesuai dengan filter</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    {activeTab === 'admin' ? (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktivitas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      {activeTab === 'admin' ? (
                        <>
                          <td className="px-4 py-3 text-sm font-medium">{item.user}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.role === 'admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.role}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium">{item.nama_lengkap}</div>
                              <div className="text-gray-500 text-xs max-w-xs truncate" title={item.alamat_lengkap}>
                                {item.alamat_lengkap}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{item.nomor_hp}</td>
                        </>
                      )}
                      <td className="px-4 py-3 text-sm font-medium">{item.aktivitas}</td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate" title={item.detail}>
                        {item.detail}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-xs">
                          <div>{new Date(item.timestamp).toLocaleDateString('id-ID')}</div>
                          <div className="text-gray-500">{new Date(item.timestamp).toLocaleTimeString('id-ID')}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-xs">{item.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
    </AdminRoute>
  )
}