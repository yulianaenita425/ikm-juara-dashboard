// API endpoint untuk test koneksi Supabase
import { supabase, supabaseAdmin, checkSupabaseConfig, getSupabaseError } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check konfigurasi
    const config = checkSupabaseConfig()
    const error = getSupabaseError()
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error,
        config: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      })
    }

    // Test query sederhana
    const { data: ikmData, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('id, nama_usaha')
      .limit(1)

    if (ikmError) {
      throw ikmError
    }

    // Test count
    const { count: totalIkm, error: countError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw countError
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful!',
      config,
      data: {
        sampleIkm: ikmData,
        totalIkm: totalIkm,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}