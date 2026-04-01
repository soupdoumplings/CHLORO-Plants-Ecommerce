import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CheckoutHeader from './CheckoutHeader';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import OrderHistory from './OrderHistory';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-20 mt-[82px] lg:mt-[100px]">
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 xl:gap-32 items-start relative">
          <div className="lg:col-span-7 xl:col-span-8 w-full flex justify-end">
             {/* The form has max-w-[640px], justify-end pushes it nicely if needed, or left align. The design shows it left aligned. */}
             <div className="w-full">
               <CheckoutForm />
             </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 w-full h-full lg:static relative z-10">
            {/* The summary floats nicely on the right */}
            <CheckoutSummary />
          </div>
        </div>
      </main>

      {/* Member Archive Section (Full Width Background Line) */}
      <section className="bg-white mt-12 w-full">
         <OrderHistory />
      </section>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
