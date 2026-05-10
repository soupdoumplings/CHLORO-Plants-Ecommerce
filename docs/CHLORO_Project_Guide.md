# CHLORO Project Guide

## Project Overview

CHLORO is a luxury botanical ecommerce and plant-care web application. It combines a fashion-house visual language with practical plant shopping, saved customer profiles, wishlist, checkout, admin inventory, sales promotions, order management, AI plant diagnosis, and a compact botanical chatbot.

The project is designed for a school assignment and a free-tier student setup. It avoids paid-only payment processing, avoids paid SMS setup by default, and keeps AI usage inside a single Supabase Edge Function so quota errors can be handled cleanly.

## Technology Stack

- React 19 is used for the frontend because the project needs reusable UI components, stateful flows, and fast page transitions.
- Vite is used for local development and production builds because it is lightweight and quick.
- Tailwind utility classes are used for the visual system, spacing, responsive layouts, and animation-friendly styling.
- Framer Motion is used for page fades, card reveals, hover movement, and elegant transitions.
- Supabase is used for authentication, database tables, row-level security, storage-compatible product images, and Edge Functions.
- Gemini is called through `supabase/functions/gemini-ai`, not directly from the browser. This keeps the API key off the client.
- Local SQL files in `supabase/` act as reproducible setup patches for schema, orders, promotions, reminders, notifications, and product seeding.

## Customer Flow

1. A visitor lands on the CHLORO storefront and can browse the home page, catalogue, seasonal discovery, products, gifts, and care tools.
2. A customer creates an account or signs in.
3. The customer completes profile onboarding and saves phone, address, city, country, and plant preferences.
4. The customer adds products to wishlist or bag.
5. Checkout creates an order, inserts order items, stores billing details, and optionally sends an order email notification.
6. The customer can return to the dashboard to view details, preferences, recommendations, recent orders, and wishlist.
7. AI diagnosis can analyze plant images and recommend existing CHLORO care products from the database.

## Admin Flow

1. Admin users are detected from `public.users.role = 'ADMIN'`.
2. Admins are redirected away from the customer dashboard into `/archive`.
3. The admin dashboard shows revenue metrics, customer orders, stock overview, inventory, and system logs.
4. Admins can update order status and payment status.
5. Admins can manage inventory through add/edit product pages.
6. Admins can schedule sales through `/admin/promotions`.
7. Promotions update the product's `is_on_sale`, `sale_price`, and `sale_ends_at` fields so the customer catalogue, cart, and product pages show discounted pricing.

## Authentication

The main sign-in method is email and password through Supabase Auth. Google OAuth is also wired through Supabase.

Forgot password uses Supabase recovery OTP:

- The app calls `resetPasswordForEmail`.
- The email template must use `{{ .Token }}` so the user receives a 6-digit code instead of a reset link.
- The app verifies the code with `verifyOtp({ type: 'recovery' })`.
- After verification, the user sets a new password.

Phone numbers are saved in profile and checkout. Phone OTP login uses Supabase SMS OTP, but Supabase requires an SMS provider for real delivery. For the free-tier demo, use password login and demonstrate phone as saved profile/checkout data unless an SMS provider is intentionally configured.

## Database Features

Important tables:

- `public.users`: role, name, email, phone, address fields, and preferences.
- `public.user_profiles`: richer profile and onboarding details.
- `public.billing_details`: saved checkout details.
- `public.products`: catalogue products, care tools, gifts, sale fields, stock, tags, and images.
- `public.cart_items`: saved customer cart.
- `public.wishlist`: saved customer wishlist.
- `public.orders`: customer order header, status, payment status, customer contact, shipping address, and totals.
- `public.order_items`: products inside an order.
- `public.payments`: optional payment tracking for finance metrics.
- `public.promotions`: scheduled sales.
- `public.notifications`: in-app notification rows.
- `public.user_plants`: watering reminder plants.

Important SQL files:

- `supabase/customer_commerce_schema.sql`: customer profiles, billing, wishlist, payments, and commerce compatibility.
- `supabase/checkout_orders_compat_patch.sql`: makes old order tables compatible with current checkout inserts.
- `supabase/admin_orders_visibility_patch.sql`: lets admins view orders safely when RLS blocks direct reads.
- `supabase/sales_promotions_schema.sql`: adds promotions and sale fields.
- `supabase/product_catalogue_seed.sql`: inserts 15 extra products across plants, care tools, and gifts.
- `supabase/password_reset_otp_template.html`: Supabase email template for recovery OTP.

## SQL Dump Audit

The dumped `chloro_backup.sql` confirms that the project database includes products, orders, order items, users, wishlist, user profiles, promotions, reviews, watering reminders, and Supabase auth internals.

The main issue found in the dump is order visibility for admins:

