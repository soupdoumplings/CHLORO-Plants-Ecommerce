import React from 'react';
import { motion } from 'framer-motion';

const OrderSummary = ({ subtotal, shipping, tax, total }) => {
  return (
    <div className="w-full bg-[#EDEBE4] p-8 lg:p-14 sticky top-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-headline text-[26px] lg:text-[32px] text-[#1A1A1A] mb-12">
          Order Summary
        </h2>

        <div className="space-y-6 mb-12 border-b border-[#B0B0A8]/20 pb-10">
          <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
            <span>Subtotal</span>
            <span className="text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold leading-tight">
            <span>Shipping</span>
            <span className="text-[#1A1A1A] text-right max-w-[120px]">Calculated at checkout</span>
          </div>

          <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
            <span>Tax Estimation</span>
            <span className="text-[#1A1A1A]">${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Row */}
        <div className="flex justify-between items-end mb-10">
          <span className="font-body text-[16px] text-[#4A4A4A] max-w-[80px] leading-tight flex-shrink-0">
            Total Amount
          </span>
          <span className="font-headline text-[32px] lg:text-[40px] leading-[0.8] text-[#1A1A1A]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Checkout CTA */}
        <button className="w-full bg-[#1A1A1A] text-white py-5 px-6 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#2F4F4F] transition-all duration-300 active:scale-[0.98] mb-5">
          Proceed to Checkout
        </button>

        <p className="font-label text-[7px] tracking-[0.15em] uppercase text-[#6B6B6B] text-center w-full mb-14">
          SECURE CHECKOUT POWERED BY PETALS & POTS
        </p>

        {/* Trust Badges */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[20px] text-[#2F4F4F] mt-0.5">
              local_shipping
            </span>
            <p className="font-body text-[12px] leading-relaxed text-[#4A4A4A]">
              Complimentary climate-neutral shipping on orders over $150.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[20px] text-[#2F4F4F] mt-0.5">
              verified_user
            </span>
            <p className="font-body text-[12px] leading-relaxed text-[#4A4A4A]">
              Our editorial 30-day return policy ensures total satisfaction.
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default OrderSummary;
