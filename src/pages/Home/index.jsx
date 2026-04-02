import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from './Hero';
import Philosophy from './Philosophy';
import ArchivePreview from './ArchivePreview';
import VisualBreak from './VisualBreak';

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#fafafa] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      
      <main className="w-full flex-grow">
        <Hero />
        <ArchivePreview />
        <Philosophy />
        <VisualBreak />
      </main>

      <Footer />
    </motion.div>
  );
};

export default HomePage;
