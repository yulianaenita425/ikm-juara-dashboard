import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { DocumentArrowDownIcon, FunnelIcon, MagnifyingGlassIcon, ChartBarIcon, AcademicCapIcon, BuildingOfficeIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export default function LaporanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [allData, setAllData] = useState({})
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({
    jenis_layanan: '',
    tahun: '',
    bulan: '',
    status: ''
  })

  // Definisi kolom sesuai spesifikasi yang diminta - EXACT MATCH
  const serviceColumns = {
    'hki-merek': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_pendaftaran', label: 'No. Pendaftaran', width: 'w-36' },
      { key: 'status', label: 'Status', width: 'w-24' },
      { key: 'tahun', label: 'Tahun', width: 'w-24' },
      { key: 'dokumen', label: 'Dokumen', width: 'w-32' }
    ],
    'sertifikat-halal': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_sertifikat', label: 'No. Sertifikat', width: 'w-36' },
      { key: 'status', label: 'Status', width: 'w-24' },
      { key: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', width: 'w-32' },
      { key: 'link_sertifikat', label: 'Link Sertifikat', width: 'w-32' },
      { key: 'link_logo', label: 'Link Logo', width: 'w-32' }
    ],
    'tkdn-ik': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_sertifikat', label: 'No. Sertifikat', width: 'w-36' },
      { key: 'persentase_tkdn', label: 'TKDN %', width: 'w-24' },
      { key: 'status', label: 'Status', width: 'w-24' },
      { key: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', width: 'w-32' },
      { key: 'link_dokumen', label: 'Link Dokumen', width: 'w-32' }
    ],
    'siinas': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_bukti_akun', label: 'No. Bukti Akun', width: 'w-36' },
      { key: 'tahun_registrasi', label: 'Tahun Registrasi', width: 'w-32' },
      { key: 'link_dokumen', label: 'Link Dokumen', width: 'w-32' }
    ],
    'uji-nilai-gizi': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_lhu', label: 'No. LHU', width: 'w-32' },
      { key: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', width: 'w-32' },
      { key: 'link_dokumen', label: 'Link Dokumen', width: 'w-32' }
    ],
    'kurasi-produk': [
      { key: 'no', label: 'No.', width: 'w-16' },
      { key: 'nib', label: 'NIB', width: 'w-32' },
      { key: 'nik', label: 'NIK', width: 'w-32' },
      { key: 'nama_lengkap', label: 'Nama Lengkap', width: 'w-48' },
      { key: 'nama_usaha', label: 'Nama Usaha', width: 'w-48' },
      { key: 'nomor_hp', label: 'No. HP', width: 'w-32' },
      { key: 'nomor_sertifikat', label: 'No. Sertifikat', width: 'w-36' },
      { key: 'link_dokumen', label: 'Link Dokumen', width: 'w-32' }
    ]
  }

  // Label untuk dropdown
  const serviceLabels = {
    'hki-merek': 'Pendaftaran HKI Merek',
    'sertifikat-halal': 'Pendaftaran Sertifikat Halal',
    'tkdn-ik': 'Pendaftaran TKDN IK',
    'siinas': 'SIINas',
    'kurasi-produk': 'Kurasi Produk',
    'uji-nilai-gizi': 'Uji Nilai Gizi'
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    loadAllData()
  }, [router])

  const loadAllData = async () => {
    setLoading(true)
    try {
      // Load semua data dari berbagai endpoint
      const endpoints = [
        { key: 'hki-merek', url: '/api/hki-merek' },
        { key: 'sertifikat-halal', url: '/api/sertifikat-halal' },
        { key: 'tkdn-ik', url: '/api/tkdn-ik' },
        { key: 'siinas', url: '/api/siinas' },
        { key: 'kurasi-produk', url: '/api/kurasi-produk' },
        { key: 'uji-nilai-gizi', url: '/api/uji-nilai-gizi' }
      ]

      const dataPromises = endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint.url)
          const result = await response.json()
          return { key: endpoint.key, data: result.success ? result.data : [] }
        } catch (error) {
          console.error(`Error loading ${endpoint.key}:`, error)
          return { key: endpoint.key, data: [] }
        }
      })

      const results = await Promise.all(dataPromises)
      const newAllData = {}
      const newStats = {}

      results.forEach(result => {
        newAllData[result.key] = result.data
        newStats[result.key] = result.data.length
      })

      setAllData(newAllData)
      setStats(newStats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (filters.jenis_layanan && allData[filters.jenis_layanan]) {
      loadFilteredData()
    } else {
      setFilteredData([])
    }
  }, [filters, allData])

  const loadFilteredData = async () => {
    try {
      let data = allData[filters.jenis_layanan] || []
      
      // Transform data untuk menampilkan kolom yang benar
      data = data.map(item => {
        // Ambil data dari relasi ikm_binaan jika ada
        const baseData = {
          ...item,
          nib: item.ikm_binaan?.nib || item.nib || '',
          nik: item.ikm_binaan?.nik || item.nik || '',
          nama_lengkap: item.ikm_binaan?.nama_lengkap || item.nama_lengkap || '',
          nama_usaha: item.ikm_binaan?.nama_usaha || item.nama_usaha || '',
          nomor_hp: item.ikm_binaan?.nomor_hp || item.nomor_hp || ''
        }

        // Mapping khusus per jenis layanan
        switch (filters.jenis_layanan) {
          case 'hki-merek':
            return {
              ...baseData,
              nomor_pendaftaran: item.nomor_pendaftaran || item.nomor_sertifikat || '',
              status: item.status_pendaftaran || item.status || '',
              tahun: item.tahun_fasilitasi || new Date(item.created_at).getFullYear() || '',
              dokumen: item.link_bukti_daftar || item.link_dokumen || ''
            }
          case 'sertifikat-halal':
            return {
              ...baseData,
              nomor_sertifikat: item.nomor_sertifikat || '',
              status: item.status_sertifikat || item.status || '',
              tahun_fasilitasi: item.tahun_fasilitasi || new Date(item.created_at).getFullYear() || '',
              link_sertifikat: item.link_sertifikat || '',
              link_logo: item.link_logo || ''
            }
          case 'tkdn-ik':
            return {
              ...baseData,
              nomor_sertifikat: item.nomor_sertifikat || '',
              persentase_tkdn: item.persentase_tkdn || item.tkdn_percentage || '',
              status: item.status || '',
              tahun_fasilitasi: item.tahun_fasilitasi || new Date(item.created_at).getFullYear() || '',
              link_dokumen: item.link_dokumen || ''
            }
          case 'siinas':
            return {
              ...baseData,
              nomor_bukti_akun: item.nomor_bukti_akun || item.nomor_akun || '',
              tahun_registrasi: item.tahun_registrasi || new Date(item.created_at).getFullYear() || '',
              link_dokumen: item.link_dokumen || ''
            }
          case 'uji-nilai-gizi':
            return {
              ...baseData,
              nomor_lhu: item.nomor_lhu || item.nomor_sertifikat || '',
              tahun_fasilitasi: item.tahun_fasilitasi || new Date(item.created_at).getFullYear() || '',
              link_dokumen: item.link_dokumen || ''
            }
          case 'kurasi-produk':
            return {
              ...baseData,
              nomor_sertifikat: item.nomor_sertifikat || '',
              link_dokumen: item.link_dokumen || ''
            }
          default:
            return baseData
        }
      })
      
      // Filter berdasarkan tahun
      if (filters.tahun) {
        data = data.filter(item => {
          const itemYear = item.tahun || item.tahun_fasilitasi || item.tahun_registrasi || new Date(item.created_at).getFullYear()
          return itemYear && itemYear.toString() === filters.tahun
        })
      }
      
      // Filter berdasarkan bulan
      if (filters.bulan) {
        data = data.filter(item => {
          const itemDate = item.created_at || item.tanggal_daftar || item.tanggal_pengajuan
          if (itemDate) {
            const itemMonth = new Date(itemDate).getMonth() + 1
            return itemMonth === parseInt(filters.bulan)
          }
          return false
        })
      }

      // Filter berdasarkan status
      if (filters.status) {
        data = data.filter(item => {
          const itemStatus = item.status || item.status_pendaftaran || item.status_sertifikat
          return itemStatus && itemStatus.toLowerCase().includes(filters.status.toLowerCase())
        })
      }
      
      setFilteredData(data)
    } catch (error) {
      console.error('Error loading filtered data:', error)
      setFilteredData([])
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      jenis_layanan: '',
      tahun: '',
      bulan: '',
      status: ''
    })
  }

  const formatCellValue = (item, column) => {
    if (column.key === 'no') return ''
    
    let value = item[column.key]
    
    // Format persentase TKDN
    if (column.key === 'persentase_tkdn') {
      return value ? `${value}%` : '-'
    }
    
    // Format tahun
    if (column.key === 'tahun' || column.key === 'tahun_fasilitasi' || column.key === 'tahun_registrasi') {
      return value || '-'
    }
    
    return value || '-'
  }

  const getStatusBadge = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    const statusLower = status.toLowerCase()
    if (statusLower.includes('aktif') || statusLower.includes('selesai') || statusLower.includes('diterima') || statusLower.includes('sudah diterbitkan')) {
      return 'bg-green-100 text-green-800'
    } else if (statusLower.includes('proses') || statusLower.includes('pending') || statusLower.includes('menunggu')) {
      return 'bg-yellow-100 text-yellow-800'
    } else if (statusLower.includes('ditolak') || statusLower.includes('gagal')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-blue-100 text-blue-800'
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year)
    }
    return years
  }

  const exportToExcel = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    const columns = serviceColumns[filters.jenis_layanan] || []
    const headers = columns.map(col => col.label)
    
    let csvContent = '\uFEFF' + headers.join(',') + '\n' // Add BOM for UTF-8
    
    filteredData.forEach((item, index) => {
      const row = columns.map(col => {
        if (col.key === 'no') return index + 1
        
        let value = formatCellValue(item, col)
        
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`
        }
        
        return value
      })
      
      csvContent += row.join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    
    const serviceName = filters.jenis_layanan.replace('-', '_')
    const dateStr = new Date().toISOString().split('T')[0]
    link.setAttribute('download', `laporan_${serviceName}_${dateStr}.csv`)
    
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert(`✅ Laporan berhasil diekspor!\nFile: laporan_${serviceName}_${dateStr}.csv\nJumlah data: ${filteredData.length} records`)
  }

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data laporan...</p>
            </div>
          </div>
        </Layout>
      </AdminRoute>
    )
  }

  const currentColumns = serviceColumns[filters.jenis_layanan] || []

  return (
    <AdminRoute>
      <Layout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Laporan IKM JUARA</h1>
            <p className="text-gray-600 mt-2">Laporan komprehensif data layanan IKM JUARA DisnakerKUKM Kota Madiun</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <p className="text-blue-100 text-sm">HKI Merek</p>
                <p className="text-2xl font-bold">{stats['hki-merek'] || 0}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <p className="text-green-100 text-sm">Sertifikat Halal</p>
                <p className="text-2xl font-bold">{stats['sertifikat-halal'] || 0}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <ChartBarIcon className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                <p className="text-purple-100 text-sm">TKDN IK</p>
                <p className="text-2xl font-bold">{stats['tkdn-ik'] || 0}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-2 text-orange-200" />
                <p className="text-orange-100 text-sm">SIINas</p>
                <p className="text-2xl font-bold">{stats['siinas'] || 0}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-teal-200" />
                <p className="text-teal-100 text-sm">Uji Nilai Gizi</p>
                <p className="text-2xl font-bold">{stats['uji-nilai-gizi'] || 0}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="text-center">
                <ChartBarIcon className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                <p className="text-indigo-100 text-sm">Kurasi Produk</p>
                <p className="text-2xl font-bold">{stats['kurasi-produk'] || 0}</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-6 w-6 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Filter Laporan</h2>
              </div>
              
              <button
                onClick={resetFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Reset Filter</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan *</label>
                <select
                  value={filters.jenis_layanan}
                  onChange={(e) => handleFilterChange('jenis_layanan', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Jenis Layanan</option>
                  {Object.entries(serviceLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                <select
                  value={filters.tahun}
                  onChange={(e) => handleFilterChange('tahun', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Tahun</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                <select
                  value={filters.bulan}
                  onChange={(e) => handleFilterChange('bulan', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Bulan</option>
                  <option value="1">Januari</option>
                  <option value="2">Februari</option>
                  <option value="3">Maret</option>
                  <option value="4">April</option>
                  <option value="5">Mei</option>
                  <option value="6">Juni</option>
                  <option value="7">Juli</option>
                  <option value="8">Agustus</option>
                  <option value="9">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                  <option value="sudah diterbitkan">Sudah Diterbitkan</option>
                  <option value="proses">Dalam Proses</option>
                  <option value="pending">Pending</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {filteredData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {serviceLabels[filters.jenis_layanan]}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredData.length} data
                  </span>
                </div>
                
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          {filters.jenis_layanan ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {filteredData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {currentColumns.map((column) => (
                          <th
                            key={column.key}
                            className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || 'w-auto'}`}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                          {currentColumns.map((column) => (
                            <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                              {column.key === 'no' ? (
                                <span className="font-medium">{index + 1}</span>
                              ) : column.key === 'status' ? (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item[column.key])}`}>
                                  {formatCellValue(item, column)}
                                </span>
                              ) : column.key.includes('link_') || column.key === 'dokumen' ? (
                                item[column.key] && item[column.key].startsWith('http') ? (
                                  <a
                                    href={item[column.key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                  >
                                    Lihat Dokumen
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )
                              ) : (
                                <span className="break-words">{formatCellValue(item, column)}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada data</h3>
                  <p className="text-gray-600">Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
              <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pilih Jenis Layanan</h3>
              <p className="text-gray-600">Pilih jenis layanan dari filter di atas untuk melihat laporan data yang komprehensif dengan kolom yang sesuai.</p>
            </div>
          )}
        </div>
      </Layout>
    </AdminRoute>
  )
}