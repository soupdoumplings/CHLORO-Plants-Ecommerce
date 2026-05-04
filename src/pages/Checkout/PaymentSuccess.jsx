import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';
import { parseEsewaResponse } from '../../lib/paymentUtils';

const fallbackValue = 'Pending';

const methodLabels = {
  cod: 'Cash on Delivery',
  esewa: 'eSewa',
  khalti: 'Khalti',
};

const formatAmount = (amount) => {
  if (amount === undefined || amount === null || amount === '' || amount === fallbackValue) {
    return fallbackValue;
  }

  const normalized = Number(String(amount).replace(/,/g, ''));
  if (Number.isNaN(normalized)) return String(amount);

  return `NPR ${normalized.toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getTransactionFromParams = (searchParams) => {
  const esewaData = searchParams.get('data');
  const khaltiPidx = searchParams.get('pidx');
  const codOrderId = searchParams.get('order_id');
  const method = searchParams.get('method');

  if (esewaData) {
    const parsed = parseEsewaResponse(esewaData);

    if (parsed) {
      return {
        method: methodLabels.esewa,
        transactionCode: parsed.transaction_code || parsed.transaction_uuid || fallbackValue,
        orderReference: parsed.transaction_uuid || parsed.product_code || fallbackValue,
        amount: parsed.total_amount || fallbackValue,
        status: parsed.status || 'Complete',
      };
    }
  }

  if (khaltiPidx) {
    const callbackAmount = searchParams.get('amount');
    const amountInNpr = callbackAmount ? Number(callbackAmount) / 100 : fallbackValue;

    return {
      method: methodLabels.khalti,
      transactionCode: searchParams.get('transaction_id') || khaltiPidx,
      orderReference: searchParams.get('purchase_order_id') || fallbackValue,
      amount: amountInNpr,
      status: searchParams.get('status') || 'Complete',
    };
  }

  if (method === 'cod' && codOrderId) {
    return {
      method: methodLabels.cod,
      transactionCode: codOrderId,
      orderReference: codOrderId,
      amount: searchParams.get('amount') || fallbackValue,
      status: 'Confirmed',
    };
  }

  return {
    method: 'Payment',
    transactionCode: fallbackValue,
    orderReference: fallbackValue,
    amount: fallbackValue,
    status: 'Confirmed',
  };
};

const detailRows = (transaction) => [
  ['Order Reference', transaction.orderReference],
  ['Transaction ID', transaction.transactionCode],
  ['Payment Method', transaction.method],
  ['Amount', formatAmount(transaction.amount)],
];

const timelineSteps = [
  {
    icon: 'inventory_2',
    title: 'Order received',
    copy: 'Your botanical selection has entered our fulfilment queue.',
  },
  {
    icon: 'local_florist',
    title: 'Specimen check',
    copy: 'Each item is inspected, cleaned, and packed for a safe handoff.',
  },
  {
    icon: 'local_shipping',
    title: 'Delivery update',
    copy: 'Tracking or delivery details will be shared once dispatch begins.',
  },
];

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearBag } = useCart();
  const [cartCleared, setCartCleared] = useState(false);
  const hasClearedCart = useRef(false);

  const transaction = useMemo(() => getTransactionFromParams(searchParams), [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const clearPurchasedItems = async () => {
      if (hasClearedCart.current) return;
      hasClearedCart.current = true;
      await clearBag();
      if (isMounted) setCartCleared(true);
    };

    clearPurchasedItems();

    return () => {
      isMounted = false;
    };
  }, [clearBag]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 lg:pt-24 pb-24 mt-[82px]">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white border border-[#B0B0A8]/20 shadow-sm px-6 py-8 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[640px]"
          >
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-20 h-20 bg-[#0F3A3A] text-[#FBF9F4] flex items-center justify-center mb-10 shadow-sm"
                aria-hidden="true"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.55 }}
                  className="material-symbols-outlined text-[38px]"
                >
                  check
                </motion.span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold mb-5"
              >
                Payment Successful
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-headline text-[clamp(2.5rem,7vw,5.75rem)] leading-[0.9] text-[#1A1A1A] mb-8 max-w-[760px]"
              >
                Your order is safely rooted.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.6 }}
                className="font-body text-[15px] sm:text-[16px] leading-relaxed text-[#5E6058] max-w-[560px] mb-10"
              >
                We have confirmed your order through {transaction.method}. A receipt and fulfilment
                update will be sent shortly, and your bag has been cleared for your next curation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#B0B0A8]/20 border border-[#B0B0A8]/20 mb-10"
              >
                {detailRows(transaction).map(([label, value]) => (
                  <div key={label} className="bg-[#FBF9F4] p-5 min-h-[96px] flex flex-col justify-between">
                    <span className="font-label text-[8px] tracking-[0.18em] uppercase text-[#6B6B6B] font-bold">
                      {label}
                    </span>
                    <span className="font-headline text-[20px] text-[#1A1A1A] leading-tight break-words">
                      {value}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/discovery"
                className="bg-[#0F3A3A] text-[#FBF9F4] px-7 py-4 font-label text-[10px] tracking-[0.18em] uppercase font-bold hover:bg-[#1A2F2F] transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard"
                className="border border-[#1A1A1A] text-[#1A1A1A] px-7 py-4 font-label text-[10px] tracking-[0.18em] uppercase font-bold hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                View Dashboard
              </Link>
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="relative min-h-[340px] lg:min-h-[430px] overflow-hidden bg-[#EDEBE4] border border-[#B0B0A8]/20">
              <img
                src="/orchid.jpg"
                alt="Botanical arrangement prepared for delivery"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-[#0F3A3A]/95 via-[#0F3A3A]/55 to-transparent">
                <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#C6E9E9] font-bold mb-2">
                  Receipt Status
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#C6E9E9] text-[#244545] px-3 py-1.5 font-label text-[9px] tracking-[0.14em] uppercase font-bold">
                    {transaction.status}
                  </span>
                  <span className="font-body text-[13px] text-[#FBF9F4]/80">
                    {cartCleared ? 'Bag cleared' : 'Finalising receipt'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F3F1EA] border border-[#B0B0A8]/20 p-6 sm:p-8">
              <h2 className="font-headline text-[28px] italic text-[#1A1A1A] mb-7">
                What happens next
              </h2>
              <div className="space-y-7">
                {timelineSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined w-10 h-10 bg-white border border-[#B0B0A8]/20 text-[#0F3A3A] flex items-center justify-center text-[20px] shrink-0">
                        {step.icon}
                      </span>
                      {index < timelineSteps.length - 1 && (
                        <span className="w-px h-full min-h-[34px] bg-[#B0B0A8]/30 mt-3" />
                      )}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-label text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A] font-bold mb-2">
                        {step.title}
                      </h3>
                      <p className="font-body text-[13px] leading-relaxed text-[#5E6058]">
                        {step.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default PaymentSuccess;
