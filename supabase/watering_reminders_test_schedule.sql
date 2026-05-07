-- Temporary test schedule: runs watering reminders every 5 minutes.
-- Use only while testing, then switch back to daily with:
--   15 2 * * *
-- Before running, replace CRON_SECRET_HERE with your Supabase Edge Function
-- CRON_SECRET. Do not commit the real secret.

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
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://vefymqrvvsbsfkdfbuky.supabase.co/functions/v1/watering-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer CRON_SECRET_HERE'
    ),
    body := '{"source":"pg_cron_5_min_test"}'::jsonb
  );
  $$
);

SELECT jobid, jobname, schedule, active
FROM cron.job
WHERE jobname = 'watering-reminders-daily';
