// API endpoint untuk CRUD IKM Binaan
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
      case 'POST':
        return await handlePost(req, res)
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('IKM Binaan API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data IKM Binaan
async function handleGet(req, res) {
  const { data, error } = await supabaseAdmin
    .from('ikm_binaan')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data || []
  })
}

// POST - Tambah data IKM Binaan baru
async function handlePost(req, res) {
  const { nib, nik, nama_lengkap, alamat_lengkap, nama_usaha, nomor_hp } = req.body

  // Validasi input
  if (!nib || !nik || !nama_lengkap || !alamat_lengkap || !nama_usaha || !nomor_hp) {
    return res.status(400).json({
      error: 'Semua field wajib diisi'
    })
  }

  // Cek duplikasi NIB
  const { data: existingNib } = await supabaseAdmin
    .from('ikm_binaan')
    .select('id')
    .eq('nib', nib)
    .is('deleted_at', null)
    .single()

  if (existingNib) {
    return res.status(400).json({
      error: 'NIB sudah terdaftar'
    })
  }

  // Cek duplikasi NIK
  const { data: existingNik } = await supabaseAdmin
    .from('ikm_binaan')
    .select('id')
    .eq('nik', nik)
    .is('deleted_at', null)
    .single()

  if (existingNik) {
    return res.status(400).json({
      error: 'NIK sudah terdaftar'
    })
  }

  // Insert data baru
  const { data, error } = await supabaseAdmin
    .from('ikm_binaan')
    .insert([{
      nib,
      nik,
      nama_lengkap,
      alamat_lengkap,
      nama_usaha,
      nomor_hp,
      database_indicator: false
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Data IKM Binaan berhasil ditambahkan'
  })
}

// PUT - Update data IKM Binaan
async function handlePut(req, res) {
  const { id, nib, nik, nama_lengkap, alamat_lengkap, nama_usaha, nomor_hp } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk update'
    })
  }

  // Cek duplikasi NIB (exclude current record)
  const { data: existingNib } = await supabaseAdmin
    .from('ikm_binaan')
    .select('id')
    .eq('nib', nib)
    .neq('id', id)
    .is('deleted_at', null)
    .single()

  if (existingNib) {
    return res.status(400).json({
      error: 'NIB sudah terdaftar'
    })
  }

  // Cek duplikasi NIK (exclude current record)
  const { data: existingNik } = await supabaseAdmin
    .from('ikm_binaan')
    .select('id')
    .eq('nik', nik)
    .neq('id', id)
    .is('deleted_at', null)
    .single()

  if (existingNik) {
    return res.status(400).json({
      error: 'NIK sudah terdaftar'
    })
  }

  // Update data
  const { data, error } = await supabaseAdmin
    .from('ikm_binaan')
    .update({
      nib,
      nik,
      nama_lengkap,
      alamat_lengkap,
      nama_usaha,
      nomor_hp,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data IKM Binaan berhasil diupdate'
  })
}

// DELETE - Soft delete IKM Binaan
async function handleDelete(req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk delete'
    })
  }

  // Soft delete
  const { data, error } = await supabaseAdmin
    .from('ikm_binaan')
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data IKM Binaan berhasil dihapus'
  })
}