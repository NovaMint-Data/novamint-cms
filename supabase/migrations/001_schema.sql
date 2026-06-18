-- ============================================
-- NovaMint CMS - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_price DECIMAL(10,2),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  featured BOOLEAN DEFAULT FALSE,
  payhip_link TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  schema_markup JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAGES (with drag & drop sections as JSON)
-- ============================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '[]',
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NAVIGATION MENU
-- ============================================
CREATE TABLE IF NOT EXISTS navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES navigation(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  open_in_new_tab BOOLEAN DEFAULT FALSE
);

-- ============================================
-- SITE SETTINGS (key-value store)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Storage policy: authenticated upload (we use service role from server)
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Service role update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

-- ============================================
-- DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (key, value) VALUES
  ('site_name', '"NovaMint Creative"'),
  ('site_tagline', '"Premium Digital Products"'),
  ('site_description', '"Discover beautifully crafted digital products for creators, professionals, and entrepreneurs."'),
  ('logo_url', 'null'),
  ('favicon_url', 'null'),
  ('primary_color', '"#607360"'),
  ('footer_text', '"© 2026 NovaMint Creative. All rights reserved."'),
  ('social_links', '{"twitter":"","instagram":"","linkedin":"","youtube":""}'),
  ('homepage_hero_title', '"Beautifully Crafted\nDigital Products"'),
  ('homepage_hero_subtitle', '"Templates, planners, and tools designed for modern creators."'),
  ('homepage_sections', '["hero","featured_products","categories","latest_posts"]'),
  ('google_analytics_id', '""'),
  ('custom_head_code', '""')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- DEFAULT NAVIGATION
-- ============================================
INSERT INTO navigation (label, href, sort_order) VALUES
  ('Shop', '/products', 0),
  ('Blog', '/blog', 1),
  ('About', '/pages/about', 2),
  ('Contact', '/pages/contact', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE CATEGORY
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Templates', 'templates', 'Professional templates for every need', 0),
  ('Planners', 'planners', 'Digital planners and organizers', 1),
  ('Bundles', 'bundles', 'Value-packed product bundles', 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (disabled - we use service role)
-- ============================================
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE navigation DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
