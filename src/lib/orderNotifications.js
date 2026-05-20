import { supabase } from '../supabase';

const getOrderEmailKey = (orderId) => `chloro_order_email_sent_${orderId}`;

const hasSentOrderEmail = (orderId) => {
  try {
    return window.sessionStorage.getItem(getOrderEmailKey(orderId)) === 'true';
  } catch {
    return false;
  }
};

const markOrderEmailSent = (orderId) => {
  try {
    window.sessionStorage.setItem(getOrderEmailKey(orderId), 'true');
  } catch {
    // Non-critical. The server call has already succeeded.
  }
};

export const sendOrderEmailNotification = async ({ orderId, enabled }) => {
  if (!enabled || !orderId || hasSentOrderEmail(orderId)) {
    return { success: false, skipped: true };
  }

  try {
    const { error } = await supabase.functions.invoke('order-email-notifications', {
      body: { orderId },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    markOrderEmailSent(orderId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Order email notification failed.' };
  }
};