- The backup policies show `Users can view own orders`.
- That means customers can see their orders, but admins may see an empty order queue.
- The project includes `supabase/admin_orders_visibility_patch.sql` to fix this with admin-aware RLS policies and a secure `admin_order_queue()` RPC fallback.

Do not commit full database dumps. They can contain auth records, emails, metadata, and private operational data.

## AI Diagnosis

AI diagnosis runs through the Supabase Edge Function at `supabase/functions/gemini-ai`.

The browser sends:

- image data,
- optional user notes,
- mode: `diagnosis`.

The Edge Function:

- loads active products from Supabase using the service role key,
- ranks care tools and diagnosis-related products higher,
- sends the image and product list to Gemini,
- requests structured JSON,
- validates product IDs so the model cannot invent products,
- returns diagnosis summary, likely problems, care plan, Nepal-specific notes, prevention, and matching product recommendations.

Care tools are connected to AI through product tags and categories such as `Care Tools`, `ai-diagnosis`, `watering`, `neem`, `soil`, `pruning`, and `fungal-care`.

## Chatbot

The botanical chatbot is a compact floating concierge. It can answer about plant care, gifts, products, checkout, and general customer support.

It uses the same Gemini Edge Function in `chat` mode. It does not expose the Gemini API key in the browser. The widget is hidden on admin/auth pages so it does not crowd sensitive workflows.

## Sales And Promotions

Admins can open `/admin/promotions`, choose a product, enter a discount percentage, and set start/end times.

When a sale is active:

- the `promotions` row records the schedule,
- the product row stores `is_on_sale = true`,
- the product row stores the calculated `sale_price`,
- customer catalogue and cart use the sale price through `src/lib/pricing.js`.

If the sale is scheduled for the future, it remains in the promotions table. The lightweight school implementation does not require a paid scheduler. Admins can end a sale manually.

## Orders

Checkout creates:

- an `orders` row,
- one `order_items` row per cart item,
- optionally a `payments` row,
- optional email notification through the order email Edge Function.

Admin order display reads `orders` with nested `order_items`. If direct RLS reading returns nothing, the code calls `admin_order_queue()`. If admin still cannot see orders, run `supabase/admin_orders_visibility_patch.sql` in the Supabase SQL Editor.

## Notifications And Email

Order email notification is handled by `supabase/functions/order-email-notifications`.

The free-tier-safe recommendation is:

- keep email notifications optional through the checkout consent checkbox,
- avoid SMS unless a provider is intentionally configured,
- avoid paid email providers unless the project owner chooses one.

Supabase Auth emails can handle password recovery OTP without adding a paid email service for the school demo.

## Free-Tier Safety

This project is designed to avoid surprise costs:

- No paid SMS provider is configured by code.
- Card payments are not fully integrated; COD is the safest demo option.
- eSewa/Khalti are represented as demo/proxy flows and should not be treated as production payment settlement.
- Gemini calls are handled through one Edge Function and show quota errors if the free quota is exhausted.
- Product images in the seed use local/public paths instead of uploading paid storage assets.
- Database dumps should remain local and uncommitted.

## UI Direction

The visual direction is elegant botanical luxury:

- serif display headlines,
- restrained neutral backgrounds,
- deep green and antique gold accents,
- editorial image blocks,
- thin borders,
- soft reveal animations,
- image hover zoom,
- minimal admin controls that still remain readable.

The customer dashboard is split into:

- My Details,
- My Preferences,
- Orders & Wishlist.

This keeps the customer experience calm while still supporting practical ecommerce tasks.

## Demo Checklist

1. Sign in as a normal customer.
2. Save profile and phone/address details.
3. Add a product to wishlist.
4. Add a product to bag and checkout with COD.
5. Visit dashboard and show orders/wishlist.
6. Sign in as admin.
7. Open `/archive` and show metrics, order queue, stock overview, and inventory.
8. Open `/admin/promotions`, schedule a sale, and confirm sale price appears in the shop.
9. Open AI diagnosis, upload a plant image, and show diagnosis plus recommended care tools.
10. Open products & gifts and filter by Plants, Care, and Gifts.

## Final Setup Notes

Run these SQL files in Supabase SQL Editor if the matching feature is missing:

1. `supabase/customer_commerce_schema.sql`
2. `supabase/checkout_orders_compat_patch.sql`
3. `supabase/admin_orders_visibility_patch.sql`
4. `supabase/sales_promotions_schema.sql`
5. `supabase/product_catalogue_seed.sql`

For password reset OTP, update the Supabase Auth recovery email template to show `{{ .Token }}`.

For AI, set these Supabase Edge Function secrets:

- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Keep the service role key only in Supabase secrets. Never put it in frontend `.env` files.
