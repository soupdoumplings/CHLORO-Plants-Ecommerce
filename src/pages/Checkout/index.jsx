import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CheckoutHeader from './CheckoutHeader';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import { useAuth } from '../../lib/AuthContext';
import { getCustomerProfile, profileToCheckoutDetails } from '../../lib/customerProfile';

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
      country: 'Nepal',
      postalCode: '',
    },
    billingAddress: {
      addressLine: '',
      city: '',
      country: 'Nepal',
      postalCode: '',
    },
    sameAsShipping: true,
  });

  useEffect(() => {
    let active = true;

    const loadSavedBilling = async () => {
      if (!user) return;

      try {
        const result = await getCustomerProfile(user);
        if (!active || !result.schemaReady) return;
        setCheckoutDetails((current) => ({
          ...current,
          ...profileToCheckoutDetails({
            user,
            profile: result.profile,
            billing: result.billing,
          }),
        }));
      } catch (err) {
        console.warn('Could not load saved checkout details:', err.message);
      }
    };

    loadSavedBilling();

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full page-shell page-gutter pb-20 mt-[82px] lg:mt-[100px]">
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

      <Footer />
    </Motion.div>
  );
};

export default CheckoutPage;
