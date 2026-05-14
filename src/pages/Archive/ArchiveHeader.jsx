import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ArchiveHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-end gap-12 w-full max-w-[1440px] mx-auto px-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Primary Context */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="flex flex-col gap-0 items-start">
           <span className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A]">Botanical Asset Management</span>
           <h1 className="font-headline text-6xl leading-tight text-[#31332C] tracking-tight -ml-1">Admin Dashboard</h1>
        </div>
      </div>

      {/* Primary Actions */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
           <div className="flex flex-wrap gap-4">
               <Link 
                 to="/admin/promotions"
                 className="flex items-center gap-3 bg-white border border-[#B1B3A9]/40 text-[#31332C] px-8 py-3.5 font-label text-[10px] tracking-[0.2em] uppercase hover:bg-[#F5F4ED] transition-all shadow-sm"
               >
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Scheduled Discounts
               </Link>
               <Link 
                 to="/admin/add-plant"
                 className="flex items-center gap-3 bg-[#5F5E5E] text-[#FAF7F6] px-8 py-3.5 font-label text-[10px] tracking-[0.2em] uppercase hover:bg-[#31332C] transition-all shadow-lg"
               >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Add Plant for Sale
               </Link>
               <button className="bg-[#EFEEE6] text-[#31332C]/60 px-8 py-3.5 font-label text-[10px] tracking-[0.2em] uppercase hover:bg-[#E2E3D9] hover:text-[#31332C] transition-all">
                  Generate Report
               </button>
           </div>
      </motion.div>
    </div>
  );
};

export default ArchiveHeader;
