-- ============================================================
-- CHLORO — Supabase Schema Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add missing columns to 'users' table (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='name') THEN
    ALTER TABLE public.users ADD COLUMN name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='phone') THEN
    ALTER TABLE public.users ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='address_line') THEN
    ALTER TABLE public.users ADD COLUMN address_line TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='city') THEN
    ALTER TABLE public.users ADD COLUMN city TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='country') THEN
    ALTER TABLE public.users ADD COLUMN country TEXT DEFAULT 'Nepal';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='postal_code') THEN
    ALTER TABLE public.users ADD COLUMN postal_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='plant_preferences') THEN
    ALTER TABLE public.users ADD COLUMN plant_preferences JSONB;
  END IF;
END $$;


-- 2. Create 'user_profiles' table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username    TEXT,
  full_name   TEXT,
  phone       TEXT,
  address_line TEXT,
  city        TEXT,
  country     TEXT DEFAULT 'Nepal',
  postal_code TEXT,
  avatar_url  TEXT,
  plant_preferences JSONB,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  profile_completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);


-- 3. Create 'billing_details' table
CREATE TABLE IF NOT EXISTS public.billing_details (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name   TEXT,
  email       TEXT,
  phone       TEXT,
  address_line TEXT,
  city        TEXT,
  country     TEXT DEFAULT 'Nepal',
  postal_code TEXT,
  is_default  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);


-- 4. Create 'wishlist' table (with FK to products)
CREATE TABLE IF NOT EXISTS public.wishlist (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);


-- 5. Enable Row Level Security
ALTER TABLE public.user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist        ENABLE ROW LEVEL SECURITY;


-- 6. RLS Policies — users can only access their own data

-- user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- billing_details
CREATE POLICY "Users can view own billing"
  ON public.billing_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own billing"
  ON public.billing_details FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own billing"
  ON public.billing_details FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- wishlist
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);


-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_details_user_id ON public.billing_details(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist(product_id);
