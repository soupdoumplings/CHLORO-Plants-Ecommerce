import React from 'react';
import { motion } from 'framer-motion';

const CheckoutForm = () => {
  return (
    <div className="flex flex-col gap-14 lg:gap-20 w-full max-w-[640px]">
      {/* ----------------- STEP 1: SHIPPING ----------------- */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-between items-end border-b border-[#B0B0A8]/20 pb-4 mb-8">
          <h2 className="font-headline text-[24px] italic text-[#1A1A1A] leading-none">Shipping Address</h2>
          <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-1 relative top-[1px]">Step 01 / 02</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">First Name</label>
            <input 
              type="text" 
              defaultValue="Julian"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Last Name</label>
            <input 
              type="text" 
              defaultValue="Huxley"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Shipping Address</label>
          <input 
            type="text" 
            placeholder="Street name and house number"
            className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">City</label>
            <input 
              type="text" 
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Postal Code</label>
            <input 
              type="text" 
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>
      </motion.section>

      {/* ----------------- STEP 2: PAYMENT ----------------- */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F3F1EA] p-8 lg:p-12 border border-[#B0B0A8]/10"
      >
        <div className="flex justify-between items-end mb-8 relative">
          <h2 className="font-headline text-[24px] italic text-[#1A1A1A] leading-none">Payment Details</h2>
          <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-1 relative top-[1px]">Step 02 / 02</span>
        </div>

        <div className="bg-white p-7 lg:p-10 shadow-sm mb-6 border border-[#B0B0A8]/10">
          <div className="flex justify-between items-center mb-6">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Card Information</label>
            <div className="flex gap-2">
              <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
              <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
              <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Card Number"
                className="w-full border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
                defaultValue=""
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#B0B0A8] text-[20px]">
                credit_card
              </span>
            </div>

            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="MM / YY"
                className="w-1/2 border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
              />
              <input 
                type="text" 
                placeholder="CVC"
                className="w-1/2 border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Error Banner */}
        <div className="bg-[#FAF2F2] border-l-2 border-[#D94F4F] py-3.5 px-4 flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#D94F4F] text-[15px] opacity-80">error</span>
          <p className="font-label text-[9px] tracking-[0.05em] text-[#9F403D] font-medium leading-none pt-[1px]">
            Your card was declined. Please check your card details and try again.
          </p>
        </div>

        {/* Processing CTA */}
        <button className="w-full bg-[#B0B0A8]/80 text-white/90 py-5 px-6 font-label text-[11px] tracking-[0.2em] uppercase font-semibold cursor-not-allowed transition-all border border-[#B0B0A8]/20">
          Processing...
        </button>

      </motion.section>
    </div>
  );
};

export default CheckoutForm;
