-- CHLORO watering reminders: support daily and every-12-hour schedules.
-- Run this after watering_email_setup.sql if the project database already exists.

ALTER TABLE public.user_plants
  ADD COLUMN IF NOT EXISTS water_frequency_hours INTEGER NOT NULL DEFAULT 168 CHECK (water_frequency_hours >= 12),
  ADD COLUMN IF NOT EXISTS next_watering_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at_ts TIMESTAMPTZ;

UPDATE public.user_plants
SET
  water_frequency_hours = COALESCE(water_frequency_hours, water_frequency_days * 24),
  next_watering_at = COALESCE(next_watering_at, next_watering_date::timestamptz + TIME '08:00')
WHERE next_watering_at IS NULL
   OR water_frequency_hours IS NULL;

CREATE INDEX IF NOT EXISTS user_plants_next_watering_at_idx ON public.user_plants(next_watering_at);
CREATE INDEX IF NOT EXISTS user_plants_last_reminder_sent_at_ts_idx ON public.user_plants(last_reminder_sent_at_ts);

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

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'watering-reminders-daily') THEN
    PERFORM cron.unschedule('watering-reminders-daily');
  END IF;
END $$;

-- Runs at 08:00 and 20:00 Nepal time. Replace CRON_SECRET_HERE with your actual Supabase secret.
SELECT cron.schedule(
  'watering-reminders-daily',
  '15 2,14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vefymqrvvsbsfkdfbuky.supabase.co/functions/v1/watering-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer CRON_SECRET_HERE'
    ),
    body := '{"source":"pg_cron_12_hour_support"}'::jsonb
  );
  $$
);

SELECT jobid, jobname, schedule, active
FROM cron.job
WHERE jobname = 'watering-reminders-daily';
