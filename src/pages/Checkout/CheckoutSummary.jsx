import React from 'react';
import { motion } from 'framer-motion';
import monsteraImg from '../../assets/products/monstera.png';
import succulentsImg from '../../assets/products/succulents.png';

const orderItems = [
  {
    id: 'checkout_1',
    name: 'The Heirloom Monstera',
    variant: 'EXTRA LARGE / TERRA COTTA',
    price: 124.00,
    image: monsteraImg
  },
  {
    id: 'checkout_2',
    name: 'String of Pearls',
    variant: 'SMALL / MATTE WHITE',
    price: 38.00,
    image: succulentsImg
  }
];

const CheckoutSummary = () => {
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

      <div className="flex flex-col gap-6 mb-10 border-b border-[#B0B0A8]/20 pb-8">
        {orderItems.map((item) => (
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
                  {item.variant}
                </p>
              </div>
              <p className="font-headline text-[15px] text-[#1A1A1A] tracking-tight mt-auto">
                रू {item.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5 mb-10 border-b border-[#B0B0A8]/20 pb-10">
        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Subtotal</span>
          <span className="text-[#1A1A1A]">रू 162.00</span>
        </div>
        
        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold leading-tight">
          <span>Shipping <span className="text-[#6B6B6B]/70 capitalize tracking-normal text-[10px] font-medium ml-1">(Editorial Rate)</span></span>
          <span className="text-[#1A1A1A]">रू 12.00</span>
        </div>

        <div className="flex justify-between items-center font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
          <span>Taxes</span>
          <span className="text-[#1A1A1A]">रू 0.00</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-10">
        <span className="font-headline text-[22px] italic text-[#4A4A4A] leading-tight flex-shrink-0">
          Total
        </span>
        <span className="font-headline text-[24px] lg:text-[28px] italic leading-none text-[#1A1A1A]">
          रू 174.00
        </span>
      </div>

      <button className="w-full bg-[#4A4A4A] text-[#F9F7F2] py-4.5 px-6 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A1A1A] transition-all duration-300 shadow-sm mb-6">
        Complete Purchase
      </button>

      <p className="font-label text-[7px] tracking-[0.15em] uppercase text-[#6B6B6B] text-center w-full">
        SECURE ENCRYPTED TRANSACTION BY STRIPE
      </p>
    </motion.div>
  );
};

export default CheckoutSummary;
