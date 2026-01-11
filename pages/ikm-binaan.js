import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { exportIKMBinaanPDF } from '../lib/pdfExport'

export default function IKMBinaanPage() {
  const router = useRouter()
  const [ikmList, setIkmList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nib: '',
    nik: '',
    nama_lengkap: '',
    alamat_lengkap: '',
    nama_usaha: '',
    nomor_hp: ''
  })
  const [duplicateWarnings, setDuplicateWarnings] = useState({
    nib: false,
    nik: false
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    // Load data from Supabase API
    loadIkmData()
  }, [router])

  const loadIkmData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ikm-binaan')
      const result = await response.json()
      
      if (result.success) {
        setIkmList(result.data)
      } else {
        console.error('Error loading IKM data:', result.error)
      }
    } catch (error) {
      console.error('Error loading IKM data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check for duplicates
  const checkDuplicates = (nib, nik, excludeId = null) => {
    const nibExists = ikmList.some(item => item.id !== excludeId && item.nib === nib)
    const nikExists = ikmList.some(item => item.id !== excludeId && item.nik === nik)
    
    setDuplicateWarnings({
      nib: nibExists,
      nik: nikExists
    })
    
    return { nibExists, nikExists }
  }

  // Handle form input changes with duplicate checking
  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value})
    
    if (field === 'nib' || field === 'nik') {
      const checkData = { ...formData, [field]: value }
      checkDuplicates(checkData.nib, checkData.nik, editingId)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId 
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch('/api/ikm-binaan', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        // Reload data
        await loadIkmData()
        resetForm()
        alert(result.message || 'Data IKM Binaan berhasil disimpan!')
      } else {
        alert(result.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving IKM Binaan:', error)
      alert('Gagal menyimpan data')
    }
  }

  const handleEdit = (ikm) => {
    setFormData({
      nib: ikm.nib,
      nik: ikm.nik,
      nama_lengkap: ikm.nama_lengkap,
      alamat_lengkap: ikm.alamat_lengkap,
      nama_usaha: ikm.nama_usaha,
      nomor_hp: ikm.nomor_hp
    })
    setEditingId(ikm.id)
    setShowForm(true)
    // Check duplicates for editing
    checkDuplicates(ikm.nib, ikm.nik, ikm.id)
  }

  const handleDelete = async (id) => {
    const itemToDelete = ikmList.find(item => item.id === id)
    if (!itemToDelete) {
      alert('Data tidak ditemukan!')
      return
    }

    if (confirm(`Yakin ingin menghapus data "${itemToDelete.nama_lengkap}" (${itemToDelete.nama_usaha})? Data akan dipindahkan ke Recycle Bin.`)) {
      try {
        const response = await fetch('/api/ikm-binaan', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()

        if (result.success) {
          await loadIkmData() // Reload data
          alert(result.message || 'Data berhasil dihapus')
        } else {
          alert(result.error || 'Gagal menghapus data')
        }
      } catch (error) {
        console.error('Error deleting IKM Binaan:', error)
        alert('Gagal menghapus data')
      }
    }
  }

  const handleExportPDF = async () => {
    if (filteredIKM.length === 0) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    try {
      await exportIKMBinaanPDF(filteredIKM)
      console.log('PDF IKM Binaan berhasil diekspor')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Gagal mengekspor PDF. Silakan coba lagi.')
    }
  }

  const resetForm = () => {
    setFormData({
      nib: '',
      nik: '',
      nama_lengkap: '',
      alamat_lengkap: '',
      nama_usaha: '',
      nomor_hp: ''
    })
    setDuplicateWarnings({
      nib: false,
      nik: false
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredIKM = ikmList.filter(ikm => 
    (ikm.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ikm.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ikm.nib || '').includes(searchTerm) ||
    (ikm.nik || '').includes(searchTerm)
  )

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">IKM Binaan</h1>
          <p className="text-gray-600">Kelola data IKM Binaan DisnakerKUKM Kota Madiun</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tambah IKM Binaan</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-64"
                  placeholder="Cari NIB, NIK, nama, atau usaha..."
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit IKM Binaan' : 'Tambah IKM Binaan'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {(duplicateWarnings.nib || duplicateWarnings.nik) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Peringatan Duplikasi Data
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            {duplicateWarnings.nib && duplicateWarnings.nik 
                              ? 'NIB dan NIK sudah terdaftar dalam database. '
                              : duplicateWarnings.nib 
                              ? 'NIB sudah terdaftar dalam database. '
                              : 'NIK sudah terdaftar dalam database. '
                            }
                            Data tetap dapat disimpan, namun akan ditandai sebagai duplikat.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. NIB (13 Digit) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.nib}
                        onChange={(e) => handleInputChange('nib', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          duplicateWarnings.nib ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                        }`}
                        maxLength={13}
                        required
                      />
                      {duplicateWarnings.nib && (
                        <div className="absolute right-2 top-2">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" title="NIB sudah ada dalam database" />
                        </div>
                      )}
                    </div>
                    {duplicateWarnings.nib && (
                      <p className="text-xs text-yellow-600 mt-1">⚠️ NIB ini sudah terdaftar dalam database</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. NIK (16 Digit) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          duplicateWarnings.nik ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                        }`}
                        maxLength={16}
                        required
                      />
                      {duplicateWarnings.nik && (
                        <div className="absolute right-2 top-2">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" title="NIK sudah ada dalam database" />
                        </div>
                      )}
                    </div>
                    {duplicateWarnings.nik && (
                      <p className="text-xs text-yellow-600 mt-1">⚠️ NIK ini sudah terdaftar dalam database</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={formData.alamat_lengkap}
                    onChange={(e) => handleInputChange('alamat_lengkap', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Usaha *
                  </label>
                  <input
                    type="text"
                    value={formData.nama_usaha}
                    onChange={(e) => handleInputChange('nama_usaha', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor HP *
                  </label>
                  <input
                    type="tel"
                    value={formData.nomor_hp}
                    onChange={(e) => handleInputChange('nomor_hp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
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
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Simpan Data
                  </button>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Usaha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No HP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Database</th>
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
                ) : filteredIKM.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data IKM Binaan
                    </td>
                  </tr>
                ) : (
                  filteredIKM.map((ikm, index) => (
                    <tr key={ikm.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{ikm.nib}</span>
                          {ikm.has_duplicate_nib && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" title="NIB duplikat" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{ikm.nik}</span>
                          {ikm.has_duplicate_nik && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" title="NIK duplikat" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{ikm.nama_lengkap}</td>
                      <td className="px-4 py-3 text-sm">{ikm.nama_usaha}</td>
                      <td className="px-4 py-3 text-sm">{ikm.nomor_hp}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ikm.database_indicator 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ikm.database_indicator ? '✓ Lengkap' : '✗ Belum Lengkap'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(ikm)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ikm.id)}
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