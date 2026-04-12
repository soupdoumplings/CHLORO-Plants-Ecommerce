import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#0F3A3A] pt-32 pb-16 px-12 border-t border-[#FBF9F4]/10 relative z-10 transition-colors duration-1000 cursor-auto"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
        {/* Brand Identification */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-1 md:col-span-2 space-y-12"
        >
          <h2 className="font-headline text-5xl text-[#FBF9F4] tracking-tighter">CHLORO</h2>
          <p className="font-body text-base text-[#FBF9F4]/70 leading-relaxed max-w-sm">
             A high-end Himalayan specimen collection. Dedicated to the documentation and preservation of rare indoor-adapted flora from the roof of the world.
          </p>
          <div className="flex gap-6 items-center text-[#FBF9F4]/60">
            <a href="#" className="material-symbols-outlined text-xs hover:text-[#c6e9e9] transition-colors">language</a>
            <a href="#" className="font-label text-xs uppercase tracking-widest hover:text-[#c6e9e9] transition-colors">Kathmandu, NP</a>
          </div>
        </motion.div>

        {/* Global Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
          <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#FBF9F4]">Internal Navigation</h4>
          <ul className="space-y-6 font-label text-[11px] uppercase tracking-[0.15em] text-[#FBF9F4]/80">
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">The Journal</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Care Guides</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Sustainability</li>
          </ul>
        </motion.div>

        {/* Client Support */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
           <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#FBF9F4]">Support</h4>
           <ul className="space-y-6 font-label text-[11px] uppercase tracking-[0.15em] text-[#FBF9F4]/80">
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Contact</li>
          </ul>
        </motion.div>
      </div>

      {/* Editorial Legal Row */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-[1440px] mx-auto pt-12 border-t border-[#FBF9F4]/10 flex flex-col md:flex-row justify-between items-center gap-12 font-label text-[10px] tracking-widest uppercase text-[#FBF9F4]/60 font-black"
      >
        <p>© 2024 Chloro Himalayan Specimen Collection</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#c6e9e9] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#c6e9e9] transition-colors">Terms of Service</a>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
