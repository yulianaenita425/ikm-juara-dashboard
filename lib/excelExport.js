// Utility untuk export data ke Excel format yang sesungguhnya
// Menggunakan client-side Excel generation tanpa library eksternal

export function exportToExcel(data, filename, sheetName = 'Sheet1') {
  try {
    // Buat workbook XML structure
    const workbook = createWorkbook(data, sheetName)
    
    // Convert ke blob
    const blob = new Blob([workbook], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    // Download file
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return false
  }
}

function createWorkbook(data, sheetName) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }
  
  // Get headers from first row
  const headers = Object.keys(data[0])
  
  // Create XML content for Excel
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>IKM JUARA Dashboard</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
   <Font ss:Color="#FFFFFF"/>
  </Style>
  <Style ss:ID="Data">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table>`

  // Add header row
  xml += '<Row>'
  headers.forEach(header => {
    xml += `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`
  })
  xml += '</Row>'
  
  // Add data rows
  data.forEach(row => {
    xml += '<Row>'
    headers.forEach(header => {
      const value = row[header] || ''
      const cellType = isNumber(value) ? 'Number' : 'String'
      xml += `<Cell ss:StyleID="Data"><Data ss:Type="${cellType}">${escapeXml(String(value))}</Data></Cell>`
    })
    xml += '</Row>'
  })
  
  xml += `  </Table>
 </Worksheet>
</Workbook>`
  
  return xml
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isNumber(value) {
  return !isNaN(value) && !isNaN(parseFloat(value)) && isFinite(value)
}

// Export function khusus untuk IKM Binaan
export function exportIKMBinaanToExcel(ikmData) {
  if (!ikmData || ikmData.length === 0) {
    throw new Error('Tidak ada data IKM Binaan untuk diekspor')
  }
  
  // Transform data untuk export
  const exportData = ikmData.map((ikm, index) => ({
    'No.': index + 1,
    'NIB': ikm.nib || '',
    'No. KTP': ikm.nik || '',
    'Nama Lengkap': ikm.nama_lengkap || '',
    'Alamat Lengkap': ikm.alamat_lengkap || '',
    'Nama Usaha': ikm.nama_usaha || '',
    'No. HP': ikm.nomor_hp || '',
    'Tanggal Input': ikm.created_at ? new Date(ikm.created_at).toLocaleDateString('id-ID') : '',
    'Status Database': ikm.database_indicator ? 'Lengkap' : 'Belum Lengkap',
    'Duplikat NIB': ikm.has_duplicate_nib ? 'Ya' : 'Tidak',
    'Duplikat NIK': ikm.has_duplicate_nik ? 'Ya' : 'Tidak'
  }))
  
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `Data_IKM_Binaan_${timestamp}.xls`
  
  return exportToExcel(exportData, filename, 'IKM Binaan')
}

// Export function khusus untuk Pelatihan
export function exportPelatihanToExcel(pelatihanData, jenisNama = 'Pelatihan') {
  if (!pelatihanData || pelatihanData.length === 0) {
    throw new Error('Tidak ada data pelatihan untuk diekspor')
  }
  
  // Transform data untuk export
  const exportData = pelatihanData.map((peserta, index) => ({
    'No.': index + 1,
    'NIB': peserta.ikm_binaan?.nib || peserta.nib || '',
    'NIK': peserta.ikm_binaan?.nik || peserta.nik || '',
    'Nama Lengkap': peserta.ikm_binaan?.nama_lengkap || peserta.nama_lengkap || '',
    'Nama Usaha': peserta.ikm_binaan?.nama_usaha || peserta.nama_usaha || '',
    'No. HP': peserta.ikm_binaan?.nomor_hp || peserta.nomor_hp || '',
    'Jenis Pelatihan': jenisNama,
    'Tanggal Pelatihan': peserta.tanggal_pelatihan ? new Date(peserta.tanggal_pelatihan).toLocaleDateString('id-ID') : '',
    'Status Sertifikat': peserta.sertifikat ? 'Ada' : 'Belum Ada',
    'Link Sertifikat': peserta.sertifikat || '',
    'Tanggal Daftar': peserta.created_at ? new Date(peserta.created_at).toLocaleDateString('id-ID') : ''
  }))
  
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `Peserta_${jenisNama.replace(/\s+/g, '_')}_${timestamp}.xls`
  
  return exportToExcel(exportData, filename, `Peserta ${jenisNama}`)
}

// Fallback CSV export jika Excel gagal
export function exportToCSV(data, filename) {
  try {
    if (!data || data.length === 0) {
      throw new Error('Tidak ada data untuk diekspor')
    }
    
    const headers = Object.keys(data[0])
    let csvContent = '\uFEFF' + headers.join(',') + '\n' // BOM for UTF-8
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (String(value).includes(',') || String(value).includes('"') || String(value).includes('\n')) {
          return `"${String(value).replace(/"/g, '""')}"`
        }
        return String(value)
      })
      csvContent += values.join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    return false
  }
}