// API endpoint untuk debug semua data
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Supabase not configured'
      })
    }

    // 1. Cek semua data IKM Binaan
    const { data: ikmData, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*')
      .order('created_at', { ascending: true })

    if (ikmError) throw ikmError

    // 2. Cek semua data HKI Merek dengan join IKM
    const { data: hkiData, error: hkiError } = await supabaseAdmin
      .from('hki_merek')
      .select(`
        *,
        ikm_binaan:ikm_id (
          id,
          nama_lengkap,
          nama_usaha,
          nib
        )
      `)
      .order('created_at', { ascending: true })

    if (hkiError) throw hkiError

    // 3. Cek semua data Sertifikat Halal dengan join IKM
    const { data: halalData, error: halalError } = await supabaseAdmin
      .from('sertifikat_halal')
      .select(`
        *,
        ikm_binaan:ikm_id (
          id,
          nama_lengkap,
          nama_usaha,
          nib
        )
      `)
      .order('created_at', { ascending: true })

    if (halalError) throw halalError

    // 4. Count dengan filter deleted_at
    const { count: ikmCount } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    const { count: hkiCount } = await supabaseAdmin
      .from('hki_merek')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    const { count: halalCount } = await supabaseAdmin
      .from('sertifikat_halal')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    // 5. Cek HKI Merek tahun 2024 khusus
    const { data: hki2024, error: hki2024Error } = await supabaseAdmin
      .from('hki_merek')
      .select(`
        *,
        ikm_binaan:ikm_id (
          id,
          nama_lengkap,
          nama_usaha,
          nib
        )
      `)
      .eq('tahun_fasilitasi', 2024)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    return res.status(200).json({
      success: true,
      message: 'Debug data successful!',
      data: {
        // Raw data
        allIkmBinaan: ikmData,
        allHkiMerek: hkiData,
        allSertifikatHalal: halalData,
        
        // Counts
        counts: {
          ikmBinaan: ikmCount,
          hkiMerek: hkiCount,
          sertifikatHalal: halalCount
        },
        
        // Filtered data
        hkiMerek2024: hki2024,
        
        // Analysis
        analysis: {
          ikmWithDeletedAt: ikmData?.filter(item => item.deleted_at !== null) || [],
          hkiWithDeletedAt: hkiData?.filter(item => item.deleted_at !== null) || [],
          halalWithDeletedAt: halalData?.filter(item => item.deleted_at !== null) || []
        },
        
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Debug data error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error
    })
  }
}