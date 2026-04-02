import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import CartCrossSell from './CartCrossSell';
import OrderSummary from './OrderSummary';
import { initialCartItems } from './cartData';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [items, setItems] = useState(initialCartItems);

  const handleUpdateQuantity = (id, newQty) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCrossSell = (product) => {
    const exists = items.find((item) => item.id === product.id);
    if (exists) {
      handleUpdateQuantity(product.id, exists.quantity + 1);
    } else {
      setItems((prev) => [...prev, { ...product, quantity: 1, variant: 'SANTUARY BLEND' }]);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F9F7F2] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-32">
        <CartHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mt-12 lg:mt-16 items-start relative">
          {/* Left Column: Cart Items & Cross-Sell */}
          <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col h-full">
            <div className="flex flex-col">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="empty-cart"
                    className="py-16"
                  >
                    <p className="font-headline text-[24px] text-[#1A1A1A] mb-6">Your bag is currently empty.</p>
                    <Link to="/discovery" className="flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-[#C5A059] hover:text-[#1A1A1A] font-semibold transition-colors group">
                      Continue Shopping
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1 inline-block">
                        arrow_right_alt
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Cross-Sell */}
            {items.length > 0 && <CartCrossSell onAdd={handleAddCrossSell} />}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4 w-full lg:sticky lg:top-[120px]"
          >
             <OrderSummary 
               subtotal={subtotal} 
               shipping={0} 
               tax={tax} 
               total={total} 
             />
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default CartPage;
