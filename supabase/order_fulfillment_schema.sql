-- ============================================
-- CHLORO Order & Delivery Schema
-- Paste this into Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Fulfillment Status Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_status') THEN
        CREATE TYPE fulfillment_status AS ENUM ('pending', 'processing', 'shipping', 'delivered', 'cancelled');
    END IF;
END $$;

-- 2. Admin helper for RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
          AND role = 'ADMIN'
    );
$$;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status fulfillment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_reference TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC(12, 2) NOT NULL,
    product_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 6. Helpful indexes
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);

-- 7. Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders, admins can view all orders
DROP POLICY IF EXISTS "Users and admins can view orders" ON public.orders;
CREATE POLICY "Users and admins can view orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Users can create their own orders
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update order status and notes
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Users can view their own order items, admins can view all order items
DROP POLICY IF EXISTS "Users and admins can view order items" ON public.order_items;
CREATE POLICY "Users and admins can view order items" ON public.order_items
    FOR SELECT USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1
            FROM public.orders
            WHERE orders.id = order_items.order_id
              AND orders.user_id = auth.uid()
        )
    );

-- Users can insert items for their own orders
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.orders
            WHERE orders.id = order_items.order_id
              AND orders.user_id = auth.uid()
        )
    );

