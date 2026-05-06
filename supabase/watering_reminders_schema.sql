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
    last_watered_at DATE NOT NULL DEFAULT CURRENT_DATE,
    next_watering_date DATE NOT NULL,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    last_reminder_sent_at DATE,
    public_water_token UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

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
CREATE INDEX IF NOT EXISTS user_plants_public_water_token_idx ON public.user_plants(public_water_token);

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
           next_watering_date = CURRENT_DATE + water_frequency_days,
           last_reminder_sent_at = NULL,
           updated_at = NOW()
     WHERE public_water_token = token
     RETURNING user_plants.plant_name, user_plants.next_watering_date;
END;
$$;

-- Free-tier setup:
-- 1. Deploy supabase/functions/watering-reminders.
-- 2. Add Edge Function secrets:
--    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET, APP_URL
-- 3. Schedule the function daily at 08:00 Nepal time.
--    Nepal 08:00 is UTC 02:15, so the cron expression is: 15 2 * * *
