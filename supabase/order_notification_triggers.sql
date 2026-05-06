-- ============================================
-- CHLORO Order Notification Triggers
-- Run after the orders schema and existing notifications table are ready.
-- ============================================

-- Admin-only helper used by the dashboard broadcast form.
CREATE OR REPLACE FUNCTION public.broadcast_notification(
    p_type TEXT,
    p_message TEXT,
    p_link TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can broadcast notifications.';
    END IF;

    INSERT INTO public.notifications (user_id, type, message, link)
    SELECT
        users.id,
        p_type,
        p_message,
        p_link
    FROM public.users;
END;
$$;

-- Notify every admin when a customer places an order.
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, message, link)
    SELECT
        users.id,
        'SYSTEM',
        'New order from ' || NEW.customer_name || ' for NPR ' || NEW.total_amount::TEXT,
        '/archive'
    FROM public.users
    WHERE users.role = 'ADMIN';

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_admins_on_new_order ON public.orders;
CREATE TRIGGER notify_admins_on_new_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_on_new_order();

-- Notify the customer when an admin changes delivery status.
CREATE OR REPLACE FUNCTION public.notify_customer_on_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, type, message, link)
        VALUES (
            NEW.user_id,
            'SYSTEM',
            'Order update: your order is now ' || NEW.status::TEXT || '.',
            '/dashboard'
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_customer_on_order_status_change ON public.orders;
CREATE TRIGGER notify_customer_on_order_status_change
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_customer_on_order_status_change();
