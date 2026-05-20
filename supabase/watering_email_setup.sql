-- ============================================================
-- CHLORO — Watering Email Notifications Setup
-- Run this in Supabase Dashboard → SQL Editor
-- This creates the missing notifications table, user_plants
-- table, and schedules the daily cron job.
-- ============================================================

-- 1. Create the notifications table (missing from all schemas!)
CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'SYSTEM',
    message     TEXT NOT NULL,
    link        TEXT,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Edge functions use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Do not add a broad authenticated insert policy here.
DROP POLICY IF EXISTS "Service can insert notifications" ON public.notifications;

-- Enable realtime for the notifications table (powers the toast/bell in the app)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- 2. Create user_plants table (watering schedules)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.user_plants (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id            UUID REFERENCES public.products(id) ON DELETE SET NULL,
    order_id              UUID,
    plant_name            TEXT NOT NULL,
    plant_image           TEXT,
    water_frequency_days  INTEGER NOT NULL DEFAULT 7 CHECK (water_frequency_days > 0),
    last_watered_at       DATE NOT NULL DEFAULT CURRENT_DATE,
    next_watering_date    DATE NOT NULL,
    email_notifications   BOOLEAN NOT NULL DEFAULT TRUE,
    last_reminder_sent_at DATE,
    public_water_token    UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS user_plants_user_id_idx ON public.user_plants(user_id);
CREATE INDEX IF NOT EXISTS user_plants_next_watering_idx ON public.user_plants(next_watering_date);
CREATE INDEX IF NOT EXISTS user_plants_public_water_token_idx ON public.user_plants(public_water_token);

ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;

-- Reusable admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'
    );
$$;

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

-- Auto-update updated_at timestamp
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


-- 3. "Mark as watered" RPC (used by the one-click email link)
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


-- 4. Schedule the daily cron job (Nepal 08:00 = UTC 02:15)
--    IMPORTANT: Replace CRON_SECRET_HERE with a secure random string
--    that you also set as the CRON_SECRET Supabase secret.
--    For Gmail delivery, set Edge Function secrets:
--    EMAIL_PROVIDER=gmail, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET,
--    GMAIL_REFRESH_TOKEN, GMAIL_FROM
--    Optional fallback: RESEND_API_KEY, RESEND_FROM
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'watering-reminders-daily') THEN
    PERFORM cron.unschedule('watering-reminders-daily');
  END IF;
END $$;

SELECT cron.schedule(
  'watering-reminders-daily',
  '15 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vefymqrvvsbsfkdfbuky.supabase.co/functions/v1/watering-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer CRON_SECRET_HERE'
    ),
    body := '{"source":"pg_cron_daily"}'::jsonb
  );
  $$
);

-- Verify cron job was created
SELECT jobid, jobname, schedule, active
FROM cron.job
WHERE jobname = 'watering-reminders-daily';
