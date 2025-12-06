CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RFPs table
CREATE TABLE IF NOT EXISTS rfps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description_raw TEXT,
  structured_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vendor Proposals table
CREATE TABLE IF NOT EXISTS vendor_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  email_subject TEXT,
  email_body_raw TEXT,
  attachments JSONB,
  parsed_data JSONB,
  score DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
  results JSONB,
  recommended_vendor_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
