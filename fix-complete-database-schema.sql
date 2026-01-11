-- Complete Database Schema Fix untuk IKM JUARA
-- Menambahkan kolom yang hilang dan memperbaiki struktur

-- 1. Update tabel pelatihan untuk mendukung jenis_pelatihan_id
ALTER TABLE pelatihan 
ADD COLUMN IF NOT EXISTS jenis_pelatihan_id UUID REFERENCES jenis_pelatihan(id) ON DELETE CASCADE;

-- 2. Update tabel sertifikat_halal untuk menambahkan kolom yang hilang
ALTER TABLE sertifikat_halal 
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak')) DEFAULT 'Proses',
ADD COLUMN IF NOT EXISTS link_logo TEXT;

-- 3. Update tabel tkdn_ik untuk menambahkan kolom yang hilang
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS tkdn_percentage VARCHAR(10),
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak')) DEFAULT 'Proses',
ADD COLUMN IF NOT EXISTS tahun_fasilitasi INTEGER;

-- Rename kolom yang salah nama
ALTER TABLE tkdn_ik 
RENAME COLUMN link_sertifikat TO link_dokumen;

-- 4. Update tabel hki_merek untuk menambahkan kolom yang hilang
ALTER TABLE hki_merek 
ADD COLUMN IF NOT EXISTS link_sertifikat TEXT;

-- 5. Update tabel siinas untuk menambahkan kolom yang hilang
ALTER TABLE siinas 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 6. Update tabel uji_nilai_gizi untuk menambahkan kolom yang hilang
ALTER TABLE uji_nilai_gizi 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 7. Update tabel kurasi_produk untuk menambahkan kolom yang hilang
ALTER TABLE kurasi_produk 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 8. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_pelatihan_jenis_id ON pelatihan(jenis_pelatihan_id);
CREATE INDEX IF NOT EXISTS idx_pelatihan_ikm_id ON pelatihan(ikm_id);
CREATE INDEX IF NOT EXISTS idx_hki_merek_ikm_id ON hki_merek(ikm_id);
CREATE INDEX IF NOT EXISTS idx_sertifikat_halal_ikm_id ON sertifikat_halal(ikm_id);
CREATE INDEX IF NOT EXISTS idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_id);
CREATE INDEX IF NOT EXISTS idx_siinas_ikm_id ON siinas(ikm_id);
CREATE INDEX IF NOT EXISTS idx_uji_nilai_gizi_ikm_id ON uji_nilai_gizi(ikm_id);
CREATE INDEX IF NOT EXISTS idx_kurasi_produk_ikm_id ON kurasi_produk(ikm_id);

-- 9. Update trigger untuk database_indicator
CREATE OR REPLACE FUNCTION update_database_indicator()
RETURNS TRIGGER AS $$
BEGIN
    -- Update database_indicator untuk IKM yang terkait
    UPDATE ikm_binaan 
    SET database_indicator = (
        SELECT CASE 
            WHEN COUNT(*) > 0 THEN TRUE 
            ELSE FALSE 
        END
        FROM (
            SELECT ikm_id FROM hki_merek WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM sertifikat_halal WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM tkdn_ik WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM siinas WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM uji_nilai_gizi WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM kurasi_produk WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM pelatihan WHERE ikm_id = COALESCE(NEW.ikm_id, OLD.ikm_id) AND deleted_at IS NULL
        ) AS services
    )
    WHERE id = COALESCE(NEW.ikm_id, OLD.ikm_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_database_indicator_hki ON hki_merek;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_halal ON sertifikat_halal;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_tkdn ON tkdn_ik;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_siinas ON siinas;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_gizi ON uji_nilai_gizi;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_kurasi ON kurasi_produk;
DROP TRIGGER IF EXISTS trigger_update_database_indicator_pelatihan ON pelatihan;

-- Create new triggers
CREATE TRIGGER trigger_update_database_indicator_hki
    AFTER INSERT OR UPDATE OR DELETE ON hki_merek
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_halal
    AFTER INSERT OR UPDATE OR DELETE ON sertifikat_halal
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_tkdn
    AFTER INSERT OR UPDATE OR DELETE ON tkdn_ik
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_siinas
    AFTER INSERT OR UPDATE OR DELETE ON siinas
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_gizi
    AFTER INSERT OR UPDATE OR DELETE ON uji_nilai_gizi
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_kurasi
    AFTER INSERT OR UPDATE OR DELETE ON kurasi_produk
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

CREATE TRIGGER trigger_update_database_indicator_pelatihan
    AFTER INSERT OR UPDATE OR DELETE ON pelatihan
    FOR EACH ROW EXECUTE FUNCTION update_database_indicator();

-- 10. Insert sample data untuk testing
INSERT INTO jenis_pelatihan (jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, tahun_pelaksanaan, status) VALUES
('Digital Marketing untuk UMKM', 'Pemasaran Online dan Media Sosial', '2024-01-15 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Aktif'),
('Manajemen Keuangan UMKM', 'Pembukuan dan Laporan Keuangan', '2024-02-20 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Aktif'),
('Pengembangan Produk', 'Inovasi dan Desain Produk', '2024-03-25 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Selesai')
ON CONFLICT DO NOTHING;

-- Update existing data untuk memastikan konsistensi
UPDATE ikm_binaan SET database_indicator = FALSE WHERE database_indicator IS NULL;

-- Comment untuk dokumentasi
COMMENT ON COLUMN sertifikat_halal.status_sertifikat IS 'Status sertifikat halal: Telah Didaftar, Proses, Ditolak';
COMMENT ON COLUMN sertifikat_halal.link_logo IS 'Link ke logo halal';
COMMENT ON COLUMN tkdn_ik.tkdn_percentage IS 'Persentase TKDN dalam format string (contoh: 35%)';
COMMENT ON COLUMN tkdn_ik.status_sertifikat IS 'Status sertifikat TKDN: Telah Didaftar, Proses, Ditolak';
COMMENT ON COLUMN tkdn_ik.tahun_fasilitasi IS 'Tahun fasilitasi TKDN';
COMMENT ON COLUMN hki_merek.link_sertifikat IS 'Link ke sertifikat HKI yang sudah jadi';
COMMENT ON COLUMN siinas.link_dokumen IS 'Link ke dokumen bukti registrasi SIINas';
COMMENT ON COLUMN uji_nilai_gizi.link_dokumen IS 'Link ke dokumen hasil uji nilai gizi';
COMMENT ON COLUMN kurasi_produk.link_dokumen IS 'Link ke dokumen hasil kurasi produk';