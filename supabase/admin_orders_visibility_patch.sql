-- CHLORO admin order visibility patch.
-- Run this in Supabase SQL Editor if customers can see orders but the admin dashboard cannot.

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

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and admins can view orders" ON public.orders;
CREATE POLICY "Users and admins can view orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin())
    WITH CHECK (public.is_admin());

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

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);

CREATE OR REPLACE FUNCTION public.admin_order_queue()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    shipping_address TEXT,
    total_amount NUMERIC,
    status TEXT,
    payment_method TEXT,
    payment_status TEXT,
    payment_reference TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    order_items JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can read the fulfillment queue.';
    END IF;

    RETURN QUERY
    SELECT
        orders.id,
        orders.user_id,
        orders.customer_name,
        orders.customer_phone,
        orders.customer_email,
        orders.shipping_address,
        orders.total_amount,
        orders.status::TEXT,
        orders.payment_method,
        orders.payment_status,
        orders.payment_reference,
        orders.created_at,
        orders.updated_at,
        COALESCE(
            JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'id', order_items.id,
                    'order_id', order_items.order_id,
                    'product_id', order_items.product_id,
                    'quantity', order_items.quantity,
                    'price_at_time', order_items.price_at_time,
                    'product_name', order_items.product_name,
                    'created_at', order_items.created_at
                )
            ) FILTER (WHERE order_items.id IS NOT NULL),
            '[]'::JSONB
        ) AS order_items
    FROM public.orders
    LEFT JOIN public.order_items ON order_items.order_id = orders.id
    GROUP BY orders.id
    ORDER BY orders.created_at DESC
    LIMIT 100;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_order_queue() TO authenticated;

NOTIFY pgrst, 'reload schema';
