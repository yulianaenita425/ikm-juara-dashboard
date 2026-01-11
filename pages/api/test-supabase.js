// API endpoint untuk test koneksi Supabase
import { supabase, supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test koneksi dengan supabaseAdmin
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Supabase not configured',
        message: 'Please check your environment variables'
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
      details: error
    })
  }
}