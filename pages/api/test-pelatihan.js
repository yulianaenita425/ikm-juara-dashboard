// API endpoint untuk test tabel pelatihan
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Supabase not configured',
        message: 'Please check your environment variables'
      })
    }

    // Test query pelatihan
    const { count: totalPelatihan, error: pelatihanError } = await supabaseAdmin
      .from('pelatihan')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (pelatihanError) {
      return res.status(500).json({
        success: false,
        error: 'Pelatihan table error',
        details: pelatihanError,
        message: 'Tabel pelatihan mungkin belum dibuat. Jalankan database-setup.sql'
      })
    }

    // Test query sample data
    const { data: samplePelatihan, error: sampleError } = await supabaseAdmin
      .from('pelatihan')
      .select('id, nama_pelatihan, tanggal_pelatihan')
      .is('deleted_at', null)
      .limit(3)

    return res.status(200).json({
      success: true,
      message: 'Pelatihan table test successful!',
      data: {
        totalPelatihan: totalPelatihan || 0,
        sampleData: samplePelatihan || [],
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Pelatihan test error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error
    })
  }
}