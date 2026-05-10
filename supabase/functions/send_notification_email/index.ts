// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const EMAIL_PROVIDER = (Deno.env.get('EMAIL_PROVIDER') || 'gmail').toLowerCase();
const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET');
const GMAIL_REFRESH_TOKEN = Deno.env.get('GMAIL_REFRESH_TOKEN');
const GMAIL_FROM = Deno.env.get('GMAIL_FROM') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Chloro <notifications@chloro-plants.com>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Resend notification failed to send.');
  }

  return payload;
};

const sendEmail = async ({ email, subject, html }) => {
  if (EMAIL_PROVIDER === 'resend') {
    return sendResend({ email, subject, html });
  }

  try {
    await sendGmail({ email, subject, html });
    return { provider: 'gmail' };
  } catch (error) {
    if (!RESEND_API_KEY) throw error;
    console.error('Gmail send failed; falling back to Resend:', error.message);
    return sendResend({ email, subject, html });
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, subject, html } = await req.json();

    if (!email || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'email, subject, and html are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await sendEmail({ email, subject, html });

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
