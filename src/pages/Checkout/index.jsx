import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CheckoutHeader from './CheckoutHeader';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import OrderHistory from './OrderHistory';
import { useAuth } from '../../lib/AuthContext';

const CheckoutPage = () => {
  const { user } = useAuth();
  const fullNameParts = user?.user_metadata?.full_name?.split(' ') || [];
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutDetails, setCheckoutDetails] = useState({
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    firstName: fullNameParts[0] || '',
    lastName: fullNameParts.slice(1).join(' ') || '',
    shippingAddress: {
      addressLine: '',
      city: '',
      postalCode: '',
    },
    billingAddress: {
      addressLine: '',
      city: '',
      postalCode: '',
    },
    sameAsShipping: true,
    emailOrderUpdates: true,
    marketingEmails: false,
  });

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-20 mt-[82px] lg:mt-[100px]">
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 xl:gap-32 items-start relative">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 xl:col-span-8 w-full flex justify-end"
          >
             <div className="w-full">
               <CheckoutForm
                 paymentMethod={paymentMethod}
                 setPaymentMethod={setPaymentMethod}
                 checkoutDetails={checkoutDetails}
                 setCheckoutDetails={setCheckoutDetails}
               />
             </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4 w-full h-full lg:static relative z-10"
          >
            <CheckoutSummary paymentMethod={paymentMethod} checkoutDetails={checkoutDetails} />
          </Motion.div>
        </div>
      </main>

      {/* Member Archive Section */}
      {user && (
        <section className="bg-white mt-12 w-full">
           <OrderHistory />
        </section>
      )}

      <Footer />
    </Motion.div>
  );
};

export default CheckoutPage;
