-- ==============================================================================
-- Gather & Glow - Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'planning',
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '12:00',
  end_time TEXT,
  location TEXT NOT NULL,
  venue TEXT,
  description TEXT DEFAULT '',
  guest_count INTEGER DEFAULT 0,
  adults_count INTEGER,
  children_count INTEGER,
  confirmed_guests INTEGER DEFAULT 0,
  budget NUMERIC(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  budget_flexibility TEXT DEFAULT 'flexible',
  spent NUMERIC(12, 2) DEFAULT 0,
  theme TEXT,
  event_style TEXT,
  preferred_colors TEXT[],
  special_requirements TEXT,
  cover_image TEXT,
  is_draft BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TEXT NOT NULL,
  assignee TEXT,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.guests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending',
  category TEXT DEFAULT 'general',
  family_group TEXT,
  invitation_status TEXT DEFAULT 'not-sent',
  invitation_sent_date TEXT,
  rsvp_response_date TEXT,
  table_assignment TEXT,
  dietary_restrictions TEXT,
  special_requirements TEXT,
  plus_one BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUDGET ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.budget_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'miscellaneous',
  description TEXT NOT NULL,
  estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  actual_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid BOOLEAN DEFAULT false,
  vendor TEXT,
  due_date TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VENDORS TABLE
CREATE TABLE IF NOT EXISTS public.vendors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  quoted_price NUMERIC(12, 2) DEFAULT 0,
  final_price NUMERIC(12, 2) DEFAULT 0,
  booking_date TEXT,
  booking_status TEXT NOT NULL DEFAULT 'inquired',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  paid_amount NUMERIC(12, 2) DEFAULT 0,
  contract_signed BOOLEAN DEFAULT false,
  notes TEXT,
  website TEXT,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TIMELINE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.timeline_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  responsible TEXT,
  category TEXT DEFAULT 'general',
  date TEXT,
  location TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON public.tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON public.guests(event_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_event_id ON public.budget_items(event_id);
CREATE INDEX IF NOT EXISTS idx_vendors_event_id ON public.vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_items_event_id ON public.timeline_items(event_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables open access for authenticated & anonymous clients using your anon public key
-- ==============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

-- Events Policies
DROP POLICY IF EXISTS "Public access to events" ON public.events;
CREATE POLICY "Public access to events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- Tasks Policies
DROP POLICY IF EXISTS "Public access to tasks" ON public.tasks;
CREATE POLICY "Public access to tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Guests Policies
DROP POLICY IF EXISTS "Public access to guests" ON public.guests;
CREATE POLICY "Public access to guests" ON public.guests FOR ALL USING (true) WITH CHECK (true);

-- Budget Items Policies
DROP POLICY IF EXISTS "Public access to budget_items" ON public.budget_items;
CREATE POLICY "Public access to budget_items" ON public.budget_items FOR ALL USING (true) WITH CHECK (true);

-- Vendors Policies
DROP POLICY IF EXISTS "Public access to vendors" ON public.vendors;
CREATE POLICY "Public access to vendors" ON public.vendors FOR ALL USING (true) WITH CHECK (true);

-- Timeline Items Policies
DROP POLICY IF EXISTS "Public access to timeline_items" ON public.timeline_items;
CREATE POLICY "Public access to timeline_items" ON public.timeline_items FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED DATA (INITIAL LUXURY PORTFOLIO CELEBRATIONS)
-- ==============================================================================
INSERT INTO public.events (id, name, type, status, date, time, end_time, location, venue, description, guest_count, confirmed_guests, budget, spent, theme, event_style, preferred_colors, cover_image)
VALUES
  (
    'evt-001',
    'Sarah & James''s Napa Valley Wedding',
    'wedding',
    'planning',
    '2027-06-12',
    '16:00',
    '23:00',
    'Napa Valley, CA',
    'Rosewood Estate & Manor',
    'An intimate summer vineyard celebration surrounded by ancient olive groves, candlelit arbor tables, and golden hour dining.',
    200,
    145,
    65000,
    38400,
    'Terracotta Harvest & Tuscan Glow',
    'Rustic Vineyard Elegance',
    ARRAY['#E8D8C8', '#C67B5C', '#8A9A5B', '#4A3B32'],
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'evt-002',
    'Aria''s 30th Botanical Soirée',
    'birthday',
    'confirmed',
    '2027-07-24',
    '19:00',
    '01:00',
    'San Francisco, CA',
    'Conservatory of Flowers',
    'Lush tropical greenery, botanical mixology stations, ambient jazz quartet, and bespoke dessert tasting.',
    85,
    72,
    18500,
    12800,
    'Botanical Conservatory & Modern Champagne',
    'Botanical Glamour',
    ARRAY['#2E4A3D', '#D4AF37', '#FAF7F2'],
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'evt-003',
    'Vanguard Global Gala & Awards',
    'corporate',
    'planning',
    '2027-09-18',
    '18:30',
    '23:30',
    'New York, NY',
    'The Glasshouse Manhattan',
    'Annual black-tie philanthropic summit honoring tech pioneers and sustainability champions with keynote dinner.',
    320,
    260,
    120000,
    54200,
    'Twilight Velvet & Starry Horizon',
    'Modern Black Tie',
    ARRAY['#1A1A24', '#C5A059', '#F0EAD6'],
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;

