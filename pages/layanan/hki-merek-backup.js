import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import AdminRoute from '../../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function HKIMerekPage() {
  const router = useRouter()
  const [hkiList, setHkiList] = useState([])
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
    // Data tambahan HKI Merek
    nomor_pendaftaran: '',
    link_bukti_daftar: '',
    status_sertifikat: 'Proses',
    tahun_fasilitasi: new Date().getFullYear(),
    link_sertifikat: ''
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
      
      // Load HKI Merek data
      const hkiResponse = await fetch('/api/hki-merek')
      const hkiResult = await hkiResponse.json()
      
      if (hkiResult.success) {
        setHkiList(hkiResult.data)
      } else {
        console.error('Error loading HKI data:', hkiResult.error)
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
            nomor_pendaftaran: formData.nomor_pendaftaran,
            link_bukti_daftar: formData.link_bukti_daftar,
            status_sertifikat: formData.status_sertifikat,
            tahun_fasilitasi: formData.tahun_fasilitasi,
            link_sertifikat: formData.link_sertifikat
          }
        : {
            ikm_id: selectedIkm?.id,
            nomor_pendaftaran: formData.nomor_pendaftaran,
            link_bukti_daftar: formData.link_bukti_daftar,
            status_sertifikat: formData.status_sertifikat,
            tahun_fasilitasi: formData.tahun_fasilitasi,
            link_sertifikat: formData.link_sertifikat
          }

      const response = await fetch('/api/hki-merek', {
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
        alert(result.message || 'Data HKI Merek berhasil disimpan!')
      } else {
        alert(result.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving HKI Merek:', error)
      alert('Gagal menyimpan data')
    }
  }

  const handleEdit = (hki) => {
    setFormData({
      nib: hki.ikm_binaan?.nib || '',
      nik: hki.ikm_binaan?.nik || '',
      nama_lengkap: hki.ikm_binaan?.nama_lengkap || '',
      alamat_lengkap: hki.ikm_binaan?.alamat_lengkap || '',
      nama_usaha: hki.ikm_binaan?.nama_usaha || '',
      nomor_hp: hki.ikm_binaan?.nomor_hp || '',
      nomor_pendaftaran: hki.nomor_pendaftaran,
      link_bukti_daftar: hki.link_bukti_daftar,
      status_sertifikat: hki.status_sertifikat,
      tahun_fasilitasi: hki.tahun_fasilitasi,
      link_sertifikat: hki.link_sertifikat || '',
      ikm_id: hki.ikm_id
    })
    setEditingId(hki.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const itemToDelete = hkiList.find(item => item.id === id)
    if (!itemToDelete) {
      alert('Data tidak ditemukan!')
      return
    }

    if (confirm(`Yakin ingin menghapus data HKI Merek "${itemToDelete.nomor_pendaftaran}" untuk ${itemToDelete.ikm_binaan?.nama_usaha || 'IKM'}? Data akan dipindahkan ke Recycle Bin.`)) {
      try {
        const response = await fetch('/api/hki-merek', {
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
        console.error('Error deleting HKI Merek:', error)
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
      nomor_pendaftaran: '',
      link_bukti_daftar: '',
      status_sertifikat: 'Proses',
      tahun_fasilitasi: new Date().getFullYear(),
      link_sertifikat: ''
    })
    setSelectedIkm(null)
    setEditingId(null)
    setShowForm(false)
    setShowIkmSearch(false)
    setIkmSearchTerm('')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Telah Didaftar': return 'bg-green-100 text-green-800'
      case 'Proses': return 'bg-yellow-100 text-yellow-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredHki = hkiList.filter(hki => 
    (hki.ikm_binaan?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hki.ikm_binaan?.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hki.nomor_pendaftaran || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran HKI Merek</h1>
          <p className="text-gray-600">Kelola pendaftaran Hak Kekayaan Intelektual Merek untuk IKM Binaan</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tambah HKI Merek</span>
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
                {editingId ? 'Edit HKI Merek' : 'Tambah HKI Merek'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pencarian IKM Binaan */}
                {!editingId && !selectedIkm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-3">
                      Langkah 1: Pilih Data IKM Binaan
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Masukkan NIB (13 digit), NIK (16 digit), atau Nama Lengkap untuk mencari data IKM Binaan
                    </p>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={ikmSearchTerm}
                          onChange={(e) => setIkmSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                          placeholder="Masukkan NIB, NIK, atau Nama Lengkap..."
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowIkmSearch(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

                {/* Form Data HKI Merek */}
                {(selectedIkm || editingId) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      {editingId ? 'Edit Data HKI Merek' : 'Langkah 2: Lengkapi Data HKI Merek'}
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

                    {/* Data Tambahan HKI Merek */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Pendaftaran HKI Merek *
                        </label>
                        <input
                          type="text"
                          value={formData.nomor_pendaftaran}
                          onChange={(e) => setFormData({...formData, nomor_pendaftaran: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="HKI-YYYY-XXX"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="2020"
                          max="2030"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Bukti Daftar HKI *
                      </label>
                      <input
                        type="url"
                        value={formData.link_bukti_daftar}
                        onChange={(e) => setFormData({...formData, link_bukti_daftar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://drive.google.com/..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sertifikat Merek *
                      </label>
                      <select
                        value={formData.status_sertifikat}
                        onChange={(e) => setFormData({...formData, status_sertifikat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Proses">Proses</option>
                        <option value="Telah Didaftar">Telah Didaftar</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Sertifikat HKI Merek
                      </label>
                      <input
                        type="url"
                        value={formData.link_sertifikat}
                        onChange={(e) => setFormData({...formData, link_sertifikat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://drive.google.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Kosongkan jika sertifikat belum tersedia</p>
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
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Pendaftaran</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
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
                ) : filteredHki.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Belum ada data HKI Merek
                    </td>
                  </tr>
                ) : (
                  filteredHki.map((hki, index) => (
                    <tr key={hki.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-xs">
                          <div>NIB: {hki.ikm_binaan?.nib || '-'}</div>
                          <div>NIK: {hki.ikm_binaan?.nik || '-'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{hki.ikm_binaan?.nama_lengkap || '-'}</div>
                          <div className="text-gray-500">{hki.ikm_binaan?.nama_usaha || '-'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{hki.nomor_pendaftaran}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hki.status_sertifikat)}`}>
                          {hki.status_sertifikat}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{hki.tahun_fasilitasi}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <a
                            href={hki.link_bukti_daftar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            title="Bukti Daftar"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span className="text-xs">Bukti</span>
                          </a>
                          {hki.link_sertifikat && (
                            <a
                              href={hki.link_sertifikat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                              title="Sertifikat"
                            >
                              <LinkIcon className="h-4 w-4" />
                              <span className="text-xs">Sertifikat</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(hki)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(hki.id)}
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