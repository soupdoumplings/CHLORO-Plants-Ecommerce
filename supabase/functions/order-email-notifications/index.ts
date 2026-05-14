// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const EMAIL_PROVIDER = (Deno.env.get('EMAIL_PROVIDER') || 'gmail').toLowerCase();
const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET');
const GMAIL_REFRESH_TOKEN = Deno.env.get('GMAIL_REFRESH_TOKEN');
const GMAIL_FROM = Deno.env.get('GMAIL_FROM') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Chloro <notifications@chloro-plants.com>';
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

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

const getSignedInUser = async (authHeader) => {
  if (!authHeader || !SUPABASE_ANON_KEY) return null;

  const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await supabaseUser.auth.getUser();

  if (error) throw error;
  return data.user;
};

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
  const message = [
    ...(GMAIL_FROM ? [`From: ${GMAIL_FROM}`] : []),
    `To: ${email}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\r\n');

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
    throw new Error(payload.error?.message || 'Gmail order email failed to send.');
  }
};

const sendResend = async ({ email, subject, html }) => {
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY for email fallback.');

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
    throw new Error(payload.message || payload.error || 'Resend order email failed to send.');
  }
};

const sendEmail = async ({ email, subject, html }) => {
  if (EMAIL_PROVIDER === 'resend') {
    await sendResend({ email, subject, html });
    return 'resend';
  }

  try {
    await sendGmail({ email, subject, html });
    return 'gmail';
  } catch (error) {
    if (!RESEND_API_KEY) throw error;
    console.error('Gmail send failed; falling back to Resend:', error.message);
    await sendResend({ email, subject, html });
    return 'resend';
  }
};

const buildOrderEmail = ({ order, items }) => {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ece8dd;">${escapeHtml(item.product_name || 'Plant')}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ece8dd;text-align:center;">${Number(item.quantity || 1)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ece8dd;text-align:right;">${money(Number(item.price_at_time || 0) * Number(item.quantity || 1))}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Georgia, serif; color:#1a1a1a; max-width:640px; margin:0 auto; background:#fbf9f4; padding:28px;">
      <p style="font-family:Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;font-size:11px;color:#0f3a3a;">CHLORO Order Update</p>
      <h1 style="font-weight:400;font-size:32px;margin:12px 0;">Your order is confirmed.</h1>
      <p style="line-height:1.7;color:#5e6058;">Hi ${escapeHtml(order.customer_name || 'there')}, we received your order and will notify you as it moves through fulfillment.</p>
      <div style="background:white;border:1px solid #e5e1d7;padding:22px;margin:24px 0;">
        <p style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b6b6b;">Order</p>
        <p style="font-size:18px;margin:8px 0 0;">${escapeHtml(order.id)}</p>
        <p style="margin:8px 0 0;color:#5e6058;">Total: <strong>${money(order.total_amount)}</strong></p>
        <p style="margin:8px 0 0;color:#5e6058;">Payment: ${escapeHtml(order.payment_method)} / ${escapeHtml(order.payment_status)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:white;border:1px solid #e5e1d7;padding:12px;">
        <thead>
          <tr>
            <th style="padding:10px 0;text-align:left;">Item</th>
            <th style="padding:10px 0;text-align:center;">Qty</th>
            <th style="padding:10px 0;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="margin:26px 0;">
        <a href="${APP_URL}/orders" style="background:#0f3a3a;color:#fbf9f4;padding:12px 18px;text-decoration:none;display:inline-block;">View orders</a>
      </p>
      <p style="font-size:12px;line-height:1.6;color:#777;">You received this because you asked CHLORO to email order updates. Plant care reminders are controlled separately per plant.</p>
    </div>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization') || '';
    const user = await getSignedInUser(authHeader);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'orderId is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    if (order.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('product_name, quantity, price_at_time')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    const subject = `CHLORO order confirmed - ${String(order.id).slice(0, 8)}`;
    const html = buildOrderEmail({ order, items: items || [] });
    const provider = await sendEmail({ email: order.customer_email, subject, html });

    return new Response(JSON.stringify({ success: true, provider }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Order email failed.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
