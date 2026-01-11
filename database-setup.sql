-- Database Setup untuk IKM JUARA
-- Jalankan script ini di Supabase SQL Editor

-- Tabel IKM Binaan
CREATE TABLE ikm_binaan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nib VARCHAR(13) NOT NULL UNIQUE,
    nik VARCHAR(16) NOT NULL,
    nama_lengkap TEXT NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    nama_usaha TEXT NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL,
    database_indicator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel HKI Merek
CREATE TABLE hki_merek (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_pendaftaran TEXT NOT NULL,
    link_bukti_daftar TEXT NOT NULL,
    status_sertifikat VARCHAR(20) CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak')) DEFAULT 'Proses',
    tahun_fasilitasi INTEGER NOT NULL,
    link_sertifikat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel Sertifikat Halal
CREATE TABLE sertifikat_halal (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_sertifikat TEXT NOT NULL,
    link_sertifikat TEXT NOT NULL,
    tahun_fasilitasi INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel TKDN IK
CREATE TABLE tkdn_ik (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_sertifikat TEXT NOT NULL,
    link_sertifikat TEXT NOT NULL,
    tahun_terbit INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel SIINas
CREATE TABLE siinas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_bukti_akun TEXT NOT NULL,
    tahun_registrasi INTEGER NOT NULL,
    link_bukti TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel Uji Nilai Gizi
CREATE TABLE uji_nilai_gizi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_lhu TEXT NOT NULL,
    tanggal_hasil_uji DATE NOT NULL,
    tahun_fasilitasi INTEGER NOT NULL,
    link_lhu TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel Kurasi Produk
CREATE TABLE kurasi_produk (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nomor_sertifikat TEXT NOT NULL,
    link_sertifikat TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel Pelatihan
CREATE TABLE pelatihan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
    nama_pelatihan TEXT NOT NULL,
    tanggal_pelatihan DATE NOT NULL,
    sertifikat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Tabel Buku Tamu
CREATE TABLE buku_tamu (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_lengkap TEXT NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Users (untuk autentikasi)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert data dummy untuk testing
INSERT INTO ikm_binaan (nib, nik, nama_lengkap, alamat_lengkap, nama_usaha, nomor_hp, database_indicator) VALUES
('1234567890123', '3573012345678901', 'Budi Santoso', 'Jl. Merdeka No. 123, Kelurahan Manguharjo, Kota Madiun', 'CV. Sumber Rejeki', '081234567890', true),
('2345678901234', '3573012345678902', 'Siti Aminah', 'Jl. Pahlawan No. 456, Kelurahan Taman, Kota Madiun', 'UD. Berkah Jaya', '081234567891', true),
('3456789012345', '3573012345678903', 'Ahmad Wijaya', 'Jl. Sudirman No. 789, Kelurahan Oro-oro Ombo, Kota Madiun', 'PT. Maju Bersama', '081234567892', false),
('4567890123456', '3573012345678904', 'Dewi Sartika', 'Jl. Diponegoro No. 321, Kelurahan Kartoharjo, Kota Madiun', 'CV. Berkah Mandiri', '081234567893', true),
('5678901234567', '3573012345678905', 'Eko Prasetyo', 'Jl. Ahmad Yani No. 654, Kelurahan Manisrejo, Kota Madiun', 'UD. Maju Jaya', '081234567894', true);

-- Insert data dummy untuk HKI Merek
INSERT INTO hki_merek (ikm_id, nomor_pendaftaran, link_bukti_daftar, status_sertifikat, tahun_fasilitasi, link_sertifikat) 
SELECT id, 'HKI-2024-00' || ROW_NUMBER() OVER (ORDER BY created_at), 
       'https://drive.google.com/file/d/dummy' || ROW_NUMBER() OVER (ORDER BY created_at) || '/view',
       CASE WHEN ROW_NUMBER() OVER (ORDER BY created_at) % 3 = 1 THEN 'Telah Didaftar'
            WHEN ROW_NUMBER() OVER (ORDER BY created_at) % 3 = 2 THEN 'Proses'
            ELSE 'Ditolak' END,
       2024,
       CASE WHEN ROW_NUMBER() OVER (ORDER BY created_at) % 3 = 1 THEN 'https://drive.google.com/file/d/cert' || ROW_NUMBER() OVER (ORDER BY created_at) || '/view'
            ELSE NULL END
FROM ikm_binaan LIMIT 3;

-- Insert data dummy untuk Sertifikat Halal
INSERT INTO sertifikat_halal (ikm_id, nomor_sertifikat, link_sertifikat, tahun_fasilitasi)
SELECT id, 'HALAL-2024-00' || ROW_NUMBER() OVER (ORDER BY created_at),
       'https://drive.google.com/file/d/halal' || ROW_NUMBER() OVER (ORDER BY created_at) || '/view',
       2024
FROM ikm_binaan LIMIT 2;

-- Insert users untuk testing
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$dummy_hash_admin', 'admin'),
('user', '$2a$10$dummy_hash_user', 'user');

-- Trigger untuk update database_indicator
CREATE OR REPLACE FUNCTION update_database_indicator()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ikm_binaan 
    SET database_indicator = (
        SELECT COUNT(*) > 0 
        FROM (
            SELECT ikm_id FROM hki_merek WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM sertifikat_halal WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM tkdn_ik WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM siinas WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM uji_nilai_gizi WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM kurasi_produk WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
            UNION ALL
            SELECT ikm_id FROM pelatihan WHERE ikm_id = NEW.ikm_id AND deleted_at IS NULL
        ) AS services
    )
    WHERE id = NEW.ikm_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk semua tabel layanan
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

-- Index untuk performa
CREATE INDEX idx_ikm_binaan_nib ON ikm_binaan(nib);
CREATE INDEX idx_ikm_binaan_nik ON ikm_binaan(nik);
CREATE INDEX idx_ikm_binaan_nama ON ikm_binaan(nama_lengkap);
CREATE INDEX idx_ikm_binaan_deleted ON ikm_binaan(deleted_at);

-- Index untuk foreign keys
CREATE INDEX idx_hki_merek_ikm_id ON hki_merek(ikm_id);
CREATE INDEX idx_sertifikat_halal_ikm_id ON sertifikat_halal(ikm_id);
CREATE INDEX idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_id);
CREATE INDEX idx_siinas_ikm_id ON siinas(ikm_id);
CREATE INDEX idx_uji_nilai_gizi_ikm_id ON uji_nilai_gizi(ikm_id);
CREATE INDEX idx_kurasi_produk_ikm_id ON kurasi_produk(ikm_id);
CREATE INDEX idx_pelatihan_ikm_id ON pelatihan(ikm_id);