// Script to add missing IKM Binaan data including NIB 1909210016219
import { supabaseAdmin } from './lib/supabase.js'

async function addMissingIkmData() {
  console.log('Adding missing IKM Binaan data...')
  
  try {
    // Check if NIB 1909210016219 already exists
    const { data: existingData } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*')
      .eq('nib', '1909210016219')
      .is('deleted_at', null)
      .single()

    if (existingData) {
      console.log('NIB 1909210016219 already exists:', existingData)
      return
    }

    // Add the missing IKM Binaan data
    const newIkmData = {
      nib: '1909210016219',
      nik: '3573012345678905',
      nama_lengkap: 'Rina Sari',
      alamat_lengkap: 'Jl. Ahmad Yani No. 45, Kelurahan Demangan, Kota Madiun',
      nama_usaha: 'CV. Makmur Sejahtera',
      nomor_hp: '081234567894',
      database_indicator: false
    }

    const { data: insertedIkm, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .insert([newIkmData])
      .select()
      .single()

    if (ikmError) {
      throw ikmError
    }

    console.log('Successfully added IKM Binaan:', insertedIkm)

    // Add related services for this IKM
    const ikmId = insertedIkm.id

    // Add HKI Merek
    const { error: hkiError } = await supabaseAdmin
      .from('hki_merek')
      .insert([{
        ikm_id: ikmId,
        nomor_pendaftaran: 'HKI-2024-005',
        link_bukti_daftar: 'https://drive.google.com/file/d/hki005/view',
        status_sertifikat: 'Telah Didaftar',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/hki005cert/view'
      }])

    if (hkiError) {
      console.error('Error adding HKI Merek:', hkiError)
    } else {
      console.log('Successfully added HKI Merek for NIB 1909210016219')
    }

    // Add Sertifikat Halal
    const { error: halalError } = await supabaseAdmin
      .from('sertifikat_halal')
      .insert([{
        ikm_id: ikmId,
        nomor_sertifikat: 'HALAL-2024-005',
        link_sertifikat: 'https://drive.google.com/file/d/halal005/view',
        tahun_fasilitasi: 2024
      }])

    if (halalError) {
      console.error('Error adding Sertifikat Halal:', halalError)
    } else {
      console.log('Successfully added Sertifikat Halal for NIB 1909210016219')
    }

    // Add SIINas
    const { error: siinasError } = await supabaseAdmin
      .from('siinas')
      .insert([{
        ikm_id: ikmId,
        nomor_bukti_akun: 'SIINAS-2024-005',
        tahun_registrasi: 2024,
        link_bukti: 'https://drive.google.com/file/d/siinas005/view'
      }])

    if (siinasError) {
      console.error('Error adding SIINas:', siinasError)
    } else {
      console.log('Successfully added SIINas for NIB 1909210016219')
    }

    // Add Pelatihan records
    const { data: jenisResponse } = await supabaseAdmin
      .from('jenis_pelatihan')
      .select('*')
      .limit(2)

    if (jenisResponse && jenisResponse.length > 0) {
      for (const jenis of jenisResponse) {
        const { error: pelatihanError } = await supabaseAdmin
          .from('pelatihan')
          .insert([{
            ikm_id: ikmId,
            jenis_pelatihan_id: jenis.id,
            nama_pelatihan: jenis.jenis_pelatihan,
            tanggal_pelatihan: '2024-01-15',
            sertifikat: `https://drive.google.com/file/d/pelatihan${jenis.id}/view`
          }])

        if (pelatihanError) {
          console.error('Error adding Pelatihan:', pelatihanError)
        } else {
          console.log(`Successfully added Pelatihan ${jenis.jenis_pelatihan} for NIB 1909210016219`)
        }
      }
    }

    console.log('All data successfully added for NIB 1909210016219')

  } catch (error) {
    console.error('Error adding missing IKM data:', error)
  }
}

// Run the script
addMissingIkmData()