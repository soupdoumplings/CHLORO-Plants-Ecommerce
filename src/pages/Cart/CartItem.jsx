import React from 'react';
import { motion } from 'framer-motion';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-6 lg:gap-8 py-8 lg:py-12 border-b border-[#B0B0A8]/20 group"
    >
      {/* Product Image */}
      <div className="w-24 h-24 lg:w-32 lg:h-32 shrink-0 bg-[#EDEBE4] relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover p-2 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Info & Controls */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-[20px] lg:text-[24px] text-[#1A1A1A] leading-snug mb-2 transition-colors hover:text-[#C5A059] cursor-pointer">
              {item.name}
            </h3>
            <p className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-6">
              {item.variant}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 border border-[#B0B0A8]/30 w-fit px-4 py-1.5 transition-colors hover:border-[#1A1A1A]/30">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              −
            </button>
            <span className="font-label text-[11px] tracking-[0.1em] text-[#1A1A1A] font-medium w-5 text-center">
              {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Price & Remove */}
        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end mt-4 sm:mt-0">
          <p className="font-headline text-[18px] text-[#1A1A1A] tracking-tight">
            Rs. {item.price.toFixed(2)}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1.5 font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-1 sm:mt-auto sm:mb-0"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
