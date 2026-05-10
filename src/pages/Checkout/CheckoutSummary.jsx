import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../supabase';
import { initiateEsewaPayment, initiateKhaltiPayment, generateTransactionId, getBaseUrl } from '../../lib/paymentUtils';

const paymentLabels = {
  card: { text: 'Pay Securely', color: '#1A1A1A' },
  esewa: { text: 'Proceed to eSewa', color: '#60BB46' },
  khalti: { text: 'Proceed to Khalti', color: '#5C2D91' },
  cod: { text: 'Complete Order', color: '#2F4F4F' }
};

const formatAddress = (address) => {
  return [address?.addressLine, address?.city, address?.postalCode]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ');
};

const getInputValue = (selector) => document.querySelector(selector)?.value?.trim() || '';

const mergeVisibleCheckoutValues = (checkoutDetails) => ({
  ...checkoutDetails,
  email: checkoutDetails.email?.trim() || getInputValue('input[autocomplete="email"]'),
  phone: checkoutDetails.phone?.trim() || getInputValue('input[autocomplete="tel"]'),
  firstName: checkoutDetails.firstName?.trim() || getInputValue('input[autocomplete="given-name"]'),
  lastName: checkoutDetails.lastName?.trim() || getInputValue('input[autocomplete="family-name"]'),
  shippingAddress: {
    ...checkoutDetails.shippingAddress,
    addressLine: checkoutDetails.shippingAddress?.addressLine?.trim() || getInputValue('input[autocomplete="shipping street-address"]'),
    city: checkoutDetails.shippingAddress?.city?.trim() || getInputValue('input[autocomplete="shipping address-level2"]'),
    country: checkoutDetails.shippingAddress?.country?.trim() || getInputValue('input[autocomplete="shipping country-name"]'),
    postalCode: checkoutDetails.shippingAddress?.postalCode?.trim() || getInputValue('input[autocomplete="shipping postal-code"]'),
  },
  billingAddress: {
    ...checkoutDetails.billingAddress,
    addressLine: checkoutDetails.billingAddress?.addressLine?.trim() || getInputValue('input[autocomplete="billing street-address"]'),
    city: checkoutDetails.billingAddress?.city?.trim() || getInputValue('input[autocomplete="billing address-level2"]'),
    country: checkoutDetails.billingAddress?.country?.trim() || getInputValue('input[autocomplete="billing country-name"]'),
    postalCode: checkoutDetails.billingAddress?.postalCode?.trim() || getInputValue('input[autocomplete="billing postal-code"]'),
  },
});

const createOrderWithConsentFallback = async (payload) => {
  const insertOrder = async (orderPayload) => supabase
    .from('orders')
    .insert(orderPayload)
    .select('id')
    .single();

  const { data, error } = await insertOrder(payload);
  if (!error) return { data, error };

  const message = String(error.message || '').toLowerCase();
  if (!message.includes('email_order_updates') && !message.includes('marketing_opt_in')) {
    return { data, error };
  }

  const compatiblePayload = { ...payload };
  delete compatiblePayload.email_order_updates;
  delete compatiblePayload.marketing_opt_in;
  return insertOrder(compatiblePayload);
};

const sendOrderEmailNotification = async ({ orderId, enabled }) => {
  if (!enabled) return;

  const { error } = await supabase.functions.invoke('order-email-notifications', {
    body: { orderId },
  });

  if (error) {
    console.warn('Order email notification was not sent:', error.message);
  }
};

