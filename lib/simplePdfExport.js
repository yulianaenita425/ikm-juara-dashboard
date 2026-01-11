// Simple PDF Export sebagai fallback
export const exportSimplePDF = (data, title = 'Data Export') => {
  try {
    // Create simple HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { background: #3b82f6; color: white; width: 40px; height: 40px; 
                  border-radius: 50%; display: inline-flex; align-items: center; 
                  justify-content: center; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #3b82f6; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-top: 20px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">IKM</div>
          <h1>${title}</h1>
          <p>DisnakerKUKM Kota Madiun</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Nama Usaha</th>
              <th>NIB</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.nama_lengkap || '-'}</td>
                <td>${item.nama_usaha || '-'}</td>
                <td>${item.nib || '-'}</td>
                <td>${item.status || item.database_indicator ? 'Aktif' : 'Tidak Aktif'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          Total Data: ${data.length} record
        </div>
        
        <div class="footer">
          Database IKM JUARA - Dicetak pada ${new Date().toLocaleDateString('id-ID')}
        </div>
      </body>
      </html>
    `
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Auto print
    setTimeout(() => {
      printWindow.print()
    }, 500)
    
    return true
  } catch (error) {
    console.error('Error in simple PDF export:', error)
    throw error
  }
}

// Export untuk berbagai jenis data
export const exportLaporanSimple = (data, filters) => {
  return exportSimplePDF(data, 'Laporan IKM JUARA')
}

export const exportIKMBinaanSimple = (data) => {
  return exportSimplePDF(data, 'Data IKM Binaan')
}

export const exportLogAktivitasSimple = (data) => {
  const formattedData = data.map(item => ({
    nama_lengkap: item.user || '-',
    nama_usaha: item.action || '-',
    nib: item.description || '-',
    status: new Date(item.timestamp).toLocaleDateString('id-ID') || '-'
  }))
  return exportSimplePDF(formattedData, 'Log Aktivitas Sistem')
}

export const exportPelatihanSimple = (pelatihanData, pesertaData) => {
  const combinedData = pesertaData.map(peserta => {
    const pelatihan = pelatihanData.find(p => p.id === peserta.pelatihan_id)
    return {
      nama_lengkap: peserta.nama_lengkap || '-',
      nama_usaha: peserta.nama_usaha || '-',
      nib: peserta.nib || '-',
      status: pelatihan?.jenis_pelatihan || '-'
    }
  })
  return exportSimplePDF(combinedData, 'Data Pelatihan Pemberdayaan Industri')
}