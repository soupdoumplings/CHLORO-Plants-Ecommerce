import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ArchiveHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-end gap-12 w-full max-w-[1440px] mx-auto px-12 mb-20">
      {/* Primary Context */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 max-w-2xl"
      >
        <div className="flex flex-col gap-0 items-start">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
             className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A]"
           >
             Botanical Asset Management
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-6xl leading-tight text-[#31332C] tracking-tight -ml-1"
           >
             Admin Dashboard
           </motion.h1>
        </div>
      </motion.div>

      {/* Primary Actions */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-4 items-center"
      >
        <Link to="/admin/add-plant" className="bg-[#5F5E5E] text-[#FAF7F6] px-8 py-3 font-label text-[12px] tracking-[1.2px] uppercase flex items-center gap-2 hover:bg-[#31332C] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-black/5">
           <span className="w-2 h-2 bg-[#FAF7F6] rounded-full"></span>
           Add Plant For Sale
        </Link>
        <button className="bg-[#E8E9E0] border border-[#797c73]/10 text-[#31332C] px-8 py-3 font-label text-[12px] tracking-[1.2px] uppercase hover:bg-[#dbddd0] transition-all transform hover:-translate-y-0.5 active:scale-95">
           Generate Report
        </button>
      </motion.div>
    </div>
  );
};

export default ArchiveHeader;
