import React from 'react';
import { motion } from 'framer-motion';

const CartHeader = () => {
  return (
    <div className="pt-24 pb-14 lg:pt-32 lg:pb-20 border-b border-[#B0B0A8]/20">
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-label text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-semibold mb-6"
      >
        Current Curation
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="font-headline text-[clamp(3rem,6.5vw,5.5rem)] leading-[0.92] tracking-tight text-[#1A1A1A]"
      >
        Your Shopping{' '}
        <span className="italic font-light">Bag</span>
      </motion.h1>
    </div>
  );
};

export default CartHeader;
