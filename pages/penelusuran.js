import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { MagnifyingGlassIcon, UserIcon, AcademicCapIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'

const dummySearchData = {
  '1234567890123': {
    id: '1',
    nib: '1234567890123',
    nik: '3573012345678901',
    nama_lengkap: 'Budi Santoso',
    alamat_lengkap: 'Jl. Merdeka No. 123, Kelurahan Manguharjo, Kota Madiun',
    nama_usaha: 'CV. Sumber Rejeki',
    nomor_hp: '081234567890',
    database_indicator: true,
    layanan: {
      hki_merek: {
        nomor_pendaftaran: 'HKI-2024-001',
        status_sertifikat: 'Telah Didaftar',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/1234567890/view'
      },
      uji_nilai_gizi: {
        nomor_lhu: 'UNG-2024-001',
        tanggal_hasil_uji: '2024-03-15',
        tahun_fasilitasi: 2024,
        link_lhu: 'https://drive.google.com/file/d/1234567891/view'
      }
    },
    pelatihan: [
      {
        id: '1',
        nama_pelatihan: 'Digital Marketing untuk UMKM',
        sub_kegiatan: 'Pemasaran Online dan Media Sosial',
        tanggal_pelatihan: '2024-01-15',
        tahun_pelaksanaan: 2024,
        status: 'Selesai',
        sertifikat: 'https://drive.google.com/file/d/pelatihan001/view'
      },
      {
        id: '2',
        nama_pelatihan: 'Manajemen Keuangan UMKM',
        sub_kegiatan: 'Pembukuan dan Laporan Keuangan',
        tanggal_pelatihan: '2024-02-20',
        tahun_pelaksanaan: 2024,
        status: 'Selesai',
        sertifikat: 'https://drive.google.com/file/d/pelatihan002/view'
      }
    ]
  },
  '2345678901234': {
    id: '2',
    nib: '2345678901234',
    nik: '3573012345678902',
    nama_lengkap: 'Siti Aminah',
    alamat_lengkap: 'Jl. Pahlawan No. 456, Kelurahan Taman, Kota Madiun',
    nama_usaha: 'UD. Berkah Jaya',
    nomor_hp: '081234567891',
    database_indicator: true,
    layanan: {
      sertifikat_halal: {
        nomor_sertifikat: 'HALAL-2024-001',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/halal001/view'
      },
      kurasi_produk: {
        nomor_sertifikat: 'KP-2024-001',
        link_sertifikat: 'https://drive.google.com/file/d/kurasi001/view'
      }
    },
    pelatihan: [
      {
        id: '3',
        nama_pelatihan: 'Pengembangan Produk',
        sub_kegiatan: 'Inovasi dan Desain Produk',
        tanggal_pelatihan: '2024-03-10',
        tahun_pelaksanaan: 2024,
        status: 'Selesai',
        sertifikat: 'https://drive.google.com/file/d/pelatihan003/view'
      }
    ]
  },
  '3573012345678903': {
    id: '3',
    nib: '3456789012345',
    nik: '3573012345678903',
    nama_lengkap: 'Ahmad Wijaya',
    alamat_lengkap: 'Jl. Sudirman No. 789, Kelurahan Oro-oro Ombo, Kota Madiun',
    nama_usaha: 'PT. Maju Bersama',
    nomor_hp: '081234567892',
    database_indicator: true,
    layanan: {
      tkdn_ik: {
        nomor_sertifikat: 'TKDN-2024-001',
        tahun_terbit: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/tkdn001/view'
      }
    },
    pelatihan: []
  },
  '1909210016219': {
    id: '4',
    nib: '1909210016219',
    nik: '3573012345678905',
    nama_lengkap: 'Rina Sari',
    alamat_lengkap: 'Jl. Ahmad Yani No. 45, Kelurahan Demangan, Kota Madiun',
    nama_usaha: 'CV. Makmur Sejahtera',
    nomor_hp: '081234567894',
    database_indicator: true,
    layanan: {
      hki_merek: {
        nomor_pendaftaran: 'HKI-2024-005',
        status_sertifikat: 'Telah Didaftar',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/hki005/view'
      },
      sertifikat_halal: {
        nomor_sertifikat: 'HALAL-2024-005',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/halal005/view'
      },
      siinas: {
        nomor_bukti_akun: 'SIINAS-2024-005',
        tahun_registrasi: 2024,
        link_bukti: 'https://drive.google.com/file/d/siinas005/view'
      }
    },
    pelatihan: [
      {
        id: '4',
        nama_pelatihan: 'Digital Marketing untuk UMKM',
        sub_kegiatan: 'Pemasaran Online dan Media Sosial',
        tanggal_pelatihan: '2024-01-15',
        tahun_pelaksanaan: 2024,
        status: 'Selesai',
        sertifikat: 'https://drive.google.com/file/d/pelatihan004/view'
      },
      {
        id: '5',
        nama_pelatihan: 'Manajemen Keuangan UMKM',
        sub_kegiatan: 'Pembukuan dan Laporan Keuangan',
        tanggal_pelatihan: '2024-02-20',
        tahun_pelaksanaan: 2024,
        status: 'Selesai',
        sertifikat: 'https://drive.google.com/file/d/pelatihan005/view'
      }
    ]
  }
}

// Fungsi pencarian yang lebih fleksibel
const searchInData = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim()
  
  // Cari berdasarkan NIB, NIK, atau nama
  for (const key in dummySearchData) {
    const data = dummySearchData[key]
    if (
      data.nib === term ||
      data.nik === term ||
      (data.nama_lengkap || '').toLowerCase().includes(term) ||
      (data.nama_usaha || '').toLowerCase().includes(term)
    ) {
      return data
    }
  }
  
  return null
}

