import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { DocumentArrowDownIcon, FunnelIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { exportLaporanPDF } from '../lib/pdfExport'

// Data dummy untuk laporan
const laporanData = {
  'hki-merek': [
    {
      id: '1',
      nib: '1234567890123',
      nik: '3573012345678901',
      nama_lengkap: 'Budi Santoso',
      nama_usaha: 'CV. Sumber Rejeki',
      nomor_pendaftaran: 'HKI-2024-001',
      status_sertifikat: 'Telah Didaftar',
      tahun_fasilitasi: 2024,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      nib: '2345678901234',
      nik: '3573012345678902',
      nama_lengkap: 'Siti Aminah',
      nama_usaha: 'UD. Berkah Jaya',
      nomor_pendaftaran: 'HKI-2024-002',
      status_sertifikat: 'Proses',
      tahun_fasilitasi: 2024,
      created_at: '2024-01-20'
    }
  ],
  'sertifikat-halal': [
    {
      id: '1',
      nib: '2345678901234',
      nik: '3573012345678902',
      nama_lengkap: 'Siti Aminah',
      nama_usaha: 'UD. Berkah Jaya',
      nomor_sertifikat: 'HALAL-2024-001',
      tahun_fasilitasi: 2024,
      created_at: '2024-02-01'
    }
  ],
  'tkdn-ik': [
    {
      id: '1',
      nib: '3456789012345',
      nik: '3573012345678903',
      nama_lengkap: 'Ahmad Wijaya',
      nama_usaha: 'PT. Maju Bersama',
      nomor_sertifikat: 'TKDN-2024-001',
      tahun_terbit: 2024,
      created_at: '2024-02-15'
    }
  ],
  'siinas': [
    {
      id: '1',
      nib: '4567890123456',
      nik: '3573012345678904',
      nama_lengkap: 'Dewi Sartika',
      nama_usaha: 'CV. Berkah Mandiri',
      nomor_bukti_akun: 'SIINAS-2024-001',
      tahun_registrasi: 2024,
      created_at: '2024-03-01'
    }
  ],
  'uji-nilai-gizi': [
    {
      id: '1',
      nib: '1234567890123',
      nik: '3573012345678901',
      nama_lengkap: 'Budi Santoso',
      nama_usaha: 'CV. Sumber Rejeki',
      nomor_lhu: 'UNG-2024-001',
      tahun_fasilitasi: 2024,
      created_at: '2024-03-15'
    }
  ],
  'kurasi-produk': [
    {
      id: '1',
      nib: '2345678901234',
      nik: '3573012345678902',
      nama_lengkap: 'Siti Aminah',
      nama_usaha: 'UD. Berkah Jaya',
      nomor_sertifikat: 'KP-2024-001',
      created_at: '2024-04-01'
    }
  ],
  'pelatihan': [
    {
      id: '1',
      nib: '1234567890123',
      nik: '3573012345678901',
      nama_lengkap: 'Budi Santoso',
      nama_usaha: 'CV. Sumber Rejeki',
      nama_pelatihan: 'Digital Marketing untuk UMKM',
      tanggal_pelatihan: '2024-01-15',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      nib: '2345678901234',
      nik: '3573012345678902',
      nama_lengkap: 'Siti Aminah',
      nama_usaha: 'UD. Berkah Jaya',
      nama_pelatihan: 'Manajemen Keuangan UMKM',
      tanggal_pelatihan: '2024-01-20',
      created_at: '2024-01-20'
    }
  ]
}

const jenisLayananOptions = [
  { value: 'hki-merek', label: 'Pendaftaran HKI Merek' },
  { value: 'sertifikat-halal', label: 'Pendaftaran Sertifikat Halal' },
  { value: 'tkdn-ik', label: 'Pendaftaran TKDN IK' },
  { value: 'siinas', label: 'Pendaftaran dan Pendampingan SIINas' },
  { value: 'uji-nilai-gizi', label: 'Pendaftaran Uji Nilai Gizi' },
  { value: 'kurasi-produk', label: 'Kurasi Produk' },
  { value: 'pelatihan', label: 'Pelatihan Pemberdayaan Industri' }
]

export default function LaporanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    jenis_layanan: '',
    tahun: new Date().getFullYear(),
    bulan: ''
  })
  const [filteredData, setFilteredData] = useState([])
  const [showFilters, setShowFilters] = useState(false)

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
    // Filter data berdasarkan kriteria yang dipilih
    if (filters.jenis_layanan) {
      let data = laporanData[filters.jenis_layanan] || []
      
      // Filter berdasarkan tahun
      if (filters.tahun) {
        data = data.filter(item => {
          const itemYear = new Date(item.created_at).getFullYear()
          return itemYear === parseInt(filters.tahun)
        })
      }
      
      // Filter berdasarkan bulan
      if (filters.bulan) {
        data = data.filter(item => {
          const itemMonth = new Date(item.created_at).getMonth() + 1
          return itemMonth === parseInt(filters.bulan)
        })
      }
      
      setFilteredData(data)
    } else {
      setFilteredData([])
    }
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      jenis_layanan: '',
      tahun: new Date().getFullYear(),
      bulan: ''
    })
  }

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    const selectedLayanan = jenisLayananOptions.find(opt => opt.value === filters.jenis_layanan)
    
    // Buat header berdasarkan jenis layanan
    let headers = ['No', 'NIB', 'NIK', 'Nama Lengkap', 'Nama Usaha']
    
    if (filters.jenis_layanan === 'hki-merek') {
      headers.push('Nomor Pendaftaran', 'Status Sertifikat', 'Tahun Fasilitasi')
    } else if (filters.jenis_layanan === 'sertifikat-halal') {
      headers.push('Nomor Sertifikat', 'Tahun Fasilitasi')
    } else if (filters.jenis_layanan === 'tkdn-ik') {
      headers.push('Nomor Sertifikat', 'Tahun Terbit')
    } else if (filters.jenis_layanan === 'siinas') {
      headers.push('Nomor Bukti Akun', 'Tahun Registrasi')
    } else if (filters.jenis_layanan === 'uji-nilai-gizi') {
      headers.push('Nomor LHU', 'Tahun Fasilitasi')
    } else if (filters.jenis_layanan === 'kurasi-produk') {
      headers.push('Nomor Sertifikat')
    } else if (filters.jenis_layanan === 'pelatihan') {
      headers.push('Nama Pelatihan', 'Tanggal Pelatihan')
    }
    
    headers.push('Tanggal Input')

    // Buat data CSV
    const csvContent = [
      headers,
      ...filteredData.map((item, index) => {
        let row = [
          index + 1,
          item.nib,
          item.nik,
          item.nama_lengkap,
          item.nama_usaha
        ]
        
        if (filters.jenis_layanan === 'hki-merek') {
          row.push(item.nomor_pendaftaran, item.status_sertifikat, item.tahun_fasilitasi)
        } else if (filters.jenis_layanan === 'sertifikat-halal') {
          row.push(item.nomor_sertifikat, item.tahun_fasilitasi)
        } else if (filters.jenis_layanan === 'tkdn-ik') {
          row.push(item.nomor_sertifikat, item.tahun_terbit)
        } else if (filters.jenis_layanan === 'siinas') {
          row.push(item.nomor_bukti_akun, item.tahun_registrasi)
        } else if (filters.jenis_layanan === 'uji-nilai-gizi') {
          row.push(item.nomor_lhu, item.tahun_fasilitasi)
        } else if (filters.jenis_layanan === 'kurasi-produk') {
          row.push(item.nomor_sertifikat)
        } else if (filters.jenis_layanan === 'pelatihan') {
          row.push(item.nama_pelatihan, item.tanggal_pelatihan)
        }
        
        row.push(new Date(item.created_at).toLocaleDateString('id-ID'))
        return row
      })
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan_${filters.jenis_layanan}_${filters.tahun}${filters.bulan ? '_' + filters.bulan : ''}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    try {
      // Prepare data for PDF export
      const exportData = filteredData.map(item => ({
        nama_lengkap: item.nama_lengkap,
        nama_usaha: item.nama_usaha,
        nib: item.nib,
        jenis_layanan: item.jenis_layanan,
        status: item.status_sertifikat || item.status || 'Aktif',
        tahun_fasilitasi: item.tahun_fasilitasi || item.tahun_terbit || new Date().getFullYear()
      }))

      // Try jsPDF first
      try {
        await exportLaporanPDF(exportData, {
          jenis: selectedJenis,
          tahun: selectedTahun,
          bulan: selectedBulan
        })
        console.log('PDF berhasil diekspor dengan jsPDF')
      } catch (pdfError) {
        console.warn('jsPDF failed, using simple export:', pdfError)
        // Fallback to simple export
        const { exportLaporanSimple } = await import('../lib/simplePdfExport')
        exportLaporanSimple(exportData, {
          jenis: selectedJenis,
          tahun: selectedTahun,
          bulan: selectedBulan
        })
        console.log('PDF berhasil diekspor dengan simple export')
      }

    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Gagal mengekspor PDF. Silakan coba lagi.')
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Laporan IKM JUARA</h1>
          <p className="text-gray-600">Laporan data layanan IKM JUARA dan Pelatihan Pemberdayaan Industri</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter Laporan
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Layanan *
                </label>
                <select
                  value={filters.jenis_layanan}
                  onChange={(e) => handleFilterChange('jenis_layanan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Jenis Layanan</option>
                  {jenisLayananOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun
                </label>
                <select
                  value={filters.tahun}
                  onChange={(e) => handleFilterChange('tahun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Tahun</option>
                  {[2024, 2023, 2022, 2021, 2020].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bulan
                </label>
                <select
                  value={filters.bulan}
                  onChange={(e) => handleFilterChange('bulan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Bulan</option>
                  {[
                    { value: 1, label: 'Januari' },
                    { value: 2, label: 'Februari' },
                    { value: 3, label: 'Maret' },
                    { value: 4, label: 'April' },
                    { value: 5, label: 'Mei' },
                    { value: 6, label: 'Juni' },
                    { value: 7, label: 'Juli' },
                    { value: 8, label: 'Agustus' },
                    { value: 9, label: 'September' },
                    { value: 10, label: 'Oktober' },
                    { value: 11, label: 'November' },
                    { value: 12, label: 'Desember' }
                  ].map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
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
          )}
        </div>

        {/* Results Section */}
        {filters.jenis_layanan && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Hasil Laporan: {jenisLayananOptions.find(opt => opt.value === filters.jenis_layanan)?.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredData.length} data ditemukan
                  {filters.tahun && ` untuk tahun ${filters.tahun}`}
                  {filters.bulan && ` bulan ${filters.bulan}`}
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
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada data yang sesuai dengan filter yang dipilih</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama/Usaha</th>
                      {filters.jenis_layanan === 'hki-merek' && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Pendaftaran</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                        </>
                      )}
                      {filters.jenis_layanan === 'sertifikat-halal' && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Sertifikat</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                        </>
                      )}
                      {filters.jenis_layanan === 'pelatihan' && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pelatihan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Input</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono">{item.nib}</td>
                        <td className="px-4 py-3 text-sm font-mono">{item.nik}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{item.nama_lengkap}</div>
                            <div className="text-gray-500 text-xs">{item.nama_usaha}</div>
                          </div>
                        </td>
                        {filters.jenis_layanan === 'hki-merek' && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.nomor_pendaftaran}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status_sertifikat === 'Telah Didaftar' 
                                  ? 'bg-green-100 text-green-800'
                                  : item.status_sertifikat === 'Proses'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.status_sertifikat}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{item.tahun_fasilitasi}</td>
                          </>
                        )}
                        {filters.jenis_layanan === 'sertifikat-halal' && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.nomor_sertifikat}</td>
                            <td className="px-4 py-3 text-sm">{item.tahun_fasilitasi}</td>
                          </>
                        )}
                        {filters.jenis_layanan === 'pelatihan' && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.nama_pelatihan}</td>
                            <td className="px-4 py-3 text-sm">{item.tanggal_pelatihan}</td>
                          </>
                        )}
                        <td className="px-4 py-3 text-sm">
                          {new Date(item.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {!filters.jenis_layanan && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Filter Laporan</h3>
            <p className="text-gray-600">
              Silakan pilih jenis layanan dan periode waktu untuk menampilkan laporan data
            </p>
          </div>
        )}
      </div>
    </Layout>
    </AdminRoute>
  )
}