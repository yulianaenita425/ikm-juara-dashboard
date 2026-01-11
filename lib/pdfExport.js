// PDF Export Utilities dengan error handling yang lebih baik
let jsPDF, autoTable

// Dynamic import untuk menghindari SSR issues
const loadPDFLibraries = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    if (!jsPDF) {
      const jsPDFModule = await import('jspdf')
      jsPDF = jsPDFModule.default
      
      // Import autoTable plugin
      const autoTableModule = await import('jspdf-autotable')
      // Plugin akan otomatis attach ke jsPDF
    }
    return jsPDF
  } catch (error) {
    console.error('Error loading PDF libraries:', error)
    throw new Error('Gagal memuat library PDF')
  }
}

// Konfigurasi font untuk bahasa Indonesia
const configurePDF = (doc) => {
  // Set font untuk mendukung karakter Indonesia
  doc.setFont('helvetica')
  
  // Header styling
  const addHeader = (title, subtitle = '') => {
    // Logo placeholder
    doc.setFillColor(59, 130, 246) // Blue color
    doc.roundedRect(20, 15, 12, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('IKM', 26, 23)
    
    // Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 40, 23)
    
    if (subtitle) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(subtitle, 40, 30)
    }
    
    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 35, 190, 35)
    
    return 45 // Return Y position after header
  }
  
  // Footer
  const addFooter = () => {
    const pageCount = doc.internal.getNumberOfPages()
    const pageHeight = doc.internal.pageSize.height
    
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Halaman ${pageCount}`, 20, pageHeight - 10)
    doc.text(`Database IKM JUARA - DisnakerKUKM Kota Madiun`, 105, pageHeight - 10, { align: 'center' })
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 190, pageHeight - 10, { align: 'right' })
  }
  
  return { addHeader, addFooter }
}

// Export Laporan IKM JUARA
export const exportLaporanPDF = async (data, filters) => {
  try {
    const PDFClass = await loadPDFLibraries()
    if (!PDFClass) throw new Error('PDF library tidak tersedia')
    
    const doc = new PDFClass()
    const { addHeader, addFooter } = configurePDF(doc)
    
    // Header
    let yPos = addHeader('Laporan IKM JUARA', 'DisnakerKUKM Kota Madiun')
    
    // Filter info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Jenis Layanan: ${filters.jenis || 'Semua'}`, 20, yPos)
    yPos += 7
    doc.text(`Tahun: ${filters.tahun || 'Semua'}`, 20, yPos)
    yPos += 7
    doc.text(`Bulan: ${filters.bulan || 'Semua'}`, 20, yPos)
    yPos += 15
    
    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      item.nama_lengkap || '-',
      item.nama_usaha || '-',
      item.nib || '-',
      item.jenis_layanan || '-',
      item.status || '-',
      item.tahun_fasilitasi || '-'
    ])
    
    // Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama Lengkap', 'Nama Usaha', 'NIB', 'Jenis Layanan', 'Status', 'Tahun']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Data: ${data.length} record`, 20, finalY)
    
    // Save PDF
    const fileName = `Laporan_IKM_JUARA_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error in exportLaporanPDF:', error)
    throw error
  }
}

// Export Log Aktivitas
export const exportLogAktivitasPDF = async (data, filters) => {
  try {
    const PDFClass = await loadPDFLibraries()
    if (!PDFClass) throw new Error('PDF library tidak tersedia')
    
    const doc = new PDFClass()
    const { addHeader, addFooter } = configurePDF(doc)
    
    // Header
    let yPos = addHeader('Log Aktivitas Sistem', 'Database IKM JUARA')
    
    // Filter info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Tanggal: ${filters.startDate || 'Semua'} - ${filters.endDate || 'Semua'}`, 20, yPos)
    yPos += 7
    doc.text(`Pengguna: ${filters.user || 'Semua'}`, 20, yPos)
    yPos += 15
    
    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      item.user || '-',
      item.action || '-',
      item.description || '-',
      new Date(item.timestamp).toLocaleString('id-ID') || '-'
    ])
    
    // Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Pengguna', 'Aksi', 'Deskripsi', 'Waktu']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        3: { cellWidth: 60 }, // Description column wider
        4: { cellWidth: 35 }   // Timestamp column
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Aktivitas: ${data.length} record`, 20, finalY)
    
    // Save PDF
    const fileName = `Log_Aktivitas_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error in exportLogAktivitasPDF:', error)
    throw error
  }
}

