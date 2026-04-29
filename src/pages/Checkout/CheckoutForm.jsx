import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentMethodSelector from './PaymentMethodSelector';

const CheckoutForm = ({ paymentMethod, setPaymentMethod, shippingData, setShippingData }) => {
  
  const handleInputChange = (field, value) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

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
              value={shippingData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Your first name"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Last Name</label>
            <input 
              type="text" 
              value={shippingData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Your last name"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Shipping Address</label>
          <input 
            type="text" 
            value={shippingData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Street name and house number"
            className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">City</label>
            <input 
              type="text" 
              value={shippingData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Your city"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Phone Number</label>
            <input 
              type="tel" 
              value={shippingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="98XXXXXXXX"
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>
      </motion.section>

      {/* ----------------- STEP 2: PAYMENT METHOD ----------------- */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F3F1EA] p-8 lg:p-12 border border-[#B0B0A8]/10"
      >
        <div className="flex justify-between items-end mb-8 relative">
          <h2 className="font-headline text-[24px] italic text-[#1A1A1A] leading-none">Payment Method</h2>
          <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-1 relative top-[1px]">Step 02 / 02</span>
        </div>

        <PaymentMethodSelector 
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {/* eSewa info */}
        {paymentMethod === 'esewa' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-white p-5 border border-[#60BB46]/20"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#60BB46] text-[18px] mt-0.5">info</span>
              <p className="font-label text-[10px] tracking-[0.03em] text-[#4A4A4A] font-medium leading-relaxed">
                You will be redirected to eSewa's secure payment page to complete your transaction. 
                Make sure you have sufficient balance in your eSewa wallet.
              </p>
            </div>
          </motion.div>
        )}

        {/* Khalti info */}
        {paymentMethod === 'khalti' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-white p-5 border border-[#5C2D91]/20"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#5C2D91] text-[18px] mt-0.5">info</span>
              <p className="font-label text-[10px] tracking-[0.03em] text-[#4A4A4A] font-medium leading-relaxed">
                You will be redirected to Khalti's secure payment page. You can pay using your Khalti wallet, 
                mobile banking, or connect bank.
              </p>
            </div>
          </motion.div>
        )}

        {/* COD info */}
        {paymentMethod === 'cod' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-white p-5 border border-[#2F4F4F]/20"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#2F4F4F] text-[18px] mt-0.5">local_shipping</span>
              <p className="font-label text-[10px] tracking-[0.03em] text-[#4A4A4A] font-medium leading-relaxed">
                Pay in cash when your order is delivered. Please have the exact amount ready. 
                A delivery charge may apply for your area.
              </p>
            </div>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default CheckoutForm;
