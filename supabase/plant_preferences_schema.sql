-- CHLORO plant preference onboarding support
-- Run this in Supabase SQL Editor before testing preference sync.

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS plant_preferences JSONB;
