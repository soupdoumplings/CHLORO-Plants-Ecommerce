import React from 'react';
import { motion } from 'framer-motion';

const paymentMethods = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: 'Pay with your eSewa wallet',
    color: '#60BB46',
    bgColor: '#F0F9ED',
    borderColor: '#60BB46',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#60BB46"/>
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">e</text>
      </svg>
    ),
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Pay with Khalti digital wallet',
    color: '#5C2D91',
    bgColor: '#F3EFF8',
    borderColor: '#5C2D91',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#5C2D91"/>
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">K</text>
      </svg>
    ),
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    color: '#2F4F4F',
    bgColor: '#F0F2F2',
    borderColor: '#2F4F4F',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#2F4F4F"/>
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">₹</text>
      </svg>
    ),
  },
];

const PaymentMethodSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      {paymentMethods.map((method, idx) => {
        const isActive = selected === method.id;

        return (
          <motion.button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`
              relative w-full flex items-center gap-5 p-5 lg:p-6
              border-2 transition-all duration-300 cursor-pointer text-left
              ${isActive
                ? `border-[${method.borderColor}] bg-[${method.bgColor}] shadow-sm`
                : 'border-[#B0B0A8]/20 bg-white hover:border-[#B0B0A8]/40 hover:bg-[#FAFAF8]'
              }
            `}
            style={isActive ? {
              borderColor: method.borderColor,
              backgroundColor: method.bgColor,
            } : {}}
          >
            {/* Radio indicator */}
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300"
              style={{
                borderColor: isActive ? method.color : '#B0B0A8',
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: method.color }}
              />
            </div>

            {/* Logo */}
            <div className="shrink-0">
              {method.logo}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-0.5">
              <span
                className="font-label text-[12px] tracking-[0.08em] uppercase font-bold transition-colors duration-300"
                style={{ color: isActive ? method.color : '#1A1A1A' }}
              >
                {method.name}
              </span>
              <span className="font-label text-[9px] tracking-[0.05em] text-[#6B6B6B] font-medium">
                {method.description}
              </span>
            </div>

            {/* Active badge */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-auto"
              >
                <span
                  className="font-label text-[7px] tracking-[0.15em] uppercase font-bold px-2.5 py-1 rounded-sm text-white"
                  style={{ backgroundColor: method.color }}
                >
                  Selected
                </span>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
