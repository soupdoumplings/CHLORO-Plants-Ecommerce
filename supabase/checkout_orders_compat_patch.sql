-- Compatibility patch for the existing CHLORO checkout tables.
-- Keeps old columns/data and adds the columns the current checkout UI inserts.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod',
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.orders
SET total_amount = COALESCE(total_amount, total, 0)
WHERE total_amount IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN total SET DEFAULT 0,
  ALTER COLUMN total_amount SET DEFAULT 0,
  ALTER COLUMN payment_method SET DEFAULT 'cod',
  ALTER COLUMN payment_status SET DEFAULT 'pending';

UPDATE public.orders
SET status = LOWER(status)
WHERE status IS NOT NULL;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'shipping', 'delivered', 'cancelled'));

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS price_at_time NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.order_items
SET price_at_time = COALESCE(price_at_time, price_at_purchase, 0)
WHERE price_at_time IS NULL;

ALTER TABLE public.order_items
  ALTER COLUMN price_at_purchase SET DEFAULT 0,
  ALTER COLUMN price_at_time SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);

NOTIFY pgrst, 'reload schema';
