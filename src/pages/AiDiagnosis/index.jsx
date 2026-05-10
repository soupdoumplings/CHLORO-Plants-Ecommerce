import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AiDiagnosisPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto flex items-center justify-center px-12 pt-16 pb-32 mt-[82px] min-h-[70vh]">
        <div className="text-center max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-24 border border-[#31332c]/20 mx-auto flex items-center justify-center rounded-sm mb-12 shadow-sm"
            >
              <span className="material-symbols-outlined text-[#31332c] text-5xl">camera</span>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-label text-[11px] uppercase tracking-[0.3em] text-[#785A1A]/80 font-bold mb-6"
            >
              System Currently Offline
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline italic text-5xl md:text-7xl text-[#31332c] mb-10 leading-tight"
            >
              Future <br className="hidden md:block" /> Implementation.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[#5e6058] text-lg leading-relaxed max-w-lg mx-auto"
            >
              The AI-powered botanical diagnosis engine is currently under active development. Please check back later for algorithmic specimen care tracking and automated remote climate diagnostics.
            </motion.p>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default AiDiagnosisPage;
