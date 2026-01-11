import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, DocumentArrowDownIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { exportPelatihanPDF } from '../lib/pdfExport'

// Data Jenis Pelatihan
const jenisPelatihanData = [
  {
    id: '1',
    jenis_pelatihan: 'Digital Marketing untuk UMKM',
    sub_kegiatan: 'Pemasaran Online dan Media Sosial',
    tahun_pelaksanaan: 2024,
    status: 'Aktif',
    created_at: '2024-01-01'
  },
  {
    id: '2',
    jenis_pelatihan: 'Manajemen Keuangan UMKM',
    sub_kegiatan: 'Pembukuan dan Laporan Keuangan',
    tahun_pelaksanaan: 2024,
    status: 'Aktif',
    created_at: '2024-01-01'
  },
  {
    id: '3',
    jenis_pelatihan: 'Pengembangan Produk',
    sub_kegiatan: 'Inovasi dan Desain Produk',
    tahun_pelaksanaan: 2024,
    status: 'Selesai',
    created_at: '2024-01-01'
  }
]

// Data Peserta Pelatihan
const pesertaPelatihanData = [
  {
    id: '1',
    pelatihan_id: '1',
    nib: '1234567890123',
    nik: '3573012345678901',
    nama_lengkap: 'Budi Santoso',
    alamat_lengkap: 'Jl. Merdeka No. 123, Kelurahan Manguharjo, Kota Madiun',
    nama_usaha: 'CV. Sumber Rejeki',
    nomor_hp: '081234567890',
    sertifikat: 'https://drive.google.com/file/d/1234567890/view',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    pelatihan_id: '2',
    nib: '2345678901234',
    nik: '3573012345678902',
    nama_lengkap: 'Siti Aminah',
    alamat_lengkap: 'Jl. Pahlawan No. 456, Kelurahan Taman, Kota Madiun',
    nama_usaha: 'UD. Berkah Jaya',
    nomor_hp: '081234567891',
    sertifikat: 'https://drive.google.com/file/d/1234567891/view',
    created_at: '2024-01-20'
  },
  {
    id: '3',
    pelatihan_id: '1',
    nib: '3456789012345',
    nik: '3573012345678903',
    nama_lengkap: 'Ahmad Wijaya',
    alamat_lengkap: 'Jl. Sudirman No. 789, Kelurahan Oro-oro Ombo, Kota Madiun',
    nama_usaha: 'PT. Maju Bersama',
    nomor_hp: '081234567892',
    sertifikat: '',
    created_at: '2024-01-15'
  },
  {
    id: '4',
    pelatihan_id: '1',
    nib: '4567890123456',
    nik: '3573012345678904',
    nama_lengkap: 'Dewi Sartika',
    alamat_lengkap: 'Jl. Gatot Subroto No. 321, Kelurahan Kartoharjo, Kota Madiun',
    nama_usaha: 'CV. Berkah Mandiri',
    nomor_hp: '081234567893',
    sertifikat: 'https://drive.google.com/file/d/1234567893/view',
    created_at: '2024-01-15'
  }
]

// Data IKM Binaan untuk auto-fill
const ikmBinaanData = [
  {
    id: '1',
    nib: '1234567890123',
    nik: '3573012345678901',
    nama_lengkap: 'Budi Santoso',
    alamat_lengkap: 'Jl. Merdeka No. 123, Kelurahan Manguharjo, Kota Madiun',
    nama_usaha: 'CV. Sumber Rejeki',
    nomor_hp: '081234567890'
  },
  {
    id: '2',
    nib: '2345678901234',
    nik: '3573012345678902',
    nama_lengkap: 'Siti Aminah',
    alamat_lengkap: 'Jl. Pahlawan No. 456, Kelurahan Taman, Kota Madiun',
    nama_usaha: 'UD. Berkah Jaya',
    nomor_hp: '081234567891'
  },
  {
    id: '3',
    nib: '3456789012345',
    nik: '3573012345678903',
    nama_lengkap: 'Ahmad Wijaya',
    alamat_lengkap: 'Jl. Sudirman No. 789, Kelurahan Oro-oro Ombo, Kota Madiun',
    nama_usaha: 'PT. Maju Bersama',
    nomor_hp: '081234567892'
  },
  {
    id: '4',
    nib: '4567890123456',
    nik: '3573012345678904',
    nama_lengkap: 'Dewi Sartika',
    alamat_lengkap: 'Jl. Gatot Subroto No. 321, Kelurahan Kartoharjo, Kota Madiun',
    nama_usaha: 'CV. Berkah Mandiri',
    nomor_hp: '081234567893'
  }
]

