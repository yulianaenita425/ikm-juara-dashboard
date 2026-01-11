// API endpoint untuk Recycle Bin
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ 
      error: 'Supabase not configured'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'PUT':
        return await handleRestore(req, res)
      case 'DELETE':
        return await handlePermanentDelete(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Recycle Bin API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data yang dihapus (soft deleted)
async function handleGet(req, res) {
  try {
    const deletedItems = []
    
    // Tabel-tabel yang perlu dicek untuk data yang dihapus
    const tables = [
      { name: 'ikm_binaan', type: 'IKM Binaan' },
      { name: 'hki_merek', type: 'HKI Merek' },
      { name: 'sertifikat_halal', type: 'Sertifikat Halal' },
      { name: 'tkdn_ik', type: 'TKDN IK' },
      { name: 'siinas', type: 'SIINas' },
      { name: 'uji_nilai_gizi', type: 'Uji Nilai Gizi' },
      { name: 'kurasi_produk', type: 'Kurasi Produk' },
      { name: 'pelatihan', type: 'Pelatihan' }
    ]

    // Ambil data yang dihapus dari setiap tabel
    for (const table of tables) {
      const { data, error } = await supabaseAdmin
        .from(table.name)
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })

      if (error) {
        console.error(`Error fetching deleted items from ${table.name}:`, error)
        continue
      }

      if (data && data.length > 0) {
        const formattedItems = data.map(item => ({
          ...item,
          recycleBinId: `${table.name}_${item.id}`,
          originalType: table.type,
          originalTable: table.name,
          deletedAt: item.deleted_at
        }))
        
        deletedItems.push(...formattedItems)
      }
    }

    // Sort by deletion date (newest first)
    deletedItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))

    return res.status(200).json({
      success: true,
      data: deletedItems
    })
  } catch (error) {
    throw error
  }
}

// PUT - Restore data (set deleted_at to null)
async function handleRestore(req, res) {
  const { action, id, table } = req.body

  if (action !== 'restore' || !id || !table) {
    return res.status(400).json({
      error: 'Missing required fields: action, id, table'
    })
  }

  try {
    // Extract actual ID from recycleBinId format (table_id)
    const actualId = id.replace(`${table}_`, '')

    const { data, error } = await supabaseAdmin
      .from(table)
      .update({ 
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', actualId)
      .select()

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'Data not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Data berhasil dikembalikan',
      data: data[0]
    })
  } catch (error) {
    throw error
  }
}

// DELETE - Permanent delete (hard delete)
async function handlePermanentDelete(req, res) {
  const { id, table } = req.body

  if (!id || !table) {
    return res.status(400).json({
      error: 'Missing required fields: id, table'
    })
  }

  try {
    // Extract actual ID from recycleBinId format (table_id)
    const actualId = id.replace(`${table}_`, '')

    const { data, error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('id', actualId)
      .select()

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'Data not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Data berhasil dihapus secara permanen'
    })
  } catch (error) {
    throw error
  }
}