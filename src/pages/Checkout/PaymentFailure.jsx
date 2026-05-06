import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PaymentFailure = () => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-20 mt-[82px] lg:mt-[100px]">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[520px] w-full text-center"
        >
          {/* Error Icon */}
          <Motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 mx-auto mb-10 rounded-full bg-[#D94F4F]/10 border-2 border-[#D94F4F]/20 flex items-center justify-center"
          >
            <Motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="material-symbols-outlined text-[#D94F4F] text-[40px]"
            >
              close
            </Motion.span>
          </Motion.div>

          {/* Title */}
          <Motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-label text-[9px] tracking-[0.2em] uppercase text-[#D94F4F] font-medium mb-4"
          >
            Payment Unsuccessful
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-headline text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-[#1A1A1A] mb-6"
          >
            Something went wrong.
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="font-body text-[15px] text-[#6B6B6B] leading-relaxed mb-12 max-w-[380px] mx-auto"
          >
            Your payment could not be processed. Your cart items are still saved -
            please try again or choose a different payment method.
          </Motion.p>

          {/* Info Card */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="bg-[#FAF2F2] border border-[#D94F4F]/10 p-6 mb-10 text-left"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#D94F4F] text-[18px] mt-0.5 shrink-0">info</span>
              <div>
                <p className="font-label text-[10px] tracking-[0.05em] text-[#9F403D] font-semibold mb-1">
                  Common reasons for payment failure
                </p>
                <ul className="font-body text-[12px] text-[#9F403D]/80 space-y-1 list-disc list-inside">
                  <li>Insufficient wallet balance</li>
                  <li>Transaction was cancelled by the user</li>
                  <li>Session expired during payment</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            </div>
          </Motion.div>

          {/* CTAs */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/checkout"
              className="bg-[#2F4F4F] text-white px-10 py-4 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A2F2F] transition-all duration-300 text-center"
            >
              Try Again
            </Link>
            <Link
              to="/cart"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 text-center"
            >
              Back to Cart
            </Link>
          </Motion.div>
        </Motion.div>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default PaymentFailure;
