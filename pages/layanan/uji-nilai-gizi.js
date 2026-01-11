import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import AdminRoute from '../../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Data IKM Binaan (simulasi dari database)
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

const dummyData = [
  {
    id: '1',
    nib: '2345678901234',
    nik: '3573012345678902',
    nama_lengkap: 'Dewi Sartika',
    alamat_lengkap: 'Jl. Gatot Subroto No. 321, Kelurahan Kartoharjo, Kota Madiun',
    nama_usaha: 'CV. Berkah Mandiri',
    nomor_hp: '081234567893',
    nomor_lhu: 'LHU-2024-001',
    tanggal_hasil_uji: '2024-01-20',
    tahun_fasilitasi: 2024,
    link_lhu: 'https://drive.google.com/file/d/lhu001/view'
  }
]

export default function UjiNilaiGiziPage() {
  const router = useRouter()
  const [giziList, setGiziList] = useState([])
  const [ikmBinaanList, setIkmBinaanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // State untuk pencarian IKM Binaan
  const [showIkmSearch, setShowIkmSearch] = useState(false)
  const [ikmSearchTerm, setIkmSearchTerm] = useState('')
  const [selectedIkm, setSelectedIkm] = useState(null)
  
  const [formData, setFormData] = useState({
    // Data dari IKM Binaan
    nib: '',
    nik: '',
    nama_lengkap: '',
    alamat_lengkap: '',
    nama_usaha: '',
    nomor_hp: '',
    // Data tambahan Uji Nilai Gizi
    nomor_lhu: '',
    tanggal_hasil_uji: '',
    tahun_fasilitasi: new Date().getFullYear(),
    link_lhu: ''
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    // Load data from Supabase API
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load Uji Nilai Gizi data
      const giziResponse = await fetch('/api/uji-nilai-gizi')
      const giziResult = await giziResponse.json()
      
      if (giziResult.success) {
        setGiziList(giziResult.data)
      } else {
        console.error('Error loading Uji Nilai Gizi data:', giziResult.error)
      }
      
      // Load IKM Binaan data for dropdown
      const ikmResponse = await fetch('/api/ikm-binaan')
      const ikmResult = await ikmResponse.json()
      
      if (ikmResult.success) {
        setIkmBinaanList(ikmResult.data)
      } else {
        console.error('Error loading IKM data:', ikmResult.error)
        setIkmBinaanList(ikmBinaanData) // fallback to dummy data
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setIkmBinaanList(ikmBinaanData) // fallback to dummy data
    } finally {
      setLoading(false)
    }
  }

  // Filter IKM Binaan berdasarkan pencarian
  const filteredIkmBinaan = ikmBinaanList.filter(ikm => 
    ikm.nib.includes(ikmSearchTerm) ||
    ikm.nik.includes(ikmSearchTerm) ||
    ikm.nama_lengkap.toLowerCase().includes(ikmSearchTerm.toLowerCase())
  )

  // Fungsi untuk menggunakan data IKM Binaan
  const handleUseIkmData = (ikm) => {
    setSelectedIkm(ikm)
    setFormData(prev => ({
      ...prev,
      nib: ikm.nib,
      nik: ikm.nik,
      nama_lengkap: ikm.nama_lengkap,
      alamat_lengkap: ikm.alamat_lengkap,
      nama_usaha: ikm.nama_usaha,
      nomor_hp: ikm.nomor_hp
    }))
    setShowIkmSearch(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId 
        ? { 
            id: editingId, 
            ikm_id: selectedIkm?.id || formData.ikm_id,
            nomor_lhu: formData.nomor_lhu,
            tanggal_hasil_uji: formData.tanggal_hasil_uji,
            tahun_fasilitasi: formData.tahun_fasilitasi,
            link_lhu: formData.link_lhu
          }
        : {
            ikm_id: selectedIkm?.id,
            nomor_lhu: formData.nomor_lhu,
            tanggal_hasil_uji: formData.tanggal_hasil_uji,
            tahun_fasilitasi: formData.tahun_fasilitasi,
            link_lhu: formData.link_lhu
          }

      const response = await fetch('/api/uji-nilai-gizi', {
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
        resetForm()
        alert(result.message || 'Data Uji Nilai Gizi berhasil disimpan!')
      } else {
        alert(result.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving Uji Nilai Gizi:', error)
      alert('Gagal menyimpan data')
    }
  }

  const handleEdit = (gizi) => {
    // Set data IKM Binaan dari relasi atau data yang ada
    const ikmData = gizi.ikm_binaan || {
      id: gizi.ikm_id,
      nib: gizi.nib,
      nik: gizi.nik,
      nama_lengkap: gizi.nama_lengkap,
      alamat_lengkap: gizi.alamat_lengkap,
      nama_usaha: gizi.nama_usaha,
      nomor_hp: gizi.nomor_hp
    }
    
    setSelectedIkm(ikmData)
    setFormData({
      nib: ikmData.nib || '',
      nik: ikmData.nik || '',
      nama_lengkap: ikmData.nama_lengkap || '',
      alamat_lengkap: ikmData.alamat_lengkap || '',
      nama_usaha: ikmData.nama_usaha || '',
      nomor_hp: ikmData.nomor_hp || '',
      nomor_lhu: gizi.nomor_lhu || '',
      tanggal_hasil_uji: gizi.tanggal_hasil_uji || '',
      tahun_fasilitasi: gizi.tahun_fasilitasi || new Date().getFullYear(),
      link_lhu: gizi.link_lhu || '',
      ikm_id: gizi.ikm_id
    })
    setEditingId(gizi.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const itemToDelete = giziList.find(item => item.id === id)
    if (!itemToDelete) {
      alert('Data tidak ditemukan!')
      return
    }

    if (confirm(`Yakin ingin menghapus data Uji Nilai Gizi "${itemToDelete.nomor_lhu}" untuk ${itemToDelete.ikm_binaan?.nama_usaha || 'IKM'}? Data akan dipindahkan ke Recycle Bin.`)) {
      try {
        const response = await fetch('/api/uji-nilai-gizi', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()

        if (result.success) {
          await loadData() // Reload data
          alert(result.message || 'Data berhasil dihapus')
        } else {
          alert(result.error || 'Gagal menghapus data')
        }
      } catch (error) {
        console.error('Error deleting Uji Nilai Gizi:', error)
        alert('Gagal menghapus data')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nib: '',
      nik: '',
      nama_lengkap: '',
      alamat_lengkap: '',
      nama_usaha: '',
      nomor_hp: '',
      nomor_lhu: '',
      tanggal_hasil_uji: '',
      tahun_fasilitasi: new Date().getFullYear(),
      link_lhu: ''
    })
    setSelectedIkm(null)
    setEditingId(null)
    setShowForm(false)
    setShowIkmSearch(false)
    setIkmSearchTerm('')
  }

  const filteredGizi = giziList.filter(gizi => 
    (gizi.ikm_binaan?.nama_lengkap || gizi.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gizi.ikm_binaan?.nama_usaha || gizi.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gizi.nomor_lhu || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Uji Nilai Gizi</h1>
          <p className="text-gray-600">Kelola pendaftaran Uji Nilai Gizi untuk produk IKM Binaan</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tambah Uji Nilai Gizi</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-64"
                  placeholder="Cari nama, usaha, atau nomor..."
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Uji Nilai Gizi' : 'Tambah Uji Nilai Gizi'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pencarian IKM Binaan */}
                {!editingId && !selectedIkm && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-900 mb-3">
                      Langkah 1: Pilih Data IKM Binaan
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      Masukkan NIB (13 digit), NIK (16 digit), atau Nama Lengkap untuk mencari data IKM Binaan
                    </p>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={ikmSearchTerm}
                          onChange={(e) => setIkmSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pl-10"
                          placeholder="Masukkan NIB, NIK, atau Nama Lengkap..."
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowIkmSearch(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cari Data
                      </button>
                    </div>

                    {/* Hasil Pencarian IKM Binaan */}
                    {showIkmSearch && (
                      <div className="mt-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                        {filteredIkmBinaan.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            {ikmSearchTerm ? 'Tidak ada data yang ditemukan' : 'Masukkan kata kunci pencarian'}
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredIkmBinaan.map((ikm) => (
                              <div key={ikm.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{ikm.nama_lengkap}</div>
                                  <div className="text-sm text-gray-500">{ikm.nama_usaha}</div>
                                  <div className="text-xs text-gray-400">
                                    NIB: {ikm.nib} | NIK: {ikm.nik}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleUseIkmData(ikm)}
                                  className="ml-3 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center space-x-1"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                  <span>Gunakan Data</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Data IKM Binaan yang Dipilih */}
                {selectedIkm && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-green-900">
                        Data IKM Binaan Terpilih
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIkm(null)
                          setFormData(prev => ({
                            ...prev,
                            nib: '',
                            nik: '',
                            nama_lengkap: '',
                            alamat_lengkap: '',
                            nama_usaha: '',
                            nomor_hp: ''
                          }))
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Nama:</span> {selectedIkm.nama_lengkap}</div>
                      <div><span className="font-medium">Usaha:</span> {selectedIkm.nama_usaha}</div>
                      <div><span className="font-medium">NIB:</span> {selectedIkm.nib}</div>
                      <div><span className="font-medium">NIK:</span> {selectedIkm.nik}</div>
                    </div>
                  </div>
                )}

                {/* Form Data Uji Nilai Gizi */}
                {(selectedIkm || editingId) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      {editingId ? 'Edit Data Uji Nilai Gizi' : 'Langkah 2: Lengkapi Data Uji Nilai Gizi'}
                    </h3>

                    {/* Data IKM Binaan (Read-only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIB (13 Digit)
                        </label>
                        <input
                          type="text"
                          value={formData.nib}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIK (16 Digit)
                        </label>
                        <input
                          type="text"
                          value={formData.nik}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.nama_lengkap}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Usaha
                        </label>
                        <input
                          type="text"
                          value={formData.nama_usaha}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Data Tambahan Uji Nilai Gizi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor LHU *
                        </label>
                        <input
                          type="text"
                          value={formData.nomor_lhu}
                          onChange={(e) => setFormData({...formData, nomor_lhu: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="LHU-YYYY-XXX"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Hasil Uji *
                        </label>
                        <input
                          type="date"
                          value={formData.tanggal_hasil_uji}
                          onChange={(e) => setFormData({...formData, tanggal_hasil_uji: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tahun Fasilitasi *
                        </label>
                        <input
                          type="number"
                          value={formData.tahun_fasilitasi}
                          onChange={(e) => setFormData({...formData, tahun_fasilitasi: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          min="2020"
                          max="2030"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link LHU *
                      </label>
                      <input
                        type="url"
                        value={formData.link_lhu}
                        onChange={(e) => setFormData({...formData, link_lhu: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://drive.google.com/..."
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  {(selectedIkm || editingId) && (
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Simpan Data
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB/NIK</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama/Usaha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. LHU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Uji</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Fasilitasi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredGizi.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Belum ada data Uji Nilai Gizi
                    </td>
                  </tr>
                ) : (
                  filteredGizi.map((gizi, index) => (
                    <tr key={gizi.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-xs">
                          <div>NIB: {gizi.ikm_binaan?.nib || gizi.nib || '-'}</div>
                          <div>NIK: {gizi.ikm_binaan?.nik || gizi.nik || '-'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{gizi.ikm_binaan?.nama_lengkap || gizi.nama_lengkap || '-'}</div>
                          <div className="text-gray-500">{gizi.ikm_binaan?.nama_usaha || gizi.nama_usaha || '-'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{gizi.nomor_lhu}</td>
                      <td className="px-4 py-3 text-sm">{gizi.tanggal_hasil_uji}</td>
                      <td className="px-4 py-3 text-sm">{gizi.tahun_fasilitasi}</td>
                      <td className="px-4 py-3 text-sm">
                        <a
                          href={gizi.link_lhu}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="text-xs">Lihat LHU</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(gizi)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(gizi.id)}
                            className="text-red-600 hover:text-red-800"
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
      </div>
      </Layout>
    </AdminRoute>
  )
}