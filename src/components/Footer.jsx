import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#0F3A3A] pt-24 pb-12 px-8 md:px-16 border-t border-[#FBF9F4]/10 relative z-10 transition-colors duration-1000 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-16 mb-20 relative z-10">
        
        {/* Brand Identification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md space-y-8"
        >
          <div className="flex flex-col">
            <h2 className="font-headline italic text-5xl md:text-6xl text-[#FBF9F4] tracking-tight">CHLORO</h2>
            <span className="font-label text-[10px] tracking-[0.3em] uppercase text-[#FBF9F4]/50 mt-4">Botanical Living & Curation</span>
          </div>
          
          <p className="font-body text-[15px] text-[#FBF9F4]/70 leading-relaxed max-w-sm">
            Curating rare and exceptional botanical specimens for the modern sanctuary. Dedicated to the documentation, preservation, and celebration of nature's architectural wonders.
          </p>
          
          <div className="flex gap-6 items-center text-[#FBF9F4]/60 pt-4 border-t border-[#FBF9F4]/10 w-max">
            <Link to="/discovery" className="material-symbols-outlined text-sm hover:text-white transition-colors">language</Link>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#FBF9F4]/50">Kathmandu, NP</span>
          </div>
        </motion.div>

        {/* Navigation Columns */}
        <div className="flex gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h4 className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-[#FBF9F4]/40">Explore</h4>
            <ul className="space-y-4 font-headline text-[17px] text-[#FBF9F4] flex flex-col items-start">
              <Link to="/" className="hover:italic hover:text-white transition-all duration-300 block">Home</Link>
              <Link to="/discovery" className="hover:italic hover:text-white transition-all duration-300 block">The Collection</Link>
              <Link to="/journal" className="hover:italic hover:text-white transition-all duration-300 block">Editorial Journal</Link>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h4 className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-[#FBF9F4]/40">Services</h4>
            <ul className="space-y-4 font-headline text-[17px] text-[#FBF9F4] flex flex-col items-start">
              <Link to="/ai-diagnosis" className="hover:italic hover:text-white transition-all duration-300 block">AI Care Diagnosis</Link>
              <Link to="/cart" className="hover:italic hover:text-white transition-all duration-300 block">Your Bag</Link>
              <Link to="/login" className="hover:italic hover:text-white transition-all duration-300 block">Client Portal</Link>
            </ul>
          </motion.div>
        </div>

      </div>

      {/* Editorial Legal Row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="max-w-[1440px] mx-auto pt-8 border-t border-[#FBF9F4]/10 flex flex-col md:flex-row justify-between items-center gap-6 font-label text-[9px] tracking-[0.2em] uppercase text-[#FBF9F4]/40"
      >
        <p>© {new Date().getFullYear()} CHLORO. All Rights Reserved.</p>
        <div className="flex gap-8">
          <Link to="/archive" className="hover:text-white transition-colors">Admin Access</Link>
        </div>
      </motion.div>
      
      {/* Huge Background Text */}
      <div className="absolute -bottom-16 left-0 w-full overflow-hidden flex justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="font-headline italic text-[20vw] leading-none whitespace-nowrap text-[#FBF9F4]">CHLORO</h1>
      </div>
    </motion.footer>
  );
};

export default Footer;
