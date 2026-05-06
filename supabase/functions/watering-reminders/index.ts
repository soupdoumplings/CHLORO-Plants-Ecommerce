// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'onboarding@resend.dev';
const CRON_SECRET = Deno.env.get('CRON_SECRET');
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const htmlResponse = (body: string, status = 200) => new Response(
  `<!doctype html><html><head><title>CHLORO</title><style>body{font-family:serif;background:#fbf9f4;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;margin:0}.card{max-width:520px;padding:40px;border:1px solid #d8d2c5;background:white}a{color:#0f3a3a}</style></head><body><div class="card">${body}</div></body></html>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders } },
);

const sendEmail = async ({ email, plantName, markUrl }) => {
  if (!RESEND_API_KEY || !email) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: `${plantName} needs watering today`,
      html: `
        <div style="font-family: Georgia, serif; color:#1a1a1a;">
          <h1 style="font-weight:400;">Time to water ${plantName}</h1>
          <p>Your CHLORO care calendar says this plant is due today.</p>
          <p>
            <a href="${markUrl}" style="background:#0f3a3a;color:#fbf9f4;padding:12px 18px;text-decoration:none;display:inline-block;">
              Mark as watered
            </a>
          </p>
          <p style="font-size:12px;color:#666;">This link updates the schedule without opening the app.</p>
        </div>
      `,
    }),
  });
};

const processDueReminders = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const { data: duePlants, error } = await supabase
    .from('user_plants')
    .select('id, user_id, plant_name, water_frequency_days, next_watering_date, email_notifications, last_reminder_sent_at, public_water_token, users(email)')
    .lte('next_watering_date', today)
    .or(`last_reminder_sent_at.is.null,last_reminder_sent_at.neq.${today}`);

  if (error) throw error;

  for (const plant of duePlants || []) {
    await supabase.from('notifications').insert({
      user_id: plant.user_id,
      type: 'WATERING',
      message: `${plant.plant_name} is due for watering today.`,
      link: '/my-plants',
    });

    if (plant.email_notifications) {
      await sendEmail({
        email: plant.users?.email,
        plantName: plant.plant_name,
        markUrl: `${SUPABASE_URL}/functions/v1/watering-reminders?token=${plant.public_water_token}`,
      });
    }

    await supabase
      .from('user_plants')
      .update({ last_reminder_sent_at: today })
      .eq('id', plant.id);
  }

  return duePlants?.length || 0;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (req.method === 'GET' && token) {
      const { data, error } = await supabase.rpc('mark_plant_watered_by_token', { token });
      if (error) throw error;

      const updated = data?.[0];
      if (!updated) {
        return htmlResponse('<h1>Reminder link not found.</h1><p>This plant may already be updated.</p>', 404);
      }

      return htmlResponse(`<h1>${updated.plant_name} is marked as watered.</h1><p>Next watering: ${updated.next_watering_date}</p><p><a href="${APP_URL}/my-plants">View care calendar</a></p>`);
    }

    const authHeader = req.headers.get('authorization') || '';
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processed = await processDueReminders();
    return new Response(JSON.stringify({ success: true, processed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
