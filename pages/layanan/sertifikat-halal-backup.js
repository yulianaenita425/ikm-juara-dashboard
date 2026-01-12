import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import AdminRoute from '../../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SertifikatHalalPage() {
  const router = useRouter()
  const [halalList, setHalalList] = useState([])
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
    // Data tambahan Sertifikat Halal
    nomor_sertifikat: '',
    link_sertifikat: '',
    logo_halal: '',
    tahun_fasilitasi: new Date().getFullYear()
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
      
      // Load Sertifikat Halal data
      const halalResponse = await fetch('/api/sertifikat-halal')
      const halalResult = await halalResponse.json()
      
      if (halalResult.success) {
        setHalalList(halalResult.data)
      } else {
        console.error('Error loading Sertifikat Halal data:', halalResult.error)
      }
      
      // Load IKM Binaan data for dropdown
      const ikmResponse = await fetch('/api/ikm-binaan')
      const ikmResult = await ikmResponse.json()
      
      if (ikmResult.success) {
        setIkmBinaanList(ikmResult.data)
      } else {
        console.error('Error loading IKM data:', ikmResult.error)
      }
    } catch (error) {
      console.error('Error loading data:', error)
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
            nomor_sertifikat: formData.nomor_sertifikat,
            link_sertifikat: formData.link_sertifikat,
            logo_halal: formData.logo_halal,
            tahun_fasilitasi: formData.tahun_fasilitasi
          }
        : {
            ikm_id: selectedIkm?.id,
            nomor_sertifikat: formData.nomor_sertifikat,
            link_sertifikat: formData.link_sertifikat,
            logo_halal: formData.logo_halal,
            tahun_fasilitasi: formData.tahun_fasilitasi
          }

      const response = await fetch('/api/sertifikat-halal', {
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
        alert(result.message || 'Data Sertifikat Halal berhasil disimpan!')
      } else {
        alert(result.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving Sertifikat Halal:', error)
      alert('Gagal menyimpan data')
    }
  }

  const handleEdit = (halal) => {
    setFormData({
      nib: halal.ikm_binaan?.nib || '',
      nik: halal.ikm_binaan?.nik || '',
      nama_lengkap: halal.ikm_binaan?.nama_lengkap || '',
      alamat_lengkap: halal.ikm_binaan?.alamat_lengkap || '',
      nama_usaha: halal.ikm_binaan?.nama_usaha || '',
      nomor_hp: halal.ikm_binaan?.nomor_hp || '',
      nomor_sertifikat: halal.nomor_sertifikat,
      link_sertifikat: halal.link_sertifikat,
      logo_halal: halal.logo_halal || '',
      tahun_fasilitasi: halal.tahun_fasilitasi,
      ikm_id: halal.ikm_id
    })
    setSelectedIkm(halal.ikm_binaan)
    setEditingId(halal.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const itemToDelete = halalList.find(item => item.id === id)
    if (!itemToDelete) {
      alert('Data tidak ditemukan!')
      return
    }

    if (confirm(`Yakin ingin menghapus data Sertifikat Halal "${itemToDelete.nomor_sertifikat}" untuk ${itemToDelete.ikm_binaan?.nama_usaha || 'IKM'}? Data akan dipindahkan ke Recycle Bin.`)) {
      try {
        const response = await fetch('/api/sertifikat-halal', {
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
        console.error('Error deleting Sertifikat Halal:', error)
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
      nomor_sertifikat: '',
      link_sertifikat: '',
      logo_halal: '',
      tahun_fasilitasi: new Date().getFullYear()
    })
    setSelectedIkm(null)
    setEditingId(null)
    setShowForm(false)
    setShowIkmSearch(false)
  }

  // Filter data berdasarkan pencarian
  const filteredData = halalList.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.ikm_binaan?.nib?.includes(searchTerm) ||
      item.ikm_binaan?.nik?.includes(searchTerm) ||
      item.ikm_binaan?.nama_lengkap?.toLowerCase().includes(searchLower) ||
      item.ikm_binaan?.nama_usaha?.toLowerCase().includes(searchLower) ||
      item.nomor_sertifikat?.toLowerCase().includes(searchLower)
    )
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Sertifikat Halal</h1>
          <p className="text-gray-600">Kelola pendaftaran Sertifikat Halal untuk IKM Binaan</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tambah Sertifikat Halal</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Cari NIB, NIK, nama, atau nomor sertifikat..."
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB/NIK</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama/Usaha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor Sertifikat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Fasilitasi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sertifikat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo Halal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data Sertifikat Halal'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((halal, index) => (
                    <tr key={halal.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-mono text-xs">{halal.ikm_binaan?.nib}</div>
                          <div className="font-mono text-xs text-gray-500">{halal.ikm_binaan?.nik}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{halal.ikm_binaan?.nama_lengkap}</div>
                          <div className="text-gray-500">{halal.ikm_binaan?.nama_usaha}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{halal.nomor_sertifikat}</td>
                      <td className="px-4 py-3 text-sm">{halal.tahun_fasilitasi}</td>
                      <td className="px-4 py-3 text-sm">
                        {halal.link_sertifikat ? (
                          <a
                            href={halal.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span>Lihat</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {halal.logo_halal ? (
                          <a
                            href={halal.logo_halal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span>Lihat</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(halal)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(halal.id)}
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Sertifikat Halal' : 'Tambah Sertifikat Halal'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pencarian IKM Binaan */}
                {!editingId && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Langkah 1: Pilih IKM Binaan</h3>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={ikmSearchTerm}
                          onChange={(e) => setIkmSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Cari berdasarkan NIB, NIK, atau Nama Lengkap"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowIkmSearch(!showIkmSearch)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {showIkmSearch ? 'Tutup' : 'Cari'}
                      </button>
                    </div>

                    {/* Hasil pencarian IKM */}
                    {showIkmSearch && (
                      <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                        {filteredIkmBinaan.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            {ikmSearchTerm ? 'Tidak ada data yang sesuai' : 'Masukkan kata kunci pencarian'}
                          </div>
                        ) : (
                          filteredIkmBinaan.map((ikm) => (
                            <div
                              key={ikm.id}
                              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleUseIkmData(ikm)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{ikm.nama_lengkap}</div>
                                  <div className="text-sm text-gray-600">{ikm.nama_usaha}</div>
                                  <div className="text-xs text-gray-500">NIB: {ikm.nib} | NIK: {ikm.nik}</div>
                                </div>
                                <button
                                  type="button"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Pilih
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Data IKM yang dipilih */}
                    {selectedIkm && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-green-800">{selectedIkm.nama_lengkap}</div>
                            <div className="text-sm text-green-600">{selectedIkm.nama_usaha}</div>
                            <div className="text-xs text-green-500">NIB: {selectedIkm.nib}</div>
                          </div>
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Form Data Sertifikat Halal */}
                {(selectedIkm || editingId) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      {editingId ? 'Edit Data Sertifikat Halal' : 'Langkah 2: Lengkapi Data Sertifikat Halal'}
                    </h3>

                    {/* Data IKM (Read-only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIB</label>
                        <input
                          type="text"
                          value={formData.nib}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                        <input
                          type="text"
                          value={formData.nik}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          value={formData.nama_lengkap}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Usaha</label>
                        <input
                          type="text"
                          value={formData.nama_usaha}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Data Tambahan Sertifikat Halal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Sertifikat Halal *
                        </label>
                        <input
                          type="text"
                          value={formData.nomor_sertifikat}
                          onChange={(e) => setFormData({...formData, nomor_sertifikat: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Contoh: HALAL-2024-001"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="2020"
                          max="2030"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Sertifikat Halal *
                      </label>
                      <input
                        type="url"
                        value={formData.link_sertifikat}
                        onChange={(e) => setFormData({...formData, link_sertifikat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://drive.google.com/file/d/..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Link ke file sertifikat halal di Google Drive</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Logo Halal (Opsional)
                      </label>
                      <input
                        type="url"
                        value={formData.logo_halal}
                        onChange={(e) => setFormData({...formData, logo_halal: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Link ke file logo halal di Google Drive (jika ada)</p>
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
                  <button
                    type="submit"
                    disabled={!selectedIkm && !editingId}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Perbarui Data' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
    </AdminRoute>
  )
}