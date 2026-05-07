-- CHLORO seasonal location recommendation cache
-- Run in Supabase SQL Editor before deploying supabase/functions/get_seasonal_plants.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.seasonal_recommendation_cache (
    cache_key TEXT PRIMARY KEY,
    region TEXT NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    payload JSONB NOT NULL,
    cached_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS seasonal_recommendation_cache_region_month_idx
    ON public.seasonal_recommendation_cache(region, month);

CREATE INDEX IF NOT EXISTS seasonal_recommendation_cache_cached_until_idx
    ON public.seasonal_recommendation_cache(cached_until);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS update_seasonal_recommendation_cache_updated_at ON public.seasonal_recommendation_cache;
CREATE TRIGGER update_seasonal_recommendation_cache_updated_at
    BEFORE UPDATE ON public.seasonal_recommendation_cache
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

ALTER TABLE public.seasonal_recommendation_cache ENABLE ROW LEVEL SECURITY;

