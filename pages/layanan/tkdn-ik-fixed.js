import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import AdminRoute from '../../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function TKDNIKPage() {
  const router = useRouter()
  const [tkdnList, setTkdnList] = useState([])
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
    ikm_id: '',
    nib: '',
    nik: '',
    nama_lengkap: '',
    alamat_lengkap: '',
    nama_usaha: '',
    nomor_hp: '',
    nomor_sertifikat: '',
    persentase_tkdn: '',
    status_sertifikat: 'Proses',
    tahun_terbit: new Date().getFullYear(),
    link_sertifikat: ''
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    loadAllData()
  }, [router])

  const loadAllData = async () => {
    await Promise.all([
      fetchTkdnData(),
      fetchIkmBinaanData()
    ])
  }

  const fetchTkdnData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tkdn-ik')
      const result = await response.json()
      
      if (result.success && result.data) {
        setTkdnList(result.data)
        console.log(`✅ TKDN-IK loaded: ${result.data.length} records (${result.source || 'unknown'} source)`)
      } else {
        console.error('Error loading TKDN data:', result.error)
        setTkdnList([])
      }
    } catch (error) {
      console.error('Error loading TKDN data:', error)
      setTkdnList([])
    } finally {
      setLoading(false)
    }
  }

  const fetchIkmBinaanData = async () => {
    try {
      const response = await fetch('/api/ikm-binaan')
      const result = await response.json()
      
      if (result.success && result.data) {
        setIkmBinaanList(result.data)
        console.log(`✅ IKM Binaan loaded: ${result.data.length} records for TKDN selection`)
      } else {
        console.error('Error loading IKM Binaan data:', result.error)
        setIkmBinaanList([])
      }
    } catch (error) {
      console.error('Error loading IKM Binaan data:', error)
      setIkmBinaanList([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedIkm) {
      alert('Pilih IKM Binaan terlebih dahulu')
      return
    }

    try {
      const submitData = {
        ikm_id: selectedIkm.id,
        nomor_sertifikat: formData.nomor_sertifikat,
        persentase_tkdn: parseFloat(formData.persentase_tkdn) || 0,
        status_sertifikat: formData.status_sertifikat,
        link_sertifikat: formData.link_sertifikat,
        tahun_terbit: parseInt(formData.tahun_terbit)
      }

      const method = editingId ? 'PUT' : 'POST'
      if (editingId) {
        submitData.id = editingId
      }

      const response = await fetch('/api/tkdn-ik', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchTkdnData()
        resetForm()
        alert(editingId ? 'Data TKDN-IK berhasil diperbarui!' : 'Data TKDN-IK berhasil disimpan!')
      } else {
        alert('Gagal menyimpan data: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving TKDN data:', error)
      alert('Gagal menyimpan data')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setSelectedIkm(item.ikm_binaan)
    setFormData({
      ikm_id: item.ikm_id,
      nib: item.ikm_binaan?.nib || '',
      nik: item.ikm_binaan?.nik || '',
      nama_lengkap: item.ikm_binaan?.nama_lengkap || '',
      alamat_lengkap: item.ikm_binaan?.alamat_lengkap || '',
      nama_usaha: item.ikm_binaan?.nama_usaha || '',
      nomor_hp: item.ikm_binaan?.nomor_hp || '',
      nomor_sertifikat: item.nomor_sertifikat,
      persentase_tkdn: item.persentase_tkdn,
      status_sertifikat: item.status_sertifikat,
      tahun_terbit: item.tahun_terbit,
      link_sertifikat: item.link_sertifikat || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch('/api/tkdn-ik', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()
        
        if (result.success) {
          await fetchTkdnData()
          alert('Data berhasil dihapus!')
        } else {
          alert('Gagal menghapus data: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting TKDN data:', error)
        alert('Gagal menghapus data')
      }
    }
  }

  const selectIkm = (ikm) => {
    setSelectedIkm(ikm)
    setFormData({
      ...formData,
      ikm_id: ikm.id,
      nib: ikm.nib,
      nik: ikm.nik,
      nama_lengkap: ikm.nama_lengkap,
      alamat_lengkap: ikm.alamat_lengkap,
      nama_usaha: ikm.nama_usaha,
      nomor_hp: ikm.nomor_hp
    })
    setShowIkmSearch(false)
    setIkmSearchTerm('')
  }

  const resetForm = () => {
    setFormData({
      ikm_id: '',
      nib: '',
      nik: '',
      nama_lengkap: '',
      alamat_lengkap: '',
      nama_usaha: '',
      nomor_hp: '',
      nomor_sertifikat: '',
      persentase_tkdn: '',
      status_sertifikat: 'Proses',
      tahun_terbit: new Date().getFullYear(),
      link_sertifikat: ''
    })
    setSelectedIkm(null)
    setEditingId(null)
    setShowForm(false)
    setShowIkmSearch(false)
    setIkmSearchTerm('')
  }

  // Filter data berdasarkan search term
  const filteredTkdnList = tkdnList.filter(item =>
    (item.ikm_binaan?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.ikm_binaan?.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.nomor_sertifikat || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter IKM Binaan untuk pencarian
  const filteredIkmList = ikmBinaanList.filter(ikm =>
    ikm.nama_lengkap.toLowerCase().includes(ikmSearchTerm.toLowerCase()) ||
    ikm.nama_usaha.toLowerCase().includes(ikmSearchTerm.toLowerCase()) ||
    ikm.nib.includes(ikmSearchTerm) ||
    ikm.nik.includes(ikmSearchTerm)
  )

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data TKDN-IK...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">TKDN-IK</h1>
            <p className="text-gray-600">Kelola data Tingkat Komponen Dalam Negeri - Industri Kecil</p>
          </div>

          {/* Header Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Tambah Data TKDN-IK</span>
              </button>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-64"
                  placeholder="Cari data TKDN-IK..."
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IKM Binaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor Sertifikat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persentase TKDN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTkdnList.length > 0 ? (
                  filteredTkdnList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{item.ikm_binaan?.nama_lengkap || 'N/A'}</div>
                          <div className="text-gray-500">{item.ikm_binaan?.nama_usaha || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nomor_sertifikat}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-blue-600">{item.persentase_tkdn}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status_sertifikat === 'Aktif' ? 'bg-green-100 text-green-800' :
                          item.status_sertifikat === 'Proses' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status_sertifikat}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tahun_terbit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {item.link_sertifikat && (
                            <a
                              href={item.link_sertifikat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Lihat Sertifikat"
                            >
                              <LinkIcon className="h-5 w-5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data TKDN-IK'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingId ? 'Edit Data TKDN-IK' : 'Tambah Data TKDN-IK'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* IKM Binaan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IKM Binaan *
                    </label>
                    {selectedIkm ? (
                      <div className="bg-gray-50 p-3 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{selectedIkm.nama_lengkap}</div>
                            <div className="text-sm text-gray-500">{selectedIkm.nama_usaha}</div>
                            <div className="text-xs text-gray-400">NIB: {selectedIkm.nib}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedIkm(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowIkmSearch(true)}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400"
                      >
                        Klik untuk pilih IKM Binaan
                      </button>
                    )}
                  </div>

                  {/* TKDN Data */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Sertifikat *
                      </label>
                      <input
                        type="text"
                        value={formData.nomor_sertifikat}
                        onChange={(e) => setFormData({...formData, nomor_sertifikat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Persentase TKDN (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.persentase_tkdn}
                        onChange={(e) => setFormData({...formData, persentase_tkdn: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status Sertifikat *
                      </label>
                      <select
                        value={formData.status_sertifikat}
                        onChange={(e) => setFormData({...formData, status_sertifikat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Proses">Proses</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Ditolak">Ditolak</option>
                        <option value="Kadaluarsa">Kadaluarsa</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tahun Terbit *
                      </label>
                      <input
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.tahun_terbit}
                        onChange={(e) => setFormData({...formData, tahun_terbit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Sertifikat
                    </label>
                    <input
                      type="url"
                      value={formData.link_sertifikat}
                      onChange={(e) => setFormData({...formData, link_sertifikat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* IKM Search Modal */}
          {showIkmSearch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pilih IKM Binaan</h2>
                
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={ikmSearchTerm}
                      onChange={(e) => setIkmSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                      placeholder="Cari berdasarkan nama, usaha, NIB, atau NIK..."
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIB</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Usaha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredIkmList.map((ikm) => (
                        <tr key={ikm.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ikm.nib}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ikm.nama_lengkap}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ikm.nama_usaha}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => selectIkm(ikm)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Pilih
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowIkmSearch(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AdminRoute>
  )
}