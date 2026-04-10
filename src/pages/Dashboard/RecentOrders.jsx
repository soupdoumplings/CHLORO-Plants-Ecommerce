import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import monsteraImg from '../../assets/products/monstera.png';
import wateringCanImg from '../../assets/products/watering-can.png';
import { useCart } from '../../lib/CartContext';

const ordersData = [
  {
    id: 'ord-1',
    status: 'DELIVERED',
    statusColor: 'bg-[#D2E7E4] text-[#2F4F4F]',
    date: 'MAR 12',
    name: "Hand-Glazed Terracotta Vessel",
    orderRef: 'Order #PP-90154',
    details: 'Natural Finish • Large',
    price: 85.00,
    image: wateringCanImg,
    action: 'REVIEW',
    actionColor: 'text-[#6B6B6B] hover:text-[#1A1A1A]',
  },
  {
    id: 'ord-2',
    status: 'PROCESSING',
    statusColor: 'bg-[#FBD185]/30 text-[#785A1A]',
    date: '',
    name: "Monstera Deliciosa 'Thai Constellation'",
    orderRef: 'Order #PP-90158',
    details: 'Rare Selection • 12cm Pot',
    price: 145.00,
    image: monsteraImg,
    action: 'TRACK',
    actionColor: 'text-[#C5A059] hover:text-[#785A1A]',
  },
];

const wishlistData = [
  {
    id: 'wish-1',
    name: 'Artisan Pruning Shears',
    details: 'Brass Finish • Limited Edition',
    price: 62.00,
    image: wateringCanImg,
  },
  {
    id: 'wish-2',
    name: 'Heritage Ceramic Planter',
    details: 'Sandstone • Medium',
    price: 98.00,
    image: monsteraImg,
  },
];

const RecentOrders = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { addToBag } = useCart();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 lg:mt-24"
    >
      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-[#B0B0A8]/20 mb-10">
        <button
          onClick={() => setActiveTab('orders')}
          className={`font-headline text-[22px] lg:text-[26px] pb-4 px-1 mr-10 transition-all duration-300 relative ${
            activeTab === 'orders'
              ? 'text-[#1A1A1A]'
              : 'text-[#B0B0A8] hover:text-[#6B6B6B]'
          }`}
        >
          Recent Orders
          {activeTab === 'orders' && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A1A]"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`font-headline text-[22px] lg:text-[26px] pb-4 px-1 transition-all duration-300 relative ${
            activeTab === 'wishlist'
              ? 'text-[#1A1A1A]'
              : 'text-[#B0B0A8] hover:text-[#6B6B6B]'
          }`}
        >
          Wishlist
          {activeTab === 'wishlist' && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A1A]"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-0"
          >
            {ordersData.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6 lg:gap-8 py-6 border-b border-[#B0B0A8]/10 last:border-0 group hover:bg-[#F9F7F2]/50 transition-colors px-2 -mx-2"
              >
                {/* Product Image */}
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#EDEBE4] shrink-0 p-1.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    {/* Status Badge */}
                    <span className={`font-label text-[8px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm font-semibold ${order.statusColor}`}>
                      {order.status}
                    </span>
                    {order.date && (
                      <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[#B0B0A8] font-medium">
                        {order.date}
                      </span>
                    )}
                  </div>
                  <h4 className="font-headline text-[16px] lg:text-[18px] text-[#1A1A1A] leading-snug truncate">
                    {order.name}
                  </h4>
                  <p className="font-label text-[8px] tracking-[0.12em] uppercase text-[#6B6B6B] mt-1">
                    {order.orderRef} • {order.details}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-headline text-[16px] lg:text-[18px] text-[#1A1A1A]">
                    रू{order.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Link */}
                <button className={`font-label text-[9px] tracking-[0.15em] uppercase font-semibold shrink-0 transition-colors duration-300 ${order.actionColor}`}>
                  {order.action}
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="wishlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-0"
          >
            {wishlistData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-6 lg:gap-8 py-6 border-b border-[#B0B0A8]/10 last:border-0 group hover:bg-[#F9F7F2]/50 transition-colors px-2 -mx-2"
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#EDEBE4] shrink-0 p-1.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-headline text-[16px] lg:text-[18px] text-[#1A1A1A] leading-snug truncate">
                    {item.name}
                  </h4>
                  <p className="font-label text-[8px] tracking-[0.12em] uppercase text-[#6B6B6B] mt-1">
                    {item.details}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-headline text-[16px] lg:text-[18px] text-[#1A1A1A]">
                    रू{item.price.toFixed(2)}
                  </p>
                </div>

                <button 
                  onClick={() => addToBag(item)}
                  className="font-label text-[9px] tracking-[0.15em] uppercase font-semibold shrink-0 text-[#C5A059] hover:text-[#785A1A] transition-colors duration-300"
                >
                  ADD TO BAG
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default RecentOrders;