// Export Data Pelatihan
export const exportPelatihanPDF = async (pelatihanData, pesertaData) => {
  try {
    const PDFClass = await loadPDFLibraries()
    if (!PDFClass) throw new Error('PDF library tidak tersedia')
    
    const doc = new PDFClass()
    const { addHeader, addFooter } = configurePDF(doc)
    
    // Header
    let yPos = addHeader('Data Pelatihan Pemberdayaan Industri', 'DisnakerKUKM Kota Madiun')
    
    // Jenis Pelatihan Section
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Jenis Pelatihan', 20, yPos)
    yPos += 10
    
    // Prepare pelatihan table data
    const pelatihanTableData = pelatihanData.map((item, index) => [
      index + 1,
      item.jenis_pelatihan || '-',
      item.sub_kegiatan || '-',
      item.tahun_pelaksanaan || '-',
      item.status || '-'
    ])
    
    // Pelatihan Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Jenis Pelatihan', 'Sub Kegiatan', 'Tahun', 'Status']],
      body: pelatihanTableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Peserta Section
    yPos = doc.lastAutoTable.finalY + 20
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Data Peserta Pelatihan', 20, yPos)
    yPos += 10
    
    // Prepare peserta table data
    const pesertaTableData = pesertaData.map((item, index) => {
      const pelatihan = pelatihanData.find(p => p.id === item.pelatihan_id)
      return [
        index + 1,
        item.nama_lengkap || '-',
        item.nama_usaha || '-',
        item.nib || '-',
        pelatihan?.jenis_pelatihan || '-',
        item.status || '-'
      ]
    })
    
    // Peserta Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama Lengkap', 'Nama Usaha', 'NIB', 'Jenis Pelatihan', 'Status']],
      body: pesertaTableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Jenis Pelatihan: ${pelatihanData.length}`, 20, finalY)
    doc.text(`Total Peserta: ${pesertaData.length}`, 20, finalY + 7)
    
    // Save PDF
    const fileName = `Data_Pelatihan_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error in exportPelatihanPDF:', error)
    throw error
  }
}

// Export Peserta Pelatihan Spesifik
export const exportPesertaPelatihanPDF = async (pesertaData, jenisNama) => {
  try {
    const PDFClass = await loadPDFLibraries()
    if (!PDFClass) throw new Error('PDF library tidak tersedia')
    
    const doc = new PDFClass()
    const { addHeader, addFooter } = configurePDF(doc)
    
    // Header
    let yPos = addHeader(`Peserta ${jenisNama}`, 'DisnakerKUKM Kota Madiun')
    
    // Info pelatihan
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Jenis Pelatihan: ${jenisNama}`, 20, yPos)
    yPos += 7
    doc.text(`Total Peserta: ${pesertaData.length} orang`, 20, yPos)
    yPos += 15
    
    // Prepare table data
    const tableData = pesertaData.map((item, index) => [
      index + 1,
      item.ikm_binaan?.nama_lengkap || item.nama_lengkap || '-',
      item.ikm_binaan?.nama_usaha || item.nama_usaha || '-',
      item.ikm_binaan?.nib || item.nib || '-',
      item.ikm_binaan?.nomor_hp || item.nomor_hp || '-',
      item.tanggal_pelatihan ? new Date(item.tanggal_pelatihan).toLocaleDateString('id-ID') : '-',
      item.sertifikat ? 'Ada' : 'Belum Ada'
    ])
    
    // Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama Lengkap', 'Nama Usaha', 'NIB', 'No HP', 'Tanggal', 'Sertifikat']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        3: { cellWidth: 25 }, // NIB
        4: { cellWidth: 25 }, // No HP
        5: { cellWidth: 25 }, // Tanggal
        6: { cellWidth: 20 }, // Sertifikat
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 15
    const sertifikatCount = pesertaData.filter(item => item.sertifikat).length
    const belumSertifikatCount = pesertaData.length - sertifikatCount
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Peserta: ${pesertaData.length}`, 20, finalY)
    doc.text(`Sudah Bersertifikat: ${sertifikatCount}`, 20, finalY + 7)
    doc.text(`Belum Bersertifikat: ${belumSertifikatCount}`, 20, finalY + 14)
    
    // Save PDF
    const fileName = `Peserta_${jenisNama.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error in exportPesertaPelatihanPDF:', error)
    throw error
  }
}

// Export Data IKM Binaan
export const exportIKMBinaanPDF = async (data) => {
  try {
    const PDFClass = await loadPDFLibraries()
    if (!PDFClass) throw new Error('PDF library tidak tersedia')
    
    const doc = new PDFClass()
    const { addHeader, addFooter } = configurePDF(doc)
    
    // Header
    let yPos = addHeader('Data IKM Binaan', 'DisnakerKUKM Kota Madiun')
    
    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      item.nama_lengkap || '-',
      item.nama_usaha || '-',
      item.nib || '-',
      item.nik || '-',
      item.nomor_hp || '-',
      item.database_indicator ? 'Lengkap' : 'Belum Lengkap'
    ])
    
    // Table
    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama Lengkap', 'Nama Usaha', 'NIB', 'NIK', 'No HP', 'Status']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        3: { cellWidth: 25 }, // NIB
        4: { cellWidth: 25 }, // NIK
        5: { cellWidth: 25 }, // No HP
      },
      margin: { left: 20, right: 20 },
      didDrawPage: function(data) {
        addFooter()
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 15
    const lengkapCount = data.filter(item => item.database_indicator).length
    const belumLengkapCount = data.length - lengkapCount
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total IKM Binaan: ${data.length}`, 20, finalY)
    doc.text(`Data Lengkap: ${lengkapCount}`, 20, finalY + 7)
    doc.text(`Data Belum Lengkap: ${belumLengkapCount}`, 20, finalY + 14)
    
    // Save PDF
    const fileName = `Data_IKM_Binaan_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error in exportIKMBinaanPDF:', error)
    throw error
  }
}