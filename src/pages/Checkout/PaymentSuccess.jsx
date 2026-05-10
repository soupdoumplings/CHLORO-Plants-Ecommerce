import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { parseEsewaResponse } from '../../lib/paymentUtils';
import { markVoucherAsUsed, checkAndAwardVoucher } from '../../lib/voucherUtils';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearBag } = useCart();
  const { session } = useAuth();
  const [transactionData, setTransactionData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [hasCleared, setHasCleared] = useState(false);
  const [newVoucher, setNewVoucher] = useState(null);

  useEffect(() => {
    // Determine which payment gateway returned
    const esewaData = searchParams.get('data');
    const khaltiPidx = searchParams.get('pidx');
    const codOrderId = searchParams.get('order_id');
    const method = searchParams.get('method');

    if (esewaData) {
      const parsed = parseEsewaResponse(esewaData);
      if (parsed) {
        setTransactionData({
          transactionCode: parsed.transaction_code || parsed.transaction_uuid,
          amount: parsed.total_amount,
          status: parsed.status || 'COMPLETE',
          productCode: parsed.product_code,
        });
        setPaymentMethod('eSewa');
      }
    } else if (khaltiPidx) {
      setTransactionData({
        transactionCode: khaltiPidx,
        amount: searchParams.get('amount') || '—',
        status: searchParams.get('transaction_id') ? 'Completed' : 'Completed',
        productCode: searchParams.get('purchase_order_id') || '—',
      });
      setPaymentMethod('Khalti');
    } else if (method === 'cod' && codOrderId) {
      setTransactionData({
        transactionCode: codOrderId,
        amount: searchParams.get('amount') || '—',
        status: 'CONFIRMED',
        productCode: 'COD',
      });
      setPaymentMethod('Cash on Delivery');
    }

    // Process Voucher Logic
    const processVouchers = async () => {
      const appliedVoucherCode = searchParams.get('voucher_code');
      if (appliedVoucherCode) {
        await markVoucherAsUsed(appliedVoucherCode);
      }

      if (cartItems.length > 0) {
        const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        const awardedCode = await checkAndAwardVoucher(session?.user?.id, totalQty);
        if (awardedCode) {
          setNewVoucher(awardedCode);
        }
      }
    };

    // Clear the cart once
    if (!hasCleared) {
      processVouchers().then(() => {
        clearBag();
        setHasCleared(true);
      });
    }
  }, [searchParams, cartItems, session]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-20 mt-[82px] lg:mt-[100px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[560px] w-full text-center"
        >
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 mx-auto mb-10 rounded-full bg-[#2F4F4F] flex items-center justify-center"
          >
            <motion.svg 
              width="40" height="40" viewBox="0 0 40 40" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.path 
                d="M10 20L17 27L30 14" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              />
            </motion.svg>
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-label text-[9px] tracking-[0.2em] uppercase text-[#C5A059] font-medium mb-4"
          >
            Order Confirmed
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-headline text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-[#1A1A1A] mb-6"
          >
            Thank you for your curation.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="font-body text-[15px] text-[#6B6B6B] leading-relaxed mb-12 max-w-[420px] mx-auto"
          >
            Your order has been placed successfully{paymentMethod ? ` via ${paymentMethod}` : ''}. 
            You will receive a confirmation email shortly.
          </motion.p>

          {/* Transaction Details Card */}
          {transactionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="bg-white border border-[#B0B0A8]/20 p-8 mb-12 text-left shadow-sm"
            >
              <h3 className="font-label text-[9px] tracking-[0.2em] uppercase text-[#4A4A4A] font-bold mb-6">
                Transaction Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#B0B0A8]/10 pb-3">
                  <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[#6B6B6B] font-medium">Transaction ID</span>
                  <span className="font-body text-[13px] text-[#1A1A1A] font-medium">{transactionData.transactionCode}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#B0B0A8]/10 pb-3">
                  <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[#6B6B6B] font-medium">Amount</span>
                  <span className="font-headline text-[16px] text-[#1A1A1A]">रू {transactionData.amount}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#B0B0A8]/10 pb-3">
                  <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[#6B6B6B] font-medium">Status</span>
                  <span className="font-label text-[9px] tracking-[0.12em] uppercase bg-[#D2E7E4] text-[#2F4F4F] px-3 py-1.5 font-bold">
                    {transactionData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[#6B6B6B] font-medium">Payment Method</span>
                  <span className="font-body text-[13px] text-[#1A1A1A] font-medium">{paymentMethod}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* New Voucher Reward Card */}
          {newVoucher && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-[#F3F8F2] border border-[#60BB46]/30 p-8 mb-12 text-center shadow-sm relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-[#60BB46]/10 material-symbols-outlined" style={{ fontSize: '100px' }}>
                loyalty
              </div>
              <h3 className="font-headline text-[22px] text-[#2C5E1D] mb-2 relative z-10">
                You've earned a reward!
              </h3>
              <p className="font-body text-[#4A4A4A] text-[14px] mb-6 relative z-10">
                Congratulations on your growing collection! Here is a special voucher for your next purchase.
              </p>
              <div className="bg-white border-2 border-dashed border-[#60BB46] py-4 px-6 inline-block rounded-md relative z-10">
                <span className="font-label text-[14px] tracking-[0.2em] font-bold text-[#1A1A1A]">
                  {newVoucher}
                </span>
              </div>
              <p className="font-label text-[9px] tracking-[0.1em] uppercase text-[#6B6B6B] mt-4 relative z-10">
                Save it for your next order
              </p>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/discovery"
              className="bg-[#2F4F4F] text-white px-10 py-4 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A2F2F] transition-all duration-300 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 text-center"
            >
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default PaymentSuccess;
