-- CHLORO plant watering reminders
-- Run in Supabase SQL Editor, then deploy supabase/functions/watering-reminders.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = (SELECT auth.uid())
          AND role = 'ADMIN'
    );
$$;

CREATE TABLE IF NOT EXISTS public.user_plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    plant_name TEXT NOT NULL,
    plant_image TEXT,
    water_frequency_days INTEGER NOT NULL DEFAULT 7 CHECK (water_frequency_days > 0),
    water_frequency_hours INTEGER NOT NULL DEFAULT 168 CHECK (water_frequency_hours >= 12),
    last_watered_at DATE NOT NULL DEFAULT CURRENT_DATE,
    next_watering_date DATE NOT NULL,
    next_watering_at TIMESTAMPTZ,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    last_reminder_sent_at DATE,
    last_reminder_sent_at_ts TIMESTAMPTZ,
    public_water_token UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.user_plants
  ADD COLUMN IF NOT EXISTS water_frequency_hours INTEGER NOT NULL DEFAULT 168 CHECK (water_frequency_hours >= 12),
  ADD COLUMN IF NOT EXISTS next_watering_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at_ts TIMESTAMPTZ;

UPDATE public.user_plants
SET
  water_frequency_hours = CASE
    WHEN next_watering_at IS NULL THEN water_frequency_days * 24
    WHEN water_frequency_hours = 168 AND water_frequency_days <> 7 THEN water_frequency_days * 24
    ELSE COALESCE(water_frequency_hours, water_frequency_days * 24)
  END,
  next_watering_at = COALESCE(next_watering_at, next_watering_date::timestamptz + TIME '08:00')
WHERE next_watering_at IS NULL
   OR water_frequency_hours IS NULL
   OR (water_frequency_hours = 168 AND water_frequency_days <> 7);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS update_user_plants_updated_at ON public.user_plants;
CREATE TRIGGER update_user_plants_updated_at
    BEFORE UPDATE ON public.user_plants
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS user_plants_user_id_idx ON public.user_plants(user_id);
CREATE INDEX IF NOT EXISTS user_plants_next_watering_idx ON public.user_plants(next_watering_date);
CREATE INDEX IF NOT EXISTS user_plants_next_watering_at_idx ON public.user_plants(next_watering_at);
CREATE INDEX IF NOT EXISTS user_plants_last_reminder_sent_at_ts_idx ON public.user_plants(last_reminder_sent_at_ts);
CREATE INDEX IF NOT EXISTS user_plants_public_water_token_idx ON public.user_plants(public_water_token);

NOTIFY pgrst, 'reload schema';

ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own watering schedules" ON public.user_plants;
CREATE POLICY "Users can view own watering schedules" ON public.user_plants
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Users can create own watering schedules" ON public.user_plants;
CREATE POLICY "Users can create own watering schedules" ON public.user_plants
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own watering schedules" ON public.user_plants;
CREATE POLICY "Users can update own watering schedules" ON public.user_plants
    FOR UPDATE USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()))
    WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

CREATE OR REPLACE FUNCTION public.mark_plant_watered_by_token(token UUID)
RETURNS TABLE(plant_name TEXT, next_watering_date DATE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.user_plants
       SET last_watered_at = CURRENT_DATE,
           next_watering_at = NOW() + (water_frequency_hours || ' hours')::interval,
           next_watering_date = (NOW() + (water_frequency_hours || ' hours')::interval)::date,
           last_reminder_sent_at = NULL,
           last_reminder_sent_at_ts = NULL,
           updated_at = NOW()
     WHERE public_water_token = token
     RETURNING user_plants.plant_name, user_plants.next_watering_date;
END;
$$;

-- Free-tier setup:
-- 1. Deploy supabase/functions/watering-reminders.
-- 2. Add Edge Function secrets:
--    Required:
--    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET, APP_URL
--    Gmail delivery:
--    EMAIL_PROVIDER=gmail, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET,
--    GMAIL_REFRESH_TOKEN, GMAIL_FROM
--    Optional fallback:
--    RESEND_API_KEY, RESEND_FROM
-- 3. Schedule the function at 08:00 and 20:00 Nepal time.
--    Nepal 08:00/20:00 is UTC 02:15/14:15, so the cron expression is: 15 2,14 * * *