export default function PenelusuranPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    setUserRole(role)
  }, [router])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Masukkan NIB, NIK, atau Nama untuk mencari data')
      return
    }
    
    setLoading(true)
    setSearched(true)
    
    try {
      // Simulasi delay pencarian
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = searchInData(searchTerm)
      setSearchResult(result)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setSearchTerm('')
    setSearchResult(null)
    setSearched(false)
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Banner untuk Mode Pengguna */}
        {userRole === 'user' && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Mode Pengguna - Akses Penelusuran Data</h2>
                <p className="text-blue-100">Anda dapat mencari dan melihat data IKM Binaan beserta riwayat layanan dan pelatihan</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Penelusuran Data IKM Binaan</h1>
          <p className="text-gray-600">Cari dan lihat detail lengkap data IKM Binaan beserta layanan IKM JUARA dan pelatihan pemberdayaan industri yang pernah diikuti</p>
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Data Personal</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Layanan IKM JUARA</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Pelatihan Pemberdayaan Industri</span>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan NIB (13 digit), NIK (16 digit), Nama Lengkap, atau Nama Usaha"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>{loading ? 'Mencari...' : 'Cari Data'}</span>
            </button>
            {searched && (
              <button
                onClick={resetSearch}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                Reset
              </button>
            )}
          </div>
          
          {/* Search Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Tips Pencarian:</strong> Anda dapat mencari menggunakan NIB (13 digit), NIK (16 digit), nama lengkap, atau nama usaha. 
              Contoh: "1234567890123", "Budi Santoso", atau "CV. Sumber Rejeki"
            </p>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Mencari data...</p>
              </div>
            ) : searchResult ? (
              <div className="space-y-6">
                {/* Data Personal */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Data Personal IKM Binaan
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">NIB</h3>
                        <p className="text-lg font-mono">{searchResult.nib}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">NIK</h3>
                        <p className="text-lg font-mono">{searchResult.nik}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nama Lengkap</h3>
                        <p className="text-lg font-semibold">{searchResult.nama_lengkap}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nama Usaha</h3>
                        <p className="text-lg font-semibold">{searchResult.nama_usaha}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Alamat Lengkap</h3>
                        <p className="text-lg">{searchResult.alamat_lengkap}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nomor HP</h3>
                        <p className="text-lg">{searchResult.nomor_hp}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status Database</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          searchResult.database_indicator 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {searchResult.database_indicator ? 'Terdaftar' : 'Belum Terdaftar'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layanan IKM JUARA */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <DocumentCheckIcon className="h-5 w-5 mr-2" />
                      Layanan IKM JUARA yang Pernah Diikuti
                    </h2>
                  </div>
                  <div className="p-6">
                    {Object.keys(searchResult.layanan).length > 0 ? (
                      <div className="space-y-4">
                        {searchResult.layanan.hki_merek && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Pendaftaran HKI Merek</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Nomor Pendaftaran:</span>
                                <p className="font-medium">{searchResult.layanan.hki_merek.nomor_pendaftaran}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Status:</span>
                                <p className="font-medium">{searchResult.layanan.hki_merek.status_sertifikat}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tahun:</span>
                                <p className="font-medium">{searchResult.layanan.hki_merek.tahun_fasilitasi}</p>
                              </div>
                            </div>
                            {searchResult.layanan.hki_merek.link_sertifikat && (
                              <div className="mt-2">
                                <a
                                  href={searchResult.layanan.hki_merek.link_sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat Sertifikat →
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {searchResult.layanan.sertifikat_halal && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Sertifikat Halal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Nomor Sertifikat:</span>
                                <p className="font-medium">{searchResult.layanan.sertifikat_halal.nomor_sertifikat}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tahun:</span>
                                <p className="font-medium">{searchResult.layanan.sertifikat_halal.tahun_fasilitasi}</p>
                              </div>
                            </div>
                            {searchResult.layanan.sertifikat_halal.link_sertifikat && (
                              <div className="mt-2">
                                <a
                                  href={searchResult.layanan.sertifikat_halal.link_sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat Sertifikat →
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {searchResult.layanan.tkdn_ik && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">TKDN IK</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Nomor Sertifikat:</span>
                                <p className="font-medium">{searchResult.layanan.tkdn_ik.nomor_sertifikat}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tahun Terbit:</span>
                                <p className="font-medium">{searchResult.layanan.tkdn_ik.tahun_terbit}</p>
                              </div>
                            </div>
                            {searchResult.layanan.tkdn_ik.link_sertifikat && (
                              <div className="mt-2">
                                <a
                                  href={searchResult.layanan.tkdn_ik.link_sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat Sertifikat →
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {searchResult.layanan.uji_nilai_gizi && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Uji Nilai Gizi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Nomor LHU:</span>
                                <p className="font-medium">{searchResult.layanan.uji_nilai_gizi.nomor_lhu}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tanggal Hasil:</span>
                                <p className="font-medium">{searchResult.layanan.uji_nilai_gizi.tanggal_hasil_uji}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tahun:</span>
                                <p className="font-medium">{searchResult.layanan.uji_nilai_gizi.tahun_fasilitasi}</p>
                              </div>
                            </div>
                            {searchResult.layanan.uji_nilai_gizi.link_lhu && (
                              <div className="mt-2">
                                <a
                                  href={searchResult.layanan.uji_nilai_gizi.link_lhu}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat LHU →
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {searchResult.layanan.kurasi_produk && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Kurasi Produk</h3>
                            <div className="text-sm">
                              <div>
                                <span className="text-gray-500">Nomor Sertifikat:</span>
                                <p className="font-medium">{searchResult.layanan.kurasi_produk.nomor_sertifikat}</p>
                              </div>
                            </div>
                            {searchResult.layanan.kurasi_produk.link_sertifikat && (
                              <div className="mt-2">
                                <a
                                  href={searchResult.layanan.kurasi_produk.link_sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat Sertifikat →
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DocumentCheckIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Belum mengikuti layanan IKM JUARA</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pelatihan Pemberdayaan Industri */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      Pelatihan Pemberdayaan Industri yang Pernah Diikuti
                    </h2>
                  </div>
                  <div className="p-6">
                    {searchResult.pelatihan && searchResult.pelatihan.length > 0 ? (
                      <div className="space-y-4">
                        {searchResult.pelatihan.map((pelatihan, index) => (
                          <div key={pelatihan.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-900">{pelatihan.nama_pelatihan}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pelatihan.status === 'Selesai' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pelatihan.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Sub Kegiatan:</span>
                                <p className="font-medium">{pelatihan.sub_kegiatan}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tanggal Pelatihan:</span>
                                <p className="font-medium">{pelatihan.tanggal_pelatihan}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Tahun Pelaksanaan:</span>
                                <p className="font-medium">{pelatihan.tahun_pelaksanaan}</p>
                              </div>
                            </div>
                            {pelatihan.sertifikat && (
                              <div className="mt-2">
                                <a
                                  href={pelatihan.sertifikat}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Lihat Sertifikat Pelatihan →
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Belum mengikuti pelatihan pemberdayaan industri</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                <p className="text-gray-600 mb-4">
                  Data dengan kata kunci "{searchTerm}" tidak ditemukan dalam database IKM Binaan.
                </p>
                <p className="text-sm text-gray-500">
                  Pastikan NIB, NIK, nama lengkap, atau nama usaha yang Anda masukkan sudah benar.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searched && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mulai Pencarian Data</h3>
            <p className="text-gray-600 mb-4">
              Masukkan NIB, NIK, nama lengkap, atau nama usaha pada kolom pencarian di atas untuk melihat detail lengkap data IKM Binaan.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p><strong>Contoh pencarian:</strong></p>
              <p>• NIB: 1234567890123</p>
              <p>• NIK: 3573012345678903</p>
              <p>• Nama: Budi Santoso</p>
              <p>• Usaha: CV. Sumber Rejeki</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}