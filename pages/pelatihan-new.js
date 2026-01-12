import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { PlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon, PencilIcon, TrashIcon, EyeIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function PelatihanNewPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('jenis')
  const [loading, setLoading] = useState(true)
  const [jenisPelatihanList, setJenisPelatihanList] = useState([])
  const [pesertaList, setPesertaList] = useState([])
  const [showJenisForm, setShowJenisForm] = useState(false)
  const [showPesertaForm, setShowPesertaForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
      
      // Load Jenis Pelatihan
      const jenisResponse = await fetch('/api/jenis-pelatihan')
      const jenisResult = await jenisResponse.json()
      
      if (jenisResult.success) {
        setJenisPelatihanList(jenisResult.data)
      }
      
      // Load Peserta Pelatihan
      const pesertaResponse = await fetch('/api/pelatihan')
      const pesertaResult = await pesertaResponse.json()
      
      if (pesertaResult.success) {
        setPesertaList(pesertaResult.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter data berdasarkan search term
  const filteredJenisPelatihan = jenisPelatihanList.filter(jenis =>
    jenis.jenis_pelatihan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jenis.sub_kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPeserta = pesertaList.filter(peserta =>
    (peserta.ikm_binaan?.nama_lengkap || peserta.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (peserta.ikm_binaan?.nama_usaha || peserta.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (peserta.jenis_pelatihan?.jenis_pelatihan || peserta.nama_pelatihan || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
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
            <h1 className="text-3xl font-bold text-blue-900">🚀 FITUR BARU - Pelatihan Pemberdayaan Industri</h1>
            <p className="text-blue-600 font-medium">✨ Kelola jenis pelatihan dan peserta pelatihan dengan fitur tab navigation baru!</p>
          </div>

          {/* Tab Navigation - NEW FEATURE */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('jenis')}
                  className={`py-3 px-4 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === 'jenis'
                      ? 'border-blue-500 text-blue-600 bg-white rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📚 Jenis Pelatihan
                </button>
                <button
                  onClick={() => setActiveTab('peserta')}
                  className={`py-3 px-4 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === 'peserta'
                      ? 'border-blue-500 text-blue-600 bg-white rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  👥 Peserta Pelatihan
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content - Jenis Pelatihan */}
          {activeTab === 'jenis' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowJenisForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="font-semibold">✨ Tambah Jenis Pelatihan</span>
                  </button>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-2 border-gray-300 rounded-lg px-4 py-3 pl-12 w-80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="🔍 Cari jenis pelatihan..."
                    />
                    <MagnifyingGlassIcon className="h-6 w-6 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">📋 Daftar Jenis Pelatihan</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jenis Pelatihan</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sub Kegiatan</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tahun</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jumlah Peserta</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJenisPelatihan.map((jenis, index) => {
                      const jumlahPeserta = jenis.jumlah_peserta || 0
                      
                      return (
                        <tr key={jenis.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">{jenis.jenis_pelatihan}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{jenis.sub_kegiatan}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{jenis.tahun_pelaksanaan}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <button className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-xs font-bold hover:from-blue-200 hover:to-blue-300 cursor-pointer transition-all shadow-sm">
                              👥 {jumlahPeserta} peserta
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                              jenis.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {jenis.status === 'Aktif' ? '✅' : '⏸️'} {jenis.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                title="Lihat Detail Lengkap"
                              >
                                <InformationCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50 transition-colors"
                                title="Lihat Peserta"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                className="text-yellow-600 hover:text-yellow-800 p-2 rounded-md hover:bg-yellow-50 transition-colors"
                                title="Edit Jenis Pelatihan"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                                title="Hapus Jenis Pelatihan"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content - Peserta Pelatihan */}
          {activeTab === 'peserta' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <button
                  onClick={() => setShowPesertaForm(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="font-semibold">👥 Tambah Peserta Pelatihan</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">👥 Daftar Peserta Pelatihan</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">NIB/NIK</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nama & Usaha</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jenis Pelatihan</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sertifikat</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPeserta.map((peserta, index) => (
                      <tr key={peserta.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{peserta.ikm_binaan?.nib || peserta.nib}</div>
                            <div className="font-mono text-xs text-gray-500 mt-1">{peserta.ikm_binaan?.nik || peserta.nik}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-bold text-blue-900">{peserta.ikm_binaan?.nama_lengkap || peserta.nama_lengkap}</div>
                            <div className="text-gray-600">{peserta.ikm_binaan?.nama_usaha || peserta.nama_usaha}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                          {peserta.jenis_pelatihan?.jenis_pelatihan || peserta.nama_pelatihan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {peserta.sertifikat ? (
                            <a
                              href={peserta.sertifikat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded font-medium"
                            >
                              📄 Lihat
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">❌ Belum ada</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Forms */}
          {showJenisForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Tambah Jenis Pelatihan</h2>
                <p className="text-gray-600 mb-4">Form lengkap akan ditambahkan di sini</p>
                <button
                  onClick={() => setShowJenisForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {showPesertaForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Tambah Peserta Pelatihan</h2>
                <p className="text-gray-600 mb-4">Form lengkap akan ditambahkan di sini</p>
                <button
                  onClick={() => setShowPesertaForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AdminRoute>
  )
}