const fs = require('fs')
const path = require('path')

// Template untuk mengganti useEffect dan fetch functions
const updateFormTemplate = {
  // Update useEffect
  oldUseEffect: /useEffect\(\(\) => \{[\s\S]*?setLoading\(false\)\s*\}, \[router\]\)/,
  newUseEffect: `useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    fetchData()
    fetchIkmBinaanData()
  }, [router])

  // Fetch data dari API
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ENDPOINT_NAME')
      const result = await response.json()
      
      if (result.success) {
        setDataList(result.data || [])
      } else {
        console.error('Error fetching data:', result.message)
        setDataList([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setDataList([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch data IKM Binaan dari API
  const [ikmBinaanList, setIkmBinaanList] = useState([])
  const fetchIkmBinaanData = async () => {
    try {
      const response = await fetch('/api/ikm-binaan')
      const result = await response.json()
      
      if (result.success) {
        setIkmBinaanList(result.data || [])
      } else {
        console.error('Error fetching IKM Binaan:', result.message)
        setIkmBinaanList(ikmBinaanData) // fallback ke data dummy
      }
    } catch (error) {
      console.error('Error fetching IKM Binaan:', error)
      setIkmBinaanList(ikmBinaanData) // fallback ke data dummy
    }
  }`,

  // Update filteredIkmBinaan
  oldFilteredIkm: /const filteredIkmBinaan = ikmBinaanData\.filter/,
  newFilteredIkm: `const filteredIkmBinaan = ikmBinaanList.filter`,

  // Update handleSubmit template
  oldHandleSubmit: /const handleSubmit = async \(e\) => \{[\s\S]*?alert\('.*?'\)\s*\}/,
  newHandleSubmit: `const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const submitData = {
        ikm_id: selectedIkm?.id || formData.ikm_id,
        // Add specific fields here based on service type
      }

      let response
      if (editingId) {
        // Update existing
        response = await fetch('/api/ENDPOINT_NAME', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            ...submitData
          })
        })
      } else {
        // Add new
        response = await fetch('/api/ENDPOINT_NAME', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        })
      }

      const result = await response.json()
      
      if (result.success) {
        await fetchData() // Refresh data
        resetForm()
        alert('Data berhasil disimpan!')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Gagal menyimpan data: ' + error.message)
    }
  }`,

  // Update handleDelete
  oldHandleDelete: /const handleDelete = async \(id\) => \{[\s\S]*?alert\('.*?'\)\s*\}/,
  newHandleDelete: `const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch('/api/ENDPOINT_NAME', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        })

        const result = await response.json()
        
        if (result.success) {
          await fetchData() // Refresh data
          alert('Data berhasil dihapus!')
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Gagal menghapus data: ' + error.message)
      }
    }
  }`
}

// Mapping layanan ke endpoint dan field
const layananConfig = {
  'siinas': {
    endpoint: 'siinas',
    dataListVar: 'siinaslist',
    fields: ['nomor_bukti_akun', 'tahun_registrasi', 'link_bukti']
  },
  'uji-nilai-gizi': {
    endpoint: 'uji-nilai-gizi', 
    dataListVar: 'ujiList',
    fields: ['nomor_lhu', 'tanggal_hasil_uji', 'tahun_fasilitasi', 'link_lhu']
  },
  'kurasi-produk': {
    endpoint: 'kurasi-produk',
    dataListVar: 'kurasiList', 
    fields: ['nomor_sertifikat', 'link_sertifikat']
  }
}

async function updateLayananForms() {
  console.log('🔧 Updating layanan forms to use API...\n')
  
  for (const [layanan, config] of Object.entries(layananConfig)) {
    const filePath = `pages/layanan/${layanan}.js`
    
    try {
      console.log(`📝 Updating ${filePath}...`)
      
      if (!fs.existsSync(filePath)) {
        console.log(`   ❌ File not found: ${filePath}`)
        continue
      }
      
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Replace endpoint name in templates
      let newUseEffect = updateFormTemplate.newUseEffect.replace(/ENDPOINT_NAME/g, config.endpoint)
      let newHandleSubmit = updateFormTemplate.newHandleSubmit.replace(/ENDPOINT_NAME/g, config.endpoint)
      let newHandleDelete = updateFormTemplate.newHandleDelete.replace(/ENDPOINT_NAME/g, config.endpoint)
      
      // Replace setDataList with actual variable name
      newUseEffect = newUseEffect.replace(/setDataList/g, `set${config.dataListVar.charAt(0).toUpperCase() + config.dataListVar.slice(1)}`)
      newHandleSubmit = newHandleSubmit.replace(/fetchData/g, `fetch${config.dataListVar.charAt(0).toUpperCase() + config.dataListVar.slice(1).replace('list', 'Data')}`)
      newHandleDelete = newHandleDelete.replace(/fetchData/g, `fetch${config.dataListVar.charAt(0).toUpperCase() + config.dataListVar.slice(1).replace('list', 'Data')}`)
      
      // Add specific fields to submitData
      const fieldsString = config.fields.map(field => `${field}: formData.${field}`).join(',\n        ')
      newHandleSubmit = newHandleSubmit.replace('// Add specific fields here based on service type', fieldsString)
      
      // Apply replacements
      content = content.replace(updateFormTemplate.oldUseEffect, newUseEffect)
      content = content.replace(updateFormTemplate.oldFilteredIkm, updateFormTemplate.newFilteredIkm)
      content = content.replace(updateFormTemplate.oldHandleSubmit, newHandleSubmit)
      content = content.replace(updateFormTemplate.oldHandleDelete, newHandleDelete)
      
      // Write back to file
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`   ✅ Updated ${filePath}`)
      
    } catch (error) {
      console.log(`   ❌ Error updating ${filePath}: ${error.message}`)
    }
  }
  
  console.log('\n🎉 Form update completed!')
}

updateLayananForms()