// Script untuk memperbaiki semua halaman layanan agar menggunakan API yang sudah diperbaiki
const fs = require('fs')

console.log('🔧 FIXING ALL LAYANAN PAGES TO USE IMPROVED APIs\n')

// Template untuk halaman layanan yang robust
const createLayananPageTemplate = (pageName, apiEndpoint, displayName, fields) => {
  return `import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import AdminRoute from '../../components/AdminRoute'
import { PlusIcon, PencilIcon, TrashIcon, LinkIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ${pageName}Page() {
  const router = useRouter()
  const [dataList, setDataList] = useState([])
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
    ${fields.map(field => `${field.name}: '${field.defaultValue || ''}',`).join('\n    ')}
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
      fetchData(),
      fetchIkmBinaanData()
    ])
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('${apiEndpoint}')
      const result = await response.json()
      
      if (result.success && result.data) {
        setDataList(result.data)
        console.log(\`✅ ${displayName} loaded: \${result.data.length} records (\${result.source || 'unknown'} source)\`)
      } else {
        console.error('Error loading ${displayName} data:', result.error)
        setDataList([])
      }
    } catch (error) {
      console.error('Error loading ${displayName} data:', error)
      setDataList([])
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
        console.log(\`✅ IKM Binaan loaded: \${result.data.length} records for ${displayName} selection\`)
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
        ${fields.map(field => `${field.name}: formData.${field.name},`).join('\n        ')}
      }

      const method = editingId ? 'PUT' : 'POST'
      if (editingId) {
        submitData.id = editingId
      }

      const response = await fetch('${apiEndpoint}', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchData()
        resetForm()
        alert(editingId ? '${displayName} berhasil diperbarui!' : '${displayName} berhasil disimpan!')
      } else {
        alert('Gagal menyimpan data: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving ${displayName} data:', error)
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
      ${fields.map(field => `${field.name}: item.${field.name} || '${field.defaultValue || ''}',`).join('\n      ')}
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch('${apiEndpoint}', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()
        
        if (result.success) {
          await fetchData()
          alert('Data berhasil dihapus!')
        } else {
          alert('Gagal menghapus data: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting ${displayName} data:', error)
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
      ${fields.map(field => `${field.name}: '${field.defaultValue || ''}',`).join('\n      ')}
    })
    setSelectedIkm(null)
    setEditingId(null)
    setShowForm(false)
    setShowIkmSearch(false)
    setIkmSearchTerm('')
  }

  // Filter data berdasarkan search term
  const filteredDataList = dataList.filter(item =>
    (item.ikm_binaan?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.ikm_binaan?.nama_usaha || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    ${fields.filter(f => f.searchable).map(field => 
      `(item.${field.name} || '').toLowerCase().includes(searchTerm.toLowerCase())`
    ).join(' ||\n    ')}
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
              <p className="mt-4 text-gray-600">Memuat data ${displayName}...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">${displayName}</h1>
            <p className="text-gray-600">Kelola data ${displayName} untuk IKM Binaan</p>
          </div>

          {/* Header Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Tambah ${displayName}</span>
              </button>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-64"
                  placeholder="Cari data ${displayName}..."
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
                  ${fields.filter(f => f.showInTable).map(field => 
                    `<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${field.label}</th>`
                  ).join('\n                  ')}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDataList.length > 0 ? (
                  filteredDataList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{item.ikm_binaan?.nama_lengkap || 'N/A'}</div>
                          <div className="text-gray-500">{item.ikm_binaan?.nama_usaha || 'N/A'}</div>
                        </div>
                      </td>
                      ${fields.filter(f => f.showInTable).map(field => {
                        if (field.type === 'link') {
                          return `<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.${field.name} ? (
                              <a href={item.${field.name}} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                Lihat
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>`
                        } else if (field.type === 'date') {
                          return `<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.${field.name} ? new Date(item.${field.name}).toLocaleDateString('id-ID') : '-'}
                          </td>`
                        } else {
                          return `<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.${field.name} || '-'}</td>`
                        }
                      }).join('\n                      ')}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          ${fields.some(f => f.type === 'link') ? `
                          {item.${fields.find(f => f.type === 'link')?.name} && (
                            <a
                              href={item.${fields.find(f => f.type === 'link')?.name}}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Lihat Dokumen"
                            >
                              <LinkIcon className="h-5 w-5" />
                            </a>
                          )}` : ''}
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
                    <td colSpan="${3 + fields.filter(f => f.showInTable).length}" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data ${displayName}'}
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
                  {editingId ? 'Edit ${displayName}' : 'Tambah ${displayName}'}
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

                  {/* Form Fields */}
                  ${fields.map(field => {
                    if (field.type === 'select') {
                      return `<div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ${field.label} ${field.required ? '*' : ''}
                        </label>
                        <select
                          value={formData.${field.name}}
                          onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ${field.required ? 'required' : ''}
                        >
                          ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('\n                          ')}
                        </select>
                      </div>`
                    } else if (field.type === 'number') {
                      return `<div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ${field.label} ${field.required ? '*' : ''}
                        </label>
                        <input
                          type="number"
                          ${field.min ? `min="${field.min}"` : ''}
                          ${field.max ? `max="${field.max}"` : ''}
                          value={formData.${field.name}}
                          onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ${field.required ? 'required' : ''}
                        />
                      </div>`
                    } else if (field.type === 'date') {
                      return `<div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ${field.label} ${field.required ? '*' : ''}
                        </label>
                        <input
                          type="date"
                          value={formData.${field.name}}
                          onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ${field.required ? 'required' : ''}
                        />
                      </div>`
                    } else {
                      return `<div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ${field.label} ${field.required ? '*' : ''}
                        </label>
                        <input
                          type="${field.type || 'text'}"
                          value={formData.${field.name}}
                          onChange={(e) => setFormData({...formData, ${field.name}: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                          ${field.required ? 'required' : ''}
                        />
                      </div>`
                    }
                  }).join('\n\n                  ')}
                  
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
}`
}

// Konfigurasi untuk setiap halaman layanan
const layananConfigs = [
  {
    file: 'pages/layanan/hki-merek.js',
    pageName: 'HKIMerek',
    apiEndpoint: '/api/hki-merek',
    displayName: 'HKI Merek',
    fields: [
      { name: 'nomor_pendaftaran', label: 'Nomor Pendaftaran', type: 'text', required: true, showInTable: true, searchable: true },
      { name: 'link_bukti_daftar', label: 'Link Bukti Daftar', type: 'url', required: true, showInTable: false },
      { name: 'status_sertifikat', label: 'Status Sertifikat', type: 'select', required: true, showInTable: true, 
        options: [
          { value: 'Proses', label: 'Proses' },
          { value: 'Telah Didaftar', label: 'Telah Didaftar' },
          { value: 'Ditolak', label: 'Ditolak' }
        ]
      },
      { name: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', type: 'number', required: true, showInTable: true, min: 2020, max: 2030, defaultValue: new Date().getFullYear() },
      { name: 'link_sertifikat', label: 'Link Sertifikat', type: 'url', showInTable: false }
    ]
  },
  {
    file: 'pages/layanan/sertifikat-halal.js',
    pageName: 'SertifikatHalal',
    apiEndpoint: '/api/sertifikat-halal',
    displayName: 'Sertifikat Halal',
    fields: [
      { name: 'nomor_sertifikat', label: 'Nomor Sertifikat', type: 'text', required: true, showInTable: true, searchable: true },
      { name: 'link_sertifikat', label: 'Link Sertifikat', type: 'url', required: true, showInTable: false },
      { name: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', type: 'number', required: true, showInTable: true, min: 2020, max: 2030, defaultValue: new Date().getFullYear() }
    ]
  },
  {
    file: 'pages/layanan/siinas.js',
    pageName: 'SIINas',
    apiEndpoint: '/api/siinas',
    displayName: 'SIINas',
    fields: [
      { name: 'nomor_bukti_akun', label: 'Nomor Bukti Akun', type: 'text', required: true, showInTable: true, searchable: true },
      { name: 'tahun_registrasi', label: 'Tahun Registrasi', type: 'number', required: true, showInTable: true, min: 2020, max: 2030, defaultValue: new Date().getFullYear() },
      { name: 'link_bukti', label: 'Link Bukti', type: 'url', required: true, showInTable: false }
    ]
  },
  {
    file: 'pages/layanan/uji-nilai-gizi.js',
    pageName: 'UjiNilaiGizi',
    apiEndpoint: '/api/uji-nilai-gizi',
    displayName: 'Uji Nilai Gizi',
    fields: [
      { name: 'nomor_lhu', label: 'Nomor LHU', type: 'text', required: true, showInTable: true, searchable: true },
      { name: 'tanggal_hasil_uji', label: 'Tanggal Hasil Uji', type: 'date', required: true, showInTable: true },
      { name: 'tahun_fasilitasi', label: 'Tahun Fasilitasi', type: 'number', required: true, showInTable: true, min: 2020, max: 2030, defaultValue: new Date().getFullYear() },
      { name: 'link_lhu', label: 'Link LHU', type: 'url', required: true, showInTable: false }
    ]
  },
  {
    file: 'pages/layanan/kurasi-produk.js',
    pageName: 'KurasiProduk',
    apiEndpoint: '/api/kurasi-produk',
    displayName: 'Kurasi Produk',
    fields: [
      { name: 'nomor_sertifikat', label: 'Nomor Sertifikat', type: 'text', required: true, showInTable: true, searchable: true },
      { name: 'link_sertifikat', label: 'Link Sertifikat', type: 'url', required: true, showInTable: false }
    ]
  }
]

// Generate semua halaman layanan
function generateAllLayananPages() {
  layananConfigs.forEach(config => {
    const pageContent = createLayananPageTemplate(
      config.pageName,
      config.apiEndpoint,
      config.displayName,
      config.fields
    )
    
    // Backup file lama jika ada
    if (fs.existsSync(config.file)) {
      fs.copyFileSync(config.file, config.file.replace('.js', '-backup.js'))
    }
    
    // Write file baru
    fs.writeFileSync(config.file, pageContent)
    console.log(`✅ Generated: ${config.file}`)
  })
}

// Run the generation
console.log('🚀 Starting layanan pages generation...\n')

generateAllLayananPages()

console.log('\n✅ ALL LAYANAN PAGES FIXED!')
console.log('\n📋 What was fixed:')
console.log('• All layanan pages now use improved APIs')
console.log('• Robust error handling and fallback data')
console.log('• Consistent UI/UX across all pages')
console.log('• IKM Binaan selection with search')
console.log('• Full CRUD operations')
console.log('• Better loading states and error messages')
console.log('\n🎯 Result: All layanan pages will now show data and work optimally!')