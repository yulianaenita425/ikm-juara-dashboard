// Add sample data untuk jenis pelatihan
console.log('📝 Adding sample data to jenis_pelatihan...\n')

async function addSampleData() {
  const sampleData = [
    {
      jenis_pelatihan: 'Digital Marketing untuk UMKM',
      sub_kegiatan: 'Pemasaran Online dan Media Sosial',
      waktu_pelaksanaan: '15-17 Januari 2024, 08:00-16:00 WIB',
      tempat: 'Aula Dinas Perindustrian Kota Madiun',
      link_materi: 'https://drive.google.com/file/d/digital-marketing/view',
      tahun_pelaksanaan: 2024,
      status: 'Aktif'
    },
    {
      jenis_pelatihan: 'Manajemen Keuangan UMKM',
      sub_kegiatan: 'Pembukuan dan Laporan Keuangan',
      waktu_pelaksanaan: '20-22 Februari 2024, 08:00-16:00 WIB',
      tempat: 'Aula Dinas Perindustrian Kota Madiun',
      link_materi: 'https://drive.google.com/file/d/manajemen-keuangan/view',
      tahun_pelaksanaan: 2024,
      status: 'Aktif'
    },
    {
      jenis_pelatihan: 'Pengembangan Produk',
      sub_kegiatan: 'Inovasi dan Desain Produk',
      waktu_pelaksanaan: '10-12 Maret 2024, 08:00-16:00 WIB',
      tempat: 'Aula Dinas Perindustrian Kota Madiun',
      link_materi: 'https://drive.google.com/file/d/pengembangan-produk/view',
      tahun_pelaksanaan: 2024,
      status: 'Selesai'
    }
  ]

  for (const data of sampleData) {
    try {
      console.log(`Adding: ${data.jenis_pelatihan}...`)
      const response = await fetch('http://localhost:3000/api/jenis-pelatihan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        console.log(`✅ ${data.jenis_pelatihan} - Added successfully`)
      } else {
        console.log(`⚠️ ${data.jenis_pelatihan} - May already exist`)
      }
    } catch (error) {
      console.log(`❌ ${data.jenis_pelatihan} - Error: ${error.message}`)
    }
  }
  
  console.log('\n🎉 Sample data addition completed!')
  
  // Test the API again
  try {
    const response = await fetch('http://localhost:3000/api/jenis-pelatihan')
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Final check: ${result.data?.length || 0} jenis pelatihan records found`)
    }
  } catch (error) {
    console.log('⚠️ Final check failed')
  }
}

addSampleData()