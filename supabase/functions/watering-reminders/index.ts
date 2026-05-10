// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const EMAIL_PROVIDER = (Deno.env.get('EMAIL_PROVIDER') || 'gmail').toLowerCase();
const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET');
const GMAIL_REFRESH_TOKEN = Deno.env.get('GMAIL_REFRESH_TOKEN');
const GMAIL_FROM = Deno.env.get('GMAIL_FROM') || '';
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

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const base64Encode = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const base64UrlEncode = (value: string) => (
  base64Encode(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
);

const encodeSubject = (value: string) => `=?UTF-8?B?${base64Encode(value)}?=`;

const getGmailAccessToken = async () => {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error('Missing Gmail secrets. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || 'Could not refresh Gmail access token.');
  }

  return payload.access_token;
};

const sendGmail = async ({ email, subject, html }) => {
  const accessToken = await getGmailAccessToken();
  const headers = [
    ...(GMAIL_FROM ? [`From: ${GMAIL_FROM}`] : []),
    `To: ${email}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ];
  const message = headers.join('\r\n');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ raw: base64UrlEncode(message) }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error?.message || 'Gmail notification failed to send.');
  }
};

const sendResend = async ({ email, subject, html }) => {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY for email notifications.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || payload.error || 'Resend notification failed to send.');
  }
};

const sendEmail = async ({ email, plantName, markUrl }) => {
  if (!email) return;

  const safePlantName = escapeHtml(plantName);
  const safeMarkUrl = escapeHtml(markUrl);
  const subject = `${plantName} needs watering today`;
  const html = `
    <div style="font-family: Georgia, serif; color:#1a1a1a;">
      <h1 style="font-weight:400;">Time to water ${safePlantName}</h1>
      <p>Your CHLORO care calendar says this plant is due today.</p>
      <p>
        <a href="${safeMarkUrl}" style="background:#0f3a3a;color:#fbf9f4;padding:12px 18px;text-decoration:none;display:inline-block;">
          Mark as watered
        </a>
      </p>
      <p style="font-size:12px;color:#666;">This link updates the schedule without opening the app.</p>
    </div>
  `;

  if (EMAIL_PROVIDER === 'resend') {
    await sendResend({ email, subject, html });
    return;
  }

  try {
    await sendGmail({ email, subject, html });
  } catch (error) {
    if (!RESEND_API_KEY) throw error;
    console.error('Gmail send failed; falling back to Resend:', error.message);
    await sendResend({ email, subject, html });
  }
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
