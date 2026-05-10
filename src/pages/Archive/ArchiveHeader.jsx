import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ArchiveHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 w-full page-shell mb-10 lg:mb-20">
      {/* Primary Context */}
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 max-w-2xl"
      >
        <div className="flex flex-col gap-0 items-start">
           <Motion.span
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
             className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A]"
           >
             Botanical Asset Management
           </Motion.span>
           <Motion.h1
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-4xl md:text-5xl lg:text-6xl leading-tight text-[#31332C] tracking-tight -ml-1"
           >
             Admin Dashboard
           </Motion.h1>
        </div>
      </Motion.div>

      {/* Primary Actions */}
      <Motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-4 items-center w-full lg:w-auto"
      >
        <Link to="/admin/promotions" className="border border-[#785A1A]/30 bg-white text-[#785A1A] px-6 md:px-8 py-3 font-label text-[11px] md:text-[12px] tracking-[1.2px] uppercase flex items-center justify-center gap-2 hover:bg-[#785A1A] hover:text-white transition-all transform hover:-translate-y-0.5 active:scale-95 flex-1 lg:flex-none">
           <span className="material-symbols-outlined text-[15px]">sell</span>
           Promotions
        </Link>
        <Link to="/admin/add-plant" className="bg-[#5F5E5E] text-[#FAF7F6] px-6 md:px-8 py-3 font-label text-[11px] md:text-[12px] tracking-[1.2px] uppercase flex items-center justify-center gap-2 hover:bg-[#31332C] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-black/5 flex-1 lg:flex-none">
           <span className="w-2 h-2 bg-[#FAF7F6] rounded-full"></span>
           Add Plant For Sale
        </Link>
        <button className="bg-[#E8E9E0] border border-[#797c73]/10 text-[#31332C] px-6 md:px-8 py-3 font-label text-[11px] md:text-[12px] tracking-[1.2px] uppercase hover:bg-[#dbddd0] transition-all transform hover:-translate-y-0.5 active:scale-95 flex-1 lg:flex-none">
           Generate Report
        </button>
      </Motion.div>
    </div>
  );
};

export default ArchiveHeader;
