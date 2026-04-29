import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import { initiateEsewaPayment, initiateKhaltiPayment, generateTransactionId, getBaseUrl } from '../../lib/paymentUtils';

const SHIPPING_RATE = 120;

const CheckoutSummary = ({ paymentMethod, shippingData }) => {
  const { cartItems, loading, clearBag } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? SHIPPING_RATE : 0;
  const total = subtotal + shipping;

  const paymentLabels = {
    esewa: { text: 'Pay with eSewa', color: '#60BB46' },
    khalti: { text: 'Pay with Khalti', color: '#5C2D91' },
    cod: { text: 'Place Order (COD)', color: '#2F4F4F' },
  };

  const validateShipping = () => {
    if (!shippingData.firstName || !shippingData.lastName) {
      setError('Please enter your full name.');
      return false;
    }
    if (!shippingData.address) {
      setError('Please enter your shipping address.');
      return false;
    }
    if (!shippingData.city) {
      setError('Please enter your city.');
      return false;
    }
    if (!shippingData.phone) {
      setError('Please enter your phone number.');
      return false;
    }
    return true;
  };

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

    if (!validateShipping()) return;

    setProcessing(true);

    const transactionId = generateTransactionId();
    const baseUrl = getBaseUrl();

    try {
      if (paymentMethod === 'esewa') {
        initiateEsewaPayment({
          totalAmount: total,
          amount: subtotal,
          taxAmount: 0,
          serviceCharge: 0,
          deliveryCharge: shipping,
          transactionUuid: transactionId,
          successUrl: `${baseUrl}/payment/success`,
          failureUrl: `${baseUrl}/payment/failure`,
        });
        // Form POST will redirect — no need to do anything else
      } else if (paymentMethod === 'khalti') {
        try {
          const result = await initiateKhaltiPayment({
            amount: total * 100, // Convert to paisa
            purchaseOrderId: transactionId,
            purchaseOrderName: `Petals & Pots Order ${transactionId}`,
            returnUrl: `${baseUrl}/payment/success`,
            websiteUrl: baseUrl,
          });

          if (result.payment_url) {
            window.location.href = result.payment_url;
          } else {
            throw new Error('No payment URL returned');
          }
        } catch (khaltiErr) {
          console.error('Khalti error:', khaltiErr);
          setError('Khalti payment initiation failed. This may be due to CORS in sandbox mode. In production, this call goes through your backend.');
          setProcessing(false);
        }
      } else if (paymentMethod === 'cod') {
        // Cash on delivery — just place the order
        await clearBag();
        navigate(`/payment/success?method=cod&order_id=${transactionId}&amount=${total}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const currentPayment = paymentLabels[paymentMethod] || { text: 'Select Payment Method', color: '#B0B0A8' };

  if (loading) {
    return (
      <div className="bg-white p-8 lg:p-14 border border-[#B0B0A8]/20 shadow-sm w-full lg:sticky lg:top-[120px]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#EDEBE4] rounded w-1/3"></div>
          <div className="h-20 bg-[#EDEBE4] rounded"></div>
          <div className="h-20 bg-[#EDEBE4] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white p-8 lg:p-14 border border-[#B0B0A8]/20 shadow-sm w-full lg:sticky lg:top-[120px]"
    >
      <h3 className="font-label text-[10px] tracking-[0.2em] uppercase text-[#4A4A4A] font-bold mb-10">
        Your Order
      </h3>

      {/* Cart Items */}
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
                    {item.variant} × {item.quantity}
                  </p>
                </div>
                <p className="font-headline text-[15px] text-[#1A1A1A] tracking-tight mt-auto">
                  रू {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="space-y-5 mb-10 border-b border-[#B0B0A8]/20 pb-10">
        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Subtotal</span>
          <span className="text-[#1A1A1A]">रू {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold leading-tight">
          <span>Shipping <span className="text-[#6B6B6B]/70 capitalize tracking-normal text-[10px] font-medium ml-1">(Standard)</span></span>
          <span className="text-[#1A1A1A]">रू {shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Taxes</span>
          <span className="text-[#1A1A1A]">रू 0.00</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-end mb-10">
        <span className="font-headline text-[22px] italic text-[#4A4A4A] leading-tight flex-shrink-0">
          Total
        </span>
        <span className="font-headline text-[24px] lg:text-[28px] italic leading-none text-[#1A1A1A]">
          रू {total.toFixed(2)}
        </span>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF2F2] border-l-2 border-[#D94F4F] py-3.5 px-4 flex items-center gap-3 mb-6"
        >
          <span className="material-symbols-outlined text-[#D94F4F] text-[15px] opacity-80">error</span>
          <p className="font-label text-[9px] tracking-[0.05em] text-[#9F403D] font-medium leading-snug pt-[1px]">
            {error}
          </p>
        </motion.div>
      )}

      {/* Pay Button */}
      <button 
        onClick={handlePayment}
        disabled={processing || cartItems.length === 0}
        className="w-full py-5 px-6 font-label text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        style={{ 
          backgroundColor: processing ? '#B0B0A8' : currentPayment.color,
        }}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          currentPayment.text
        )}
      </button>

      {/* Security note */}
      <p className="font-label text-[7px] tracking-[0.15em] uppercase text-[#6B6B6B] text-center w-full">
        {paymentMethod === 'esewa' && 'SECURE TRANSACTION VIA ESEWA'}
        {paymentMethod === 'khalti' && 'SECURE TRANSACTION VIA KHALTI'}
        {paymentMethod === 'cod' && 'PAY ON DELIVERY — NO ADVANCE REQUIRED'}
        {!paymentMethod && 'SELECT A PAYMENT METHOD TO PROCEED'}
      </p>
    </motion.div>
  );
};

export default CheckoutSummary;
