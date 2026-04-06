import React from 'react';
import { motion } from 'framer-motion';

const Editorial = () => {
  return (
    <section className="bg-[#f5f4ed] py-32 overflow-hidden border-y border-[#31332c]/5">
      <div className="max-w-[1440px] mx-auto px-12 md:grid grid-cols-12 items-center gap-16 md:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-5 relative z-10 text-left mb-16 md:mb-0"
        >
          <p className="font-label text-[11px] tracking-[0.3em] uppercase mb-8 text-[#456565] font-bold">The Journal — Volume IV</p>
          <h2 className="font-headline text-6xl md:text-[6.5rem] tracking-tight leading-[0.9] text-[#31332c] mb-12">
            Beyond the <br /> 
            <span className="italic font-light">Leaves.</span>
          </h2>
          <p className="font-body text-lg text-[#5e6058] mb-12 leading-relaxed max-w-md opacity-90 italic">
            Born in the foothills of the Langtang range, Verdant is more than a boutique. It is an archival project dedicated to preserving the botanical heritage of Nepal through modern care and conscious commerce.
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#31332c] px-14 py-5 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#31332c] hover:text-[#fbf9f4] transition-all shadow-xl shadow-black/5"
          >
            Read the Article
          </motion.button>
        </motion.div>
        
        <div className="col-span-12 md:col-span-7 relative group">
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[16/10] relative translate-x-0 md:translate-x-32 overflow-hidden shadow-2xl shadow-black/10"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 2 }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtLFUaM3Oonv-pGeO3SkHfTS8ZwCf94GQ15nwPbp0WAe_YF5VeRfOLpoQc47_h84EYZnhvybB2_NQ1RrQvzieJw8XOjn0MGh9ggtb62Y1yF8lljRQfuJiDT9wMhsXX_9okXQLtBUBnp2xz4ckjyGFNr0VEF4O0O6OlFzVenD2MUS2HpAB3lM77DvQrM5AM6aDQZCDRYsh5xXBXaHiaOzsejU5lSlIMDBsXwlFvyWS-LAFGzYNyAfSJrD6pkSo7mWojOCRg4uHsLhoX" 
              alt="Verdant Heritage" 
              className="w-full h-full object-cover" 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -bottom-16 -left-12 bg-white p-14 max-w-sm hidden lg:block shadow-2xl shadow-black/5 border border-[#31332c]/5"
          >
            <p className="font-headline italic text-2xl mb-6 text-[#785a1a] leading-relaxed tracking-tight">"We believe every home should be a sanctuary of wild Himalayan soul."</p>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#797c73] font-bold">— The Founder</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Editorial;
