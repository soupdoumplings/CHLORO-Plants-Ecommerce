import React, { useState } from 'react';
import { motion } from 'framer-motion';
import wateringCanImg from '../../assets/products/watering-can.png';
import scissorsImg from '../../assets/products/scissors.png';
import monsteraImg from '../../assets/products/monstera.png';

const orderHistoryData = [
  {
    ref: '#PP-89230',
    date: 'Nov 12, 2023',
    details: 'The Larantia + 2 others',
    image: monsteraImg,
    amount: 214.00,
    status: 'SHIPPED',
    color: 'bg-[#D2E7E4] text-[#2F4F4F]'
  },
  {
    ref: '#PP-88432',
    date: 'Oct 28, 2023',
    details: 'Ceramic Watering Can',
    image: wateringCanImg,
    amount: 85.00,
    status: 'PAID',
    color: 'bg-[#EAE8E2] text-[#4A4A4A]'
  },
  {
    ref: '#PP-87330',
    date: 'Sep 05, 2023',
    details: 'Artisan Pruning Shears',
    image: scissorsImg,
    amount: 42.00,
    status: 'RETURNED',
    color: 'bg-[#F9F7F2] text-[#808080] border border-[#B0B0A8]/30'
  }
];

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('ALL ORDERS');

  return (
    <div className="w-full pt-20 pb-24 border-t border-[#B0B0A8]/20 bg-white">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-14">
        
        {/* Header & Toggles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#C5A059] font-medium mb-4">
              Member Archive
            </p>
            <h2 className="font-headline text-[32px] md:text-[40px] leading-none text-[#1A1A1A]">
              Order History.
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex bg-[#F9F7F2] p-1.5 rounded-sm"
          >
            <button 
              onClick={() => setActiveTab('ALL ORDERS')}
              className={`font-label text-[9px] tracking-[0.15em] uppercase px-5 py-2.5 transition-colors ${activeTab === 'ALL ORDERS' ? 'bg-[#EDEBE4] text-[#1A1A1A] font-semibold' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}
            >
              All Orders
            </button>
            <button 
              onClick={() => setActiveTab('DRAFTS')}
              className={`font-label text-[9px] tracking-[0.15em] uppercase px-5 py-2.5 transition-colors ${activeTab === 'DRAFTS' ? 'bg-[#EDEBE4] text-[#1A1A1A] font-semibold' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}
            >
              Drafts
            </button>
          </motion.div>
        </div>

        {/* Table Headings */}
        <div className="grid grid-cols-12 gap-6 border-b border-[#B0B0A8]/20 pb-5 mb-6 font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-semibold">
          <div className="col-span-2">Order Ref</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-4 lg:col-span-5">Details</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 lg:col-span-1 text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col gap-6">
          {orderHistoryData.map((order, idx) => (
            <motion.div 
              key={order.ref}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-12 gap-6 items-center py-5 border-b border-[#B0B0A8]/10 last:border-0 hover:bg-[#F9F7F2]/50 transition-colors"
            >
              <div className="col-span-2 font-label text-[10px] tracking-[0.05em] text-[#4A4A4A] font-medium">
                {order.ref}
              </div>
              <div className="col-span-2 font-body text-[13px] text-[#6B6B6B]">
                {order.date}
              </div>
              <div className="col-span-4 lg:col-span-5 flex items-center gap-5">
                <div className="w-12 h-12 bg-[#EDEBE4] shrink-0 p-1 flex items-center justify-center">
                  <img src={order.image} alt="Product" className="object-contain max-w-full max-h-full opacity-90" />
                </div>
                <span className="font-body text-[14px] text-[#1A1A1A]">
                  {order.details}
                </span>
              </div>
              <div className="col-span-2 text-right font-headline text-[16px] text-[#1A1A1A]">
                रू {order.amount.toFixed(2)}
              </div>
              <div className="col-span-2 lg:col-span-1 flex justify-end">
                <span className={`font-label text-[8px] tracking-[0.15em] uppercase px-2.5 py-1.5 rounded-sm ${order.color}`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrderHistory;
