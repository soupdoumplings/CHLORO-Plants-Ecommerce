import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';

const DashboardPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-20 mt-[82px] lg:mt-[100px]">
        <ProfileHeader />
        <ProfileDetails />
      </main>

      <Footer />
    </motion.div>
  );
};

export default DashboardPage;
