import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import AdminRoute from '../components/AdminRoute'
import { TrashIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function RecycleBinPage() {
  const router = useRouter()
  const [deletedItems, setDeletedItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    loadDeletedItems()
  }, [router])

  const loadDeletedItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recycle-bin')
      const result = await response.json()
      
      if (result.success) {
        setDeletedItems(result.data)
      } else {
        console.error('Error loading deleted items:', result.error)
        setDeletedItems([])
      }
    } catch (error) {
      console.error('Error loading deleted items:', error)
      setDeletedItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (recycleBinId, tableName) => {
    if (confirm('Yakin ingin mengembalikan data ini ke tempat semula?')) {
      try {
        const response = await fetch('/api/recycle-bin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'restore',
            id: recycleBinId,
            table: tableName
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          loadDeletedItems() // Refresh the list
          alert('Data berhasil dikembalikan!')
        } else {
          alert('Gagal mengembalikan data: ' + result.error)
        }
      } catch (error) {
        console.error('Error restoring item:', error)
        alert('Gagal mengembalikan data. Silakan coba lagi.')
      }
    }
  }

  const handlePermanentDelete = async (recycleBinId, tableName) => {
    const item = deletedItems.find(item => item.id === recycleBinId)
    const itemName = item?.nama_lengkap || item?.nama_usaha || item?.jenis_pelatihan || 'Item'
    
    if (confirm(`PERINGATAN: Data "${itemName}" akan dihapus secara permanen dan tidak dapat dikembalikan. Yakin ingin melanjutkan?`)) {
      try {
        const response = await fetch('/api/recycle-bin', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: recycleBinId,
            table: tableName
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          loadDeletedItems() // Refresh the list
          alert('Data berhasil dihapus secara permanen!')
        } else {
          alert('Gagal menghapus data: ' + result.error)
        }
      } catch (error) {
        console.error('Error permanently deleting item:', error)
        alert('Gagal menghapus data. Silakan coba lagi.')
      }
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      'IKM Binaan': 'bg-blue-100 text-blue-800',
      'HKI Merek': 'bg-purple-100 text-purple-800',
      'Sertifikat Halal': 'bg-green-100 text-green-800',
      'TKDN IK': 'bg-orange-100 text-orange-800',
      'SIINas': 'bg-indigo-100 text-indigo-800',
      'Uji Nilai Gizi': 'bg-pink-100 text-pink-800',
      'Kurasi Produk': 'bg-yellow-100 text-yellow-800',
      'Pelatihan': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getItemName = (item) => {
    return item.nama_lengkap || item.nama_usaha || item.nama_pelatihan || item.nomor_pendaftaran || item.nomor_sertifikat || 'Unknown Item'
  }

  const getItemDescription = (item) => {
    if (item.originalType === 'IKM Binaan') {
      return `${item.nama_lengkap} - NIB: ${item.nib}`
    } else if (item.originalType === 'HKI Merek') {
      return `${item.nama_usaha} - Nomor: ${item.nomor_pendaftaran}`
    } else if (item.originalType === 'Pelatihan') {
      return `${item.nama_pelatihan} - ${item.sub_kegiatan}`
    }
    return item.nama_usaha || item.deskripsi || 'No description'
  }

  return (
    <AdminRoute>
      <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
          <p className="text-gray-600">Kelola data yang telah dihapus - kembalikan atau hapus secara permanen</p>
        </div>

        {/* Deleted Items List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : deletedItems.length === 0 ? (
            <div className="p-8 text-center">
              <TrashIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recycle Bin Kosong</h3>
              <p className="text-gray-600">Tidak ada data yang dihapus</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dihapus Pada</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deletedItems.map((item) => (
                    <tr key={item.recycleBinId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.originalType)}`}>
                          {item.originalType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{getItemName(item)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{getItemDescription(item)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.deletedAt)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRestore(item.recycleBinId, item.originalTable)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Kembalikan"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item.recycleBinId, item.originalTable)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Hapus Permanen"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TrashIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Informasi Recycle Bin</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Data yang dihapus akan tersimpan di Recycle Bin selama 30 hari</li>
                  <li>Anda dapat mengembalikan data atau menghapusnya secara permanen</li>
                  <li>Data yang dihapus permanen tidak dapat dikembalikan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </AdminRoute>
  )
}