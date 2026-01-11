import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { PlusIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function PelatihanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('jenis')
  const [jenisPelatihanList, setJenisPelatihanList] = useState([])
  const [pesertaPelatihanList, setPesertaPelatihanList] = useState([])
  const [ikmBinaanList, setIkmBinaanList] = useState([])
  const [showJenisForm, setShowJenisForm] = useState(false)
  const [showPesertaForm, setShowPesertaForm] = useState(false)

  const [jenisFormData, setJenisFormData] = useState({
    jenis_pelatihan: '',
    sub_kegiatan: '',
    waktu_pelaksanaan: '',
    tempat: '',
    tahun_pelaksanaan: new Date().getFullYear(),
    status: 'Aktif'
  })

  const [pesertaFormData, setPesertaFormData] = useState({
    ikm_id: '',
    pelatihan_ids: [],
    sertifikat: ''
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadJenisPelatihan(),
        loadPesertaPelatihan(),
        loadIkmBinaan()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadJenisPelatihan = async () => {
    try {
      const response = await fetch('/api/jenis-pelatihan')
      const result = await response.json()
      
      if (result.success) {
        setJenisPelatihanList(result.data)
      }
    } catch (error) {
      console.error('Error loading jenis pelatihan:', error)
    }
  }

  const loadPesertaPelatihan = async () => {
    try {
      const response = await fetch('/api/pelatihan')
      const result = await response.json()
      
      if (result.success) {
        setPesertaPelatihanList(result.data)
      }
    } catch (error) {
      console.error('Error loading peserta pelatihan:', error)
    }
  }

  const loadIkmBinaan = async () => {
    try {
      const response = await fetch('/api/ikm-binaan')
      const result = await response.json()
      
      if (result.success) {
        setIkmBinaanList(result.data)
      }
    } catch (error) {
      console.error('Error loading IKM Binaan:', error)
    }
  }

  const handleJenisSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/jenis-pelatihan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jenisFormData)
      })

      const result = await response.json()
      
      if (result.success) {
        await loadJenisPelatihan() // Reload untuk mendapatkan jumlah peserta terbaru
        alert('Jenis Pelatihan berhasil ditambahkan!')
        setJenisFormData({
          jenis_pelatihan: '',
          sub_kegiatan: '',
          waktu_pelaksanaan: '',
          tempat: '',
          tahun_pelaksanaan: new Date().getFullYear(),
          status: 'Aktif'
        })
        setShowJenisForm(false)
      } else {
        alert('Gagal menyimpan data: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving jenis pelatihan:', error)
      alert('Gagal menyimpan data jenis pelatihan')
    }
  }

  const handlePesertaSubmit = async (e) => {
    e.preventDefault()
    
    if (!pesertaFormData.ikm_id) {
      alert('Pilih IKM Binaan terlebih dahulu')
      return
    }
    
    if (pesertaFormData.pelatihan_ids.length === 0) {
      alert('Pilih minimal satu jenis pelatihan')
      return
    }

    try {
      const promises = pesertaFormData.pelatihan_ids.map(async (jenisId) => {
        const jenisData = jenisPelatihanList.find(j => j.id === jenisId)
        
        const pelatihanData = {
          ikm_id: pesertaFormData.ikm_id,
          jenis_pelatihan_id: jenisId,
          nama_pelatihan: jenisData.jenis_pelatihan,
          tanggal_pelatihan: new Date().toISOString().split('T')[0],
          sertifikat: pesertaFormData.sertifikat || null
        }

        const response = await fetch('/api/pelatihan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pelatihanData)
        })

        return response.json()
      })

      const results = await Promise.all(promises)
      const successCount = results.filter(r => r.success).length
      
      if (successCount > 0) {
        await Promise.all([
          loadPesertaPelatihan(),
          loadJenisPelatihan() // Reload untuk update jumlah peserta
        ])
        alert(`${successCount} peserta berhasil ditambahkan!`)
        resetPesertaForm()
      } else {
        alert('Gagal menambahkan peserta')
      }
    } catch (error) {
      console.error('Error saving peserta:', error)
      alert('Gagal menyimpan data peserta')
    }
  }

  const resetPesertaForm = () => {
    setPesertaFormData({
      ikm_id: '',
      pelatihan_ids: [],
      sertifikat: ''
    })
    setShowPesertaForm(false)
  }

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data pelatihan...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Pelatihan Pemberdayaan Industri</h1>
            <p className="text-gray-600 mt-2">Kelola jenis pelatihan dan peserta pelatihan untuk IKM Binaan</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('jenis')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'jenis'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <AcademicCapIcon className="h-5 w-5 inline mr-2" />
                  Jenis Pelatihan
                </button>
                <button
                  onClick={() => setActiveTab('peserta')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'peserta'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserGroupIcon className="h-5 w-5 inline mr-2" />
                  Peserta Pelatihan
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content - Jenis Pelatihan */}
          {activeTab === 'jenis' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <button
                  onClick={() => setShowJenisForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Tambah Jenis Pelatihan</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pelatihan</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Kegiatan</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Peserta</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jenisPelatihanList.map((jenis, index) => (
                        <tr key={jenis.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{jenis.jenis_pelatihan}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{jenis.sub_kegiatan}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jenis.tahun_pelaksanaan}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="font-semibold text-blue-600">{jenis.jumlah_peserta || 0} peserta</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              jenis.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {jenis.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Peserta Pelatihan */}
          {activeTab === 'peserta' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <button
                  onClick={() => setShowPesertaForm(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Tambah Peserta Pelatihan</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIB/NIK</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama & Usaha</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pelatihan</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pesertaPelatihanList.map((peserta, index) => (
                        <tr key={peserta.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{peserta.ikm_binaan?.nib || 'N/A'}</div>
                              <div className="text-gray-500">{peserta.ikm_binaan?.nik || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{peserta.ikm_binaan?.nama_lengkap || 'N/A'}</div>
                              <div className="text-gray-500">{peserta.ikm_binaan?.nama_usaha || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {peserta.jenis_pelatihan?.jenis_pelatihan || peserta.nama_pelatihan || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {peserta.tanggal_pelatihan ? new Date(peserta.tanggal_pelatihan).toLocaleDateString('id-ID') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {peserta.sertifikat ? (
                              <a 
                                href={peserta.sertifikat} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Lihat Sertifikat
                              </a>
                            ) : (
                              <span className="text-gray-400">Belum ada</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Modal Form Jenis Pelatihan */}
          {showJenisForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Jenis Pelatihan</h2>
                
                <form onSubmit={handleJenisSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pelatihan *</label>
                    <input
                      type="text"
                      value={jenisFormData.jenis_pelatihan}
                      onChange={(e) => setJenisFormData({...jenisFormData, jenis_pelatihan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Kegiatan *</label>
                    <input
                      type="text"
                      value={jenisFormData.sub_kegiatan}
                      onChange={(e) => setJenisFormData({...jenisFormData, sub_kegiatan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pelaksanaan *</label>
                    <input
                      type="text"
                      value={jenisFormData.waktu_pelaksanaan}
                      onChange={(e) => setJenisFormData({...jenisFormData, waktu_pelaksanaan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 3 hari (08:00 - 16:00)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tempat *</label>
                    <input
                      type="text"
                      value={jenisFormData.tempat}
                      onChange={(e) => setJenisFormData({...jenisFormData, tempat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Pelaksanaan *</label>
                    <input
                      type="number"
                      value={jenisFormData.tahun_pelaksanaan}
                      onChange={(e) => setJenisFormData({...jenisFormData, tahun_pelaksanaan: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="2020"
                      max="2040"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowJenisForm(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Simpan Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Form Peserta Pelatihan */}
          {showPesertaForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Peserta Pelatihan</h2>
                
                <form onSubmit={handlePesertaSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih IKM Binaan *</label>
                    <select
                      value={pesertaFormData.ikm_id}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, ikm_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Pilih IKM Binaan</option>
                      {ikmBinaanList.map((ikm) => (
                        <option key={ikm.id} value={ikm.id}>
                          {ikm.nib} - {ikm.nama_lengkap} ({ikm.nama_usaha})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Pelatihan *</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {jenisPelatihanList.map((jenis) => (
                        <label key={jenis.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={pesertaFormData.pelatihan_ids.includes(jenis.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPesertaFormData(prev => ({
                                  ...prev,
                                  pelatihan_ids: [...prev.pelatihan_ids, jenis.id]
                                }))
                              } else {
                                setPesertaFormData(prev => ({
                                  ...prev,
                                  pelatihan_ids: prev.pelatihan_ids.filter(id => id !== jenis.id)
                                }))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">
                            {jenis.jenis_pelatihan} - {jenis.sub_kegiatan} ({jenis.tahun_pelaksanaan})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Sertifikat (Opsional)</label>
                    <input
                      type="url"
                      value={pesertaFormData.sertifikat}
                      onChange={(e) => setPesertaFormData({...pesertaFormData, sertifikat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetPesertaForm}
                      className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Simpan Data
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