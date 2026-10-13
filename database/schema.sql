-- ====================================================================
-- CITS Indonesia - Database Schema & Migration Script
-- Web Kantor & Back Office CMS
-- ====================================================================

-- 1. Table: admin_users (Autentikasi Administrator Back Office)
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Super Admin',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Administrator default
INSERT INTO admin_users (id, name, email, password_hash, role)
VALUES ('admin-1', 'Administrator CITS', 'admin@cits.id', 'admin123', 'Super Admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Table: products (Katalog Produk & Status Aktif/Non-Aktif)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand_code VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    badge_category VARCHAR(100),
    version VARCHAR(50) DEFAULT 'v1.0',
    tagline TEXT,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Package',
    features JSONB DEFAULT '[]'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    modules JSONB DEFAULT '[]'::jsonb,
    ideal_for TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: contact_info (Informasi Kantor & Kontak Resmi)
CREATE TABLE IF NOT EXISTS contact_info (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    working_hours VARCHAR(100) NOT NULL,
    maps_embed_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contact_info (id, company_name, address, phone, email, working_hours)
VALUES (
    'default',
    'CV CITS Indonesia',
    'Gedung Wisma Mampang, Lantai 5\nJl. Mampang Prapatan No. 1\nJakarta Selatan 12790, DKI Jakarta',
    '(021) 39719677',
    'info@citsindonesia.co.id',
    'Senin – Jumat (08.30 – 17.30 WIB)'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Table: contact_messages (Kotak Masuk Pesan dari Formulir Kontak)
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_requested VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Baru', -- 'Baru', 'Diproses', 'Selesai', 'Arsip'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: about_data (Profil Perusahaan, Visi, Misi, & Statistik)
CREATE TABLE IF NOT EXISTS about_data (
    id VARCHAR(50) PRIMARY KEY,
    company_story TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: clients (Mitra & Logo Instansi Pemerintahan / BUMN)
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    logo_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0
);