export default function PelatihanPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jenis') // 'jenis' atau 'peserta'
  const [jenisPelatihanList, setJenisPelatihanList] = useState([])
  const [pesertaList, setPesertaList] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form states untuk jenis pelatihan
  const [showJenisForm, setShowJenisForm] = useState(false)
  const [editingJenisId, setEditingJenisId] = useState(null)
  const [jenisFormData, setJenisFormData] = useState({
    jenis_pelatihan: '',
    sub_kegiatan: '',
    waktu_pelaksanaan: '',
    tempat: '',
    link_materi: '',
    tahun_pelaksanaan: new Date().getFullYear(),
    status: 'Aktif'
  })

  // Form states untuk peserta
  const [showPesertaForm, setShowPesertaForm] = useState(false)
  const [editingPesertaId, setEditingPesertaId] = useState(null)
  const [pesertaFormData, setPesertaFormData] = useState({
    search_key: '',
    nib: '',
    nik: '',
    nama_lengkap: '',
    alamat_lengkap: '',
    nama_usaha: '',
    nomor_hp: '',
    pelatihan_ids: [],
    sertifikat: ''
  })

  // Modal states
  const [showPesertaModal, setShowPesertaModal] = useState(false)
  const [selectedPelatihanId, setSelectedPelatihanId] = useState(null)

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (jenisFormData.jenis_pelatihan || jenisFormData.sub_kegiatan) {
      localStorage.setItem('jenisFormData', JSON.stringify(jenisFormData))
    }
  }, [jenisFormData])

  useEffect(() => {
    if (pesertaFormData.nib || pesertaFormData.nama_lengkap) {
      localStorage.setItem('pesertaFormData', JSON.stringify(pesertaFormData))
    }
  }, [pesertaFormData])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedJenisForm = localStorage.getItem('jenisFormData')
    const savedPesertaForm = localStorage.getItem('pesertaFormData')
    
    if (savedJenisForm) {
      try {
        const parsedJenisForm = JSON.parse(savedJenisForm)
        if (parsedJenisForm.jenis_pelatihan || parsedJenisForm.sub_kegiatan) {
          setJenisFormData(parsedJenisForm)
        }
      } catch (error) {
        console.error('Error parsing saved jenis form data:', error)
      }
    }
    
    if (savedPesertaForm) {
      try {
        const parsedPesertaForm = JSON.parse(savedPesertaForm)
        if (parsedPesertaForm.nib || parsedPesertaForm.nama_lengkap) {
          setPesertaFormData(parsedPesertaForm)
        }
      } catch (error) {
        console.error('Error parsing saved peserta form data:', error)
      }
    }
  }, [])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load Jenis Pelatihan data from API
      const jenisResponse = await fetch('/api/jenis-pelatihan')
      const jenisResult = await jenisResponse.json()
      
      if (jenisResult.success) {
        setJenisPelatihanList(jenisResult.data)
      } else {
        console.error('Error loading Jenis Pelatihan:', jenisResult.error)
        setJenisPelatihanList(jenisPelatihanData) // fallback to dummy data
      }
      
      // Load Peserta Pelatihan data from API
      const pesertaResponse = await fetch('/api/pelatihan')
      const pesertaResult = await pesertaResponse.json()
      
      if (pesertaResult.success) {
        setPesertaList(pesertaResult.data)
      } else {
        console.error('Error loading Peserta Pelatihan:', pesertaResult.error)
        setPesertaList(pesertaPelatihanData) // fallback to dummy data
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Use dummy data as fallback
      setJenisPelatihanList(jenisPelatihanData)
      setPesertaList(pesertaPelatihanData)
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk menghitung jumlah peserta per pelatihan
  const getJumlahPeserta = (pelatihanId) => {
    return pesertaList.filter(peserta => peserta.pelatihan_id === pelatihanId).length
  }

  // Fungsi untuk mencari data IKM Binaan
  const handleSearchIKM = async () => {
    const { search_key } = pesertaFormData
    if (!search_key) {
      alert('Masukkan NIB, NIK, atau Nama Lengkap untuk mencari data')
      return
    }

    try {
      // Load IKM Binaan data from API
      const response = await fetch('/api/ikm-binaan')
      const result = await response.json()
      
      let ikmList = []
      if (result.success) {
        ikmList = result.data
      } else {
        ikmList = ikmBinaanData // fallback to dummy data
      }

      const found = ikmList.find(ikm => 
        ikm.nib === search_key || 
        ikm.nik === search_key || 
        (ikm.nama_lengkap || '').toLowerCase().includes(search_key.toLowerCase())
      )

      if (found) {
        setPesertaFormData(prev => ({
          ...prev,
          nib: found.nib,
          nik: found.nik,
          nama_lengkap: found.nama_lengkap,
          alamat_lengkap: found.alamat_lengkap,
          nama_usaha: found.nama_usaha,
          nomor_hp: found.nomor_hp
        }))
        alert('Data IKM Binaan ditemukan dan berhasil dimuat!')
      } else {
        alert('Data IKM Binaan tidak ditemukan. Periksa kembali NIB, NIK, atau Nama Lengkap.')
      }
    } catch (error) {
      console.error('Error searching IKM:', error)
      alert('Gagal mencari data IKM Binaan')
    }
  }

  // Handle submit jenis pelatihan
  const handleJenisSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingJenisId ? 'PUT' : 'POST'
      const body = editingJenisId 
        ? { id: editingJenisId, ...jenisFormData }
        : jenisFormData

      const response = await fetch('/api/jenis-pelatihan', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        // Reload data
        await loadData()
        alert(editingJenisId ? 'Jenis Pelatihan berhasil diperbarui!' : 'Jenis Pelatihan berhasil ditambahkan!')
        resetJenisForm()
      } else {
        alert('Gagal menyimpan data: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving jenis pelatihan:', error)
      alert('Gagal menyimpan data jenis pelatihan')
    }
  }

  // Handle submit peserta
  const handlePesertaSubmit = async (e) => {
    e.preventDefault()
    
    if (pesertaFormData.pelatihan_ids.length === 0) {
      alert('Pilih minimal satu jenis pelatihan')
      return
    }

    try {
      // First, find or create IKM Binaan record
      const ikmResponse = await fetch('/api/ikm-binaan')
      const ikmResult = await ikmResponse.json()
      
      let ikmId = null
      if (ikmResult.success) {
        const existingIkm = ikmResult.data.find(ikm => ikm.nib === pesertaFormData.nib)
        if (existingIkm) {
          ikmId = existingIkm.id
        }
      }

      // If IKM not found, we need the IKM ID from the search
      if (!ikmId) {
        alert('Data IKM Binaan tidak ditemukan. Pastikan data sudah tersimpan di sistem.')
        return
      }

      // Create pelatihan entries for each selected jenis pelatihan
      for (const jenisId of pesertaFormData.pelatihan_ids) {
        const pelatihanData = {
          ikm_id: ikmId,
          jenis_pelatihan_id: jenisId,
          nama_pelatihan: jenisPelatihanList.find(j => j.id === jenisId)?.jenis_pelatihan || '',
          tanggal_pelatihan: new Date().toISOString().split('T')[0], // Today's date as default
          sertifikat: pesertaFormData.sertifikat
        }

        const response = await fetch('/api/pelatihan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pelatihanData)
        })

        const result = await response.json()
        if (!result.success) {
          console.error('Error creating pelatihan:', result.error)
        }
      }

      // Reload data
      await loadData()
      alert('Peserta berhasil didaftarkan ke pelatihan yang dipilih!')
      resetPesertaForm()
    } catch (error) {
      console.error('Error saving peserta:', error)
      alert('Gagal menyimpan data peserta')
    }
  }

  const resetJenisForm = () => {
    setJenisFormData({
      jenis_pelatihan: '',
      sub_kegiatan: '',
      waktu_pelaksanaan: '',
      tempat: '',
      link_materi: '',
      tahun_pelaksanaan: new Date().getFullYear(),
      status: 'Aktif'
    })
    setEditingJenisId(null)
    setShowJenisForm(false)
    // Clear saved form data
    localStorage.removeItem('jenisFormData')
  }

  const resetPesertaForm = () => {
    setPesertaFormData({
      search_key: '',
      nib: '',
      nik: '',
      nama_lengkap: '',
      alamat_lengkap: '',
      nama_usaha: '',
      nomor_hp: '',
      pelatihan_ids: [],
      sertifikat: ''
    })
    setEditingPesertaId(null)
    setShowPesertaForm(false)
    // Clear saved form data
    localStorage.removeItem('pesertaFormData')
  }

  // Handle edit jenis pelatihan
  const handleEditJenis = (jenis) => {
    setJenisFormData({
      jenis_pelatihan: jenis.jenis_pelatihan,
      sub_kegiatan: jenis.sub_kegiatan,
      waktu_pelaksanaan: jenis.waktu_pelaksanaan || '',
      tempat: jenis.tempat || '',
      link_materi: jenis.link_materi || '',
      tahun_pelaksanaan: jenis.tahun_pelaksanaan,
      status: jenis.status
    })
    setEditingJenisId(jenis.id)
    setShowJenisForm(true)
  }

  // Handle delete jenis pelatihan
  const handleDeleteJenis = async (id) => {
    if (confirm('Yakin ingin menghapus jenis pelatihan ini?')) {
      try {
        const response = await fetch('/api/jenis-pelatihan', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()

        if (result.success) {
          await loadData()
          alert('Jenis Pelatihan berhasil dihapus!')
        } else {
          alert('Gagal menghapus data: ' + result.error)
        }
      } catch (error) {
        console.error('Error deleting jenis pelatihan:', error)
        alert('Gagal menghapus data jenis pelatihan')
      }
    }
  }

  // Handle lihat peserta
  const handleLihatPeserta = (pelatihanId) => {
    setSelectedPelatihanId(pelatihanId)
    setShowPesertaModal(true)
  }

  // Get peserta by pelatihan id
  const getPesertaByPelatihan = (pelatihanId) => {
    return pesertaList.filter(peserta => peserta.pelatihan_id === pelatihanId)
  }

  // Export functions (placeholder)
  const handleExportExcel = (pelatihanId) => {
    const peserta = getPesertaByPelatihan(pelatihanId)
    const pelatihan = jenisPelatihanList.find(p => p.id === pelatihanId)
    
    // Simulasi export - dalam implementasi real, gunakan library seperti xlsx
    const csvContent = [
      ['No', 'NIB', 'NIK', 'Nama Lengkap', 'Alamat', 'Nama Usaha', 'No HP', 'Sertifikat'],
      ...peserta.map((p, index) => [
        index + 1,
        p.nib,
        p.nik,
        p.nama_lengkap,
        p.alamat_lengkap,
        p.nama_usaha,
        p.nomor_hp,
        p.sertifikat ? 'Ada' : 'Belum'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `peserta_${pelatihan?.jenis_pelatihan || 'pelatihan'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = async (pelatihanId) => {
    try {
      let dataToExport, pesertaToExport

      if (pelatihanId) {
        // Export specific pelatihan
        dataToExport = jenisPelatihanList.filter(item => item.id === pelatihanId)
        pesertaToExport = pesertaList.filter(item => item.pelatihan_ids && item.pelatihan_ids.includes(pelatihanId))
      } else {
        // Export all pelatihan
        dataToExport = jenisPelatihanList
        pesertaToExport = pesertaList
      }

      if (dataToExport.length === 0) {
        alert('Tidak ada data pelatihan untuk diekspor')
        return
      }

      // Export to PDF
      await exportPelatihanPDF(dataToExport, pesertaToExport)

      console.log('PDF Pelatihan berhasil diekspor')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Gagal mengekspor PDF. Silakan coba lagi.')
    }
  }

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pelatihan Pemberdayaan Industri</h1>
          <p className="text-gray-600">Kelola jenis pelatihan dan peserta pelatihan untuk IKM Binaan</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('jenis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jenis'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Jenis Pelatihan
              </button>
              <button
                onClick={() => setActiveTab('peserta')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'peserta'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Peserta Pelatihan
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content - Jenis Pelatihan */}
        {activeTab === 'jenis' && (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <button 
                onClick={() => setShowJenisForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Tambah Jenis Pelatihan</span>
              </button>
            </div>

            {/* Table Jenis Pelatihan */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Pelatihan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Kegiatan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Peserta</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : jenisPelatihanList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Belum ada data jenis pelatihan
                        </td>
                      </tr>
                    ) : (
                      jenisPelatihanList.map((jenis, index) => (
                        <tr key={jenis.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{jenis.jenis_pelatihan}</td>
                          <td className="px-4 py-3 text-sm">{jenis.sub_kegiatan}</td>
                          <td className="px-4 py-3 text-sm">{jenis.tahun_pelaksanaan}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getJumlahPeserta(jenis.id)} peserta
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              jenis.status === 'Aktif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {jenis.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleLihatPeserta(jenis.id)}
                                className="text-green-600 hover:text-green-800"
                                title="Lihat Peserta"
                              >
                                <UserGroupIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditJenis(jenis)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJenis(jenis.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Hapus"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab Content - Peserta Pelatihan */}
        {activeTab === 'peserta' && (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <button 
                onClick={() => setShowPesertaForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Tambah Peserta Pelatihan</span>
              </button>
            </div>

            {/* Table Peserta */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB/NIK</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama/Usaha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Pelatihan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sertifikat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : pesertaList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Belum ada data peserta pelatihan
                        </td>
                      </tr>
                    ) : (
                      pesertaList.map((peserta, index) => {
                        const jenisPelatihan = peserta.jenis_pelatihan || 
                          jenisPelatihanList.find(j => j.id === peserta.jenis_pelatihan_id) ||
                          jenisPelatihanList.find(j => j.id === peserta.pelatihan_id)
                        return (
                          <tr key={peserta.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-mono text-xs">{peserta.ikm_binaan?.nib || peserta.nib}</div>
                                <div className="font-mono text-xs text-gray-500">{peserta.ikm_binaan?.nik || peserta.nik}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">{peserta.ikm_binaan?.nama_lengkap || peserta.nama_lengkap}</div>
                                <div className="text-gray-500">{peserta.ikm_binaan?.nama_usaha || peserta.nama_usaha}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{jenisPelatihan?.jenis_pelatihan || peserta.nama_pelatihan || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">
                              {peserta.sertifikat ? (
                                <a
                                  href={peserta.sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-800 text-xs"
                                >
                                  Lihat Sertifikat
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">Belum tersedia</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {/* Handle edit peserta */}}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {/* Handle delete peserta */}}
                                  className="text-red-600 hover:text-red-800"
                                  title="Hapus"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {/* Form Modal - Jenis Pelatihan */}
        {showJenisForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingJenisId ? 'Edit Jenis Pelatihan' : 'Tambah Jenis Pelatihan'}
              </h2>
              
              <form onSubmit={handleJenisSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Pelatihan *
                  </label>
                  <input
                    type="text"
                    value={jenisFormData.jenis_pelatihan}
                    onChange={(e) => setJenisFormData({...jenisFormData, jenis_pelatihan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: Digital Marketing untuk UMKM"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Kegiatan *
                  </label>
                  <input
                    type="text"
                    value={jenisFormData.sub_kegiatan}
                    onChange={(e) => setJenisFormData({...jenisFormData, sub_kegiatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: Pemasaran Online dan Media Sosial"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    value={jenisFormData.waktu_pelaksanaan}
                    onChange={(e) => setJenisFormData({...jenisFormData, waktu_pelaksanaan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: 15-17 Januari 2024, 08:00-16:00 WIB"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat *
                  </label>
                  <input
                    type="text"
                    value={jenisFormData.tempat}
                    onChange={(e) => setJenisFormData({...jenisFormData, tempat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: Aula Dinas Perindustrian Kota Madiun"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Materi Pelatihan
                  </label>
                  <input
                    type="url"
                    value={jenisFormData.link_materi}
                    onChange={(e) => setJenisFormData({...jenisFormData, link_materi: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Link ke materi pelatihan di Google Drive (opsional)</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Pelaksanaan *
                    </label>
                    <input
                      type="number"
                      value={jenisFormData.tahun_pelaksanaan}
                      onChange={(e) => setJenisFormData({...jenisFormData, tahun_pelaksanaan: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={jenisFormData.status}
                      onChange={(e) => setJenisFormData({...jenisFormData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Ditunda">Ditunda</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetJenisForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {editingJenisId ? 'Perbarui Data' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Form Modal - Peserta Pelatihan */}
        {showPesertaForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tambah Peserta Pelatihan
              </h2>
              
              <form onSubmit={handlePesertaSubmit} className="space-y-6">
                {/* Pencarian Data IKM */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cari Data IKM Binaan</h3>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={pesertaFormData.search_key}
                        onChange={(e) => setPesertaFormData({...pesertaFormData, search_key: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan NIB (13 digit), NIK (16 digit), atau Nama Lengkap"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchIKM}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                      <span>Gunakan Data</span>
                    </button>
                  </div>
                </div>

                {/* Data IKM yang ditemukan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIB (13 Digit) *
                    </label>
                    <input
                      type="text"
                      value={pesertaFormData.nib}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, nib: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      maxLength="13"
                      readOnly
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIK (16 Digit) *
                    </label>
                    <input
                      type="text"
                      value={pesertaFormData.nik}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, nik: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      maxLength="16"
                      readOnly
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={pesertaFormData.nama_lengkap}
                    onChange={(e) => setPesertaFormData({...pesertaFormData, nama_lengkap: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                    readOnly
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={pesertaFormData.alamat_lengkap}
                    onChange={(e) => setPesertaFormData({...pesertaFormData, alamat_lengkap: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                    rows="2"
                    readOnly
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Usaha *
                    </label>
                    <input
                      type="text"
                      value={pesertaFormData.nama_usaha}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, nama_usaha: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      readOnly
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor HP *
                    </label>
                    <input
                      type="text"
                      value={pesertaFormData.nomor_hp}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, nomor_hp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                      readOnly
                      required
                    />
                  </div>
                </div>

                {/* Pilih Jenis Pelatihan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Jenis Pelatihan * (Bisa pilih lebih dari 1)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {jenisPelatihanList.filter(j => j.status === 'Aktif').map((jenis) => (
                      <label key={jenis.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          value={jenis.id}
                          checked={pesertaFormData.pelatihan_ids.includes(jenis.id)}
                          onChange={(e) => {
                            const pelatihanId = e.target.value
                            if (e.target.checked) {
                              setPesertaFormData(prev => ({
                                ...prev,
                                pelatihan_ids: [...prev.pelatihan_ids, pelatihanId]
                              }))
                            } else {
                              setPesertaFormData(prev => ({
                                ...prev,
                                pelatihan_ids: prev.pelatihan_ids.filter(id => id !== pelatihanId)
                              }))
                            }
                          }}
                          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{jenis.jenis_pelatihan}</div>
                          <div className="text-xs text-gray-500">{jenis.sub_kegiatan} - {jenis.tahun_pelaksanaan}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Sertifikat (Google Drive) - Opsional
                  </label>
                  <input
                    type="url"
                    value={pesertaFormData.sertifikat}
                    onChange={(e) => setPesertaFormData({...pesertaFormData, sertifikat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Kosongkan jika sertifikat belum tersedia</p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetPesertaForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Lihat Peserta */}
        {showPesertaModal && selectedPelatihanId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Daftar Peserta Pelatihan
                  </h2>
                  <p className="text-gray-600">
                    {jenisPelatihanList.find(j => j.id === selectedPelatihanId)?.jenis_pelatihan}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportExcel(selectedPelatihanId)}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    <span>Export Excel</span>
                  </button>
                  <button
                    onClick={() => handleExportPDF(selectedPelatihanId)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2 text-sm"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => setShowPesertaModal(false)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Usaha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No HP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sertifikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getPesertaByPelatihan(selectedPelatihanId).map((peserta, index) => (
                      <tr key={peserta.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono">{peserta.nib}</td>
                        <td className="px-4 py-3 text-sm font-mono">{peserta.nik}</td>
                        <td className="px-4 py-3 text-sm font-medium">{peserta.nama_lengkap}</td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate" title={peserta.alamat_lengkap}>
                          {peserta.alamat_lengkap}
                        </td>
                        <td className="px-4 py-3 text-sm">{peserta.nama_usaha}</td>
                        <td className="px-4 py-3 text-sm">{peserta.nomor_hp}</td>
                        <td className="px-4 py-3 text-sm">
                          {peserta.sertifikat ? (
                            <a
                              href={peserta.sertifikat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 text-xs"
                            >
                              Lihat
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Belum ada</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {getPesertaByPelatihan(selectedPelatihanId).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belum ada peserta untuk pelatihan ini
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
    </AdminRoute>
  )
}