const CheckoutSummary = ({ paymentMethod, checkoutDetails }) => {
  const navigate = useNavigate();
  const { cartItems, clearBag } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 500.00; // Editorial Rate
  const total = subtotal + shipping;

  const handlePayment = async () => {
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'card') {
      setError('Card payments are not fully integrated yet. Please use eSewa, Khalti, or COD.');
      return;
    }

    const visibleCheckoutDetails = mergeVisibleCheckoutValues(checkoutDetails);

    const customerName = `${visibleCheckoutDetails.firstName || ''} ${visibleCheckoutDetails.lastName || ''}`.trim()
      || user?.user_metadata?.full_name
      || user?.email?.split('@')?.[0]
      || 'Customer';
    const customerEmail = visibleCheckoutDetails.email?.trim() || user?.email || '';
    const customerPhone = visibleCheckoutDetails.phone?.trim();
    const shippingAddress = formatAddress(visibleCheckoutDetails.shippingAddress);

    if (!customerEmail || !customerPhone || !visibleCheckoutDetails.shippingAddress?.addressLine || !visibleCheckoutDetails.shippingAddress?.city) {
      setError('Please complete your email, phone, and shipping address.');
      return;
    }

    setProcessing(true);

    const transactionId = generateTransactionId();
    const baseUrl = getBaseUrl();

    try {
      const { data: order, error: orderError } = await createOrderWithConsentFallback({
        user_id: user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        total_amount: total,
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: 'pending',
        payment_reference: transactionId,
        email_order_updates: Boolean(visibleCheckoutDetails.emailOrderUpdates),
        marketing_opt_in: Boolean(visibleCheckoutDetails.marketingEmails),
      });

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: item.price,
        product_name: item.name,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      await sendOrderEmailNotification({
        orderId: order.id,
        enabled: visibleCheckoutDetails.emailOrderUpdates,
      });

      if (paymentMethod === 'esewa') {
        initiateEsewaPayment({
          totalAmount: total,
          amount: subtotal,
          taxAmount: 0,
          serviceCharge: 0,
          deliveryCharge: shipping,
          transactionUuid: transactionId,
          successUrl: `${baseUrl}/payment/success?order_id=${order.id}`,
          failureUrl: `${baseUrl}/payment/failure`,
        });
      } else if (paymentMethod === 'khalti') {
        try {
          const result = await initiateKhaltiPayment({
            amount: total * 100, // Convert to paisa
            purchaseOrderId: transactionId,
            purchaseOrderName: `Petals & Pots Order ${transactionId}`,
            returnUrl: `${baseUrl}/payment/success?order_id=${order.id}`,
            websiteUrl: baseUrl,
          });

          if (result.payment_url) {
            window.location.href = result.payment_url;
          } else {
            throw new Error('No payment URL returned');
          }
        } catch (khaltiErr) {
          console.error('Khalti error:', khaltiErr);
          setError('Khalti payment initiation failed. Ensure proxy is running.');
          setProcessing(false);
        }
      } else if (paymentMethod === 'cod') {
        await clearBag();
        navigate(`/payment/success?method=cod&order_id=${order.id}&ref=${transactionId}&amount=${total}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const currentPayment = paymentLabels[paymentMethod] || { text: 'Select Payment Method', color: '#B0B0A8' };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white p-8 lg:p-14 border border-[#B0B0A8]/20 shadow-sm w-full lg:sticky lg:top-[120px]"
    >
      <h3 className="font-label text-[10px] tracking-[0.2em] uppercase text-[#4A4A4A] font-bold mb-10">
        Your Order
      </h3>

      <div className="flex flex-col gap-6 mb-10 border-b border-[#B0B0A8]/20 pb-8">
        {cartItems.length === 0 ? (
          <p className="font-body text-[14px] text-[#6B6B6B] italic">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 items-start">
              <div className="w-[72px] h-[92px] bg-[#EDEBE4] shrink-0 overflow-hidden p-1.5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1 pt-1 justify-between h-full min-h-[92px]">
                <div>
                  <h4 className="font-headline text-[17px] text-[#1A1A1A] leading-snug w-[120px]">
                    {item.name}
                  </h4>
                  <p className="font-label text-[7px] tracking-[0.15em] uppercase text-[#6B6B6B] mt-2 max-w-[100px] leading-relaxed">
                    {item.variant} x {item.quantity}
                  </p>
                </div>
                <p className="font-headline text-[15px] text-[#1A1A1A] tracking-tight mt-auto">
                  NPR {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-5 mb-10 border-b border-[#B0B0A8]/20 pb-10">
        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Subtotal</span>
          <span className="text-[#1A1A1A]">NPR {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold leading-tight">
          <span>Shipping <span className="text-[#6B6B6B]/70 capitalize tracking-normal text-[10px] font-medium ml-1">(Editorial Rate)</span></span>
          <span className="text-[#1A1A1A]">NPR {shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Taxes</span>
          <span className="text-[#1A1A1A]">NPR 0.00</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-10">
        <span className="font-headline text-[22px] italic text-[#4A4A4A] leading-tight flex-shrink-0">
          Total
        </span>
        <span className="font-headline text-[24px] lg:text-[28px] italic leading-none text-[#1A1A1A]">
          NPR {total.toFixed(2)}
        </span>
      </div>

      {error && (
        <Motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF2F2] border-l-2 border-[#D94F4F] py-3.5 px-4 flex items-center gap-3 mb-6"
        >
          <span className="material-symbols-outlined text-[#D94F4F] text-[15px] opacity-80">error</span>
          <p className="font-label text-[9px] tracking-[0.05em] text-[#9F403D] font-medium leading-snug pt-[1px]">
            {error}
          </p>
        </Motion.div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing || cartItems.length === 0}
        className="w-full py-5 px-6 font-label text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        style={{ backgroundColor: processing ? '#B0B0A8' : currentPayment.color }}
      >
        {processing ? 'PROCESSING...' : currentPayment.text}
      </button>

      <p className="font-label text-[7px] tracking-[0.15em] uppercase text-[#6B6B6B] text-center w-full">
        {paymentMethod === 'esewa' && 'SECURE TRANSACTION VIA ESEWA'}
        {paymentMethod === 'khalti' && 'SECURE TRANSACTION VIA KHALTI'}
        {paymentMethod === 'cod' && 'PAY ON DELIVERY - NO ADVANCE REQUIRED'}
        {paymentMethod === 'card' && 'SECURE ENCRYPTED TRANSACTION BY STRIPE'}
      </p>
    </Motion.div>
  );
};

export default CheckoutSummary;
